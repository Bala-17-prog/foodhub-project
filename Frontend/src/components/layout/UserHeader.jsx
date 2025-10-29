import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FaUtensils, FaShoppingCart, FaUser, FaSignOutAlt, FaHome, FaClipboardList, FaBars, FaTimes, FaAppleAlt } from 'react-icons/fa';

const UserHeader = () => {
  const { user, logout } = useAuth();
  const { getItemsCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/user/home" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <FaUtensils className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-900">FoodHub</span>
          </Link>

          {/* Desktop Navigation - Always Visible */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/user/home"
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition font-medium"
            >
              <FaHome />
              <span>Home</span>
            </Link>
            <Link
              to="/user/restaurants"
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition font-medium"
            >
              <FaUtensils />
              <span>Restaurants</span>
            </Link>
            <Link
              to="/user/diet-plans"
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition font-medium"
            >
              <FaAppleAlt />
              <span>AI Diet Planner</span>
            </Link>
            <Link
              to="/user/orders"
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition font-medium"
            >
              <FaClipboardList />
              <span>Orders</span>
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/user/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition"
            >
              <FaShoppingCart className="text-2xl" />
              {getItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getItemsCount()}
                </span>
              )}
            </Link>

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/user/profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition"
              >
                <FaUser />
                <span>{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-700 hover:text-red-600 transition"
                title="Logout"
              >
                <FaSignOutAlt className="text-xl" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition"
            >
              {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/user/home"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition font-medium px-2 py-2"
              >
                <FaHome />
                <span>Home</span>
              </Link>
              <Link
                to="/user/restaurants"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition font-medium px-2 py-2"
              >
                <FaUtensils />
                <span>Restaurants</span>
              </Link>
              <Link
                to="/user/diet-plans"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition font-medium px-2 py-2"
              >
                <FaAppleAlt />
                <span>AI Diet Planner</span>
              </Link>
              <Link
                to="/user/orders"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition font-medium px-2 py-2"
              >
                <FaClipboardList />
                <span>Orders</span>
              </Link>
              <Link
                to="/user/profile"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition font-medium px-2 py-2"
              >
                <FaUser />
                <span>Profile ({user?.name})</span>
              </Link>
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleLogout();
                }}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition font-medium px-2 py-2"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default UserHeader;
