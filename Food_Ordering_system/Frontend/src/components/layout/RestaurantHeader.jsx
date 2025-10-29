import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUtensils, FaHome, FaHamburger, FaClipboardList, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const RestaurantHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/restaurant/dashboard" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <FaUtensils className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-900">Restaurant Portal</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/restaurant/dashboard"
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition"
            >
              <FaHome />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/restaurant/foods"
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition"
            >
              <FaHamburger />
              <span>Foods</span>
            </Link>
            <Link
              to="/restaurant/orders"
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition"
            >
              <FaClipboardList />
              <span>Orders</span>
            </Link>
            <Link
              to="/restaurant/settings"
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition"
            >
              <FaCog />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 hidden md:inline">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition hidden md:flex"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 py-4">
          <nav className="flex flex-col space-y-3 px-4">
            <Link to="/restaurant/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
              <FaHome />
              <span>Dashboard</span>
            </Link>
            <Link to="/restaurant/foods" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
              <FaHamburger />
              <span>Foods</span>
            </Link>
            <Link to="/restaurant/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
              <FaClipboardList />
              <span>Orders</span>
            </Link>
            <Link to="/restaurant/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
              <FaCog />
              <span>Settings</span>
            </Link>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{user?.name}</span>
                <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="text-red-600">
                  <FaSignOutAlt />
                </button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default RestaurantHeader;
