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
    // MAIN DASHBOARD
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/home",
    },

    // ACADEMIC MANAGEMENT
    {
      icon: "GraduationCap",
      title: "Academic Management",
      subMenu: [
        {
          icon: "Users",
          title: "Student Directory",
          pathname: "/home/learners",
          ignore: !hasPermission("learners", "read"),
        },
        {
          icon: "User",
          title: "Parent Portal",
          pathname: "/home/parents",
          ignore: !hasPermission("parents", "read"),
        },
        {
          icon: "UserPlus",
          title: "Student Promotion",
          pathname: "/home/enrollment",
          ignore: !hasPermission("enrollment", "read"),
        },
        {
          icon: "UserX",
          title: "Inactive Students",
          pathname: "/home/inactive-learners",
          ignore: !hasPermission("learners", "read"),
        },
        {
          icon: "LogOut",
          title: "Exited Students",
          pathname: "/home/exited-learners",
          ignore: !hasPermission("learners", "read"),
        },
        {
          icon: "ArrowLeftRight",
          title: "Transfer Management",
          pathname: "/home/transfers",
          ignore: !hasPermission("transfer-requests", "read"),
        },
        {
          icon: "ArrowLeft",
          title: "Incoming Transfers",
          pathname: "/home/incoming-transfers",
          ignore: !hasPermission("transfer-requests", "read"),
        },
      ],
    },

        // Achievements
    {
      icon: "Building2",
      title: "Achievements",
      subMenu: [
        {
          icon: "Users",
          title: "Certificates",
          pathname: "/home/certificates",
          ignore: !hasPermission("learners", "read"),
        },
      ]
    },

    // FRONT OFFICE
    {
      icon: "Building2",
      title: "Front Office",
      subMenu: [
        {
          icon: "Users",
          title: "Analytics and Reports",
          pathname: "/home/frontofficeanalytics",
          ignore: !hasPermission("learners", "read"),
        },
        {
          icon: "Users",
          title: "Enquiries",
          pathname: "/home/enquiries",
          ignore: !hasPermission("learners", "read"),
        },
        {
          icon: "User",
          title: "Visitors",
          pathname: "/home/visitors",
          ignore: !hasPermission("parents", "read"),
        },
        {
          icon: "User",
          title: "PhoneCalls",
          pathname: "/home/phonecalls",
          ignore: !hasPermission("parents", "read"),
        },
        {
          icon: "User",
          title: "Complaints",
          pathname: "/home/complaints",
          ignore: !hasPermission("parents", "read"),
        },
        {
          icon: "User",
          title: "Online Applications",
          pathname: "/home/onlineapplications",
          ignore: !hasPermission("parents", "read"),
        }
      ],
    },

        // FRONT OFFICE
        {
          icon: "Building2",
          title: "Project Management",
          subMenu: [
 
            {
              icon: "User",
              title: "Projects",
              pathname: "/home/projectsmodule",
              ignore: !hasPermission("parents", "read"),
            },
        
            {
              icon: "User",
              title: "Competencies",
              pathname: "/home/competencies",
              ignore: !hasPermission("parents", "read"),
            },
              {
              icon: "User",
              title: "UploadConfig",
              pathname: "/home/uploadConfig",
              ignore: !hasPermission("parents", "read"),
            },
          ],
        },
    // STAFF MANAGEMENT
    {
      icon: "Users",
      title: "Staff Management",
      pathname: "/home/teachers",
      ignore: !hasPermission("teachers", "read"),
    },

    // CURRICULUM & ASSESSMENT
    {
      icon: "BookOpen",
      title: "Curriculum & Assessment",
      subMenu: [
    {
      icon: "BookOpen",
      title: "Learning Areas",
      pathname: "/home/grade",
    },
        {
          icon: "ClipboardCheck",
          title: "Formative Assessment",
          pathname: "/home/assessment",
          ignore: !hasPermission("assessment", "read"),
        },
        {
          icon: "BarChart3",
          title: "Formative Reports",
          pathname: "/home/reports",
          ignore: !hasPermission("assessment", "learners-report"),
        },
        {
          icon: "FileCheck",
          title: "Performance Scales",
          pathname: "/home/grading",
          ignore: !hasPermission("grading-system", "read"),
        },
        {
          icon: "ClipboardList",
          title: "Summative Tests",
          pathname: "/home/tests",
          ignore: !hasPermission("tests", "read"),
        },
        {
          icon: "FileText",
          title: "Summative Assessment",
          pathname: "/home/assess",
          ignore: !hasPermission("tests", "read"),
        },
        {
          icon: "BarChart",
          title: "Summative Reports",
          pathname: "/home/summativereports",
          ignore: !hasPermission("tests", "learners-report"),
        },
        {
          icon: "FileSpreadsheet",
          title: "Termly Reports",
          pathname: "/home/comments",
        },
      ],
    },

    // ATTENDANCE MANAGEMENT
    {
      icon: "Calendar",
      title: "Attendance Management",
      subMenu: [
        {
          icon: "UserCheck",
          title: "Daily Attendance",
          pathname: "/home/attendance",
          ignore: !hasPermission("attendance", "read"),
        },
        {
          icon: "BarChart3",
          title: "Monthly Reports",
          pathname: "/home/attendance_summary",
          ignore: !hasPermission("attendance", "read"),
        },
        {
          icon: "TrendingUp",
          title: "Termly Analysis",
          pathname: "/home/attendance_termly_summary",
          ignore: !hasPermission("attendance", "read"),
        },
      ],
    },

    // TIMETABLE MANAGEMENT
    {
      icon: "Calendar",
      title: "Timetable Management",
      subMenu: [
        {
          icon: "Calendar",
          title: "Master Timetable",
          pathname: "/home/timetable-viewer",
          ignore: hasPermission("parents", "read"),
        },
        {
          icon: "Clock",
          title: "My Timetable",
          pathname: "/home/timetable-teacher",
          ignore: hasPermission("parents", "read"),
        },
        {
          icon: "Settings",
          title: "Timetable Setup",
          pathname: "/home/timetable",
          ignore: !hasPermission("parents", "read"),
        },
      ],
    },

    // COMMUNICATION CENTER
    {
      icon: "MessageSquare",
      title: "Communication Center",
      subMenu: [
        {
          icon: "Bell",
          title: "Announcements",
          pathname: "/home/notice-board",
          ignore: !hasPermission("communication", "read"),
        },
        {
          icon: "Mail",
          title: "Message Center",
          pathname: "/home/message",
          ignore: !hasPermission("communication", "read"),
        },
      ],
    },

    // FINANCIAL MANAGEMENT
    {
      icon: "CreditCard",
      title: "Financial Management",
      pathname: "/home/billing",
      ignore: !hasPermission("subscrition", "read"),
    },

    // ANALYTICS & REPORTS
    {
      icon: "BarChart3",
      title: "Analytics & Reports",
      pathname: "/home/analytics",
    },

    // SYSTEM ADMINISTRATION
    {
      icon: "Settings",
      title: "System Administration",
      subMenu: [
        {
          icon: "Building",
          title: "Stream Management",
          pathname: "/home/stream",
          ignore: !hasPermission("streams", "read"),
        },
        {
          icon: "Shield",
          title: "System Settings",
          pathname: "/home/settings",
          ignore: !hasPermission("school", "read"),
        },
        {
          icon: "Users",
          title: "User Management",
          pathname: "/home/users",
          ignore: !hasPermission("users", "read"),
        },
        {
          icon: "Shield",
          title: "Role Management",
          pathname: "/home/roles",
          ignore: !hasPermission("roles", "read"),
        },
      ],
    },

    // USER PROFILE
    {
      icon: "User",
      pathname: "/home/profile",
      title: "My Profile",
    },
  ],
};

const teacherState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/home",
    },

    {
      icon: "Users",
      title: "Student Directory",
      pathname: "/home/learners",
    },

    {
      icon: "BookOpen",
      title: "Learning Areas",
      pathname: "/home/grade",
    },

    {
      icon: "Calendar",
      title: "My Timetable",
      pathname: "/home/timetable",
    },

    {
      icon: "ClipboardCheck",
      title: "Formative Assessment",
      pathname: "/home/assessment",
    },

    {
      icon: "BarChart3",
      title: "Formative Reports",
      pathname: "/home/reports",
    },

    {
      icon: "FileText",
      title: "Summative Assessment",
      pathname: "/home/assess",
    },

    {
      icon: "BarChart",
      title: "Summative Reports",
      pathname: "/home/summativereports",
    },

    {
      icon: "User",
      pathname: "/home/profile",
      title: "My Profile",
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
      icon: "BarChart3",
      title: "Formative Reports",
      pathname: "/parent/report",
    },

    {
      icon: "BarChart",
      title: "Summative Reports",
      pathname: "/parent/summative",
    },

    {
      icon: "FolderOpen",
      title: "E-Portfolio",
      pathname: "/parent/e-portifolio",
      ignore: false,
    },

    {
      icon: "MessageSquare",
      title: "Messages",
      pathname: "/parent/message",
      ignore: false,
    },

    {
      icon: "Bell",
      title: "Announcements",
      pathname: "/parent/noticeboard",
      ignore: false,
    },

    {
      icon: "ArrowLeftRight",
      title: "Transfer Requests",
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

export const selectSideMenu = (state: RootState) => {
  let activeSection = localStorage.getItem("type");
  return state.sideMenu.menu;
};

export default sideMenuSlice.reducer;
export { initialState, teacherState, parentState };
