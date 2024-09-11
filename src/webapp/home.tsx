import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../base-components/Button";
import LoadingIcon from "../base-components/LoadingIcon";
import { FormInput, FormCheck } from "../base-components/Form";
import * as yup from "yup";
import "./home.css";
import { Link } from "react-router-dom";

import logoUrl from "../assets/images/Untitled-1.png";
import logo from "../assets/images/heros.png";
import homepic from "../assets/images/Rectangle 6559.png";
import aboutpic from "../assets/images/Rectangle 6532.png";
import aboutpic2 from "../assets/images/Rectangle 6558.png";
import aboutpic3 from "../assets/images/Rectangle 6560.png";
import pic from "../assets/images/Rectangle 6533.png";
import pic2 from "../assets/images/Rectangle 6535.png";
import parent from "../assets/images/raphael_parent.png";
import cap from "../assets/images/ic_round-school.png";
import teacher from "../assets/images/la_chalkboard-teacher.png";
import jane from "../assets/images/Rectangle 6545.png";
import email from "../assets/images/ic_outline-email.png";
import phone from "../assets/images/bi_phone.png";
import pin from "../assets/images/mingcute_location-line.png";
import youtube from "../assets/images/mingcute_youtube-line.png";
import linked from "../assets/images/ant-design_linkedin-outlined.png";
import facebook from "../assets/images/iconoir_facebook.png";
import { Menu, X } from 'lucide-react';

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
      <div className="homeContainer  h-100vh  lg:p-10 sm:p-5">
        <div className="home flex justify-between">
          <div className="icon mt-5 ml-5">
            <img alt="ACS" className="xl:w-35  xl:w-auto" src={logo} />
          </div>
          <div className="buttons relative">
      {/* Hamburger Menu Icon for small screens */}
      <div className="block xl:hidden">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-blue-800 focus:outline-none"
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
        <div className="absolute z-10 mt-3 bg-white shadow-lg rounded-md p-4 w-full left-0 right-auto">
          <div className="mt-2 text-center">
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
      <div className="hidden xl:flex gap-3 mt-5 xl:mt-8">
        <Link to="/register" className="xl:w-32 xl:mr-3">
          <Button
            variant="primary"
            className="w-full xl:px-3 xl:py-3 px-2 py-2"
          >
            Register
            {loading && (
              <LoadingIcon
                icon="spinning-circles"
                color="white"
                className="w-4 h-4 ml-2"
              />
            )}
          </Button>
        </Link>
        <Link to="/auth/login" className="xl:w-32 xl:mr-3">
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
        </Link>
      </div>
    </div>
        </div>

        
        <div className="p-10">
          <div className="grid  overflow-hidden rounded-3xl text-gray-600  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:divide-y-0 xl:grid-cols-2">
            <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <h1 className="xl:text-5xl text-2xl font-semibold mt-5 text-black w-full">
                Empowering Competency Based Curriculum (CBC) Education In Kenya
              </h1>
              <div className="mt-10">
                <h2 className="mt-5 xl:text-xl sm:text-3l mb-5">
                  Engage. Empower. Excel.
                </h2>
                <p className="xl:text-xl sm:text-3l">
                  Welcome to Hero Learning, where we revolutionize education
                  through our innovative digital Competency Based Curriculum
                  (CBC) approach. Join us in shaping the future of learning.
                </p>
              </div>
              <div className="  mt-8 text-center intro-x xl:mt-8 xl:text-left">
                <Button
                  variant="primary"
                  className=" btn-2 w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                >
                  <i className="fas fa-play-circle"></i>View Demo
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
            <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <img
                alt="ACS"
                className="xl:w-35 md:w-full xl:w-auto w-full"
                src={homepic}
              />
            </div>
          </div>
        </div>
        <div className="aboutContainer mt-2">
          <h1 className="xl:text-5xl text-2xl font-semibold text-center">
            Who are we?
          </h1>
          <div className="  grid overflow-hidden rounded-3xl  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 p-10  xl:grid-cols-3">
            <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="secondArea">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-full xl:w-auto w-full"
                  src={aboutpic}
                />
              </div>
              <div className="contents">
                <h2 className="xl:text-3xl text-xl font-bold ml-2 ">
                  Our Core Values
                </h2>
                <ul className="mt-5 ml-5">
                  <li className="xl:text-xl sm:text-xl md:text-xl">
                    <span className="font-bold">Excellence:</span> Providing
                    highest quality and{" "}
                    <p className="mt-2"> standards in education.</p>
                  </li>
                  <li className="xl:text-xl sm:text-xl md:text-xl">
                    <span className="font-bold">Inclusivity:</span> Providing an
                    all inclusive learning{" "}
                    <p className="mt-2">environment for everyone.</p>
                  </li>
                  <li className="xl:text-xl sm:text-xl md:text-xl">
                    <span className="font-bold">Community:</span>Building strong
                    partnerships{" "}
                    <p className="mt-2">with teachers,learners and parents. </p>
                  </li>
                  <li className="xl:text-xl sm:text-xl md:text-xl">
                    <span className="font-bold">Innovation:</span> Tapping
                    creativity and using{" "}
                    <p className="mt-2">technology make learning fun.</p>
                  </li>
                </ul>
              </div>
            </div>
            <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="secondArea">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-full xl:w-auto w-full"
                  src={aboutpic2}
                />
              </div>
              <h2 className="xl:text-3xl text-xl font-bold ml-2">
                Our Mission
              </h2>
              <p className="mt-5 xl:text-xl sm:text-xl md:text-xl ml-2 ">
                At Hero Learning, we pride ourselves <br /> in building and
                inclusive and robust <br />
                learning environment that promotes <br /> critical thinking,{" "}
                <br />
                creativity, communication, collaboration and <br />
                life long learning.
              </p>
            </div>
            <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="secondArea">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-full xl:w-auto w-full"
                  src={aboutpic3}
                />
              </div>
              <h2 className="xl:text-3xl text-xl font-bold ml-2">Our Vision</h2>
              <p className="mt-5 xl:text-xl sm:text-xl md:text-xl ml-2">
                To empower every learner's talent <br /> with the skills and
                knowledge to build
                <br /> a successful future.
              </p>
            </div>
          </div>
        </div>
        <div className="aboutContainer mt-2">
          <h1 className="mt-5 text xl:text-5xl text-2xl md:text-3xl font-bold  text-center mb-2">
            Why Hero Learning?
          </h1>
          <div className="grid  overflow-hidden rounded-3xl  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3  p-10 xl:grid-cols-3">
            <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="secondArea">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-full xl:w-auto w-full"
                  src={pic}
                />
              </div>
              <h2 className="text xl:text-3xl text-xl font-bold ml-2">
                Innovative CBC Approach:{" "}
              </h2>
              <p className="mt-5 text xl:text-xl sm:text-xl md:text-xl ml-2">
                Our digital assessment tool is <br />
                designed for meeting the various
                <br />
                needs of each learner and <br />
                promoting a deeper understanding
                <br />
                of subjects.
              </p>
            </div>

            <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="secondArea">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-full xl:w-auto w-full"
                  src={pic2}
                />
              </div>
              <h2 className="text xl:text-3xl text-xl font-bold ml-2">
                Technology Integration:{" "}
              </h2>
              <p className="mt-5 ml-2 text xl:text-xl sm:text-xl md:text-xl ">
                Using cutting-edge technology we enhance the experience of
                <br /> teachers, learners and parents, <br />
                making education more <br />
                interactive and engaging.
              </p>
            </div>
            <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="secondArea">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-full xl:w-auto w-full"
                  src={aboutpic}
                />
              </div>
              <h2 className="text xl:text-3xl text-xl font-bold ml-2">
                Experienced Educators:{" "}
              </h2>
              <p className="mt-5 ml-2 text xl:text-xl sm:text-xl md:text-xl">
                Our passionate team of educators
                <br />
                is committed to nurturing the <br />
                potential of every student, ensuring
                <br />
                they thrive.{" "}
              </p>
            </div>
          </div>
        </div>
        <div className="service mt-2">
          <h1 className="mt-5 text xl:text-5xl text-2xl  font-bold  text-center mb-5">
            What can you do with our system?
          </h1>
          <div className="grid  overflow-hidden rounded-3xl  text-center  sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 lg:divide-y-0 xl:grid-cols-3">
            <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className=" flex justify-center items-center">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-10 xl:w-auto"
                  src={parent}
                />
              </div>
              <h2 className="text xl:text-3xl sm:text-3xl md:text-3xl font-bold ml-2 ">
                Parents
              </h2>
              <p className="mt-5 ml-2 text xl:text-xl sm:text-xl md:text-xl  ">
                {" "}
                Our system gives you <br />
                the ability to assess the <br />
                learner in real time, <br />
                allowing one to keep <br />
                proper track of progress.
              </p>
            </div>
            <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="flex justify-center items-center">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-10 xl:w-auto"
                  src={cap}
                />
              </div>
              <h2 className="text xl:text-3xl sm:text-3xl md:text-3xl font-bold ml-2">
                School
              </h2>
              <p className="mt-5 ml-2 text xl:text-xl sm:text-xl md:text-xl">
                Our system gives you <br />
                the ability to monitor the <br /> performance
                <br />
                of learners and provides <br />
                the option for <br />
                open communication
                <br />
                with the parents.
              </p>
            </div>
            <div className="group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="flex justify-center items-center">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-10 xl:w-auto"
                  src={teacher}
                />
              </div>
              <h2 className="text xl:text-3xl sm:text-3xl md:text-3xl font-bold ml-2">
                Teachers
              </h2>
              <p className="mt-5 ml-2 text xl:text-xl sm:text-xl md:text-xl">
                Our system gives you <br />
                the ability to properly assess
                <br /> and tap into each child's <br /> understanding <br />
                of the sub-strands
              </p>
            </div>
          </div>
        </div>
        {/* <div className="customers">
          <h1 className="mt-5 text xl:text-5xl sm:text-3xl md:text-3xl font-bold  text-center ">
            Impact:
          </h1>
          <h1 className="mt-5 text xl:text-4xl sm:text-3xl md:text-3xl font-bold  text-center mb-5">
            Transforming Lives Through Education
          </h1>
          <div className="grid  divide-x divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden rounded-3xl dark:border-gray-700 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:divide-y-0 xl:grid-cols-2">
            <div className="flex  justify-center  group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="area">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-10 xl:w-auto"
                  src={jane}
                />
              </div>
              <div className="m-2">
                <h2 className="text xl:text-3xl sm:text-3xl md:text-3xl font-bold ml-2">
                  Jane Doe
                </h2>
                <p className="xl:text-2xl sm:text-2xl md:text-2xl italic ">
                  <i> Parent, Nairobi</i>
                </p>
                <p className="  text xl:text-xl sm:text-xl md:text-xl">
                  "Hero Learning has been <br />
                  a game changer for my <br />
                  child. The CBC approach <br />
                  has truly made a difference <br />
                  in their academic journey."
                </p>
              </div>
            </div>
            <div className="flex group relative bg-white dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <div className="area">
                <img
                  alt="ACS"
                  className="xl:w-35 md:w-10 xl:w-auto"
                  src={jane}
                />
              </div>
              <div className="m-2">
                <h2 className="text xl:text-3xl sm:text-3xl md:text-3xl font-bold ml-2">
                  John Doe
                </h2>
                <p className="xl:text-2xl sm:text-2xl md:text-2xl italic ">
                  <i> Parent, Nairobi</i>
                </p>
                <p className="  text xl:text-xl sm:text-xl md:text-xl">
                  "Hero Learning has been <br />
                  a game changer for my <br />
                  child. The CBC approach <br />
                  has truly made a difference <br />
                  in their academic journey."
                </p>
              </div>
            </div>
          </div>
        </div> */}

        <div className="price mt-8 md:mb-5 h-full lg:pl-[20%] lg:w-[82%]">
          <h1 className="mt-5 text-xl xl:text-3xl  font-bold  text-center">
            How Much Will it Cost You?
          </h1>
          <h2 className="text xl:text-xl sm:text-xl md:text-xl text-center">
            Please select a pricing plan that works for you
          </h2>

          <div className="  mt-5 prices grid  divide-x divide-y divide-gray-100 dark:divide-gray-700 overflow-hidden rounded-3xl dark:border-gray-700 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 lg:divide-y-0 xl:grid-cols-3">
            <div className="tag1 p-2 m-4 mt-5 mb-5 xl:h-full lg:h-[80%]">
              <h1 className="m-5  text-left text xl:text-4xl text-xl font-bold ">
                HERO System
              </h1>
              <p className="ml-5 font-bold"> You get access to:</p>
              <ul className="ml-10 text-sm">
                <li>Online Formative Assessment.</li>
                <li>Online SummativeAssessment.</li>
                <li>Chat features with parents/guardians.</li>
                <li>Branded Termly/AnnualPrintable Reports</li>
              </ul>
              <h1 className="ml-5 mt-5 text-left text xl:text-4xl sm:text-3xl md:text-3xl font-bold ">
                1500Ksh
              </h1>
              <p className="ml-5 text-left text-sm"> (Per Learner Annually)</p>
            </div>
            <div className="tag2 p-2 m-4 mt-5 mb-5 xl:h-full lg:h-[80%]">
              <h1 className="ml-5 mt-2 text-left text xl:text-4xl text-xl font-bold ">
                Evidence <br />
                of Learning
              </h1>
              <h2 className="ml-5 mt-2 font-bold "> You get access to:</h2>
              <p className="ml-5">
                Hard copy assessment tool books for all grades with activities
                for all the sub strands plus: A scoring guide, and teacher's
                reflection.
              </p>
              <h2 className="ml-5 mt-2 "> Charges per book:</h2>
              <p className="text-sm ml-5 mb-0"> Pre School</p>
              <h1 className="ml-5  mt-0 text-left text xl:text-3xl sm:text-3xl md:text-3xl font-bold">
                250Ksh
              </h1>
              <p className="text-sm  ml-5"> Lower Primary</p>
              <h1 className="ml-5  mt-0 text-left text xl:text-3xl sm:text-3xl md:text-3xl font-bold">
                350Ksh
              </h1>
              <p className="text-sm  ml-5"> Upper Primary</p>
              <h1 className="ml-5  m-0 text-left text xl:text-3xl sm:text-3xl md:text-3xl font-bold">
                500Ksh
              </h1>
              <p className="text-sm  ml-5"> Junior Secondary</p>
              <h1 className="ml-5 text-left text xl:text-3xl sm:text-3xl md:text-3xl font-bold">
                600Ksh
              </h1>
            </div>
            <div className="tag3 p-2 m-4 mt-5 xl:h-full lg:h-[80%] ">
              <h1 className="mt-2 ml-8 text-left text xl:text-4xl text-xl font-bold">
                HERO
                <br /> All in One
              </h1>
              <h2 className="ml-8 xl:text-xl sm:text-xl md:text-xl">
                {" "}
                (Recommended)
              </h2>
              <p className="ml-5 mt-5 font-bold"> You get access to:</p>
              <ul className="ml-10 text-sm">
                <li>Online Formative Assessment.</li>
                <li>Online SummativeAssessment.</li>
                <li>Chat features with parents/guardians.</li>
                <li>Branded Termly/AnnualPrintable Reports</li>
                <li>
                  Hard copy assessment tool books for all grades with activities
                  for all the substrands plus: A scoring guide, and teacher's
                  reflection.
                </li>
              </ul>
              <h1 className="ml-5 mt-5 text-left text xl:text-4xl sm:text-3xl md:text-3xl font-bold">
                3000Ksh
              </h1>
              <p className="ml-5 text-left text-sm"> (Per Learner Annually)</p>
            </div>
          </div>
        </div>
        <div className="footer flex flex-col md:flex-row xl:items-center xl:justify-center p-5 xl:p-0 border-t-2 border-[#948e8e79] w-full mt-8 h-[40vh] relative lg:gap-[3%]">
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
              <div className="mt-5 intro-x">
                <div className="input-form">
                  <FormInput
                    id="validation-form-2"
                    type="text"
                    name="email"
                    placeholder="Name"
                    className="block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] w-full"
                  />
                </div>
                <div className="input-form mt-5">
                  <div className="flex items-center">
                    <FormInput
                      id="validation-form-3"
                      name="password"
                      placeholder="Email"
                      className="block px-4 py-3 mt-4 intro-x min-w-[250px] xl:min-w-[350px] border pr-10"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
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
        </div>
      </div>
    </>
  );
};

export default Home;
