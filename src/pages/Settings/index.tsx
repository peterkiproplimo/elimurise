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

// Define the form data type based on the fields used
interface FormData {
  name: string;
  schoolCode?: string;
  current_session: string;
  current_term?: string;
  address: string;
  school_head_teacher: string;
  primaryColor?: string;
  secondaryColor?: string;
  summative_has_score?: boolean;
  summative_has_pos?: boolean;
  logo?: string;
  school_stamp?: string;
  school_head_teacher_signature?: string;
  signatory_role?: string; // Add this field to match the usage in the form
  signatory_name?: string; // Add this field to fix the error
}

function Settings() {
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [schoolDetails, setSchoolDetails] = useState<any>({});
  const signatoryRoles = [
    "Chief Principal",
    "Principal",
    "Head Teacher",
    "Deputy Principal",
    "Deputy Head Teacher",
    "School Administrator",
  ]; // Define signatory role options

  const schema = yup.object({}).required(); // No specific validation needed for these fields

  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const notify = useRef<NotificationElement>(null);

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

  const generateAcademicYears = (currentYear: any) => {
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
        ...response.data,
        signatory_role: response?.data?.signatory_role || "Head Teacher", // Default to "Head Teacher" if not present
        signatory_name: response?.data?.signatory_name, // Map existing head teacher name
        signatory_signature: response?.data?.signatory_signature, // Map existing signature
        current_term: response?.data?.current_term,
        current_session: response?.data?.current_session,
      });
      setPageLoading(false);
      generateAcademicYears(Number(response?.data?.current_session));
    } catch (error) {
      console.error("Failed to fetch school details", error);
    }
  };

  const onSubmit = async (event: any) => {
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
    <>
      <h2 className="mt-1 text-lg font-medium">Settings</h2>
      {pageLoading ? (
        <CardLoader />
      ) : (
        <div className="grid grid-cols-12 gap-6 mt-2 setting-step-1">
          <div className="col-span-12">
            <div className="p-3">
              <form className="mt-5 p-5 box validate-form" onSubmit={onSubmit}>
                <fieldset className="mb-4">
                  <legend className="font-medium text-xl text-gray-700">
                    School Details
                  </legend>
                  <div className="grid grid-cols-12 gap-4 gap-y-3 mt-3">
                    <div className="col-span-12 md:col-span-6">
                      <FormLabel>Name</FormLabel>
                      <FormInput
                        {...register("name")}
                        type="text"
                        name="name"
                        className={errors.name ? "border-danger" : ""}
                        placeholder="School Name"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <FormLabel>School Code</FormLabel>
                      <FormInput
                        {...register("schoolCode")}
                        type="text"
                        name="schoolCode"
                        disabled
                        className={errors.schoolCode ? "border-danger" : ""}
                        placeholder="School Code"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <FormLabel>Current Session</FormLabel>
                      <Controller
                        control={control}
                        name="current_session"
                        defaultValue=""
                        render={({ field }) => (
                          <TomSelect
                            {...field}
                            onChange={(value) => field.onChange(value)}
                            className={
                              errors.current_session ? "border-danger" : ""
                            }
                          >
                            <option value="">Select Session</option>
                            {academicYears.map((year: any, key: any) => (
                              <option key={key} value={year}>
                                {year}
                              </option>
                            ))}
                          </TomSelect>
                        )}
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <FormLabel>Address</FormLabel>
                      <FormInput
                        {...register("address")}
                        type="text"
                        name="address"
                        className={errors.address ? "border-danger" : ""}
                        placeholder="Address"
                      />
                    </div>
                    {/* New Signatory Role Field */}
                    <div className="col-span-12 md:col-span-6">
                      <FormLabel>Signatory Role</FormLabel>
                      <Controller
                        control={control}
                        name="signatory_role"
                        render={({ field }) => (
                          <TomSelect
                            {...field}
                            onChange={(value: any) => field.onChange(value)}
                            className={
                              errors.signatory_role ? "border-danger" : ""
                            }
                          >
                            {signatoryRoles.map((role, index) => (
                              <option key={index} value={role}>
                                {role}
                              </option>
                            ))}
                          </TomSelect>
                        )}
                      />
                    </div>
                    {/* Updated Signatory Name Field */}
                    <div className="col-span-12 md:col-span-6">
                      <FormLabel>Signatory Name</FormLabel>
                      <FormInput
                        {...register("signatory_name")}
                        type="text"
                        name="signatory_name"
                        className={errors.signatory_name ? "border-danger" : ""}
                        placeholder="Signatory Name"
                      />
                    </div>
                    {/* Updated Signatory Signature Field */}
                    <div className="col-span-12 md:col-span-6">
                      <FormLabel>Signatory Signature</FormLabel>
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
                </fieldset>

                <div className="grid grid-cols-12 gap-4 gap-y-3">
                  <div className="col-span-12 md:col-span-6">
                    <fieldset className="mb-5">
                      <legend className="font-medium text-lg text-gray-700">
                        Branding
                      </legend>
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-6">
                          <FormLabel>Primary Color</FormLabel>
                          <input
                            type="color"
                            {...register("primaryColor")}
                            className="w-full h-10 cursor-pointer border rounded-md"
                          />
                        </div>
                        <div className="col-span-12 md:col-span-6">
                          <FormLabel>Secondary Color</FormLabel>
                          <input
                            type="color"
                            {...register("secondaryColor")}
                            className="w-full h-10 cursor-pointer border rounded-md"
                          />
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <FormInput
                      {...register("summative_has_score")}
                      type="checkbox"
                      name="summative_has_score"
                      className={
                        errors.summative_has_score
                          ? "border-danger w-5 h-5 mr-3"
                          : "w-5 h-5 mr-3"
                      }
                    />
                    <FormLabel>
                      Summative Report With Score (Not Recommended)
                    </FormLabel>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <FormInput
                      {...register("summative_has_pos")}
                      type="checkbox"
                      name="summative_has_pos"
                      className={
                        errors.summative_has_score
                          ? "border-danger w-5 h-5 mr-3"
                          : "w-5 h-5 mr-3"
                      }
                    />
                    <FormLabel>
                      Summative Report Has Pos (Not Recommended)
                    </FormLabel>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <FormLabel>School Stamp</FormLabel>
                    <PassportUpload
                      name="school_stamp"
                      register={register}
                      errors={errors}
                      initialImageUrl={IMG_URL + schoolDetails.school_stamp}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <FormLabel>Logo</FormLabel>
                    <PassportUpload
                      name="logo"
                      register={register}
                      errors={errors}
                      initialImageUrl={IMG_URL + schoolDetails.logo}
                      // className="w-full"
                    />
                  </div>
                </div>

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
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      <Notification
        options={{ duration: 3000 }}
        // getRef={(el) => {
        //   notify.current = el;
        // }}
        className="flex"
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
    </>
  );
}

export default Settings;
