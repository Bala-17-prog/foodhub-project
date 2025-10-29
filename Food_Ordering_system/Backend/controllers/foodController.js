import Food from "../models/Food.js";
import Restaurant from "../models/Restaurant.js";

export const createFood = async (req, res) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;
    
    let restaurantId;
    
    // If user is a restaurant owner, find their restaurant ID
    if (req.user.role === 'restaurant') {
      const restaurant = await Restaurant.findOne({ owner: req.user._id });
      
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found for this user" });
      }
      
      restaurantId = restaurant._id;
    } else if (req.body.restaurantId) {
      // Admin can specify restaurantId in body
      restaurantId = req.body.restaurantId;
    } else {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }
    
    const item = await Food.create({
      restaurant: restaurantId,
      name,
      description,
      price,
      category,
      image: image || "",
      available: isAvailable !== undefined ? isAvailable : true
    });
    
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating food item" });
  }
};

export const getFoods = async (req, res) => {
  const { q, category, restaurant } = req.query;
  const filter = {};
  if (q) filter.name = { $regex: q, $options: "i" };
  if (category) filter.category = category;
  if (restaurant) filter.restaurant = restaurant;
  const foods = await Food.find(filter).populate("restaurant", "name");
  res.json(foods);
};
// ✅ Get foods for the logged-in restaurant/admin
export const getMyFoods = async (req, res) => {
  try {
    console.log("User ID:", req.user._id);
    console.log("User role:", req.user.role);
    
    let restaurantId;
    
    // If user is a restaurant owner, find their restaurant ID
    if (req.user.role === 'restaurant') {
      const Restaurant = (await import('../models/Restaurant.js')).default;
      const restaurant = await Restaurant.findOne({ owner: req.user._id });
      
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found for this user" });
      }
      
      restaurantId = restaurant._id;
      console.log("Restaurant ID found:", restaurantId);
    } else {
      // For admin or other roles, use the user ID (or handle differently)
      restaurantId = req.user._id;
    }
    
    const foods = await Food.find({ restaurant: restaurantId }).populate("restaurant", "name");
    console.log("Fetched foods:", foods.length);
    res.json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching your foods" });
  }
};

// Update food item
export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image, isAvailable } = req.body;
    
    const food = await Food.findById(id).populate('restaurant');
    
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }
    
    // Check if user owns this food item
    if (req.user.role === 'restaurant') {
      const restaurant = await Restaurant.findOne({ owner: req.user._id });
      
      if (!restaurant || food.restaurant._id.toString() !== restaurant._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this food item" });
      }
    }
    
    // Update fields
    if (name) food.name = name;
    if (description !== undefined) food.description = description;
    if (price) food.price = price;
    if (category) food.category = category;
    if (image !== undefined) food.image = image;
    if (isAvailable !== undefined) food.available = isAvailable;
    
    await food.save();
    res.json(food);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating food item" });
  }
};

// Delete food item
export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    
    const food = await Food.findById(id).populate('restaurant');
    
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }
    
    // Check if user owns this food item
    if (req.user.role === 'restaurant') {
      const restaurant = await Restaurant.findOne({ owner: req.user._id });
      
      if (!restaurant || food.restaurant._id.toString() !== restaurant._id.toString()) {
        return res.status(403).json({ message: "Not authorized to delete this food item" });
      }
    }
    
    await Food.findByIdAndDelete(id);
    res.json({ message: "Food item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting food item" });
  }
};