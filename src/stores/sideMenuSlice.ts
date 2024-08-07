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
    {
      icon: "Users",
      title: "Parents",
      pathname: "/parents",
    },

    {
      icon: "Users",
      title: "Learners",
      subMenu: [
        // {
        //   icon: "User",
        //   pathname: "/home/learners",
        //   title: "Learners Details",
        // },
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
          title: "Incomming Transfers",
        },
      ],
    },

    // {
    //   icon: "Users",
    //   title: "Parents",
    //   pathname: "/home/parents",
    // },
    {
      icon: "Users",
      title: "Teachers",
      pathname: "/home/teachers",
    },
    {
      icon: "FileCheck",
      pathname: "/home/learning_areas",
      title: "Learning Areas",
    },
    {
      icon: "Activity",
      pathname: "/home/assessment",
      title: " Assessment",
    },
    {
      icon: "FileText",
      pathname: "/home/billing",
      title: "Billing",
    },

    {
      icon: "Users",
      title: "Parents",
      pathname: "/home/parents",
    },

    {
      icon: "Users",
      title: "Reports",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/indicatorReport",
          title: "By Indicators",
        },
        {
          icon: "User",
          pathname: "/home/reports",
          title: "Formative Report",
        },
      ],
    },
    {
      icon: "Users",
      title: "Summative",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/home/grading",
          title: "Grading",
        },
        {
          icon: "Activity",
          pathname: "/home/tests",
          title: "Summative Tests ",
        },
        {
          icon: "User",
          pathname: "/home/assess",
          title: "Summative Assess",
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
      title: "Settings",
      subMenu: [
        {
          icon: "FileText",
          pathname: "/home/academic",
          title: "Year",
        },
        {
          icon: "BarChart",
          pathname: "/home/term",
          title: "Term",
        },
        {
          icon: "Activity",
          pathname: "/home/stream",
          title: "Stream",
        },
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

    // {
    //   icon: "Users",
    //   title: "Parents",
    //   pathname: "/home/parents",
    // },

    {
      icon: "FileCheck",
      pathname: "/home/learning_areas",
      title: "Learning Areas",
    },
    {
      icon: "Activity",
      pathname: "/home/assessment",
      title: " Assessment",
    },
    {
      icon: "Users",
      title: "Reports",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/home/indicatorReport",
          title: "By Indicators",
        },
        {
          icon: "User",
          pathname: "/home/reports",
          title: "By Learner",
        },
      ],
    },
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
      pathname: "/home/v1",
    },

    {
      icon: "FileText",
      title: "Reports",
      pathname: "/home/v1/report",
    },
    {
      icon: "Users",
      title: "Profile",
      pathname: "/home/v1/profile",
    },
    {
      icon: "FileText",
      title: "Transfers",
      pathname: "/home/v1/transfers",
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
