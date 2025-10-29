import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaWeight, FaRulerVertical, FaBirthdayCake, FaVenusMars, 
  FaBullseye, FaRunning, FaLeaf, FaArrowRight, FaArrowLeft,
  FaCheckCircle, FaSpinner
} from 'react-icons/fa';
import UserHeader from '../../components/layout/UserHeader';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { createDietPlan } from '../../api/dietPlanService';
import { toast } from 'react-toastify';

const DietPlannerForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: '',
    fitnessGoal: '',
    activityLevel: 'moderately_active',
    dietaryPreferences: [],
  });

  const totalSteps = 7;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDietaryPreference = (preference) => {
    const newPreferences = formData.dietaryPreferences.includes(preference)
      ? formData.dietaryPreferences.filter((p) => p !== preference)
      : [...formData.dietaryPreferences, preference];
    
    setFormData({
      ...formData,
      dietaryPreferences: newPreferences,
    });
  };

  const nextStep = () => {
    // Validation for each step
    if (currentStep === 1 && !formData.weight) {
      toast.error('Please enter your weight');
      return;
    }
    if (currentStep === 2 && !formData.height) {
      toast.error('Please enter your height');
      return;
    }
    if (currentStep === 3 && !formData.age) {
      toast.error('Please enter your age');
      return;
    }
    if (currentStep === 4 && !formData.gender) {
      toast.error('Please select your gender');
      return;
    }
    if (currentStep === 5 && !formData.fitnessGoal) {
      toast.error('Please select your fitness goal');
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const dietPlan = await createDietPlan(formData);
      toast.success('Diet plan generated successfully!');
      navigate(`/user/diet-plan/${dietPlan._id}`);
    } catch (error) {
      console.error('Diet plan creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate diet plan');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaWeight className="text-6xl text-primary-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">What's your weight?</h2>
              <p className="text-gray-600">Enter your current weight in kilograms</p>
            </div>
            <div className="max-w-xs mx-auto">
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 70"
                min="20"
                max="300"
                step="0.1"
                className="w-full px-6 py-4 text-2xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
              <p className="text-center text-gray-500 mt-2 text-sm">kg</p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaRulerVertical className="text-6xl text-primary-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">How tall are you?</h2>
              <p className="text-gray-600">Enter your height in centimeters</p>
            </div>
            <div className="max-w-xs mx-auto">
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g., 170"
                min="100"
                max="250"
                className="w-full px-6 py-4 text-2xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
              <p className="text-center text-gray-500 mt-2 text-sm">cm</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaBirthdayCake className="text-6xl text-primary-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">What's your age?</h2>
              <p className="text-gray-600">Enter your age in years</p>
            </div>
            <div className="max-w-xs mx-auto">
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g., 25"
                min="13"
                max="100"
                className="w-full px-6 py-4 text-2xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                autoFocus
              />
              <p className="text-center text-gray-500 mt-2 text-sm">years</p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaVenusMars className="text-6xl text-primary-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">What's your gender?</h2>
              <p className="text-gray-600">This helps us calculate your calorie needs</p>
            </div>
            <div className="max-w-md mx-auto space-y-3">
              {['male', 'female', 'other'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => {
                    setFormData({ ...formData, gender });
                    setTimeout(nextStep, 300);
                  }}
                  className={`w-full p-4 text-lg font-semibold rounded-lg border-2 transition ${
                    formData.gender === gender
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-primary-300 text-gray-700'
                  }`}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaBullseye className="text-6xl text-primary-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">What's your fitness goal?</h2>
              <p className="text-gray-600">Choose your primary objective</p>
            </div>
            <div className="max-w-md mx-auto space-y-3">
              {[
                { value: 'lose_weight', label: 'Lose Weight', desc: 'Reduce body fat' },
                { value: 'gain_muscle', label: 'Gain Muscle', desc: 'Build muscle mass' },
                { value: 'maintain_weight', label: 'Maintain Weight', desc: 'Stay at current weight' },
                { value: 'get_fit', label: 'Get Fit', desc: 'Improve overall fitness' },
                { value: 'increase_energy', label: 'Increase Energy', desc: 'Boost energy levels' },
              ].map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => {
                    setFormData({ ...formData, fitnessGoal: goal.value });
                    setTimeout(nextStep, 300);
                  }}
                  className={`w-full p-4 text-left rounded-lg border-2 transition ${
                    formData.fitnessGoal === goal.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{goal.label}</div>
                  <div className="text-sm text-gray-600">{goal.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaRunning className="text-6xl text-primary-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Activity Level</h2>
              <p className="text-gray-600">How active are you on a typical day?</p>
            </div>
            <div className="max-w-md mx-auto space-y-3">
              {[
                { value: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
                { value: 'lightly_active', label: 'Lightly Active', desc: 'Exercise 1-3 days/week' },
                { value: 'moderately_active', label: 'Moderately Active', desc: 'Exercise 3-5 days/week' },
                { value: 'very_active', label: 'Very Active', desc: 'Exercise 6-7 days/week' },
                { value: 'extremely_active', label: 'Extremely Active', desc: 'Physical job or intense training' },
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => {
                    setFormData({ ...formData, activityLevel: level.value });
                    setTimeout(nextStep, 300);
                  }}
                  className={`w-full p-4 text-left rounded-lg border-2 transition ${
                    formData.activityLevel === level.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-300'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{level.label}</div>
                  <div className="text-sm text-gray-600">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <FaLeaf className="text-6xl text-primary-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dietary Preferences</h2>
              <p className="text-gray-600">Select all that apply (optional)</p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-3">
                {[
                  'vegetarian',
                  'vegan',
                  'non_vegetarian',
                  'gluten_free',
                  'dairy_free',
                  'keto',
                  'paleo',
                ].map((pref) => (
                  <button
                    key={pref}
                    onClick={() => handleDietaryPreference(pref)}
                    className={`p-3 text-sm font-medium rounded-lg border-2 transition ${
                      formData.dietaryPreferences.includes(pref)
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-primary-300 text-gray-700'
                    }`}
                  >
                    {pref.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 to-orange-50">
      <UserHeader />

      <div className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-medium text-gray-700">{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Card */}
          <Card className="p-8 md:p-12">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  <FaArrowLeft className="mr-2" />
                  Back
                </Button>
              )}
              
              {currentStep < totalSteps ? (
                <Button onClick={nextStep} className="flex-1">
                  Next
                  <FaArrowRight className="ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="mr-2 animate-spin" />
                      Generating Your Plan...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="mr-2" />
                      Generate My Diet Plan
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DietPlannerForm;
