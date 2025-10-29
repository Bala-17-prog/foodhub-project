import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const email = process.argv[2];
if (!email) {
  console.error('Usage: node checkUser.mjs <email>');
  process.exit(1);
}

(async () => {
  try {
    await connectDB();
    const user = await User.findOne({ email }).lean();
    if (!user) {
      console.log('NOT_FOUND');
    } else {
      console.log(JSON.stringify(user, null, 2));
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(2);
  }
})();