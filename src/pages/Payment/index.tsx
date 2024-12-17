import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { FormInput, FormCheck } from "../../base-components/Form";
import * as yup from "yup";
import { useAuth } from "../../contexts/Auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router-dom";
import Notification, {
    NotificationElement,
  } from "../../base-components/Notification";
import * as ApiService from "../../services/auth";
import { formatCurrency } from "../../utils/helper";

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



const Payment = () => {
    const auth = useAuth();
    const [loading, isLoading] = useState(false);
    const [success, setSuccess] = useState(true);
    const [message, setMessage] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState("");
    const [completed, setComplete] = useState(false);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [query, setQuery] = useState(searchParams.get("completed") || "");
    useEffect(() => {
      if (query) {
        setComplete(true);
      }
    }, []);
  
    const navigate = useNavigate();
    const notify = useRef<NotificationElement>();
    const schema = yup
      .object({
        
      })
      .required();
    const [Package, setPackage] = useState<any>(
      JSON.parse(localStorage.getItem("package") || "{}")
    );
    const [billing, setBilling] = useState<any>(
      JSON.parse(localStorage.getItem("billing") || "{}")
    );
    const {
      register,
      trigger,
      getValues,
      formState: { errors },
    } = useForm({
      mode: "onChange",
      resolver: yupResolver(schema),
    });
  
    const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      const result = await trigger();
  
      console.log(result);
  
      if (result && !loading) {
        isLoading(true);
        try {
          const data = await getValues();
          data.pricePerLearner = 1000;
          data.learners = 200;
          console.log(data);
          const billing_string = await localStorage.getItem("billing");
  
          if (billing_string !== null) {
            const billing = JSON.parse(billing_string);
            let res = await ApiService.paySubscription(billing);
            setPaymentUrl(res.redirect_url);
          } else {
            throw Error("Failed");
          }
          setSuccess(true);
          notify.current?.showToast();
        } catch (error: any) {
          isLoading(false);
          setSuccess(false);
          console.log(JSON.stringify(error));
          setMessage(error.message);
          notify.current?.showToast();
        }
      }
    };
  
    const [showPassword, setShowPassword] = useState<boolean>(false);
  
    const togglePasswordVisibility = () => {
      console.log("Button clicked");
      setShowPassword(!showPassword);
    };

  return (
    <>
      <div className="homeContainer sm:p-5 xl:p-0">
      <div className="flex justify-end items-center w-full p-0 bg-primary text-white ">
          
          <div className="buttons">
           
           
           
            <div className="hidden xl:flex gap-10  p-5">
            <Link to="/contact" className=" mr-5 font-medium text-lg">
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
           
            <div className="block xl:hidden ">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-blue-800 focus:outline-none mt-5"
              >
                {showMenu ? (
                  <X className="w-8 h-8" /> 
                ) : (
                  <Menu className="w-8 h-8" /> 
                )}
              </button>
            </div>

         
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
            </div>
      
          </div>
        </div>

        <div className="xl:p-10  p-5">
        <h1 className="xl:text-5xl text-2xl text-center font-semibold  text-primary w-full">
        Make  Payment
              </h1>
              <div className="flex justify-center items-center ">
        {completed && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Payment Completed
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Thank you for your payment.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/auth/login", { replace: true })}
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

        {!completed && !paymentUrl && !loading && (
          <form
            className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-md"
            onSubmit={onSubmit}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Payment Methods
            </h2>

            <div className="mb-5 text-center">
              <div className="font-bold text-gray-700 dark:text-gray-300 mb-5 ">
                You are about to pay
              </div>
              <span className="font-bold text-3xl">
                Ksh. {formatCurrency(billing?.totalCost)}
              </span>
            </div>
            {/* ddg */}
            {/* <div className="mb-5">
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Choose Payment Method
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center mr-4">
                  <input
                    {...register("paymentMethod")}
                    name="mpesa"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 dark:text-white">MPESA</span>
                </label>
                <label className="inline-flex items-center mr-4">
                  <input
                    {...register("paymentMethod")}
                    type="radio"
                    name="paypal"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 dark:text-white">PayPal</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    {...register("paymentMethod")}
                    type="radio"
                    name="rtg"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 dark:text-white">RTG</span>
                </label>
              </div>
            </div> */}

            <div className="mt-8 flex justify-center">
              <button className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Proceed to Payment
              </button>
            </div>
          </form>
        )}
        <div className="flex flex-col justify-between h-full">
          {paymentUrl && loading && (
            <div className="text-center font-bold text-2xl">
              Processing Please Wait....
            </div>
          )}
          {!paymentUrl && loading && (
            <div className="text-center font-bold text-2xl">
              Initiating payment....
            </div>
          )}
          {loading && (
            <div className="flex justify-center">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                className="w-20 h-20"
              >
                <circle
                  fill="#2E86FF"
                  stroke="#2E86FF"
                  strokeWidth="2"
                  r="15"
                  cx="40"
                  cy="100"
                >
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="1s"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.4s"
                  />
                </circle>
                <circle
                  fill="#2E86FF"
                  stroke="#2E86FF"
                  strokeWidth="2"
                  r="15"
                  cx="100"
                  cy="100"
                >
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="1s"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.2s"
                  />
                </circle>
                <circle
                  fill="#2E86FF"
                  stroke="#2E86FF"
                  strokeWidth="2"
                  r="15"
                  cx="160"
                  cy="100"
                >
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="1s"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="0s"
                  />
                </circle>
              </svg>
            </div>
          )}

          {paymentUrl && (
            <div className="flex justify-center">
              <iframe
                width="860"
                height={loading ? 0 : 1000}
                src={paymentUrl}
                onLoad={() => isLoading(false)}
              ></iframe>
            </div>
          )}
        </div>
      </div>
        
        </div>
       


        <div className=" bg-primary ">
          <div className="grid mt-10  overflow-hidden sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:divide-y-0 xl:grid-cols-2">
            <div className="group p-10 xl:ml-10  dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <h1 className="xl:text-3xl text-2xl font-semibold mt-5 text-white w-full">
                Hero Learning
              </h1>
              
              <div className=" text-white flex gap-5  xl:mt-8">
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
            <h1 className="xl:text-2xl font-medium  xl:p-10 text-white w-full">
            Subscribe to stay tuned for new web design and  latest updates. Let's do it!
              </h1>
           
              <form className="validate-form mt-5">
              <div className="flex gap-5 xl:pl-10">
                <div className="input-form">
                  <FormInput
                    id="validation-form-2"
                    type="text"
                    name="email"
                    placeholder="Enter Your Email Address"
                    className="block px-4 py-3  min-w-full xl:min-w-[350px] w-full rounded-none"
                  />
                </div>
                <div className="text-center ">
                <Button
                 className="w-full bg-white  h-[45px] xl:min-w-[150px] rounded-none text-lg"
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

export default Payment;
