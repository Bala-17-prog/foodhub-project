import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import restaurantRoutes from "./routes/restaurants.js";
import foodRoutes from "./routes/foods.js";
import orderRoutes from "./routes/orders.js";
import adminRoutes from "./routes/admin.js";
import paymentRoutes from "./routes/payment.js";
import dietPlanRoutes from "./routes/dietPlan.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n=== INCOMING REQUEST ===`);
  console.log(`${req.method} ${req.originalUrl}`);
  console.log('Headers:', req.headers.authorization ? 'Has Auth Token' : 'No Auth Token');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth/admin",adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/diet-plan", dietPlanRoutes);

app.get("/", (req, res) => res.send("Food Ordering API"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    