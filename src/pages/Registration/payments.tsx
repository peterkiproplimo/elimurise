import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import Button from "../../base-components/Button";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import Lucide from "../../base-components/Lucide";
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
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
} from "../../base-components/Form";
import { formatCurrency } from "../../utils/helper";
import Alert from "../../base-components/Alert";
import { useLocation } from "react-router-dom";
import loader from "../../assets/images/load-32_256.gif";
const Payment: React.FC<{ setCurrentStep: (step: number) => void }> = ({
  setCurrentStep,
}) => {
  const auth = useAuth();
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [completed, setComplete] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [query, setQuery] = useState(searchParams.get("completed") || "");
  useEffect(() => {
    if (query) {
      setComplete(true);
    }
  }, []);

  const navigate = useNavigate();
  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      // email: yup.string().required().email(),
      // password: yup.string().required().min(4),
    })
    .required();
  const [Package, setPackage] = useState<any>(
    JSON.parse(localStorage.getItem("package") || "{}")
  );
  const [billing, setBilling] = useState<any>(
    JSON.parse(localStorage.getItem("billing") || "{}")
  );
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

    console.log(result);

    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        data.pricePerLearner = 1000;
        data.learners = 200;
        console.log(data);
        const billing_string = await localStorage.getItem("billing");

        if (billing_string !== null) {
          // Value previously stored
          const billing = JSON.parse(billing_string);
          let res = await ApiService.paySubscription(billing);
          setPaymentUrl(res.redirect_url);
          // console.log(res?.data);
          // isLoading(false);
        } else {
          throw Error("Failed");
        }

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
        // setMessage("Authenticated successfully");
        notify.current?.showToast();
        // navigate("/");
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        console.log(JSON.stringify(error));
        setMessage("Failed to pay");
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
      {/* <Alert
        variant="soft-danger"
        className="flex items-center mb-2"
        dismissTimeout={9000}
      >
        <Lucide icon="AlertCircle" className="w-6 h-6 mr-2" /> {message}
      </Alert> */}
      <div className="flex justify-center items-center ">
        {completed && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Payment Completed
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Thank you for your payment.
            </p>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/auth/login", { replace: true })}
                className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

        {!completed && !paymentUrl && !loading && (
          <form
            className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-md"
            onSubmit={onSubmit}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Payment Methods
            </h2>

            <div className="mb-5 text-center">
              <div className="font-bold text-gray-700 dark:text-gray-300 mb-5 ">
                You are about to pay
              </div>
              <span className="font-bold text-3xl">
                Ksh. {formatCurrency(billing.totalCost)}
              </span>
            </div>
            {/* ddg */}
            <div className="mb-5">
              <label className="font-bold text-gray-700 dark:text-gray-300">
                Choose Payment Method
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center mr-4">
                  <input
                    {...register("paymentMethod")}
                    name="mpesa"
                    value="mpesa"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 dark:text-white">MPESA</span>
                </label>
                <label className="inline-flex items-center mr-4">
                  <input
                    {...register("paymentMethod")}
                    type="radio"
                    name="paypal"
                    value="paypal"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 dark:text-white">PayPal</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    {...register("paymentMethod")}
                    type="radio"
                    name="rtg"
                    value="other"
                    className="form-radio text-indigo-600"
                  />
                  <span className="ml-2 dark:text-white">RTG</span>
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <button className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Proceed to Payment
              </button>
            </div>
          </form>
        )}
        <div className="flex flex-col justify-between h-full">
          {paymentUrl && loading && (
            <div className="text-center font-bold text-2xl">
              Processing Please Wait....
            </div>
          )}
          {!paymentUrl && loading && (
            <div className="text-center font-bold text-2xl">
              Initiating payment....
            </div>
          )}
          {loading && (
            <div className="flex justify-center">
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 200"
                className="w-20 h-20"
              >
                <circle
                  fill="#2E86FF"
                  stroke="#2E86FF"
                  strokeWidth="2"
                  r="15"
                  cx="40"
                  cy="100"
                >
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="1s"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.4s"
                  />
                </circle>
                <circle
                  fill="#2E86FF"
                  stroke="#2E86FF"
                  strokeWidth="2"
                  r="15"
                  cx="100"
                  cy="100"
                >
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="1s"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="-.2s"
                  />
                </circle>
                <circle
                  fill="#2E86FF"
                  stroke="#2E86FF"
                  strokeWidth="2"
                  r="15"
                  cx="160"
                  cy="100"
                >
                  <animate
                    attributeName="opacity"
                    calcMode="spline"
                    dur="1s"
                    values="1;0;1;"
                    keySplines=".5 0 .5 1;.5 0 .5 1"
                    repeatCount="indefinite"
                    begin="0s"
                  />
                </circle>
              </svg>
            </div>
          )}

          {paymentUrl && (
            <div className="flex justify-center">
              <iframe
                width="860"
                height={loading ? 0 : 1000}
                src={paymentUrl}
                onLoad={() => isLoading(false)}
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Payment;
