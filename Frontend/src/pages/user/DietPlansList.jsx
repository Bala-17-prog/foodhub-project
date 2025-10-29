import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, FaEye, FaTrash, FaCalendarAlt, FaBullseye,
  FaWeight, FaFire, FaUtensils
} from 'react-icons/fa';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { getUserDietPlans, deleteDietPlan } from '../../api/dietPlanService';
import { toast } from 'react-toastify';

const DietPlansList = () => {
  const navigate = useNavigate();
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    try {
      const data = await getUserDietPlans();
      setDietPlans(data);
    } catch (error) {
      toast.error('Failed to load diet plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this diet plan?')) {
      try {
        await deleteDietPlan(id);
        toast.success('Diet plan deleted');
        fetchDietPlans();
      } catch (error) {
        toast.error('Failed to delete diet plan');
      }
    }
  };

  const goalLabels = {
    lose_weight: 'Lose Weight',
    gain_muscle: 'Gain Muscle',
    maintain_weight: 'Maintain Weight',
    get_fit: 'Get Fit',
    increase_energy: 'Increase Energy',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <UserHeader />
        <div className="flex-1 flex items-center justify-center">
          <Loading />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserHeader />

      <div className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Diet Plans</h1>
              <p className="text-gray-600">Personalized nutrition plans powered by AI</p>
            </div>
            <Button
              onClick={() => navigate('/user/diet-planner')}
              icon={<FaPlus />}
              className="mt-4 md:mt-0"
            >
              Create New Plan
            </Button>
          </div>

          {/* No Plans */}
          {dietPlans.length === 0 ? (
            <div className="text-center py-16">
              <FaUtensils className="text-gray-300 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Diet Plans Yet</h2>
              <p className="text-gray-600 mb-6">
                Create your first AI-powered personalized diet plan
              </p>
              <Button
                onClick={() => navigate('/user/diet-planner')}
                icon={<FaPlus />}
              >
                Get Started
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dietPlans.map((plan) => (
                <Card key={plan._id} className="overflow-hidden hover:shadow-lg transition">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary-500 to-orange-500 p-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FaBullseye className="mr-2" />
                        <span className="font-semibold">{goalLabels[plan.fitnessGoal]}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plan.status === 'active' 
                          ? 'bg-green-500' 
                          : plan.status === 'completed'
                          ? 'bg-blue-500'
                          : 'bg-gray-500'
                      }`}>
                        {plan.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm opacity-90">
                      <FaCalendarAlt className="mr-2" />
                      {new Date(plan.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <FaWeight className="text-blue-600 text-xl mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">{plan.weight} kg</div>
                        <div className="text-xs text-gray-600">Weight</div>
                      </div>

                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <FaFire className="text-orange-600 text-xl mx-auto mb-1" />
                        <div className="text-lg font-bold text-gray-900">{plan.dailyCalories}</div>
                        <div className="text-xs text-gray-600">Daily Calories</div>
                      </div>
                    </div>

                    {/* BMI Badge */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="px-4 py-2 bg-primary-100 rounded-full">
                        <span className="text-sm font-medium text-primary-700">
                          BMI: {plan.bmi}
                        </span>
                      </div>
                    </div>

                    {/* Dietary Preferences */}
                    {plan.dietaryPreferences && plan.dietaryPreferences.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {plan.dietaryPreferences.slice(0, 3).map((pref) => (
                          <span
                            key={pref}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                          >
                            {pref.replace('_', ' ')}
                          </span>
                        ))}
                        {plan.dietaryPreferences.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{plan.dietaryPreferences.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigate(`/user/diet-plan/${plan._id}`)}
                        fullWidth
                        size="sm"
                      >
                        <FaEye className="mr-2" />
                        View Plan
                      </Button>
                      <Button
                        onClick={() => handleDelete(plan._id)}
                        variant="danger"
                        size="sm"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DietPlansList;
