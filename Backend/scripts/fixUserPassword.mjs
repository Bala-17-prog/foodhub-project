import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const fixUserPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Get user email and new password from command line arguments
    const email = process.argv[2];
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
      console.log('Usage: node fixUserPassword.mjs <email> <password>');
      console.log('Example: node fixUserPassword.mjs sasi@gmail.com MyPassword123');
      process.exit(1);
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User with email ${email} not found`);
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user.email})`);
    console.log(`Current password hash: ${user.password.substring(0, 20)}...`);

    // Update password - the pre-save hook will hash it
    user.password = newPassword;
    await user.save();

    console.log('✅ Password updated successfully!');
    console.log(`You can now login with email: ${email} and the new password`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixUserPassword();
