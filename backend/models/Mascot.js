import mongoose from "mongoose";

const MascotSchema = new mongoose.Schema({
  imageUrl: String,
  textPrompt: String,
  likes: { type: Number, default: 0 },
  createdAt: Date,
  deviceId: { type: String, required: true },
});

export default mongoose.model("Mascot", MascotSchema);
