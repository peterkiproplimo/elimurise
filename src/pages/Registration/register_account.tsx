import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import Button from "../../base-components/Button";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import Lucide from "../../base-components/Lucide";
import { FormInput, FormCheck } from "../../base-components/Form";
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

const Register = ({ setCurrentStep }) => {
  const auth = useAuth();
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      email: yup.string().required().email(),
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

    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        let res = await ApiService.signup(data);
        isLoading(false);
        setCurrentStep(2);

        // console.log(res.user);
        // let token = res.token;
        // if (res.user.teacher && res.user.school) {
        //   localStorage.setItem("type", "teacher");
        // } else if (res.user.school) {
        //   localStorage.setItem("type", "school");
        // } else if (res.user.school == undefined) {
        //   localStorage.setItem("type", "billing");
        // }

        // await auth.signIn({ ...res.user, token });

        setSuccess(true);
        setMessage("Authenticated successfully");
        notify.current?.showToast();
        // navigate("/");
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
      <div className="">
        <form className="validate-form" onSubmit={onSubmit}>
          <div className="mt-8 intro-x">
            <div className="input-form">
              <label>First Name</label>
              <FormInput
                {...register("firstname")}
                id="validation-form-2"
                type="text"
                name="firstname"
                className={
                  errors.email
                    ? "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border-danger"
                    : "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] bg-blue-100 border-blue-300"
                }
                placeholder="firstname"
              />
              {errors.name && (
                <div className="mt-2 text-danger">
                  {typeof errors.name.message === "string" &&
                    errors.name.message}
                </div>
              )}
            </div>
            <div className="input-form">
              <label>Last Name</label>
              <FormInput
                {...register("lastname")}
                id="validation-form-2"
                type="text"
                name="lastname"
                className={
                  errors.email
                    ? "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border-danger"
                    : "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] bg-blue-100 border-blue-300"
                }
                placeholder="lastname"
              />
              {errors.name && (
                <div className="mt-2 text-danger">
                  {typeof errors.name.message === "string" &&
                    errors.name.message}
                </div>
              )}
            </div>
            <div className="input-form">
              <label>Email</label>
              <FormInput
                {...register("email")}
                id="validation-form-2"
                type="email"
                name="email"
                className={
                  errors.email
                    ? "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border-danger"
                    : "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] bg-blue-100 border-blue-300"
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
              <label>Phone</label>
              <FormInput
                {...register("phone")}
                id="validation-form-2"
                type="text"
                name="phone"
                className={
                  errors.email
                    ? "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border-danger"
                    : "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] bg-blue-100 border-blue-300"
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
              <label>Password</label>
              <div className="flex items-center">
                <FormInput
                  {...register("password")}
                  id="validation-form-3"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className={
                    errors.password
                      ? "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border-danger pr-10"
                      : "block px-4 py-3 mt-4 intro-x min-w-[250px] xl:min-w-[350px]  border pr-10 bg-blue-100 border-blue-300"
                  }
                  placeholder="Enter Password"
                />
                {/* <div
                  className="flex items-center cursor-pointer eye-icon"
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
          {/* <div className="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
            <div className="flex items-center mr-auto">
              <FormCheck.Input
                id="remember-me"
                type="checkbox"
                className="mr-2 border "
              />
              <label
                className="cursor-pointer select-none"
                htmlFor="remember-me"
              >
                Remember me
              </label>
            </div>
            <Link to="/auth/forgot-password">Forgot Password?</Link>
          </div> */}
          <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
            <Button
              variant="primary"
              className="w-full px-4 py-3 align-top xl:w-22 xl:mr-3 "
            >
              Register
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
            Already have an account? <Link to="/auth/login">Login</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
