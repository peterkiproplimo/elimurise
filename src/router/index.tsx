import { useRoutes } from "react-router-dom";
import Layout from "../layouts";
import Auth from "../layouts/auth";
import Billing from "../pages/Billing";
import Parents from "../pages/Parents";
import Teachers from "../pages/Teachers";
import Strands from "../pages/Strands";
import Enrollment from "../pages/Enrolments";
import Reports from "../pages/Reports";
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
import Dashboard from "../pages/dashboard";
import LearnerProfiles from "../pages/LearnerProfiles";
import IndicatorReports from "../pages/IndicatorReports";
import UserProfile from "../pages/UserProfile";
import LearnerDetails from "../pages/Learners/learnerDetails";


import User from "../pages/User";
import Role from "../pages/roles";
import Term from "../pages/Term";
import Settings from "../pages/Settings";
import GradeUserAssignment from "../pages/GradeUserAssignment";
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
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/billing",
          element: <Billing />,
        },
        {
          path: "reports",
          element: <Reports />,
        },
        {
          path: "parents",
          element: <Parents />,
        },
        {
          path: "profile",
          element: <UserProfile />,
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
          path: "/IndicatorReport",
          element: <IndicatorReports />,
        },

        {
          path: "substrand",
          element: <Substrand />,
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
          path: "term",
          element: <Term />,
        },

        {
          path: "accountDetails",
          element: <AccountDetails />,
        },

        {
          path: "assessment",
          element: <AssessLearner />,
        },
        {
          path: "settings",
          element: <Settings />,
        },

        {
          path: "users",
          element: <User />,
        },

        {
          path: "roles",
          element: <Role />,
        },

        //securitye
        {
          path: "teachers",
          element: <Teachers />,
        },
        {
          path: "teacher/:id",
          element: <GradeUserAssignment />,
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
          path: "/learner/:id" ,
          element: <LearnerDetails/>,
        }
        ,
      
        {
          path: "/v1/profile",
          element: <LearnerProfile />,
        },
        {
          path: "/v1/assessments",
          element: <Strands />,
        },
        {
          path: "/v1",
          element: <LearnerDashboard />,
        },
        {
          path: "/v1/report",
          element: <LearnerProfiles />,
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
