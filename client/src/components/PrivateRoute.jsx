import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  //if (!token) return <Navigate to="/login" replace />;
  if (!user) return <Navigate to="/login" replace />;

  if (user && allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default PrivateRoute;
