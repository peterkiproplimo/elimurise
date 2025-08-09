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
import { setSchool } from "../../utils/helper";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Shield, 
  CheckCircle,
  AlertCircle,
  BookOpen,
  GraduationCap,
  Users,
  BarChart3
} from "lucide-react";

const Login = () => {
  const auth = useAuth();
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedForm, setSelectedForm] = useState("form1");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });

  const navigate = useNavigate();
  const notify = useRef<NotificationElement>();

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
    localStorage.setItem("selectedForm", value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const schema = yup
    .object({
      email: yup.string().required("Email is required").email("Please enter a valid email"),
      password: yup.string().required("Password is required").min(4, "Password must be at least 4 characters"),
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
          setSchool(res.school);
          localStorage.setItem("type", "parent");
          await auth.signIn({ ...res.user, token });
          window.location.href = "/home";
        }
        
        setSuccess(true);
        setMessage("Login successful!");
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(error.response?.data?.message || "Login failed. Please try again.");
        notify.current?.showToast();
      }
    }
  };

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Comprehensive Assessment",
      description: "Advanced tools for student evaluation and progress tracking"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Parent Portal",
      description: "Real-time access to student progress and performance"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Data-driven insights for informed decision making"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Platform",
      description: "Enterprise-grade security with role-based access"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-3">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Elimurise</h1>
        </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your school management dashboard
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {/* User Type Selection */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Sign in as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative">
              <input
                type="radio"
                    name="userType"
                value="form1"
                checked={selectedForm === "form1"}
                onChange={handleFormChange}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedForm === "form1" 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedForm === "form1" 
                          ? "border-primary bg-primary" 
                          : "border-gray-300"
                      }`}>
                        {selectedForm === "form1" && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">School Staff</div>
                        <div className="text-sm text-gray-500">Teachers & Administrators</div>
                      </div>
                    </div>
                  </div>
            </label>

                <label className="relative">
              <input
                type="radio"
                    name="userType"
                value="form2"
                checked={selectedForm === "form2"}
                onChange={handleFormChange}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedForm === "form2" 
                      ? "border-primary bg-primary/5" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        selectedForm === "form2" 
                          ? "border-primary bg-primary" 
                          : "border-gray-300"
                      }`}>
                        {selectedForm === "form2" && (
                          <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Parent</div>
                        <div className="text-sm text-gray-500">Student Guardians</div>
                      </div>
                    </div>
                  </div>
            </label>
              </div>
          </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <FormInput
                {...register("email")}
                type="email"
                    placeholder="Enter your email"
                    className={`pl-10 pr-4 py-3 w-full border-2 rounded-lg transition-all ${
                      isFocused.email 
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-gray-200 focus:border-primary"
                    } ${errors.email ? "border-red-500" : ""}`}
                    onFocus={() => setIsFocused({ ...isFocused, email: true })}
                    onBlur={() => setIsFocused({ ...isFocused, email: false })}
                  />
                </div>
              {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email.message}
                </p>
              )}
            </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <FormInput
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`pl-10 pr-12 py-3 w-full border-2 rounded-lg transition-all ${
                      isFocused.password 
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-gray-200 focus:border-primary"
                    } ${errors.password ? "border-red-500" : ""}`}
                    onFocus={() => setIsFocused({ ...isFocused, password: true })}
                    onBlur={() => setIsFocused({ ...isFocused, password: false })}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <FormCheck
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <LoadingIcon icon="spinning-circles" className="w-5 h-5 mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to Elimurise?</span>
                </div>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <Link
                to="/register"
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
              >
                Create an account
                <CheckCircle className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Features & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 p-12">
        <div className="w-full max-w-lg mx-auto">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-8">
              Transform Your School with Modern Technology
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Join hundreds of schools already using Elimurise to improve their educational outcomes and streamline operations.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-white/20 rounded-lg p-3 mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-white/80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-white/80 text-sm">Schools</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-white/80 text-sm">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-white/80 text-sm">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      <Notification getRef={(el) => (notify.current = el)} />
    </div>
  );
};

export default Login;
