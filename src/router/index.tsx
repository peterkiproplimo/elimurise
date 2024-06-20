import { useRoutes } from "react-router-dom";
import Layout from "../layouts";
import Auth from "../layouts/auth";
import Billing from "../pages/Billing";
import Parents from "../pages/Parents";
import Teachers from "../pages/Teachers";
import Strands from "../pages/Strands";
import Enrollment from "../pages/Enrolments";

// import SimcardBooking from "../pages/SimcardBooking";
import Assessment from "../pages/Assessment";

//beginning of auth
import Subscription from "../pages/Subscription";
import Login from "../pages/Auth/login";
import ParentForgotPassword from "../pages/Auth/parent-forgot-password";

import ForgotPassword from "../pages/Auth/forgot-password";
import ForgotPasswordOTP from "../pages/Auth/forgot-passOTP";
import CreateNewPassword from "../pages/Auth/create-newPassword";
import ErrorPage from "../pages/ErrorPage";
import AuthGuard from "../utils/route-guard/AuthGuard";
import GuestGuard from "../utils/route-guard/GuestGuard";
import SecurityFeature from "../pages/security";
import Term from "../pages/Term";
import Academic from "../pages/Academic";
import Substrand from "../pages/Substrand";
import AccountDetails from "../pages/accountDetails";
import Stream from "../pages/Stream";
import Learners from "../pages/Learners";
import LearningAreas from "../pages/LearningAreas";
import Home from "../webapp/home";
import Register from "../pages/Auth/register";
import AssessLearner from "../pages/AssessLearner";
import LearnerEnrollment from "../pages/LearnerEnrollment";
import ForgotPasswordOTPParent from "../pages/Auth/forgot-passOTP-parent";
import LearnerProfile from "../pages/LearnerPortal/profile";
import LearnerDashboard from "../pages/LearnerPortal/dashboard";

//nn
function Router() {
  const routes = [
    {
      path: "/",
      element: (
        <AuthGuard>
          <Layout />
        </AuthGuard>
      ),
      children: [
        {
          path: "/billing",
          element: <Billing />,
        },
        // {
        //   path: "categories",
        //   element: <Categories />,
        // },
        {
          path: "parents",
          element: <Parents />,
        },

        {
          path: "securityFeature",
          element: <SecurityFeature />,
        },
        {
          path: "assessLearner",
          element: <AssessLearner />,
        },
        {
          path: "/enrollment",
          element: <LearnerEnrollment />,
        },

        {
          path: "substrand",
          element: <Substrand />,
        },
        {
          path: "term",
          element: <Term />,
        },
        {
          path: "enrollments",
          element: <Enrollment />,
        },

        {
          path: "academic",
          element: <Academic />,
        },

        {
          path: "stream",
          element: <Stream />,
        },

        {
          path: "accountDetails",
          element: <AccountDetails />,
        },

        {
          path: "assessment",
          element: <AssessLearner />,
        },

        //securitye
        {
          path: "teachers",
          element: <Teachers />,
        },
        {
          path: "subscription",
          element: <Subscription />,
        },
        {
          path: "learners",
          element: <Learners />,
        },
        {
          path: "learning_areas",
          element: <LearningAreas />,
        },
        {
          path: "strands",
          element: <Strands />,
        },
        {
          path: "/v1/profile",
          element: <LearnerProfile />,
        },
        {
          path: "/v1/assessments",
          element: <Strands />,
        },
        {
          path: "/v1/",
          element: <LearnerDashboard />,
        },
      ],
    },

    {
      path: "/",
      element: (
        <GuestGuard>
          <Auth />
        </GuestGuard>
      ),
      children: [
        {
          path: "/login",
          element: <Login />,
        },

        {
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "/v1/forgot-password",
          element: <ParentForgotPassword />,
        },
        {
          path: "/register",
          element: <Register />,
        },

        {
          path: "/otp",
          element: <ForgotPasswordOTP />,
        },
        {
          path: "/v1/otp",
          element: <ForgotPasswordOTPParent />,
        },
        {
          path: "/CreateNewPassword",
          element: <CreateNewPassword />,
        },
      ],
    },
    {
      path: "/error-page",
      element: <ErrorPage />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
    {
      path: "/home",
      element: <Home />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
