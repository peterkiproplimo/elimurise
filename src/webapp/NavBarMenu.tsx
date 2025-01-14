import React, { useState } from "react";
import Button from "../base-components/Button";
import LoadingIcon from "../base-components/LoadingIcon";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import lock from "../assets/images/Lock.png";
import logo from "../assets/images/heros.png";
import contact4 from "../assets/images/contact2.png";
import users from "../assets/images/Users_Group.png";
import check from "../assets/images/Checkbox_Check.png";
import vector from "../assets/images/Vector.png";
import user from "../assets/images/User.png";
import icon from "../assets/images/login.png";

const NavbarMenu = () => {
  const [loading, isLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  const handleClick = () => {
    setShowLinks(!showLinks);
  };

  return (
    <>
    <div className="flex justify-end items-center w-full p-0 bg-primary text-white ">
          
    <div className="buttons">
     
     
     
    <div className="hidden lg:flex flex-col gap-5 w-[310px]">
              {/* Toggleable Text */}
              <div
                onClick={handleClick}
                className={`font-bold flex text-center text-lg p-4 text-primary cursor-pointer transition duration-300 ${
                  showLinks ? "bg-red-500 text-white" : "text-white"
                }`}
              >
                <div className="icon mr-2 ">
                  <img alt="ACS" className="w-7 h-7" src={users} />
                </div>

                {showLinks
                  ? "For Teachers & Administrators"
                  : "Log in or register for free"}
              </div>

              {/* Links to display when clicked */}
              {showLinks && (
                <div className="absolute top-full left-0 w-full  bg-white shadow-lg  rounded">
                  <div className="flex flex-col gap-4 ">
                    <Link
                      to="/auth/login"
                      className="font-bold   items-center text-lg text-primary w-full mt-4 ml-4"
                    >
                      <div className=" flex w-[240px]">
                        Log in
                        <div className="icon ml-auto mt-2">
                          <img alt="ACS" className="xl:w-35 " src={icon} />
                        </div>
                      </div>
                    </Link>
                    <div className="border-b border-primary/50 w-full m-0 p-0"></div>
                    <Link
                      to="/register"
                      className="ml-2 font-bold text-lg text-primary w-full mb-4 ml-4"
                    >
                      <div className=" flex w-[240px]">
                        Register
                        <div className="icon ml-auto mt-2">
                          <img alt="ACS" className="xl:w-35 " src={icon} />
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
      

    </div>
  </div>
  <div className='box'>
  <div className="flex xl:mx-auto xl:w-[80%] justify-between items-center w-full px-4 lg:px-10  p-2">
  <Link to="/">
  <div className="icon">
    <img alt="ACS" className="xl:w-35 xl:w-auto" src={logo} />
  </div>
</Link>
          <div className="buttons">
            <div className="block xl:hidden">
    <button
      onClick={() => setShowMenu(!showMenu)}
      className="text-blue-800 focus:outline-none mt-5"
    >
      {showMenu ? (
        <Menu className="w-8 h-8" />
      ) : (
        <Menu className="w-8 h-8" /> 
      )}
    </button>
  </div>

  {showMenu && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
      <div className="fixed left-0 top-0 bottom-0 bg-white shadow-lg w-80 p-5 transform transition-all duration-300 ease-in-out z-30">
        <div className="text-right mb-4">
          <button
            onClick={() => setShowMenu(false)}
            className="bg-primary text-white  p-2 focus:outline-none"
            >
            <X className="w-8 h-8" />
          </button>
        </div>
        <div className="border-b border-primary/50 w-full mt-8"></div>
        <div className=" ">
          <p className="p-2 text-primary font-bold text-xl">
            For Business
          </p>
          <Link to="/demo" className="block pl-2 text-lg text-primary flex items-center">
  <img 
    src={check}
    alt="Demo Icon" 
    className="w-6 h-6 mr-2" 

  />
  Request Demo
</Link>

          <p className="block pl-2 text-lg text-primary flex items-center">
  <img 
    src={vector}
    alt="Demo Icon" 
    className="w-6 h-6 mr-2" 

  />   Call Us: (+254) 712-345678
          </p>
        </div>
        <div className="border-b border-primary/50 w-full p-2"></div>
        <div className=" mb-4 ">
          <p className="p-2 text-primary  font-bold text-xl">
          For School & Adminstrators
          </p>
          <Link  to="/auth/login"  className="block pl-2 text-lg  hover:text-blue-800 hover:scale-105 text-primary flex items-center">
  <img 
    src={lock}
    alt="Demo Icon" 
    className="w-6 h-6 mr-2" 

  />  Login
          </Link>
          <Link to="/register"  className="block pl-2 text-lg  hover:text-blue-800 hover:scale-105 text-primary flex items-center">
  <img 
    src={user}
    alt="Demo Icon" 
    className="w-6 h-6 mr-2" 

  /> Create Account
          </Link>
          <Link to="/contact" className="block pl-2 text-lg  hover:text-blue-800 hover:scale-105 text-primary flex items-center">
  <img 
    src={contact4}
    alt="Demo Icon" 
    className="w-6 h-6 mr-2" 

  />   Contact Us
          </Link>
        </div>
      </div>
    </div>
  )}

            {/* Buttons for large screens (xl and above) */}
            <div className="hidden xl:flex gap-5 mr-10 ">
            <Link to="/" className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg  hover:text-blue-800 hover:scale-105 text-primary">
              Home
              </Link>
            <a href="/" className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg   hover:text-blue-800 hover:scale-105 text-primary">
              Why Us
              </a>
              <Link
        to="/"
       
        
        className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg hover:text-blue-800 hover:scale-105 text-primary cursor-pointer"
      >
        Pricing
      </Link>
              <Link to="/contact" className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg  hover:text-blue-800 hover:scale-105 text-primary">
               Contact Us
              </Link>
              <Link to="/" className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg  hover:text-blue-800 hover:scale-105 text-primary">
               About Us
              </Link>
              <Link to="/demo" className="xl:w-32 xl:mr-8">
                <Button
                  className="text-md w-[192px] p-2 h-[50px] bg-[#FF3B30] text-white rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px]"
                >
                 REQUEST DEMO
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </Button>
              </Link>
              {/* <Link to="/auth/login" className="xl:w-32 xl:mr-3">
                <Button className="w-full xl:px-4 xl:py-3 px-2 py-2 border-blue-800">
                  Sign in
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </Button>
              </Link> */}
            </div>
      
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarMenu;
