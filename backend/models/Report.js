import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    wasteType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    photo: {
      type: String, // store image URL
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);