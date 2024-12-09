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
import Alert from "../../base-components/Alert";

const Register: React.FC<{ setCurrentStep: (step: number) => void }> = ({
  setCurrentStep,
}) => {
  const auth = useAuth();
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [numberOfLearners, setNumberOfLearners] = useState("");
  const [registered, setRegistered] = useState(false);
  const [counties, setCounties] = useState([]);
  const navigate = useNavigate();
  const [Package, setPackage] = useState<any>(
    JSON.parse(localStorage.getItem("package") || "{}")
  );
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      firstname: yup.string().required("First name is required"),
      lastname: yup.string().required("Last name is required"),
      phone: yup.string().required("Phone Number is required"),
      email: yup.string().required().email("Valid email is required"),
      password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
      confirm_password: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    })

    .required();

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

  const password = watch("password");

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();

    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        let res = await ApiService.signup(data);
        auth.signIn(res);
        let token = res.token;
        await auth.signIn({ ...res.user, token });
        setRegistered(true);
        // localStorage.setItem("user_id", res.data.user._id);
        isLoading(false);
        // setCurrentStep();
        // setSuccess(true);
        // setMessage("Account Created successfully");
        // notify.current?.showToast();
        setCurrentStep(2);
        // navigate("/");
      } catch (error: any) {
        console.log(error);
        isLoading(false);
        setSuccess(false);
        setMessage(error.message);
        notify.current?.showToast();
      }
    }
  };

  const [showPassword, setShowPassword] = useState<boolean>(false);

  // const togglePasswordVisibility = () => {
  //   console.log("Button clicked");
  //   setShowPassword(!showPassword);
  // };

  return (
    <>
      <div className="bg-white-200">
        <h1 className="text-primary">
          
        </h1>
      
        <form
          className="validate-form bg-white p-10 m-5 rounded-lg border border-gray-300"
          onSubmit={onSubmit}
        >
          <p className="mt-5 text-xl">Customer details:</p>
          <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-2 mt-8 ">
            <div className="input-form">
              <label>First Name</label>
              <FormInput
                {...register("firstname")}
                id="validation-form-2"
                type="text"
                name="firstname"
                className={
                  errors.firstname
                    ? "block px-4 py-3 mt-4  min-w-full  border-danger"
                    : "block px-4 py-3 mt-4  min-w-full    border-blue-300"
                }
                placeholder="firstname"
              />
              {errors.firstname && (
                <div className="mt-2 text-danger">
                  {typeof errors.firstname.message === "string" &&
                    errors.firstname.message}
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
                  errors.lastname
                    ? "block px-4 py-3 mt-4  min-w-full  border-danger"
                    : "block px-4 py-3 mt-4  min-w-full    border-blue-300"
                }
                placeholder="lastname"
              />
              {errors.lastname && (
                <div className="mt-2 text-danger">
                  {typeof errors.lastname.message === "string" &&
                    errors.lastname.message}
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
                    ? "block px-4 py-3 mt-4  min-w-full  border-danger"
                    : "block px-4 py-3 mt-4  min-w-full    border-blue-300"
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
                  errors.phone
                    ? "block px-4 py-3 mt-4  min-w-full  border-danger"
                    : "block px-4 py-3 mt-4  min-w-full    border-blue-300"
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
                  type={"password"}
                  name="password"
                  className={
                    errors.password
                      ? "block px-4 py-3 mt-4  min-w-full  border-danger pr-10"
                      : "block px-4 py-3 mt-4  min-w-[250px]   border pr-10   border-blue-300"
                  }
                  placeholder="Enter Password"
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
              <label>Confirm Password</label>
              <div className="flex items-center">
                <FormInput
                  {...register("confirm_password", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  id="validation-form-3"
                  type="password"
                  name="confirm_password"
                  className={
                    errors.confirm_password
                      ? "block px-4 py-3 mt-4  min-w-full border-danger pr-10"
                      : "block px-4 py-3 mt-4  min-w-[250px] border pr-10 border-blue-300"
                  }
                  placeholder="Confirm Password"
                />
             
              </div>

              {errors.password && (
                <div className="mt-2 text-danger">
                  {typeof errors.password.message === "string" &&
                    errors.password.message}
                </div>
              )}

            </div>
          </div>
      
          <div className="mt-5 flex justify-end xl:mt-8 xl:text-left">
            
            {!registered && (
              <Button
                variant="primary"
                className="w-[200px] px-4 py-3 align-top xl:w-22 xl:mr-3 "
              >
                Submit
                {loading && (
                  <LoadingIcon
                    icon="spinning-circles"
                    color="white"
                    className="w-2 h-4 ml-2"
                  />
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
      <Notification
        options={{ duration: 3000 }}
        getRef={(el) => {
          notify.current = el;
        }}
        className="flex"
      >
        <Lucide
          icon={success ? "CheckCircle" : "XCircle"}
          className={success ? "text-success" : "text-danger"}
        />
        <div className="ml-4 mr-4">
          <div className="font-medium">{success ? "Success" : "Failed "}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
};

export default Register;
