import Restaurant from "../models/Restaurant.js";

export const createRestaurant = async (req, res) => {
  const owner = req.user._id;
  const { name, description, address, cuisine } = req.body;
  const r = await Restaurant.create({ owner, name, description, address, cuisine });
  res.status(201).json(r);
};

export const getRestaurantById = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  res.json(restaurant);
};

export const listRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find({});
  res.json(restaurants);
};

// Get restaurant for logged-in owner
export const getMyRestaurant = async (req, res) => {
  try {
    console.log('=== GET MY RESTAURANT ===');
    console.log('User ID:', req.user._id);
    console.log('User Role:', req.user.role);
    
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    
    console.log('Restaurant found:', restaurant ? 'Yes' : 'No');
    if (restaurant) {
      console.log('Restaurant ID:', restaurant._id);
      console.log('Restaurant Name:', restaurant.name);
    }
    
    if (!restaurant) {
      console.log('❌ No restaurant found for owner:', req.user._id);
      return res.status(404).json({ message: "Restaurant not found" });
    }
    
    res.json(restaurant);
  } catch (err) {
    console.error('=== GET MY RESTAURANT ERROR ===');
    console.error(err);
    res.status(500).json({ message: "Error fetching restaurant" });
  }
};

// Update restaurant (restaurant owner or admin)
export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const restaurant = await Restaurant.findById(id);
    
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    
    // Check if user owns this restaurant (unless admin)
    if (req.user.role === 'restaurant' && restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this restaurant" });
    }
    
    // Update fields
    Object.keys(updates).forEach(key => {
      if (key !== 'owner' && key !== 'approved') { // Prevent changing owner or approval status
        restaurant[key] = updates[key];
      }
    });
    
    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating restaurant" });
  }
};

// Approve restaurant (admin only)
export const approveRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    
    const restaurant = await Restaurant.findById(id);
    
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    
    restaurant.status = "approved";
    await restaurant.save();
    
    res.json({ message: "Restaurant approved successfully", restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error approving restaurant" });
  }
};

// Reject restaurant (admin only)
export const rejectRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    
    const restaurant = await Restaurant.findById(id);
    
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    
    restaurant.status = "rejected";
    await restaurant.save();
    
    res.json({ message: "Restaurant rejected", restaurant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error rejecting restaurant" });
  }
};
