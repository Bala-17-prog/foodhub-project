import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

console.log('=== TESTING RAZORPAY CREDENTIALS ===\n');

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

console.log('Key ID:', keyId);
console.log('Key Secret:', keySecret ? `${keySecret.substring(0, 5)}...${keySecret.substring(keySecret.length - 5)}` : 'NOT FOUND');
console.log('\nAttempting to create test order...\n');

const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});

try {
  const order = await razorpay.orders.create({
    amount: 50000, // ₹500 in paise
    currency: 'INR',
    receipt: 'test_receipt_' + Date.now(),
    payment_capture: 1,
  });

  console.log('✅ SUCCESS! Razorpay credentials are working correctly.');
  console.log('Test Order Created:');
  console.log('  Order ID:', order.id);
  console.log('  Amount:', order.amount / 100, 'INR');
  console.log('  Status:', order.status);
  console.log('\nYour Razorpay integration is configured correctly! 🎉');
} catch (error) {
  console.error('❌ ERROR: Razorpay authentication failed\n');
  console.error('Error Code:', error.statusCode);
  console.error('Error Details:', error.error);
  console.error('\n⚠️  SOLUTION:');
  console.error('1. Go to: https://dashboard.razorpay.com/app/keys');
  console.error('2. Copy your Test Key ID and Key Secret');
  console.error('3. Update these values in Backend/.env file:');
  console.error('   RAZORPAY_KEY_ID=your_key_id_here');
  console.error('   RAZORPAY_KEY_SECRET=your_key_secret_here');
  console.error('4. Make sure there are no spaces or quotes around the keys');
  console.error('5. Restart the backend server');
}
