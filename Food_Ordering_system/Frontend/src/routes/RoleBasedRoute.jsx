import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPaths = {
      user: '/user/home',
      restaurant: '/restaurant/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={redirectPaths[user.role] || '/'} replace />;
  }

  return children;
};

export default RoleBasedRoute;
