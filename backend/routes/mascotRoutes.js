// FILE: routes/mascot.js
import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import Mascot from "../models/Mascot.js";

const router = express.Router();

// =======================
// 0. multer：接收音频（内存）
// =======================
const upload = multer({ storage: multer.memoryStorage() });

// =======================
// ① 阿里云 qwen3-asr-flash 语音识别（本地上传 → base64）
// =======================
// FILE: routes/mascot.js (或 mascotRoutes.js)

async function speechToText(buffer) {
  const apiKey = process.env.TYQW_API2_KEY;
  if (!apiKey) {
    throw new Error("未配置 TYQW_API2_KEY（用于语音识别）");
  }

  // 假设你上传的是 WAV 格式（非常重要！）
  // 如果是 MP3，需改为 format: "mp3"
  const audioBase64 = buffer.toString("base64");

  try {
    const res = await axios.post(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/asr/transcription",
      {
        model: "paraformer-realtime-v1", // 或 "paraformer-v1"
        input: {
          audio: audioBase64
        },
        parameters: {
          format: "wav",       // ⚠️ 必须与实际音频格式一致
          sample_rate: 16000,  // 采样率：WAV 通常是 16000 或 8000
          language: "zh-CN"    // 中文识别
        }
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    // 提取识别结果
    const text = res.data?.output?.results?.[0]?.text || "";
    console.log("✅ ASR 识别结果:", text);
    return text;
  } catch (err) {
    console.error("❌ ASR 请求失败:", err.response?.data || err.message);
    throw new Error("语音识别失败");
  }
}


// =======================
// ② 文本 → 吉祥物图片（文生图）
// =======================
async function generateMascotImage(text) {
  const apiKey = process.env.TYQW_API2_KEY;
  const baseUrl =
    process.env.TYQW_BASE2_URL ||
    "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation";

  if (!apiKey || !baseUrl) {
    console.warn("⚠️ 通义万相 API Key 或 Base URL 未配置，将返回空图");
    return "";
  }

  const prompt = `请根据以下语音内容生成一个原创吉祥物角色插画：
内容：${text}
风格要求：可爱、温暖、有性格、颜色柔和，适合在活动中展示。`;

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
        parameters: {
          size: "1024*1024",
          prompt_extend: true,
          watermark: true
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
// ③ 主流程：音频 → 文本 → 吉祥物
// =======================
router.post("/from-audio", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "未收到音频文件" });
  }

  try {
    const buffer = req.file.buffer;

    // ① 音频 → 文本
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

router.get("/test", (req, res) =>
  res.send("🎉 吉祥物语音 → 文本 → 图像接口正常")
);

// FILE: routes/mascot.js （追加以下代码）

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
