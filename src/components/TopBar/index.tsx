import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Lucide from "../../base-components/Lucide";
import logoUrl from "../../assets/images/hero.png";
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
    <div
      className={clsx([
        "h-[70px] md:h-[65px] z-[51] m-2 rounded-2xl shadow-lg px-4 flex items-center",
        " to-indigo-800 dark:from-darkmode-700 dark:to-darkmode-800",
        props.layout === "top-menu" && "dark:from-darkmode-800",
      ])}
      style={
        school?.secondaryColor ? { backgroundColor: school.secondaryColor } : {}
      }
    >
      <div className="flex items-center w-full">
        {/* BEGIN: Logo */}
        <Link
          to="/"
          className={clsx([
            "flex items-center text-white font-bold",
            props.layout === "side-menu" && "xl:w-[120px]",
            props.layout === "simple-menu" && "xl:w-auto",
            props.layout === "top-menu" && "w-auto",
          ])}
        >
          <img alt="Hero" className="w-10 md:w-12" src={logoUrl} />
        </Link>
        {/* END: Logo */}

        {/* BEGIN: Breadcrumb */}
        <Breadcrumb light className="flex-1 ml-4 md:ml-8 text-white">
          {getBreadcrumbItems().map((item: any, index: any) => (
            <Breadcrumb.Link
              key={index}
              to={item.to}
              active={index === getBreadcrumbItems().length - 1}
              className="text-sm hover:text-indigo-200 transition duration-200"
            >
              {item.label}
            </Breadcrumb.Link>
          ))}
        </Breadcrumb>
        {/* END: Breadcrumb */}

        {/* BEGIN: Current Session */}
        <div className="hidden md:flex items-center text-white mr-6">
          <Lucide icon="Calendar" className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">
            Session: {school?.current_session || "N/A"}
          </span>
        </div>
        {/* END: Current Session */}

        {/* BEGIN: Notifications */}
        <Popover className="mr-4">
          <Popover.Button className="relative text-white focus:outline-none">
            <Lucide icon="Bell" className="w-6 h-6" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Popover.Button>
          <Popover.Panel className="w-80 mt-2 bg-white rounded-xl shadow-xl p-4 max-h-96 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Notifications
            </h3>
            {notifications.length > 0 ? (
              notifications.map((notification: any) => (
                <div
                  key={notification._id}
                  className="p-3 rounded-lg hover:bg-gray-100 transition duration-200 cursor-pointer"
                  onClick={() => setSelectedNotification(notification)}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-800 truncate">
                      {notification.title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {notification.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                No new notifications
              </p>
            )}
          </Popover.Panel>
        </Popover>
        {/* END: Notifications */}

        {/* BEGIN: Notification Dialog */}
        <Dialog
          open={!!selectedNotification}
          onClose={() => setSelectedNotification(null)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6">
              <Dialog.Title className="text-xl font-semibold text-gray-800">
                {selectedNotification?.title}
              </Dialog.Title>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(selectedNotification?.createdAt).toLocaleString()}
              </p>
              <Dialog.Description className="mt-3 text-gray-700">
                {selectedNotification?.message}
              </Dialog.Description>
              {selectedNotification?.link && (
                <a
                  href={selectedNotification.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 underline mt-3 block"
                >
                  View More
                </a>
              )}
              <button
                onClick={() =>
                  dismissParentNotifications(selectedNotification._id)
                }
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Mark as Read
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
        {/* END: Notification Dialog */}

        {/* BEGIN: Account Menu */}
        <Menu>
          <Menu.Button className="w-10 h-10 rounded-full overflow-hidden shadow-lg border-2 border-white">
            <img alt="School Logo" src={IMG_URL + school?.logo} />
          </Menu.Button>
          <Menu.Items className="w-56 mt-2 bg-white rounded-xl shadow-xl p-2">
            <Menu.Header className="px-3 py-2">
              <div className="font-semibold text-gray-800">
                {user?.firstname} {user?.lastname}
              </div>
            </Menu.Header>
            <Menu.Divider className="border-gray-200" />
            <Link to="/home/profile">
              <Menu.Item className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Lucide icon="User" className="w-4 h-4 mr-2" />
                Profile
              </Menu.Item>
            </Link>
            <Menu.Item
              className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={switchMode}
            >
              <Lucide
                icon={darkMode ? "Sun" : "Moon"}
                className="w-4 h-4 mr-2"
              />
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Menu.Item>
            <Menu.Divider className="border-gray-200" />
            <Menu.Item
              className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={signOut}
            >
              <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" />
              Sign Out
            </Menu.Item>
          </Menu.Items>
        </Menu>
        {/* END: Account Menu */}
      </div>
    </div>
  );
}

export default Main;
