import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormSwitch,
  FormTextarea,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import * as ApiService from "../../services/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
import { useForm } from "react-hook-form";
import LoadingIcon from "../../base-components/LoadingIcon";
import TomSelect from "../../base-components/TomSelect";
import * as C from "../../utils/constants";
import Pagination from "../../base-components/Pagination";
import { useAuth } from "../../contexts/Auth";
import { useNavigate } from "react-router-dom";
import * as c from "../../utils/constants";
import leanerImg from "../../assets/images/learner.jpeg";
import { formatDate } from "../../utils/helper";

interface TableRow {
  no: number;
  strandName: string;
}
interface Learner {
  first_name: string;
  // Add other properties if needed
}

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [grades, setGrades] = useState([]);
  const [grade, setGrade] = useState("");
  const auth = useAuth();
  const [learner, setLearner] = useState<any>({});
  const [schools, setSchools] = useState([]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [learners, setLearners] = useState([{}]);
  const [activeTab, setActiveTab] = useState("basicInfo"); // Default to Basic Info

  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 0,
  });
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [next_page, setNextPage] = useState(1);
  const [previous_page, setPreviousPage] = useState(1);
  const [strandFilter, setStrandFilter] = useState({
    school: "na",
    grade: "na",
    stream: "na",
  });
  const [streams, setStreams] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const learner = JSON.parse(localStorage.getItem("learner") || "");
    setLearner(learner);
  }, []);
  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      first_name: yup.string().required("Firstname is required"),
      last_name: yup.string().required("Lastname is required"),
      surname: yup.string().required("Surname is required"),
      // adm_no: yup.string().required("Adm.No is required"),
    })
    .required();

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

  return (
    <>
      <div className="flex items-center mt-8 ">
        <h2 className="mr-auto text-lg font-medium">{"Profile Details"}</h2>
      </div>
      <br />
      {/* <form className="mt-5 p-5  box validate-form" onSubmit={onSubmit}>
        <div>
          <a
            onClick={(event: React.MouseEvent) => {
              event.preventDefault();
              setDialog(false);
            }}
            className="absolute top-0 right-0 mt-3 mr-3"
            href="#"
          ></a>
        </div>
        <fieldset className="mt-5 p-5  box validate-form">
          <legend className="text-lg font-semibold">Learner Details</legend>
          <div className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                First Name<span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                disabled
                {...register("first_name")}
                type="text"
                name="first_name"
                className={errors.first_name ? "border-danger" : ""}
                placeholder="first name"
              />
              {errors.first_name && (
                <div className="mt-2 text-danger">
                  {typeof errors.first_name.message === "string" &&
                    errors.first_name.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Last Name<span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                disabled
                {...register("last_name")}
                type="text"
                name="last_name"
                className={errors.last_name ? "border-danger" : ""}
                placeholder="last name"
              />
              {errors.last_name && (
                <div className="mt-2 text-danger">
                  {typeof errors.last_name.message === "string" &&
                    errors.last_name.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Surname</FormLabel>
              <FormInput
                disabled
                {...register("surname")}
                type="text"
                name="surname"
                className={errors.surname ? "border-danger" : ""}
                placeholder="surname"
              />
              {errors.surname && (
                <div className="mt-2 text-danger">
                  {typeof errors.surname.message === "string" &&
                    errors.surname.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Admission Number
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                disabled
                {...register("adm_no")}
                type="text"
                name="adm_no"
                className={errors.adm_no ? "border-danger" : ""}
                placeholder="admission no"
              />
              {errors.adm_no && (
                <div className="mt-2 text-danger">
                  {typeof errors.adm_no.message === "string" &&
                    errors.adm_no.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Nemis No</FormLabel>
              <FormInput
                disabled
                {...register("nemis_no")}
                type="text"
                name="nemis_no"
                className={errors.nemis_no ? "border-danger" : ""}
                placeholder="nemis no"
              />
              {errors.nemis_no && (
                <div className="mt-2 text-danger">
                  {typeof errors.nemis_no.message === "string" &&
                    errors.nemis_no.message}
                </div>
              )}
            </div>
          </div>
        </fieldset>
        <fieldset className="mt-5 p-5  box validate-form">
          <legend className="text-lg font-semibold">Guardian Details</legend>
          <div className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Guardian First Name
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                disabled
                {...register("guardian_first_name")}
                type="text"
                name="guardian_first_name"
                className={errors.guardian_first_name ? "border-danger" : ""}
                placeholder="guardian first name"
              />
              {errors.guardian_first_name && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian_first_name.message === "string" &&
                    errors.guardian_first_name.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Guardian Surname</FormLabel>
              <FormInput
                disabled
                {...register("guardian_surname")}
                type="text"
                name="guardian_surname"
                className={errors.guardian_surname ? "border-danger" : ""}
                placeholder="guardian surname"
              />
              {errors.guardian_surname && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian_surname.message === "string" &&
                    errors.guardian_surname.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Guardian Last Name
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                disabled
                {...register("guardian_last_name")}
                type="text"
                name="guardian_last_name"
                className={errors.guardian_last_name ? "border-danger" : ""}
                placeholder="guardian last name"
              />
              {errors.guardian_last_name && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian_last_name.message === "string" &&
                    errors.guardian_last_name.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Guardian ID Number
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                disabled
                {...register("guardian_id_no")}
                type="text"
                name="guardian_id_no"
                className={errors.guardian_id_no ? "border-danger" : ""}
                placeholder="guardian ID number"
              />
              {errors.guardian_id_no && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian_id_no.message === "string" &&
                    errors.guardian_id_no.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Guardian Email</FormLabel>
              <FormInput
                disabled
                {...register("guardian_email")}
                type="email"
                name="guardian_email"
                className={errors.guardian_email ? "border-danger" : ""}
                placeholder="guardian email"
              />
              {errors.guardian_email && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian_email.message === "string" &&
                    errors.guardian_email.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Guardian Phone</FormLabel>
              <FormInput
                disabled
                {...register("guardian_phone")}
                type="text"
                name="guardian_phone"
                className={errors.guardian_phone ? "border-danger" : ""}
                placeholder="guardian phone"
              />
              {errors.guardian_phone && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian_phone.message === "string" &&
                    errors.guardian_phone.message}
                </div>
              )}
            </div>
          </div>
        </fieldset>
        <fieldset className="mt-5 p-5  box validate-form">
          <legend className="text-lg font-semibold">Guardian 2 Details</legend>
          <div className="grid grid-cols-12 gap-4 gap-y-3">
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Guardian First Name
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                {...register("guardian2_first_name")}
                type="text"
                name="guardian2_first_name"
                className={errors.guardian2_first_name ? "border-danger" : ""}
                placeholder="Second guardian first name"
                disabled
              />
              {errors.guardian2_first_name && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian2_first_name.message === "string" &&
                    errors.guardian2_first_name.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Guardian Surname</FormLabel>
              <FormInput
                {...register("guardian2_surname")}
                type="text"
                name="guardian2_surname"
                className={errors.guardian2_surname ? "border-danger" : ""}
                placeholder="Second guardian surname"
                disabled
              />
              {errors.guardian2_surname && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian2_surname.message === "string" &&
                    errors.guardian2_surname.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Guardian Last Name
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                {...register("guardian2_last_name")}
                type="text"
                name="guardian2_last_name"
                className={errors.guardian2_last_name ? "border-danger" : ""}
                placeholder="Second guardian last name"
                disabled
              />
              {errors.guardian2_last_name && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian2_last_name.message === "string" &&
                    errors.guardian2_last_name.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>
                Guardian ID Number
                <span className="text-danger ml-0.5">*</span>
              </FormLabel>
              <FormInput
                {...register("guardian2_id_no")}
                type="text"
                name="guardian2_id_no"
                className={errors.guardian2_id_no ? "border-danger" : ""}
                placeholder="Second guardian ID number"
                disabled
              />
              {errors.guardian2_id_no && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian2_id_no.message === "string" &&
                    errors.guardian2_id_no.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Guardian Email</FormLabel>
              <FormInput
                {...register("guardian2_email")}
                type="email"
                name="guardian2_email"
                className={errors.guardian2_email ? "border-danger" : ""}
                placeholder="Second guardian email"
                disabled
              />
              {errors.guardian2_email && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian2_email.message === "string" &&
                    errors.guardian2_email.message}
                </div>
              )}
            </div>
            <div className="col-span-4 sm:col-span-4">
              <FormLabel>Guardian Phone</FormLabel>
              <FormInput
                {...register("guardian2_phone")}
                type="text"
                name="guardian2_phone"
                className={errors.guardian2_phone ? "border-danger" : ""}
                placeholder="Second guardian phone"
                disabled
              />
              {errors.guardian2_phone && (
                <div className="mt-2 text-danger">
                  {typeof errors.guardian2_phone.message === "string" &&
                    errors.guardian2_phone.message}
                </div>
              )}
            </div>
          </div>
        </fieldset>
      </form> */}
      <div className="content">
        {/* Custom Back Button */}
        <a
          onClick={(event) => {
            event.preventDefault();
            navigate("/parent");
            // setProfile(false); // Assuming setProfile is defined in the parent component
          }}
          href="#"
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
          Back
        </a>

        <div className="flex flex-wrap">
          {/* Profile Picture and Name Section */}
          <div className="w-full md:w-1/4 text-center mb-4 md:mb-0">
            <div className="bg-white shadow-md m-4 rounded-lg overflow-hidden ">
              <div className="p-6">
                {/* <div className="w-9 h-9 ">
                                <img
                                  src={c.IMG_URL + learner?.photo}
                                  alt="Learner"
                                  className="w-9 h-9 rounded-lg border shadow-md"
                                  onError={(e) =>
                                    (e.currentTarget.src = leanerImg)
                                  }
                                />
                              </div> */}
                <img
                  src={c.IMG_URL + learner?.photo}
                  alt="photo"
                  className="rounded-full mx-auto"
                  style={{ width: "90%", height: "90%" }}
                  onError={(e) => (e.currentTarget.src = leanerImg)}
                />
                <h3 className="mt-3 text-lg font-semibold">
                  {`${learner.first_name} ${learner.surname}`}
                </h3>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="w-full md:w-3/4 ">
            <div className="bg-white shadow-md rounded-lg overflow-hidden m-4">
              <div className="p-6">
                <h4 className="font-bold">Learner's Information</h4>

                {/* Tabs for Basic Info and Guardians */}
                <ul className="flex border-b border-gray-200 mb-4">
                  <li className="mr-2">
                    <button
                      className={`inline-block py-2 px-4 ${
                        activeTab === "basicInfo"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-600 hover:text-blue-600"
                      } font-semibold`}
                      onClick={() => setActiveTab("basicInfo")}
                    >
                      Basic Info
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      className={`inline-block py-2 px-4 ${
                        activeTab === "guardian1"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-600 hover:text-blue-600"
                      } font-semibold`}
                      onClick={() => setActiveTab("guardian1")}
                    >
                      Guardian 1
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      className={`inline-block py-2 px-4 ${
                        activeTab === "guardian2"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-600 hover:text-blue-600"
                      } font-semibold`}
                      onClick={() => setActiveTab("guardian2")}
                    >
                      Guardian 2
                    </button>
                  </li>
                  <li className="mr-2">
                    <button
                      className={`inline-block py-2 px-4 ${
                        activeTab === "tab3"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-600 hover:text-blue-600"
                      } font-semibold`}
                      onClick={() => setActiveTab("tab3")}
                    >
                      History
                    </button>
                  </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content">
                  {/* Basic Info Tab */}

                  {activeTab === "basicInfo" && (
                    <div className="tab-pane active">
                      <h4 className="font-bold">Bascic Information</h4>

                      <table className="min-w-full border border-gray-200">
                        <tbody>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Name
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">{`${learner?.first_name} ${learner.surname}`}</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              ADM NO
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.adm_no}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Class
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.grade?.name}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Stream
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.stream?.name}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Year Admitted
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {new Date(learner?.createdAt).getFullYear()}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Email
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.guardian?.email || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              NEMIS NO
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.nemis_no}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Current Session
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.current_session}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Status
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              <div
                                className={
                                  learner?.status != "L"
                                    ? "flex items-center text-success"
                                    : "flex items-center text-danger"
                                }
                              >
                                {learner?.status == "L" ? "Left" : ""}
                                {learner?.status == "G" ? "Graduated" : ""}
                                {learner?.status == "P" ? "In Session" : ""}
                              </div>
                            </td>
                          </tr>
                          {learner?.status == "G" && (
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Graduated On
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {formatDate(learner?.grad_date, "DD-MM-YYYY")}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Guardian 1 Tab */}
                  {activeTab === "guardian1" && (
                    <div className="tab-pane">
                      <h4 className="font-bold">Guardian 1 Information</h4>
                      <table className="min-w-full border border-gray-200">
                        <tbody>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Name
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.guardian?.first_name}{" "}
                              {learner?.guardian?.surname}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Relationship
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.guardian?.relationship}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Contact
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.guardian?.contact || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Email
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.guardian?.email || "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Guardian 2 Tab */}
                  {activeTab === "guardian2" && (
                    <div className="tab-pane">
                      <h4 className="font-bold">Guardian 2 Information</h4>
                      <table className="min-w-full border border-gray-200">
                        <tbody>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Name
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.guardian2?.first_name}{" "}
                              {learner?.guardian2?.surname || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Relationship
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.guardian2?.relationship || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Contact
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.guardian2?.contact || "N/A"}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 font-bold border-b border-gray-200">
                              Email
                            </td>
                            <td className="px-4 py-4 border-b border-gray-200">
                              {learner?.guardian2?.email || "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Tab 3 */}
                  {activeTab === "tab3" && (
                    <div className="tab-pane">
                      <h4 className="font-bold">Additional Information</h4>
                      <p>Comming soon...</p>
                      {/* You can include more fields or tables here as needed */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
