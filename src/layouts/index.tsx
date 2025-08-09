import { Transition } from "react-transition-group";
import {
  useState,
  useEffect,
  CSSProperties,
  Dispatch,
  SetStateAction,
} from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  setMenuState,
  selectSideMenu,
  initialState,
  teacherState,
  parentState,
} from "../../src/stores/sideMenuSlice";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

import { useAppSelector } from "../../src/stores/hooks";
import { FormattedMenu, linkTo, nestedMenu, enter, leave } from "./side-menu";
import Lucide from "../../src/base-components/Lucide";
import clsx from "clsx";
import TopBar from "../../src/components/TopBar";
import MobileMenu from "../../src/components/MobileMenu";
import DarkModeSwitcher from "../../src/components/DarkModeSwitcher";
import { useDispatch, useSelector } from "react-redux";
import logoUrl from "../assets/images/hero.png";
import Joyride from "react-joyride";

import MainColorSwitcher from "../components/MainColorSwitcher";
import SideMenuTooltip from "../../src/components/SideMenuTooltip";
import { useAuth } from "../contexts/Auth";
import { useTour } from "../TourContext";
import { IMG_URL } from "../utils/constants";

interface School {
  school: Record<string, any>; // Replace `any` with specific types if known
  // Add other properties if needed
}

function Layout() {
  const location = useLocation();
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#000000");

  const { runTour, currentSteps, handleStepChange } = useTour();
  const [formattedMenu, setFormattedMenu] = useState<
    Array<FormattedMenu | "divider">
  >([]);
  const sideMenuStore = useAppSelector(selectSideMenu);
  const sideMenu = () => nestedMenu(sideMenuStore, location);
  const dispatch = useDispatch();
  const auth = useAuth();
  const [school, setSchool] = useState<any>();
  useEffect(() => {
    setSchool(JSON.parse(localStorage.getItem("school") ?? "{}"));
  }, [auth]);
  const navigate = useNavigate();

  useEffect(() => {
    setFormattedMenu(sideMenu());
  }, [sideMenuStore, location.pathname, auth]);

  useEffect(() => {
    const handleStorageChange = () => {
      const type = localStorage.getItem("type");

      if (type === "parent") {
        dispatch(setMenuState(parentState));
      }
      //  else if (type === "teacher") {
      //   dispatch(setMenuState(teacherState));
      // }
      else {
        dispatch(setMenuState(initialState));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Call handleStorageChange once to set initial state based on localStorage
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch, auth]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DarkModeSwitcher />
      {/* <MainColorSwitcher /> */}
      <MobileMenu />
      {/* <TopBar layout="side-menu" /> */}
      <div className="flex">
        {/* OrbitNest Style Sidebar */}
        <nav
          className={`w-[280px] h-screen overflow-y-auto z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block fixed shadow-lg`}
        >
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3">
                <Lucide icon="BookOpen" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {school?.name || "Elimurise"}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Learning Platform
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-4">
            {/* Main Navigation */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
                Main Navigation
              </h3>
              <ul className="space-y-1">
                {formattedMenu
                  .filter(
                    (menuDetails: any) =>
                      (menuDetails.subMenu &&
                        menuDetails.subMenu.filter(
                          (menuDetails: any) => !menuDetails.ignore
                        ).length > 0) ||
                      (!menuDetails.subMenu && !menuDetails.ignore)
                  )
                  .map((menu, menuKey) =>
                    menu == "divider" ? (
                      <Divider
                        type="li"
                        className={clsx([
                          "my-4",
                          // Animation
                          `opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-divider] animate-fill-mode-forwards animate-delay-${
                            (menuKey + 1) * 10
                          }`,
                        ])}
                        key={menuKey}
                      ></Divider>
                    ) : (
                      <li key={menuKey}>
                        <Menu
                          className={clsx({
                            // Animation
                            [`opacity-0 text-white translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                              (menuKey + 1) * 10
                            }`]: !menu.active,
                          })}
                          menu={menu}
                          formattedMenuState={[formattedMenu, setFormattedMenu]}
                          level="first"
                        ></Menu>
                        {/* BEGIN: Second Child */}
                        {menu.subMenu && (
                          <Transition
                            in={menu.activeDropdown}
                            onEnter={enter}
                            onExit={leave}
                            timeout={300}
                          >
                            <ul
                              className={clsx([
                                "bg-gray-50 dark:bg-gray-700 rounded-lg mt-1 ml-4 border border-gray-200 dark:border-gray-600",
                                { block: menu.activeDropdown },
                                { hidden: !menu.activeDropdown },
                              ])}
                            >
                              {menu.subMenu
                                .filter((menuDetails: any) => !menuDetails.ignore)
                                .map((subMenu, subMenuKey) => (
                                  <li key={subMenuKey}>
                                    <Menu
                                      className={clsx({
                                        // Animation
                                        [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                          (subMenuKey + 1) * 10
                                        }`]: !subMenu.active,
                                      })}
                                      menu={subMenu}
                                      formattedMenuState={[
                                        formattedMenu,
                                        setFormattedMenu,
                                      ]}
                                      level="second"
                                    ></Menu>
                                    {/* BEGIN: Third Child */}
                                    {subMenu.subMenu && (
                                      <Transition
                                        in={subMenu.activeDropdown}
                                        onEnter={enter}
                                        onExit={leave}
                                        timeout={300}
                                      >
                                        <ul
                                          className={clsx([
                                            "bg-gray-50 dark:bg-gray-700 rounded-lg mt-1 ml-4 border border-gray-200 dark:border-gray-600",
                                            { block: subMenu.activeDropdown },
                                            { hidden: !subMenu.activeDropdown },
                                          ])}
                                        >
                                          {subMenu.subMenu.map(
                                            (lastSubMenu, lastSubMenuKey) => (
                                              <li key={lastSubMenuKey}>
                                                <Menu
                                                  className={clsx({
                                                    // Animation
                                                    [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                                      (lastSubMenuKey + 1) * 10
                                                    }`]: !lastSubMenu.active,
                                                  })}
                                                  menu={lastSubMenu}
                                                  formattedMenuState={[
                                                    formattedMenu,
                                                    setFormattedMenu,
                                                  ]}
                                                  level="third"
                                                ></Menu>
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      </Transition>
                                    )}
                                    {/* END: Third Child */}
                                  </li>
                                ))}
                            </ul>
                          </Transition>
                        )}
                        {/* END: Second Child */}
                      </li>
                    )
                  )}
              </ul>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
                Quick Actions
              </h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition-colors">
                    <Lucide icon="Plus" className="w-4 h-4 mr-3" />
                    Add Student
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition-colors">
                    <Lucide icon="FileText" className="w-4 h-4 mr-3" />
                    Create Report
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition-colors">
                    <Lucide icon="Calendar" className="w-4 h-4 mr-3" />
                    Schedule Event
                  </a>
                </li>
              </ul>
            </div>

            {/* Settings */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
                Settings
              </h3>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition-colors">
                    <Lucide icon="Settings" className="w-4 h-4 mr-3" />
                    System Settings
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition-colors">
                    <Lucide icon="Users" className="w-4 h-4 mr-3" />
                    User Management
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20 transition-colors">
                    <Lucide icon="Shield" className="w-4 h-4 mr-3" />
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* END: Side Menu */}
        {/* BEGIN: Content */}
        <div
          className={clsx([
            "md:ml-[280px] max-w-full md:max-w-none md:rounded-none min-w-0 min-h-screen flex-1 relative",
            "before:content-[''] before:w-full before:block",
          ])}
        >
          <div className="hidden md:block">
            <TopBar layout="side-menu" />
          </div>

          <div
            className={clsx([
              "max-w-full md:max-w-none md:rounded-none px-6 py-6 min-w-0 min-h-screen-100px flex-1 md:mt-4 relative",
              "before:content-[''] before:w-full before:h-px before:block",
            ])}
          >
            <Outlet />
          </div>
        </div>
        {/* END: Content */}
      </div>
    </div>
  );
}

function Menu(props: {
  className?: string;
  menu: FormattedMenu;
  formattedMenuState: [
    (FormattedMenu | "divider")[],
    Dispatch<SetStateAction<(FormattedMenu | "divider")[]>>
  ];
  level: "first" | "second" | "third";
}) {
  const navigate = useNavigate();
  const [formattedMenu, setFormattedMenu] = props.formattedMenuState;

  return (
    <SideMenuTooltip
      as="a"
      content={props.menu.title}
      href={props.menu.subMenu ? "#" : props.menu.pathname}
      className={clsx([
        "flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200",
        {
          "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700":
            !props.menu.active && props.level != "first",
          "bg-primary text-white shadow-lg":
            props.menu.active && props.level == "first",
          "hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20":
            !props.menu.active &&
            !props.menu.activeDropdown &&
            props.level == "first",

          // Animation
          "after:-mr-[47px] after:opacity-0 after:animate-[0.4s_ease-in-out_0.1s_active-side-menu-chevron] after:animate-fill-mode-forwards":
            props.menu.active && props.level == "first",
        },
        props.className,
      ])}
      onClick={(event: React.MouseEvent) => {
        event.preventDefault();
        linkTo(props.menu, navigate);
        setFormattedMenu([...formattedMenu]);
      }}
    >
      <div
        className={clsx({
          "text-white z-10":
            props.menu.active && props.level == "first",
          "text-gray-700 dark:text-gray-300":
            props.menu.active && props.level != "first",
          "text-gray-500 dark:text-gray-400": !props.menu.active,
        })}
      >
        <Lucide icon={props.menu.icon} className="w-4 h-4 mr-3" />
      </div>
      <div
        className={clsx([
          "flex-1",
          {
            "text-white z-10":
              props.menu.active && props.level == "first",
            "text-gray-700 font-medium dark:text-gray-300":
              props.menu.active && props.level != "first",
            "text-gray-500 dark:text-gray-400": !props.menu.active,
          },
        ])}
      >
        {props.menu.title}
      </div>
      {props.menu.subMenu && (
        <div
          className={clsx([
            "transition ease-in duration-200",
            { "transform rotate-180": props.menu.activeDropdown },
          ])}
        >
          <Lucide className="w-4 h-4" icon="ChevronDown" />
        </div>
      )}
    </SideMenuTooltip>
  );
}

function Divider<C extends React.ElementType>(
  props: { as?: C } & React.ComponentPropsWithoutRef<C>
) {
  const { className, ...computedProps } = props;
  const Component = props.as || "div";

  return (
    <Component
      {...computedProps}
      className={clsx([
        props.className,
        "w-full h-px bg-gray-200 dark:bg-gray-600 z-10 relative",
      ])}
    ></Component>
  );
}

export default Layout;
