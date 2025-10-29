import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

(async ()=>{
  await connectDB();
  const user = await User.findOne({ email: 'restaurant@test.com' }).lean();
  if (!user) { console.log('User not found'); process.exit(1); }
  console.log('Stored hash:', user.password);
  const ok = await bcrypt.compare('password123', user.password);
  console.log('bcrypt compare result:', ok);
  process.exit(0);
})();