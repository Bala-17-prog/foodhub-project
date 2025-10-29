# Razorpay Payment Integration Guide

## Overview
This project now includes Razorpay payment gateway integration for secure online payments. Razorpay supports multiple payment methods including:
- Credit/Debit Cards
- UPI (Google Pay, PhonePe, Paytm, etc.)
- Net Banking
- Wallets (Paytm, PhonePe, Amazon Pay, etc.)

## Setup Instructions

### 1. Create Razorpay Account
1. Go to https://razorpay.com/
2. Click "Sign Up" and create an account
3. Complete the verification process
4. You'll start in **Test Mode** (perfect for development)

### 2. Get API Keys
1. Login to Razorpay Dashboard: https://dashboard.razorpay.com/
2. Go to **Settings** → **API Keys**
3. Click **Generate Test Keys** (or use existing keys)
4. You'll see:
   - **Key ID** (starts with `rzp_test_`)
   - **Key Secret** (click "Show" to reveal)

### 3. Configure Backend
1. Open `Backend/.env` file
2. Add your Razorpay keys:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx
```

### 4. Test Payment Flow

#### Test Mode Cards (provided by Razorpay):
- **Successful Payment:**
  - Card Number: `4111 1111 1111 1111`
  - CVV: Any 3 digits (e.g., `123`)
  - Expiry: Any future date (e.g., `12/25`)
  - Name: Any name

- **Failed Payment:**
  - Card Number: `4000 0000 0000 0002`
  - CVV: Any 3 digits
  - Expiry: Any future date

#### Test Mode UPI:
- UPI ID: `success@razorpay`
- This will simulate a successful payment

#### Test Mode NetBanking:
- Select any bank
- Use username: `test` and password: `test`

### 5. Verify Installation

Run the backend server:
```bash
cd Backend
npm start
```

The server should start without errors. Check the console for:
- ✅ Server running on port 5000
- ✅ MongoDB connected
- ✅ Payment routes registered at `/api/payment`

### 6. Test in Application

1. **Login as User:**
   - Email: `user@test.com`
   - Password: `password123`

2. **Add items to cart** from any restaurant

3. **Go to Checkout**

4. **Select "Razorpay" as payment method**

5. **Click "Proceed to Pay"**

6. **Razorpay Checkout will open** with options:
   - Card Payment
   - UPI
   - Net Banking
   - Wallets

7. **Use test credentials** mentioned above

8. **Complete payment** - Order will be placed successfully!

## API Endpoints

### Get Razorpay Key
```
GET /api/payment/key
```
Returns the public Razorpay Key ID for frontend integration.

### Create Order
```
POST /api/payment/create-order
Authorization: Bearer <token>
Body: {
  "amount": 450.50,
  "currency": "INR"
}
```
Creates a Razorpay order and returns order ID.

### Verify Payment
```
POST /api/payment/verify
Authorization: Bearer <token>
Body: {
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```
Verifies payment signature for security.

## Security Features

1. **Signature Verification:** Every payment is verified using HMAC SHA256 signature
2. **Server-side Validation:** Payment verification happens on backend
3. **HTTPS:** Razorpay enforces HTTPS in production
4. **PCI DSS Compliant:** Razorpay handles sensitive card data securely

## Production Deployment

### Before Going Live:

1. **Complete KYC Verification** on Razorpay Dashboard

2. **Switch to Live Mode:**
   - Go to Razorpay Dashboard
   - Toggle from "Test Mode" to "Live Mode"
   - Generate Live API Keys

3. **Update Environment Variables:**
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxx
```

4. **Test with Real Payments** (small amounts first)

5. **Configure Webhooks** (optional but recommended):
   - Go to Settings → Webhooks
   - Add your webhook URL: `https://yourdomain.com/api/payment/webhook`
   - Subscribe to: `payment.captured`, `payment.failed`

## Troubleshooting

### Payment Modal Not Opening:
- Check browser console for errors
- Ensure Razorpay script loaded: `https://checkout.razorpay.com/v1/checkout.js`
- Verify API keys are correct in `.env`

### Payment Verification Failed:
- Check `RAZORPAY_KEY_SECRET` matches the Key ID
- Ensure signature calculation uses correct format
- Check server logs for detailed error

### "Invalid Key ID" Error:
- Verify Key ID starts with `rzp_test_` (test mode) or `rzp_live_` (live mode)
- Ensure `.env` file is loaded correctly
- Restart backend server after changing keys

## Demo vs. Other Payment Methods

The application includes multiple payment options:

1. **Razorpay (RECOMMENDED)** ✅
   - Real payment gateway
   - Works in test mode (no real money)
   - Supports all payment methods
   - Production-ready

2. **Card Payment (Demo)** 🎭
   - Simulated payment
   - 90% success rate
   - For testing UI only

3. **UPI Payment (Demo)** 🎭
   - Simulated payment
   - For testing UI only

4. **Net Banking (Demo)** 🎭
   - Simulated payment
   - For testing UI only

5. **Cash on Delivery** 💵
   - No online payment required
   - Payment collected at delivery

## Support

- **Razorpay Documentation:** https://razorpay.com/docs/
- **Razorpay Support:** support@razorpay.com
- **Dashboard:** https://dashboard.razorpay.com/

## Notes

- Test mode is completely free
- No actual money is charged in test mode
- You can simulate both successful and failed payments
- Switch to live mode only after thorough testing
- Keep your Key Secret confidential
- Never commit API keys to version control
