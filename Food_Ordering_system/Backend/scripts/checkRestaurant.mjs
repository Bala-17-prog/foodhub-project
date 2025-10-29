import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';

dotenv.config();

(async () => {
  await connectDB();
  
  const user = await User.findOne({ email: 'restaurant@test.com' });
  if (!user) {
    console.log('User not found');
    process.exit(1);
  }
  
  console.log('User found:', user._id, user.email, user.role);
  
  const restaurant = await Restaurant.findOne({ owner: user._id });
  if (!restaurant) {
    console.log('Restaurant NOT FOUND for this user');
  } else {
    console.log('Restaurant found:');
    console.log('  ID:', restaurant._id);
    console.log('  Name:', restaurant.name);
    console.log('  Status:', restaurant.status);
    console.log('  Owner:', restaurant.owner);
  }
  
  process.exit(0);
})();
