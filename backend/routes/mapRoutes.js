// routes/mapRoutes.js
import express from "express";
import MapPoint from "../models/MapPoint.js";
import { getCoordinates } from "../utils/geocode.js"; // 替换 geocode

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const points = await MapPoint.find();
    res.json(points);
  } catch (err) {
    console.error("Get all points error:", err);
    res.status(500).json({ error: "服务器内部错误" });
  }
});

router.post("/add", async (req, res) => {
  const { country, province } = req.body;

  if (!country || !province) {
    return res.status(400).json({ error: "国家和省份不能为空" });
  }

  try {
    // 直接查本地坐标表
    const coords = getCoordinates(country, province);
    if (!coords) {
      return res.status(400).json({ error: "暂不支持该国家或省份，请选择列表中的选项" });
    }

    let point = await MapPoint.findOne({ country, province });
    if (point) {
      point.count += 1;
      await point.save();
    } else {
      point = new MapPoint({
        country,
        province,
        lat: coords[0],
        lng: coords[1],
        count: 1
      });
      await point.save();
    }

    const allPoints = await MapPoint.find();
    res.json(allPoints);
  } catch (err) {
    console.error("Add location error:", err);
    res.status(500).json({ error: "添加位置失败" });
  }
});

export default router;