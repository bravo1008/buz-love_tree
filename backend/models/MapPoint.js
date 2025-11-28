import mongoose from "mongoose";

const MapPointSchema = new mongoose.Schema({
  country: String,
  province: String,
  lat: Number,
  lng: Number,
  count: { type: Number, default: 1 }
});

export default mongoose.model("MapPoint", MapPointSchema);
