import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: String,
  address: String,
  cuisine: [String],
  openingHours: String,
  phone: String,
  image: String,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Restaurant", restaurantSchema);

