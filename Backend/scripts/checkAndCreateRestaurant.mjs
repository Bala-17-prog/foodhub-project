import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';

dotenv.config();

const checkRestaurantForUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const email = process.argv[2] || 'sasi@gmail.com';
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`✅ User found: ${user.name} (${user.email})`);
    console.log(`   Role: ${user.role}`);
    console.log(`   User ID: ${user._id}`);

    // Find restaurant
    const restaurant = await Restaurant.findOne({ owner: user._id });
    
    if (!restaurant) {
      console.log(`\n❌ No restaurant found for this user`);
      console.log(`\n🔧 Creating restaurant now...`);
      
      const newRestaurant = await Restaurant.create({
        owner: user._id,
        name: user.name,
        description: 'Welcome to our restaurant',
        address: user.address || 'Not specified',
        cuisine: ['Indian'],
        openingHours: '9am-10pm',
        phone: user.phone || '',
        image: '',
        status: 'approved',
        isActive: true
      });
      
      console.log(`✅ Restaurant created successfully!`);
      console.log(`   Restaurant ID: ${newRestaurant._id}`);
      console.log(`   Name: ${newRestaurant.name}`);
      console.log(`   Status: ${newRestaurant.status}`);
    } else {
      console.log(`\n✅ Restaurant found!`);
      console.log(`   Restaurant ID: ${restaurant._id}`);
      console.log(`   Name: ${restaurant.name}`);
      console.log(`   Status: ${restaurant.status}`);
      console.log(`   Image: ${restaurant.image || 'Not set'}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkRestaurantForUser();
