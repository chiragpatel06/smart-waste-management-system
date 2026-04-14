import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";

export const createAdmin = async (req, res) => {
    try {
        // Clear existing to fix any manual plain-text entries
        await Admin.findOneAndDelete({ email: "admin@gmail.com" });

        const hashedPassword = await bcrypt.hash("admin123", 10);

        const admin = new Admin({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashedPassword
        });

        await admin.save();

        res.json({ message: "Admin created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};