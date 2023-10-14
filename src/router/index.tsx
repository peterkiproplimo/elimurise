import { useRoutes } from "react-router-dom";
import Layout from "../layouts";
import Auth from "../layouts/auth";
import Dashboard from "../pages/Dashboard";
import Attendees from "../pages/Attendees";
import Speakers from "../pages/Speakers";
import Vendors from "../pages/Vendors";
import Exhibitors from "../pages/Exhibitors";
import Conferences from "../pages/Conferences";
import Themes from "../pages/Themes";
import Events from "../pages/Events";
// import SimcardBooking from "../pages/SimcardBooking";
import Categories from "../pages/Categories";
import ProductList from "../pages/ProductList";
import TransactionList from "../pages/TransactionList";
// import Wallets from "../pages/Wallet";
import TransactionDetail from "../pages/TransactionDetail";
import SellerDetail from "../pages/SellerDetail";
import Users from "../pages/Users";
//beginning of auth
import Profile from "../pages/Profile";
import Login from "../pages/Auth/login";
import Logs from "../pages/Auth/audit-logs";
// import Login from "../pages/Auth/change-password";
// import Login from "../pages/Auth/forgot-password";
// import LoginBacks from "../pages/Auth/loginsBacks";
import PrivacyPolicy from "../pages/Auth/privacy-policy";
import Terms from "../pages/Auth/terms&conditions";
import Privacy from "../pages/Auth/privacy";
import NewProfile from "../pages/Auth/profile";

import Role from "../pages/Auth/roles";
import Permissions from "../pages/Auth/permissions";
import ForgotPassword from "../pages/Auth/forgot-password";
import ForgotPasswordOTP from "../pages/Auth/forgot-passOTP";
import CreateNewPassword from "../pages/Auth/create-newPassword";
import ErrorPage from "../pages/ErrorPage";
import UpdateProfile from "../pages/UpdateProfile/original";
import ChangePassword from "../pages/Auth/forgot-password";
import AuthGuard from "../utils/route-guard/AuthGuard";
import GuestGuard from "../utils/route-guard/GuestGuard";
import Vehicle from "../pages/vehicle";
import Documents from "../pages/documents";
import SecurityFeature from "../pages/security";
import Financiers from "../pages/financiers";
import Accounts from "../pages/accounts";
import Quotes from "../pages/quotes";
import NewPolicy from "../pages/newPolicy";
import Extension from "../pages/policyExtension";
import Model from "../pages/model";
import Valuers from "../pages/valuers";
import ClaimActive from "../pages/ClaimActive";
import ClaimPending from "../pages/ClaimPending";
import ClaimRejected from "../pages/ClaimRejected";
import AccountDetails from "../pages/accountDetails";
import Autocorrect from "../pages/qautocorrect";
import Thirdparty from "../pages/qthird_party";
import Theft from "../pages/qtheft_party";
import Contents from "../pages/contents";
import CoversFAQs from "../pages/coverFAQs";
import FAQs from "../pages/FAQs";
import Settings from "../pages/Auth/settings";

function Router() {
  const routes = [
    {
      path: "/",
      element:
        // <AuthGuard>
          <Layout />,
        // </AuthGuard>,
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
          path: "product-list",
          element: <ProductList />,
        },
        // {
        //   path: "simcards",
        //   element: <SimcardBooking />,
        // },
        // {
        //   path: "wallets",
        //   element: <Wallets />,
        // },
        {
          path: "transaction-list",
          element: <TransactionList />,
        },
        {
          path: "transaction-detail",
          element: <TransactionDetail />,
        },
        {
          path: "attendees",
          element: <Attendees />,
        },
        {
          path: "Vehicle",
          element: <Vehicle />,
        },
        {
          path: "documents",
          element: <Documents />,
        },
        {
          path: "securityFeature",
          element: <SecurityFeature />,
        },
        {
          path: "financiers",
          element: <Financiers />,
        },
        {
          path: "valuers",
          element: <Valuers />,
        },

        {
          path: "accounts",
          element: <Accounts />,
        },
        {
          path: "quotes",
          element: <Quotes />,
        },
        {
          path: "policy",
          element: <NewPolicy />,
        },
        {
          path: "Terms",
          element: <Terms />,
        },

        {
          path: "extension",
          element: <Extension />,
        },
        {
          path: "model",
          element: <Model />,
        },
        {
          path: "active",
          element: <ClaimActive />,
        },
        {
          path: "pendingClaim",
          element: <ClaimPending />,
        },
        {
          path: "rejectedClaim",
          element: <ClaimRejected />,
        },
        {
          path: "accountDetails",
          element: <AccountDetails />,
        },
        {
          path: "Autocorrect",
          element: <Autocorrect />,
        },
        {
          path: "Thirdparty",
          element: <Thirdparty />,
        },
        {
          path: "Theft",
          element: <Theft />,
        },
        {
          path: "Contents",
          element: <Contents />,
        },
        {
          path: "CoversFAQs",
          element: <CoversFAQs />,
        },
        {
          path: "FAQs",
          element: <FAQs />,
        },

        //security
        {
          path: "Role",
          element: <Role />,
        },
        {
          path: "Permissions",
          element: <Permissions />,
        },

        {
          path: "Logs",
          element: <Logs />,
        },
        {
          path: "PrivacyPolicy",
          element: <PrivacyPolicy />,
        },
        {
          path: "Privacy",
          element: <Privacy />,
        },
        {
          path: "NewProfile",
          element: <NewProfile />,
        },
        {
          path: "Settings",
          element: <Settings />,
        },

        {
          path: "speakers",
          element: <Speakers />,
        },
        {
          path: "vendors",
          element: <Vendors />,
        },
        {
          path: "exhibitors",
          element: <Exhibitors />,
        },
        {
          path: "conferences",
          element: <Conferences />,
        },
        {
          path: "themes",
          element: <Themes />,
        },
        {
          path: "events",
          element: <Events />,
        },
        {
          path: "seller-detail",
          element: <SellerDetail />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "profile-overview-1",
          element: <Profile />,
        },
        {
          path: "update-profile",
          element: <UpdateProfile />,
        },
        {
          path: "change-password",
          element: <ChangePassword />,
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
          path: "/ForgotPasswordOTP",
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
