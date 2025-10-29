import { FaStar, FaClock, FaMapMarkerAlt, FaHeart, FaBolt, FaLeaf } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const RestaurantCard = ({ restaurant }) => {
  const { _id, name, description, address, cuisine, image, openingHours } = restaurant;
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback images for different cuisine types
  const cuisineImages = {
    'Italian': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&q=80',
    'Chinese': 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&h=400&fit=crop&q=80',
    'Indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop&q=80',
    'Mexican': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=400&fit=crop&q=80',
    'Japanese': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop&q=80',
    'default': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80'
  };

  const getRestaurantImage = () => {
    if (image && !imageError) return image;
    const cuisineType = cuisine && cuisine[0] ? cuisine[0] : 'default';
    return cuisineImages[cuisineType] || cuisineImages.default;
  };

  const handleClick = () => {
    navigate(`/user/restaurant/${_id}`);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Generate random rating (4.0 - 4.9)
  const rating = (4 + Math.random() * 0.9).toFixed(1);
  
  // Generate random delivery time (20-45 mins)
  const deliveryTime = Math.floor(20 + Math.random() * 25);

  return (
    <div 
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={getRestaurantImage()}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {/* Fast Delivery Badge */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
            <FaBolt className="text-yellow-500 text-sm" />
            <span className="text-xs font-bold text-gray-900">{deliveryTime} min</span>
          </div>
          
          {/* Favorite Button */}
          <button 
            onClick={toggleFavorite}
            className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <FaHeart className={`text-lg ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          </button>
        </div>

        {/* Rating Badge - Bottom Left */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
          <FaStar className="text-yellow-500 text-sm" />
          <span className="text-sm font-bold text-gray-900">{rating}</span>
          <span className="text-xs text-gray-500">({Math.floor(Math.random() * 500 + 100)})</span>
        </div>

        {/* Discount Badge - Bottom Right */}
        {Math.random() > 0.5 && (
          <div className="absolute bottom-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-3 py-1.5 shadow-lg">
            <span className="text-xs font-bold">{Math.floor(Math.random() * 30 + 20)}% OFF</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Restaurant Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
          {name}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Cuisine Tags */}
        {cuisine && cuisine.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {cuisine.slice(0, 3).map((item, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full border border-orange-200"
              >
                {item}
              </span>
            ))}
            {cuisine.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                +{cuisine.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Bottom Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Address */}
          {address && (
            <div className="flex items-center text-sm text-gray-500">
              <FaMapMarkerAlt className="mr-1.5 text-orange-500" />
              <span className="line-clamp-1 text-xs">{address.substring(0, 20)}...</span>
            </div>
          )}

          {/* Opening Hours */}
          {openingHours && (
            <div className="flex items-center text-sm text-gray-500">
              <FaClock className="mr-1.5 text-green-500" />
              <span className="text-xs font-medium text-green-600">Open</span>
            </div>
          )}
        </div>

        {/* View Menu Button */}
        <button className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-semibold text-sm hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200">
          View Menu →
        </button>
      </div>
    </div>
  );
};

export default RestaurantCard;
