import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfilePhoto,
  getAllUsers,
  deleteUser
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.delete("/:id", deleteUser);

// ✅ NEW ROUTES
router.get("/me", authMiddleware, getUserProfile);
router.put("/update", authMiddleware, updateUserProfile);
router.put("/change-password", authMiddleware, changePassword);
router.post("/upload-photo", authMiddleware, upload.single("profileImage"), uploadProfilePhoto);

export default router;