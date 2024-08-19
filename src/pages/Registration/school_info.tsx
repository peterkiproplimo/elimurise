import React, { useState, useRef } from "react";
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
  const [Package, setPackage] = useState<any>("");
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
    setCurrentStep(2);

    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        let res = await ApiService.signup(data);
        isLoading(false);
        console.log(res.user);
        let token = res.token;
        if (res.user.teacher && res.user.school) {
          localStorage.setItem("type", "teacher");
        } else if (res.user.school) {
          localStorage.setItem("type", "school");
        } else if (res.user.school == undefined) {
          localStorage.setItem("type", "billing");
        }

        await auth.signIn({ ...res.user, token });

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
        <div className="group relative  dark:bg-gray-800 transition h m-4 ">
          <form className="validate-form">
            <div className="  p-5  mt-10  rounded-xl">
              <h2 className=" text-3xl font-bold intro-x">Generate A Quote</h2>
              <h3 className=" text-2xl font-bold intro-x">
                You are about to subscribe to {Package.name}
              </h3>
              <p className="mt-5 text-xl">
                Please provide the following details:
              </p>
              <div className="col-span-12 sm:col-span-12 mt-5">
                <FormLabel htmlFor="modal-form-1" className="font-bold">
                  School Name
                </FormLabel>
                <FormInput
                  {...register("name")}
                  type="text"
                  name="name"
                  onChange={(e: any) => setSchool(e.target.value)}
                  className={errors.firstName ? "border-danger" : ""}
                  placeholder="St.Marys"
                />
                {errors.name && (
                  <div className="mt-2 text-danger">
                    {typeof errors.name.message === "string" &&
                      errors.name.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-12 mt-5">
                <FormLabel htmlFor="modal-form-1" className="font-bold">
                  Number of Learners
                </FormLabel>
                <FormInput
                  {...register("numberOfLearners")}
                  type="text"
                  onChange={(e: any) => {
                    setNumberOfLearners(e.target.value);
                  }}
                  name="numberOfLearners"
                  className={errors.lastName ? "border-danger" : ""}
                  placeholder="Number Of Learners"
                />
                {errors.lastName && (
                  <div className="mt-2 text-danger">
                    {typeof errors.lastName.message === "string" &&
                      errors.lastName.message}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>{" "}
      </div>
    </>
  );
};

export default Register;
