// FILE: routes/mascot.js
import express from "express";
import multer from "multer";
import axios from "axios";
import Mascot from "../models/Mascot.js";

const router = express.Router();

// =======================
// 0. multer：接收音频（内存）
// =======================
const upload = multer({ storage: multer.memoryStorage() });

// =======================
// ① 【修改】百度语音识别API (短语音识别REST API)
// =======================
async function speechToText(buffer) {
  // 从环境变量获取百度API凭证[1](@ref)[5](@ref)
  const BAIDU_API_KEY = process.env.BAIDU_API_KEY;
  const BAIDU_SECRET_KEY = process.env.BAIDU_SECRET_KEY;

  if (!BAIDU_API_KEY || !BAIDU_SECRET_KEY) {
    console.error("❌ 环境变量未配置: BAIDU_API_KEY或BAIDU_SECRET_KEY");
    throw new Error("未配置 BAIDU_API_KEY 或 BAIDU_SECRET_KEY（用于百度语音识别）");
  }

  // 1. 获取Access Token (令牌有效期通常为30天，建议缓存)[1](@ref)[8](@ref)
  let accessToken;
  try {
    // 修正URL：移除多余空格，使用正确的参数名[6](@ref)
    const tokenUrl = ` https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`;
    
    console.log("正在获取Access Token...");
    console.log("Token请求URL:", tokenUrl.replace(BAIDU_SECRET_KEY, '***隐藏***'));
    
    // 使用GET请求获取token，这是百度官方推荐的方式[1](@ref)[5](@ref)
    const tokenRes = await axios.get(tokenUrl, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (!tokenRes.data.access_token) {
      console.error("❌ Token响应异常:", tokenRes.data);
      throw new Error("获取百度Access Token失败：响应格式异常");
    }
    
    accessToken = tokenRes.data.access_token;
    console.log("✅ Access Token获取成功，有效期:", tokenRes.data.expires_in, "秒");
  } catch (err) {
    console.error("❌ 获取百度Token失败:", err.response?.data || err.message);
    
    // 根据错误码文档，3302表示鉴权失败[1](@ref)
    if (err.response?.data?.error === 'invalid_client') {
      console.error("❌ 鉴权失败详情:", {
        error: err.response.data.error,
        error_description: err.response.data.error_description,
        api_key: BAIDU_API_KEY ? "已配置" : "未配置",
        secret_key: BAIDU_SECRET_KEY ? "已配置" : "未配置"
      });
      throw new Error("API Key或Secret Key无效，请检查百度智能云控制台配置");
    }
    
    // 处理SSL证书验证失败的情况[2](@ref)
    if (err.message.includes('CERTIFICATE_VERIFY_FAILED') || err.message.includes('SSL')) {
      console.error("❌ SSL证书验证失败，请检查网络配置");
      throw new Error("SSL证书验证失败，请检查网络配置");
    }
    
    throw new Error(`语音识别服务认证失败: ${err.message}`);
  }

  // 2. 准备请求参数
  // 注意：百度API对音频格式有严格要求[1](@ref)[6](@ref)
  // - 格式：wav, pcm, amr, m4a等[1](@ref)
  // - 采样率：16000或8000[1](@ref)[6](@ref)
  // - 声道：单声道[1](@ref)
  // - 音频长度：不超过60秒[1](@ref)
  const audioBase64 = buffer.toString('base64');
  
  // 修正请求参数：根据百度文档添加dev_pid参数[6](@ref)
  const requestData = {
    format: 'wav',       // 音频格式，支持 wav, pcm, amr, m4a 等[1](@ref)
    rate: 16000,         // 采样率，固定值16000或8000[1](@ref)[6](@ref)
    channel: 1,          // 声道数，1表示单声道[1](@ref)
    cuid: 'love_tree_app', // 用户唯一标识，可自定义[6](@ref)
    token: accessToken,
    speech: audioBase64,
    len: buffer.length,  // 原始音频数据长度[1](@ref)
    dev_pid: 1537        // 普通话输入法模型，非常重要！[6](@ref)
  };

  // 3. 调用百度语音识别API
  try {
    console.log("正在调用百度语音识别API...");
    const asrRes = await axios.post(
      ' https://vop.baidu.com/server_api',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );

    const resultData = asrRes.data;
    
    // 4. 处理响应 - 添加防御性编程[6](@ref)
    if (resultData.err_no === 0) {
      // 成功，提取识别文本 - 使用安全访问方式[6](@ref)
      const text = resultData.result && Array.isArray(resultData.result) 
        ? resultData.result[0] 
        : '';
      console.log("✅ 百度ASR识别结果:", text);
      return text;
    } else {
      // 失败，根据错误码提供具体信息[1](@ref)
      console.error("❌ 百度ASR识别错误:", {
        error_code: resultData.err_no,
        error_msg: resultData.err_msg
      });
      
      // 根据错误码提供具体建议[1](@ref)
      let errorMessage = `语音识别失败: ${resultData.err_msg} (错误码: ${resultData.err_no})`;
      switch(resultData.err_no) {
        case 3300:
          errorMessage += " - 输入参数不正确，请检查音频格式和参数";
          break;
        case 3301:
          errorMessage += " - 音频质量过差，请上传清晰的音频[4](@ref)";
          break;
        case 3302:
          errorMessage += " - 鉴权失败，请检查API_KEY和SECRET_KEY";
          break;
        case 3308:
          errorMessage += " - 音频过长，请将音频截取为60秒以下";
          break;
        case 3309:
          errorMessage += " - 音频数据问题，请检查音频格式和编码";
          break;
        case 3312:
          errorMessage += " - 音频格式参数错误，仅支持pcm、wav或amr";
          break;
      }
      
      throw new Error(errorMessage);
    }
  } catch (err) {
    console.error("❌ 百度ASR请求失败:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    
    // 处理特定错误[1](@ref)[3](@ref)
    if (err.response?.data?.err_no === 110) {
      throw new Error("Access Token失效，请重新获取[3](@ref)");
    }
    if (err.response?.data?.err_no === 111) {
      throw new Error("Access Token过期，请重新获取[3](@ref)");
    }
    
    throw new Error(`语音识别网络请求失败: ${err.message}`);
  }
}

// =======================
// ② 文本 → 吉祥物图片（文生图）- 修改版
// =======================
async function generateMascotImage(text) {
  const apiKey = process.env.TYQW_API2_KEY;
  const baseUrl =
    process.env.TYQW_BASE2_URL ||
    " https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation ";

  if (!apiKey || !baseUrl) {
    console.warn("⚠️ 通义万相 API Key 或 Base URL 未配置，将返回空图");
    return "";
  }

  // 优化提示词，明确要求背景透明和吉祥物风格
  const prompt = `请根据以下语音内容生成一个原创吉祥物角色插画：
内容：${text}

要求：
1. 生成可爱的卡通吉祥物角色，2D一些，平面一点，不用立体，并且吉祥物与中华传统文化相结合，例如貔貅、葫芦等
2. 背景完全透明（透明背景，背景是透明或者白色的）
3. 风格：温暖、柔和、有性格
4. 像平面贴纸一样扁平，或者类似于简笔画
5. 颜色柔和，线条简洁`;

  try {
    const resp = await axios.post(
      baseUrl,
      {
        model: "qwen-image-plus",
        input: {
          messages: [
            {
              role: "user",
              content: [{ text: prompt }]
            }
          ]
        },
        // 修改尺寸参数为支持的格式[7](@ref)
        parameters: {
          size: "1024*1024",  // 改为支持的默认尺寸[7](@ref)
          prompt_extend: true,
          watermark: true,
          // 可选：添加风格参数以获得更一致的效果[7](@ref)
          style: "<flat illustration>"  // 扁平插画风格，适合吉祥物
        }
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        timeout: 90000
      }
    );

    const choice = resp.data?.output?.choices?.[0];
    const imageField = choice?.message?.content?.find?.((x) => x.image);

    return imageField?.image || "";
  } catch (err) {
    console.error("❌ 吉祥物图生成失败：", err.response?.data || err.message);
    
    // 如果是尺寸参数错误，尝试其他支持的尺寸
    if (err.response?.data?.code === 'InvalidParameter' && 
        err.response?.data?.message?.includes('size does not match')) {
      console.log("尝试使用其他支持的尺寸...");
      
      // 根据错误信息中列出的支持尺寸，尝试其他选项
      const supportedSizes = [
        "1664*928", "1472*1140", "1328*1328", "1140*1472", "928*1664"
      ];
      
      // 尝试第一个支持的尺寸
      try {
        const retryResp = await axios.post(
          baseUrl,
          {
            model: "qwen-image-plus",
            input: {
              messages: [
                {
                  role: "user",
                  content: [{ text: prompt }]
                }
              ]
            },
            parameters: {
              size: supportedSizes[2], // 使用1328*1328
              prompt_extend: true,
              watermark: true,
              style: "<flat illustration>"
            }
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            timeout: 90000
          }
        );
        
        const retryChoice = retryResp.data?.output?.choices?.[0];
        const retryImageField = retryChoice?.message?.content?.find?.((x) => x.image);
        
        return retryImageField?.image || "";
      } catch (retryErr) {
        throw new Error(`吉祥物生成失败（尺寸调整后）：${retryErr.message}`);
      }
    }
    
    throw new Error("吉祥物生成失败");
  }
}


// =======================
// ③ 主流程：音频 → 文本 → 吉祥物
// =======================
router.post("/from-audio", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "未收到音频文件" });
  }

  try {
    const buffer = req.file.buffer;
    
    // 检查音频长度（百度限制60秒）[1](@ref)
    if (buffer.length > 60 * 16000 * 2) { // 粗略估算：60秒 * 16000采样率 * 2字节
      return res.status(400).json({ 
        success: false, 
        error: "音频过长，请限制在60秒以内" 
      });
    }

    // ① 音频 → 文本 (现在调用的是百度API)
    const text = await speechToText(buffer);

    // ② 文本 → 吉祥物图片
    const imageUrl = await generateMascotImage(text);

    // ③ 写入数据库
    const mascot = await Mascot.create({
      textPrompt: text,
      imageUrl,
      createdAt: new Date()
    });

    res.json({ success: true, mascot });
  } catch (err) {
    console.error("主流程失败:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// =======================
// ④ 测试接口：验证百度API配置
// =======================
router.get("/test-baidu", async (req, res) => {
  try {
    const BAIDU_API_KEY = process.env.BAIDU_API_KEY;
    const BAIDU_SECRET_KEY = process.env.BAIDU_SECRET_KEY;
    
    if (!BAIDU_API_KEY || !BAIDU_SECRET_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: "环境变量未配置",
        api_key: BAIDU_API_KEY ? "已配置" : "未配置",
        secret_key: BAIDU_SECRET_KEY ? "已配置" : "未配置"
      });
    }
    
    // 测试获取Access Token
    const tokenUrl = ` https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=$ {BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`;
    
    const tokenRes = await axios.get(tokenUrl, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (tokenRes.data.access_token) {
      return res.json({ 
        success: true, 
        message: "百度API配置正常",
        token_valid: true,
        expires_in: tokenRes.data.expires_in
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        error: "获取Token失败",
        response: tokenRes.data
      });
    }
  } catch (err) {
    console.error("百度API测试失败:", err.response?.data || err.message);
    return res.status(500).json({ 
      success: false, 
      error: "百度API测试失败",
      details: err.response?.data || err.message
    });
  }
});

router.get("/test", (req, res) =>
  res.send("🎉 吉祥物语音 → 文本 → 图像接口正常")
);

// =======================
// ④ 获取所有吉祥物（按点赞数排序）
// =======================
router.get("/", async (req, res) => {
  try {
    const mascots = await Mascot.find().sort({ likes: -1 });
    res.json({ success: true, mascots });
  } catch (err) {
    console.error("获取吉祥物列表失败:", err);
    res.status(500).json({ success: false, error: "获取失败" });
  }
});

// =======================
// ④ 获取最新吉祥物（按时间排序）
// =======================
router.get("/latest", async (req, res) => {
  try {
    const latest = await Mascot.findOne().sort({ createdAt: -1 });
    if (latest) {
      res.json({ success: true, mascot: latest });
    } else {
      res.json({ success: false, error: "暂无吉祥物" });
    }
  } catch (err) {
    console.error("获取最新吉祥物失败:", err);
    res.status(500).json({ success: false, error: "服务器错误" });
  }
});

// =======================
// ⑤ 点赞接口
// =======================
router.patch("/:id/like", async (req, res) => {
  try {
    const mascot = await Mascot.findById(req.params.id);
    if (!mascot) {
      return res.status(404).json({ success: false, error: "吉祥物不存在" });
    }

    mascot.likes += 1;
    await mascot.save();

    res.json({ success: true, likes: mascot.likes });
  } catch (err) {
    console.error("点赞失败:", err);
    res.status(500).json({ success: false, error: "点赞失败" });
  }
});

export default router;
