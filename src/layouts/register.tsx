import illustrationUrl from "../assets/images/illustration.png";
import { Outlet } from "react-router-dom";
import logoUrl from "../assets/images/Elimurise.png";
import clsx from "clsx";
import "./auth.css";
import logo from "../assets/images/Elimurise.png";
import Button from "../base-components/Button";
import { Link } from "react-router-dom";
import React, { useState, useRef } from "react";

const Auth = () => {
  const [loading, isLoading] = useState(false);

  return (
    <>
      <div
        className={clsx([
          "bg-white",

        ])}
      >
        <div className="relative z-10 ">
          <div className="block  ">
            {/* BEGIN: Login Info */}
            <div className="home bg-slate-200 rounded shandow flex justify-between ">
              <div className="icon ">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-10 xl:w-auto"
                  src={logo}
                />
              </div>
              <div className="flex items-center">
                <div className=" text-center   xl:text-left">
                  <Link
                    to="/"
                    className="btn-2 w-full px-4 py-3 align-top xl:w-32 border-blue-800"
                  >
                    <Button
                      variant="outline-primary"
                      className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                    >
                      Home
                    </Button>
                  </Link>
                </div>
                <div className="   text-center  xl:text-left">
                  <Link
                    to="/auth/login"
                    className="btn w-full px-4 py-3 align-top xl:w-32 border-blue-800"
                  >
                    <Button
                      variant="outline-primary"
                      className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                    >
                      Sign in
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* END: Login Info */}
            {/* BEGIN: Login Form */}
            <div className="h-screen py-5 xl:h-auto xl:w-auto xl:py-0 xl:my-0">
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
