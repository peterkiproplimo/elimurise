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
import { formatCurrency } from "../../utils/helper";
import { Controller } from "react-hook-form";
import TomSelect from "../../base-components/TomSelect";
interface County {
  name: string;
  capital: string;
  code: number;
  sub_counties: string[];
}

const Register: React.FC<{ setCurrentStep: (step: number) => void }> = ({
  setCurrentStep,
}) => {
  const auth = useAuth();
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [numberOfLearners, setNumberOfLearners] = useState("");
  const [selectedCounty, setSelectedCounty] = useState<any>({});
  const [subCounties, setSubCounties] = useState([]);
  const [counties, setCounties] = useState<County[]>([]); // List<County>
  let county_list: County[] = [];
  const navigate = useNavigate();
  const [Package, setPackage] = useState<any>(
    JSON.parse(localStorage.getItem("package") || "{}")
  );

  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      name: yup.string().required("School Name is required"),
      county: yup.string().required("County is required"),
      subcounty: yup.string().required("Sub County is required"),
      address: yup.string().required("Address is required"),
      academic_year: yup.string().required("Academic year is required"),
      // email: yup.string().required().email(),
      // password: yup.string().required().min(4),
    })
    .required();

  const {
    control,
    register,
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
      isLoading(false);
      try {
        const data = await getValues();
        data.numberOfLearners = numberOfLearners;
        data.packageId = Package._id;

        console.log(data);
        // return;
        let res = await ApiService.createSubscription(data);
        localStorage.setItem("billing", JSON.stringify(res.data));
        // localStorage.setItem("billing", numberOfLearners);
        // localStorage.setItem("user_id", res.data.user._id);
        isLoading(false);
        setCurrentStep(4);

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
      <div className="p-10">
        {/* <Alert 
          variant="soft-danger" 
          className="flex items-center mb-2"
          dismissTimeout={9000}
        >
          <Lucide icon="AlertCircle" className="w-6 h-6 mr-2" /> {message}
        </Alert> */}
        <form
          className="validate-form bg-white mt-5 border border-gray-300 p-8 rounded-lg "
          onSubmit={onSubmit}
        >
          <div className="">
            <h2 className=" text-3xl font-bold ">Subscribe</h2>
            <h3 className=" text-2xl  ">
              You are about to subscribe to{" "}
              <span className="font-bold">{Package?.name} </span>Cost{" "}
              <span className="font-bold">
                KSH. {Package?.pricePerLearner}/Learner
              </span>
            </h3>
            {/* <p className="mt-5 text-xl">
              Please provide the following details:
            </p> */}
            <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-2 mt-8 ">
              <div>
                <FormLabel htmlFor="modal-form-1" className="font-bold">
                  School Name
                </FormLabel>
                <FormInput
                  {...register("name")}
                  type="text"
                  name="name"
                  className={errors.name ? "border-danger" : ""}
                  placeholder="St.Marys"
                />
                <FormLabel htmlFor="modal-form-1" className="">
                  Official school name to appear in reports
                </FormLabel>
                {errors.name && (
                  <div className="mt-2 text-danger">
                    {typeof errors.name.message === "string" &&
                      errors.name.message}
                  </div>
                )}
              </div>

              <div>
                <FormLabel htmlFor="county" className="font-bold">
                  County
                </FormLabel>
                <Controller
                  control={control}
                  name="county"
                  defaultValue=""
                  render={({ field }) => (
                    <TomSelect
                      {...field}
                      // options={counties.map((county: any) => ({
                      //   value: county.name,
                      //   label: county.name,
                      // }))}
                      onChange={(value: any) => {
                        console.log(value);
                        field.onChange(value);
                        handleCountyChange(value);
                      }}
                      className={errors.county ? "border-danger" : ""}
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
                <FormLabel htmlFor="subcounty" className="font-bold">
                  Sub County
                </FormLabel>
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
                      className={errors.subcounty ? "border-danger" : ""}
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
              <div>
                <FormLabel htmlFor="modal-form-1" className="font-bold">
                  Contact Address
                </FormLabel>
                <FormInput
                  {...register("address")}
                  type="text"
                  name="address"
                  className={errors.address ? "border-danger" : ""}
                  placeholder="Address"
                />
                <FormLabel htmlFor="modal-form-1" className="">
                  eg. Elimurise | Elimurise@gmail.com | +2547273.... |
                </FormLabel>
                {errors.address && (
                  <div className="mt-2 text-danger">
                    {typeof errors.address.message === "string" &&
                      errors.address.message}
                  </div>
                )}
              </div>
              <div>
                <FormLabel htmlFor="modal-form-1" className="font-bold">
                  Current Academic Year
                </FormLabel>
                <FormInput
                  {...register("academic_year")}
                  type="text"
                  name="academic_year"
                  className={errors.academic_year ? "border-danger" : ""}
                  placeholder="Academic Year Name"
                />
                <FormLabel htmlFor="modal-form-1" className="">
                  eg. 2024
                </FormLabel>
                {errors.academic_year && (
                  <div className="mt-2 text-danger">
                    {typeof errors.academic_year.message === "string" &&
                      errors.academic_year.message}
                  </div>
                )}
              </div>

              <div>
                <FormLabel htmlFor="modal-form-1" className="font-bold">
                  Number of Learners
                </FormLabel>
                <FormInput
                  // {...register("numberOfLearners", {
                  //   onChange: (e) => setNumberOfLearners(e.target.value),
                  //   onBlur: (e) => setNumberOfLearners(e.target.value),
                  // })}
                  type="number"
                  onChange={(e) => setNumberOfLearners(e.target.value)}
                  value={numberOfLearners}
                  name="numberOfLearners"
                  className={errors.numberOfLearners ? "border-danger" : ""}
                  placeholder="Number Of Learners"
                />
                <FormLabel htmlFor="modal-form-1" className="">
                  Number of learners the system will charge
                </FormLabel>
                {errors.lastName && (
                  <div className="mt-2 text-danger">
                    {typeof errors.lastName.message === "string" &&
                      errors.lastName.message}
                  </div>
                )}
              </div>
              <div>
                <FormLabel htmlFor="modal-form-1" className="font-bold">
                  Total Bill
                </FormLabel>
                <FormInput
                  {...register("numberOfLearners")}
                  type="text"
                  value={`KSH. ${formatCurrency(
                    Number(numberOfLearners) * Number(Package.pricePerLearner)
                  )}`}
                  disabled
                  name="numberOfLearners"
                  className={errors.lastName ? "border-danger" : ""}
                  placeholder="Number Of Learners"
                />
                <FormLabel htmlFor="modal-form-1" className="">
                  Total Computed bill
                </FormLabel>
                {errors.lastName && (
                  <div className="mt-2 text-danger">
                    {typeof errors.lastName.message === "string" &&
                      errors.lastName.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* <div className="flex mt-4 text-xs  text-slate-600 dark:text-slate-500 sm:text-sm">
            <div className="flex items-center mr-auto">
              <FormCheck.Input
                id="remember-me"
                type="checkbox"
                className="mr-2 border "
              />
              <label
                className="cursor-pointer select-none"
                htmlFor="remember-me"
              >
                Remember me
              </label>
            </div>
            <Link to="/auth/forgot-password">Forgot Password?</Link>
          </div> */}
          <div className="mt-5 flex justify-end xl:mt-8 xl:text-left">
            <Button
              onClick={() => setCurrentStep(2)}
              variant="secondary"
              className="w-[200px] px-4 py-3 align-top xl:w-22 xl:mr-3 "
            >
              Back
              {loading && (
                <LoadingIcon
                  icon="spinning-circles"
                  color="white"
                  className="w-2 h-4 ml-2"
                />
              )}
            </Button>
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
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
