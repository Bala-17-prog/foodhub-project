import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxxx',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'xxxxxxxxxxxxxxxxxxxx',
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  try {
    console.log('=== CREATE RAZORPAY ORDER DEBUG ===');
    console.log('Request body:', req.body);
    console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID);
    console.log('Razorpay Key Secret exists:', !!process.env.RAZORPAY_KEY_SECRET);
    
    const { amount, currency = 'INR' } = req.body;

    if (!amount) {
      console.error('Amount is missing in request');
      return res.status(400).json({ message: 'Amount is required' });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise for INR)
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    console.log('Creating order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created successfully:', order.id);

    res.status(201).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    });
  } catch (error) {
    console.error('=== RAZORPAY ORDER CREATION ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    
    // Check if it's a Razorpay authentication error
    if (error.statusCode === 401) {
      console.error('❌ RAZORPAY AUTHENTICATION FAILED');
      console.error('Your Razorpay API keys are invalid or have expired.');
      console.error('Please check your keys at: https://dashboard.razorpay.com/app/keys');
      console.error('Current Key ID:', process.env.RAZORPAY_KEY_ID);
      return res.status(401).json({
        message: 'Razorpay authentication failed. Please check your API keys.',
        error: 'Invalid or expired Razorpay credentials',
      });
    }
    
    res.status(500).json({
      message: 'Failed to create payment order',
      error: error.message || 'Unknown error',
    });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payment/verify
// @access  Private
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification details' });
    }

    // Create signature for verification
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'xxxxxxxxxxxxxxxxxxxx')
      .update(sign.toString())
      .digest('hex');

    // Compare signatures
    if (razorpay_signature === expectedSign) {
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      message: 'Payment verification failed',
      error: error.message,
    });
  }
};

// @desc    Get Razorpay Key ID for frontend
// @route   GET /api/payment/key
// @access  Public
export const getRazorpayKey = (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxxxxxx',
  });
};
