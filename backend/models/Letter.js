import mongoose from "mongoose";

const LetterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: String, required: true },
  color: { type: String, required: true },
  deviceId: { type: String, required: true }, 
});

export default mongoose.model("Letter", LetterSchema);
