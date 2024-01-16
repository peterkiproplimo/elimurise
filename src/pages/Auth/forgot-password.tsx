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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      email: yup.string().required().email(),
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
    if (result) {
      isLoading(true);
      try {
        const data = await getValues();
        console.log("hello");
        console.log(data);

        let res = await ApiService.addEmailOTP(data);
        isLoading(false);
        setSuccess(true);
        setMessage(res.message);
        notify.current?.showToast();
        setTimeout(() => {
          navigate("/ForgotPasswordOTP", {
            state: { email: data.email, channel: data.channel },
            replace: true,
          });
        }, 1000);
      } catch (err: any) {
        isLoading(false);
        setSuccess(false);
        setMessage("Incorrect or invalid email");
        notify.current?.showToast();
      }
    }
  };

  return (
    <>
      <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
        <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
          Forgot Password
        </h2>
        <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
          Enter your email to reset your password.
        </div>
        <form className="validate-form" onSubmit={onSubmit}>
          <div className="mt-8 intro-x">
            <div className="input-form">
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
              <FormInput
                {...register("channel")}
                id="validation-form-2"
                type="hidden"
                name="channel"
                value={"email"}
                className={
                  errors.channel
                    ? "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] border-danger"
                    : "block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px]"
                }
                placeholder="channel"
              />
              {errors.channel && (
                <div className="mt-2 text-danger">
                  {typeof errors.channel.message === "string" &&
                    errors.channel.message}
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
              Reset
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
                Login
              </Button>
            </Link>
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

export default ForgotPassword;
