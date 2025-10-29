import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUtensils, FaHome, FaUsers, FaStore, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <FaUtensils className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold">Admin Portal</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/admin/dashboard"
              className="flex items-center space-x-1 hover:text-primary-400 transition"
            >
              <FaHome />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center space-x-1 hover:text-primary-400 transition"
            >
              <FaUsers />
              <span>Users</span>
            </Link>
            <Link
              to="/admin/restaurants"
              className="flex items-center space-x-1 hover:text-primary-400 transition"
            >
              <FaStore />
              <span>Restaurants</span>
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center space-x-1 hover:text-primary-400 transition"
            >
              <FaClipboardList />
              <span>Orders</span>
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
