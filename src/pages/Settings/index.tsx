import _ from "lodash";
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

function Settings() {
  const [academicYears, setAcademicYears] = useState([]);
  const [schoolDetails, setSchoolDetails] = useState<any>({});
  const schema = yup
    .object({
      // adm_no: yup.string().required("Adm.No is required"),
    })
    .required();
  const [terms, setTerms] = useState([]);
  const [currentAcademicYear, setCurrentAcademicYear] = useState("");
  const [currentTerm, setCurrentTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");

  const notify = useRef<NotificationElement>();
  const {
    register,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    const fetchData = async () => {
      await getAcademicYears();
      await getTerms();
      await getSchoolDetails();
    };

    fetchData();
  }, []);
  const getAcademicYears = async () => {
    try {
      const response = await ApiService.getAcademic({ page: 1 });
      setAcademicYears(response.data);
    } catch (error) {
      console.error("Failed to fetch academic years", error);
    }
  };
  const getSchoolDetails = async () => {
    try {
      const response = await ApiService.getSchoolDetails({ page: 1 });
      setSchoolDetails(response?.data);
      reset({
        ...response.data,
        current_term: response?.data?.current_term,
        current_year: response?.data?.current_year,
      });
    } catch (error) {
      console.error("Failed to fetch academic years", error);
    }
  };

  const getTerms = async () => {
    try {
      const response = await ApiService.getTerm({ page: 1 });
      setTerms(response.data);
    } catch (error) {
      console.error("Failed to fetch terms", error);
    }
  };

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      setLoading(true);
      try {
        const data = await getValues();
        await ApiService.setCurrentSettings(data);
        setLoading(false);
        setSuccess(true);
        setMessage("Settings updated successfully.");
        notify.current?.showToast();
      } catch (error) {
        setLoading(false);
        setSuccess(false);
        setMessage("Failed to update settings.");
        notify.current?.showToast();
      }
    }
  };

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Settings</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="col-span-12">
          <div className="intro-y box p-5">
            <form
              className="mt-5 p-5 intro-y box validate-form"
              onSubmit={onSubmit}
            >
              <fieldset className="mb-4">
                <legend className="font-medium text-gray-700">
                  Schhol Details
                </legend>
                <div className="grid grid-cols-12 gap-4 gap-y-3">
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
                    <FormLabel>Current Academic Year</FormLabel>
                    <FormSelect
                      // value={currentAcademicYear}
                      {...register("current_year")}
                      onChange={(e) => setCurrentAcademicYear(e.target.value)}
                    >
                      <option>Select Year</option>
                      {academicYears.map((year: any, key: any) => (
                        <option key={key} value={year._id}>
                          {year.name}
                        </option>
                      ))}
                    </FormSelect>
                  </div>
                </div>
              </fieldset>

              <div className="grid grid-cols-12 gap-4 gap-y-3">
                <div className="col-span-12 md:col-span-6">
                  <FormLabel>Current Term</FormLabel>
                  <FormSelect
                    {...register("current_term")}
                    // value={currentTerm}
                    onChange={(e) => setCurrentTerm(e.target.value)}
                  >
                    <option>Select Term</option>
                    {terms.map((term: any, key: any) => (
                      <option key={key} value={term._id}>
                        {term.name}
                      </option>
                    ))}
                  </FormSelect>
                </div>
                {/* <div className="col-span-12 md:col-span-6">
                    <FormLabel>Another Field</FormLabel>
                    <FormSelect></FormSelect>
                  </div> */}
              </div>

              {/* Additional fieldsets can be added here in a similar manner */}
              <div className="col-span-12 mt-3">
                <Button
                  variant="primary"
                  type="submit"
                  className="w-20"
                  disabled={loading}
                >
                  Save
                  {loading && (
                    <LoadingIcon
                      icon="spinning-circles"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
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
          <div className="font-medium">{success ? "Success" : "Error"}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
}

export default Settings;
