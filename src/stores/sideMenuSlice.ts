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
      pathname: "/",
    },

    {
      icon: "Users",
      title: "Learners",
      subMenu: [
        // {
        //   icon: "User",
        //   pathname: "/learners",
        //   title: "Learners Details",
        // },
        {
          icon: "Users",
          pathname: "/learners",
          title: "Learners Details",
        },
        {
          icon: "Users",
          pathname: "/enrollment",
          title: "Promotion",
        },
        // {
        //   icon: "User",
        //   pathname: "/enrollment",
        //   title: "Learner Enrollment",
        // },
      ],
    },

    // {
    //   icon: "Users",
    //   title: "Parents",
    //   pathname: "/parents",
    // },
    {
      icon: "Users",
      title: "Teachers",
      pathname: "/teachers",
    },
    {
      icon: "FileCheck",
      pathname: "/learning_areas",
      title: "Learning Areas",
    },
    {
      icon: "Activity",
      pathname: "/assessment",
      title: " Assessment",
    },
    {
      icon: "FileText",
      pathname: "/billing",
      title: "Billing",
    },

    {
      icon: "Users",
      title: "Parents",
      pathname: "/parents",
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
          pathname: "/reports",
          title: "Formative Report",
        },
      ],
    },
    {
      icon: "Users",
      title: "Settings",
      subMenu: [
        {
          icon: "FileText",
          pathname: "/academic",
          title: "Year",
        },
        {
          icon: "BarChart",
          pathname: "/term",
          title: "Term",
        },
        {
          icon: "Activity",
          pathname: "/stream",
          title: "Stream",
        },
        {
          icon: "Activity",
          pathname: "/settings",
          title: "System Settings",
        },
        // {
        //   icon: "User",
        //   pathname: "/enrollment",
        //   title: "Learner Enrollment",
        // },
      ],
    },
    {
      icon: "FileText",
      pathname: "/profile",
      title: "Profile",
    },
    {
      icon: "User",
      pathname: "/users",
      title: "Users",
    },
    {
      icon: "File",
      pathname: "/roles",
      title: "Roles",
    },
  ],
};
const teacherState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/",
    },

    {
      icon: "Users",
      pathname: "/learners",
      title: "Learners",
    },

    // {
    //   icon: "Users",
    //   title: "Parents",
    //   pathname: "/parents",
    // },

    {
      icon: "FileCheck",
      pathname: "/learning_areas",
      title: "Learning Areas",
    },
    {
      icon: "Activity",
      pathname: "/assessment",
      title: " Assessment",
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
          pathname: "/reports",
          title: "By Learner",
        },
      ],
    },
    {
      icon: "FileText",
      pathname: "/profile",
      title: "Profile",
    },
  ],
};
const parentState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/v1",
    },

    {
      icon: "FileText",
      title: "Reports",
      pathname: "/v1/report",
    },
    {
      icon: "Users",
      title: "Profile",
      pathname: "/v1/profile",
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
  // const activeSection = "billing";
  if (activeSection === "billing") {
    return state.sideMenu.menu.filter((item) => {
      if (typeof item === "object" && "pathname" in item) {
        return item.pathname === "/billing";
      }
      return false;
    });
  } else {
    return state.sideMenu.menu;
  }
};

export default sideMenuSlice.reducer;
export { initialState, teacherState, parentState };
