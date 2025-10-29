import { useState, useEffect } from 'react';
import { FaClipboardList, FaStore, FaCalendar, FaMoneyBillWave } from 'react-icons/fa';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import OrderStatusBadge from '../../components/specific/OrderStatusBadge';
import Modal from '../../components/common/Modal';
import { getMyOrders } from '../../api/orderService';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      console.log('Orders fetched:', data); // Debug log
      // Sort by most recent first
      const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.error('Error response:', error.response); // Debug log
      
      // Detailed error handling
      if (error.message === 'Network Error') {
        const errorMsg = '❌ Cannot connect to server. Is backend running on https://foodhub-backend-fghd.onrender.com?';
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (error.response?.status === 401) {
        const errorMsg = '🔒 Session expired. Please login again.';
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (error.response?.status === 404) {
        const errorMsg = '📭 Orders endpoint not found. Check backend routes.';
        setError(errorMsg);
        toast.error(errorMsg);
      } else if (error.response?.status === 500) {
        const errorMsg = '🔥 Server error. Please try again later.';
        setError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg = error.response?.data?.message || 'Failed to load orders';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UserHeader />
        <Loading fullScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h1>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="text-red-800 font-semibold mb-2">Error Loading Orders</h3>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 && !error ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaClipboardList className="text-gray-400 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600">Start ordering delicious food now!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order._id}
                hover
                onClick={() => handleOrderClick(order)}
                className="p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Side - Order Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Order #{order._id.slice(-8)}
                        </p>
                        <div className="flex items-center text-gray-900">
                          <FaStore className="mr-2" />
                          <span className="font-semibold text-lg">
                            {order.restaurant?.name || 'Restaurant'}
                          </span>
                        </div>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <p>
                        {order.orderItems?.length} item{order.orderItems?.length > 1 ? 's' : ''}:{' '}
                        {order.orderItems?.slice(0, 2).map((item, index) => (
                          <span key={index}>
                            {item.name} x{item.qty}
                            {index < Math.min(order.orderItems.length - 1, 1) && ', '}
                          </span>
                        ))}
                        {order.orderItems?.length > 2 && ` +${order.orderItems.length - 2} more`}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FaCalendar className="mr-2" />
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span>Payment: {order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Total */}
                  <div className="flex items-center justify-between md:flex-col md:items-end md:justify-start">
                    <div className="flex items-center text-2xl font-bold text-primary-600">
                      <FaMoneyBillWave className="mr-2" />
                      ₹{order.totalPrice}
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2">
                      View Details →
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Order Details"
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-900">#{selectedOrder._id}</p>
                </div>
                <OrderStatusBadge status={selectedOrder.status} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Restaurant</p>
                  <p className="font-medium text-gray-900">
                    {selectedOrder.restaurant?.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Order Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p className="font-medium text-gray-900">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium text-gray-900">{selectedOrder.status}</p>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Delivery Address</p>
              <p className="text-gray-600">{selectedOrder.shippingAddress}</p>
            </div>

            {/* Order Items */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Order Items</p>
              <div className="space-y-3">
                {selectedOrder.orderItems?.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ₹{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{selectedOrder.itemsPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>₹{selectedOrder.taxPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>₹{selectedOrder.deliveryPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>₹{selectedOrder.totalPrice}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
};

export default Orders;
