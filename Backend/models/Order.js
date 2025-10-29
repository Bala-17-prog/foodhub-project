import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  name: String,
  qty: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  orderItems: [orderItemSchema],
  shippingAddress: String,
  paymentMethod: String,
  itemsPrice: Number,
  taxPrice: Number,
  deliveryPrice: Number,
  totalPrice: Number,
  status: { type: String, enum: ["pending", "preparing", "out-for-delivery", "delivered", "cancelled"], default: "pending" },
  paidAt: Date
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
