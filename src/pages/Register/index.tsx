import React, { useState, useRef, useEffect, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import {
  FormInput,
  FormCheck,
  FormSelect,
  FormLabel,
} from "../../base-components/Form";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../contexts/Auth";
import * as ApiService from "../../services/auth";
import { Link } from "react-router-dom";
import TomSelect from "../../base-components/TomSelect";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Menu, X } from "lucide-react";
import NavbarMenu from "../../webapp/NavBarMenu";
import FooterComponent from "../../webapp/footer";
import { Controller } from "react-hook-form";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import Lucide from "../../base-components/Lucide";
import ScaleLoader from "react-spinners/ScaleLoader";

interface County {
  name: string;
  capital: string;
  code: number;
  sub_counties: string[];
}

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Register = () => {
  const auth = useAuth();
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [numberOfLearners, setNumberOfLearners] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<any>({});
  const [subCounties, setSubCounties] = useState([]);
  const [counties, setCounties] = useState<County[]>([]); // List<County>
  const [accountReg, setAccountReg] = useState(false); // List<County>

  let county_list: County[] = [];
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null); // State to track selected package

  const handleSelectPlan = (selectedPackageId: string) => {
    setValue("plan", selectedPackageId);

    setSelectedPackage(selectedPackageId); // Update the selected package
  };

  const navigate = useNavigate();
  const [Package, setPackage] = useState<any>(
    JSON.parse(localStorage.getItem("package") || "{}")
  );
  const [packages, setPackages] = useState([]);
  const [selectedPackages, setSelectedPackages] = React.useState([]);

  const getDashboard = async () => {
    isLoading(true);
    try {
      let res = await ApiService.getPackages({});
      setPackages(res.data);
    } catch (error) {
      console.log(error);
    }
    isLoading(false);
    // setFeeds(res.feeds);
    // setEvents(res.events);
    // setQuestions(res.questions);
  };
  useEffect(() => {
    getDashboard();
  }, []);
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      firstname: yup.string().required("First name is required"),
      lastname: yup.string().required("Last name is required"),
      phone: yup.string().required("Phone is required"),
      email: yup.string().required("Email is required").email(),
      password: yup.string().required("Password is required").min(4),
      school_name: yup.string().required("School Name is required"),
      plan: yup.string().required("Plan is required"),
      total_learners: yup
        .string()
        .required("Total number of learners is required"),
      county: yup.string().required("County is required"),
      subcounty: yup.string().required("Subcounty is required"),
    })
    .required();

  const {
    control,
    register,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    const getCounties = async () => {
      const counties = await ApiService.getCounties({});
      const data = await counties.data;
      setCounties(data);
      localStorage.setItem("counties", JSON.stringify(data));
    };

    getCounties();
    console.log(county_list);
  }, []);
  const handleCountyChange = (countyName: any) => {
    setSelectedCounty(countyName);
    const counties = localStorage.getItem("counties") || "{}";
    const county_list = JSON.parse(counties);
    // Find the selected county in the counties array
    const selected = county_list.find(
      (county: any) => county.name === countyName
    );

    console.log("updated", selected);

    // Update subCounties based on the selected county
    if (selected) {
      setSubCounties(selected.sub_counties);
    } else {
      setSubCounties([]);
    }
  };

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();

    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        data.packageId = selectedPackage;

        console.log(data);
        // return;
        let res = await ApiService.createSubscription(data);
        // localStorage.setItem("billing", numberOfLearners);
        // localStorage.setItem("user_id", res.data.user._id);
        isLoading(false);

        setSuccess(true);
        setMessage("Registration successfully");
        notify.current?.showToast();
        navigate("/payment");

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
  let [color, setColor] = useState("rgb(21 34 89 / var(--tw-bg-opacity))");

  return (
    <>
      {loading ? (
        <div className="fixed inset-0 bg-black bg-opacity-5 flex justify-center items-center z-50">
          <ScaleLoader
            color={color}
            loading={loading}
            width={20}
            height={100}
            radius={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        ""
      )}
      <div className="homeContainer">
        <NavbarMenu />

        <div className="xl:mx-auto mt-2 max-w-[1500px] bg-white p-2">
          <h1 className="xl:text-5xl text-2xl text-center font-semibold  text-primary w-full">
            Get A Quote
          </h1>
          <p className="text-primary text-center text-md xl:text-2xl  p-4">
            Subscription types grant access to all of Hero Learning's platform
            features, including:
          </p>
          <div className="grid xl:mt-10 xl:ml-10 xl:mr-10 overflow-hidden rounded-3xl sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* First List Item */}
            <div className="flex flex-1 xl:text-2xl items-center p-4 bg-white ">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-primary w-8 h-8 xl:w-10 xl:h-10 mr-2"
              />
              <div>
                <h1 className="text-primary font-bold ">Analytics & Data</h1>
                <p>To monitor student progress in assignments and reading.</p>
              </div>{" "}
            </div>

            {/* Second List Item */}
            <div className="flex flex-1 xl:text-2xl items-center p-4 bg-white ">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-primary w-8 h-8 xl:w-10 xl:h-10 mr-2"
              />
              <div>
                <h1 className="text-primary font-bold">
                  Unlimited Teacher Accounts{" "}
                </h1>
                <p>For seamless collaboration and resource sharing.</p>
              </div>
            </div>

            {/* Third List Item */}
            <div className="flex flex-1 xl:text-2xl items-center p-4 bg-white rounded-lg shadow-md">
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-primary w-8 h-8 xl:w-10 xl:h-10 mr-2"
              />
              <div>
                <h1 className="text-primary font-bold">
                  {" "}
                  Dedicated Account Manager{" "}
                </h1>
                <p> For consistent support and guidance.</p>
              </div>
            </div>
          </div>

          <form className="validate-form" onSubmit={onSubmit}>
            <div className=" bg-white xl:p-10 m-5 box border border-gray-300">
              <p className="mt-5 xl:text-2xl text-xl text-primary font-bold">
                <div className="flex flex-1 xl:text-2xl items-center  bg-white ">
                  <div>
                    <h1 className="text-primary font-bold ">
                      Personal Information:
                    </h1>
                  </div>{" "}
                </div>
              </p>
              <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-5 ">
                <div className="input-form">
                  <FormInput
                    {...register("firstname")}
                    id="validation-form-2"
                    type="text"
                    name="firstname"
                    className={
                      errors.firstname
                        ? "px-4 py-3 xl:mt-4  min-w-full  border-danger"
                        : "py-3  xl:mt-4 mt-2 min-w-full  border-gray-300"
                    }
                    placeholder="First Name*"
                  />
                  {errors.firstname && (
                    <div className="mt-2 text-danger">
                      {typeof errors.firstname.message === "string" &&
                        errors.firstname.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <FormInput
                    {...register("lastname")}
                    id="validation-form-2"
                    type="text"
                    name="lastname"
                    className={
                      errors.lastname
                        ? "p-3xl:mt-4 py-2 min-w-full  border-danger"
                        : "p-3  xl:mt-4 mt-2 min-w-full  border-gray-300"
                    }
                    placeholder="Last Name*"
                  />
                  {errors.lastname && (
                    <div className="mt-2 text-danger">
                      {typeof errors.lastname.message === "string" &&
                        errors.lastname.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <FormInput
                    {...register("email")}
                    id="validation-form-2"
                    type="email"
                    name="email"
                    className={
                      errors.email
                        ? "p-3xl:mt-4 py-2 min-w-full  border-danger"
                        : "p-3  xl:mt-4 mt-2 min-w-full  border-gray-300"
                    }
                    placeholder="Email Address *"
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
                    {...register("phone")}
                    id="validation-form-2"
                    type="tel"
                    name="phone"
                    className={
                      errors.phone
                        ? "p-3xl:mt-4 py-2 min-w-full  border-danger"
                        : "p-3  xl:mt-4 mt-2 min-w-full  border-gray-300"
                    }
                    placeholder="Phone Number *"
                  />

                  {errors.phone && (
                    <div className="mt-2 text-danger">
                      {typeof errors.phone.message === "string" &&
                        errors.phone.message}
                    </div>
                  )}
                </div>
                <div className="input-form">
                  <div className="flex items-center">
                    <FormInput
                      {...register("password")}
                      id="validation-form-3"
                      type={"password"}
                      name="password"
                      className={
                        errors.password
                          ? "p-3xl:mt-4 py-2 min-w-full  border-danger"
                          : "p-3  xl:mt-4 mt-2 min-w-full  border-gray-300"
                      }
                      placeholder="Password*"
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
                  <div className="flex items-center">
                    <FormInput
                      {...register("confirm_password", {
                        required: "Confirm Password is required",
                      })}
                      id="validation-form-3"
                      type="password"
                      name="confirm_password"
                      className={
                        errors.password
                          ? "p-3xl:mt-4 py-2 min-w-full  border-danger"
                          : "p-3  xl:mt-4 mt-2 min-w-full  border-gray-300"
                      }
                      placeholder="Confirm Password*"
                    />
                  </div>
                </div>
              </div>
              {/* 
                      <div className="mt-5 flex  xl:mt-8 xl:text-left">
                        <Button
                          variant="primary"
                          className="text-md w-[92px] xl:text-lg xl:w-[192px] p-2 h-[40px] px-3 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border "
                        >
                          Save
                          {loading && (
                            <LoadingIcon
                              icon="spinning-circles"
                              color="white"
                              className="w-2 h-4 ml-2"
                            />
                          )}
                        </Button>
                      </div> */}
            </div>
            <div className=" bg-white xl:p-10 m-5 box border border-gray-300">
              {/* <form
                      className="validate-form bg-white xl:p-10 m-5 xl:box xl:border xl:border-gray-300"
                      onSubmit={onSubmit}
                    > */}
              <div className="flex flex-1 xl:text-2xl items-center  bg-white ">
                <div>
                  <h1 className="text-primary font-bold ">
                    School Information:
                  </h1>
                </div>
              </div>

              <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-2  ">
                <div className="input-form">
                  <FormInput
                    {...register("school_name")}
                    id="validation-form-2"
                    type="text"
                    name="school_name"
                    className={
                      errors.firstname
                        ? " px-4 p-3 xl:mt-4  min-w-full  border-danger"
                        : " px-4 p-3  xl:mt-4 mt-2 min-w-full xl:p-4 border-gray-300 "
                    }
                    placeholder="School Name"
                  />
                  {errors.firstname && (
                    <div className="mt-2 text-danger">
                      {typeof errors.firstname.message === "string" &&
                        errors.firstname.message}
                    </div>
                  )}
                </div>

                <div>
                  <Controller
                    control={control}
                    name="county"
                    defaultValue=""
                    render={({ field }) => (
                      <TomSelect
                        {...field}
                        onChange={(value: any) => {
                          console.log(value);
                          field.onChange(value);
                          handleCountyChange(value);
                        }}
                        className={
                          errors.county
                            ? " px-4 p-3 xl:mt-4  min-w-full  border-danger"
                            : " px-4 py-2 xl:mt-4 mt-2 min-w-full  border-gray-300 "
                        }
                      >
                        <option value={""}>Select County</option>

                        {counties.map((county: any) => (
                          <option key={county.code} value={county.name}>
                            {county.name}
                          </option>
                        ))}
                      </TomSelect>
                    )}
                  />

                  {errors.county && (
                    <div className="mt-2 text-danger">
                      {typeof errors.county.message === "string" &&
                        errors.county.message}
                    </div>
                  )}
                </div>

                {/* Sub County Selection */}
                <div>
                  {/* <FormLabel htmlFor="subcounty" className="font-bold">
                            Sub County
                          </FormLabel> */}
                  <Controller
                    control={control}
                    name="subcounty"
                    defaultValue=""
                    render={({ field }) => (
                      <TomSelect
                        {...field}
                        // options={subCounties.map((subcounty: any) => ({
                        //   value: subcounty,
                        //   label: subcounty,
                        // }))}
                        className={
                          errors.subcounty
                            ? "p-3xl:mt-4 py-2 min-w-full  border-danger"
                            : "py-2 xl:mt-4 mt-2 min-w-full  border-gray-300"
                        }
                      >
                        <option value={""}>Select Subcounty</option>
                        {subCounties.map((subcounty: any, key: any) => (
                          <option key={key} value={subcounty}>
                            {subcounty}
                          </option>
                        ))}
                      </TomSelect>
                    )}
                  />

                  {errors.subcounty && (
                    <div className="mt-2 text-danger">
                      {typeof errors.subcounty.message === "string" &&
                        errors.subcounty.message}
                    </div>
                  )}
                </div>

                <div className="input-form">
                  <div className="flex items-center">
                    <FormInput
                      {...register("total_learners", {
                        required: "Total number of learners is required",
                      })}
                      id="validation-form-3"
                      type="number"
                      name="total_learners"
                      className={
                        errors.password
                          ? "p-3xl:mt-4 py-2 min-w-full  border-danger"
                          : "p-3 xl:mt-4 mt-2 min-w-full  border-gray-300"
                      }
                      placeholder="Number Of Learners*"
                    />
                  </div>
                </div>
                <div className="input-form">
                  <div className="flex items-center">
                    <FormSelect
                      id="validation-form-2"
                      {...register("county", {
                        required: "County is required",
                      })}
                      name="county"
                      className="block px-4  py-3 xl:mt-4  mt-2 min-w-full text-[#808080] xl:min-w-[350px] w-full rounded-none border-gray-300"
                      defaultValue=""
                    >
                      <option value="" className="text-primary">
                        Choose A period *
                      </option>
                      <option value="termly">Termly</option>
                      <option value="yearly">Yearly</option>
                      {/* <option value="option3">Option 3</option> */}
                    </FormSelect>
                  </div>
                </div>
                {/* <div className="input-form">
                    <div className="flex items-center">
                      <FormInput
                        {...register("total_bill")}
                        id="validation-form-3"
                        type="text"
                        name="total_bill"
                        className={
                          errors.password
                            ? "p-3xl:mt-4 py-2 min-w-full  border-danger"
                            : "p-3  xl:mt-4 mt-2 min-w-full  border-gray-300"
                        }
                        placeholder="Total Bill.VAT Inclusive"
                      />
                    </div>
                  </div> */}
              </div>
              <div className="flex items-center mr-auto ml-2 mt-3">
                <FormCheck.Input
                  id="remember-me"
                  type="checkbox"
                  className="mr-2 border-gray-300"
                />
                <label
                  className="cursor-pointer select-none text-[#808080]"
                  htmlFor="remember-me"
                >
                  You agree to our friendly
                  <Link
                    to="/policy"
                    className="font-bold ml-1.5 mr-1.5 text-primary "
                  >
                    privacy policy
                  </Link>
                  and
                  <Link to="/policy" className="font-bold ml-1.5 text-primary ">
                    Terms of Use
                  </Link>
                </label>
              </div>
            </div>

            <div className=" bg-white xl:p-10 m-5 box border border-gray-300">
              <div className="flex flex-1 xl:text-2xl items-center  bg-white ">
                {/* <FontAwesomeIcon
                icon={faCircleCheck}
                className="text-primary w-8 h-8 xl:w-10 xl:h-10 mr-2"
              /> */}
                <div>
                  <h1 className="text-primary font-bold ">Choose a plan</h1>
                  {errors.plan && (
                    <div className="mt-2 text-danger">
                      {typeof errors.plan.message === "string" &&
                        errors.plan.message}
                    </div>
                  )}
                </div>{" "}
              </div>

              <div className="grid overflow-hidden gap-5 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3  xl:grid-cols-3 mt-2">
                <div className="group relative border rounded-xl p-4 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
                  <div className="contents">
                    <Button
                      variant="primary"
                      className="text-dark bg-[#F1F1F1] xl:text-lg w-[220px] p-2 h-[40px] mb-2 gap-2 border-none"
                    >
                      EVIDENCE OF LEARNING
                      {loading && (
                        <LoadingIcon
                          icon="spinning-circles"
                          color="white"
                          className="w-4 h-4 ml-2"
                        />
                      )}
                    </Button>
                    <p className="mt-5 xl:text-lg sm:text-lg md:text-lg text-primary">
                      You get access to hard copy assessment tool books for all
                      grades. Charges per book:
                    </p>
                    <Button
                      variant="primary"
                      className="text-md xl:text-lg w-full mt-5 p-2 h-[40px] px-3 gap-2  border "
                    >
                      Add to Cart
                      {loading && (
                        <LoadingIcon
                          icon="spinning-circles"
                          color="white"
                          className="w-4 h-4 ml-2"
                        />
                      )}
                    </Button>
                  </div>
                  <div>
                    <div className="border-b border-primary/50 w-full mt-8"></div>

                    <p className="mt-5 xl:text-lg sm:text-lg md:text-lg text-primary">
                      PreSchool
                    </p>
                    <h1 className="xl:text-5xl text-2xl font-medium">
                      KES 250
                    </h1>
                  </div>
                </div>

                {packages.map((Package: any, key: any) => (
                  <>
                    <div className="group relative border rounded-xl p-4 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
                      <div className="contents">
                        <Button
                          variant="primary"
                          className="text-dark bg-[#F1F1F1] xl:text-lg w-[220px] p-2 h-[40px] mb-2 gap-2 border-none"
                        >
                          BASIC PLAN
                          {loading && (
                            <LoadingIcon
                              icon="spinning-circles"
                              color="white"
                              className="w-4 h-4 ml-2"
                            />
                          )}
                        </Button>
                        <div>
                          <div className="border-b border-primary/50 w-full mt-8"></div>

                          <h1 className="mt-5 xl:text-7xl text-2xl font-medium">
                            KES {Package.pricePerLearner}
                          </h1>
                          <p className=" xl:text-lg sm:text-lg md:text-lg text-primary">
                            Per Learner, per Month
                          </p>

                          <div className="border-b border-primary/50 w-full mt-8"></div>
                        </div>{" "}
                        <Button
                          type="button"
                          variant={
                            selectedPackage === Package._id
                              ? "success"
                              : "primary"
                          }
                          className={`text-md xl:text-lg w-full mt-5 p-2 h-[40px] px-3 gap-2 border ${
                            selectedPackage === Package._id
                              ? "bg-green-500 text-white"
                              : ""
                          }`}
                          onClick={() => handleSelectPlan(Package._id)}
                        >
                          {selectedPackage === Package._id
                            ? "Plan Selected"
                            : "Choose Plan"}
                          {loading && (
                            <LoadingIcon
                              icon="spinning-circles"
                              color="white"
                              className="w-4 h-4 ml-2"
                            />
                          )}
                        </Button>
                      </div>
                    </div>
                  </>
                ))}
              </div>
              <div className="mt-5  xl:mt-8 xl:text-left">
                {/* <Link to="/payment" className="xl:w-32 xl:mr-8"> */}
                <Button
                  variant="primary"
                  type="submit"
                  className="text-md xl:text-lg w-[292px] p-4 h-[40px] px-3 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border "
                >
                  Proceed
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-2 h-4 ml-2"
                    />
                  )}
                </Button>
                {/* </Link> */}
              </div>
            </div>
          </form>
        </div>
        <FooterComponent />
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
