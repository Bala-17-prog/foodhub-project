import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUtensils, FaClock, FaTruck } from 'react-icons/fa';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import RestaurantCard from '../../components/specific/RestaurantCard';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
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
  console.log('restaurants:', restaurants);
    console.log('Filtered Restaurants:', filteredRestaurants);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserHeader />

      {/* Hero Section */}
  <section className="bg-gradient-to-r from-primary-600 to-primary-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Order Your Favorite Food
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Delicious meals delivered to your doorstep
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for restaurants or cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pr-12 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-primary-300"
                />
                <FaSearch className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUtensils className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">Choose from hundreds of restaurants</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your food in 30 minutes or less</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTruck className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Tracking</h3>
              <p className="text-gray-600">Track your order in real-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery ? 'Search Results' : 'Featured Restaurants'}
            </h2>
            <Button onClick={() => navigate('/user/restaurants')} variant="outline">
              View All
            </Button>
          </div>

          {loading ? (
            <Loading />
          ) : filteredRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery ? 'No restaurants found matching your search' : 'No restaurants available'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.slice(0, 6).map((restaurant) => (
                <RestaurantCard key={restaurant._id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
