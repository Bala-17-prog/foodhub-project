import { useState, useEffect } from 'react';
import { FaClipboardList, FaUser, FaMapMarkerAlt, FaPhone, FaRupeeSign } from 'react-icons/fa';
import RestaurantHeader from '../../components/layout/RestaurantHeader';
import Footer from '../../components/layout/Footer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import OrderStatusBadge from '../../components/specific/OrderStatusBadge';
import Modal from '../../components/common/Modal';
import { getRestaurantOrders, updateOrderStatus } from '../../api/orderService';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getRestaurantOrders();
      const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
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

  const getStatusActions = (order) => {
    switch (order.status) {
      case 'pending':
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => handleStatusUpdate(order._id, 'preparing')}
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleStatusUpdate(order._id, 'cancelled')}
            >
              Reject
            </Button>
          </div>
        );
      case 'preparing':
        return (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(order._id, 'out-for-delivery')}
          >
            Ready for Delivery
          </Button>
        );
      case 'out-for-delivery':
        return (
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(order._id, 'delivered')}
          >
            Mark Delivered
          </Button>
        );
      default:
        return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <RestaurantHeader />
        <Loading fullScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <RestaurantHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Orders</h1>
          <p className="text-gray-600">Manage your restaurant orders</p>
        </div>

        {/* Status Filter */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button
              onClick={() => setStatusFilter('preparing')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'preparing'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Preparing ({orders.filter(o => o.status === 'preparing').length})
            </button>
            <button
              onClick={() => setStatusFilter('out-for-delivery')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'out-for-delivery'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Out for Delivery ({orders.filter(o => o.status === 'out-for-delivery').length})
            </button>
            <button
              onClick={() => setStatusFilter('delivered')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === 'delivered'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Delivered ({orders.filter(o => o.status === 'delivered').length})
            </button>
          </div>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <FaClipboardList className="text-gray-300 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'You have no orders yet'
                : `No ${statusFilter} orders`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order._id} className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        Order #{order._id.slice(-8)}
                      </h3>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FaUser className="mr-2" />
                        <span>{order.user?.name || 'Guest'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaPhone className="mr-2" />
                        <span>{order.user?.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaRupeeSign className="mr-2" />
                        <span className="font-semibold">₹{order.totalAmount}</span>
                      </div>
                      <div className="flex items-start text-gray-600">
                        <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                        <span className="line-clamp-2">{order.deliveryAddress}</span>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-500">
                      {order.items?.length || 0} items • {formatDate(order.createdAt)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:items-end">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleViewDetails(order)}
                    >
                      View Details
                    </Button>
                    {getStatusActions(order)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Order #${selectedOrder._id.slice(-8)}`}
        >
          <div className="space-y-4">
            {/* Status */}
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <OrderStatusBadge status={selectedOrder.status} />
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <label className="text-sm font-medium text-gray-700">Customer</label>
              <div className="mt-1 text-gray-900">
                <p>{selectedOrder.user?.name || 'Guest'}</p>
                <p className="text-sm text-gray-600">{selectedOrder.user?.phone || 'N/A'}</p>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="text-sm font-medium text-gray-700">Delivery Address</label>
              <p className="mt-1 text-gray-900">{selectedOrder.deliveryAddress}</p>
            </div>

            {/* Order Items */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Order Items</label>
              <div className="space-y-2">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-gray-900">{item.food?.name || 'Item'}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-primary-600">₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              {getStatusActions(selectedOrder)}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Orders;
