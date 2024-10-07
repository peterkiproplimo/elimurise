import React, { useState, useRef } from "react";
import { FormInput } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { useAuth } from "../../contexts/Auth";
import * as ApiService from "../../services/auth";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import Lucide from "../../base-components/Lucide";
import { Link, useNavigate } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import { Errors } from "../../type";
import { useLocation, useParams } from "react-router-dom";

const ForgotPasswordOTP = () => {
  const location = useLocation();
  const data = useParams();
  const token = data.token;
  const email = location.state?.email;
  const channel = location.state?.channel;
  const navigate = useNavigate();
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup.object({
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    cpassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),

    token: yup
      .string()
      // .matches(/^\d{6}$/, "Enter a valid 6-digit OTP")
      .required("OTP is required"),
  });

  const handleClick = () => {
    setTimeout(() => {
      navigate("/auth/login");
    }, 1000);
  };

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
    if (result) {
      isLoading(true);
      try {
        const data = await getValues();
        console.log("Good morning great men of God");
        console.log(data);
        let res = await ApiService.verifyEmailOTPParent(data);
        isLoading(false);
        setSuccess(true);
        setMessage("Password reset successfully");
        notify.current?.showToast();
        setTimeout(() => {
          localStorage.setItem("selectedForm", "form2");
          navigate("/auth/login", {
            replace: true,
          });
        }, 1000);

        /* this code was done by samsms*/
      } catch (err: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(err.message);
        notify.current?.showToast();
      }
    }
  };

  return (
    <>
      <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
        <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
          Verification
        </h2>
        <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
          Enter the 4-digit OTP sent to your email.
        </div>
        <form className="validate-form" onSubmit={onSubmit}>
          <div className="mt-8 intro-x">
            {/* <div className="input-form flex items-center justify-center space-x-2">
              {[0, 1, 2, 3].map((index) => (
                <FormInput
                  key={index}
                  {...register(`otp[${index}]`)}
                  id={`validation-form-otp-${index}`}
                  type="text"
                  name={`otp[${index}]`}
                  maxLength={1}
                  className={`text-center w-12 h-12 border rounded-md ${
                    errors.otp? 'border-danger' : ''
                    // errors.otp && errors.otp[index] ? 'border-danger' : ''

                  }`
                
                
                
                }
                  placeholder=""
                />



                
              ))}
            </div> */}
            {/* {errors.otp && (
              <div className="mt-2 text-danger">{typeof errors.otp.message === 'string' && errors.otp.message}</div>
            )} */}
            <div className="input-form">
              <FormInput
                {...register("token")}
                id="validation-form-2"
                type="hidden"
                name="token"
                defaultValue={token}
                placeholder="otp"
              />
              {errors.otp && (
                <div className="mt-2 text-danger">
                  {typeof errors.otp.message === "string" && errors.otp.message}
                </div>
              )}
            </div>
            {/* <div className="input-form">
              <FormInput
                {...register("otp")}
                id="validation-form-2"
                type="text"
                name="otp"
                defaultValue={token}
                className={
                  errors.otp
                    ? "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border-danger"
                    : "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                }
                placeholder="otp"
              />
              {errors.otp && (
                <div className="mt-2 text-danger">
                  {typeof errors.otp.message === "string" && errors.otp.message}
                </div>
              )}
            </div> */}
            <div className="input-form">
              <FormInput
                {...register("password")}
                id="validation-form-2"
                type="password"
                autoComplete="off"
                name="password"
                className={
                  errors.email
                    ? "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border-danger"
                    : "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                }
                placeholder="New Password"
              />
              {errors.password && (
                <div className="mt-2 text-danger">
                  {typeof errors.password.message === "string" &&
                    errors.password.message}
                </div>
              )}
            </div>
            <div className="input-form">
              <FormInput
                {...register("cpassword")}
                id="validation-form-2"
                type="password"
                autoComplete="off"
                name="cpassword"
                className={
                  errors.cpassword
                    ? "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border-danger"
                    : "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                }
                placeholder="Confirm Password"
              />
              {errors.cpassword && (
                <div className="mt-2 text-danger">
                  {typeof errors.cpassword.message === "string" &&
                    errors.cpassword.message}
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
            <Button
              type="submit"
              variant="primary"
              className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
            >
              Verify
              {loading && (
                <LoadingIcon
                  icon="spinning-circles"
                  color="white"
                  className="w-4 h-4 ml-2"
                />
              )}
            </Button>
            <Link to="/login">
              <Button
                variant="outline-primary"
                className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
              >
                Cancel
              </Button>
            </Link>
            {/* <Link to="/CreateNewPassword">
              <Button variant="outline-primary" className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3">
                Verify
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline-primary" className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3">
                Resend Code
              </Button>
            </Link> */}
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
          <div
            className={`font-medium ${
              success ? "text-success" : "text-danger"
            }`}
          >
            {success ? "Success" : "Failed"}
          </div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
};

export default ForgotPasswordOTP;
