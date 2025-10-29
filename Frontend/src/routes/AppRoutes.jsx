import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// User Pages
import Home from '../pages/user/Home';
import RestaurantList from '../pages/user/RestaurantList';
import RestaurantMenu from '../pages/user/RestaurantMenu';
import Cart from '../pages/user/Cart';
import Checkout from '../pages/user/Checkout';
import Orders from '../pages/user/Orders';
import Profile from '../pages/user/Profile';
import DietPlannerForm from '../pages/user/DietPlannerForm';
import DietPlanView from '../pages/user/DietPlanView';
import DietPlansList from '../pages/user/DietPlansList';

// Restaurant Pages
import RestaurantDashboard from '../pages/restaurant/Dashboard';
import FoodManagement from '../pages/restaurant/FoodManagement';
import RestaurantOrders from '../pages/restaurant/Orders';
import RestaurantSettings from '../pages/restaurant/Settings';

// Admin Pages
import AdminDashboard from '../pages/admin/DashBoard';
import UserManagement from '../pages/admin/UserManagement';
import RestaurantManagement from '../pages/admin/RestaurantManagement';
import AdminOrders from '../pages/admin/Orders';

const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  // Redirect based on role after login
  const getDashboardRoute = () => {
    if (!isAuthenticated()) return '/login';
    
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'restaurant':
        return '/restaurant/dashboard';
      case 'user':
      default:
        return '/user/home';
    }
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to={getDashboardRoute()} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes */}
      <Route
        path="/user/home"
        element={
          <RoleBasedRoute allowedRoles={['user']}>
            <Home />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/user/restaurants"
        element={
          <RoleBasedRoute allowedRoles={['user']}>
            <RestaurantList />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/user/restaurant/:id"
        element={
          <RoleBasedRoute allowedRoles={['user']}>
            <RestaurantMenu />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/user/cart"
        element={
          <RoleBasedRoute allowedRoles={['user']}>
            <Cart />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/user/checkout"
        element={
          <RoleBasedRoute allowedRoles={['user']}>
            <Checkout />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/user/orders"
        element={
          <RoleBasedRoute allowedRoles={['user']}>
            <Orders />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <RoleBasedRoute allowedRoles={['user']}>
            <Profile />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/user/diet-planner"
        element={
          <RoleBasedRoute allowedRoles={['user']}>
            <DietPlannerForm />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/user/diet-plans"
        element={
          <RoleBasedRoute allowedRoles={['user']}>
            <DietPlansList />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/user/diet-plan/:id"
        element={
          <RoleBasedRoute allowedRoles={['user']}>
            <DietPlanView />
          </RoleBasedRoute>
        }
      />

      {/* Restaurant Routes */}
      <Route
        path="/restaurant/dashboard"
        element={
          <RoleBasedRoute allowedRoles={['restaurant']}>
            <RestaurantDashboard />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/restaurant/foods"
        element={
          <RoleBasedRoute allowedRoles={['restaurant']}>
            <FoodManagement />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/restaurant/orders"
        element={
          <RoleBasedRoute allowedRoles={['restaurant']}>
            <RestaurantOrders />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/restaurant/settings"
        element={
          <RoleBasedRoute allowedRoles={['restaurant']}>
            <RestaurantSettings />
          </RoleBasedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <UserManagement />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/restaurants"
        element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <RestaurantManagement />
          </RoleBasedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <RoleBasedRoute allowedRoles={['admin']}>
            <AdminOrders />
          </RoleBasedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
