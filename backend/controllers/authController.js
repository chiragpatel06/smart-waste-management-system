import User from "../models/User.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check User collection
    let account = await User.findOne({ email });
    let isAdmin = false;

    // 2. If not found in User, check Admin collection
    if (!account) {
      account = await Admin.findOne({ email });
      if (account) {
        isAdmin = true;
      }
    }

    // 3. If still not found
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    // 4. Validate password
    const isMatched = await bcrypt.compare(password, account.password);
    if (!isMatched) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 5. Generate JWT Token
    const token = jwt.sign(
      { id: account._id, email: account.email, isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. Send response
    res.json({
      token,
      user: {
        id: account._id,
        name: account.name,
        email: account.email,
        phone: account.phone || "",
        address: account.address || "",
        profileImage: account.profileImage || ""
      },
      isAdmin
    });

  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};
