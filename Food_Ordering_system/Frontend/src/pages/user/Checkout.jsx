import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaCreditCard, FaLock, FaMobileAlt, FaUniversity } from 'react-icons/fa';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { placeOrder } from '../../api/orderService';
import { getRazorpayKey, createRazorpayOrder, verifyRazorpayPayment } from '../../api/paymentService';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cart,
    restaurant,
    getCartTotal,
    getTaxAmount,
    getDeliveryFee,
    getGrandTotal,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    shippingAddress: user?.address || '',
    paymentMethod: 'Cash on Delivery',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });

  useEffect(() => {
    // Redirect if cart is empty
    if (cart.length === 0) {
      navigate('/user/cart');
    }
  }, [cart, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handlePaymentChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Process Razorpay Payment
  const processRazorpayPayment = async () => {
    try {
      console.log('=== RAZORPAY PAYMENT PROCESS STARTED ===');
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      console.log('Razorpay script loaded:', scriptLoaded);
      
      if (!scriptLoaded) {
        toast.error('Failed to load Razorpay SDK. Please check your internet connection.');
        return false;
      }

      // Get Razorpay key
      console.log('Getting Razorpay key...');
      const razorpayKey = await getRazorpayKey();
      console.log('Razorpay key received:', razorpayKey);

      // Create order
      const amount = getGrandTotal();
      console.log('Creating Razorpay order for amount:', amount);
      const order = await createRazorpayOrder(amount, 'INR');
      console.log('Razorpay order created:', order);

      // Razorpay options
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Food Ordering System',
        description: `Order from ${restaurant.name}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            console.log('Payment completed, verifying...');
            // Verify payment
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const verificationResult = await verifyRazorpayPayment(verificationData);
            console.log('Verification result:', verificationResult);

            if (verificationResult.success) {
              toast.success('Payment successful!');
              // Close modal and place order
              setShowPaymentModal(false);
              await placeOrderRequest();
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#ea580c',
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled');
            setLoading(false);
          }
        }
      };

      console.log('Opening Razorpay payment window...');
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      console.log('Razorpay payment window opened successfully');
      return 'razorpay_opened';
    } catch (error) {
      console.error('=== RAZORPAY PAYMENT ERROR ===');
      console.error('Error details:', error);
      console.error('Error response:', error.response);
      toast.error(`Failed to initiate payment: ${error.message || 'Unknown error'}`);
      return false;
    }
  };

  const processOnlinePayment = async () => {
    // If Razorpay is selected, use Razorpay payment
    if (formData.paymentMethod === 'Razorpay') {
      const result = await processRazorpayPayment();
      return result === 'razorpay_opened';
    }

    // Validate payment details based on payment method (for demo methods)
    if (formData.paymentMethod === 'Online Payment' || formData.paymentMethod === 'Card Payment') {
      if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
        toast.error('Please fill all card details');
        return false;
      }
    } else if (formData.paymentMethod === 'UPI Payment') {
      if (!paymentData.upiId) {
        toast.error('Please enter your UPI ID');
        return false;
      }
    } else if (formData.paymentMethod === 'Net Banking') {
      if (!paymentData.bankName || !paymentData.accountNumber || !paymentData.ifscCode) {
        toast.error('Please fill all banking details');
        return false;
      }
    }

    // Simulate payment processing for demo methods
    toast.info('Processing payment...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful payment (90% success rate for demo)
    const paymentSuccess = Math.random() > 0.1;
    
    if (paymentSuccess) {
      toast.success('Payment successful!');
      return true;
    } else {
      toast.error('Payment failed. Please try again.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('=== CHECKOUT DEBUG ===');
    console.log('Cart:', cart);
    console.log('Restaurant:', restaurant);
    console.log('Form data:', formData);

    if (!formData.shippingAddress.trim()) {
      setError('Please enter your delivery address');
      return;
    }

    // Validate restaurant before proceeding
    if (!restaurant || !restaurant._id) {
      setError('Restaurant information is missing. Please add items to cart again.');
      toast.error('Restaurant information is missing. Please go back and select items again.');
      return;
    }

    // If online payment selected, show payment modal
    if (formData.paymentMethod !== 'Cash on Delivery') {
      setShowPaymentModal(true);
      return;
    }

    // Process COD order
    await placeOrderRequest();
  };

  const placeOrderRequest = async () => {
    setLoading(true);

    try {
      // Validate restaurant exists
      if (!restaurant || !restaurant._id) {
        throw new Error('Restaurant information is missing. Please go back to the restaurant menu and try again.');
      }

      // Save restaurant ID before potential state changes
      const restaurantId = restaurant._id;

      const orderData = {
        restaurantId: restaurantId,
        orderItems: cart.map((item) => ({
          food: item._id,
          qty: item.qty,
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
      };

      console.log('Sending order data:', orderData);
      console.log('Restaurant ID:', restaurantId);

      const order = await placeOrder(orderData);
      
      console.log('Order placed successfully:', order);
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/user/orders');
    } catch (error) {
      console.error('Order placement error:', error);
      console.error('Error response:', error.response);
      const message = error.response?.data?.message || error.message || 'Failed to place order';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOnlinePaymentSubmit = async () => {
    // For Razorpay, the modal will stay open and payment will be handled by Razorpay SDK
    if (formData.paymentMethod === 'Razorpay') {
      setLoading(true);
      const result = await processRazorpayPayment();
      if (result !== 'razorpay_opened') {
        setLoading(false);
      }
      // Don't close modal or place order here - it will be done in Razorpay handler
      return;
    }

    // For demo payment methods
    const paymentSuccess = await processOnlinePayment();
    
    if (paymentSuccess) {
      setShowPaymentModal(false);
      await placeOrderRequest();
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/user/cart')}
          variant="ghost"
          className="mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Cart
        </Button>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Delivery Address
                </h2>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter your complete delivery address..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    formData.paymentMethod === 'Cash on Delivery' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 hover:border-primary-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </label>

                  {/* Card Payment */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    formData.paymentMethod === 'Online Payment' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 hover:border-primary-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online Payment"
                      checked={formData.paymentMethod === 'Online Payment'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <FaCreditCard className="mr-2 text-blue-600" />
                        <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                      </div>
                      <p className="text-sm text-gray-600">Pay securely with your card</p>
                    </div>
                    <FaLock className="text-gray-400" />
                  </label>

                  {/* UPI Payment */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    formData.paymentMethod === 'UPI Payment' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 hover:border-primary-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI Payment"
                      checked={formData.paymentMethod === 'UPI Payment'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <FaMobileAlt className="mr-2 text-purple-600" />
                        <p className="font-semibold text-gray-900">UPI Payment</p>
                      </div>
                      <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm & more</p>
                    </div>
                    <FaLock className="text-gray-400" />
                  </label>

                  {/* Net Banking */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    formData.paymentMethod === 'Net Banking' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 hover:border-primary-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Net Banking"
                      checked={formData.paymentMethod === 'Net Banking'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <FaUniversity className="mr-2 text-green-600" />
                        <p className="font-semibold text-gray-900">Net Banking</p>
                      </div>
                      <p className="text-sm text-gray-600">All major banks supported</p>
                    </div>
                    <FaLock className="text-gray-400" />
                  </label>

                  {/* Razorpay Payment */}
                  <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    formData.paymentMethod === 'Razorpay' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 hover:border-primary-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Razorpay"
                      checked={formData.paymentMethod === 'Razorpay'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <FaCreditCard className="mr-2 text-indigo-600" />
                        <p className="font-semibold text-gray-900">Razorpay</p>
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          Recommended
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Card, UPI, NetBanking, Wallets & more</p>
                    </div>
                    <FaLock className="text-gray-400" />
                  </label>
                </div>
              </Card>

              {/* Error Message */}
              {error && <ErrorMessage message={error} onClose={() => setError('')} />}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                {/* Restaurant */}
                {restaurant && (
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-gray-500">Ordering from</p>
                    <p className="font-semibold text-gray-900">{restaurant.name}</p>
                  </div>
                )}

                {/* Items */}
                <div className="mb-4 space-y-2">
                  {cart.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.qty}
                      </span>
                      <span className="text-gray-900">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (5%)</span>
                    <span>₹{getTaxAmount().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Fee</span>
                    <span>₹{getDeliveryFee().toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span>₹{getGrandTotal().toFixed(2)}</span>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                  disabled={loading}
                >
                  <FaCheckCircle className="mr-2" />
                  Place Order
                </Button>
              </Card>
            </div>
          </div>
        </form>
      </div>

      {/* Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Complete Payment">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center text-blue-800">
              <FaLock className="mr-2" />
              <span className="text-sm font-medium">Secure Payment Gateway</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Order Total:</span>
              <span className="font-bold text-gray-900">₹{getGrandTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Payment Method:</span>
              <span className="font-medium">{formData.paymentMethod}</span>
            </div>
          </div>

          {/* Razorpay Payment Info */}
          {formData.paymentMethod === 'Razorpay' && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-indigo-800 mb-2 font-medium">
                <FaCreditCard className="inline mr-2" />
                Razorpay Secure Checkout
              </p>
              <p className="text-xs text-indigo-700">
                Click the button below to proceed to Razorpay's secure payment gateway. 
                You can pay using Credit/Debit Cards, UPI, Net Banking, or Wallets.
              </p>
            </div>
          )}

          {/* Card Payment Form */}
          {formData.paymentMethod === 'Online Payment' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardName"
                  value={paymentData.cardName}
                  onChange={handlePaymentChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handlePaymentChange}
                    placeholder="123"
                    maxLength="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </>
          )}

          {/* UPI Payment Form */}
          {formData.paymentMethod === 'UPI Payment' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMobileAlt className="inline mr-2 text-purple-600" />
                  UPI ID
                </label>
                <input
                  type="text"
                  name="upiId"
                  value={paymentData.upiId}
                  onChange={handlePaymentChange}
                  placeholder="yourname@upi (e.g., 9876543210@paytm)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter your UPI ID from Google Pay, PhonePe, Paytm, or any UPI app
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800 font-medium mb-2">Popular UPI Apps:</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white text-purple-700 text-xs rounded-full border border-purple-300">
                    Google Pay
                  </span>
                  <span className="px-3 py-1 bg-white text-purple-700 text-xs rounded-full border border-purple-300">
                    PhonePe
                  </span>
                  <span className="px-3 py-1 bg-white text-purple-700 text-xs rounded-full border border-purple-300">
                    Paytm
                  </span>
                  <span className="px-3 py-1 bg-white text-purple-700 text-xs rounded-full border border-purple-300">
                    BHIM
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Net Banking Form */}
          {formData.paymentMethod === 'Net Banking' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaUniversity className="inline mr-2 text-green-600" />
                  Select Bank
                </label>
                <select
                  name="bankName"
                  value={paymentData.bankName}
                  onChange={handlePaymentChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">-- Select Your Bank --</option>
                  <option value="SBI">State Bank of India</option>
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="Axis">Axis Bank</option>
                  <option value="PNB">Punjab National Bank</option>
                  <option value="Kotak">Kotak Mahindra Bank</option>
                  <option value="BOB">Bank of Baroda</option>
                  <option value="Canara">Canara Bank</option>
                  <option value="IDBI">IDBI Bank</option>
                  <option value="Union">Union Bank of India</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={paymentData.accountNumber}
                  onChange={handlePaymentChange}
                  placeholder="Enter your account number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  value={paymentData.ifscCode}
                  onChange={handlePaymentChange}
                  placeholder="e.g., SBIN0001234"
                  maxLength="11"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs text-green-800">
                  <FaLock className="inline mr-1" />
                  Your banking details are encrypted and secure. We do not store any sensitive information.
                </p>
              </div>
            </>
          )}

          {/* Payment Button */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowPaymentModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleOnlinePaymentSubmit}
              loading={loading}
              disabled={loading}
              fullWidth
            >
              {formData.paymentMethod === 'Razorpay' && <FaCreditCard className="mr-2" />}
              {formData.paymentMethod === 'UPI Payment' && <FaMobileAlt className="mr-2" />}
              {formData.paymentMethod === 'Net Banking' && <FaUniversity className="mr-2" />}
              {formData.paymentMethod === 'Online Payment' && <FaCreditCard className="mr-2" />}
              {formData.paymentMethod === 'Razorpay' ? 'Proceed to Pay' : `Pay ₹${getGrandTotal().toFixed(2)}`}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            {formData.paymentMethod === 'Razorpay' 
              ? 'You will be redirected to Razorpay secure payment gateway.'
              : 'This is a demo payment gateway. No real transaction will be processed.'
            }
          </p>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default Checkout;
