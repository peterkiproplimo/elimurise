import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  useEffect(() => {
    // Function to fetch notifications
    const fetchNotifications = () => {
      getParentNotifications();
    };

    // Call initially
    fetchNotifications();

    // Set interval to call every minute
    const interval = setInterval(() => {
      fetchNotifications();
    }, 1000); // 60000ms = 1 minute

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  const dismissParentNotifications = async (id: any) => {
    const type = localStorage.getItem("type");

    if (type === "parent") {
      console.log(id);
      const response = await ApiService.dismissParentNotifications(id);
    } else {
      const response = await ApiService.dissmissSchoolNotifications(id);
    }
    getParentNotifications();
    setSelectedNotification(null);
  };
  const getParentNotifications = async () => {
    const type = localStorage.getItem("type");

    if (type === "parent") {
      const response = await ApiService.getParentNotifications({ page: 1 });
      setNotifications(response.data);
    } else {
      const response = await ApiService.getSchoolNotifications({ page: 1 });
      setNotifications(response.data);
    }
  };
  const switchMode = () => {
    dispatch(setDarkMode(!darkMode));
    localStorage.setItem("darkMode", (!darkMode).toString());
    setDarkModeClass();
  };
  setDarkModeClass();

  useEffect(() => {
    setSchool(JSON.parse(localStorage.getItem("school") ?? "{}"));
    setUser(auth.authData && auth.authData?.user);
  }, [user]);

  return (
    <>
      <div
        // className="bg-primary"
        className={clsx([
          "h-[70px] md:h-[65px] z-[51] rounded-25 box m-2 box  px-4 md:border-b-0 relative   dark:md:from-darkmode-700",
          props.layout == "top-menu" && "dark:md:from-darkmode-800",
          // "before:content-[''] before:absolute before:h-[65px] before:inset-0 before:top-0   before:mt-2  before:hidden before:md:block before:dark:bg-darkmode-900/30",
          // "after:content-[''] after:absolute after:inset-0 after:h-[70px] after:bg-primary  before:shadow-[0px_3px_20px_#0000000b] rounded-25 after:hidden after:md:block after:dark:bg-darkmode-600",
        ])}
      >
        <div className="flex items-center h-full">
          {/* BEGIN: Logo */}
          <Link
            to="/"
            className={clsx([
              "- hidden md:fle text-primary",
              props.layout == "side-menu" && "xl:w-[120px]",
              props.layout == "simple-menu" && "xl:w-auto",
              props.layout == "top-menu" && "w-auto",
            ])}
          >
            {/* <img
              alt="ACS"
              className="xl:w-25 md:w-10 xl:w-auto"
              src={logoUrl}
            /> */}
          </Link>
          {/* END: Logo */}
          {/* BEGIN: Breadcrumb */}
          <Breadcrumb
            light
            className={clsx([
              "text-primary h-[45px] md:ml-10 md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -",
              props.layout != "top-menu" && "md:pl-6",
              props.layout == "top-menu" && "md:pl-10",
            ])}
          >
            {/* {/* <Breadcrumb.Link to="/">Application</Breadcrumb.Link> */}
            <Breadcrumb.Link to="/" active={true}>
              Dashboard
            </Breadcrumb.Link>
          </Breadcrumb>
          <div className="hidden md:flex justify-center mt-4 md:mt-0">
            <a
              href="settings"
              className="text-gray-700 flex items-center space-x-2"
            >
              <i className="text-blue-500">⬇️</i>
              <span className="font-semibold">
                Current Session: {school?.current_session}
              </span>
            </a>
          </div>
          {/* END: Breadcrumb */}
          {/* BEGIN: Search */}
          {/* <div className="relative mr-3 ml-3  sm:mr-6">
            <div className="relative hidden sm:block">
              <TomSelect
                options={{
                  placeholder: "Search",
                }}
                className="border-transparent w-56 shadow-none rounded-full bg-slate-200 pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-72 dark:bg-darkmode-400"
              ></TomSelect>
            </div>
          </div> */}

          {/* END: Search */}
          {/* BEGIN: Notifications */}

          {/* Notification Popover */}
          <Popover className="mr-4 ml-4 sm:mr-6">
            <Popover.Button
              className="
            relative text-primary/70 outline-none block
            before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute 
            before:top-[-2px] before:right-0 before:bg-danger
          "
            >
              <Lucide icon="Bell" className="w-5 h-5 dark:text-slate-500" />
            </Popover.Button>

            <Popover.Panel className="w-[280px] sm:w-[350px] p-5 mt-2 max-h-[300px] overflow-y-auto bg-white rounded-lg shadow-lg">
              <div className="mb-5 font-medium">Notifications</div>
              {notifications.length > 0 ? (
                notifications.map((notification: any) => (
                  <div
                    key={notification._id}
                    className="cursor-pointer flex flex-col p-3 rounded-lg hover:bg-gray-100 transition"
                    onClick={() => setSelectedNotification(notification)}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium truncate">
                        {notification.title}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {notification.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No new notifications
                </p>
              )}
            </Popover.Panel>
          </Popover>

          {/* Full Notification Dialog */}
          {/* <Transition appear show={!!selectedNotification} as={Fragment}> */}
          <Dialog
            open={!!selectedNotification}
            as="div"
            // className="relative z-50"
            onClose={() => {
              setSelectedNotification(null);
            }}
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6">
                <Dialog.Title className="text-lg font-semibold">
                  {selectedNotification?.title}
                </Dialog.Title>
                <p className="text-xs text-gray-400">
                  {new Date(selectedNotification?.createdAt).toLocaleString()}
                </p>
                <Dialog.Description className="mt-2 text-gray-700">
                  {selectedNotification?.message}
                </Dialog.Description>
                {selectedNotification?.link && (
                  <a
                    href={selectedNotification.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mt-2 block"
                  >
                    View More
                  </a>
                )}
                <button
                  onClick={() => {
                    dismissParentNotifications(selectedNotification._id);
                  }}
                  className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Mark as read
                </button>
              </Dialog.Panel>
            </div>
          </Dialog>

          {/* END: Notifications */}
          {/* BEGIN: Account Menu */}
          <Menu>
            <Menu.Button className="block w-10 h-10 shadow-lg overflow-hidden rounded-full  image-fit  ">
              <img alt="" src={IMG_URL + school?.logo} />
            </Menu.Button>
            <Menu.Items className="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
              <Menu.Header className="font-normal">
                <div className="font-medium">
                  {user?.firstname} {user?.lastname}
                </div>
                {/* <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                  {fakerData[0].jobs[0]}
                </div> */}
              </Menu.Header>
              <Menu.Divider className="bg-white/[0.08]" />
              <Link to="/home/profile">
                <Menu.Item className="hover:bg-white/5">
                  <Lucide icon="User" className="w-4 h-4 mr-2" />
                  Profile
                </Menu.Item>
              </Link>
              <Menu.Item
                className={`hover:bg-${darkMode ? "white/5" : "black/5"}`}
                onClick={switchMode}
              >
                <Lucide
                  icon={darkMode ? "Sun" : "Moon"}
                  className="w-4 h-4 mr-2"
                />
                {darkMode ? "Light Mode" : "Dark Mode"}
              </Menu.Item>
              <Menu.Divider className="bg-white/[0.08]" />
              <Menu.Item className="hover:bg-white/5" onClick={signOut}>
                <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Sign Out
              </Menu.Item>
            </Menu.Items>
          </Menu>
          {/* END: Account Menu */}
        </div>
      </div>
    </>
  );
}

export default Main;
