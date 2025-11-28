import express from "express";
import Letter from "../models/Letter.js";

const router = express.Router();

// 获取所有信件
router.get("/", async (req, res) => {
  try {
    const letters = await Letter.find().sort({ _id: -1 });
    res.json({ letters });
  } catch (err) {
    res.status(500).json({ message: "获取失败" });
  }
});

// 上传信件
router.post("/", async (req, res) => {
  try {
    const letter = await Letter.create(req.body);
    res.json({ message: "上传成功", letter });
  } catch (err) {
    res.status(400).json({ message: "创建失败" });
  }
});

// 获取单封信
router.get("/:id", async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.id);
    if (!letter) {
      return res.status(404).json({ message: "信件不存在" });
    }
    res.json({ letter });
  } catch (err) {
    res.status(500).json({ message: "获取失败" });
  }
});

export default router;
