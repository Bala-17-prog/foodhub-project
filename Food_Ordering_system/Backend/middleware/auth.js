import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  
  console.log('=== PROTECT MIDDLEWARE DEBUG ===');
  console.log('Auth header:', authHeader);
  
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    console.log('Token found:', token ? 'Yes' : 'No');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded.id);
      
      req.user = await User.findById(decoded.id).select("-password");
      console.log('User found:', req.user ? req.user._id : 'No');
      
      next();
    } catch (err) {
      console.error('Token verification error:', err.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    console.error('No token provided or invalid format');
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
};
