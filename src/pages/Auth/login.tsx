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

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
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

          window.location.href = "/home";
        } else {
          let res = await ApiService.login_parent(data);
          isLoading(false);
          console.log(res.user);
          let token = res.token;
          localStorage.setItem("type", "parent");
          await auth.signIn({ ...res.user, token });
          setSchool(res.school);
          window.location.href = "/parent";
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

  return (
    <>
      <div className="form-container mt-5 px-5 md:px-10 lg:px-20">
        <div className="mt-5 flex justify-center">
          <img alt="ACS" className="w-[100px] md:w-24" src={logo} />
        </div>
        <div className="p-5 md:p-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Login</h2>
          <p className="mt-2 text-center text-gray-700">
            Login with the data you entered during your registration.
          </p>
          <div className="flex justify-center mt-4">
            <label className="mr-5">
              <input
                type="radio"
                value="form1"
                className="mr-2"
                checked={selectedForm === "form1"}
                onChange={handleFormChange}
              />
              School
            </label>
            <label>
              <input
                type="radio"
                value="form2"
                className="mr-2"
                checked={selectedForm === "form2"}
                onChange={handleFormChange}
              />
              Parent
            </label>
          </div>

          <form className="mt-5" onSubmit={onSubmit}>
            <div>
              <label>Email</label>
              <input
                {...register("email")}
                type="email"
                className={`block w-full px-4 py-3 mt-2 border rounded-md ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof errors.email.message === "string" &&
                    errors.email.message}
                </p>
              )}
            </div>

            {selectedForm === "form2" && (
              <div className="mt-3">
                <label>School Code</label>
                <input
                  {...register("code")}
                  type="text"
                  className={`block w-full px-4 py-3 mt-2 border rounded-md ${
                    errors.code ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="School Code"
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">
                    {typeof errors.code.message === "string" &&
                      errors.code.message}
                  </p>
                )}
              </div>
            )}

            <div className="mt-3 relative">
              <label>Password</label>
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className={`block w-full px-4 py-3 mt-2 border rounded-md pr-10 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter Password"
              />
              <div
                className="absolute right-3 top-12 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="text-gray-600"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof errors.password.message === "string" &&
                    errors.password.message}
                </p>
              )}
            </div>

            <div className="mt-5 text-right text-sm">
              <a
                href="/auth/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md mt-5 hover:bg-blue-700"
            >
              Login
              {loading && <span className="ml-2 animate-spin">🔄</span>}
            </button>
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

export default Login;
