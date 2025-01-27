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
import logo from "../../assets/images/Untitled-1.png";
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
          navigate("/auth/login", {
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
    <div className="xl:p-10">
    <div className=" mt-5 ">
          <img alt="ACS" className="xl:w-10 xl:p-5 w-36   md:w-8 xl:w-auto" src={logo} />
        </div>
  <div className="  p-5  dark:bg-darkmode-600 sm:px-8 xl:p-0  ">
    <h2 className="text-2xl xl:ml-8 font-bold text-center  xl:text-3xl xl:text-left  lg:text-3xl lg:text-left">
      Forgot Password
    </h2>
    <div className="mt-2 sm:text-center lg:text-left text-slate-400 xl:hidden">
      Enter your email to reset your password.
    </div>
    <form className="validate-form xl:ml-8  " onSubmit={onSubmit}>
      <div className="mt-8 ">
        <div className="input-form">
          <FormInput
            {...register("email")}
            id="validation-form-2"
            type="email"
            name="email"
            className={
              errors.email
                ? "block px-4 py-3 mt-4 min-w-full border-danger"
                : "block px-4 py-3 mt-4 min-w-full border-gray-500"
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
                ? "block px-4 py-3 mt-4 min-w-full  border-danger"
                : "block px-4 py-3 mt-4 min-w-full"
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
      <div className="mt-5 text-center lg:text-left xl:mt-8 xl:text-left">
        <Button
          type="submit"
          variant="primary"
          className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3 lg:w-32 lg:mr-3"
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
        <Link to="/auth/login">
          <Button
            variant="outline-primary"
            className="w-full px-4 py-3 align-top xl:mt-0 mt-2 xl:w-32 xl:mr-3 lg:w-32 lg:mr-3 lg:mt-0"
          >
            Login
          </Button>
        </Link>
      </div>
    </form>
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

export default ForgotPassword;
