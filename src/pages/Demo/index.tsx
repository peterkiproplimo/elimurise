import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { FormInput, FormCheck, FormSelect } from "../../base-components/Form";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import NavbarMenu from "../../webapp/NavBarMenu";
import icon from "../../assets/images/Arrow_Right_MD.png";
import * as ApiService from "../../services/auth";
import { Controller, useForm } from "react-hook-form";
import TomSelect from "../../base-components/TomSelect";
import { addDays, isSameDay, parseISO } from "date-fns";

import FooterComponent from "../../webapp/footer";
import { yupResolver } from "@hookform/resolvers/yup";
interface County {
  name: string;
  capital: string;
  code: number;
  sub_counties: string[];
}

const Demo = () => {
  const [selectedCounty, setSelectedCounty] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  const [subCounties, setSubCounties] = useState([]);
  const [counties, setCounties] = useState<County[]>([]); // List<County>
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
  const fetchBookedDates = async () => {
    try {
      const booked = await ApiService.get_schedule_demo();
      if (booked) {
        const formattedDates = booked.map((date: string) => parseISO(date));
        setBookedDates(formattedDates);
      }
    } catch (error) {
      console.error("Error fetching booked dates:", error);
    }
  };

  useEffect(() => {
    fetchBookedDates();
  }, []);

  // Array of additional disabled dates
  const disabledDates = [
    new Date(2025, 0, 10), // Jan 10, 2024
    new Date(2025, 0, 15), // Jan 15, 2024
    new Date(2025, 1, 20), // Jan 20, 2024
  ];

  // const isDisabled = (date) => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0); // Normalize today's date

  //   return (
  //     date < today || // Block past days including today
  //     date.getDay() === 0 || // Block Sundays
  //     disabledDates.some((disabledDate) => isSameDay(date, disabledDate)) // Block additional dates
  //   );
  // };
  const isDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    console.log(bookedDates);
    return (
      date < today || // Block past days
      date.getDay() === 0 || // Block Sundays
      bookedDates.some((booked) => isSameDay(date, booked)) // Block booked future dates
    );
  };

  const [selected_date, setselected_date] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    school_name: "",
    county: "",
    subcounty: "",
    phone_number: "",
    role: "",
    message: "",
    town: "",
  });

  const schema = yup.object({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    school_name: yup.string().required("School name is required"),
    county: yup.string().required("County is required"),
    subcounty: yup.string().required("Sub-county is required"),
    phone_number: yup
      .string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Invalid phone number"),
    // role: yup.string().required("Role is required"),
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  useEffect(() => {
    const getCounties = async () => {
      const counties = await ApiService.getCounties({});
      const data = await counties.data;
      setCounties(data);
      localStorage.setItem("counties", JSON.stringify(data));
    };

    getCounties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await schema.validate({ ...form, selected_date }, { abortEarly: false });
      console.log("Form submitted successfully", { ...form, selected_date });
      const response = await ApiService.scedule_demo({
        ...form,
        selected_date,
      });
      if (response.message.success) {
        setSuccess(true);
        fetchBookedDates();
      } else {
        setRequestError(response.message.error);
      }
      // Add your submission logic here (e.g., API call)
    } catch (error: any) {
      // console.error(err);

      if (error.inner) {
        error.inner.forEach((err: yup.ValidationError) => {
          console.error(err.message);
        });
      }
      // setRequestError(error.message);
    } finally {
      setLoading(false);
    }
  };
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
  const handleDateChange = (date: any) => {
    if (date) {
      // Convert the selected date to Kenyan Time (UTC +3)
      const kenyaTime = new Date(date).toLocaleString("en-US", {
        timeZone: "Africa/Nairobi",
      });

      // Create a new Date object from Kenya time and format it as "yyyy-MM-dd HH:mm:ss"
      const formattedDate = new Date(kenyaTime)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      setselected_date(formattedDate);
    } else {
      setselected_date("");
    }
  };
  const adjustToKenyanTime = (date: any) => {
    if (!date) return null;
    // Parse the stored date in 'yyyy-MM-dd HH:mm:ss' format to Kenyan time
    const kenyaDate = new Date(date);
    const kenyaDateString = new Date(kenyaDate).toLocaleString("en-US", {
      timeZone: "Africa/Nairobi",
    });
    return new Date(kenyaDateString);
  };

  return (
    <>
      <div className="homeContainer sm:p-5 xl:p-0">
        <NavbarMenu />

        <div className="xl:mx-auto max-w-[1500px] p-5">
          <h1 className="xl:text-5xl text-2xl text-center font-semibold  text-primary w-full">
            Request a Demo
          </h1>
          <p className="text-primary text-center xl:text-2xl  p-4">
            We're proud to partner with school to provide students equitable
            access to academic support, preparing them for success in school and
            beyond. If you'd like to explore a partnership with Elimurise Learning,
            please get in touch with us via the form below.
          </p>
          <div className="grid xl:mt-10 xl:ml-10 xl:mr-10 overflow-hidden sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 lg:divide-y-0 xl:grid-cols-2">
            <div className="group xl:ml-10 xl:pr-10 dark:bg-gray-800 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10">
              <h1 className="xl:text-3xl text-xl font-semibold  w-full">
                Elimurise Learning System drives CBC learning positive academic
                outcomes
              </h1>
              <div className="mt-2">
                <ul className="space-y-2 xl:mt-8  xl:text-lg text-md">
                  <li className="flex  xl:text-2xl items-center p-0.5">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-primary w-8 h-8 xl:w-10 xl:h-10 mr-2"
                    />
                    Implement CBC academic planning and prepare students for
                    higher education or a career
                  </li>

                  <li className="flex xl:text-2xl items-center p-0.5">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-primary w-8 h-8 xl:w-10 xl:h-10 mr-2"
                    />
                    Enhance teachers' capacity to offer personalized learning
                    experiences.
                  </li>

                  <li className="flex xl:text-2xl items-center p-0.5">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-primary w-8 h-8 xl:w-10 xl:h-10 mr-2"
                    />
                    Track and measure student progress
                  </li>
                </ul>
              </div>
            </div>
            <div className="group relative dark:bg-gray-800 p-2 transition hover:z-[1] hover:shadow-2xl hover:shadow-gray-600/10 m-0 w-full flex">
              {success ? (
                <>
                  <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Appointment Scheduled
                      </h2>
                      <p className="text-lg text-gray-700 mb-6">
                        Your appointment has been successfully scheduled. You
                        will be contacted by Elimurise within 24 hours.
                      </p>
                      <p className="text-sm text-gray-500">
                        Thank you for choosing our services.
                      </p>
                    </div>
                    <div className="mt-8 flex justify-center">
                      {/* <a
                        href="javascript:void(0)"
                        className="bg-blue-500 text-white text-lg font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
                      >
                        Go to Dashboard
                      </a> */}
                    </div>
                  </div>
                </>
              ) : (
                <form
                  className="validate-form w-full shadow-md p-8 border"
                  onSubmit={handleSubmit}
                >
                  <div className="input-form p-2">
                    <FormInput
                      name="first_name"
                      placeholder="First Name *"
                      value={form.first_name}
                      onChange={handleInputChange}
                      className="block px-4 py-3 min-w-full xl:min-w-[350px] w-full rounded-none border-gray-300"
                    />
                  </div>
                  <div className="input-form p-2">
                    <FormInput
                      name="last_name"
                      placeholder="Last Name *"
                      value={form.last_name}
                      onChange={handleInputChange}
                      className="block px-4 py-3 min-w-full xl:min-w-[350px] w-full rounded-none border-gray-300"
                    />
                  </div>
                  <div className="input-form p-2">
                    <FormInput
                      name="email"
                      type="email"
                      placeholder="Email Address *"
                      value={form.email}
                      onChange={handleInputChange}
                      className="block px-4 py-3 min-w-full xl:min-w-[350px] w-full rounded-none border-gray-300"
                    />
                  </div>
                  <div className="input-form p-2">
                    <FormInput
                      name="school_name"
                      placeholder="School Name *"
                      value={form.school_name}
                      onChange={handleInputChange}
                      className="block px-4 py-3 min-w-full xl:min-w-[350px] w-full rounded-none border-gray-300"
                    />
                  </div>
                  {/* <div className="input-form p-2">
                  <FormInput
                    name="town"
                    placeholder="Town *"
                    value={form.town}
                    onChange={handleInputChange}
                    className="block px-4 py-3 min-w-full xl:min-w-[350px] w-full rounded-none border-gray-300"
                  />
                </div> */}

                  {/* Sub County Selection */}
                  <div className="input-form p-2">
                    <Controller
                      control={control}
                      name="county"
                      // defaultValue={form.county}
                      render={({ field }) => (
                        <TomSelect
                          {...field}
                          onChange={(value: any) => {
                            setForm((prevForm) => ({
                              ...prevForm,
                              county: value, // Update county in form state
                              subcounty: "", // Reset subcounty when county changes
                            }));
                            field.onChange(value); // Update the form's state using react-hook-form
                            handleCountyChange(value); // Dynamically update subcounty options
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
                  <div className="input-form p-2">
                    <Controller
                      control={control}
                      name="subcounty"
                      defaultValue={form.subcounty}
                      render={({ field }) => (
                        <TomSelect
                          {...field}
                          onChange={(value: any) => {
                            console.log(form);
                            setForm((prevForm) => ({
                              ...prevForm,
                              subcounty: value, // Update subcounty in form state
                            }));
                            field.onChange(value);
                          }}
                          className={
                            errors.subcounty
                              ? "p-3xl:mt-4 py-2 min-w-full  border-danger"
                              : "py-2 xl:mt-4 mt-2 min-w-full  border-gray-300"
                          }
                        >
                          <option value={""}>Select Subcounty</option>
                          {/* Dynamically populate subcounty options based on the selected county */}
                          {subCounties?.map((subcounty: any, key: any) => (
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
                  <div className="input-form p-2">
                    <FormInput
                      name="town"
                      placeholder="Town *"
                      value={form.town}
                      onChange={handleInputChange}
                      className="block px-4 py-3 min-w-full xl:min-w-[350px] w-full rounded-none border-gray-300"
                    />
                  </div>

                  <div className="input-form p-2">
                    <FormInput
                      name="phone_number"
                      placeholder="Phone Number *"
                      value={form.phone_number}
                      onChange={handleInputChange}
                      className="block px-4 py-3 min-w-full xl:min-w-[350px] w-full rounded-none border-gray-300"
                    />
                  </div>
                  <div className="input-form p-2">
                    <FormSelect
                      name="role"
                      value={form.role}
                      onChange={handleInputChange}
                      className="block px-4 py-3 min-w-full xl:min-w-[350px] w-full rounded-none border-gray-300"
                    >
                      <option value="" disabled>
                        Your Role*
                      </option>
                      <option value="Head Teacher">Head Teacher</option>
                      <option value="Director">Director</option>
                      <option value="Teacher">Teacher</option>
                    </FormSelect>
                  </div>
                  <div className="input-form p-2">
                    <textarea
                      name="message"
                      placeholder="Comment: Let us know how we can help you"
                      value={form.message}
                      onChange={handleInputChange}
                      className="block px-4 py-3 min-w-full xl:min-w-[350px] h-[150px] w-full rounded-none border-gray-300"
                    />
                  </div>
                  <div className="relative max-w-sm p-2">
                    {/* <DatePicker
                    selected={selected_date}
                    onChange={(date: Date) => setselected_date(date)}
                    placeholderText="Select date"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                  /> */}
                    <DatePicker
                      selected={
                        selected_date ? adjustToKenyanTime(selected_date) : null
                      }
                      filterDate={(date) => !isDisabled(date)}
                      onChange={handleDateChange}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15} // Adjust time intervals as needed
                      dateFormat="yyyy-MM-dd HH:mm:ss" // Format both date and time
                      placeholderText="Select date and time"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    />
                  </div>
                  <p className="p-2 text-gray-500">
                    Elimurise Learning needs the contact information you provide to
                    us to contact you about our products and services.
                  </p>
                  <div className="flex mt-4 text-xs text-slate-600 dark:text-slate-500 sm:text-sm">
                    <div className="flex items-center mr-auto ml-2">
                      <FormCheck.Input
                        id="remember-me"
                        type="checkbox"
                        className="mr-2 border-gray-400"
                      />
                      <label
                        className="cursor-pointer select-none text-[#808080]"
                        htmlFor="remember-me"
                      >
                        You agree to our friendly
                        <Link
                          to="/register"
                          className="font-medium ml-1.5 text-primary"
                        >
                          privacy policy
                        </Link>
                      </label>
                    </div>
                  </div>
                  <p className="p-2 text-gray-500 text-red">{requestError}</p>

                  <div className="mt-5  xl:mt-8 xl:text-left">
                    <Button
                      variant="primary"
                      className="text-md w-[162px] p-2 h-[40px] px-3 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border "
                    >
                      Submit{" "}
                      <div className="icon mr-2">
                        <img
                          alt="ACS"
                          className="xl:w-35  xl:w-auto"
                          src={icon}
                        />
                      </div>
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
              )}
            </div>
          </div>
        </div>
        <div className="aboutContainer   p-5 bg-gray-300">
          <h1 className="xl:text-5xl text-2xl p-5 text-center text-primary font-bold">
            Already a Elimurise Learning Partner?
          </h1>
          <div className="  xl:flex items-center justify-center gap-10 xl:mx-80 px-5">
            <div>
              <p className="xl:text-2xl xl:p-5 text-lg text-center text-primary">
                If you need help from our customer care team, you can reach us
                at support@Elimuriselearning.com.{" "}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center p-5 ">
            <Link to="/contact" className="xl:w-32 xl:mr-8">
              <Button className="xl:text-xl text-[#152259] bg-transparent  border-primary text-MD w-[192px] p-2 h-[40px]  mb-2 gap-2 rounded-tl-[44px] rounded-tr-[44px] rounded-br-[44px] rounded-bl-[44px] border">
                TALK TO US
                {loading && (
                  <LoadingIcon
                    icon="spinning-circles"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                )}
              </Button>
            </Link>
          </div>
        </div>
        <FooterComponent />
      </div>
    </>
  );
};

export default Demo;
