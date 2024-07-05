import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";

// ==============================|| GUEST GUARD ||============================== //

/**
 * Guest guard for routes having no auth required
 * @param {PropTypes.node} children children element/node
 */

const GuestGuard = ({ children }: any) => {
  const { authData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authData) {
      console.log(authData);
      if (localStorage.getItem("type") == "parent") {
        navigate("/v1/", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [authData, navigate]);

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default GuestGuard;
