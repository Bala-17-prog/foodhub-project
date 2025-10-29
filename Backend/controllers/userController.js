// controllers/userController.js
import User from "../models/User.js";

// ✅ Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// ✅ Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

// ✅ Update user profile (self only)
export const updateUser = async (req, res) => {
  try {
    const { name, email, address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, address },
      { new: true }
    ).select("-password");
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

// ✅ Delete user (admin or self)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Allow delete only if admin or the same user
    if (req.user.role !== "admin" && req.user.id !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
