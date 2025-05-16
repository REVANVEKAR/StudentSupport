import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleBasedRoute = ({ children, requiredRole }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user has required role
  const hasRequiredRole = Array.isArray(requiredRole)
    ? requiredRole.includes(user.role)
    : user.role === requiredRole;

  if (!hasRequiredRole) {
    // Redirect based on role
    if (user.role === 'student') {
      return <Navigate to="/student-dashboard" />;
    } else if (user.role === 'teacher' || user.role === 'admin') {
      return <Navigate to="/teacher-dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default RoleBasedRoute;