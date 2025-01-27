import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import Button from "../../base-components/Button";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import Lucide from "../../base-components/Lucide";
import { FormInput, FormCheck, FormLabel } from "../../base-components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/Auth";
import * as ApiService from "../../services/auth";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./login.css";
import logo from "../../assets/images/Untitled-1.png";
import { setSchool } from "../../utils/helper";

const Login = () => {
  const auth = useAuth();
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedForm, setSelectedForm] = useState("form1");

  // Retrieve from local storage on component mount
  useEffect(() => {
    const storedForm = localStorage.getItem("selectedForm");
    if (storedForm) {
      setSelectedForm(storedForm);
    }
  }, []);

  // Handle radio button changes
  const handleFormChange = (e: any) => {
    const value = e.target.value;
    setSelectedForm(value);
    localStorage.setItem("selectedForm", value); // Save to local storage
  };

  const navigate = useNavigate();
  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      email: yup.string().required().email(),
      // code: yup.string().required(),
      password: yup.string().required().min(4),
    })
    .required();

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
    localStorage.clear();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        if (selectedForm == "form1") {
          let res = await ApiService.login(data);
          if (res.step) {
            localStorage.setItem("step", res.step);
            if (res.step == 4) {
              localStorage.setItem("billing", JSON.stringify(res.billing));
            }
          }
          isLoading(false);
          console.log(res.user);
          let token = res.token;
          setSchool(res.school);
          if (res.user.teacher) {
            localStorage.setItem("type", "teacher");
          } else {
            localStorage.setItem("type", "school");
          }

          await auth.signIn({ ...res.user, token });
        } else {
          let res = await ApiService.login_parent(data);
          isLoading(false);
          console.log(res.user);
          let token = res.token;
          localStorage.setItem("type", "parent");
          await auth.signIn({ ...res.user, token });
        }
        window.location.href = "/home";
        setSuccess(true);
        setMessage("Authenticated successfully");
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
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
      <div className="form-container mt-5 p-0">
        <div className=" mt-5  xl:ml-5">
          <img alt="ACS" className="xl:w-10 xl:p-5 w-36   md:w-8 xl:w-auto" src={logo} />
        </div>
        <div className="xl:p-10">
          <h2 className="xl:text-5xl text-3xl font-bold  xl:mt-5  xl:ml-10  ml-5">
            Login
          </h2>
          <div className="mt-2 text-slate-900 xl:ml-10 ml-5 xl:text-xl">
            Login with the data you entered during your registration.
          </div>
          <div className="xl:ml-8 ml-2">
            <FormLabel className="xl:mr-5">
              <input
                type="radio"
                className="xl:p-3 m-3"
                value="form1"
                checked={selectedForm === "form1"}
                onChange={handleFormChange}
              />
              School
            </FormLabel>
            <FormLabel className="mr-5">
              <input
                type="radio"
                value="form2"
                className="xl:p-3 m-3"
                checked={selectedForm === "form2"}
                onChange={handleFormChange}
              />
              Parent{" "}
            </FormLabel>
          </div>

          {selectedForm === "form1" ? (
            <>
              <form className="validate-form xl:pl-10 xl:pr-10 pl-5 pr-5" onSubmit={onSubmit}>
                <div className=" ">
                  <div className="input-form">
                    <label className="">Email</label>
                    <FormInput
                      {...register("email")}
                      id="validation-form-2"
                      type="email"
                      name="email"
                      className={
                        errors.email
                          ? "block px-4 py-3 mt-2  min-w-full xl:min-w-[350px] border-danger"
                          : "block px-4 py-3 mt-2  min-w-full  border-gray-500"
                      }
                      placeholder="Email"
                    />
                    {errors.email && (
                      <div className="mt-2 text-danger">
                        {typeof errors.email.message === "string" &&
                          errors.email.message}
                      </div>
                    )}
                  </div>
                  <div className="input-form pt-2">
                    <label className=" ">Password</label>
                    <div className="flex items-center">
                      <FormInput
                        {...register("password")}
                        id="validation-form-3"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className={
                          errors.password
                            ? "block px-4 py-3 mt-2  min-w-full xl:min-w-[350px] border-danger pr-10"
                            : "block px-4 py-3 mt-2 min-w-full  border-gray-500 "
                        }
                        placeholder="Enter Password"
                      />
                      {/* <div
                    className="flex items-center cursor-pointer eye-icon mt-5"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="text-grey-800"
                    />
                  </div> */}
                    </div>

                    {errors.password && (
                      <div className="mt-2 text-danger">
                        {typeof errors.password.message === "string" &&
                          errors.password.message}
                      </div>
                    )}

                    {/* Eye Icon */}
                  </div>
                </div>

                <div className="mt-5 text-center  xl:mt-8 ">
                  <Button
                    variant="primary"
                    className="w-full px-4 py-3 align-top   xl:text-lg xl:w-22 xl:mr-3"
                  >
                    Login
                    {loading && (
                      <LoadingIcon
                        icon="spinning-circles"
                        color="white"
                        className="w-2 h-4 ml-2"
                      />
                    )}
                  </Button>
                </div>
                <div className="flex mt-4 text-md xl:text-md justify-end  text-slate-600 dark:text-slate-500 ">
                  {/* <div className="flex items-center mr-auto">
                <FormCheck.Input
                  id="remember-me"
                  type="checkbox"
                  className="mr-2 border-blue-300"
                />
                <label
                  className="cursor-pointer select-none"
                  htmlFor="remember-me"
                >
                  Remember me
                </label>
              </div> */}
                  <Link to="/auth/forgot-password">
                    {" "}
                    Did You Forget Password?
                  </Link>
                </div>
              </form>
              <div className="border xl:m-10 m-5 xl:p-5 p-3 border-gray-300">
                <p className="mt-2 pb-2 xl:ml-5 xl:text-xl xl:text-2xl font-bold">
                  Dont have an account?
                </p>
                <div className=" text-center xl:ml-5 ">
                  <Link to="/register">

                  <Button
                    className="w-full xl:px-4 xl:py-3 align-top  bg-[#E8EDFF]  hover:bg-[#D1D9F9] xl:text-lg border-gray-500 rounded-none xl:text-lg xl:w-22 xl:mr-3"
                  >
                   Create Account
                    {loading && (
                      <LoadingIcon
                        icon="spinning-circles"
                        color="white"
                        className="w-2 h-4 ml-2"
                      />
                    )}
                  </Button>
                    {/* <Button className="w-full px-4 py-3 align-top  bg-[#E8EDFF]  hover:bg-[#D1D9F9] border-gray-500 rounded-none text-lg xl:text-lg xl:w-22 xl:mr-3">
                      Create Account
                      {loading && (
                        <LoadingIcon
                          icon="spinning-circles"
                          color="white"
                          className="w-2 h-4 ml-2"
                        />
                      )}
                    </Button> */}
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <form className="validate-form xl:pl-10 xl:pr-10 pl-5 pr-5" onSubmit={onSubmit}>
              <div className="mt-5 ">
                <div className="input-form">
                  <label>Guardian Email</label>
                  <FormInput
                    {...register("email")}
                    id="validation-form-2"
                    type="email"
                    name="email"
                    className={
                      errors.email
                        ? "block px-4 py-3 mt-2 mb-4  min-w-full xl:min-w-[350px] border-danger"
                        : "block px-4 py-3 mt-2 mb-4  min-w-full xl:min-w-[350px]  border-gray-500"
                    }
                    placeholder="Email"
                  />
                  {errors.email && (
                    <div className="mt-2 text-danger">
                      {typeof errors.email.message === "string" &&
                        errors.email.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <label>School Code</label>
                  <FormInput
                    {...register("code")}
                    id="validation-form-2"
                    type="text"
                    name="code"
                    className={
                      errors.code
                        ? "block px-4 py-3 mt-2 mb-4   min-w-full xl:min-w-[350px] border-danger"
                        : "block px-4 py-3 mt-2 mb-4  min-w-full xl:min-w-[350px] border-gray-500"
                    }
                    placeholder="School Code"
                  />
                  {errors.code && (
                    <div className="mt-2 text-danger">
                      {typeof errors.code.message === "string" &&
                        errors.code.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <label>Password</label>
                  <div className="flex items-center">
                    <FormInput
                      {...register("password")}
                      id="validation-form-3"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={
                        errors.password
                          ? "block px-4 py-3 mt-2  min-w-full xl:min-w-[350px] border-danger pr-10"
                          : "block px-4 py-3 mt-2 min-w-[250px] xl:min-w-[350px] border pr-10 border-gray-500"
                      }
                      placeholder="Enter Password"
                    />
                    <div
                      className="flex items-center cursor-pointer -mt-2 eye-icon"
                      onClick={togglePasswordVisibility}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="text-grey-800"
                      />
                    </div>
                  </div>

                  {errors.password && (
                    <div className="mt-2 text-danger">
                      {typeof errors.password.message === "string" &&
                        errors.password.message}
                    </div>
                  )}

                  {/* Eye Icon */}
                </div>
              </div>
              <div className="flex mt-4 text-xs  text-slate-600 dark:text-slate-500 sm:text-sm">
                <div className="flex items-center mr-auto">
                  <FormCheck.Input
                    id="remember-me"
                    type="checkbox"
                    className="mr-2 border-blue-300"
                  />
                  <label
                    className="cursor-pointer select-none"
                    htmlFor="remember-me"
                  >
                    Remember me
                  </label>
                </div>
                <Link to="/auth/v1/forgot-password">Forgot Password?</Link>
              </div>
              <div className="mt-5 text-center  xl:mt-8 xl:text-left">
                <Button
                  variant="primary"
                  className="w-full px-4 py-3 align-top xl:w-22 xl:mr-3"
                >
                  Login
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
          )}
        </div>
      </div>
      <Notification
        getRef={(el) => {
          notify.current = el;
        }}
        options={{
          duration: 3000,
        }}
        className="flex"
      >
        <Lucide
          icon={success ? "CheckCircle" : "XCircle"}
          className={success ? "text-success" : "text-danger"}
        />
        <div className="ml-4 mr-4">
          <div className="font-medium">{success ? "Success" : "Failed"}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
};

export default Login;
