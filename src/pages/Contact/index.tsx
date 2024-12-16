import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { FormInput, FormCheck } from "../../base-components/Form";
import * as yup from "yup";

import { Link } from "react-router-dom";

import logoUrl from "../assets/images/Untitled-1.png";
import logo from "../../assets/images/heros.png";
import icon from "../../assets/images/Arrow_Right_MD.png"

import users from "../../assets/images/Users_Group.png";
import user from "../../assets/images/User.png";
import contact4 from  "../../assets/images/contact2.png";
import check from "../../assets/images/Checkbox_Check.png";
import vector from "../../assets/images/Vector.png";
import lock from "../../assets/images/Lock.png";

import email from "../../assets/images/social.png";
import phone from "../../assets/images/social (1).png";

import youtube from "../../assets/images/instagram.png";
import linked from "../../assets/images/linkedin.png";
import facebook from "../../assets/images/Vector (1).png";
import { Menu, X } from "lucide-react";



const Contact = () => {
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
      <div className="homeContainer  xl:p-0">
      <div className="flex justify-end items-center w-full p-0 bg-primary text-white ">
          
          <div className="buttons">
           
           
           
            <div className="hidden xl:flex gap-10  p-5">
            <Link to="/contact" className=" mr-5 font-medium text-lg hover:text-blue-800 hover:scale-105">
            Support
              </Link>
              <div className="flex">
              <div className="icon ">
            <img alt="ACS" className="xl:w-35  xl:w-auto" src={users} />
          </div>
              <Link to="/" className=" ml-2 font-medium text-lg hover:text-blue-800 hover:scale-105 ">
            
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
          <Link to="/demo" className="block pl-2 text-lg text-primary flex items-center hover:text-blue-800 hover:scale-105">
  <img 
    src={check}
    alt="Demo Icon" 
    className="w-6 h-6 mr-2" 

  />
  Request Demo
</Link>

          <p className="block pl-2 text-lg text-primary flex items-center hover:text-blue-800 hover:scale-105">
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
            <div className="hidden xl:flex gap-5  ">
            <a href="#about" className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg   hover:text-blue-800 hover:scale-105 text-primary">
              Why Us
              </a>
              <a href="#pricing" className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg  hover:text-blue-800 hover:scale-105 text-primary">
               Pricing
              </a>
              <Link to="/contact" className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg  hover:text-blue-800 hover:scale-105 text-primary">
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
        <h1 className="xl:text-5xl text-2xl text-center font-semibold  text-primary w-full">
        Get in touch with Hero Learning
              </h1>
          <div className="grid xl:mt-10 xl:ml-10 xl:mr-10 overflow-hidden rounded-3xl sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:divide-y-0 xl:grid-cols-2">
            <div className="group p-5 xl:p-10 xl:ml-10  dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <h1 className="xl:text-3xl text-xl font-semibold xl:mt-5 text-primary w-full">
              Are you a School Administrator? 
              </h1>
              <div className="mt-2">
                <p className="xl:text-lg sm:text-3l text-[#808080]">
                  We revolutionize education
                  through our innovative digital Competency Based <br/> Curriculum
                  (CBC) approach. Join us in shaping the future of learning.
                </p>
              </div>
              <div className=" mt-3 xl:mt-8  xl:text-left">
                <Button
                  variant="primary"
                  as="a"
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=info@herolearning.co.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary bg-transparent border-primary text-md w-[192px] hover:bg-[#D1D9F9] p-2 h-[40px]  mb-2 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border"
>              info@herolearning.co.ke
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </Button>
              </div>
              <h1 className="xl:text-3xl text-xl font-semibold mt-5 text-primary w-full">
              Are you an existing Partner?
              </h1>
              <div className="mt-2">
                <p className="xl:text-lg sm:text-3l text-[#808080]">
                We'd love to hear more about your school's goals and share with you how hundreds of schools are using Hero Learning today.
                </p>
              </div>

              <div className=" mt-3 xl:mt-8 xl:text-left">
                <Button
                  variant="primary"
                  className="text-primary bg-transparent border-primary text-md w-[102px] p-2 h-[40px] hover:bg-[#D1D9F9] mb-2 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border"
>             Get Support
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </Button>
              </div>
              <h1 className="xl:text-3xl text-xl font-semibold mt-5 text-primary w-full">
              Additional Contacts              </h1>
              <div className="mt-2">
                <p className="xl:text-lg sm:text-3l text-[#808080]">
                For media inquiries, please
                <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=info@herolearning.co.ke"
  target="_blank"
  rel="noopener noreferrer"
  className="ml-1.5 font-medium text-primary transition duration-300 ease-in-out hover:text-blue-800"
>
  email our communications team here.
</a>

            </p>
              </div>
              
            </div>
            <div className="group relative dark:bg-gray-800 p-2  m-0 w-full flex">
  <form className="validate-form w-full box p-8 border ">
    <div className="mt-5">
      <div className="input-form p-2">
        <FormInput
          id="validation-form-2"
          type="text"
          name="text"
          placeholder="Full Name *"
          className="block px-4 py-3  min-w-full xl:min-w-[350px] w-full rounded-none  border-gray-300"
        />
      </div>
      <div className="input-form p-2">
      
        <FormInput
          id="validation-form-2"
          type="email"
          name="email"
          placeholder="Email Address *"
          className="block px-4 py-3  min-w-full xl:min-w-[350px] w-full rounded-none  border-gray-300"
        />
      </div>
      <div className="input-form p-2">
    
          <FormInput
            id="validation-form-3"
            type={"password"}
            name="password"
            placeholder="School Name *"
            className="block px-4 py-3  min-w-full xl:min-w-[350px] w-full rounded-none  border-gray-300"
          />
        
      </div>
      <div className="input-form p-2">
    
      <textarea
          id="message"
          name="message"
        
          placeholder="Comment: Let us know how we can help you"
          className="mt-1 block px-4 py-3  min-w-full xl:min-w-[350px] h-[150px] w-full rounded-none  border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        ></textarea>
  
</div>
    </div>
    <div className="flex mt-4 text-xs text-slate-600 dark:text-slate-500 sm:text-sm">
      <div className="flex items-center mr-auto ml-2">
        <FormCheck.Input
          id="remember-me"
          type="checkbox"
          className="mr-2 border-gray-300"
        />
        <label className="cursor-pointer select-none text-[#808080]" htmlFor="remember-me">
        You agree to our friendly<Link
  to="/policy"
  className="font-medium ml-1.5 text-primary "
>
privacy policy
</Link>
        </label>
      </div>
    </div>
    <div className=" mt-5   xl:mt-8 xl:text-left">
                <Button
                  variant="primary"
                  className="text-md w-[162px] p-2 h-[40px] px-3 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border "

                >
           Send Message       <div className="icon mr-2">
            <img alt="ACS" className="xl:w-35  xl:w-auto" src={icon} />
          </div>
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </Button>
              </div>
  </form>
</div>



          </div>
        </div>
       


        <div className=" bg-primary ">
          <div className="grid mt-10  overflow-hidden sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:divide-y-0 xl:grid-cols-2">
            <div className="group p-5 xl:ml-10  dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <h1 className="xl:text-3xl text-2xl font-semibold mt-5 text-white w-full">
                Hero Learning
              </h1>
              
              <div className=" text-white flex gap-5  xl:mt-8">
            <Link to="/policy" className="xl:px-3 xl:py-3  xl:text-lg hover:text-blue-800 hover:scale-105 ">
              Privacy Policy
              </Link>
              <Link to="/terms" className="xl:px-3 xl:py-3  xl:text-lg hover:text-blue-800 hover:scale-105 ">
               Terms of Use
              </Link>
              <Link to="/contact" className="xl:px-3 xl:py-3  xl:text-lg hover:text-blue-800 hover:scale-105">
               Contact Us
              </Link>
              </div>
            
            </div>
            <div className="group p-10 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 -m-5 justify-center align-center ">
            <h1 className="xl:text-2xl xl:font-medium  xl:p-10 text-white w-full">
            Subscribe to stay tuned for new web design and  latest updates. Let's do it!
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
                
            <div className="border-b border-white w-full mt-8" ></div>
            <div className="flex justify-between">
            <div className="m-5 text-white">
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

export default Contact;
