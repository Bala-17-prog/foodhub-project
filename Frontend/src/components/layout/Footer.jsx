import { FaUtensils, FaGithub, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-lg">
                <FaUtensils className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold">FoodHub</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your favorite food delivered to your doorstep. Fast, fresh, and delicious!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: balasubramanian0516@gmail.com</li>
              <li>Phone: +91 8122701981</li>
              <li>Address: 859 2nd street TVS nagar Tirunelveli</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm flex items-center">
            Made with <FaHeart className="text-red-500 mx-1" /> by FoodHub Team
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            © 2025 FoodHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
