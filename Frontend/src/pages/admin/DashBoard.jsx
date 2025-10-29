import { useState, useEffect } from 'react';
import { FaUsers, FaStore, FaShoppingBag, FaRupeeSign, FaChartLine, FaClock } from 'react-icons/fa';
import AdminHeader from '../../components/layout/AdminHeader';
import Footer from '../../components/layout/Footer';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { getAllUsers, getAllRestaurants, getAllOrders } from '../../api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingRestaurants: 0,
    activeOrders: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data
      const [usersData, restaurantsData, ordersData] = await Promise.all([
        getAllUsers(),
        getAllRestaurants(),
        getAllOrders(),
      ]);

      // Calculate stats
      const totalRevenue = ordersData
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.totalAmount, 0);

      const pendingRestaurants = restaurantsData.filter(
        r => r.status === 'pending'
      ).length;

      const activeOrders = ordersData.filter(
        o => o.status !== 'delivered' && o.status !== 'cancelled'
      ).length;

      setStats({
        totalUsers: usersData.filter(u => u.role === 'user').length,
        totalRestaurants: restaurantsData.length,
        totalOrders: ordersData.length,
        totalRevenue: totalRevenue,
        pendingRestaurants: pendingRestaurants,
        activeOrders: activeOrders,
      });

      // Recent activity (last 5 orders)
      const recentOrders = ordersData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentActivity(recentOrders);

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
        <AdminHeader />
        <Loading fullScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <AdminHeader />

      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">👑 Admin Dashboard</h1>
              <p className="text-blue-100 text-lg">System Overview & Management</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
                <p className="text-sm text-blue-100">Today</p>
                <p className="text-xl font-bold">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg">
                <FaUsers className="text-blue-600 text-2xl" />
              </div>
            </div>
          </Card>

          {/* Total Restaurants */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Restaurants</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRestaurants}</p>
                {stats.pendingRestaurants > 0 && (
                  <p className="text-sm text-yellow-600 mt-1">
                    {stats.pendingRestaurants} pending approval
                  </p>
                )}
              </div>
              <div className="bg-orange-100 p-4 rounded-lg">
                <FaStore className="text-primary-600 text-2xl" />
              </div>
            </div>
          </Card>

          {/* Total Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                {stats.activeOrders > 0 && (
                  <p className="text-sm text-blue-600 mt-1">
                    {stats.activeOrders} active
                  </p>
                )}
              </div>
              <div className="bg-purple-100 p-4 rounded-lg">
                <FaShoppingBag className="text-purple-600 text-2xl" />
              </div>
            </div>
          </Card>

          {/* Total Revenue */}
          <Card className="p-6 md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg">
                <FaRupeeSign className="text-green-600 text-2xl" />
              </div>
            </div>
          </Card>

          {/* Pending Approvals */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingRestaurants}</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg">
                <FaClock className="text-yellow-600 text-2xl" />
              </div>
            </div>
          </Card>

          {/* Active Orders */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeOrders}</p>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg">
                <FaChartLine className="text-indigo-600 text-2xl" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <FaChartLine className="text-gray-400 text-xl" />
          </div>

          {recentActivity.length === 0 ? (
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
                      Restaurant
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
                  {recentActivity.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.user?.name || 'Guest'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.restaurant?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
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
