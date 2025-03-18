import { useState, useEffect, useRef } from "react";
import Button from "../../base-components/Button";
import { FormSelect, FormLabel, FormInput } from "../../base-components/Form";
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

function Settings() {
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [terms, setTerms] = useState<any[]>([]); // Assuming terms come from API
  const [schoolDetails, setSchoolDetails] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const notify = useRef<NotificationElement>();

  const schema = yup
    .object({
      name: yup.string().required("School Name is required"),
      address: yup.string().required("Address is required"),
      school_head_teacher: yup
        .string()
        .required("Head Teacher Name is required"),
      current_session: yup.string().required("Current Session is required"),
    })
    .required();

  const {
    control,
    register,
    trigger,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const fetchData = async () => {
      setPageLoading(true);
      await Promise.all([getSchoolDetails(), getTerms()]);
      setPageLoading(false);
    };
    fetchData();
  }, []);

  const generateAcademicYears = (currentYear: number) => {
    const yearsBack = 5;
    const yearsForward = 7;
    const years = Array.from(
      { length: yearsBack + yearsForward + 1 },
      (_, i) => `${currentYear - yearsBack + i}`
    );
    setAcademicYears(years);
  };

  const getSchoolDetails = async () => {
    try {
      const response = await ApiService.getSchoolDetails({ page: 1 });
      const data = response?.data || {};
      setSchoolDetails(data);
      reset({
        name: data.name || "",
        schoolCode: data.schoolCode || "",
        current_session: data.current_session || "",
        current_term: data.current_term || "",
        address: data.address || "",
        school_head_teacher: data.school_head_teacher || "",
        primaryColor: data.primaryColor || "#6366f1", // Default indigo
        secondaryColor: data.secondaryColor || "#10b981", // Default green
        summative_has_score: data.summative_has_score || false,
        logo: data.logo || "",
        school_stamp: data.school_stamp || "",
        school_head_teacher_signature: data.school_head_teacher_signature || "",
      });
      generateAcademicYears(
        Number(data.current_session) || new Date().getFullYear()
      );
    } catch (error) {
      console.error("Failed to fetch school details:", error);
    }
  };

  const getTerms = async () => {
    try {
      const response = await ApiService.getTerms({ page: 1 }); // Assuming an API endpoint exists
      setTerms(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch terms:", error);
      setTerms([
        { _id: "1", name: "Term 1" },
        { _id: "2", name: "Term 2" },
        { _id: "3", name: "Term 3" },
      ]); // Fallback terms if API fails
    }
  };

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
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
        window.location.reload(); // Consider removing if not critical
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-darkmode-900 dark:to-darkmode-800 p-6 xl:p-8">
      <div className=" mx-auto bg-white dark:bg-darkmode-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            <Lucide icon="Settings" className="w-6 h-6 mr-2 text-indigo-600" />
            School Settings
          </h2>

          {pageLoading ? (
            <CardLoader />
          ) : (
            <form onSubmit={onSubmit} className="space-y-8">
              {/* School Details */}
              <fieldset className="bg-gray-50 dark:bg-darkmode-600 rounded-xl p-6 shadow-inner">
                <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                  School Details
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      School Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("name")}
                      type="text"
                      className={`w-full px-4 py-2 bg-white dark:bg-darkmode-600 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                        errors.name
                          ? "border-red-500"
                          : "border-gray-300 dark:border-darkmode-500"
                      }`}
                      placeholder="Enter school name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      School Code
                    </FormLabel>
                    <FormInput
                      {...register("schoolCode")}
                      type="text"
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-darkmode-500 border border-gray-300 dark:border-darkmode-500 rounded-lg text-gray-500 dark:text-gray-400"
                      placeholder="School Code"
                    />
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Session <span className="text-red-500">*</span>
                    </FormLabel>
                    <Controller
                      control={control}
                      name="current_session"
                      render={({ field }) => (
                        <TomSelect
                          {...field}
                          onChange={(value) => field.onChange(value)}
                          className={`w-full ${
                            errors.current_session ? "border-red-500" : ""
                          }`}
                        >
                          <option value="">Select Session</option>
                          {academicYears.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </TomSelect>
                      )}
                    />
                    {errors.current_session && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.current_session.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Term
                    </FormLabel>
                    <FormSelect
                      {...register("current_term")}
                      className="w-full px-4 py-2 bg-white dark:bg-darkmode-600 border border-gray-300 dark:border-darkmode-500 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      <option value="">Select Term</option>
                      {terms.map((term) => (
                        <option key={term._id} value={term._id}>
                          {term.name}
                        </option>
                      ))}
                    </FormSelect>
                  </div>
                  <div className="md:col-span-2">
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("address")}
                      type="text"
                      className={`w-full px-4 py-2 bg-white dark:bg-darkmode-600 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                        errors.address
                          ? "border-red-500"
                          : "border-gray-300 dark:border-darkmode-500"
                      }`}
                      placeholder="Enter school address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Head Teacher Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("school_head_teacher")}
                      type="text"
                      className={`w-full px-4 py-2 bg-white dark:bg-darkmode-600 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                        errors.school_head_teacher
                          ? "border-red-500"
                          : "border-gray-300 dark:border-darkmode-500"
                      }`}
                      placeholder="Enter head teacher name"
                    />
                    {errors.school_head_teacher && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.school_head_teacher.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Head Teacher Signature
                    </FormLabel>
                    <PassportUpload
                      name="school_head_teacher_signature"
                      register={register}
                      errors={errors}
                      initialImageUrl={
                        IMG_URL + schoolDetails.school_head_teacher_signature
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Branding */}
              <fieldset className="bg-gray-50 dark:bg-darkmode-600 rounded-xl p-6 shadow-inner">
                <legend className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
                  Branding
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Primary Color
                    </FormLabel>
                    <input
                      type="color"
                      {...register("primaryColor")}
                      className="w-full h-12 border border-gray-300 dark:border-darkmode-500 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
                    />
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Secondary Color
                    </FormLabel>
                    <input
                      type="color"
                      {...register("secondaryColor")}
                      className="w-full h-12 border border-gray-300 dark:border-darkmode-500 rounded-lg cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
                    />
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      School Logo
                    </FormLabel>
                    <PassportUpload
                      name="logo"
                      register={register}
                      errors={errors}
                      initialImageUrl={IMG_URL + schoolDetails.logo}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      School Stamp
                    </FormLabel>
                    <PassportUpload
                      name="school_stamp"
                      register={register}
                      errors={errors}
                      initialImageUrl={IMG_URL + schoolDetails.school_stamp}
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center">
                    <FormInput
                      {...register("summative_has_score")}
                      type="checkbox"
                      className="w-5 h-5 text-indigo-600 border-gray-300 dark:border-darkmode-500 rounded focus:ring-indigo-500 mr-3"
                    />
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Summative Report With Score (Not Recommended)
                    </FormLabel>
                  </div>
                </div>
              </fieldset>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md flex items-center transition-all duration-200"
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
                    "Save Settings"
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

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
          className={`w-6 h-6 ${success ? "text-green-500" : "text-red-500"}`}
        />
        <div className="ml-3">
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
