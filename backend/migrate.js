import mongoose from "mongoose";
import User from "./models/User.js";
import Report from "./models/Report.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const users = await User.find();

for (let user of users) {
  await Report.updateMany(
    { email: user.email },
    { $set: { userId: user._id } }
  );
}

console.log("Migration Done ✅");
process.exit();