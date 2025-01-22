import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../base-components/Button";
import LoadingIcon from "../base-components/LoadingIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FormInput, FormCheck } from "../base-components/Form";
import * as yup from "yup";
import "./home.css";
import { Link } from "react-router-dom";
import lock from "../assets/images/Lock.png";
import contact4 from "../assets/images/contact2.png";

import logoUrl from "../assets/images/Untitled-1.png";
import logo from "../assets/images/heros.png";
import icon from "../assets/images/login.png";
import stroke from "../assets/images/Vector 32.png";
import homepic from "../assets/images/Ellipse.png";
import child from "../assets/images/Mask group.png";
import aboutpic from "../assets/images/excellence.png";
import aboutpic2 from "../assets/images/inclusive.png";
import aboutpic3 from "../assets/images/community.png";
import aboutpic4 from "../assets/images/Frame.png";
import pic from "../assets/images/Rectangle.jpg";
import pic2 from "../assets/images/Rectangle 8.png";
import pic3 from "../assets/images/Rectangle.png";
import pic4 from "../assets/images/Rectangle 8 (3).png";
import users from "../assets/images/Users_Group.png";
import check from "../assets/images/Checkbox_Check.png";
import vector from "../assets/images/Vector.png";
import user from "../assets/images/User.png";
import servicepic from "../assets/images/user_group.png";
import servicepic2 from "../assets/images/parental-control .png";
import servicepic3 from "../assets/images/teacher-showing-on-whiteboard 1.png";

import { Menu, X } from "lucide-react";
import FooterComponent from "./footer";
import NavbarMenu from "./NavBarMenu";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel";

const Home = () => {
  const schema = yup
    .object({
      email: yup.string().required().email(),
      password: yup.string().required().min(4),
    })
    .required();
  const [loading, isLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const handleClick = () => {
    setShowLinks(!showLinks);
  };

  const handleLogoClick = () => {
    window.location.reload();
  };

  const items = [
    "Standard Summative Assessment",
    "Custom Summative Assessment",
    "Formative Assessment",
    "Learner Report",
    "Learner Promotion",
    "Learner Transfers",
    "Stream Analysis Report",
    "Grade Analysis Report",
    "Combined Summative & Formative Termly Report",
    "Parents Portal",
    "Dedicated Account Manager",
    "Dedicated Technical Support",
  ];

  // Display either the first 6 items or all items depending on `showAll`
  const displayedItems = showAll ? items : items.slice(0, 6);

  return (
    <>
      <div className="homeContainer sm:p-5 xl:p-0 p-0 font-lexend">
        <div className="flex justify-end items-center w-full p-0 bg-primary text-white ">
          <div className="buttons">
            <div
              className="hidden lg:flex flex-col gap-5 w-[310px] relative"
              onMouseEnter={() => setShowLinks(true)}
              onMouseLeave={() => setShowLinks(false)}
            >
              {/* Toggleable Text */}
              <div
                className={`font-bold flex text-center text-lg p-4 pl-0 text-primary cursor-pointer transition duration-300 ${
                  showLinks ? "bg-red-500 text-white" : "text-white"
                }`}
              >
                <div className="icon mr-2 ml-2">
                  <img alt="ACS" className="w-7 h-7" src={users} />
                </div>

                {showLinks
                  ? "For Teachers & Administrators"
                  : "Log in or register for free"}
              </div>

              {/* Links to display when hovered */}
              {showLinks && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded">
                  <div className="flex flex-col gap-4">
                    <Link
                      to="/auth/login"
                      className="font-bold items-center text-lg text-primary w-full mt-4 ml-4"
                    >
                      <div className="flex w-[240px]">
                        Log in
                        <div className="icon ml-auto mt-2">
                          <img alt="ACS" className="xl:w-35" src={icon} />
                        </div>
                      </div>
                    </Link>
                    <div className="border-b border-primary/50 w-full m-0 p-0"></div>
                    <Link
                      to="/register"
                      className="ml-2 font-bold text-lg text-primary w-full mb-4 ml-4"
                    >
                      <div className="flex w-[240px]">
                        Register
                        <div className="icon ml-auto mt-2">
                          <img alt="ACS" className="xl:w-35" src={icon} />
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Links to display when clicked */}
            {showLinks && (
              <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded">
                <div className="flex flex-col gap-4">
                  <Link
                    to="/auth/login"
                    className="font-bold items-center text-lg text-primary w-full mt-4 ml-4"
                  >
                    <div className="flex w-[240px]">
                      Log in
                      <div className="icon ml-auto mt-2">
                        <img alt="ACS" className="xl:w-35" src={icon} />
                      </div>
                    </div>
                  </Link>
                  <div className="border-b border-primary/50 w-full m-0 p-0"></div>
                  <Link
                    to="/register"
                    className="ml-2 font-bold text-lg text-primary w-full mb-4 ml-4"
                  >
                    <div className="flex w-[240px]">
                      Register
                      <div className="icon ml-auto mt-2">
                        <img alt="ACS" className="xl:w-35" src={icon} />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="box">
          <div className="flex xl:mx-auto  max-w-[1500px] justify-between items-center w-full px-4 lg:px-10  p-2">
            <div className="icon cursor-pointer" onClick={handleLogoClick}>
              <img alt="ACS" className="xl:w-35 xl:w-auto" src={logo} />
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
                      <Link
                        to="/demo"
                        className="block pl-2 text-lg text-primary flex items-center"
                      >
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
                        />{" "}
                        Call Us: (+254) 712-345678
                      </p>
                    </div>
                    <div className="border-b border-primary/50 w-full p-2"></div>
                    <div className=" mb-4 ">
                      <p className="p-2 text-primary  font-bold text-xl">
                        For School & Adminstrators
                      </p>
                      <Link
                        to="/auth/login"
                        className="block pl-2 text-lg  hover:text-blue-800 hover:scale-105 text-primary flex items-center"
                      >
                        <img
                          src={lock}
                          alt="Demo Icon"
                          className="w-6 h-6 mr-2"
                        />{" "}
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block pl-2 text-lg  hover:text-blue-800 hover:scale-105 text-primary flex items-center"
                      >
                        <img
                          src={user}
                          alt="Demo Icon"
                          className="w-6 h-6 mr-2"
                        />{" "}
                        Create Account
                      </Link>
                      <Link
                        to="/contact"
                        className="block pl-2 text-lg  hover:text-blue-800 hover:scale-105 text-primary flex items-center"
                      >
                        <img
                          src={contact4}
                          alt="Demo Icon"
                          className="w-6 h-6 mr-2"
                        />{" "}
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons for large screens (xl and above) */}
              <div className="hidden xl:flex gap-5 mr-10 ">
                <Link
                  to="/"
                  onClick={handleLogoClick}
                  className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg  hover:text-blue-800 hover:scale-105 text-primary"
                >
                  Home
                </Link>
                <a
                  href="#services"
                  className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg   hover:text-blue-800 hover:scale-105 text-primary"
                >
                  Why Us
                </a>
                <a
                  href="#pricing"
                  className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg  hover:text-blue-800 hover:scale-105 text-primary"
                >
                  Pricing
                </a>
                <Link
                  to="/contact"
                  className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg  hover:text-blue-800 hover:scale-105 text-primary"
                >
                  Contact Us
                </Link>
                <a
                  href="#about"
                  className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg   hover:text-blue-800 hover:scale-105 text-primary"
                >
                  About Us
                </a>
                <Link to="/demo" className="xl:w-32 xl:mr-8">
                  <Button className="text-md w-[192px] p-2 h-[50px] bg-[#FF3B30] text-white rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px]">
                    REQUEST A DEMO
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
        </div>

        <div className="lg:flex justify-center items-center overflow-visible">
          <div className=" xl:mt-0 xl:p-0  mt-5  max-w-[1500px] overflow-visible">
            <div className="grid   sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
              <div className="group xl:p-0 p-5 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 flex justify-center items-center">
                <div className="xl:p-5 ">
                  <h1 className="xl:text-6xl text-2xl font-semibold  text-primary w-full">
                    Empowering Competency <br /> Based Curriculum <br />{" "}
                    Education In Kenya
                  </h1>
                  <div className="mt-2">
                    <p className="xl:text-2xl sm:text-lg ">
                      Empowering schools with a simplified CBC assessment tool
                      for accurate learner evaluation and providing parents
                      real-time access to their child's progress, performance &
                      personalized feedback.
                    </p>
                  </div>
                </div>
              </div>

              <div className="group dark:bg-gray-800 transition flex justify-center items-center">
                <img
                  alt="ACS"
                  className="xl:w-30 md:w-full xl:w-auto max-h-[602px] w-full object-contain"
                  src={child}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary">
          <div className="grid xl:mx-auto max-w-[1500px] overflow-hidden">
            <h4 className="p-4 text-white xl:text-3xl text-xl text-center">
              With Hero Learning, you are not just keeping up with Education -
              <span className="font-black inline-block">
                you're Leading it
                <div className="-mt-2">
                  <img
                    src={stroke}
                    alt="Leadership Illustration"
                    className="mx-auto w-60 h-5"
                  />
                </div>
              </span>
            </h4>
          </div>
        </div>

        <div id="about" className=" xl:mx-auto xl:mt-10 max-w-[1500px] p-5">
          <Button
            variant="primary"
            className="text-white bg-[#FF3B30]  border-none xl:text-lg text-md w-[92px] p-2 h-[40px]  mb-5 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border"
          >
            About Us
            {loading && (
              <LoadingIcon
                icon="spinning-circles"
                color="white"
                className="w-4 h-4 ml-2"
              />
            )}
          </Button>

          <h1 className="xl:text-5xl text-2xl text-left text-primary font-bold">
            Transforming Dreams into Reality
          </h1>
          <p className="mt-2 md:text-lg xl:text-2xl text-left text-primary xl:mt-5">
            Hero Learning is committed to advancing education by aligning with
            the goals in Kenya's Compentency- Based-Curriculum(CBC).We focus on
            providing tools, resources and support that schools need to navigate
            the challenges of modern education.Our approach empowers
            facilitators and learners, ensuring every step taken leads to the
            realization of learner's full potential.
          </p>

          <div>
            <div className="border-b border-primary w-full mt-5 xl:mb-5 px-5"></div>
            <div className="xl:flex gap-10 xl:space-x-8 items-center justify-between">
              <div className="flex flex-col text-left xl:p-4">
                <h1 className="text-xl pl-2 pt-2 md:text-xl xl:text-2xl font-bold text-primary xl:mb-2">
                  Vision
                </h1>
              </div>
              <div className="flex flex-col items-center  xl:p-4 p-2  md:text-xl xl:text-2xl text-primary">
                To empower every learner's talent with the skills and knowledge
                to build a successful future.
              </div>
            </div>
            <div className="border-b border-primary w-full mt-5 px-5"></div>
          </div>
          <div>
            <div className="xl:flex gap-10 xl:space-x-8 items-center justify-between">
              <div className="flex flex-col text-left xl:p-4">
                <h1 className="text-xl pl-2 pt-2 md:text-2xl xl:text-2xl font-bold text-primary xl:mb-2">
                  Mission
                </h1>
              </div>
              <div className="flex flex-col items-center  xl:p-4 p-2 md:text-xl xl:text-2xl  text-primary">
                At Hero Learning, we pride ourselves in building and inclusive
                and robust learning
                <br />
                environment that promotes critical thinking, creativity,
                communication, collaboration and life
                <br /> long learning.
              </div>
            </div>
            <div className="border-b border-primary w-full mt-5 px-5"></div>
          </div>
        </div>

        <div className="aboutContainer mt-10 xl:mx-auto max-w-[1500px]">
          <h1 className="xl:text-5xl text-2xl text-center text-primary font-bold">
            Our Values
          </h1>
          <div className="grid overflow-hidden rounded-3xl  gap-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:p-10 p-5 xl:grid-cols-4">
            <div className="group relative bg-[#5F2FA81A] rounded-3xl p-4 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="secondArea bg-primary w-14 h-14 m-2 rounded-lg flex items-center justify-center">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-full xl:w-auto w-full object-contain p-0.5"
                  src={aboutpic}
                />
              </div>
              <div className="contents ">
                <h2 className="xl:text-3xl text-xl font-bold p-2 ">
                  Excellence
                </h2>
                <div className="border-b border-primary w-full mt-5"></div>
                <p className="mt-5 xl:text-lg sm:text-lg md:text-lg pl-2 text-primary">
                  We are dedicated to providing high-quality solutions that
                  guarantee accurate, realiable, and CBC-complaint content and
                  assessments, empowering schools to achieve exceptional
                  eduactional outcomes.
                </p>
              </div>
            </div>
            <div className="group bg-[#5F2FA81A] relative p-4 rounded-2xl dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="secondArea bg-primary w-14 h-14 m-2 rounded-lg flex items-center justify-center">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-full xl:w-auto w-full object-contain p-0.5"
                  src={aboutpic2}
                />
              </div>
              <h2 className="xl:text-3xl text-xl font-bold p-2 ">
                Inclusivity
              </h2>
              <div className="border-b border-primary w-full mt-5"></div>
              <p className="mt-5 xl:text-lg sm:text-lg md:text-lg pl-2 text-primary">
                We foster an inclusive environment where every school,
                facilitator, parent, and learner can thrive through accessible
                eduactional tools.
              </p>
            </div>
            <div className="group relative bg-[#5F2FA81A] p-4 rounded-2xl dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="secondArea bg-primary w-14 h-14 m-2 rounded-lg flex items-center justify-center">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-full xl:w-auto w-full object-contain p-0.5"
                  src={aboutpic3}
                />
              </div>
              <h2 className="xl:text-3xl text-xl font-bold mt-2 p-2 ">
                Community
              </h2>
              <div className="border-b border-primary w-full mt-5"></div>
              <p className="mt-5 xl:text-lg sm:text-lg md:text-lg pl-2 text-primary">
                We build strong partnerships with schools, facilitators,
                parents, and learners to create a collaborative and connected
                educational ecosystem where everyone works together to support
                learner success.
              </p>
            </div>
            <div className="group relative p-4 bg-[#5F2FA81A] rounded-2xl dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="secondArea bg-primary w-14 h-14 m-2 rounded-lg flex items-center justify-center">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-full xl:w-auto w-full object-contain p-0.5"
                  src={aboutpic4}
                />
              </div>
              <h2 className="xl:text-3xl text-xl mt-2 font-bold p-2 ">
                Innovation
              </h2>
              <div className="border-b border-primary w-full mt-5"></div>
              <p className="mt-5 xl:text-lg sm:text-lg md:text-lg pl-2 text-primary">
                We harness the power of technology to deliver smarter,
                data-driven solutions that enhance learning, streamline
                assessments, and create more effective educational experiences.
              </p>
            </div>
          </div>
        </div>

        <div className=" xl:flex gap-10 space-x-8  xl:mx-auto max-w-[1450px] m-5 items-center justify-center">
          <div id="services" className="flex flex-col items-center  xl:p-4 p-2">
            <h1 className="text-3xl md:text-3xl  xl:text-5xl font-bold text-primary xl:mb-2">
              Why Choose Hero Learning?
            </h1>
          </div>
          <div className="flex-col items-center xl:p-4 md:text-2xl xl:text-2xl font-medium text-primary">
            At Hero Learning, we offer a unique approach to education that is
            tailored to the needs of the <br /> Competency-Based Curriculum
            (CBC) in Kenya. Our solutions empower facilitators and learners to
            thrive in a rapidly evolving educational landscape. By choosing us,
            you gain access to:
          </div>
        </div>

        <div className="grid overflow-hidden xl:mx-auto max-w-[1450px]   sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 m-5  xl:grid-cols-4 gap-10">
          <div className="group relative dark:bg-gray-800 p-4 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 flex flex-col  justify-between h-full">
            <div className="secondArea">
              <img
                alt="ACS"
                className="xl:w-full md:w-[300px] w-full max-w-[100%]"
                src={pic}
              />
            </div>
            <h2 className="text xl:text-3xl text-xl font-bold text-left mt-5">
              Customized Tools & Resources
            </h2>
            <p className="mt-3 text xl:text-xl sm:text-xl md:text-xl text-left ">
              Aligned with CBC objectives, designed to simplify assessment,
              enhance learning experiences, and foster learners growth.
            </p>
          </div>
          <div className="group relative bg-white dark:bg-gray-800 p-4  transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 flex flex-col  justify-between h-full">
            <div className="secondArea">
              <img
                alt="ACS"
                className="xl:w-full md:w-[300px] w-full max-w-[100%]"
                src={pic3}
              />
            </div>
            <h2 className="text xl:text-3xl text-xl font-bold text-left mt-5">
              Innovative Solution
            </h2>
            <p className="mt-3 text xl:text-xl sm:text-xl md:text-xl text-left ">
              Cutting-edge technology that streamlines education processes,
              helping schools stay ahead of the curve.
            </p>
          </div>

          <div className="group mt-5 xl:mt-0 relative bg-white p-4  dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 flex flex-col justify-between  h-full">
            <div className="secondArea">
              <img
                alt="ACS"
                className="xl:w-full md:w-[300px] w-full max-w-[100%]"
                src={pic2}
              />
            </div>
            <h2 className="text xl:text-3xl text-xl font-bold text-left mt-5">
              Commitment to learners Success
            </h2>
            <p className="xl:mt-3 text xl:text-xl sm:text-xl md:text-xl text-left">
              Our focus is on ensuring every learner achieves their full
              potential, preparing them for the challenges of tomorrow.
            </p>
          </div>

          <div className="group mt-5 xl:mt-0 relative bg-white  p-4 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 flex flex-col  justify-between  h-full">
            <div className="secondArea">
              <img
                alt="ACS"
                className="xl:w-full md:w-[300px] w-full max-w-[100%]"
                src={pic4}
              />
            </div>
            <h2 className="text xl:text-3xl text-xl font-bold text-left mt-5">
              Expert Support
            </h2>
            <p className="xl:mt-3 text xl:text-xl sm:text-xl md:text-xl text-left">
              Ongoing training and consultation from seasoned professionals who
              understand the intricacies of the CBC system
            </p>
          </div>
        </div>

        <div className="service  xl:mt-10  max-w-[1500px]  xl:mx-auto   ">
          <h1 className="text-center text-primary xl:text-5xl text-2xl pt-10 font-bold mt-10">
            CBC Made Easy
          </h1>
          <p className="text-center text-2xl mt-5">
            Designed for schools, facilitators, and parents, our platform
            streamlines processes,
            <br /> enhances teaching, and fosters learner success through
            innovative, CBC-compliant
            <br /> solutions.
          </p>

          <div className="mx-auto  max-w-[1500px] grid overflow-hidden  gap-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 p-5 xl:grid-cols-4">
            <div className="group relative bg-[#5F2FA81A] rounded-xl p-4 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 xl:col-span-2">
              <div className="flex gap-2">
                <div className="secondArea xl:w-20 xl:h-20 rounded-lg flex items-center justify-center">
                  <img
                    alt="ACS"
                    className="w-35 md:w-full xl:w-auto w-full object-contain"
                    src={servicepic2}
                  />
                </div>
                <div className="xl:mt-5 mt-2">
                  <h2 className="xl:text-3xl text-xl text-primary font-bold">
                    Schools
                  </h2>
                </div>
              </div>
              <p className="xl:text-lg sm:text-lg md:text-lg text-primary font-medium">
                Hero Learning enhances school efficiency by streamlining
                administration and improving teaching effectiveness. With
                automated tools for assessments, reporting, lesson planning, and
                record-keeping, schools save time and resources while ensuring
                high-quality education.
              </p>
              <p className="xl:text-lg sm:text-lg md:text-lg text-primary mt-2 font-medium">
                CBC-compliant and aligned with Ministry guidelines, Hero
                Learning provides accurate assessments, error-free reporting,
                and real-time analytics to address learning gaps and boost
                outcomes.
              </p>
            </div>

            <div className="group relative bg-[#5F2FA81A] rounded-xl p-4 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="flex gap-2">
                <div className="secondArea xl:w-20 xl:h-20 rounded-lg flex items-center justify-center">
                  <img
                    alt="ACS"
                    className="w-35 md:w-full xl:w-auto w-full object-contain"
                    src={servicepic}
                  />
                </div>
                <div className="xl:mt-5 mt-2">
                  <h2 className="xl:text-3xl text-xl text-primary font-bold">
                    Parents
                  </h2>
                </div>
              </div>
              <div className="contents">
                <p className="xl:text-lg sm:text-lg md:text-lg text-primary font-medium">
                  Hero Learning keeps parents actively involved in their child's
                  education by providing real-time updates on performance,
                  continuous assessment results, and progress reports. With
                  clear insights and transparent communication, parents can
                  confidently support their child's academic journey and ensure
                  they excel in the CBC curriculum.
                </p>
              </div>
            </div>

            <div className="group relative bg-[#5F2FA81A] rounded-xl p-4 dark:bg-gray-800  ">
              <div className="flex gap-2">
                <div className="secondArea xl:w-20 xl:h-20 rounded-lg flex items-center justify-center">
                  <img
                    alt="ACS"
                    className="w-35 md:w-full xl:w-auto w-full object-contain"
                    src={servicepic3}
                  />
                </div>
                <div className="xl:mt-5 mt-2">
                  <h2 className="xl:text-3xl text-xl text-primary font-bold">
                    Facilitators
                  </h2>
                </div>
              </div>
              <p className="xl:text-lg sm:text-lg md:text-lg text-primary font-medium">
                Hero Learning streamlines workflows, saving teachers 10+ hours
                weekly by automating tasks like assessments, reporting, schemes
                of work, lesson planning, and record of work covered. This
                efficiency reduces administrative burdens, enhances teaching,
                and allows facilitators to focus on personalized instructions
                and learner success
              </p>
            </div>
          </div>
        </div>

        <div id="pricing" className="aboutContainer mt-10 xl:mt-20">
          <h1 className="xl:text-5xl text-2xl text-center text-primary font-bold">
            Pricing Plan
          </h1>
          <p className="xl:text-2xl text-lg text-center text-primary">
            Choose the perfect plan for your school needs
          </p>

          <div className=" xl:mx-auto max-w-[1500px] grid overflow-hidden rounded-3xl xl:m-10 gap-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:p-10  p-5 xl:grid-cols-3">
            <div className="group relative border rounded-xl p-8 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 hover:border-primary">
              <div className="contents">
                <p className="xl:text-2xl text-lg  font-bold text-primary">
                  EVIDENCE OF LEARNING
                </p>
                <p className="mt-5 xl:text-lg sm:text-lg md:text-lg text-primary">
                  Refers to the tangible demonstrations of learner's progress,
                  understanding and mastery of specific competencies. They
                  include: portfolios of work, performance tasks, rubrics and
                  checklists, projects and assignments, peer and self-assessment
                  and teachers observations to evaluate practical skills and
                  understanding. Evidence of Learning ensures learners acquire
                  the skills, values and attitudes effectively.
                </p>
                <Link to="/register">
                  <Button className="text-lg  font-bold w-full mt-5 p-2 h-[40px] px-3 gap-2 border-2 border-primary text-primary transition duration-300 ease-in-out transition group-hover:bg-primary group-hover:text-white">
                    Get a Quote
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
              <ul className="space-y-2 mt-8 ml-2 xl:text-lg text-primary">
                <li className="flex items-center p-0.5">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-green-500 w-5 h-5 mr-2"
                  />
                  Pre-School
                </li>

                <li className="flex items-center p-0.5">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-green-500 w-5 h-5 mr-2"
                  />
                  Lower Primary
                </li>
                <li className="flex items-center p-0.5">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-green-500 w-5 h-5 mr-2"
                  />
                  Upper Primary
                </li>
                <li className="flex items-center p-0.5">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-green-500 w-5 h-5 mr-2"
                  />
                  Junior Secondary
                </li>
                <li className="flex items-center p-0.5">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-green-500 w-5 h-5  mr-2"
                  />
                  Senior Secondary
                </li>
              </ul>
            </div>
            <div className="group relative border rounded-xl p-8 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 hover:border-primary">
              <div className="contents">
                <div className="xl:mb-20">
                  <p className="xl:text-2xl text-lg  font-bold text-primary">
                    BASIC PLAN
                  </p>
                </div>
                <Link to="/register">
                  <Button className="text-lg  font-bold w-full mt-2 p-2 h-[40px] px-3 gap-2 border-2 border-primary text-primary transition duration-300 ease-in-out transition group-hover:bg-primary group-hover:text-white">
                    Get a Quote
                    {loading && (
                      <LoadingIcon
                        icon="spinning-circles"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    )}
                  </Button>
                </Link>
                <div className="border-b border-primary/50 w-full mt-8"></div>
              </div>
              <ul className="space-y-2 mt-8 ml-2 xl:text-lg text-primary">
                <li className="flex items-center p-0.5">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-green-500 w-5 h-5 mr-2"
                  />
                  <span className="font-bold mr-1.5">Standard </span> Summative
                  Assessment
                </li>

                <li className="flex items-center p-0.5">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-green-500 w-5 h-5 mr-2"
                  />
                  <span className="font-bold mr-1.5">Formative</span> Assessment
                </li>
                <li className="flex items-center p-0.5">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-green-500 w-5 h-5 mr-2"
                  />
                  <span className="font-bold mr-1.5"> Learner</span> Report
                </li>
                <li className="flex items-center p-0.5">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-green-500 w-5 h-5 mr-2"
                  />
                  <span className="font-bold mr-1.5"> Learner</span> Promotion
                </li>
                <li className="flex items-center p-0.5">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-green-500 w-5 h-5  mr-2"
                  />
                  <span className="font-bold mr-1.5"> Learner</span> Transfers
                </li>
                <li className="flex items-center p-0.5">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className="text-green-500 w-5 h-5 mr-2"
                  />
                  <span className="font-bold mr-1.5"> Email </span>Analysis
                </li>
              </ul>
            </div>
            <div className="group relative border rounded-xl p-8 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 hover:border-primary">
              <div className="contents">
                <div className="mb-20">
                  <p className="xl:text-2xl text-lg  font-bold text-primary">
                    PREMIUM PLAN
                  </p>
                </div>

                <Link to="/register">
                  <Button className="text-lg  font-bold w-full mt-2 p-2 h-[40px] px-3 gap-2 border-2 border-primary text-primary transition duration-300 ease-in-out transition group-hover:bg-primary group-hover:text-white">
                    Get a Quote
                    {loading && (
                      <LoadingIcon
                        icon="spinning-circles"
                        color="white"
                        className="w-4 h-4 ml-2"
                      />
                    )}
                  </Button>
                </Link>

                <div className="border-b border-primary/50 w-full mt-8"></div>
              </div>
              <div className="space-y-2 mt-8 ml-2 p-2 xl:text-lg text-primary">
                <ul>
                  {displayedItems.map((item, index) => (
                    <li key={index} className="flex items-center p-0.5">
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="text-green-500 w-5 h-5 mr-2"
                      />
                      <span className="break-words">{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-4 text-primary font-bold"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "See less Features" : "See all Features"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="aboutContainer mt-10 ">
          <h1 className="xl:text-5xl text-2xl text-center text-primary font-bold">
            Get started with our demo
          </h1>
          <div className="mt-5 p-4 border-4 border-primary rounded-xl xl:flex items-center justify-center gap-10  xl:mx-auto max-w-[1200px] px-5">
            <div>
              <p className="xl:text-xl p-5 text-lg text-center text-primary">
                Get started with our demo and see the Hero Learning system in
                action!
              </p>
            </div>
            <div className="flex justify-center xl:justify-start">
              <Link to="/demo" className="xl:w-32 xl:mr-8">
                <Button className="xl:text-xl w-[192px] p-2 h-[50px] bg-[#FF3B30] font-bold text-white">
                  Request A Demo
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

        <FooterComponent />
      </div>
    </>
  );
};

export default Home;
