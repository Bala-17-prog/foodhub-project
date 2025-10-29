import { FaStar, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';

const RestaurantCard = ({ restaurant }) => {
  const { _id, name, description, address, cuisine, image, openingHours } = restaurant;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user/restaurant/${_id}`);
  };

  return (
    <Card hover onClick={handleClick} className="overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FaStar className="text-4xl" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
        
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        )}

        {/* Cuisine Tags */}
        {cuisine && cuisine.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {cuisine.map((item, index) => (
              <span
                key={index}
                className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Address */}
        {address && (
          <div className="flex items-start text-sm text-gray-600 mb-2">
            <FaMapMarkerAlt className="mt-1 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{address}</span>
          </div>
        )}

        {/* Opening Hours */}
        {openingHours && (
          <div className="flex items-center text-sm text-gray-600">
            <FaClock className="mr-2" />
            <span>{openingHours}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RestaurantCard;
