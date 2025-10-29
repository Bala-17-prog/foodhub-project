import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUtensils, FaClock, FaTruck, FaStar, FaBolt, FaLeaf, FaHeart, FaPercent, FaFire } from 'react-icons/fa';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import RestaurantCard from '../../components/specific/RestaurantCard';
import Loading from '../../components/common/Loading';
import { getAllRestaurants } from '../../api/restaurantService';
import { toast } from 'react-toastify';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const data = await getAllRestaurants();
      setRestaurants(data);
    } catch (error) {
      toast.error('Failed to load restaurants');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.cuisine?.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <UserHeader />
      
      {/* Hero Section - Swiggy/Zomato Style */}
  <div className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full">
                <FaFire className="text-primary-600" />
                <span className="text-primary-700 font-semibold text-sm">Order Now & Get 50% OFF on First Order</span>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-4">
                  Your Favorite
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400">
                    Food Delivered
                  </span>
                  <span className="block">In Minutes</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Fresh ingredients, expert chefs, and lightning-fast delivery. 
                  Experience culinary excellence at your doorstep.
                </p>
              </div>

              {/* Enhanced Search Bar */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-3xl blur-lg opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center">
                    <FaSearch className="absolute left-6 text-gray-400 text-xl" />
                    <input
                      type="text"
                      placeholder="Search for restaurants, cuisines, or dishes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-16 pr-6 py-6 text-gray-900 text-lg focus:outline-none"
                    />
                    <button className="absolute right-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition">
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaBolt className="text-white text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Fast Delivery</p>
                    <p className="text-lg font-bold text-gray-900">Under 30 mins</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaUtensils className="text-white text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Restaurants</p>
                    <p className="text-lg font-bold text-gray-900">{restaurants.length}+ Partners</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaHeart className="text-white text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Happy Customers</p>
                    <p className="text-lg font-bold text-gray-900">50K+ Reviews</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden md:block relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=800&fit=crop&q=80" 
                  alt="Delicious Food" 
                  className="rounded-[3rem] shadow-2xl w-full h-[550px] object-cover transform hover:scale-105 transition duration-500"
                />
                {/* Floating Discount Card */}
                <div className="absolute -bottom-8 -left-8 bg-white rounded-3xl shadow-2xl p-6 animate-float">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center">
                      <FaPercent className="text-white text-3xl" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">50% OFF</p>
                      <p className="text-sm text-gray-600">On Your First Order</p>
                    </div>
                  </div>
                </div>
                {/* Floating Rating Card */}
                <div className="absolute -top-8 -right-8 bg-white rounded-3xl shadow-2xl p-6 animate-float animation-delay-2000">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-200 to-primary-400 rounded-2xl flex items-center justify-center">
                      <FaStar className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">4.8</p>
                      <p className="text-sm text-gray-600">Avg Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transform transition shadow-lg group-hover:shadow-xl">
                <FaTruck className="text-orange-600 text-3xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Free Delivery</h3>
              <p className="text-sm text-gray-500">On orders above $20</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transform transition shadow-lg group-hover:shadow-xl">
                <FaLeaf className="text-green-600 text-3xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Fresh Ingredients</h3>
              <p className="text-sm text-gray-500">Quality guaranteed</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transform transition shadow-lg group-hover:shadow-xl">
                <FaClock className="text-blue-600 text-3xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Quick Service</h3>
              <p className="text-sm text-gray-500">30 min delivery</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-100 to-purple-200 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transform transition shadow-lg group-hover:shadow-xl">
                <FaStar className="text-purple-600 text-3xl" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Top Rated</h3>
              <p className="text-sm text-gray-500">Best quality chefs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurants Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              {searchQuery ? 'Search Results' : 'Popular Restaurants Near You'}
            </h2>
            <p className="text-gray-600 text-lg">Handpicked favorites just for you</p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl px-6 py-3">
            <FaUtensils className="text-orange-600 text-xl" />
            <span className="font-bold text-gray-900">
              {filteredRestaurants.length} Restaurants
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              <div className="w-24 h-24 border-8 border-orange-200 rounded-full"></div>
              <div className="w-24 h-24 border-8 border-orange-600 rounded-full animate-spin border-t-transparent absolute top-0 left-0"></div>
            </div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-3xl shadow-lg">
            <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <FaUtensils className="text-7xl text-gray-300" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">No restaurants found</h3>
            <p className="text-gray-500 text-lg mb-8">Try adjusting your search or check back later</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-semibold hover:shadow-xl transform hover:scale-105 transition"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
