import { useState, useEffect, useRef } from "react";
import Button from "../../base-components/Button";
import {
  FormSelect,
  FormLabel,
  FormInput,
  FormTextarea,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import * as ApiService from "../../services/auth";
import LoadingIcon from "../../base-components/LoadingIcon";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import PassportUpload from "../Learners/profilephoto";
import { IMG_URL } from "../../utils/constants";
import TomSelect from "../../base-components/TomSelect";
import { Controller } from "react-hook-form";
import CardLoader from "../UserProfile/loader";

// Updated FormData interface with school_motto
interface FormData {
  name: string;
  schoolCode?: string;
  current_session: string;
  current_term?: string;
  address: string;
  school_motto?: string;
  school_head_teacher: string;
  primaryColor?: string;
  secondaryColor?: string;
  summative_has_score?: boolean;
  summative_has_pos?: boolean;
  logo?: string;
  school_stamp?: string;
  school_head_teacher_signature?: string;
  signatory_role?: string;
  signatory_name?: string;
}

// Updated validation schema
const schema = yup
  .object({
    name: yup.string().required("School name is required"),
    address: yup.string().required("Address is required"),
    school_motto: yup
      .string()
      .max(200, "Motto should not exceed 200 characters"),
    current_session: yup.string().required("Academic session is required"),
    signatory_role: yup.string().required("Signatory role is required"),
    signatory_name: yup.string().required("Signatory name is required"),
  })
  .required();

function Settings() {
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [schoolDetails, setSchoolDetails] = useState<any>({});
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const notify = useRef<NotificationElement>(null);

  const signatoryRoles = [
    "Chief Principal",
    "Principal",
    "Head Teacher",
    "Deputy Principal",
    "Deputy Head Teacher",
    "School Administrator",
  ];

  const {
    control,
    register,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      await Promise.all([getSchoolDetails()]);
      setPageLoading(false);
    };
    fetchData();
  }, []);

  const generateAcademicYears = (currentYear: number) => {
    const yearsBack = 5;
    const yearsForward = 7;
    const years = [];
    for (
      let i = currentYear - yearsBack;
      i <= currentYear + yearsForward;
      i++
    ) {
      years.push(`${i}`);
    }
    setAcademicYears(years);
  };

  const getSchoolDetails = async () => {
    try {
      const response = await ApiService.getSchoolDetails({ page: 1 });
      const data = response?.data || {};
      setSchoolDetails(data);
      reset({
        ...data,
        school_motto: data?.school_motto || "",
        signatory_role: data?.signatory_role || "Head Teacher",
        signatory_name: data?.signatory_name,
        signatory_signature: data?.signatory_signature,
        current_term: data?.current_term,
        current_session: data?.current_session,
      });
      generateAcademicYears(Number(data?.current_session));
    } catch (error) {
      console.error("Failed to fetch school details", error);
    }
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      setLoading(true);
      try {
        const data = getValues();
        const response = await ApiService.setCurrentSettings(data);
        localStorage.setItem("school", JSON.stringify(response));
        setSuccess(true);
        setMessage("Settings updated successfully!");
        notify.current?.showToast();
      } catch (error) {
        console.error("Error updating settings:", error);
        setSuccess(false);
        setMessage("Failed to update settings. Please try again.");
        notify.current?.showToast();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 uppercase">
        School Settings
      </h2>

      {pageLoading ? (
        <CardLoader />
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <form onSubmit={onSubmit} className="space-y-8">
            {/* School Details Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 uppercase">
                School Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    School Name
                  </FormLabel>
                  <FormInput
                    {...register("name")}
                    type="text"
                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    placeholder="Enter school name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    School Code
                  </FormLabel>
                  <FormInput
                    {...register("schoolCode")}
                    type="text"
                    disabled
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white bg-gray-100 cursor-not-allowed"
                    placeholder="School Code"
                  />
                </div>
                <div>
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    Current Session
                  </FormLabel>
                  <Controller
                    control={control}
                    name="current_session"
                    render={({ field }) => (
                      <TomSelect
                        {...field}
                        onChange={(value) => field.onChange(value)}
                        className={`w-full rounded-md ${
                          errors.current_session ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">Select Session</option>
                        {academicYears.map((year, key) => (
                          <option key={key} value={year}>
                            {year}
                          </option>
                        ))}
                      </TomSelect>
                    )}
                  />
                  {errors.current_session && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.current_session.message}
                    </p>
                  )}
                </div>
                <div>
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    Address
                  </FormLabel>
                  <FormInput
                    {...register("address")}
                    type="text"
                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                      errors.address ? "border-red-500" : ""
                    }`}
                    placeholder="Enter school address"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
                <div>
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    School Motto
                  </FormLabel>
                  <FormTextarea
                    {...register("school_motto")}
                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                      errors.school_motto ? "border-red-500" : ""
                    }`}
                    placeholder="Enter school motto"
                    rows={3}
                  />
                  {errors.school_motto && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.school_motto.message}
                    </p>
                  )}
                </div>
                <div>
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    Signatory Role
                  </FormLabel>
                  <Controller
                    control={control}
                    name="signatory_role"
                    render={({ field }) => (
                      <TomSelect
                        {...field}
                        onChange={(value) => field.onChange(value)}
                        className={`w-full rounded-md ${
                          errors.signatory_role ? "border-red-500" : ""
                        }`}
                      >
                        {signatoryRoles.map((role, index) => (
                          <option key={index} value={role}>
                            {role}
                          </option>
                        ))}
                      </TomSelect>
                    )}
                  />
                  {errors.signatory_role && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.signatory_role.message}
                    </p>
                  )}
                </div>
                <div>
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    Signatory Name
                  </FormLabel>
                  <FormInput
                    {...register("signatory_name")}
                    type="text"
                    className={`w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                      errors.signatory_name ? "border-red-500" : ""
                    }`}
                    placeholder="Enter signatory name"
                  />
                  {errors.signatory_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.signatory_name.message}
                    </p>
                  )}
                </div>
                <div>
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    Signatory Signature
                  </FormLabel>
                  <PassportUpload
                    name="signatory_signature"
                    register={register}
                    errors={errors}
                    initialImageUrl={
                      IMG_URL +
                      (schoolDetails.signatory_signature ||
                        schoolDetails.school_head_teacher_signature)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Branding Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 uppercase">
                Branding
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    Primary Color
                  </FormLabel>
                  <input
                    type="color"
                    {...register("primaryColor")}
                    className="w-full h-12 rounded-md border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                </div>
                <div>
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    Secondary Color
                  </FormLabel>
                  <input
                    type="color"
                    {...register("secondaryColor")}
                    className="w-full h-12 rounded-md border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                </div>
                <div>
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    School Stamp
                  </FormLabel>
                  <PassportUpload
                    name="school_stamp"
                    register={register}
                    errors={errors}
                    initialImageUrl={IMG_URL + schoolDetails.school_stamp}
                  />
                </div>
                <div>
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    Logo
                  </FormLabel>
                  <PassportUpload
                    name="logo"
                    register={register}
                    errors={errors}
                    initialImageUrl={IMG_URL + schoolDetails.logo}
                  />
                </div>
              </div>
            </div>

            {/* Report Settings Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 uppercase">
                Report Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FormInput
                    {...register("summative_has_score")}
                    type="checkbox"
                    className="w-5 h-5 text-indigo-600 rounded mr-3"
                  />
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    Include Score in Summative Report
                  </FormLabel>
                </div>
                <div className="flex items-center">
                  <FormInput
                    {...register("summative_has_pos")}
                    type="checkbox"
                    className="w-5 h-5 text-indigo-600 rounded mr-3"
                  />
                  <FormLabel className="text-gray-600 dark:text-gray-300">
                    Include Position in Summative Report
                  </FormLabel>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md flex items-center transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoadingIcon
                      icon="spinning-circles"
                      className="w-4 h-4 mr-2"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Lucide icon="Save" className="w-5 h-5 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Notification */}
      <Notification
        options={{ duration: 3000 }}
        getRef={(el) => {
          notify.current = el;
        }}
        className="flex items-center p-4 rounded-lg shadow-lg"
      >
        <Lucide
          icon={success ? "CheckCircle" : "XCircle"}
          className={`w-6 h-6 ${
            success ? "text-green-500" : "text-red-500"
          } mr-3`}
        />
        <div>
          <div className="font-semibold text-gray-800 dark:text-white">
            {success ? "Success" : "Error"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {message}
          </div>
        </div>
      </Notification>
    </div>
  );
}

export default Settings;
