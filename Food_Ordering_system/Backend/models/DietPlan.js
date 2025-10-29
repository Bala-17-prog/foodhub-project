import mongoose from 'mongoose';

const dietPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // User Inputs
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    fitnessGoal: {
      type: String,
      enum: ['lose_weight', 'gain_muscle', 'maintain_weight', 'get_fit', 'increase_energy'],
      required: true,
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active'],
      default: 'moderately_active',
    },
    dietaryPreferences: {
      type: [String],
      enum: ['vegetarian', 'vegan', 'non_vegetarian', 'gluten_free', 'dairy_free', 'keto', 'paleo'],
      default: [],
    },
    // Calculated Values
    bmi: {
      type: Number,
    },
    bmr: {
      type: Number,
    },
    dailyCalories: {
      type: Number,
    },
    // AI Generated Plan
    dietPlan: {
      type: String,
      required: true,
    },
    mealPlan: {
      breakfast: { type: String },
      midMorningSnack: { type: String },
      lunch: { type: String },
      eveningSnack: { type: String },
      dinner: { type: String },
    },
    nutritionBreakdown: {
      protein: { type: Number },
      carbs: { type: Number },
      fats: { type: Number },
      fiber: { type: Number },
    },
    recommendations: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const DietPlan = mongoose.model('DietPlan', dietPlanSchema);

export default DietPlan;
