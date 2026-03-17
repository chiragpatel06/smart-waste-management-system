import express from "express";
import Collector from "../models/Collector.js";

const router = express.Router();

/* ADD COLLECTOR */
router.post("/", async (req, res) => {
  try {
    const collector = new Collector(req.body);
    await collector.save();

    res.json({ message: "Collector added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding collector" });
  }
});

/* GET ALL COLLECTORS */
router.get("/", async (req, res) => {
  try {
    const collectors = await Collector.find().sort({ createdAt: -1 });
    res.json(collectors);
  } catch (error) {
    res.status(500).json({ error: "Error fetching collectors" });
  }
});

router.put("/:id", async (req, res) => {
  try {

    const collector = await Collector.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Collector updated",
      collector
    });

  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
});
/* DELETE COLLECTOR */
router.delete("/:id", async (req, res) => {
  try {
    await Collector.findByIdAndDelete(req.params.id);
    res.json({ message: "Collector deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting collector" });
  }
});

export default router;