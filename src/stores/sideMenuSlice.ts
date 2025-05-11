import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";
import { Car } from "lucide-react";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
  // permission?
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}
const authDataSerialized = localStorage.getItem("@AuthData");
const _authData: any = JSON.parse(authDataSerialized || "{}");

const permissions = _authData?.user?.role?.permissions || {};

const hasPermission = (module: string, action: string): boolean => {
  console.log("confirming");
  if (!permissions[module]) return false;
  return permissions[module].includes(action);
};
const initialState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/home",
      // ignore: !hasPermission("dashboard", "read"),
    },

    {
      icon: "Activity",
      pathname: "/home/timetable-teacher",
      title: "My Timetable",
      ignore: !hasPermission("titmatble", "teacher"),
    },
    //create route timetable-viewer
    {
      icon: "Activity",
      pathname: "/home/timetable-viewer",
      title: "Master Timetable",
      ignore: !hasPermission("parents", "create"),
    },

    {
      icon: "GraduationCap",
      title: "Learners",
      subMenu: [
        // {
        //   icon: "User",
        //   pathname: "/home/learners",
        //   title: "Learners Details",
        // },

        {
          icon: "Users",
          title: "Parents",
          pathname: "/home/parents",
          ignore: !hasPermission("parents", "read"),
        },
        {
          icon: "Users",
          pathname: "/home/learners",
          title: "Learners Details",
          ignore: !hasPermission("learners", "read"),
        },
        {
          icon: "Users",
          pathname: "/home/enrollment",
          title: "Promotion",
          ignore: !hasPermission("enrollment", "read"),
        },
        {
          icon: "User",
          pathname: "/home/transfers",
          title: "Transfers",
          ignore: !hasPermission("transfer-requests", "read"),
        },
        {
          icon: "User",
          pathname: "/home/incoming-transfers",
          title: "Incoming Transfers",
          ignore: !hasPermission("transfer-requests", "read"),
        },
      ],
    },

    {
      icon: "Users",
      title: "Teachers",
      pathname: "/home/teachers",
      ignore: !hasPermission("teachers", "read"),
    },
    {
      icon: "BookOpen",
      title: "Learning Areas",
      pathname: "/home/grade",
    },

    {
      icon: "Activity",
      title: "Attendance",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/home/attendance",
          title: "Learners Attendance",
          // ignore: false,
          ignore: !hasPermission("attendance", "read"),
        },
        {
          icon: "Activity",
          pathname: "/home/attendance_summary",
          title: "Attendance Report",
          // ignore: false,
          ignore: !hasPermission("attendance", "read"),
        },
        {
          icon: "Activity",
          pathname: "/home/attendance_termly_summary",
          title: "Attendance Termly",
          // ignore: false,
          ignore: !hasPermission("attendance", "read"),
        },
      ],
    },
    {
      icon: "Activity",
      title: "Communications",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/home/notice-board",
          title: "Notices",
          // ignore: false,
          ignore: !hasPermission("communication", "read"),
        },
        {
          icon: "Activity",
          pathname: "/home/message",
          title: "Inbox",
          // ignore: false,
          ignore: !hasPermission("communication", "read"),
        },
        // {
        //   icon: "Activity",
        //   pathname: "/home/attendance_termly_summary",
        //   title: "Attendance Termly",
        //   ignore: false,
        //   // ignore: !hasPermission("grading-system", "read"),
        // },
      ],
    },
    // {
    //   icon: "FileCheck",
    //   pathname: "/home/learning_areas",
    //   title: "Learning Areas",
    // },
    {
      icon: "Airplay",
      title: "Formative",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/home/assessment",
          title: " Formative Assessment",
          ignore: !hasPermission("assessment", "read"),
        },
        {
          icon: "Airplay",
          pathname: "/home/reports",
          title: "Formative Report",
          ignore: !hasPermission("assessment", "learners-report"),
        },
      ],
    },

    {
      icon: "Activity",
      title: "Summative",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/home/grading",
          title: "Performance Level Scale",
          ignore: !hasPermission("grading-system", "read"),
        },
        {
          icon: "Activity",
          pathname: "/home/tests",
          title: "Summative Tests ",
          ignore: !hasPermission("tests", "read"),
        },

        {
          icon: "User",
          pathname: "/home/assess",
          title: "Summative Assessment",
          ignore: !hasPermission("tests", "read"),
        },

        {
          icon: "User",
          pathname: "/home/summativereports",
          title: "Summative Report",
          ignore: !hasPermission("tests", "learners-report"),
        },
        {
          icon: "Activity",
          pathname: "/home/comments",
          title: "Termly Report",
        },
      ],
    },

    {
      icon: "Users",
      title: "Learner Behaviour",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/home/behaviour",
          title: "Behaviour Category",
          ignore: false,

        },
        {
          icon: "Activity",
          pathname: "/home/behaviour-assessment",
          title: "Behaviour Assessment",
          ignore: false,

        },
      ],
    },
    {
      icon: "Wallet",
      pathname: "/home/billing",
      title: "Billing",
      ignore: !hasPermission("subscrition", "read"),
    },

    {
      icon: "Settings",
      title: "Settings",
      subMenu: [
        // {
        //   icon: "FileText",
        //   pathname: "/home/academic",
        //   title: "Year",
        // },
        // {
        //   icon: "BarChart",
        //   pathname: "/home/term",
        //   title: "Term",
        // },
        {
          icon: "Activity",
          pathname: "/home/stream",
          title: "Stream",
          ignore: !hasPermission("streams", "read"),
        },
        {
          icon: "Activity",
          pathname: "/home/timetable",
          title: "Timetable Management",
          // ignore: !hasPermission("streams", "read"),
          ignore: !hasPermission("parents", "read"),
        },
        {
          icon: "Settings",
          pathname: "/home/settings",
          title: "System Settings",
          ignore: !hasPermission("school", "read"),
        },

        // {
        //   icon: "User",
        //   pathname: "/home/enrollment",
        //   title: "Learner Enrollment",
        // },
      ],
    },
    {
      icon: "File",
      pathname: "/home/roles",
      title: "Roles",
      ignore: !hasPermission("roles", "read"),
    },
    {
      icon: "Users",
      title: "System Users",
      pathname: "/home/users",
      ignore: !hasPermission("users", "read"),
    },

    // {
    //   icon: "User",
    //   pathname: "/home/users",
    //   title: "Users",
    // },

    {
      icon: "FileText",
      pathname: "/home/profile",
      title: "Profile",
    },
  ],
};
const teacherState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboards",
      pathname: "/home",
    },

    {
      icon: "Users",
      pathname: "/home/learners",
      title: "Learners",
    },

    {
      icon: "FileText",
      title: "Learning Area",
      pathname: "/home/grade",
    },
    // {
    //   path: "timetable-teacher",
    //   element: <TimetableTeacher />,
    // },
    {
      icon: "Activity",
      pathname: "/home/timetable",
      title: "Timetable",
    },
    {
      icon: "Activity",
      pathname: "/home/assessment",
      title: "Formative Assessment",
    },

    {
      icon: "User",
      pathname: "/home/reports",
      title: "Formative Report",
    },

    {
      icon: "User",
      pathname: "/home/assess",
      title: "Summative Assessment",
    },
    {
      icon: "User",
      pathname: "/home/summativereports",
      title: "Summative Report",
    },

    // {
    //   icon: "Users",
    //   title: "Reports",
    //   subMenu: [
    //     {
    //       icon: "Activity",
    //       pathname: "/home/indicatorReport",
    //       title: "By Indicators",
    //     },
    //     {
    //       icon: "User",
    //       pathname: "/home/reports",
    //       title: "By Learner",
    //     },
    //   ],
    // },
    {
      icon: "FileText",
      pathname: "/home/profile",
      title: "Profile",
    },
  ],
};
const parentState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/parent",
    },

    {
      icon: "FileText",
      title: "Formative Reports",
      pathname: "/parent/report",
    },
    {
      icon: "FileText",
      title: "Summative Reports",
      pathname: "/parent/summative",
    },
    {
      icon: "Activity",
      pathname: "/parent/e-portifolio",
      title: "E-Portifolio",
      ignore: false,
      // ignore: !hasPermission("grading-system", "read"),
    },
    {
      icon: "Activity",
      pathname: "/parent/message",
      title: "Messages",
      ignore: false,
      // ignore: !hasPermission("grading-system", "read"),
    },

    {
      icon: "Activity",
      pathname: "/parent/noticeboard",
      title: "Notices",
      ignore: false,
      // ignore: !hasPermission("grading-system", "read"),
    },
    // {
    //   icon: "Users",
    //   title: "Profile",
    //   pathname: "/parent/profile",
    // },
    {
      icon: "FileText",
      title: "Transfers",
      pathname: "/parent/transfers",
    },
  ],
};

let activeSection = localStorage.getItem("type");

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState:
    localStorage.getItem("type") === "parent" ? parentState : initialState,
  reducers: {
    setMenuState: (state, action: PayloadAction<SideMenuState>) => {
      return action.payload;
    },
  },
});

export const { setMenuState } = sideMenuSlice.actions;

// export const selectSideMenu = (state: RootState) => state.sideMenu.menu;
export const selectSideMenu = (state: RootState) => {
  let activeSection = localStorage.getItem("type");
  // const activeSection = "billing";
  // if (activeSection === "billing") {
  //   return state.sideMenu.menu.filter((item) => {
  //     if (typeof item === "object" && "pathname" in item) {
  //       return item.pathname === "/home/billing";
  //     }
  //     return false;
  //   });
  // } else {
  return state.sideMenu.menu;
  // }
};

export default sideMenuSlice.reducer;
export { initialState, teacherState, parentState };
