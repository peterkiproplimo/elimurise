import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { FormInput, FormCheck, FormSelect } from "../../base-components/Form";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";

import logoUrl from "../assets/images/Untitled-1.png";
import logo from "../../assets/images/heros.png";
import icon from "../../assets/images/Arrow_Right_MD.png";

import users from "../../assets/images/Users_Group.png";

import email from "../../assets/images/social.png";
import phone from "../../assets/images/social (1).png";
import user from "../../assets/images/User.png";
import contact4 from "../../assets/images/contact2.png";
import check from "../../assets/images/Checkbox_Check.png";
import vector from "../../assets/images/Vector.png";
import lock from "../../assets/images/Lock.png";

import youtube from "../../assets/images/instagram.png";
import linked from "../../assets/images/linkedin.png";
import facebook from "../../assets/images/Vector (1).png";
import { Menu, X } from "lucide-react";
import FooterComponent from "../../webapp/footer";
import NavbarMenu from "../../webapp/NavBarMenu";

const Demo = () => {
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
      <NavbarMenu/>

        <div className="xl:mx-auto xl:w-[80%] p-5">
          <h1 className="xl:text-5xl text-2xl text-center font-semibold  text-primary w-full">
            Request a Demo
          </h1>
          <p className="text-primary text-center xl:text-2xl  p-4">
            We're proud to partner with school to provide students equitable
            access to academic support, preparing them for success in school and
            beyond. If you'd like to explore a partnership with Hero Learning,
            please get in touch with us via the form below.
          </p>
          <div className="grid xl:mt-10 xl:ml-10 xl:mr-10 overflow-hidden sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:divide-y-0 xl:grid-cols-2">
            <div className="group xl:ml-10 xl:pr-10 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <h1 className="xl:text-3xl text-xl font-semibold  w-full">
                Hero Learning System drives CBC learning positive academic
                outcomes
              </h1>
              <div className="mt-2">
                <ul className="space-y-2 xl:mt-8  xl:text-lg text-md">
                  <li className="flex  xl:text-2xl items-center p-0.5">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-primary w-8 h-8 xl:w-10 xl:h-10 mr-2"
                    />
                    Implement CBC academic planning and prepare students for
                    higher education or a career
                  </li>

                  <li className="flex xl:text-2xl items-center p-0.5">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-primary w-8 h-8 xl:w-10 xl:h-10 mr-2"
                    />
                    Enhance teachers' capacity to offer personalized learning
                    experiences.
                  </li>

                  <li className="flex xl:text-2xl items-center p-0.5">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-primary w-8 h-8 xl:w-10 xl:h-10 mr-2"
                    />
                    Track and measure student progress
                  </li>
                </ul>
              </div>
            </div>
            <div className="group relative dark:bg-gray-800 p-2 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 m-0 w-full flex">
              <form className="validate-form w-full shadow-md p-8 border">
                <div className="mt-5">
                  <div className="input-form p-2">
                    <FormInput
                      id="validation-form-2"
                      type="text"
                      name="email"
                      placeholder="First Name *"
                      className="block px-4 py-3  min-w-full xl:min-w-[350px] w-full rounded-none  border-gray-300"
                    />
                  </div>
                  <div className="input-form p-2">
                    <FormInput
                      id="validation-form-2"
                      type="email"
                      name="email"
                      placeholder="Last Name *"
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
                    <FormSelect
                      id="validation-form-2"
                      name="code"
                      className="block px-4 py-3 min-w-full text-[#808080] xl:min-w-[350px] w-full rounded-none border-gray-300"
                      defaultValue=""
                    >
                      <option value="" className="text-primary" disabled>
                        County*
                      </option>
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                    </FormSelect>
                  </div>
                  <div className="input-form p-2">
                    <FormSelect
                      id="validation-form-2"
                      name="code"
                      className="block px-4 py-3 min-w-full text-[#808080] xl:min-w-[350px] w-full rounded-none border-gray-300"
                      defaultValue=""
                    >
                      <option value="" className="text-primary" disabled>
                        Sub County*
                      </option>
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                    </FormSelect>
                  </div>
                  <div className="input-form p-2">
                    <FormInput
                      id="validation-form-3"
                      type={"password"}
                      name="password"
                      placeholder="Phone Number*"
                      className="block px-4 py-3  min-w-full xl:min-w-[350px] w-full rounded-none  border-gray-300"
                    />
                  </div>

                  <div className="input-form p-2">
                    <FormSelect
                      id="validation-form-2"
                      name="code"
                      className="block px-4 py-3 min-w-full text-[#808080]  xl:min-w-[350px] w-full rounded-none border-gray-300"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Your Role*
                      </option>
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                    </FormSelect>
                  </div>

                  <div className="input-form p-2">
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Comment: Let us know how we can help you"
                      className="mt-1 block px-4 py-3  min-w-full xl:min-w-[350px]  h-[150px] w-full rounded-none  border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    ></textarea>
                  </div>
                </div>
                <p className="p-2 text-gray-500">
                  Hero Learning needs the contact information you provide to us
                  to contact you about our products and services.
                </p>
                <div className="flex mt-4 text-xs text-slate-600 dark:text-slate-500 sm:text-sm">
                  <div className="flex items-center mr-auto ml-2">
                    <FormCheck.Input
                      id="remember-me"
                      type="checkbox"
                      className="mr-2 border-gray-400"
                    />
                    <label
                      className="cursor-pointer select-none text-[#808080]"
                      htmlFor="remember-me"
                    >
                      You agree to our friendly
                      <Link
                        to="/register"
                        className="font-medium ml-1.5 text-primary"
                      >
                        privacy policy
                      </Link>
                    </label>
                  </div>
                </div>
                <div className="mt-5  xl:mt-8 xl:text-left">
                  <Button
                    variant="primary"
                    className="text-md w-[162px] p-2 h-[40px] px-3 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border "
                  >
                    Request Demo{" "}
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
        <div className="aboutContainer   p-5 bg-gray-300">
          <h1 className="xl:text-5xl text-2xl p-5 text-center text-primary font-bold">
            Already a Hero Learning Partner?
          </h1>
          <div className="  xl:flex items-center justify-center gap-10 xl:mx-80 px-5">
            <div>
              <p className="xl:text-2xl xl:p-5 text-lg text-center text-primary">
                If you need help from our customer care team, you can reach us
                at support@herolearning.com.{" "}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center p-5 ">
            <Link to="/contact" className="xl:w-32 xl:mr-8">
              <Button className="xl:text-xl text-[#152259] bg-transparent  border-primary text-MD w-[192px] p-2 h-[40px]  mb-2 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border">
                TALK TO US
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
        <FooterComponent />
      </div>
    </>
  );
};

export default Demo;
