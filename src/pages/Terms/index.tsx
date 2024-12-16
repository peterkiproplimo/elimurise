import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { FormInput, FormCheck , FormSelect} from "../../base-components/Form";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

import logoUrl from "../assets/images/Untitled-1.png";
import logo from "../../assets/images/heros.png";
import icon from "../../assets/images/Arrow_Right_MD.png"

import users from "../../assets/images/Users_Group.png";

import email from "../../assets/images/social.png";
import phone from "../../assets/images/social (1).png";

import youtube from "../../assets/images/instagram.png";
import linked from "../../assets/images/linkedin.png";
import facebook from "../../assets/images/Vector (1).png";
import { Menu, X } from "lucide-react";



const Terms = () => {
  const schema = yup
    .object({
      email: yup.string().required().email(),
      password: yup.string().required().min(4),
    })
    .required();
  const [loading, isLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="homeContainer sm:p-5 xl:p-0">
      <div className="flex justify-end items-center w-full p-0 bg-primary text-white ">
          
          <div className="buttons">
           
           
           
            <div className="hidden xl:flex gap-10  p-5">
            <Link  to="/contact" className=" mr-5 font-medium text-lg">
            Support
              </Link>
              <div className="flex">
              <div className="icon ">
            <img alt="ACS" className="xl:w-35  xl:w-auto" src={users} />
          </div>
              <Link to="/" className=" ml-2 font-medium text-lg ">
            
              For Teachers & Administrators
              </Link>
              </div>
            </div>
      
          </div>
        </div>
        <div className="flex justify-between items-center w-full px-4 lg:px-10 shadow-lg p-2">
          <div className="icon ">
            <img alt="ACS" className="xl:w-35 ml-10  xl:w-auto" src={logo} />
          </div>
          <div className="buttons">
            {/* Hamburger Menu Icon for small screens */}
            <div className="block xl:hidden ">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-blue-800 focus:outline-none mt-5"
              >
                {showMenu ? (
                  <X className="w-8 h-8" /> // X icon to close menu
                ) : (
                  <Menu className="w-8 h-8" /> // Three-line icon to open menu
                )}
              </button>
            </div>

            {/* Links as Dropdown (for small screens) */}
            {showMenu && (
              <div className="absolute z-10  bg-white shadow-lg rounded-md p-3 w-50 -ml-10  ">
                <div className=" text-center">
                  <Link to="/register" className="block mb-3 text-blue-800">
                    Register
                  </Link>
                </div>
                <div className="text-center">
                  <Link to="/auth/login" className="block text-blue-800">
                    Sign in
                  </Link>
                </div>
              </div>
            )}

            {/* Buttons for large screens (xl and above) */}
            <div className="hidden xl:flex gap-5  ">
            <Link to="/" className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg text-primary">
              Why Us
              </Link>
              <Link to="/" className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg text-primary">
               Pricing
              </Link>
              <Link to="/contact" className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg text-primary">
               Contact Us
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

        <div className="xl:p-10  p-5">
        <h1 className="xl:text-3xl text-2xl  text-center font-semibold   w-full">
        TERMS OF USE
              </h1>
        <h1 className="xl:text-5xl text-2xl mt-5 text-center font-semibold  text-primary w-full">
        Hero Learning
              </h1>
           
                 <div className="xl:p-10  p-5">
        
              <h1 className="xl:text-3xl text-xl font-semibold text-primary w-full">
              1.Introduction
              </h1>
              <div className="mt-2  xl:text-2xl">
            <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, ex nec venenatis condimentum, lacus libero viverra purus, a interdum lacus mauris ac eros. 
                Nulla ac semper ligula, sed fringilla lacus. Vivamus hendrerit felis a lacus vestibulum, non euismod enim faucibus</p>
             
              </div>
            
           
           
        
        <h1 className="xl:text-3xl mt-8 text-xl font-semibold text-primary w-full">
        2. Acceptance of Terms
        </h1>
        <div className="mt-2 xl:text-2xl">
      <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, ex nec venenatis condimentum, lacus libero viverra purus, a interdum lacus mauris ac eros. 
          Nulla ac semper ligula, sed fringilla lacus. Vivamus hendrerit felis a lacus vestibulum, non euismod enim faucibus</p>
        </div>
      </div>
  
      <div className="xl:p-10  p-2">
        
        <h1 className="xl:text-3xl text-xl font-semibold text-primary w-full">
        3. Registration and Account Security
        </h1>
        <div className="mt-2 xl:text-2xl">
      <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, ex nec venenatis condimentum, lacus libero viverra purus, a interdum lacus mauris ac eros. 
          Nulla ac semper ligula, sed fringilla lacus. Vivamus hendrerit felis a lacus vestibulum, non euismod enim faucibus</p>
        </div>
      
      </div>




        
        </div>
        
       


        <div className=" bg-primary ">
          <div className="grid  overflow-hidden sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:divide-y-0 xl:grid-cols-2">
            <div className="group xl:p-10  p-5 xl:ml-10  dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <h1 className="xl:text-3xl text-2xl font-semibold mt-5 text-white w-full">
                Hero Learning
              </h1>
              
              <div className=" text-white flex gap-5  mt-10 xl:mt-8">
            <Link to="/policy" className="xl:px-3 xl:py-3  xl:text-lg ">
              Privacy Policy
              </Link>
              <Link to="/terms" className="xl:px-3 xl:py-3  xl:text-lg ">
               Terms of Use
              </Link>
              <Link to="/contact" className="xl:px-3 xl:py-3  xl:text-lg ">
               Contact Us
              </Link>
              </div>
            
            </div>
            <div className="group p-10 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 -m-5 justify-center align-center ">
            <h1 className="xl:text-2xl xl:font-medium  xl:p-10 text-white w-full">
            Subscribe to stay tuned for new web design and  latest updates. 
            <span className="hidden xl:inline">
    <br />
  </span> 
            Let's do it!
              </h1>
           
              <form className="validate-form mt-5">
              <div className="flex xl:gap-5 gap-2 xl:pl-10">
                <div className="input-form">
                  <FormInput
                    id="validation-form-2"
                    type="text"
                    name="email"
                    placeholder="Enter Your Email Address"
                    className="block px-4 xl:py-3 py-2 min-w-full xl:min-w-[350px] w-full xl:rounded-none"
                  />
                </div>
                <div className="text-center ">
                <Button
                  className="w-full bg-white h-[38px] xl:h-[45px] xl:min-w-[150px] xl:rounded-none xl:text-lg text-md"
                >
                  Subscribe
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </Button>
              </div>
              </div>
             
            </form>
           
            </div>
            

            </div>
                
            <div className="border-b border-white w-full xl:mt-8 mt-5" ></div>
            <div className="flex justify-between">
            <div className="m-5 text-white text-xs xl:text-md">
              <p>© 2024 All Rights Reserved </p></div>
            <div className=" text-white flex p-2  ">
            <Link to="/register" className="xl:px-3 xl:py-3 px-2 py-2 font-medium text-lg ">
              <img
                  alt="ACS"
                  className="xl:w-35 md:w-10 xl:w-auto"
                  src={facebook}
                />
              </Link>
            <Link to="/register" className="xl:px-3 xl:py-3 px-2 py-2 font-medium text-lg ">
            <img
                alt="ACS"
                className="xl:w-35 md:w-10  xl:w-auto"
                src={email}
              />
              </Link>
              <Link to="/register" className="xl:px-3 xl:py-3 px-2 py-2 font-medium text-lg ">
              <img
                alt="ACS"
                className="xl:w-35 md:w-10 xl:w-auto"
                src={phone}
              />
              </Link>
              <Link to="/register" className="xl:px-3 xl:py-3 px-2 py-2 font-medium text-lg ">
              <img
                  alt="ACS"
                  className="xl:w-35 md:w-10 xl:w-auto"
                  src={youtube}
                />
              </Link>
              <Link to="/register" className="xl:px-3 xl:py-3 px-2 py-2 font-medium text-lg ">
              <img
                  alt="ACS"
                  className="xl:w-35 md:w-10 xl:w-auto"
                  src={linked}
                />
              </Link>
            
              </div>
              </div>
           
           


          </div>


            </div>
    </>
  );
};

export default Terms;
