import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuth();
  console.log("isAuthenticated:", isAuthenticated);

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
