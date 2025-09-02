import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Lucide from "../../base-components/Lucide";
import logoUrl from "../../assets/images/Elimurise.png";
import Breadcrumb from "../../base-components/Breadcrumb";
import { Dialog, Menu, Popover } from "../../base-components/Headless";
import TomSelect from "../../base-components/TomSelect";
import fakerData from "../../utils/faker";
import _ from "lodash";
import clsx from "clsx";
import "./topbar.css";
import { useAuth } from "../../contexts/Auth";
import * as ApiService from "../../services/auth";
import { selectDarkMode, setDarkMode } from "../../stores/darkModeSlice";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { IMG_URL } from "../../utils/constants";

function Main(props: { layout?: "side-menu" | "simple-menu" | "top-menu" }) {
  const auth = useAuth();
  const location = useLocation(); // To get current route
  const signOut = () => {
    auth.signOut();
  };
  const [selectedNotification, setSelectedNotification] = useState<any | null>(
    null
  );
  const [notifications, setNotifications] = useState<any>([]);
  const [user, setUser] = useState<any>({});
  const [school, setSchool] = useState<any>({});

  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);

  const setDarkModeClass = () => {
    const el = document.querySelectorAll("html")[0];
    darkMode ? el.classList.add("dark") : el.classList.remove("dark");
  };

  const switchMode = () => {
    dispatch(setDarkMode(!darkMode));
    localStorage.setItem("darkMode", (!darkMode).toString());
    setDarkModeClass();
  };

  const dismissParentNotifications = async (id: any) => {
    const type = localStorage.getItem("type");
    if (type === "parent") {
      await ApiService.dismissParentNotifications(id);
    } else {
      await ApiService.dissmissSchoolNotifications(id);
    }
    getParentNotifications();
    setSelectedNotification(null);
  };

  const getParentNotifications = async () => {
    const type = localStorage.getItem("type");
    const response =
      type === "parent"
        ? await ApiService.getParentNotifications({ page: 1 })
        : await ApiService.getSchoolNotifications({ page: 1 });
    setNotifications(response.data);
  };

  useEffect(() => {
    getParentNotifications();
    setSchool(JSON.parse(localStorage.getItem("school") ?? "{}"));
    setUser(auth.authData && auth.authData?.user);
    setDarkModeClass();
  }, [auth.authData]);

  // Dynamic Breadcrumb Logic
  const getBreadcrumbItems = () => {
    const path = location.pathname.split("/").filter((x) => x);
    const items = [{ to: "/home", label: "Dashboard" }];

    if (path.length > 0) {
      path.forEach((segment, index) => {
        const to = `/${path.slice(0, index + 1).join("/")}`;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        items.push({ to, label });
      });
    }

    return items;
  };

  return (
    <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between shadow-sm">
      {/* Left Side - Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Lucide icon="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Right Side - Controls */}
      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={switchMode}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <Lucide icon={darkMode ? "Sun" : "Moon"} className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <Popover className="relative">
          <Popover.Button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative">
            <Lucide icon="Bell" className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Popover.Button>
          <Popover.Panel className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Notifications
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {notifications.length} new
              </span>
            </div>
            {notifications.length > 0 ? (
              notifications.map((notification: any) => (
                <div
                  key={notification._id}
                  className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600 mb-2"
                  onClick={() => setSelectedNotification(notification)}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-800 dark:text-white truncate">
                      {notification.title}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                    {notification.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Lucide icon="BellOff" className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  No new notifications
                </p>
              </div>
            )}
          </Popover.Panel>
        </Popover>

        {/* Messages */}
        <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
          <Lucide icon="Mail" className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <Menu>
          <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.firstname?.charAt(0) || "U"}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.firstname} {user?.lastname}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400">
                Online
              </div>
            </div>
            <Lucide icon="ChevronDown" className="w-4 h-4 text-gray-500" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-50">
            <Menu.Header className="px-3 py-2">
              <div className="font-semibold text-gray-800 dark:text-white">
                {user?.firstname} {user?.lastname}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </div>
            </Menu.Header>
            <Menu.Divider className="border-gray-200 dark:border-gray-600" />
            <Link to="/home/profile">
              <Menu.Item className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <Lucide icon="User" className="w-4 h-4 mr-2" />
                Profile
              </Menu.Item>
            </Link>
            <Menu.Item
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={switchMode}
            >
              <Lucide
                icon={darkMode ? "Sun" : "Moon"}
                className="w-4 h-4 mr-2"
              />
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Menu.Item>
            <Menu.Divider className="border-gray-200 dark:border-gray-600" />
            <Menu.Item
              className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              onClick={signOut}
            >
              <Lucide icon="LogOut" className="w-4 h-4 mr-2" />
              Sign Out
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      {/* Notification Dialog */}
      <Dialog
        open={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
      >
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-xl font-semibold text-gray-800 dark:text-white">
              {selectedNotification?.title}
            </Dialog.Title>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {new Date(selectedNotification?.createdAt).toLocaleString()}
            </p>
            <Dialog.Description className="mt-3 text-gray-700 dark:text-gray-300">
              {selectedNotification?.message}
            </Dialog.Description>
            {selectedNotification?.link && (
              <a
                href={selectedNotification.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline mt-3 block hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View More
              </a>
            )}
            <button
              onClick={() =>
                dismissParentNotifications(selectedNotification._id)
              }
              className="mt-4 w-full bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors font-medium"
            >
              Mark as Read
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default Main;
