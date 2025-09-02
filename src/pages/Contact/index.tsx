import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { FormInput, FormCheck } from "../../base-components/Form";
import * as yup from "yup";

import { Link } from "react-router-dom";

import logoUrl from "../assets/images/Untitled-1.png";
import logo from "../../assets/images/Elimurise.png";
import icon from "../../assets/images/Arrow_Right_MD.png";
import email from "../../assets/images/Social Media Button (1).png";
import phone from "../../assets/images/Social Media Button (2).png";

import youtube from "../../assets/images/Social Media Button (4).png";
import linked from "../../assets/images/Social Media Button (3).png";
import facebook from "../../assets/images/Social Media Button.png";
import whatsapp from "../../assets/images/Social Media Button (5).png";

import FooterComponent from "../../webapp/footer";
import NavbarMenu from "../../webapp/NavBarMenu";

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
        <NavbarMenu />

        <div className="xl:mx-auto  max-w-[1500px] p-5">
          <h1 className="xl:text-5xl text-2xl text-center font-semibold  text-primary w-full">
            Get in touch with Elimurise Learning
          </h1>
          <div className="grid xl:mt-10 bg-white xl:ml-10 xl:mr-10 overflow-hidden rounded-3xl sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:divide-y-0 xl:grid-cols-2">
            <div className="group p-5 xl:p-10 xl:ml-10  dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <h1 className="xl:text-3xl text-xl font-semibold xl:mt-5 text-primary w-full">
                Are you a School Administrator?
              </h1>
              <div className="mt-2">
                <p className="xl:text-lg sm:text-3l text-[#808080]">
                  We revolutionize education through our innovative digital
                  Competency Based <br /> Curriculum (CBC) approach. Join us in
                  shaping the future of learning.
                </p>
              </div>
              <div className=" mt-3 xl:mt-8  xl:text-left">
                <Button
                  variant="primary"
                  as="a"
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=info@Elimuriselearning.co.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary bg-transparent border-primary text-md w-[192px] hover:bg-[#D1D9F9] p-2 h-[40px]  mb-2 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border"
                >
                  {" "}
                  info@Elimuriselearning.co.ke
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
                  We'd love to hear more about your school's goals and share
                  with you how hundreds of schools are using Elimurise Learning
                  today.
                </p>
              </div>

              <div className=" mt-3 xl:mt-8 xl:text-left">
                <Button
                  variant="primary"
                  className="text-primary bg-transparent border-primary text-md w-[102px] p-2 h-[40px] hover:bg-[#D1D9F9] mb-2 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border"
                >
                  {" "}
                  Get Support
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
                Additional Contacts{" "}
              </h1>
              <div className="mt-2">
                <p className="xl:text-lg sm:text-3l text-[#808080]">
                  For media inquiries, please
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=info@Elimuriselearning.co.ke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1.5 font-medium text-primary transition duration-300 ease-in-out hover:text-blue-800"
                  >
                    email our communications team here.
                  </a>
                </p>
              </div>
              <h1 className="xl:text-xl text-xl font-semibold mt-5 text-primary w-full">
                Follow Us on:
              </h1>
              <div className="text-white flex ">
                <Link to="/register" className=" px-2 py-2 font-medium text-lg">
                  <img
                    alt="ACS"
                    className="xl:w-35 md:w-10 xl:w-auto"
                    src={facebook}
                  />
                </Link>
                <Link to="/register" className="px-2 py-2 font-medium text-lg">
                  <img
                    alt="ACS"
                    className="xl:w-35 md:w-10 xl:w-auto"
                    src={email}
                  />
                </Link>
                <Link to="/register" className="px-2 py-2 font-medium text-lg">
                  <img
                    alt="ACS"
                    className="xl:w-35 md:w-10 xl:w-auto"
                    src={phone}
                  />
                </Link>
                <Link to="/register" className="px-2 py-2 font-medium text-lg">
                  <img
                    alt="ACS"
                    className="xl:w-35 md:w-10 xl:w-auto"
                    src={linked}
                  />
                </Link>
                <Link to="/register" className="px-2 py-2 font-medium text-lg">
                  <img
                    alt="ACS"
                    className="xl:w-35 md:w-10 xl:w-auto"
                    src={youtube}
                  />
                </Link>

                <Link to="/register" className=" px-2 py-2 font-medium text-lg">
                  <img
                    alt="ACS"
                    className="xl:w-35 md:w-10 xl:w-auto"
                    src={whatsapp}
                  />
                </Link>
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
                      className="block px-4 py-3  min-w-full xl:min-w-[350px] w-full rounded-md   border-gray-300"
                    />
                  </div>
                  <div className="input-form p-2">
                    <FormInput
                      id="validation-form-2"
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      className="block px-4 py-3  min-w-full xl:min-w-[350px] w-full rounded-md  border-gray-300"
                    />
                  </div>
                  <div className="input-form p-2">
                    <FormInput
                      id="validation-form-3"
                      type={"password"}
                      name="password"
                      placeholder="School Name *"
                      className="block px-4 py-3  min-w-full xl:min-w-[350px] w-full rounded-md   border-gray-300"
                    />
                  </div>
                  <div className="input-form p-2">
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Comment: Let us know how we can help you"
                      className="mt-1 block px-4 py-3  min-w-full xl:min-w-[350px] h-[150px] w-full rounded-md   border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
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
                    <label
                      className="cursor-pointer select-none text-[#808080]"
                      htmlFor="remember-me"
                    >
                      You agree to our friendly
                      <Link
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
                    Send Message{" "}
                    <div className="icon mr-2">
                      <img
                        alt="ACS"
                        className="xl:w-35  xl:w-auto"
                        src={icon}
                      />
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
        <FooterComponent />
      </div>
    </>
  );
};

export default Contact;
