// controllers/adminController.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await User.create({ name, email, password: hashedPassword, role: "admin" });

  res.status(201).json({ _id: admin._id, name: admin.name, email: admin.email, role: admin.role });
};
