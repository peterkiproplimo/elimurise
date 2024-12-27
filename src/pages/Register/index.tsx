import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { FormInput, FormCheck, FormSelect } from "../../base-components/Form";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/Auth";
import * as ApiService from "../../services/auth";
import { Link } from "react-router-dom";

import logoUrl from "../assets/images/Untitled-1.png";
import logo from "../../assets/images/heros.png";
import icon from "../../assets/images/Arrow_Right_MD.png";

import users from "../../assets/images/Users_Group.png";
import user from "../../assets/images/User.png";
import contact4 from "../../assets/images/contact2.png";
import check from "../../assets/images/Checkbox_Check.png";
import vector from "../../assets/images/Vector.png";
import lock from "../../assets/images/Lock.png";

import email from "../../assets/images/social.png";
import phone from "../../assets/images/social (1).png";

import youtube from "../../assets/images/instagram.png";
import linked from "../../assets/images/linkedin.png";
import facebook from "../../assets/images/Vector (1).png";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Menu, X } from "lucide-react";
import NavbarMenu from "../../webapp/NavBarMenu";
import FooterComponent from "../../webapp/footer";

const Register = () => {
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [numberOfLearners, setNumberOfLearners] = useState("");
  const [registered, setRegistered] = useState(false);

  const schema = yup
    .object({
      email: yup.string().required().email(),
      password: yup.string().required().min(4),
    })
    .required();
  const [loading, isLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const {
    register,
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();

    // if (result && !loading) {
    //   isLoading(true);
    //   try {
    //     const data = await getValues();
    //     let res = await ApiService.signup(data);
    //     auth.signIn(res);
    //     let token = res.token;
    //     await auth.signIn({ ...res.user, token });
    //     setRegistered(true);
    //     // localStorage.setItem("user_id", res.data.user._id);
    //     isLoading(false);
    //     // setCurrentStep();
    //     // setSuccess(true);
    //     // setMessage("Account Created successfully");
    //     // notify.current?.showToast();

    //     // navigate("/");
    //   } catch (error: any) {
    //     console.log(error);
    //     isLoading(false);
    //     setSuccess(false);
    //     setMessage(error.message);
    //     notify.current?.showToast();
    //   }
    // }
  };

  return (
    <>
      <div className="homeContainer">
        <NavbarMenu />

        <div className="xl:mx-auto  max-w-[1500px] bg-white p-2">
          <h1 className="xl:text-5xl text-2xl text-center font-semibold  text-primary w-full">
            Account Creation
          </h1>
          <p className="text-primary text-center text-md xl:text-2xl  p-4">
            Subscription types grant access to all of Hero Learning's platform
            features, including:
          </p>
          <div className="grid xl:mt-10 xl:ml-10 xl:mr-10 overflow-hidden rounded-3xl sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* First List Item */}
            <div className="flex flex-1 xl:text-2xl items-center p-4 bg-white ">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-primary w-8 h-8 xl:w-10 xl:h-10 mr-2"
              />
              <div>
                <h1 className="text-primary font-bold ">Analytics & Data</h1>
                <p>To monitor student progress in assignments and reading.</p>
              </div>{" "}
            </div>

            {/* Second List Item */}
            <div className="flex flex-1 xl:text-2xl items-center p-4 bg-white ">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-primary w-8 h-8 xl:w-10 xl:h-10 mr-2"
              />
              <div>
                <h1 className="text-primary font-bold">
                  Unlimited Teacher Accounts{" "}
                </h1>
                <p>For seamless collaboration and resource sharing.</p>
              </div>
            </div>

            {/* Third List Item */}
            <div className="flex flex-1 xl:text-2xl items-center p-4 bg-white rounded-lg shadow-md">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-primary w-8 h-8 xl:w-10 xl:h-10 mr-2"
              />
              <div>
                <h1 className="text-primary font-bold">
                  {" "}
                  Dedicated Account Manager{" "}
                </h1>
                <p> For consistent support and guidance.</p>
              </div>
            </div>
          </div>
          <div>
            <form
              className="validate-form bg-white xl:p-10 m-5 xl:box xl:border xl:border-gray-300"
              onSubmit={onSubmit}
            >
              <p className="mt-5 xl:text-2xl text-xl text-primary font-bold">
                Personal Information:
              </p>
              <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-5  ">
                <div className="input-form">
                  <FormInput
                    {...register("firstname")}
                    id="validation-form-2"
                    type="text"
                    name="firstname"
                    className={
                      errors.firstname
                        ? "block px-4 py-3 mt-4  min-w-full  border-danger"
                        : "block px-4 py-3 mt-4  min-w-full  xl:p-4 border-gray-300 rounded-none"
                    }
                    placeholder="First Name*"
                  />
                  {errors.firstname && (
                    <div className="mt-2 text-danger">
                      {typeof errors.firstname.message === "string" &&
                        errors.firstname.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <FormInput
                    {...register("lastname")}
                    id="validation-form-2"
                    type="text"
                    name="lastname"
                    className={
                      errors.lastname
                        ? "block px-4 py-3 xl:mt-4  min-w-full  border-danger"
                        : "block px-4 py-3 xl:mt-4  min-w-full  xl:p-4 border-gray-300 rounded-none"
                    }
                    placeholder="Last Name*"
                  />
                  {errors.lastname && (
                    <div className="mt-2 text-danger">
                      {typeof errors.lastname.message === "string" &&
                        errors.lastname.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <FormInput
                    {...register("email")}
                    id="validation-form-2"
                    type="email"
                    name="email"
                    className={
                      errors.email
                        ? "block px-4 py-3 xl:mt-4  min-w-full  border-danger"
                        : "block px-4 py-3 xl:mt-4  min-w-full  xl:p-4 border-gray-300 rounded-none"
                    }
                    placeholder="Email Address *"
                  />
                  {errors.email && (
                    <div className="mt-2 text-danger">
                      {typeof errors.email.message === "string" &&
                        errors.email.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <FormInput
                    {...register("phone")}
                    id="validation-form-2"
                    type="text"
                    name="phone"
                    className={
                      errors.phone
                        ? "block px-4 py-3 xl:mt-4  min-w-full  border-danger"
                        : "block px-4 py-3 xl:mt-4  min-w-full  xl:p-4 border-gray-300 rounded-none"
                    }
                    placeholder="Phone Number *"
                  />
                  {errors.phone && (
                    <div className="mt-2 text-danger">
                      {typeof errors.phone.message === "string" &&
                        errors.phone.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <div className="flex items-center">
                    <FormInput
                      {...register("password")}
                      id="validation-form-3"
                      type={"password"}
                      name="password"
                      className={
                        errors.password
                          ? "block px-4 py-3 xl:mt-4  min-w-full  border-danger pr-10"
                          : "block px-4 py-3 xl:mt-4  min-w-full xl:p-4 border-gray-300 rounded-none"
                      }
                      placeholder="Password*"
                    />
                  </div>

                  {errors.password && (
                    <div className="mt-2 text-danger">
                      {typeof errors.password.message === "string" &&
                        errors.password.message}
                    </div>
                  )}

                  {/* Eye Icon */}
                </div>
                <div className="input-form">
                  <div className="flex items-center">
                    <FormInput
                      {...register("confirm_password", {
                        required: "Confirm Password is required",
                      })}
                      id="validation-form-3"
                      type="password"
                      name="confirm_password"
                      className={
                        errors.password
                          ? "block px-4 py-3 xl:mt-4  min-w-full  border-danger xl:pr-10"
                          : "block px-4 py-3 xl:mt-4  min-w-full xl:p-4 border-gray-300 rounded-none"
                      }
                      placeholder="Confirm Password*"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex  xl:mt-8 xl:text-left">
                <Button
                  variant="primary"
                  className="text-md w-[92px] xl:text-lg xl:w-[192px] p-2 h-[40px] px-3 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border "
                >
                  Save
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-2 h-4 ml-2"
                    />
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="xl:p-10 xl:m-5  p-5 xl:box xl:border xl:border-gray-300">
            <h1 className="mt-5 xl:text-2xl text-xl text-primary p-2 font-bold">
              {" "}
              Choose a Plan:
            </h1>
            <form className="  grid overflow-hidden gap-5 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3  xl:grid-cols-3">
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
                    You get access to hard copy assessment tool books for all
                    grades. Charges per book:
                  </p>
                  <Button
                    variant="primary"
                    className="text-md xl:text-lg w-full mt-5 p-2 h-[40px] px-3 gap-2  border "
                  >
                    Add to Cart
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
                  <h1 className="xl:text-5xl text-2xl font-medium">KES 250</h1>
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
                  </div>{" "}
                  <Button
                    variant="primary"
                    className="text-md xl:text-lg  w-full mt-5 p-2 h-[40px] px-3 gap-2  border "
                  >
                    Add to Cart
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
                  </div>{" "}
                  <Button
                    variant="primary"
                    className="text-md xl:text-lg  w-full mt-5 p-2 h-[40px] px-3 gap-2  border "
                  >
                    Add to Cart
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

          <div>
            <form
              className="validate-form bg-white xl:p-10 m-5 xl:box xl:border xl:border-gray-300"
              onSubmit={onSubmit}
            >
              <p className="mt-5 xl:text-2xl text-xl text-primary font-bold">
                Subscribe :
              </p>
              <p className="mt-2 xl:text-2xl text-lg text-primary font-bold">
                You have Chosen Hero System.
              </p>
              <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-2  xl:mt-8 ">
                <div className="input-form">
                  <FormInput
                    {...register("firstname")}
                    id="validation-form-2"
                    type="text"
                    name="firstname"
                    className={
                      errors.firstname
                        ? "block px-4 xl:py-3 py-2 xl:mt-4  min-w-full  border-danger"
                        : "block px-4 xl:py-3  py-2 xl:mt-4 mt-2 min-w-full xl:p-4 border-gray-300 rounded-none"
                    }
                    placeholder=" School Name"
                  />
                  {errors.firstname && (
                    <div className="mt-2 text-danger">
                      {typeof errors.firstname.message === "string" &&
                        errors.firstname.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <FormSelect
                    id="validation-form-2"
                    name="county"
                    className="block px-4 xl:py-4 py-2 xl:mt-4 mt-2 min-w-full text-[#808080] xl:min-w-[350px] w-full rounded-none border-gray-300"
                    defaultValue=""
                  >
                    <option value="" className="text-primary" disabled>
                      Select County*
                    </option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </FormSelect>
                  {errors.lastname && (
                    <div className="mt-2 text-danger">
                      {typeof errors.lastname.message === "string" &&
                        errors.lastname.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <FormSelect
                    id="validation-form-2"
                    name="county"
                    className="block px-4  xl:py-3  py-2 xl:mt-4 mt-2 min-w-full text-[#808080] xl:min-w-[350px] w-full rounded-none border-gray-300"
                    defaultValue=""
                  >
                    <option value="" className="text-primary" disabled>
                      Select SubCounty*
                    </option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                    <option value="option3">Option 3</option>
                  </FormSelect>
                  {errors.email && (
                    <div className="mt-2 text-danger">
                      {typeof errors.email.message === "string" &&
                        errors.email.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <FormInput
                    {...register("phone")}
                    id="validation-form-2"
                    type="text"
                    name="Contact"
                    className={
                      errors.phone
                        ? "block px-4 xl:py-3 xl:mt-4 py-2 min-w-full  border-danger"
                        : "block  xl:py-3  py-2 xl:mt-4 mt-2 min-w-full xl:p-4 border-gray-300 rounded-none"
                    }
                    placeholder="Phone number"
                  />
                  {errors.phone && (
                    <div className="mt-2 text-danger">
                      {typeof errors.phone.message === "string" &&
                        errors.phone.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <div className="flex items-center">
                    <FormInput
                      {...register("password")}
                      id="validation-form-3"
                      type={"password"}
                      name="password"
                      className={
                        errors.password
                          ? "block px-4 xl:py-3 xl:mt-4 py-2 min-w-full  border-danger"
                          : "block  xl:py-3  py-2 xl:mt-4 mt-2 min-w-full xl:p-4 border-gray-300 rounded-none"
                      }
                      placeholder="Current Academic Year*"
                    />
                  </div>

                  {errors.password && (
                    <div className="mt-2 text-danger">
                      {typeof errors.password.message === "string" &&
                        errors.password.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <div className="flex items-center">
                    <FormInput
                      {...register("confirm_password", {
                        required: "Confirm Password is required",
                      })}
                      id="validation-form-3"
                      type="password"
                      name="confirm_password"
                      className={
                        errors.password
                          ? "block px-4 xl:py-3 py-2 xl:mt-4   min-w-full  border-danger pr-10"
                          : "block px-4  xl:py-3  py-2 xl:mt-4 mt-2 min-w-full xl:p-4 border-gray-300 rounded-none"
                      }
                      placeholder="Number Of Learners*"
                    />
                  </div>
                </div>
                <div className="input-form">
                  <div className="flex items-center">
                    <FormSelect
                      id="validation-form-2"
                      name="county"
                      className="block px-4 xl:py-4 py-2 xl:mt-4  mt-2 min-w-full text-[#808080] xl:min-w-[350px] w-full rounded-none border-gray-300"
                      defaultValue=""
                    >
                      <option value="" className="text-primary" disabled>
                        Choose A period*
                      </option>
                      <option value="option1">Option 1</option>
                      <option value="option2">Option 2</option>
                      <option value="option3">Option 3</option>
                    </FormSelect>
                  </div>
                </div>
                <div className="input-form">
                  <div className="flex items-center">
                    <FormInput
                      {...register("confirm_password", {
                        required: "Confirm Password is required",
                      })}
                      id="validation-form-3"
                      type="password"
                      name="confirm_password"
                      className={
                        errors.password
                          ? "block px-4 xl:py-3 xl:mt-4 py-2 min-w-full  border-danger"
                          : "block  xl:py-3  py-2 xl:mt-4 mt-2 min-w-full xl:p-4 border-gray-300 rounded-none"
                      }
                      placeholder="Total Bill.VAT Inclusive"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5  xl:mt-8 xl:text-left">
                <Link to="/payment" className="xl:w-32 xl:mr-8">
                  <Button
                    variant="primary"
                    className="text-md xl:text-lg w-[292px] p-4 h-[40px] px-3 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border "
                  >
                    Proceed to Make Payment
                    {loading && (
                      <LoadingIcon
                        icon="spinning-circles"
                        color="white"
                        className="w-2 h-4 ml-2"
                      />
                    )}
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>

        <FooterComponent />
      </div>
    </>
  );
};

export default Register;
