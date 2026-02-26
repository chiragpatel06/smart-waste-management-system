import express from "express";
import upload from "../middleware/upload.js";
import { createReport } from "../controllers/reportController.js";

const router = express.Router();

router.post("/", upload.single("photo"), createReport);

export default router;