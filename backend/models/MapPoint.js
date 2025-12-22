// models/Star.js
import mongoose from "mongoose";

const StarSchema = new mongoose.Schema({
  province: { type: String, required: true },
  city: { type: String }, // 可选
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  size: { type: String, enum: ["small", "medium"], default: "small" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Star", StarSchema);