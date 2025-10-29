import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// PUBLIC: Register only user or restaurant
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Only allow "user" or "restaurant" roles for public registration
    if (role && !["user", "restaurant"].includes(role)) {
      return res.status(403).json({ message: "Invalid role for registration" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Don't hash password here - let the User model's pre-save hook handle it
    const user = await User.create({
      name,
      email,
      password, // Pass plaintext password - model will hash it
      role: role || "user", // default role
    });

    // If registering as restaurant, create a Restaurant document
    if (role === "restaurant") {
      await Restaurant.create({
        owner: user._id,
        name: name, // Use user's name as initial restaurant name
        description: "",
        address: "",
        cuisine: [],
        openingHours: "",
        phone: "",
        image: "",
        status: "pending", // Requires admin approval
        isActive: true
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    console.log('=== LOGIN CONTROLLER ===');
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('Comparing passwords...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Login failed: Password mismatch');
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log('Login successful for:', user.email);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('=== LOGIN CONTROLLER ERROR ===');
    console.error('Error:', err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};
