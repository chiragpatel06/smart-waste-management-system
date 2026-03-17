import mongoose from "mongoose";

const collectorSchema = new mongoose.Schema({
  name: String,
  phone: String,
  area: String,
  status: {
    type: String,
    default: "Available"
  }
}, { timestamps: true });

export default mongoose.model("Collector", collectorSchema);