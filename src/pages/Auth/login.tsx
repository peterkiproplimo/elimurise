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

const Login = () => {
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
        let res = await ApiService.login(data);
        isLoading(false);
        await auth.signIn(res);
        setSuccess(true);
        setMessage("Authenticated successfully");
        notify.current?.showToast();
        // navigate("/");
      } catch (error) {
        isLoading(false);
        setSuccess(false);
        setMessage("Incorrect credentials.");
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
        <h2 className="text-4xl font-medium">Login</h2>
        <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
          A few more clicks to sign in to your account.
        </div>
        <form className="validate-form" onSubmit={onSubmit}>
          <div className="mt-8 intro-x">
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
                    : "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
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
                      ? "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border-danger pr-10"
                      : "block px-4 py-3 mt-4 intro-x min-w-[250px] xl:min-w-[350px] border pr-10"
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
          <div className="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
            <div className="flex items-center mr-auto">
              <FormCheck.Input
                id="remember-me"
                type="checkbox"
                className="mr-2 border"
              />
              <label
                className="cursor-pointer select-none"
                htmlFor="remember-me"
              >
                Remember me
              </label>
            </div>
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
            <Button
              variant="primary"
              className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
            >
              Login
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
