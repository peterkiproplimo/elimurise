import { useRoutes } from "react-router-dom";
import Layout from "../layouts";
import Auth from "../layouts/auth";
import Dashboard from "../pages/Dashboard";
import User from "../pages/User";
import Role from "../pages/roles";

// import SimcardBooking from "../pages/SimcardBooking";
import Categories from "../pages/Categories";

//beginning of auth
import Profile from "../pages/Profile";
import Login from "../pages/Auth/login";

// import Login from "../pages/Auth/change-password";
// import Login from "../pages/Auth/forgot-password";
// import LoginBacks from "../pages/Auth/loginsBacks";

// import Role from "../pages/Auth/";

import ForgotPassword from "../pages/Auth/forgot-password";
import ForgotPasswordOTP from "../pages/Auth/forgot-passOTP";
import CreateNewPassword from "../pages/Auth/create-newPassword";
import ErrorPage from "../pages/ErrorPage";
import AuthGuard from "../utils/route-guard/AuthGuard";
import GuestGuard from "../utils/route-guard/GuestGuard";
import SecurityFeature from "../pages/security";
import Learning from "../pages/Learning";
import Level from "../pages/Level";
import Substrand from "../pages/Substrand";
import AccountDetails from "../pages/accountDetails";
import Grade from "../pages/Grade";
import Strand from "../pages/Strand";
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
          path: "categories",
          element: <Categories />,
        },
        {
          path: "user",
          element: <User />,
        },

        {
          path: "securityFeature",
          element: <SecurityFeature />,
        },

        {
          path: "substrand",
          element: <Substrand />,
        },
        {
          path: "learning",
          element: <Learning />,
        },

        {
          path: "level",
          element: <Level />,
        },

        {
          path: "grade",
          element: <Grade />,
        },

        {
          path: "accountDetails",
          element: <AccountDetails />,
        },

        //securitye
        {
          path: "role",
          element: <Role />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "strand",
          element: <Strand />,
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
          path: "/otp",
          element: <ForgotPasswordOTP />,
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
  ];

  return useRoutes(routes);
}

export default Router;
