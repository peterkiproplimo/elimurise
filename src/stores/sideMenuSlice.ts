import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";
import { Car } from 'lucide-react';


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
   

    // {
    //   icon: "Users",
    //   pathname: "/accounts",
    //   title: "Accounts",
    // },
    // {
    //   icon: "Users",
    //   pathname: "/accountDetails",
    //   title: "Account Details",
    // },
    

    {
        icon: "FileText",
        pathname: "/level",
        title: "Levels",
      },
       {
      icon: "Activity",
      pathname: "/grade",
      title: "Grades",
    },
      {
        icon: "BarChart",
        pathname: "/learning",
        title: "Learning Area",
      },
      {
        icon: "Activity",
        pathname: "/strand",
        title: " Strands",
      },
      {
        icon: "Activity",
        pathname: "/substrand",
        title: "Substrand",
      }
    //   {
    //     icon: "FileCheck",
    //     title: "SubStrands",
    //     subMenu: [
    //       {
    //         icon: "Activity",
    //         pathname: "/substrand",
    //         title: "Substrand",
    //       },
  
    //     // {
    // //     icon: "FileCheck",
    // //     title: "Transactions",
    // //     subMenu: [
    // //       {
    // //         icon: "Activity",
    // //         pathname: "/policy",
    // //         title: "Active Policy",
    // //       },
        
    // //       {
    // //         icon: "Activity",
    // //         pathname: "/extension",
    // //         title: "Inactive Policy",
    // //       },  
          
    // //     ]},
   
    //         // {
    //         //   icon: "Activity",
    //         //   pathname: "/active",
    //         //   title: "Regular Users",
    //         // },
          
    //         // {
    //         //   icon: "Activity",
    //         //   pathname: "/pendingClaim",
    //         //   title: "Admin",
    //         // },
    //         // {
    //         //   icon: "Activity",
    //         //   pathname: "/rejectedClaim",
    //         //   title: "Rejected Claims",
    //         // },
            
            
            
    //       ]},
          //  {
  //     icon: "Users",
  //     title: "Users",
  //     subMenu: [
  //       {
  //         icon: "Activity",
  //         pathname: "/user",
  //         title: "Users",
  //       },
  // ]},
         
  //         "divider",

    
  //         {
  //           icon: "Cog",
  //           title: "Settings",
  //           subMenu: [
  //             {
  //               icon: "Activity",
  //               pathname: "/Role",
  //               title: "Roles",
  //             },
              
             
      
  //             // {
  //             //   icon: "Activity",
  //             //   pathname: "/Logs",
  //             //   title: "Games Logs",
  //             // },
  //             // {
  //             //   icon: "Activity",
  //             //   pathname: "/Logs",
  //             //   title: "System Logs",
  //             // },
            
           
      
  //             {
  //               icon: "Activity",
  //               pathname: "/NewProfile",
  //               title: "Change Password",
  //             },
  //             {
  //               icon: "Activity",
  //               pathname: "/Settings",
  //               title: "Settings",
  //             },
  //           ],
  //         },
          // {
     
          //   icon: "Info",
          //   title: "Contents",
          //   subMenu: [
          //  {
          //   icon: "Activity",
          //   pathname: "/Contents",
          //   title: "Product Offers",
          // },
          // {
          //   icon: "Activity",
          //   pathname: "/FAQs",
          //   title: "FAQs",
          // },
          // {
          //   icon: "Activity",
          //   pathname: "/CoversFAQs",
          //   title: "Covers FAQs",
          // },
        //   {
        //     icon: "Activity",
        //     pathname: "/PrivacyPolicy",
        //     title: "Privacy Policy",
        //   },
        //   {
        //     icon: "Activity",
        //     pathname: "/Terms",
        //     title: "Terms & Conditions",
        //   },
          
        // ]},
        // {
        //   icon: "User",
        //   pathname: "/update-profile",
        //   title: "Profile",
        // }

    



   
       
    //     {
    //       icon: "Activity",
    //       pathname: "/speakers",
    //       title: "Speakers",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/vendors",
    //       title: "Vendors",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/exhibitors",
    //       title: "Exhibitors",
    //     },
    //   ],
    // },

    // {
    //   icon: "Calendar",
    //   title: "Events",
    //   subMenu: [
    //     {
    //       icon: "Activity",
    //       pathname: "/conferences",
    //       title: "Conferences",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/themes",
    //       title: "Themes",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/events",
    //       title: "Events",
    //     }
    //   ],
    // },

    
    // {
      // icon: "Car",
      // title: "Game Logs",
      // subMenu: [
      //   {
      //     icon: "Activity",
      //     pathname: "/Vehicle",
      //     title: "Vehicle Make",
      //   },
      //   {
      //     icon: "Activity",
      //     pathname: "/model",
      //     title: "Vehicle Model",
      //   },
      //   {
      //     icon: "Activity",
      //     pathname: "/valuers",
      //     title: "Valuers",
      //   },
        
        // {
        //   icon: "Activity",
        //   pathname: "/documents",
        //   title: "Documents Types",
        // },
      //   {
      //     icon: "Activity",
      //     pathname: "/securityFeature",
      //     title: "Security Feature",
      //   },
      //   {
      //     icon: "Activity",
      //     pathname: "/financiers",
      //     title: "Financiers",
      //   },
        
            // {
        //   icon: "Umbrella",
        //   title: "Bets",
        //   subMenu: [
        //     {
        //       icon: "Activity",
        //       pathname: "/quotes",
        //       title: "Private Comprehensive Cover",
        //     },
        //     {
        //       icon: "Activity",
        //       pathname: "/Autocorrect",
        //       title: "Autocorrect Cover",
        //     },
        //     {
        //       icon: "Activity",
        //       pathname: "/Thirdparty",
        //       title: "Third Party Cover",
        //     },
        //     {
        //       icon: "Activity",
        //       pathname: "/Theft",
        //       title: "Third Party Fire and Theft",
        //     },


            
            
        //   ]},
        
      // ]},
    // {
    //   icon: "CreditCard",
    //   title: "Payments",
    //   subMenu: [
    //     {
    //       icon: "Activity",
    //       pathname: "/wallets",
    //       title: "Wallets",
    //     },
    //     {
    //       icon: "Activity",
    //       pathname: "/transaction-list",
    //       title: "Transactions",
    //     }
    //   ],
    // },
    // 
    // {
    //   icon: "PhoneCall",
    //   pathname: "/simcards",
    //   title: "Simcard Booking"
    // },
  
    
  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
