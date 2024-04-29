import illustrationUrl from "../assets/images/illustration.png";
import { Outlet } from "react-router-dom";
import logoUrl from "../assets/images/hero.png";
import clsx from "clsx";
import "./auth.css";

const Auth = () => {
  return (
    <>
      <div
        className={clsx([
          "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
      
        ])}
      >
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-2 gap-4 xl:grid">
            {/* BEGIN: Login Info */}
            <div className="flex-col hidden min-h-screen xl:flex">
              <div className="my-auto">
                <div className=" text-4xl font-medium leading-tight text-white -intro-x">
                Empowering Competency <br /> Based Curriculum (CBC)  <br />Education In Kenya
                 
                  {/* 3 Days */}
                </div>
                {/* <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                  Empowering Competency-Based Curriculum (CBC) Education <br />
                  In kenya
                </div> */}
              </div>
            </div>
            {/* END: Login Info */}
            {/* BEGIN: Login Form */}
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <Outlet />
            </div>
            {/* END: Login Form */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
