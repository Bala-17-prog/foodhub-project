import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    restaurant,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getTaxAmount,
    getDeliveryFee,
    getGrandTotal,
  } = useCart();

  const handleQuantityChange = (itemId, newQty) => {
    if (newQty < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQty);
    }
  };

  const handleCheckout = () => {
    navigate('/user/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UserHeader />
        
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-gray-400 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add items from restaurants to get started</p>
            <Button onClick={() => navigate('/user/restaurants')}>
              Browse Restaurants
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <Button variant="danger" size="sm" onClick={clearCart}>
            <FaTrash className="mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Restaurant Info */}
            {restaurant && (
              <Card className="p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Ordering from</p>
                    <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/user/restaurant/${restaurant._id}`)}
                  >
                    View Menu
                  </Button>
                </div>
              </Card>
            )}

            {/* Cart Items List */}
            {cart.map((item) => (
              <Card key={item._id} className="p-4">
                <div className="flex items-start space-x-4">
                  {/* Item Image */}
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaShoppingBag className="text-2xl" />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {item.description}
                      </p>
                    )}
                    <p className="text-xl font-bold text-primary-600">
                      ₹{item.price}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end space-y-3">
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.qty - 1)}
                        className="p-2 hover:bg-gray-200 rounded-l-lg transition"
                      >
                        <FaMinus className="text-gray-600" />
                      </button>
                      <span className="px-4 font-semibold">{item.qty}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.qty + 1)}
                        className="p-2 hover:bg-gray-200 rounded-r-lg transition"
                      >
                        <FaPlus className="text-gray-600" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 hover:text-red-700 text-sm flex items-center transition"
                    >
                      <FaTrash className="mr-1" />
                      Remove
                    </button>

                    <p className="text-lg font-semibold text-gray-900">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>₹{getTaxAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{getDeliveryFee().toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>₹{getGrandTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button fullWidth onClick={handleCheckout} size="lg">
                Proceed to Checkout
              </Button>

              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/user/restaurants')}
                  className="text-primary-600 hover:text-primary-700 text-sm transition"
                >
                  Continue Shopping
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
