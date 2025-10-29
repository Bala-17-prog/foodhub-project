import Order from "../models/Order.js";
import Food from "../models/Food.js";
import Restaurant from "../models/Restaurant.js";

export const placeOrder = async (req, res) => {
  try {
    const { restaurantId, orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No items" });
    }

    // 🧠 Fetch actual food details from DB to prevent tampering
    const validatedItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
      const food = await Food.findById(item.food);
      if (!food) {
        return res.status(404).json({ message: `Food item not found: ${item.food}` });
      }

      // Calculate subtotal for this item
      const subtotal = food.price * item.qty;
      itemsPrice += subtotal;

      validatedItems.push({
        food: food._id,
        name: food.name,
        qty: item.qty,
        price: food.price, // use DB price, not client input
      });
    }

    // 💰 Calculate tax and total
    const taxPrice = +(itemsPrice * 0.05).toFixed(2);
    const deliveryPrice = 30;
    const totalPrice = itemsPrice + taxPrice + deliveryPrice;

    // 🛍️ Create order document
    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurantId,
      orderItems: validatedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      deliveryPrice,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Order placement failed:", err);
    res.status(500).json({ message: "Server error while placing order" });
  }
};

export const getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("restaurant", "name").populate("orderItems.food", "name");
  res.json(orders);
};

export const getOrdersForRestaurant = async (req, res) => {
  try {
    let restaurantId;
    
    // If user is a restaurant owner, find their restaurant ID
    if (req.user.role === 'restaurant') {
      const restaurant = await Restaurant.findOne({ owner: req.user._id });
      
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found for this user" });
      }
      
      restaurantId = restaurant._id;
    } else if (req.params.restaurantId) {
      // Admin can specify restaurantId in params
      restaurantId = req.params.restaurantId;
    } else {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }
    
    const orders = await Order.find({ restaurant: restaurantId })
      .populate("user", "name email phone")
      .populate("orderItems.food", "name")
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching restaurant orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await Order.findById(id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  order.status = status;  
  await order.save();
  res.json(order);
};

// Get all orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("restaurant", "name")
      .populate("orderItems.food", "name")
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching all orders" });
  }
};
