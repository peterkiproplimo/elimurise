import illustrationUrl from "../assets/images/illustration.png";
import { Outlet } from "react-router-dom";
import logoUrl from "../assets/images/hero.png";
import image from "../assets/images/Image sidebar.png";
import clsx from "clsx";
import "./auth.css";
import { useEffect } from "react";

const Auth = () => {
  return (
    <>
      <div className="grid bg-white overflow-hidden rounded-3xl sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-[2fr_3fr] xl:grid-cols-[2fr_3fr] relative">
        {/* Background Image for Small Screens */}
        <div
          className="absolute inset-0 bg-cover bg-center lg:hidden"
          style={{ backgroundImage: `url(${image})` }}
        ></div>

        {/* Left Image Section for Larger Screens */}
        <div className="hidden lg:block relative w-full h-screen">
          <img
            src={image}
            alt="Demo Icon"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* Wider Form Section */}
        <div className="relative z-10 bg-white bg-opacity-80 lg:bg-opacity-100">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Auth;
