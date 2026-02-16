import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext"; // adjust path if needed

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // Not logged in
  if (!user.user_id) {
    return <Navigate to="/" replace />;
  }


  return children;
}

export default ProtectedRoute;