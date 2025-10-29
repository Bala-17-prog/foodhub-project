import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaWeight, FaRulerVertical, FaBirthdayCake, FaBullseye, 
  FaFire, FaDrumstickBite, FaBreadSlice, FaCheese, FaLeaf,
  FaDownload, FaArrowLeft, FaCheck
} from 'react-icons/fa';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { getDietPlanById } from '../../api/dietPlanService';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';

const DietPlanView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDietPlan();
  }, [id]);

  const fetchDietPlan = async () => {
    try {
      const data = await getDietPlanById(id);
      setDietPlan(data);
    } catch (error) {
      toast.error('Failed to load diet plan');
      navigate('/user/diet-plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([dietPlan.dietPlan], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `diet-plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Diet plan downloaded!');
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

  if (!dietPlan) {
    return null;
  }

  const goalLabels = {
    lose_weight: 'Lose Weight',
    gain_muscle: 'Gain Muscle',
    maintain_weight: 'Maintain Weight',
    get_fit: 'Get Fit',
    increase_energy: 'Increase Energy',
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <UserHeader />

      <div className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={() => navigate('/user/diet-plans')}>
              <FaArrowLeft className="mr-2" />
              Back to Plans
            </Button>
            <Button onClick={handleDownload} icon={<FaDownload />}>
              Download Plan
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <FaWeight className="text-3xl text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{dietPlan.weight} kg</div>
              <div className="text-sm text-gray-600">Weight</div>
            </Card>

            <Card className="p-4 text-center">
              <FaRulerVertical className="text-3xl text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{dietPlan.height} cm</div>
              <div className="text-sm text-gray-600">Height</div>
            </Card>

            <Card className="p-4 text-center">
              <FaBirthdayCake className="text-3xl text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{dietPlan.age} yrs</div>
              <div className="text-sm text-gray-600">Age</div>
            </Card>

            <Card className="p-4 text-center">
              <FaBullseye className="text-3xl text-green-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-gray-900">{goalLabels[dietPlan.fitnessGoal]}</div>
              <div className="text-xs text-gray-600">Fitness Goal</div>
            </Card>
          </div>

          {/* Key Metrics */}
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Key Metrics</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <FaFire className="text-2xl text-primary-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Daily Calories</div>
                  <div className="text-2xl font-bold text-gray-900">{dietPlan.dailyCalories}</div>
                  <div className="text-xs text-gray-500">kcal/day</div>
                </div>
              </div>

                <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <FaWeight className="text-2xl text-primary-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">BMI</div>
                  <div className="text-2xl font-bold text-gray-900">{dietPlan.bmi}</div>
                  <div className="text-xs text-gray-500">
                    {dietPlan.bmi < 18.5 ? 'Underweight' : 
                     dietPlan.bmi < 25 ? 'Normal' : 
                     dietPlan.bmi < 30 ? 'Overweight' : 'Obese'}
                  </div>
                </div>
              </div>

                <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <FaFire className="text-2xl text-primary-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">BMR</div>
                  <div className="text-2xl font-bold text-gray-900">{Math.round(dietPlan.bmr)}</div>
                  <div className="text-xs text-gray-500">kcal/day</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Macronutrient Breakdown */}
          {dietPlan.nutritionBreakdown && (
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Macronutrients</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <FaDrumstickBite className="text-4xl text-primary-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900">{dietPlan.nutritionBreakdown.protein}g</div>
                  <div className="text-sm text-gray-600">Protein</div>
                </div>

                <div className="text-center">
                  <FaBreadSlice className="text-4xl text-primary-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900">{dietPlan.nutritionBreakdown.carbs}g</div>
                  <div className="text-sm text-gray-600">Carbs</div>
                </div>

                <div className="text-center">
                  <FaCheese className="text-4xl text-primary-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900">{dietPlan.nutritionBreakdown.fats}g</div>
                  <div className="text-sm text-gray-600">Fats</div>
                </div>

                <div className="text-center">
                  <FaLeaf className="text-4xl text-green-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900">{dietPlan.nutritionBreakdown.fiber}g</div>
                  <div className="text-sm text-gray-600">Fiber</div>
                </div>
              </div>
            </Card>
          )}

          {/* Diet Plan Content */}
          <Card className="p-6 md:p-8">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{dietPlan.dietPlan}</ReactMarkdown>
            </div>
          </Card>

          {/* Action Section */}
          <div className="mt-8 text-center">
            <Card className="p-6 bg-primary-50 border-2 border-primary-200">
              <FaCheck className="text-4xl text-primary-600 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Start?</h3>
              <p className="text-gray-600 mb-4">
                Follow this plan consistently and track your progress. You can create a new plan anytime.
              </p>
              <Button onClick={() => navigate('/user/diet-plans')}>
                View All Plans
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DietPlanView;
