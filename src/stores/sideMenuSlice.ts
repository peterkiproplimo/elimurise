import { createSlice } from "@reduxjs/toolkit";
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
        {
          icon: "User",
          pathname: "/learners",
          title: "Learners Details",
        },
        {
          icon: "Users",
          pathname: "/enrollments",
          title: "Enrollments",
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
        // {
        //   icon: "User",
        //   pathname: "/enrollment",
        //   title: "Learner Enrollment",
        // },
      ],
    },
  ],
};
const teacherState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Parent",
      pathname: "/",
    },

    {
      icon: "Users",
      title: "Learners",
      subMenu: [
        {
          icon: "User",
          pathname: "/learners",
          title: "Learners Details",
        },
        {
          icon: "Users",
          pathname: "/enrollments",
          title: "Enrollments",
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
        // {
        //   icon: "User",
        //   pathname: "/enrollment",
        //   title: "Learner Enrollment",
        // },
      ],
    },
  ],
};
const parentState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Parent",
      pathname: "/",
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
  ],
};
const activeSection = localStorage.getItem("type");

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState: activeSection == "parent" ? parentState : initialState,
  reducers: {},
});

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
