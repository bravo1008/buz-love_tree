import mongoose from "mongoose";

const RelaySchema = new mongoose.Schema({
  name: String,
  years: String,
  disease: String,
  identity: String,
  text: String,
  date: String,
  likes: Number,
  color: String,
});

export default mongoose.model("Relay", RelaySchema);
