// FILE: routes/mascot.js
import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data"; // 用于上传到 Cloudinary
import Mascot from "../models/Mascot.js";

const router = express.Router();

// =======================
// 0. multer：接收音频（内存）
// =======================
const upload = multer({ storage: multer.memoryStorage() });

// =======================
// 新增：将临时图片上传到 Cloudinary（持久化）
// =======================
async function persistImageToCloudinary(tempImageUrl) {
  if (!tempImageUrl) return "";

  const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    console.warn("⚠️ Cloudinary 未配置，无法持久化图片");
    return tempImageUrl; // 回退到临时链接（会过期）
  }

  try {
    // 1. 下载临时图片
    console.log("📥 正在下载临时图片...");
    const imageRes = await axios.get(tempImageUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
    });

    // 2. 构造 FormData 上传到 Cloudinary
    const formData = new FormData();
    formData.append("file", Buffer.from(imageRes.data), {
      filename: "mascot.png",
      contentType: "image/png",
    });
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    // 3. 上传
    console.log("☁️ 正在上传到 Cloudinary...");
    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: formData.getHeaders(),
        timeout: 60000,
      }
    );

    const permanentUrl = uploadRes.data.secure_url;
    console.log("✅ 图片已持久化:", permanentUrl);
    return permanentUrl;
  } catch (err) {
    console.error("❌ 图片持久化失败:", err.message || err);
    // 即使失败，也返回原链接（至少新图能看）
    return tempImageUrl;
  }
}

// =======================
// ① 百度语音识别（保持不变）
// =======================
async function speechToText(buffer) {
  const BAIDU_API_KEY = process.env.BAIDU_API_KEY;
  const BAIDU_SECRET_KEY = process.env.BAIDU_SECRET_KEY;

  if (!BAIDU_API_KEY || !BAIDU_SECRET_KEY) {
    throw new Error("未配置 BAIDU_API_KEY 或 BAIDU_SECRET_KEY");
  }

  let accessToken;
  try {
    // ⚠️ 修复：移除 URL 开头空格！
    const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`;
    
    const tokenRes = await axios.get(tokenUrl, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!tokenRes.data.access_token) {
      throw new Error("获取百度Access Token失败");
    }
    accessToken = tokenRes.data.access_token;
  } catch (err) {
    console.error("❌ 获取百度Token失败:", err.response?.data || err.message);
    throw new Error(`语音识别服务认证失败: ${err.message}`);
  }

  const audioBase64 = buffer.toString('base64');
  const requestData = {
    format: 'wav',
    rate: 16000,
    channel: 1,
    cuid: 'love_tree_app',
    token: accessToken,
    speech: audioBase64,
    len: buffer.length,
    dev_pid: 1537
  };

  try {
    // ⚠️ 修复：移除 URL 开头空格！
    const asrRes = await axios.post(
      'https://vop.baidu.com/server_api',
      requestData,
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      }
    );

    const resultData = asrRes.data;
    if (resultData.err_no === 0) {
      const text = resultData.result?.[0] || '';
      return text;
    } else {
      let msg = `语音识别失败: ${resultData.err_msg} (错误码: ${resultData.err_no})`;
      if (resultData.err_no === 3308) msg += " - 音频超过60秒";
      throw new Error(msg);
    }
  } catch (err) {
    throw new Error(`语音识别请求失败: ${err.message}`);
  }
}

// =======================
// ② 文本 → 吉祥物图片（保持不变，只返回临时链接）
// =======================
async function generateMascotImage(text) {
  const apiKey = process.env.TYQW_API2_KEY;
  const baseUrl = (process.env.TYQW_BASE2_URL || "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation").trim();

  if (!apiKey) {
    console.warn("⚠️ 通义万相 API Key 未配置");
    return "";
  }

  const prompt = `请根据以下语音内容生成一个原创吉祥物角色插画：
内容：${text}

要求：
1. 生成可爱的卡通吉祥物角色，2D一些，平面一点，不用立体，并且吉祥物与中华传统文化相结合，例如貔貅、葫芦等
2. 风格：温暖、柔和、有性格
3. 像平面贴纸一样扁平，或者类似于简笔画
4. 颜色柔和，线条简洁`;

  try {
    const resp = await axios.post(
      baseUrl,
      {
        model: "qwen-image-plus",
        input: {
          messages: [{ role: "user", content: [{ text: prompt }] }]
        },
        parameters: {
          size: "1024*1024",
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

    const choice = resp.data?.output?.choices?.[0];
    const imageField = choice?.message?.content?.find?.((x) => x.image);
    return imageField?.image || "";
  } catch (err) {
    console.error("❌ 吉祥物图生成失败：", err.response?.data || err.message);
    throw new Error("吉祥物生成失败");
  }
}

// =======================
// ③ 主流程：音频 → 文本 → 吉祥物（关键修改：持久化图片）
// =======================
router.post("/from-audio", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "未收到音频文件" });
  }

  const deviceId = req.headers["x-device-id"];
  if (!deviceId) {
    return res.status(400).json({ success: false, error: "缺少设备标识 x-device-id" });
  }

  try {
    const buffer = req.file.buffer;
    if (buffer.length > 60 * 16000 * 2) {
      return res.status(400).json({ 
        success: false, 
        error: "音频过长，请限制在60秒以内" 
      });
    }

    const text = await speechToText(buffer);
    const tempImageUrl = await generateMascotImage(text);
    
    // ✅ 关键：将临时图转为永久图
    const permanentImageUrl = await persistImageToCloudinary(tempImageUrl);

    const mascot = await Mascot.create({
      textPrompt: text,
      imageUrl: permanentImageUrl, // 👈 保存永久链接！
      deviceId,
      createdAt: new Date()
    });

    res.json({ success: true, mascot });
  } catch (err) {
    console.error("主流程失败:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// =======================
// 其他接口（保持不变）
// =======================

router.get("/test-baidu", async (req, res) => {
  try {
    const BAIDU_API_KEY = process.env.BAIDU_API_KEY;
    const BAIDU_SECRET_KEY = process.env.BAIDU_SECRET_KEY;
    if (!BAIDU_API_KEY || !BAIDU_SECRET_KEY) {
      return res.status(500).json({ success: false, error: "环境变量未配置" });
    }
    const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${BAIDU_API_KEY}&client_secret=${BAIDU_SECRET_KEY}`;
    const tokenRes = await axios.get(tokenUrl, { timeout: 10000 });
    if (tokenRes.data.access_token) {
      return res.json({ success: true, message: "百度API配置正常" });
    } else {
      return res.status(500).json({ success: false, error: "获取Token失败" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: "百度API测试失败" });
  }
});

router.get("/test", (req, res) =>
  res.send("🎉 吉祥物语音 → 文本 → 图像接口正常")
);

router.get("/", async (req, res) => {
  try {
    const mascots = await Mascot.find().sort({ likes: -1 });
    res.json({ success: true, mascots });
  } catch (err) {
    console.error("获取吉祥物列表失败:", err);
    res.status(500).json({ success: false, error: "获取失败" });
  }
});

router.get("/latest", async (req, res) => {
  const deviceId = req.headers["x-device-id"];
  if (!deviceId) {
    return res.status(400).json({ 
      success: false, 
      error: "缺少设备标识 x-device-id",
      mascot: { imageUrl: "/lucky.jpg" }
    });
  }

  try {
    const latest = await Mascot.findOne({ deviceId }).sort({ createdAt: -1 });
    if (latest) {
      res.json({ success: true, mascot: latest });
    } else {
      res.json({
        success: true,
        mascot: {
          _id: null,
          textPrompt: "暂无语音生成记录",
          likes: 0,
          deviceId,
          createdAt: null,
          imageUrl: "/lucky.jpg" // 添加占位图字段
        }
      });
    }
  } catch (err) {
    console.error("获取设备最新吉祥物失败:", err);
    res.status(500).json({ 
      success: false, 
      error: "服务器错误",
      mascot: { imageUrl: "/lucky.jpg" }
    });
  }
});

router.patch("/:id/like", async (req, res) => {
  try {
    const mascot = await Mascot.findById(req.params.id);
    if (!mascot) {
      return res.status(404).json({ success: false, error: "吉祥物不存在" });
    }
    mascot.likes += 1;
    await mascot.save({ validateBeforeSave: false });
    res.json({ success: true, likes: mascot.likes });
  } catch (err) {
    console.error("点赞失败:", err);
    res.status(500).json({ success: false, error: "点赞失败" });
  }
});

export default router;