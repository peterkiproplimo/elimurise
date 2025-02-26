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
import PassportUpload from "../Learners/profilephoto";
import { IMG_URL } from "../../utils/constants";
import TomSelect from "../../base-components/TomSelect";
import { Controller } from "react-hook-form";
import CardLoader from "../UserProfile/loader";

function Settings() {
  const [academicYears, setAcademicYears] = useState<any>([]);
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
  const [pageLoading, setPageLoading] = useState(false);

  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const selectRef = useRef(null);

  const notify = useRef<NotificationElement>();
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
      await getSchoolDetails();
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
    console.log("years", years);

    setAcademicYears(years);
  };

  const getSchoolDetails = async () => {
    try {
      setPageLoading(true);
      const response = await ApiService.getSchoolDetails({ page: 1 });
      setSchoolDetails(response?.data);
      reset({
        ...response.data,
        current_term: response?.data?.current_term,
        current_session: response?.data?.current_session,
      });
      setPageLoading(false);

      generateAcademicYears(Number(response?.data?.current_session));
    } catch (error) {
      console.error("Failed to fetch academic years", error);
    }
  };

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      setLoading(true);
      try {
        const data = await getValues();
        const response = await ApiService.setCurrentSettings(data);
        localStorage.setItem("school", JSON.stringify(response));
        window.location.reload();
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
      <h2 className="mt-1 text-lg font-medium ">Settings</h2>
      {pageLoading ? (
        <>
          <CardLoader />
        </>
      ) : (
        <div className="grid grid-cols-12 gap-6 mt-2 setting-step-1">
          <div className="col-span-12">
            <div className="  p-3">
              <form className="mt-5 p-5  box validate-form" onSubmit={onSubmit}>
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
                        className={errors.name ? "border-danger" : ""}
                        placeholder="School Name"
                      />
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <FormLabel>Current Session</FormLabel>
                      {/* <FormSelect
                      // value={currentAcademicYear}
                      {...register("current_year")}
                      onChange={(e) => setCurrentAcademicYear(e.target.value)}
                    >
                      <option>Select Year</option>
                      {academicYears.map((year: any, key: any) => (
                        <option key={key} value={year}>
                          {year}
                        </option>
                      ))}
                    </FormSelect> */}
                      <Controller
                        control={control}
                        name="current_session"
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
                            }}
                            className={errors.county ? "border-danger" : ""}
                          >
                            <option value={""}>Select Session</option>
                            {academicYears.map((year: any, key: any) => (
                              <option key={key} value={year}>
                                {year}
                              </option>
                            ))}
                          </TomSelect>
                        )}
                      />
                    </div>
                  </div>
                </fieldset>

                <div className="grid grid-cols-12 gap-4 gap-y-3">
                  {/* <div className="col-span-12 md:col-span-6">
                  <FormLabel>Current Term</FormLabel>
                  <FormSelect
                    {...register("current_term")}
                    // value={currentTerm}
                    onChange={(e) => setCurrentTerm(e.target.value)}
                  >
                    <option value={""}>Select Term</option>
                    {terms.map((term: any, key: any) => (
                      <option key={key} value={term._id}>
                        {term.name}
                      </option>
                    ))}
                  </FormSelect>
                </div> */}
                  <div className="col-span-12 md:col-span-6">
                    <FormLabel>Address</FormLabel>
                    <FormInput
                      {...register("address")}
                      type="text"
                      name="address"
                      className={errors.name ? "border-danger" : ""}
                      placeholder="Address"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <FormLabel>H/Teacher Name</FormLabel>
                    <FormInput
                      {...register("school_head_teacher")}
                      type="text"
                      name="school_head_teacher"
                      className={errors.name ? "border-danger" : ""}
                      placeholder="Head Teacher"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <FormLabel>H/Teacher Signature</FormLabel>
                    <PassportUpload
                      name={"school_head_teacher_signature"}
                      register={register}
                      errors={errors}
                      initialImageUrl={
                        IMG_URL + schoolDetails.school_head_teacher_signature
                      }
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <FormInput
                      {...register("summative_has_score")}
                      type="checkbox"
                      name="summative_has_score"
                      className={
                        errors.name
                          ? "border-danger w-5 h-5 mr-3"
                          : "w-5 h-5 mr-3"
                      }
                      placeholder="Head Teacher"
                    />
                    <FormLabel>
                      Summative Report With Score(Not Remended)
                    </FormLabel>
                    <div className="col-span-12 md:col-span-6">
                      <FormLabel>School Stamp</FormLabel>
                      <PassportUpload
                        name={"school_stamp"}
                        register={register}
                        errors={errors}
                        initialImageUrl={IMG_URL + schoolDetails.school_stamp}
                      />
                    </div>
                    {/* <span className="text-md text-gray-800 ml-2">
                    <FormInput
                      type="checkbox"
                      className="w-5 h-5"
                      // onChange={(e: any) => publishIndicator()}
                    />
                  </span> */}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <FormLabel>Logo</FormLabel>
                    <PassportUpload
                      name={"logo"}
                      register={register}
                      errors={errors}
                      initialImageUrl={IMG_URL + schoolDetails.logo}
                    />
                  </div>
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
      )}
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
