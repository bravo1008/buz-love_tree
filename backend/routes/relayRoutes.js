import express from "express";
import Relay from "../models/Relay.js";

const router = express.Router();

// 获取所有寄语
router.get("/", async (req, res) => {
  const msgs = await Relay.find().sort({ _id: -1 });
  res.json(msgs);
});

// 发布寄语
router.post("/", async (req, res) => {
  const relay = new Relay(req.body);
  await relay.save();
  res.json({ success: true });
});

export default router;
