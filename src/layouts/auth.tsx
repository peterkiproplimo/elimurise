import illustrationUrl from "../assets/images/illustration.png";
import { Outlet } from "react-router-dom";
import logoUrl from "../assets/images/hero.png";
import image from "../assets/images/Image sidebar.png";
import clsx from "clsx";
import "./auth.css";
import { useEffect } from "react";

const Auth = () => {
  // useEffect(() => {
  //   localStorage.clear();
  // }, []);
  return (
    <>
      <div className="grid bg-white overflow-hidden rounded-3xl sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-[2fr_3fr] xl:grid-cols-[2fr_3fr]">
        {/* Slimmer Image Section */}
        <div className="group w-full dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 flex">
          <div className="relative w-full xl:h-[100vh] h-[80vh] ">
            <img
              src={image}
              alt="Demo Icon"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Wider Form Section */}
        <div className="group relative dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 ">
          <Outlet />
        </div>
      </div>

      {/* <div
        className={clsx([
          "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-white xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
        ])}
      >
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-2 gap-4 xl:grid">
        
            <div className="flex-col hidden min-h-screen xl:flex">
              <div className="my-auto">
              <img 
    src={image}
    alt="Demo Icon" 
    className="w-full h-full mr-2" 

  />
              </div>
            </div>
         
            <div className="flex h-screen py-5 my-10 xl:p-10 xl:h-auto xl:py-0 xl:my-0">
              <Outlet />
            </div>
         
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Auth;
