import express from "express";
import Letter from "../models/Letter.js";

const router = express.Router();

// 获取当前设备的信件
router.get("/", async (req, res) => {
  const deviceId = req.headers["x-device-id"]; // 从请求头获取
  if (!deviceId) {
    return res.status(400).json({ message: "缺少设备标识" });
  }

  try {
    const letters = await Letter.find({ deviceId }).sort({ _id: -1 });
    res.json({ letters });
  } catch (err) {
    res.status(500).json({ message: "获取失败" });
  }
});

// 上传信件（绑定 deviceId）
router.post("/", async (req, res) => {
  const deviceId = req.headers["x-device-id"];
  if (!deviceId) {
    return res.status(400).json({ message: "缺少设备标识" });
  }

  try {
    const letter = await Letter.create({
      ...req.body,
      deviceId, // 👈 绑定设备 ID
    });
    res.json({ message: "上传成功", letter });
  } catch (err) {
    res.status(400).json({ message: "创建失败" });
  }
});

// 获取单封信（也需校验 deviceId，可选）
router.get("/:id", async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.id);
    if (!letter) {
      return res.status(404).json({ message: "信件不存在" });
    }

    // 可选：校验是否属于当前设备
    const deviceId = req.headers["x-device-id"];
    if (deviceId && letter.deviceId !== deviceId) {
      return res.status(403).json({ message: "无权访问此信件" });
    }

    res.json({ letter });
  } catch (err) {
    res.status(500).json({ message: "获取失败" });
  }
});

export default router;
