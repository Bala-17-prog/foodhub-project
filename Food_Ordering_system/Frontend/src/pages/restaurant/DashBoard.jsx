import { useState, useEffect } from 'react';
import { FaUtensils, FaShoppingBag, FaRupeeSign, FaChartLine, FaClock } from 'react-icons/fa';
import RestaurantHeader from '../../components/layout/RestaurantHeader';
import Footer from '../../components/layout/Footer';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import OrderStatusBadge from '../../components/specific/OrderStatusBadge';
import { getRestaurantOrders } from '../../api/orderService';
import { getRestaurantFoods } from '../../api/foodService';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalMenuItems: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersData = await getRestaurantOrders();
      
      // Fetch menu items
      const foodsData = await getRestaurantFoods();
      
      // Calculate stats
      const totalRevenue = ordersData
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.totalAmount, 0);
      
      const pendingOrders = ordersData.filter(
        order => order.status === 'pending' || order.status === 'preparing'
      ).length;

      setStats({
        totalOrders: ordersData.length,
        totalRevenue: totalRevenue,
        totalMenuItems: foodsData.length,
        pendingOrders: pendingOrders,
      });

      // Get recent 5 orders
      const sortedOrders = ordersData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      
      setRecentOrders(sortedOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <RestaurantHeader />
        <Loading fullScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-orange-50">
      <RestaurantHeader />

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">🍽️ Restaurant Dashboard</h1>
              <p className="text-orange-100 text-lg">Manage your restaurant and track performance</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                <p className="text-sm text-orange-100">Today's Date</p>
                <p className="text-xl font-bold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaShoppingBag className="text-white text-2xl" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaRupeeSign className="text-white text-2xl" />
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Menu Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalMenuItems}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaUtensils className="text-white text-2xl" />
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FaClock className="text-white text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <FaChartLine className="text-gray-400 text-xl" />
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <FaShoppingBag className="text-gray-300 text-5xl mx-auto mb-4" />
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.user?.name || 'Guest'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
