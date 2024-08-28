import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }: any) => {
  const { authData } = useAuth();
  const navigate = useNavigate();
  const currentPath = window.location.pathname;

  useEffect(() => {
    const step = localStorage.getItem("step");
    if (!authData) {
      navigate("/auth/login", { replace: true });
    } else if (step) {
      navigate("/register");
    }
  }, [authData, navigate]);

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;
