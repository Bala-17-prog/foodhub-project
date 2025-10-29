import { FaStar, FaPlus } from 'react-icons/fa';
import Card from '../common/Card';
import Button from '../common/Button';

const FoodCard = ({ food, onAddToCart, restaurant }) => {
  const { name, description, price, image, category, rating, available } = food;

  return (
    <Card className="overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FaPlus className="text-4xl" />
          </div>
        )}
        {!available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              Not Available
            </span>
          </div>
        )}
        {category && (
          <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center mb-3">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        )}

        {/* Price and Add Button */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">₹{price}</span>
          <Button
            size="sm"
            onClick={() => onAddToCart(food, restaurant)}
            disabled={!available}
          >
            <FaPlus className="mr-1" /> Add
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default FoodCard;
