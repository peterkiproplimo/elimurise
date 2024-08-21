// import PropTypes from "prop-types";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../contexts/Auth";

// // ==============================|| GUEST GUARD ||============================== //

// /**
//  * Guest guard for routes having no auth required
//  * @param {PropTypes.node} children children element/node
//  */

// const GuestGuard = ({ children }: any) => {
//   const { authData } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (authData) {
//       console.log(authData);
//       if (localStorage.getItem("type") == "parent") {
//         navigate("/home/v1/", { replace: false });
//       } else if (localStorage.getItem("type") == "school") {
//         navigate("/home/", { replace: false });
//       } else if (localStorage.getItem("type") == "billing") {
//         navigate("/home/billing", { replace: false });
//       }
//     }
//   }, [authData, navigate]);

//   return children;
// };

// GuestGuard.propTypes = {
//   children: PropTypes.node,
// };

/**
 * Guest guard for routes having no auth required
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Children elements
 * @returns {React.ReactNode}
 */
import PropTypes from "prop-types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";

// ==============================|| GUEST GUARD ||============================== //

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * Guest guard for routes having no auth required
 * @param {GuestGuardProps} props - Component props
 * @returns {React.ReactNode}
 */
const GuestGuard = ({ children }: any) => {
  const { authData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authData) {
      const userType = localStorage.getItem("type");
      const routes: Record<string, string> = {
        parent: "/parent/",
        teacher: "/home/",
        school: "/home/",
        billing: "/home/billing",
      };

      const redirectTo = routes[userType || ""];
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [authData, navigate]);

  return children;
};

GuestGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuestGuard;
