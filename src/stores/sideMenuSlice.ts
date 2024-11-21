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
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

const initialState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/home/",
    },
    // {
    //   icon: "Users",
    //   title: "Parents",
    //   pathname: "/parents",
    // },

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
          icon: "Activity",
          pathname: "/home/stream",
          title: "Stream",
        },
        {
          icon: "Users",
          title: "Parents",
          pathname: "/home/parents",
        },
        {
          icon: "Users",
          pathname: "/home/learners",
          title: "Learners Details",
        },
        {
          icon: "Users",
          pathname: "/home/enrollment",
          title: "Promotion",
        },
        {
          icon: "User",
          pathname: "/home/transfers",
          title: "Transfers",
        },
        {
          icon: "User",
          pathname: "/home/incoming-transfers",
          title: "Incoming Transfers",
        },
      ],
    },

    {
      icon: "Users",
      title: "Teachers",
      pathname: "/home/teachers",
    },
    {
      icon: "BookOpen",
      title: "Learning Areas",
      pathname: "/home/grade",
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
          title: " Assessment",
        },
        {
          icon: "Airplay",
          pathname: "/home/reports",
          title: "Formative Report",
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
        },
        {
          icon: "Activity",
          pathname: "/home/tests",
          title: "Summative Tests ",
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
        },
        {
          icon: "Activity",
          pathname: "/home/behaviour-assessment",
          title: "Behaviour Assessment",
        },
        {
          icon: "Activity",
          pathname: "/home/comments",
          title: "Comments",
        },
      ],
    },
    {
      icon: "Wallet",
      pathname: "/home/billing",
      title: "Billing",
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
          pathname: "/home/settings",
          title: "System Settings",
        },
        // {
        //   icon: "User",
        //   pathname: "/home/enrollment",
        //   title: "Learner Enrollment",
        // },
      ],
    },
    {
      icon: "Users",
      title: "Users",
      pathname: "/home/users",
    },
    {
      icon: "FileText",
      pathname: "/home/profile",
      title: "Profile",
    },
    // {
    //   icon: "User",
    //   pathname: "/home/users",
    //   title: "Users",
    // },
    // {
    //   icon: "File",
    //   pathname: "/home/roles",
    //   title: "Roles",
    // },
  ],
};
const teacherState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/home/",
    },

    {
      icon: "Users",
      pathname: "/home/learners",
      title: "Learners",
    },

    {
      icon: "FileText",
      title: "Content",
      pathname: "/home/grade",
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
      title: "Formartive Report",
      pathname: "/parent/report",
    },
    {
      icon: "FileText",
      title: "Summative Report",
      pathname: "/parent/summative",
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
