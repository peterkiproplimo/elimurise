import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Lucide from "../../base-components/Lucide";
import logoUrl from "../../assets/images/hero.png";
import Breadcrumb from "../../base-components/Breadcrumb";
import { Menu, Popover } from "../../base-components/Headless";
import TomSelect from "../../base-components/TomSelect";
import fakerData from "../../utils/faker";
import _ from "lodash";
import clsx from "clsx";
import "./topbar.css";
import { useAuth } from "../../contexts/Auth";
import * as ApiService from "../../services/auth";
import { selectDarkMode, setDarkMode } from "../../stores/darkModeSlice";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";

function Main(props: { layout?: "side-menu" | "simple-menu" | "top-menu" }) {
  const auth = useAuth();
  const signOut = () => {
    auth.signOut();
  };
  const [user, setUser] = useState<any>({});

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
  setDarkModeClass();

  useEffect(() => {
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
              "-intro-x hidden md:fle text-primary",
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
              "text-primary h-[45px] md:ml-10 md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -intro-x",
              props.layout != "top-menu" && "md:pl-6",
              props.layout == "top-menu" && "md:pl-10",
            ])}
          >
            {/* {/* <Breadcrumb.Link to="/">Application</Breadcrumb.Link> */}
            <Breadcrumb.Link to="/" active={true}>
              Dashboard
            </Breadcrumb.Link>
          </Breadcrumb>
          {/* END: Breadcrumb */}
          {/* BEGIN: Search */}
          <div className="relative mr-3 intro-x sm:mr-6">
            <div className="relative hidden sm:block">
              <TomSelect
                options={{
                  placeholder: "Search",
                }}
                className="border-transparent w-56 shadow-none rounded-full bg-slate-200 pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-72 dark:bg-darkmode-400"
              ></TomSelect>
            </div>
          </div>
          {/* END: Search */}
          {/* BEGIN: Notifications */}
          <Popover className="mr-4 intro-x sm:mr-6">
            <Popover.Button
              className="
              relative text-primary/70 outline-none block
              before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute before:top-[-2px] before:right-0 before:bg-danger
            "
            >
              <Lucide icon="Bell" className="w-5 h-5 dark:text-slate-500" />
            </Popover.Button>
            <Popover.Panel className="w-[280px] sm:w-[350px] p-5 mt-2">
              <div className="mb-5 font-medium">Notifications</div>
              {_.take(fakerData, 5).map((faker, fakerKey) => (
                <div
                  key={fakerKey}
                  className={clsx([
                    "cursor-pointer relative flex items-center",
                    { "mt-5": fakerKey },
                  ])}
                >
                  <div className="relative flex-none w-12 h-12 mr-1 image-fit">
                    <img
                      alt=""
                      className="rounded-full"
                      src={faker.photos[0]}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"></div>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="" className="mr-5 font-medium truncate">
                        {faker.users[0].name}
                      </a>
                      <div className="ml-auto text-xs text-slate-400 whitespace-nowrap">
                        {faker.times[0]}
                      </div>
                    </div>
                    <div className="w-full truncate text-slate-500 mt-0.5">
                      {faker.news[0].shortContent}
                    </div>
                  </div>
                </div>
              ))}
            </Popover.Panel>
          </Popover>
          {/* END: Notifications */}
          {/* BEGIN: Account Menu */}
          <Menu>
            <Menu.Button className="block w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
              <img alt="" src={fakerData[9].photos[0]} />
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
              <Link to="/profile">
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
