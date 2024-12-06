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
      <div className="form-container">
        <div className="icon flex justify-center items-center  ">
          <img alt="ACS" className="xl:w-20 md:w-8 xl:w-auto" src={logo} />
        </div>
        <h2 className="text-3xl font-bold  ">Login</h2>
        <div className="mt-2 text-center  text-slate-900 xl text-xl">
          Please log in to continue.
        </div>
        <div>
          <FormLabel className="mr-5">
            <input
              type="radio"
              className="p-3 m-3"
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
              className="p-3 m-3"
              checked={selectedForm === "form2"}
              onChange={handleFormChange}
            />
            Parent{" "}
          </FormLabel>
        </div>

        {selectedForm === "form1" ? (
          <form className="validate-form" onSubmit={onSubmit}>
            <div className="mt-5 ">
              <div className="input-form">
                <label>Email</label>
                <FormInput
                  {...register("email")}
                  id="validation-form-2"
                  type="email"
                  name="email"
                  className={
                    errors.email
                      ? "block px-4 py-3 mt-4  min-w-full xl:min-w-[350px] border-danger"
                      : "block px-4 py-3 mt-4  min-w-full xl:min-w-[350px] bg-blue-100 border-blue-300"
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
                <label>Password</label>
                <div className="flex items-center">
                  <FormInput
                    {...register("password")}
                    id="validation-form-3"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className={
                      errors.password
                        ? "block px-4 py-3 mt-4  min-w-full xl:min-w-[350px] border-danger pr-10"
                        : "block px-4 py-3 mt-4  min-w-[250px] xl:min-w-[350px] border pr-10 bg-blue-100 border-blue-300"
                    }
                    placeholder="Enter Password"
                  />
                  <div
                    className="flex items-center cursor-pointer eye-icon"
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
              <Link to="/auth/forgot-password">Forgot Password?</Link>
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
            <p className="mt-2">
              Dont have an account? <Link to="/register">Sign Up</Link>
            </p>
          </form>
        ) : (
          <form className="validate-form" onSubmit={onSubmit}>
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
                      ? "block px-4 py-3 mt-4  min-w-full xl:min-w-[350px] border-danger"
                      : "block px-4 py-3 mt-4  min-w-full xl:min-w-[350px] bg-blue-100 border-blue-300"
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
                      ? "block px-4 py-3 mt-4  min-w-full xl:min-w-[350px] border-danger"
                      : "block px-4 py-3 mt-4  min-w-full xl:min-w-[350px] bg-blue-100 border-blue-300"
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
                        ? "block px-4 py-3 mt-4  min-w-full xl:min-w-[350px] border-danger pr-10"
                        : "block px-4 py-3 mt-4  min-w-[250px] xl:min-w-[350px] border pr-10 bg-blue-100 border-blue-300"
                    }
                    placeholder="Enter Password"
                  />
                  <div
                    className="flex items-center cursor-pointer eye-icon"
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
