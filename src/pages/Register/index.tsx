import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { FormInput, FormSelect } from "../../base-components/Form";
import * as yup from "yup";
import { useAuth } from "../../contexts/Auth";
import * as ApiService from "../../services/auth";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Notification, { NotificationElement } from "../../base-components/Notification";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Building, 
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

const Register = () => {
  const auth = useAuth();
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({
    firstname: false,
    lastname: false,
    email: false,
    phone: false,
    school_name: false,
    password: false,
    confirmPassword: false
  });

  const navigate = useNavigate();
  const notify = useRef<NotificationElement>();

  const schema = yup
    .object({
      firstname: yup.string().required("First name is required"),
      lastname: yup.string().required("Last name is required"),
      email: yup.string().required("Email is required").email("Please enter a valid email"),
      phone: yup.string().required("Phone number is required"),
      school_name: yup.string().required("School name is required"),
      password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
      confirmPassword: yup.string()
        .required("Please confirm your password")
        .oneOf([yup.ref('password')], 'Passwords must match'),
    })
    .required();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const result = await trigger();
    
    if (result && !loading) {
      isLoading(true);
      try {
        // Simulate API call for registration
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSuccess(true);
        setMessage("Registration successful! Please check your email to verify your account.");
        notify.current?.showToast();
        
        // Redirect to login after successful registration
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
        
      } catch (error: any) {
        setSuccess(false);
        setMessage(error.response?.data?.message || "Registration failed. Please try again.");
        notify.current?.showToast();
      } finally {
        isLoading(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
      icon: <Building className="w-6 h-6" />,
      title: "School Management",
      description: "Complete administrative tools for modern schools"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/auth/login" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Sign In
            </Link>
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mr-3">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Elimurise</h1>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600">
              Join hundreds of schools already using Elimurise
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <FormInput
                      {...register("firstname")}
                      type="text"
                      placeholder="First name"
                      className={`pl-10 pr-4 py-3 w-full border-2 rounded-lg transition-all ${
                        isFocused.firstname 
                          ? "border-primary ring-2 ring-primary/20" 
                          : "border-gray-200 focus:border-primary"
                      } ${errors.firstname ? "border-red-500" : ""}`}
                      onFocus={() => setIsFocused({ ...isFocused, firstname: true })}
                      onBlur={() => setIsFocused({ ...isFocused, firstname: false })}
                    />
                  </div>
                  {errors.firstname && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.firstname.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <FormInput
                      {...register("lastname")}
                      type="text"
                      placeholder="Last name"
                      className={`pl-10 pr-4 py-3 w-full border-2 rounded-lg transition-all ${
                        isFocused.lastname 
                          ? "border-primary ring-2 ring-primary/20" 
                          : "border-gray-200 focus:border-primary"
                      } ${errors.lastname ? "border-red-500" : ""}`}
                      onFocus={() => setIsFocused({ ...isFocused, lastname: true })}
                      onBlur={() => setIsFocused({ ...isFocused, lastname: false })}
                    />
                  </div>
                  {errors.lastname && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.lastname.message}
                    </p>
                  )}
                </div>
              </div>

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

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <FormInput
                    {...register("phone")}
                    type="tel"
                    placeholder="Enter your phone number"
                    className={`pl-10 pr-4 py-3 w-full border-2 rounded-lg transition-all ${
                      isFocused.phone 
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-gray-200 focus:border-primary"
                    } ${errors.phone ? "border-red-500" : ""}`}
                    onFocus={() => setIsFocused({ ...isFocused, phone: true })}
                    onBlur={() => setIsFocused({ ...isFocused, phone: false })}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* School Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <FormInput
                    {...register("school_name")}
                    type="text"
                    placeholder="Enter your school name"
                    className={`pl-10 pr-4 py-3 w-full border-2 rounded-lg transition-all ${
                      isFocused.school_name 
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-gray-200 focus:border-primary"
                    } ${errors.school_name ? "border-red-500" : ""}`}
                    onFocus={() => setIsFocused({ ...isFocused, school_name: true })}
                    onBlur={() => setIsFocused({ ...isFocused, school_name: false })}
                  />
                </div>
                {errors.school_name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.school_name.message}
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
                    placeholder="Create a password"
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

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <FormInput
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className={`pl-10 pr-12 py-3 w-full border-2 rounded-lg transition-all ${
                      isFocused.confirmPassword 
                        ? "border-primary ring-2 ring-primary/20" 
                        : "border-gray-200 focus:border-primary"
                    } ${errors.confirmPassword ? "border-red-500" : ""}`}
                    onFocus={() => setIsFocused({ ...isFocused, confirmPassword: true })}
                    onBlur={() => setIsFocused({ ...isFocused, confirmPassword: false })}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label className="ml-2 text-sm text-gray-700">
                  I agree to the{" "}
                  <a href="/terms" className="text-primary hover:text-primary/80 font-medium">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/policy" className="text-primary hover:text-primary/80 font-medium">
                    Privacy Policy
                  </a>
                </label>
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Create Account
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
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <Link
                to="/auth/login"
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
              >
                Sign in to your account
                <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
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
              Join the Future of Education
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Start your journey with Elimurise and transform how you manage your school.
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

            {/* Benefits */}
            <div className="mt-12 bg-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4">Why Choose Elimurise?</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                  <span>Free 30-day trial</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                  <span>24/7 customer support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-300 mr-3" />
                  <span>Cancel anytime</span>
                </div>
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

export default Register;
