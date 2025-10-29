import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  image: String,
  available: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Food", foodSchema);
