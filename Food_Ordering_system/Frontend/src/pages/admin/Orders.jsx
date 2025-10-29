import { useState, useEffect } from 'react';
import { FaClipboardList, FaSearch, FaEye } from 'react-icons/fa';
import AdminHeader from '../../components/layout/AdminHeader';
import Footer from '../../components/layout/Footer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import OrderStatusBadge from '../../components/specific/OrderStatusBadge';
import Modal from '../../components/common/Modal';
import { getAllOrders } from '../../api/orderService';
import { toast } from 'react-toastify';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.restaurant?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AdminHeader />
        <Loading fullScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Orders</h1>
          <p className="text-gray-600">View and monitor all platform orders</p>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, customer, or restaurant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({orders.filter(o => o.status === 'pending').length})
              </button>
              <button
                onClick={() => setStatusFilter('preparing')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  statusFilter === 'preparing'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Preparing ({orders.filter(o => o.status === 'preparing').length})
              </button>
              <button
                onClick={() => setStatusFilter('delivered')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  statusFilter === 'delivered'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Delivered ({orders.filter(o => o.status === 'delivered').length})
              </button>
            </div>
          </div>
        </Card>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <FaClipboardList className="text-gray-300 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-600">
              {searchTerm ? 'Try a different search term' : 'No orders placed yet'}
            </p>
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.user?.name || 'Guest'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.restaurant?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={<FaEye />}
                          onClick={() => handleViewDetails(order)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <Footer />

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Order Details #${selectedOrder._id.slice(-8)}`}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Customer</label>
                <p className="mt-1 text-gray-900">{selectedOrder.user?.name || 'Guest'}</p>
                <p className="text-sm text-gray-600">{selectedOrder.user?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Restaurant</label>
                <p className="mt-1 text-gray-900">{selectedOrder.restaurant?.name || 'N/A'}</p>
                <p className="text-sm text-gray-600">{selectedOrder.restaurant?.email || 'N/A'}</p>
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
                      <p className="text-sm text-gray-600">
                        ₹{item.price} × {item.quantity}
                      </p>
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

            {/* Order Date */}
            <div>
              <label className="text-sm font-medium text-gray-700">Order Date</label>
              <p className="mt-1 text-gray-900">{formatDate(selectedOrder.createdAt)}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Orders;
