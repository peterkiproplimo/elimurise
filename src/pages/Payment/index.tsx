import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { FormInput, FormCheck } from "../../base-components/Form";
import * as yup from "yup";
import { useAuth } from "../../contexts/Auth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router-dom";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import * as ApiService from "../../services/auth";
import { formatCurrency } from "../../utils/helper";

import { Link } from "react-router-dom";

import logoUrl from "../assets/images/Untitled-1.png";
import logo from "../../assets/images/Elimurise.png";
import icon from "../../assets/images/Arrow_Right_MD.png";

import users from "../../assets/images/Users_Group.png";

import email from "../../assets/images/social.png";
import phone from "../../assets/images/social (1).png";

import youtube from "../../assets/images/instagram.png";
import linked from "../../assets/images/linkedin.png";
import facebook from "../../assets/images/Vector (1).png";
import { Menu, X } from "lucide-react";
import NavbarMenu from "../../webapp/NavBarMenu";
import FooterComponent from "../../webapp/footer";

const Payment = () => {
  const auth = useAuth();
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
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
  const notify = useRef<NotificationElement>();
  const schema = yup.object({}).required();
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
          const billing = JSON.parse(billing_string);
          let res = await ApiService.paySubscription(billing);
          setPaymentUrl(res.redirect_url);
        } else {
          throw Error("Failed");
        }
        setSuccess(true);
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        console.log(JSON.stringify(error));
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
      <div className="homeContainer">
        <NavbarMenu />

        <div>
          <div className="flex flex-col items-center justify-center p-5 bg-gray-100">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <img
                  src={logo} // Replace with the logo path
                  alt="Zemo Logo"
                  className="w-30 h-20"
                />
              </div>

              {/* Heading */}
              <h2 className="text-2xl font-bold text-center text-blue-500">
                Account Activation
              </h2>

              {/* Info Box */}
              <div className="p-4 mt-4 mb-6 text-orange-800 bg-orange-100 border border-orange-200 rounded">
                <p>
                  Thank you for choosing Elimurise, our accounts representative will
                  get in touch with you within 24 hours to activate your
                  account.
                </p>
              </div>

              {/* Instructions */}

              {/* OR Separator */}
              <div className="flex items-center mb-6">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="px-4 text-sm text-gray-500">OR</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>

              {/* Sign In */}
              <p className="text-center text-gray-700">
                Already activated account?{" "}
                <a
                  onClick={(event: any) => {
                    event.preventDefault();
                    navigate("/auth/login");
                  }}
                  className="font-medium text-blue-500 hover:underline cursor-pointer"
                >
                  Log In
                </a>
              </p>
            </div>

            {/* Footer */}
            <footer className="mt-6 text-sm text-gray-500">
              © 2024 Elimurise Software Solutions Limited. All Rights Reserved <br />
              Version 1.0.4
            </footer>
          </div>
        </div>
        <FooterComponent />
      </div>
    </>
  );
};

export default Payment;
