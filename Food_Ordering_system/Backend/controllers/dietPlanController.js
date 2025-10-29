import DietPlan from '../models/DietPlan.js';
import OpenAI from 'openai';

// Initialize OpenAI (you can also use free alternatives like Groq, Cohere, etc.)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Calculate BMI
const calculateBMI = (weight, height) => {
  // weight in kg, height in cm
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(2);
};

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// Calculate Daily Calorie Needs
const calculateDailyCalories = (bmr, activityLevel, fitnessGoal) => {
  let activityMultiplier = 1.2; // sedentary
  
  switch (activityLevel) {
    case 'lightly_active':
      activityMultiplier = 1.375;
      break;
    case 'moderately_active':
      activityMultiplier = 1.55;
      break;
    case 'very_active':
      activityMultiplier = 1.725;
      break;
    case 'extremely_active':
      activityMultiplier = 1.9;
      break;
  }
  
  let calories = bmr * activityMultiplier;
  
  // Adjust based on fitness goal
  switch (fitnessGoal) {
    case 'lose_weight':
      calories -= 500; // 500 calorie deficit
      break;
    case 'gain_muscle':
      calories += 300; // 300 calorie surplus
      break;
    case 'maintain_weight':
    case 'get_fit':
    case 'increase_energy':
      // No adjustment
      break;
  }
  
  return Math.round(calories);
};

// Generate AI Diet Plan (fallback to rule-based if no API key)
const generateAIDietPlan = async (userData) => {
  const { weight, height, age, gender, fitnessGoal, activityLevel, dietaryPreferences, bmi, bmr, dailyCalories } = userData;
  
  const goalText = {
    lose_weight: 'lose weight',
    gain_muscle: 'gain muscle mass',
    maintain_weight: 'maintain current weight',
    get_fit: 'improve overall fitness',
    increase_energy: 'increase energy levels',
  }[fitnessGoal];
  
  const prompt = `You are a professional nutritionist and fitness expert. Create a detailed personalized diet plan for the following person:

Age: ${age} years
Gender: ${gender}
Weight: ${weight} kg
Height: ${height} cm
BMI: ${bmi}
BMR: ${bmr} calories/day
Daily Calorie Target: ${dailyCalories} calories
Fitness Goal: ${goalText}
Activity Level: ${activityLevel.replace('_', ' ')}
Dietary Preferences: ${dietaryPreferences.join(', ') || 'None specified'}

Please provide:
1. A comprehensive daily meal plan with 5 meals (breakfast, mid-morning snack, lunch, evening snack, dinner)
2. Specific food items and portion sizes for each meal
3. Macronutrient breakdown (protein, carbs, fats, fiber in grams)
4. 5-7 practical recommendations and tips
5. Foods to avoid based on their goal

Format the response as a structured diet plan with clear sections.`;

  try {
    if (openai) {
      // Use OpenAI API
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 1500,
      });
      
      return completion.choices[0].message.content;
    } else {
      // Fallback to rule-based plan
      return generateRuleBasedPlan(userData);
    }
  } catch (error) {
    console.error('AI generation error:', error);
    return generateRuleBasedPlan(userData);
  }
};

// Rule-based fallback plan
const generateRuleBasedPlan = (userData) => {
  const { weight, height, age, gender, fitnessGoal, dailyCalories, dietaryPreferences } = userData;
  
  const isVegetarian = dietaryPreferences.includes('vegetarian') || dietaryPreferences.includes('vegan');
  
  let plan = `# Personalized Diet Plan\n\n`;
  plan += `## Your Profile\n`;
  plan += `- **Age:** ${age} years\n`;
  plan += `- **Gender:** ${gender}\n`;
  plan += `- **Weight:** ${weight} kg\n`;
  plan += `- **Height:** ${height} cm\n`;
  plan += `- **Daily Calorie Target:** ${dailyCalories} calories\n`;
  plan += `- **Fitness Goal:** ${fitnessGoal.replace('_', ' ')}\n\n`;
  
  plan += `## Daily Meal Plan\n\n`;
  
  if (fitnessGoal === 'lose_weight') {
    plan += `### Breakfast (${Math.round(dailyCalories * 0.25)} calories)\n`;
    plan += isVegetarian 
      ? `- 2 whole wheat toast with peanut butter\n- 1 banana\n- Green tea\n\n`
      : `- 3 egg whites omelet with vegetables\n- 2 whole wheat toast\n- 1 orange\n- Black coffee\n\n`;
    
    plan += `### Mid-Morning Snack (${Math.round(dailyCalories * 0.10)} calories)\n`;
    plan += `- 1 apple with a handful of almonds (10-12)\n\n`;
    
    plan += `### Lunch (${Math.round(dailyCalories * 0.35)} calories)\n`;
    plan += isVegetarian
      ? `- 1 cup brown rice\n- 1 cup mixed dal (lentils)\n- Mixed vegetable curry\n- Salad\n- Buttermilk\n\n`
      : `- Grilled chicken breast (150g)\n- 1 cup brown rice\n- Steamed vegetables\n- Green salad\n\n`;
    
    plan += `### Evening Snack (${Math.round(dailyCalories * 0.10)} calories)\n`;
    plan += `- Low-fat yogurt with berries\n- Green tea\n\n`;
    
    plan += `### Dinner (${Math.round(dailyCalories * 0.20)} calories)\n`;
    plan += isVegetarian
      ? `- 2 whole wheat rotis\n- Paneer curry\n- Vegetable soup\n- Cucumber salad\n\n`
      : `- Grilled fish (120g)\n- Steamed broccoli and carrots\n- Quinoa (1/2 cup)\n- Mixed green salad\n\n`;
  } else if (fitnessGoal === 'gain_muscle') {
    plan += `### Breakfast (${Math.round(dailyCalories * 0.25)} calories)\n`;
    plan += isVegetarian
      ? `- 3 whole wheat toast with almond butter\n- Protein smoothie (banana, oats, protein powder)\n- Mixed nuts\n\n`
      : `- 4 whole eggs (2 yolks + 4 whites)\n- 3 whole wheat toast\n- Protein shake\n- 1 banana\n\n`;
    
    plan += `### Mid-Morning Snack (${Math.round(dailyCalories * 0.15)} calories)\n`;
    plan += `- Greek yogurt with granola\n- Mixed nuts (20-25)\n\n`;
    
    plan += `### Lunch (${Math.round(dailyCalories * 0.30)} calories)\n`;
    plan += isVegetarian
      ? `- 1.5 cups brown rice\n- Rajma (kidney beans) curry\n- Paneer bhurji\n- Salad\n- Lassi\n\n`
      : `- Grilled chicken breast (200g)\n- 1.5 cups brown rice\n- Mixed vegetables\n- Sweet potato\n\n`;
    
    plan += `### Evening Snack (${Math.round(dailyCalories * 0.10)} calories)\n`;
    plan += `- Protein bar or shake\n- Handful of almonds\n\n`;
    
    plan += `### Dinner (${Math.round(dailyCalories * 0.20)} calories)\n`;
    plan += isVegetarian
      ? `- 3 whole wheat rotis\n- Chickpea curry\n- Tofu stir-fry\n- Salad\n\n`
      : `- Grilled salmon (150g)\n- Quinoa (1 cup)\n- Roasted vegetables\n- Avocado salad\n\n`;
  } else {
    // Maintain weight / Get fit
    plan += `### Breakfast (${Math.round(dailyCalories * 0.25)} calories)\n`;
    plan += `- Oatmeal with fruits and nuts\n- 2 boiled eggs (or tofu for vegetarians)\n- Green tea\n\n`;
    
    plan += `### Mid-Morning Snack (${Math.round(dailyCalories * 0.10)} calories)\n`;
    plan += `- Fresh fruit\n- Handful of mixed nuts\n\n`;
    
    plan += `### Lunch (${Math.round(dailyCalories * 0.35)} calories)\n`;
    plan += `- 1 cup brown rice or whole wheat rotis\n- Protein source (chicken/fish/paneer/dal)\n- Vegetables\n- Salad\n\n`;
    
    plan += `### Evening Snack (${Math.round(dailyCalories * 0.10)} calories)\n`;
    plan += `- Yogurt or smoothie\n- Fruits\n\n`;
    
    plan += `### Dinner (${Math.round(dailyCalories * 0.20)} calories)\n`;
    plan += `- Light protein source\n- Vegetables\n- Whole grains\n- Soup\n\n`;
  }
  
  // Macronutrient breakdown
  const proteinGrams = fitnessGoal === 'gain_muscle' 
    ? Math.round(weight * 2) 
    : Math.round(weight * 1.5);
  const fatsGrams = Math.round(dailyCalories * 0.25 / 9);
  const carbsGrams = Math.round((dailyCalories - (proteinGrams * 4) - (fatsGrams * 9)) / 4);
  
  plan += `## Macronutrient Breakdown\n`;
  plan += `- **Protein:** ${proteinGrams}g per day\n`;
  plan += `- **Carbohydrates:** ${carbsGrams}g per day\n`;
  plan += `- **Fats:** ${fatsGrams}g per day\n`;
  plan += `- **Fiber:** ${Math.round(age < 50 ? 25 : 21)}g per day\n\n`;
  
  plan += `## Recommendations\n`;
  plan += `1. Drink 8-10 glasses of water daily\n`;
  plan += `2. ${fitnessGoal === 'gain_muscle' ? 'Focus on strength training 4-5 days a week' : 'Include 30-45 minutes of cardio 5 days a week'}\n`;
  plan += `3. Get 7-9 hours of quality sleep\n`;
  plan += `4. Avoid processed foods, sugary drinks, and excessive salt\n`;
  plan += `5. Eat every 3-4 hours to maintain metabolism\n`;
  plan += `6. Track your progress weekly\n`;
  plan += `7. ${fitnessGoal === 'lose_weight' ? 'Practice portion control and mindful eating' : 'Ensure adequate protein intake post-workout'}\n\n`;
  
  plan += `## Foods to Avoid\n`;
  if (fitnessGoal === 'lose_weight') {
    plan += `- Fried foods and fast food\n`;
    plan += `- Sugary desserts and beverages\n`;
    plan += `- White bread and refined carbs\n`;
    plan += `- Excessive alcohol\n`;
  } else {
    plan += `- Processed junk food\n`;
    plan += `- Excessive sugar\n`;
    plan += `- Trans fats\n`;
    plan += `- Too much caffeine\n`;
  }
  
  return plan;
};

// @desc    Create new diet plan
// @route   POST /api/diet-plan
// @access  Private
export const createDietPlan = async (req, res) => {
  try {
    const { weight, height, age, gender, fitnessGoal, activityLevel, dietaryPreferences } = req.body;
    
    // Validate inputs
    if (!weight || !height || !age || !gender || !fitnessGoal) {
      return res.status(400).json({ message: 'Please provide all required information' });
    }
    
    // Calculate metrics
    const bmi = calculateBMI(weight, height);
    const bmr = calculateBMR(weight, height, age, gender);
    const dailyCalories = calculateDailyCalories(bmr, activityLevel || 'moderately_active', fitnessGoal);
    
    // Prepare user data
    const userData = {
      weight,
      height,
      age,
      gender,
      fitnessGoal,
      activityLevel: activityLevel || 'moderately_active',
      dietaryPreferences: dietaryPreferences || [],
      bmi,
      bmr,
      dailyCalories,
    };
    
    // Generate AI diet plan
    const aiGeneratedPlan = await generateAIDietPlan(userData);
    
    // Parse meal plan and nutrition from AI response (basic extraction)
    const proteinGrams = fitnessGoal === 'gain_muscle' ? Math.round(weight * 2) : Math.round(weight * 1.5);
    const fatsGrams = Math.round(dailyCalories * 0.25 / 9);
    const carbsGrams = Math.round((dailyCalories - (proteinGrams * 4) - (fatsGrams * 9)) / 4);
    
    // Create diet plan
    const dietPlan = await DietPlan.create({
      user: req.user._id,
      weight,
      height,
      age,
      gender,
      fitnessGoal,
      activityLevel: activityLevel || 'moderately_active',
      dietaryPreferences: dietaryPreferences || [],
      bmi,
      bmr,
      dailyCalories,
      dietPlan: aiGeneratedPlan,
      nutritionBreakdown: {
        protein: proteinGrams,
        carbs: carbsGrams,
        fats: fatsGrams,
        fiber: age < 50 ? 25 : 21,
      },
    });
    
    res.status(201).json(dietPlan);
  } catch (error) {
    console.error('Create diet plan error:', error);
    res.status(500).json({ message: 'Failed to create diet plan', error: error.message });
  }
};

// @desc    Get user's diet plans
// @route   GET /api/diet-plan
// @access  Private
export const getUserDietPlans = async (req, res) => {
  try {
    const dietPlans = await DietPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(dietPlans);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch diet plans' });
  }
};

// @desc    Get single diet plan
// @route   GET /api/diet-plan/:id
// @access  Private
export const getDietPlanById = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);
    
    if (!dietPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }
    
    // Check ownership
    if (dietPlan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this diet plan' });
    }
    
    res.json(dietPlan);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch diet plan' });
  }
};

// @desc    Update diet plan status
// @route   PUT /api/diet-plan/:id
// @access  Private
export const updateDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);
    
    if (!dietPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }
    
    if (dietPlan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    dietPlan.status = req.body.status || dietPlan.status;
    await dietPlan.save();
    
    res.json(dietPlan);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update diet plan' });
  }
};

// @desc    Delete diet plan
// @route   DELETE /api/diet-plan/:id
// @access  Private
export const deleteDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findById(req.params.id);
    
    if (!dietPlan) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }
    
    if (dietPlan.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await dietPlan.deleteOne();
    res.json({ message: 'Diet plan deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete diet plan' });
  }
};
