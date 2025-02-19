import { useRoutes } from "react-router-dom";
import Layout from "../layouts";
import Auth from "../layouts/auth";
import Billing from "../pages/Billing";
import Parents from "../pages/Parents";

import ParentsProfile from "../pages/Parents/parent_details";
import Teachers from "../pages/Teachers";
import TeacherProfile from "../pages/Teachers/teacher_profile";

import Strands from "../pages/Strands";
import Enrollment from "../pages/Enrolments";
import Reports from "../pages/Reports";
// import SimcardBooking from "../pages/SimcardBooking";

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
import Register from "../pages/Register";
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
import SummativeTests from "../pages/SummativeTests";
import SummativeAssess from "../pages/SummativeAssess";
import SummativeReport from "../pages/SummativeReport";
import SummativeDone from "../pages/SummativeTests/done-tests";
import ParentConnect from "../pages/Parents/parentConnect";
import ParentConnectPart from "../pages/Parents/parentConnectPart";
import Noticesboard from "../pages/Parents/Noticeboard";
import NoticesboardParent from "../pages/Parents/NoticeboardParent";

import User from "../pages/User";
import Role from "../pages/roles";
import Term from "../pages/Term";
import Grade from "../pages/Grades";
import Settings from "../pages/Settings";
import GradeUserAssignment from "../pages/GradeUserAssignment";
import Grading from "../pages/Grading";
import GradingLeaningAreas from "../pages/GradingLeaningAreas";
import Transfers from "../pages/Learners/transfers";
import IncommingTransfers from "../pages/Learners/transfers_incoming";
import LearnersTransfers from "../pages/LearnerPortal/incoming_transfers";
import Contact from "../pages/Contact";
import LayoutRegister from "../layouts/register";
import LearnerSummative from "../pages/LearnerProfiles/summative";
import BehaviourCategory from "../pages/Behaviour/category";
import BehaviourAssessment from "../pages/Behaviour/assessment";
import Comment from "../pages/Behaviour/assessmentcomment";
import Demo from "../pages/Demo";
import Terms from "../pages/Terms";
import Policy from "../pages/Policy";
import Payment from "../pages/Payment";
import Cookies from "../pages/Cookies";
import AttendanceForm from "../pages/Attendance/attendance";
import AttendanceSummary from "../pages/Attendance/attendance_summary";
import AttendanceTermly from "../pages/Attendance/attendance_termly";

//nn
function Router() {
  const routes = [
    {
      path: "/home",
      element: (
        <AuthGuard>
          <Layout />
        </AuthGuard>
      ),
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "billing",
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
          path: "parents/:id",
          element: <ParentsProfile />,
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
          path: "enrollment",
          element: <LearnerEnrollment />,
        },
        {
          path: "IndicatorReport",
          element: <IndicatorReports />,
        },
        {
          path: "tests",
          element: <SummativeTests />,
        },
        {
          path: "tests-done",
          element: <SummativeDone />,
        },
        {
          path: "assess",
          element: <SummativeAssess />,
        },
        {
          path: "summativereports",
          element: <SummativeReport />,
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
          path: "behaviour",
          element: <BehaviourCategory />,
        },
        {
          path: "comments",
          element: <Comment />,
        },
        {
          path: "attendance",
          element: <AttendanceForm />,
        },
        {
          path: "message",
          element: <ParentConnectPart />,
        },
        {
          path: "notice-board",
          element: <Noticesboard />,
        },

        {
          path: "attendance_summary",
          element: <AttendanceSummary />,
        },
        {
          path: "attendance_termly_summary",
          element: <AttendanceTermly />,
        },
        {
          path: "behaviour-assessment",
          element: <BehaviourAssessment />,
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
          path: "grading",
          element: <Grading />,
        },
        {
          path: "grading/:id",
          element: <GradingLeaningAreas />,
        },
        {
          path: "transfers",
          element: <Transfers />,
        },
        {
          path: "incoming-transfers",
          element: <IncommingTransfers />,
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
          // element: <TeacherProfile />,

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
          path: "grade",
          element: <Grade />,
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
          path: "learner/:id",
          element: <LearnerDetails />,
        },
      ],
    },

    {
      path: "/parent",
      element: (
        <AuthGuard>
          <Layout />
        </AuthGuard>
      ),
      children: [
        {
          path: "",
          element: <LearnerDashboard />,
        },
        {
          path: "profile",
          element: <LearnerProfile />,
        },
        {
          path: "assessments",
          element: <Strands />,
        },

        {
          path: "report",
          element: <LearnerProfiles />,
        },
        {
          path: "message",
          element: <ParentConnect />,
        },
        {
          path: "noticeboard",
          element: <NoticesboardParent />,
        },
        {
          path: "summative",
          element: <LearnerSummative />,
        },
        {
          path: "transfers",
          element: <LearnersTransfers />,
        },
      ],
    },
    {
      path: "/auth",
      element: (
        <GuestGuard>
          <Auth />
          {/* <></> */}
        </GuestGuard>
      ),
      children: [
        {
          path: "login",
          element: <Login />,
        },

        {
          path: "forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "v1/forgot-password",
          element: <ParentForgotPassword />,
        },

        {
          path: "reset-password/:token",
          element: <ForgotPasswordOTP />,
        },
        {
          path: "v1/reset-password/:token",
          element: <ForgotPasswordOTPParent />,
        },
        // {
        //   path: "v1/otp",
        //   element: <ForgotPasswordOTPParent />,
        // },
        {
          path: "CreateNewPassword",
          element: <CreateNewPassword />,
        },
      ],
    },

    {
      path: "/contact",
      element: <Contact />,
    },
    {
      path: "/demo",
      element: <Demo />,
    },
    {
      path: "/terms",
      element: <Terms />,
    },
    {
      path: "/cookie-policy",
      element: <Cookies />,
    },
    {
      path: "/payment",
      element: <Payment />,
    },
    {
      path: "/policy",
      element: <Policy />,
    },
    // {
    //   path: "/register",
    //   element: (
    //     <GuestGuard>
    //       <LayoutRegister />
    //     </GuestGuard>
    //   ),
    //   children: [
    //     {
    //       path: "",
    //       element: <Register />,
    //     },
    //   ],
    // },

    {
      path: "/register",
      element: <Register />,
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
      path: "/",
      element: <Home />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
