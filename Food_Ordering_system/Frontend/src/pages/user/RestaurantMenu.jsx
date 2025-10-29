import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaSearch } from 'react-icons/fa';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import FoodCard from '../../components/specific/FoodCard';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import { useCart } from '../../context/CartContext';
import { getFoods } from '../../api/foodService';
import { getRestaurantById } from '../../api/restaurantService';
import { toast } from 'react-toastify';

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchRestaurantAndFoods();
  }, [id]);

  const fetchRestaurantAndFoods = async () => {
    try {
      setLoading(true);
      
      // Fetch restaurant details
      const restaurantData = await getRestaurantById(id);
      setRestaurant(restaurantData);

      // Fetch foods for this restaurant
      const foodsData = await getFoods({ restaurant: id });
      setFoods(foodsData);
    } catch (error) {
      toast.error('Failed to load restaurant menu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (food) => {
    addToCart(food, restaurant);
  };

  // Get unique categories
  const categories = ['all', ...new Set(foods.map(f => f.category).filter(Boolean))];

  // Filter foods
  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UserHeader />
        <Loading fullScreen />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UserHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-4">Restaurant not found</p>
            <Button onClick={() => navigate('/user/restaurants')}>
              Back to Restaurants
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </Button>

        {/* Restaurant Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {restaurant.name}
              </h1>
              
              {restaurant.description && (
                <p className="text-gray-600 mb-4">{restaurant.description}</p>
              )}

              {/* Cuisine Tags */}
              {restaurant.cuisine && restaurant.cuisine.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.cuisine.map((item, index) => (
                    <span
                      key={index}
                      className="bg-primary-50 text-primary-700 text-sm px-3 py-1 rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              <div className="space-y-2 text-gray-600">
                {restaurant.address && (
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mt-1 mr-2 flex-shrink-0" />
                    <span>{restaurant.address}</span>
                  </div>
                )}
                
                {restaurant.openingHours && (
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    <span>{restaurant.openingHours}</span>
                  </div>
                )}
              </div>
            </div>

            {restaurant.image && (
              <div className="mt-4 md:mt-0 md:ml-6">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full md:w-48 h-48 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category === 'all' ? 'All Items' : category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Menu Items */}
        {filteredFoods.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No items found matching your search' : 'No menu items available'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
              <p className="text-gray-600">
                {filteredFoods.length} item{filteredFoods.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFoods.map((food) => (
                <FoodCard
                  key={food._id}
                  food={food}
                  restaurant={restaurant}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RestaurantMenu;
