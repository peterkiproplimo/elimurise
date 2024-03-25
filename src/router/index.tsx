import { useRoutes } from "react-router-dom";
import Layout from "../layouts";
import Auth from "../layouts/auth";
import Billing from "../pages/Billing";
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
import Term from "../pages/Term";
import Academic from "../pages/Academic";
import Substrand from "../pages/Substrand";
import AccountDetails from "../pages/accountDetails";
import Stream from "../pages/Stream";
import Strand from "../pages/Strand";
import Home from "../webapp/home";
import Register from "../pages/Auth/register";
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
          path: "term",
          element: <Term/>,
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
          path: "/register",
          element: <Register/>,
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
    {
      path: "/home",
      element: <Home />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
