// routes/starRoutes.js
import express from "express";
import Star from "../models/MapPoint.js";

const router = express.Router();

// 获取所有星星
router.get("/", async (req, res) => {
  try {
    const stars = await Star.find().sort({ createdAt: -1 });
    res.json(stars);
  } catch (err) {
    console.error("获取星星失败:", err);
    res.status(500).json({ error: "服务器内部错误" });
  }
});

// 添加新星星
router.post("/", async (req, res) => {
  const { province, city, lat, lng, size } = req.body;

  if (!province || lat == null || lng == null) {
    return res.status(400).json({ error: "缺少必要字段" });
  }

  try {
    const star = new Star({
      province,
      city: city?.trim() || null,
      lat,
      lng,
      size: size || "small"
    });

    await star.save();
    res.status(201).json(star);
  } catch (err) {
    console.error("添加星星失败:", err);
    res.status(500).json({ error: "保存失败，请重试" });
  }
});

export default router;