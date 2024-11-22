import { Transition } from "react-transition-group";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  setMenuState,
  selectSideMenu,
  initialState,
  teacherState,
  parentState,
} from "../../src/stores/sideMenuSlice";

import { useAppSelector } from "../../src/stores/hooks";
import { FormattedMenu, linkTo, nestedMenu, enter, leave } from "./side-menu";
import Lucide from "../../src/base-components/Lucide";
import clsx from "clsx";
import TopBar from "../../src/components/TopBar";
import MobileMenu from "../../src/components/MobileMenu";
import DarkModeSwitcher from "../../src/components/DarkModeSwitcher";
import { useDispatch, useSelector } from "react-redux";
import logoUrl from "../assets/images/hero.png";

import MainColorSwitcher from "../components/MainColorSwitcher";
import SideMenuTooltip from "../../src/components/SideMenuTooltip";
import { useAuth } from "../contexts/Auth";
interface School {
  school: Record<string, any>; // Replace `any` with specific types if known
  // Add other properties if needed
}

function Layout() {
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState<
    Array<FormattedMenu | "divider">
  >([]);
  const sideMenuStore = useAppSelector(selectSideMenu);
  const sideMenu = () => nestedMenu(sideMenuStore, location);
  const dispatch = useDispatch();
  const auth = useAuth();
  const user = auth?.authData?.user as School;

  useEffect(() => {
    setFormattedMenu(sideMenu());
  }, [sideMenuStore, location.pathname]);
  useEffect(() => {
    const handleStorageChange = () => {
      const type = localStorage.getItem("type");
      if (type === "parent") {
        dispatch(setMenuState(parentState));
      } else if (type === "teacher") {
        dispatch(setMenuState(teacherState));
      } else {
        dispatch(setMenuState(initialState));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Call handleStorageChange once to set initial state based on localStorage
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch]);
  return (
    <div className="py-5 md:py-0" style={{ backgroundColor: "#f5f5f5" }}>
      <DarkModeSwitcher />
      {/* <MainColorSwitcher /> */}
      <MobileMenu />
      {/* <TopBar layout="side-menu" /> */}
      <div className="flex overflow-hidden">
        {/* BEGIN: Side Menu */}
        {/* w-full fixed bg-primary/90 z-[60] border-b border-white/[0.08] -mt-5 -mx-3 sm:-mx-8 mb-6 dark:bg-darkmode-800/90 md:hidden */}
        {/* <nav className="w-[105px] bg-primary/90 xl:w-[260px] px-5 pb-16 overflow-x-hidden z-50 pt-10 -mt-4 hidden md:block"> */}
        <nav className="w-[105px] scrollbar-hidden h-full  bg-primary xl:w-[258px] px-5 pb-16 overflow-x-hidden z-50 pt-10 shadow rounded-md  hidden md:block fixed bg-primary z-[60] border-b border-white/[0.08]    mb-6 dark:bg-darkmode-800/90 ">
          <div className="mb-2">
            <img alt="ACS" className=" w-[130px] ml-5" src={logoUrl} />
          </div>
          <hr className="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent"></hr>
          <ul className="pt-10">
            {/* BEGIN: First Child */}
            {formattedMenu.map((menu, menuKey) =>
              menu == "divider" ? (
                <Divider
                  type="li"
                  className={clsx([
                    "my-6",
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
                          "bg-primary/[0.04] text-white rounded-xl relative dark:bg-transparent",
                          "before:content-[''] before:block before:inset-0 before:bg-white/30 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30",
                          { block: menu.activeDropdown },
                          { hidden: !menu.activeDropdown },
                        ])}
                      >
                        {menu.subMenu.map((subMenu, subMenuKey) => (
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
                                    "bg-primary/[0.04] text-white rounded-xl relative dark:bg-transparent",
                                    "before:content-[''] before:block before:inset-0 before:bg-white/30 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30",
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
            {/* END: First Child */}
          </ul>
        </nav>
        {/* END: Side Menu */}
        {/* BEGIN: Content */}
        <div
          // style={{ backgroundColor: "#f5f5f5" }}
          className={clsx([
            "md:ml-[150px] xl:ml-[270px] max-w-full md:max-w-none  md:rounded-none min-w-0 min-h-screen  flex-1   relative dark:bg-darkmode-700",
            "before:content-[''] before:w-full  before:block",
          ])}
        >
          {/* <div
          className={clsx([
            "max-w-full md:max-w-none rounded-[30px] md:rounded-none px-4 md:px-[22px] min-w-0 min-h-screen bg-slate-100 flex-1 md:pt-20 pb-10 mt-5 md:mt-1 relative dark:bg-darkmode-700",
            "before:content-[''] before:w-full before:h-px before:block",
          ])}
        ></div> */}
          {/* jj */}

          <TopBar layout="side-menu" />

          <div
            // style={{ backgroundColor: "#f5f5f5" }}
            className={clsx([
              "max-w-full md:max-w-none  md:rounded-none px-4 ] min-w-0 min-h-screen-100px  flex-1  md:mt-1 relative dark:bg-darkmode-700",
              "before:content-[''] before:w-full before:h-px before:block",
            ])}
          >
            {/* <div
              id="page-header box bg-white"
              className="box bg-white p-4 border-b border-gray-200"
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center">
                  <h4 className="flex items-center text-lg font-semibold text-gray-800">
                    <i className="mr-2 text-blue-600">+</i>
                    <span></span>
                  </h4>
                  <a href="#" className="ml-auto md:hidden text-gray-500">
                    <i className="text-lg">•••</i>
                  </a>
                </div>

                <div className="hidden md:flex justify-center mt-4 md:mt-0">
                  <a
                    href="http://127.0.0.1:8000/super_admin/settings"
                    className="text-gray-700 flex items-center space-x-2"
                  >
                    <i className="text-blue-500">⬇️</i>
                    <span className="font-semibold">
                      Current Session: {user?.school?.current_session}
                    </span>
                  </a>
                </div>
              </div>
            </div> */}
            {/* <div className="text-right">
              <b>Current Session: {user?.school?.current_session}</b>
            </div> */}
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
        "h-[50px]  flex items-center pl-5 mb-1 relative rounded-xl dark:text-slate-300",
        {
          "text-white-600   dark:text-slate-400":
            !props.menu.active && props.level != "first",
          "bg-slate-100 dark:bg-transparent":
            props.menu.active && props.level == "first",
          "before:content-[''] before:block before:inset-0 before:rounded-xl before:absolute before:border-b-[3px] before:border-solid before:border-black/[0.08] before:dark:border-black/[0.08] before:dark:bg-darkmode-700":
            props.menu.active && props.level == "first",
          "after:content-[''] after:w-[20px]   after:h-[80px] after:mr-[-27px] after:bg-menu-active after:bg-no-repeat after:bg-cover after:absolute after:top-0 after:bottom-0 after:right-0 after:my-auto after:dark:bg-menu-active-dark":
            props.menu.active && props.level == "first",
          "hover:bg-slate-100 hover:text-primary hover:dark:bg-transparent hover:before:content-[''] hover:before:block hover:before:inset-0 hover:before:rounded-xl hover:before:absolute hover:before:z-[-1] hover:before:border-b-[3px] hover:before:border-solid hover:before:border-black/[0.08] hover:before:dark:bg-darkmode-700":
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
          "text-primary z-10 dark:text-slate-300":
            props.menu.active && props.level == "first",
          "text-slate-700 dark:text-slate-300":
            props.menu.active && props.level != "first",
          "dark:text-slate-400": !props.menu.active,
        })}
      >
        <Lucide icon={props.menu.icon} />
      </div>
      <div
        className={clsx([
          "w-full  ml-3 hidden xl:flex items-center",
          {
            "text-primary font-medium z-10 dark:text-slate-300":
              props.menu.active && props.level == "first",
            "text-slate-700 font-medium dark:text-slate-300":
              props.menu.active && props.level != "first",
            "dark:text-slate-400": !props.menu.active,
          },
        ])}
      >
        {props.menu.title}
        {props.menu.subMenu && (
          <div
            className={clsx([
              "transition ease-in duration-100 ml-auto mr-5 hidden xl:block",
              { "transform rotate-180": props.menu.activeDropdown },
            ])}
          >
            <Lucide className="w-4 h-4" icon="ChevronDown" />
          </div>
        )}
      </div>
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
        "w-full h-px bg-black/[0.06] z-10 relative dark:bg-white/[0.07]",
      ])}
    ></Component>
  );
}

export default Layout;
