import { FaStar, FaPlus, FaFire, FaLeaf, FaHeart } from 'react-icons/fa';
import { useState } from 'react';

const FoodCard = ({ food, onAddToCart, restaurant }) => {
  const { name, description, price, image, category, rating, available } = food;
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Food category images
  const categoryImages = {
    'Appetizer': 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&h=350&fit=crop&q=80',
    'Main Course': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=350&fit=crop&q=80',
    'Dessert': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500&h=350&fit=crop&q=80',
    'Beverage': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=350&fit=crop&q=80',
    'Starter': 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=500&h=350&fit=crop&q=80',
    'Pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=350&fit=crop&q=80',
    'Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=350&fit=crop&q=80',
    'Pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=350&fit=crop&q=80',
    'Salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=350&fit=crop&q=80',
    'default': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=350&fit=crop&q=80'
  };

  const getFoodImage = () => {
    if (image && !imageError) return image;
    return categoryImages[category] || categoryImages.default;
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Generate rating if not present
  const displayRating = rating || (4 + Math.random()).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 200 + 50);

  const isSpicy = Math.random() > 0.7;
  const isVeg = Math.random() > 0.5;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={getFoodImage()}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Not Available Overlay */}
        {!available && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-xl">
              Not Available
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {/* Category Badge */}
          {category && (
            <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
              <span className="text-xs font-bold text-gray-900">{category}</span>
            </div>
          )}
          
          {/* Favorite Button */}
          <button 
            onClick={toggleFavorite}
            className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <FaHeart className={`text-sm ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Bottom Badges */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
            <FaStar className="text-yellow-500 text-sm" />
            <span className="text-xs font-bold text-gray-900">{displayRating}</span>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>

          {/* Food Type Indicators */}
          <div className="flex items-center gap-2">
            {isVeg && (
              <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <FaLeaf className="text-white text-sm" />
              </div>
            )}
            {isSpicy && (
              <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <FaFire className="text-white text-sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Food Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {name}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Price and Add Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Price</p>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              ₹{price}
            </span>
          </div>
          
          <button
            onClick={() => onAddToCart(food, restaurant)}
            disabled={!available}
            className={`px-6 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 transition-all duration-200 ${
              available
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FaPlus className="text-sm" />
            Add
          </button>
        </div>

        {/* Quick Info */}
        {available && (
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span>🚀 Fast Delivery</span>
            <span>⭐ Top Rated</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
