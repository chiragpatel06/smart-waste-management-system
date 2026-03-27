import express from "express";
import upload from "../middleware/upload.js";
import { createReport } from "../controllers/reportController.js";
import Report from "../models/Report.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

/* CREATE REPORT */
router.post("/", authMiddleware, upload.single("photo"), createReport);

/* GET USER REPORTS */
router.get("/my-reports", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({
      $or: [
        { userId: req.user._id },
        { email: req.user.email }
      ]
    }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports" });
  }
});

router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports" });
  }
});
router.put("/complete/:id", upload.single("cleanedPhoto"), async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status: "Collected",
        cleanedPhoto: req.file ? `/uploads/${req.file.filename}` : null
      },
      { new: true }
    );

    res.json(report);

  } catch (error) {
    res.status(500).json({ message: "Error updating report" });
  }
});

router.put("/assign/:id", async (req, res) => {

  const { collector } = req.body;

  console.log("Collector received:", collector);

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    {
      collector,
      status: "Assigned"
    },
    { new: true }
  );

  res.json(report);

});

export default router;