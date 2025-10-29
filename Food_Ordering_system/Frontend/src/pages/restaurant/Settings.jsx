import { useState, useEffect } from 'react';
import { FaStore, FaSave, FaMapMarkerAlt, FaPhone, FaClock, FaUtensils, FaImage } from 'react-icons/fa';
import RestaurantHeader from '../../components/layout/RestaurantHeader';
import Footer from '../../components/layout/Footer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../context/AuthContext';
import { updateRestaurant, getMyRestaurant } from '../../api/restaurantService';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    cuisine: [],
    openingHours: '',
    image: '',
  });

  useEffect(() => {
    fetchRestaurantData();
  }, []);

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      const data = await getMyRestaurant();
      setRestaurant(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        address: data.address || '',
        phone: data.phone || '',
        cuisine: data.cuisine || [],
        openingHours: data.openingHours || '',
        image: data.image || '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      toast.error('Failed to load restaurant data');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!restaurant) {
      toast.error('Restaurant data not loaded');
      return;
    }
    
    try {
      setSaving(true);
      await updateRestaurant(restaurant._id, formData);
      toast.success('Restaurant settings updated successfully!');
      await fetchRestaurantData(); // Reload data
      setSaving(false);
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast.error(error.response?.data?.message || 'Failed to update settings');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <RestaurantHeader />
        <Loading fullScreen />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <RestaurantHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Restaurant Not Found</h2>
            <p className="text-gray-600">Please contact support if this issue persists.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <RestaurantHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Restaurant Settings</h1>
          <p className="text-gray-600">Manage your restaurant information</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Restaurant Image */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaImage className="mr-2" />
                Restaurant Image URL
              </label>
              {formData.image && (
                <div className="mb-4">
                  <img 
                    src={formData.image} 
                    alt="Restaurant preview" 
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      toast.error('Invalid image URL');
                    }}
                  />
                </div>
              )}
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://example.com/restaurant-image.jpg"
              />
              <p className="mt-2 text-sm text-gray-500">
                💡 Tip: Use high-quality images from Unsplash.com for best results
              </p>
            </div>

            {/* Restaurant Name */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaStore className="mr-2" />
                Restaurant Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaUtensils className="mr-2" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell customers about your restaurant..."
              />
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="mr-2" />
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaPhone className="mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            {/* Cuisine Type */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaUtensils className="mr-2" />
                Cuisine Type
              </label>
              <select
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select cuisine type</option>
                <option value="Indian">Indian</option>
                <option value="Chinese">Chinese</option>
                <option value="Italian">Italian</option>
                <option value="Mexican">Mexican</option>
                <option value="Thai">Thai</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Desserts">Desserts</option>
                <option value="Beverages">Beverages</option>
                <option value="Multi-Cuisine">Multi-Cuisine</option>
              </select>
            </div>

            {/* Opening Hours */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaClock className="mr-2" />
                Opening Hours
              </label>
              <input
                type="text"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                placeholder="e.g., 9:00 AM - 11:00 PM"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Delivery Time */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaClock className="mr-2" />
                Estimated Delivery Time (minutes)
              </label>
              <input
                type="text"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                placeholder="e.g., 30-45"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                loading={loading}
                icon={<FaSave />}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
