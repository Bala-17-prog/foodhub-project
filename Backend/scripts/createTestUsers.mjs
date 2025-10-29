import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import bcrypt from 'bcryptjs';

dotenv.config();

(async () => {
  try {
    await connectDB();

    const users = [
      { name: 'Test User', email: 'user@test.com', password: 'password123', role: 'user' },
      { name: 'Restaurant Owner', email: 'restaurant@test.com', password: 'password123', role: 'restaurant' },
      { name: 'Admin User', email: 'admin@test.com', password: 'password123', role: 'admin' },
    ];

    for (const u of users) {
      let user = await User.findOne({ email: u.email });
      if (user) {
        console.log(`User exists: ${u.email} - updating password`);
        // Set plaintext password so pre-save hook will hash it
        user.password = u.password;
        user.role = u.role;
        await user.save();
      } else {
        // Create with plaintext password; model pre-save will hash it
        user = new User({ name: u.name, email: u.email, password: u.password, role: u.role });
        await user.save();
        console.log(`Created user: ${u.email}`);
      }

      if (u.role === 'restaurant') {
        let rest = await Restaurant.findOne({ owner: user._id });
        if (!rest) {
          rest = await Restaurant.create({ owner: user._id, name: 'Demo Restaurant', description: 'Demo', address: '', cuisine: [], status: 'approved', isActive: true });
          console.log(`Created restaurant for ${u.email}: ${rest._id}`);
        } else {
          console.log(`Restaurant already exists for ${u.email}`);
        }
      }
    }

    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();