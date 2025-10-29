import { useState, useEffect } from 'react';
import { FaStore, FaSearch, FaCheck, FaTimes, FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';
import AdminHeader from '../../components/layout/AdminHeader';
import Footer from '../../components/layout/Footer';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import { getAllRestaurants, approveRestaurant, rejectRestaurant } from '../../api/restaurantService';
import { toast } from 'react-toastify';

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const data = await getAllRestaurants();
      setRestaurants(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Failed to load restaurants');
      setLoading(false);
    }
  };

  const handleApprove = async (restaurantId, restaurantName) => {
    try {
      await approveRestaurant(restaurantId);
      toast.success(`${restaurantName} approved successfully!`);
      fetchRestaurants();
      if (selectedRestaurant && selectedRestaurant._id === restaurantId) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error approving restaurant:', error);
      toast.error('Failed to approve restaurant');
    }
  };

  const handleReject = async (restaurantId, restaurantName) => {
    if (!window.confirm(`Are you sure you want to reject "${restaurantName}"?`)) {
      return;
    }

    try {
      await rejectRestaurant(restaurantId);
      toast.success(`${restaurantName} rejected`);
      fetchRestaurants();
      if (selectedRestaurant && selectedRestaurant._id === restaurantId) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error rejecting restaurant:', error);
      toast.error('Failed to reject restaurant');
    }
  };

  const handleViewDetails = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || restaurant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AdminHeader />
        <Loading fullScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Restaurant Management</h1>
          <p className="text-gray-600">Approve or reject restaurant registrations</p>
        </div>

        {/* Search and Filter */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({restaurants.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({restaurants.filter(r => r.status === 'pending').length})
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === 'approved'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Approved ({restaurants.filter(r => r.status === 'approved').length})
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === 'rejected'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Rejected ({restaurants.filter(r => r.status === 'rejected').length})
              </button>
            </div>
          </div>
        </Card>

        {/* Restaurants Grid */}
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <FaStore className="text-gray-300 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No restaurants found</h2>
            <p className="text-gray-600">
              {searchTerm ? 'Try a different search term' : 'No restaurants registered yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Card key={restaurant._id} className="p-6">
                {/* Restaurant Info */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      restaurant.status === 'approved' ? 'bg-green-100 text-green-800' :
                      restaurant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {restaurant.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {restaurant.description || 'No description'}
                  </p>

                  <div className="space-y-2 text-sm text-gray-600">
                    {restaurant.cuisineType && (
                      <p className="flex items-center">
                        <FaStore className="mr-2 flex-shrink-0" />
                        <span>{restaurant.cuisineType}</span>
                      </p>
                    )}
                    {restaurant.address && (
                      <p className="flex items-start">
                        <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
                        <span className="line-clamp-2">{restaurant.address}</span>
                      </p>
                    )}
                    {restaurant.phone && (
                      <p className="flex items-center">
                        <FaPhone className="mr-2 flex-shrink-0" />
                        <span>{restaurant.phone}</span>
                      </p>
                    )}
                    {restaurant.openingHours && (
                      <p className="flex items-center">
                        <FaClock className="mr-2 flex-shrink-0" />
                        <span>{restaurant.openingHours}</span>
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Joined: {formatDate(restaurant.createdAt)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleViewDetails(restaurant)}
                    className="w-full"
                  >
                    View Details
                  </Button>

                  {restaurant.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        icon={<FaCheck />}
                        onClick={() => handleApprove(restaurant._id, restaurant.name)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={<FaTimes />}
                        onClick={() => handleReject(restaurant._id, restaurant.name)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Restaurant Details Modal */}
      {selectedRestaurant && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedRestaurant.name}
        >
          <div className="space-y-4">
            {/* Status */}
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedRestaurant.status === 'approved' ? 'bg-green-100 text-green-800' :
                  selectedRestaurant.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedRestaurant.status}
                </span>
              </div>
            </div>

            {/* Description */}
            {selectedRestaurant.description && (
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="mt-1 text-gray-900">{selectedRestaurant.description}</p>
              </div>
            )}

            {/* Cuisine Type */}
            {selectedRestaurant.cuisineType && (
              <div>
                <label className="text-sm font-medium text-gray-700">Cuisine Type</label>
                <p className="mt-1 text-gray-900">{selectedRestaurant.cuisineType}</p>
              </div>
            )}

            {/* Address */}
            {selectedRestaurant.address && (
              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <p className="mt-1 text-gray-900">{selectedRestaurant.address}</p>
              </div>
            )}

            {/* Contact */}
            <div className="grid grid-cols-2 gap-4">
              {selectedRestaurant.email && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-gray-900 text-sm">{selectedRestaurant.email}</p>
                </div>
              )}
              {selectedRestaurant.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-gray-900">{selectedRestaurant.phone}</p>
                </div>
              )}
            </div>

            {/* Opening Hours */}
            {selectedRestaurant.openingHours && (
              <div>
                <label className="text-sm font-medium text-gray-700">Opening Hours</label>
                <p className="mt-1 text-gray-900">{selectedRestaurant.openingHours}</p>
              </div>
            )}

            {/* Delivery Time */}
            {selectedRestaurant.deliveryTime && (
              <div>
                <label className="text-sm font-medium text-gray-700">Delivery Time</label>
                <p className="mt-1 text-gray-900">{selectedRestaurant.deliveryTime} mins</p>
              </div>
            )}

            {/* Joined Date */}
            <div>
              <label className="text-sm font-medium text-gray-700">Joined Date</label>
              <p className="mt-1 text-gray-900">{formatDate(selectedRestaurant.createdAt)}</p>
            </div>

            {/* Action Buttons */}
            {selectedRestaurant.status === 'pending' && (
              <div className="flex gap-3 pt-4">
                <Button
                  icon={<FaCheck />}
                  onClick={() => handleApprove(selectedRestaurant._id, selectedRestaurant.name)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Approve
                </Button>
                <Button
                  variant="secondary"
                  icon={<FaTimes />}
                  onClick={() => handleReject(selectedRestaurant._id, selectedRestaurant.name)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default RestaurantManagement;
