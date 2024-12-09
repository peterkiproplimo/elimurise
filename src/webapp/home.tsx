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

import logoUrl from "../assets/images/Untitled-1.png";
import logo from "../assets/images/heros.png";
import icon from "../assets/images/Icon.png"
import homepic from "../assets/images/Ellipse.png";
import child from "../assets/images/child.png";
import aboutpic from "../assets/images/excellence.png";
import aboutpic2 from "../assets/images/inclusive.png";
import aboutpic3 from "../assets/images/community.png";
import aboutpic4 from "../assets/images/Frame.png";
import pic from "../assets/images/Rectangle.jpg";
import pic2 from "../assets/images/Rectangle 8.png";
import pic3 from "../assets/images/Rectangle.png";
import users from "../assets/images/Users_Group.png";
import check from "../assets/images/Checkbox_Check.png";
import vector from "../assets/images/Vector.png";
import user from "../assets/images/User.png";
import servicepic from "../assets/images/parental-control 1.png";
import servicepic2 from "../assets/images/parental-control.png";
import servicepic3 from "../assets/images/teacher-showing-on-whiteboard 1.png";
import lock from "../assets/images/Lock.png";
import contact4 from  "../assets/images/contact2.png";
import email from "../assets/images/social.png";
import phone from "../assets/images/social (1).png";
import pin from "../assets/images/mingcute_location-line.png";
import youtube from "../assets/images/instagram.png";
import linked from "../assets/images/linkedin.png";
import facebook from "../assets/images/Vector (1).png";
import { Menu, X } from "lucide-react";
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

  return (
    <>
      <div className="homeContainer sm:p-5 xl:p-0 p-0">
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
            {/* Hamburger Menu Icon for small screens */}
            <div className="block xl:hidden">
    <button
      onClick={() => setShowMenu(!showMenu)}
      className="text-blue-800 focus:outline-none mt-5"
    >
      {showMenu ? (
        <Menu className="w-8 h-8" /> // X icon to close menu
      ) : (
        <Menu className="w-8 h-8" /> // Three-line icon to open menu
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
          <Link  to="/auth/login"  className="block pl-2 text-lg text-primary flex items-center">
  <img 
    src={lock}
    alt="Demo Icon" 
    className="w-6 h-6 mr-2" 

  />  Login
          </Link>
          <Link to="/register"  className="block pl-2 text-lg text-primary flex items-center">
  <img 
    src={user}
    alt="Demo Icon" 
    className="w-6 h-6 mr-2" 

  /> Create Account
          </Link>
          <Link to="/contact" className="block pl-2 text-lg text-primary flex items-center">
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
            <a href="#about" className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg text-primary">
              Why Us
              </a>
              <a href="#pricing" className="xl:px-3 xl:py-3 px-2 py-2 font-bold text-lg text-primary">
               Pricing
              </a>
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

        <div className="xl:p-10 mt-5 p-5">
          <div className="grid  bg-[#BAB4D7]  xl:ml-10 xl:mr-10 overflow-hidden rounded-3xl sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:divide-y-0 xl:grid-cols-2">
            <div className="group p-10 xl:ml-10  dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <h1 className="xl:text-5xl text-2xl font-semibold mt-5 text-primary w-full">
                Empowering Competency <br/> Based Curriculum <br/> Education In Kenya
              </h1>
              <div className="mt-2">
                <p className="xl:text-lg sm:text-3l text-primary">
                  We revolutionize education
                  through our innovative digital Competency Based <br/> Curriculum
                  (CBC) approach. Join us in shaping the future of learning.
                </p>
              </div>
              <div className="  mt-8 text-center  xl:mt-8 xl:text-left">
                <Button
                  variant="primary"
                  className="text-md w-[192px] p-2 h-[40px] px-3 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border "

                >
                  <div className="icon mr-2">
            <img alt="ACS" className="xl:w-35  xl:w-auto" src={icon} />
          </div>See How It Works
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
            <div className="group relative dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 -m-5 flex justify-center ">
  <img
    alt="ACS"
    className="xl:w-30 md:w-full xl:w-auto w-full"
    src={homepic}
  />
  <img
    alt="Child"
    className="absolute top-2  xl:w-35 "
    src={child}
  />
</div>


          </div>
        </div>
        <div className="aboutContainer mt-10">
        <p className="xl:text-lg text-lg text-center text-primary">
            Why choose us
          </p>
          <h1 className="xl:text-5xl text-2xl text-center text-primary font-medium">
            Our Values
          </h1>
          <div className="grid overflow-hidden rounded-3xl xl:m-10 gap-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-4 xl:p-10 p-5 xl:grid-cols-4">
            <div className="group relative bg-[#5F2FA81A]  rounded-3xl p-4 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
            <div className="secondArea bg-primary w-14 h-14 rounded-lg flex items-center justify-center">
  <img
    alt="ACS"
    className="xl:w-35 md:w-full xl:w-auto w-full object-contain p-0.5"
    src={aboutpic}
  />
</div>

              <div className="contents">
                <h2 className="xl:text-2xl text-xl font-bold mt-2 ">
                  Excellence
                </h2>
                <div className="border-b border-primary w-full mt-8"></div>
                <p className="mt-5 xl:text-lg sm:text-lg md:text-lg text-primary">
                Providing highest quality and standards in education.
              </p>
              </div>
            </div>
            <div className="group  bg-[#5F2FA81A] relative p-4  rounded-3xl dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
            <div className="secondArea bg-primary  w-14 h-14 rounded-lg flex items-center justify-center">
  <img
    alt="ACS"
    className="xl:w-35 md:w-full xl:w-auto w-full object-contain p-0.5"
    src={aboutpic2}
  />
</div>
              <h2 className="xl:text-2xl text-xl font-bold mt-2 ">
               Inclusivity
              </h2>
              <div className="border-b border-primary w-full mt-8"></div>
              <p className="mt-5 xl:text-lg sm:text-lg md:text-lg text-primary">
              Providing an all inclusive learning environment.
              </p>
            </div>
            <div className="group relative bg-[#5F2FA81A] p-4  rounded-3xl dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
            <div className="secondArea bg-primary w-14 h-14 rounded-lg flex items-center justify-center">
  <img
    alt="ACS"
    className="xl:w-35 md:w-full xl:w-auto w-full object-contain p-0.5"
    src={aboutpic3}
  />
</div>
              <h2 className="xl:text-2xl text-xl font-bold mt-2 ">Community</h2>
              <div className="border-b border-primary w-full mt-8"></div>
              <p className="mt-5 xl:text-lg sm:text-lg md:text-lg text-primary">
              Strong partnerships with teachers, learners and parents.
              </p>
            </div>
            <div className="group relative p-4 bg-[#5F2FA81A]  rounded-3xl dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
            <div className="secondArea bg-primary w-14 h-14 rounded-lg flex items-center justify-center">
  <img
    alt="ACS"
    className="xl:w-35 md:w-full xl:w-auto w-full object-contain p-0.5"
    src={aboutpic4}
  />
</div>
              <h2 className="xl:text-2xl text-xl mt-2 font-bold ">Innovation</h2>
              <div className="border-b border-primary w-full mt-8"></div>
              <p className="mt-5 xl:text-lg sm:text-lg md:text-lg text-primary">
              Tapping creativity and using technology make learning fun.
              </p>
            </div>
          </div>
        </div>


       <div className=" xl:m-10 xl:p-10 p-5">
       <Button
  variant="primary"
  className="text-primary bg-transparent border-primary text-md w-[92px] p-2 h-[40px]  mb-2 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border"
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

       <h1 className="xl:text-5xl text-2xl text-left text-primary font-medium">
       Transforming Dreams into Reality
          </h1>
       <p className="mt-2 md:text-lg xl:text-xl text-left text-primary xl:mt-5">
       Hero Learning is about envisioning the future of education and setting goals that 
       align with the needs of Competency-Based Curriculum (CBC) in Kenya. 
       This vision serves as your guiding star, illuminating the path forward and providing clarity amidst the challenges of modern education.
          </p>
        

       <div>
       <div className="border-b border-primary w-full mt-5 xl:mb-5 px-5"></div>
        <div className="xl:flex gap-10 xl:space-x-8 items-center justify-between">
  <div className="flex flex-col text-left xl:p-4">
    <h1 className="text-xl pl-2 pt-2 md:text-xl xl:text-2xl font-medium text-primary xl:mb-2">
    Vision
    </h1>
  </div>
  <div className="flex flex-col items-center  xl:p-4 p-2  md:text-xl xl:text-xl text-primary">
  To empower every learner's talent with the skills and knowledge to build a successful future.
  </div>
 
</div>
<div className="border-b border-primary w-full mt-5 px-5"></div>
</div>
        <div>
        <div className="xl:flex gap-10 xl:space-x-8 items-center justify-between">
  <div className="flex flex-col text-left xl:p-4">
    <h1 className="text-xl pl-2 pt-2 md:text-2xl xl:text-2xl font-medium text-primary xl:mb-2">
    Mission
    </h1>
  </div>
  <div className="flex flex-col items-center  xl:p-4 p-2 md:text-xl xl:text-xl  text-primary">
  At Hero Learning, we pride ourselves in building and inclusive and robust learning<br/>
   environment that promotes critical thinking, creativity, communication, collaboration and life<br/> long learning.
  </div>
 
</div>
<div className="border-b border-primary w-full mt-5 px-5"></div>
</div>
</div>



     
        <div className=" xl:flex gap-10 space-x-8 items-center justify-center">
  <div id = "about" className="flex flex-col items-center text-center xl:p-4 p-2">
    <h1 className="text-3xl md:text-3xl xl:text-5xl font-bold text-primary xl:mb-2">
      Why Choose Hero Learning?
    </h1>
  </div>
  <div className="flex-col items-center xl:p-4 md:text-2xl xl:text-2xl font-medium text-primary">
    Empower your child's future with Hero Learning. <br />
    Our innovative platform and dedicated team are committed to helping your child 
    reach their full potential.
  </div>
</div>


        
<div className="grid overflow-hidden rounded-3xl sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 m-5 xl:p-20  xl:grid-cols-3 gap-5">
  <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 flex flex-col  justify-between h-full">
    <div className="secondArea">
      <img
        alt="ACS"
        className="xl:w-[400px] md:w-[300px] w-full max-w-[100%]"
        src={pic}
      />
    </div>
    <h2 className="text xl:text-3xl text-xl font-bold text-left mt-5">
      Innovative CBC Approach:
    </h2>
    <p className="mt-3 text xl:text-xl sm:text-xl md:text-xl text-left ">
      Our digital assessment tool is 
      designed for meeting the various
      needs of each learner and
      promoting a deeper understanding
      of subjects.
    </p>
  </div>

  <div className="group mt-5 xl:mt-0 relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 flex flex-col justify-between  h-full">
    <div className="secondArea">
      <img
        alt="ACS"
        className="xl:w-[400px] md:w-[300px] w-full max-w-[100%]"
        src={pic2}
      />
    </div>
    <h2 className="text xl:text-3xl text-xl font-bold text-left mt-5">
      Technology Integration:
    </h2>
    <p className="xl:mt-3 text xl:text-xl sm:text-xl md:text-xl text-left">
      With advanced technology, we're transforming education into a
      more interactive and engaging experience for teachers, learners, and parents.
    </p>
  </div>

  <div className="group mt-5 xl:mt-0 relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 flex flex-col  justify-between  h-full">
    <div className="secondArea">
      <img
        alt="ACS"
        className="xl:w-[400px] md:w-[300px] w-full max-w-[100%]"
        src={pic3}
      />
    </div>
    <h2 className="text xl:text-3xl text-xl font-bold text-left mt-5">
      Experienced Educators:
    </h2>
    <p className="xl:mt-3 text xl:text-xl sm:text-xl md:text-xl text-left">
      With a passion for education, our team is dedicated to nurturing the unique<br /> potential of every learner.
    </p>
  </div>
</div>


    


        <div className="service mt-10 bg-primary ">
       
       
  <h1 className="xl:text-5xl text-2xl p-4 text-center text-white font-medium">
    CBC Made Easy
  </h1>


          <div className="  grid overflow-hidden rounded-3xl xl:ml-10 xl:mr-10 gap-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:p-10 p-5 xl:grid-cols-3">
            <div className="group relative bg-[#51608A]  rounded-3xl p-4 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
           <div className="flex gap-2">
            <div className="secondArea  xl:w-20 xl:h-20 rounded-lg flex items-center justify-center">
  <img
    alt="ACS"
    className="w-35 md:w-full xl:w-auto w-full object-contain"
    src={servicepic}
  />
 
</div>
<div className="xl:mt-5 mt-2">
    <h2 className="xl:text-3xl text-xl  text-white font-bold ">
                 Parents
                </h2></div>
                </div>

              <div className="contents">
                <p className="xl:text-lg sm:text-lg md:text-lg text-white">
                Our platform gives you the ability to assess the learner in real time,allowing one to keep proper track of progress.
              </p>
              </div>
            </div>
            <div className="group  bg-[#51608A]  relative p-4  rounded-3xl dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
            <div className="flex gap-2">
            <div className="secondArea  xl:w-20 xl:h-20 rounded-lg flex items-center justify-center">
  <img
    alt="ACS"
    className="w-35 md:w-full xl:w-auto w-full object-contain"
    src={servicepic2}
  />
 
</div>
<div className="xl:mt-5 mt-2">
    <h2 className="xl:text-3xl text-xl  text-white font-bold ">
                 Schools
                </h2></div>
                </div>
            
              <p className="xl:text-lg sm:text-lg md:text-lg text-white">
              Our platform monitors the performance of learners and provides option for open communication with the parents.
              </p>
            </div>
            <div className="group relative bg-[#51608A] p-4  rounded-3xl dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
            <div className="flex gap-2">
            <div className="secondArea   xl:w-20 xl:h-20 rounded-lg flex items-center justify-center">
  <img
    alt="ACS"
    className="w-35 md:w-full xl:w-auto w-full object-contain"
    src={servicepic3}
  />
 
</div>
<div className="xl:mt-5 mt-2">
    <h2 className="xl:text-3xl text-xl  text-white font-bold ">
                 Teachers
                </h2></div>
                </div>
              <p className="xl:text-lg sm:text-lg md:text-lg text-white">
              Our platform gives you the ability to properly assess and tap into each child's understanding of the sub-strands.
              </p>
            </div>
           
          </div>
        </div>

        <div id = "pricing" className="aboutContainer mt-10">
        <h1 className="xl:text-5xl text-2xl text-center text-primary font-medium">
           Pricing Plan
          </h1>
        <p className="xl:text-2xl text-lg text-center text-primary">
        Choose the perfect plan for your business needs
          </p>
        
          <div className="  grid overflow-hidden rounded-3xl xl:m-10 gap-10 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:p-10  p-5 xl:grid-cols-3">
            <div className="group relative border rounded-xl p-4 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
          

              <div className="contents">
              <Button
  variant="primary"
  className="text-dark bg-[#F1F1F1] xl:text-lg w-[220px] p-2 h-[40px] mb-2 gap-2 border-none"
>
  EVIDENCE OF LEARNING
  {loading && (
    <LoadingIcon
      icon="spinning-circles"
      color="white"
      className="w-4 h-4 ml-2"
    />
  )}
</Button>
<p className="mt-5 xl:text-lg sm:text-lg md:text-lg text-primary">
  You get access to hard copy assessment tool books for all grades. Charges per book:</p>
  <Button
                  variant="primary"
                  className="text-md w-full mt-5 p-2 h-[40px] px-3 gap-2  border "

                >
             Choose A Plan
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </Button>
                </div>
                <div>
                <div className="border-b border-primary/50 w-full mt-8"></div>

                <p className="mt-5 xl:text-lg sm:text-lg md:text-lg text-primary">
                PreSchool
              </p>
              <h1 className="xl:text-5xl text-2xl font-medium">
          KES 250
          </h1>
              </div>
              <div>
              <div className="border-b border-primary/50 w-full mt-8"></div>

                <p className="mt-5 xl:text-lg sm:text-lg md:text-lg text-primary">
                Lower Primary
              </p>
              <h1 className="xl:text-5xl text-2xl font-medium">
          KES 350
          </h1>
              </div>
              <div>
              <div className="border-b border-primary/50 w-full mt-8"></div>

                <p className="mt-5 xl:text-lg sm:text-lg md:text-lg text-primary">
                Upper Primary
              </p>
              <h1 className="xl:text-5xl text-2xl font-medium">
          KES 500
          </h1>
              </div>
              <div className="mb-2">
              <div className="border-b border-primary/50 w-full mt-8"></div>

                <p className="mt-5 xl:text-lg sm:text-lg md:text-lg text-primary">
                Junior Secondary
              </p>
              <h1 className="xl:text-5xl text-2xl font-medium">
          KES 600
          </h1>
              </div>
              
            </div>
            <div className="group relative border rounded-xl p-4 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
          

              <div className="contents">
              <Button
  variant="primary"
  className="text-dark bg-[#F1F1F1] xl:text-lg w-[220px] p-2 h-[40px] mb-2 gap-2 border-none"
>
  BASIC PLAN
  {loading && (
    <LoadingIcon
      icon="spinning-circles"
      color="white"
      className="w-4 h-4 ml-2"
    />
  )}
</Button>

<div>
                <div className="border-b border-primary/50 w-full mt-8"></div>

                <h1 className="mt-5 xl:text-7xl text-2xl font-medium">
          KES 150
          </h1>
                <p className=" xl:text-lg sm:text-lg md:text-lg text-primary">
                Per Learner, per Month
              </p>
           
              <div className="border-b border-primary/50 w-full mt-8"></div>

              </div>  <Button
                  variant="primary"
                  className="text-md w-full mt-5 p-2 h-[40px] px-3 gap-2  border "

                >
             Choose A Plan
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </Button>
                </div>
                <ul className="space-y-2 mt-8 ml-2 xl:text-lg text-primary">
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5 mr-2"
        />
        Standard Summative Assessment
      </li>
         
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5 mr-2"
        />
        Custom Summative Assessment
      </li>

      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5 mr-2"
        />
        Formative Assessment
      </li>
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5 mr-2"
        />
       Learner Report
      </li>
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5 mr-2"
        />
       Learner Promotion
      </li>
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5  mr-2"
        />
       Learner Transfers
      </li>
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5 mr-2"
        />
       Stream Analysis
      </li>
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5  mr-2"
        />
      Ip Monitoring
      </li>
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5  mr-2"
        />
      Backlink Monitoring
      </li>
   
    </ul>
        
            </div>
            <div className="group relative border rounded-xl p-4 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
          

          <div className="contents">
          <Button
variant="primary"
className="text-dark bg-[#F1F1F1] xl:text-lg w-[220px] p-2 h-[40px] mb-2 gap-2 border-none"
>
PREMIUM PLAN
{loading && (
<LoadingIcon
  icon="spinning-circles"
  color="white"
  className="w-4 h-4 ml-2"
/>
)}
</Button>

<div>
            <div className="border-b border-primary/50 w-full mt-8"></div>

            <h1 className="mt-5 xl:text-7xl text-2xl font-medium">
      KES 300
      </h1>
            <p className=" xl:text-lg sm:text-lg md:text-lg text-primary">
            Per Learner, per Month
          </p>
       
          <div className="border-b border-primary/50 w-full mt-8"></div>

          </div>  <Button
              variant="primary"
              className="text-md w-full mt-5 p-2 h-[40px] px-3 gap-2  border "

            >
         Choose A Plan
              {loading && (
                <LoadingIcon
                  icon="spinning-circles"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              )}
            </Button>
            </div>
            <ul className="space-y-2 mt-8 ml-2 p-2 xl:text-lg text-primary">
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5  mr-2"
        />
        Standard Summative Assessment
      </li>
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5  mr-2"
        />
        Formative Assessment
      </li>
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5  mr-2"
        />
       Learner Report
      </li>
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5 mr-2"
        />
       Learner Promotion
      </li>
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5 mr-2"
        />
       Learner Transfers
      </li>
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5  mr-2"
        />
       Stream Analysis Report
      </li>
      <li className="flex items-center p-0.5">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5  mr-2"
        />
      Grade Analysis Report
      </li>
      <li className="flex items-center p-0.5 ">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="text-green-500 w-5 h-5  mr-2"
        />
      Combined Summative & Formative Termly Report
      </li>
   
    </ul>
    
        </div>
           
          </div>
        </div>
        
        <div className="aboutContainer mt-10 ">
        <h1 className="xl:text-5xl text-2xl text-center text-primary font-bold">
        Get started with our demo
          </h1>
          <div className="mt-5 p-4 border-4 border-primary rounded-xl xl:flex items-center justify-center gap-10 mx-5 xl:mx-80 px-5">
  <div>
    <p className="xl:text-xl p-5 text-lg text-center text-primary">
    Get started with our demo and see the Hero Learning system in action!
    </p>
  </div>
  <div>
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
                  className="w-full bg-white xl:min-w-[150px] rounded-none text-lg"
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


        {/* <div className="price mt-10 md:mb-5 h-full lg:pl-[20%] lg:w-[82%]">
          <h1 className=" text-xl xl:text-5xl  font-bold  text-center text-primary">
            Pricing Plan
          </h1>
          <h2 className="text xl:text-2xl sm:text-xl md:text-xl text-center text-primary">
          Choose the perfect plan for your business needs
          </h2>

          <div className="mt-5 prices  overflow-hidden rounded-3xl ">
         
            <div className="lg:hidden flex overflow-x-auto  snap-mandatory">
              <div className="tag1 p-2 m-4 mt-5 mb-5  flex-shrink-0">
                <h1 className="m-5 text-left xl:text-4xl text-xl font-bold">
                  HERO System
                </h1>
                <p className="ml-5 font-bold">You get access to:</p>
                <ul className="ml-10 text-sm">
                  <li>Online Formative Assessment.</li>
                  <li>Online Summative Assessment.</li>
                  <li>Chat features with parents/guardians.</li>
                  <li>Branded Termly/Annual Printable Reports</li>
                </ul>
                <h1 className="ml-5 mt-5 text-left xl:text-4xl sm:text-3xl md:text-3xl font-bold">
                  1500Ksh
                </h1>
                <p className="ml-5 text-left text-sm">(Per Learner Annually)</p>
              </div>

              <div className="tag2 p-2 m-4 mt-5 mb-5 w-[90%] snap-center flex-shrink-0">
                <h1 className="ml-5 mt-2 text-left xl:text-4xl text-xl font-bold">
                  Evidence of Learning
                </h1>
                <h2 className="ml-5 mt-2 font-bold">You get access to:</h2>
                <p className="ml-5">
                  Hard copy assessment tool books for all grades...
                </p>
                <h2 className="ml-5 mt-2">Charges per book:</h2>
                <p className="text-sm ml-5 mb-0">Pre School</p>
                <h1 className="ml-5 mt-0 text-left xl:text-3xl sm:text-3xl md:text-3xl font-bold">
                  250Ksh
                </h1>
                <p className="text-sm ml-5">Lower Primary</p>
                <h1 className="ml-5 mt-0 text-left xl:text-3xl sm:text-3xl md:text-3xl font-bold">
                  350Ksh
                </h1>
                <p className="text-sm ml-5">Upper Primary</p>
                <h1 className="ml-5 m-0 text-left xl:text-3xl sm:text-3xl md:text-3xl font-bold">
                  500Ksh
                </h1>
                <p className="text-sm ml-5">Junior Secondary</p>
                <h1 className="ml-5 text-left xl:text-3xl sm:text-3xl md:text-3xl font-bold">
                  600Ksh
                </h1>
              </div>

              <div className="tag3 p-2 m-4 mt-5 w-[90%] snap-center flex-shrink-0">
                <h1 className="mt-2 ml-8 text-left xl:text-4xl text-xl font-bold">
                  HERO All in One
                </h1>
                <h2 className="ml-8 xl:text-xl sm:text-xl md:text-xl">
                  (Recommended)
                </h2>
                <p className="ml-5 mt-5 font-bold">You get access to:</p>
                <ul className="ml-10 text-sm">
                  <li>Online Formative Assessment.</li>
                  <li>Online Summative Assessment.</li>
                  <li>Chat features with parents/guardians.</li>
                  <li>Branded Termly/Annual Printable Reports</li>
                  <li>Hard copy assessment tool books for all grades...</li>
                </ul>
                <h1 className="ml-5 mt-5 text-left xl:text-4xl sm:text-3xl md:text-3xl font-bold">
                  3000Ksh
                </h1>
                <p className="ml-5 text-left text-sm">(Per Learner Annually)</p>
              </div>
            </div>

          
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 lg:divide-y-0 xl:grid-cols-3">
              <div className="tag1 p-2 m-4 mt-5 mb-5 xl:h-full lg:h-[80%]">
                <h1 className="m-5 text-left xl:text-4xl text-xl font-bold">
                  HERO System
                </h1>
                <p className="ml-5 font-bold">You get access to:</p>
                <ul className="ml-10 text-sm">
                  <li>Online Formative Assessment.</li>
                  <li>Online Summative Assessment.</li>
                  <li>Chat features with parents/guardians.</li>
                  <li>Branded Termly/Annual Printable Reports</li>
                </ul>
                <h1 className="ml-5 mt-5 text-left xl:text-4xl sm:text-3xl md:text-3xl font-bold">
                  1500Ksh
                </h1>
                <p className="ml-5 text-left text-sm">(Per Learner Annually)</p>
              </div>

              <div className="tag2 p-2 m-4 mt-5 mb-5 xl:h-full lg:h-[80%]">
                <h1 className="ml-5 mt-2 text-left xl:text-4xl text-xl font-bold">
                  Evidence of Learning
                </h1>
                <h2 className="ml-5 mt-2 font-bold">You get access to:</h2>
                <p className="ml-5">
                  Hard copy assessment tool books for all grades...
                </p>
                <h2 className="ml-5 mt-2">Charges per book:</h2>
                <p className="text-sm ml-5 mb-0">Pre School</p>
                <h1 className="ml-5 mt-0 text-left xl:text-3xl sm:text-3xl md:text-3xl font-bold">
                  250Ksh
                </h1>
                <p className="text-sm ml-5">Lower Primary</p>
                <h1 className="ml-5 mt-0 text-left xl:text-3xl sm:text-3xl md:text-3xl font-bold">
                  350Ksh
                </h1>
                <p className="text-sm ml-5">Upper Primary</p>
                <h1 className="ml-5 m-0 text-left xl:text-3xl sm:text-3xl md:text-3xl font-bold">
                  500Ksh
                </h1>
                <p className="text-sm ml-5">Junior Secondary</p>
                <h1 className="ml-5 text-left xl:text-3xl sm:text-3xl md:text-3xl font-bold">
                  600Ksh
                </h1>
              </div>

              <div className="tag3 p-2 m-5 mt-5 xl:h-full lg:h-[80%]">
                <h1 className="mt-2 ml-8 text-left xl:text-4xl text-xl font-bold">
                  HERO All in One
                </h1>
                <h2 className="ml-8 xl:text-xl sm:text-xl md:text-xl">
                  (Recommended)
                </h2>
                <p className="ml-5 mt-5 font-bold">You get access to:</p>
                <ul className="ml-10 text-sm">
                  <li>Online Formative Assessment.</li>
                  <li>Online Summative Assessment.</li>
                  <li>Chat features with parents/guardians.</li>
                  <li>Branded Termly/Annual Printable Reports</li>
                  <li>Hard copy assessment tool books for all grades...</li>
                </ul>
                <h1 className="ml-5 mt-5 text-left xl:text-4xl sm:text-3xl md:text-3xl font-bold">
                  3000Ksh
                </h1>
                <p className="ml-5 text-left text-sm">(Per Learner Annually)</p>
              </div>
            </div>
          </div>
        </div> */}
        {/* <div className="footer bg-primary flex flex-col md:flex-row xl:items-center xl:justify-center p-5 xl:p-0 border-t-2 border-[#948e8e79] w-full mt-8 h-[40vh] relative lg:gap-[3%]">
          <div className="row1 xl:flex-basis-[15%] sm:mt-10 ">
            <div className="icon  xl:ml-2">
              <img alt="ACS" className="xl:w-35  xl:w-auto" src={logo} />
            </div>
          </div>
          <div className="row2 flex-basis-[30%]">
            <h2 className="font-bold lg:text-[22px] sm:text-xl mt-2">
              You can reach us on:
            </h2>
            <div className="flex-container flex items-center gap-2 mt-2">
              <img
                alt="ACS"
                className="xl:w-35 md:w-10  xl:w-auto"
                src={email}
              />
              <p className="lg:text-[23px] sm:text-xl">
                info@herolearning.ac.ke
              </p>
            </div>
            <div className="flex-container flex items-center gap-2 mt-2">
              <img
                alt="ACS"
                className="xl:w-35 md:w-10 xl:w-auto"
                src={phone}
              />
              <p className="lg:text-[23px] sm:text-xl">+254 123 456 789</p>
            </div>
            <div className="flex-container sm:text-xl flex items-center gap-2 mt-2">
              <img alt="ACS" className="xl:w-35 md:w-10 xl:w-auto" src={pin} />
              <p className="lg:text-[23px] sm:text-xl">Location</p>
            </div>
            <h2 className="font-bold lg:text-[22px] sm:text-xl mt-5">
              Find us on:
            </h2>
            <div className="socials flex w-[50%] gap-[10%] mt-2">
              <div>
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-10 xl:w-auto"
                  src={youtube}
                />
              </div>
              <div>
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-10 xl:w-auto"
                  src={linked}
                />
              </div>
              <div>
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-10 xl:w-auto"
                  src={facebook}
                />
              </div>
            </div>
          </div>
          <div className="row3 flex-basis-[30%]">
            <h2 className="lg:text-xl sm:text-xl mt-5">
              Subscribe to our mailing list
            </h2>
            <form className="validate-form">
              <div className="mt-5 ">
                <div className="input-form">
                  <FormInput
                    id="validation-form-2"
                    type="text"
                    name="email"
                    placeholder="Name"
                    className="block px-4 py-3 mt-4  min-w-full xl:min-w-[350px] w-full"
                  />
                </div>
                <div className="input-form mt-5">
                  <div className="flex items-center">
                    <FormInput
                      id="validation-form-3"
                      name="password"
                      placeholder="Email"
                      className="block px-4 py-3 mt-4  min-w-[250px] xl:min-w-[350px] border pr-10"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 text-center  xl:mt-8 xl:text-left">
                <Button
                  variant="primary"
                  className="w-full px-3 align-top xl:w-20 xl:float-right"
                >
                  Submit
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
        </div> */}
      </div>
    </>
  );
};

export default Home;
