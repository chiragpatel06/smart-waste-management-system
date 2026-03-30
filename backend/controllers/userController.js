import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



// ================= GET PROFILE =================
import Report from "../models/Report.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = req.user;

    // 🔥 REPORT COUNT
    const totalReports = await Report.countDocuments({ userId: user._id });

    // 🔥 COMPLETED
    const completed = await Report.countDocuments({
      email: user.email,
      status: "Collected"
    });

    // 🔥 PENDING
    const pending = await Report.countDocuments({
      email: user.email,
      status: "Pending"
    });

    res.json({
      ...user._doc,
      stats: {
        reports: totalReports,
        pickups: completed,
        areas: pending
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
// ================= UPDATE PROFILE =================
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, address },
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong current password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error changing password" });
  }
};

// ================= UPLOAD PROFILE PHOTO =================
export const uploadProfilePhoto = async (req, res) => {
  try {
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: imageUrl },
      { new: true }
    );

    res.json({ url: imageUrl });

  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
};
















// ================= REGISTER USER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;

    // Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully ✅",
      userId: user._id,
    });

  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};



// ================= LOGIN USER =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profileImage: user.profileImage, // ✅ ADD THIS
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};