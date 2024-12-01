import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import { FormInput, FormLabel, FormSelect } from "../../base-components/Form";
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
import Pagination from "../../base-components/Pagination";
import { formatDate } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import Alert from "../../base-components/Alert";
import Tippy from "../../base-components/Tippy";
import avarter from "../../assets/images/teacher.jpeg";
import * as c from "../../utils/constants";
import leanerImg from "../../assets/images/learner.jpeg";
import { useParams } from "react-router-dom";

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("basicInfo"); // Default to Basic Info
  const data = useParams();
  const teacher_id = data?.id;

  const [teachers, setTeachers] = useState([]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [teacher, setTeacher] = useState<any>({});
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [filteredLearningAreas, setFilteredLearningAreas] = useState([]);
  const [grades, setGrades] = useState([]);
  const initialState = {
    grade: "",
    learning_area: "",
    term: "",
  };
  const [strandFilter, updateStrandFilter] = useState(initialState);
  const setStrandFilter = (newFilter: any) => {
    updateStrandFilter((prevFilter: any) => ({ ...prevFilter, ...newFilter }));
  };
  useEffect(() => {
    setFilteredLearningAreas([]);
    const lerning_areas = learningAreas.filter(
      (area: any) => area?.grade_id?._id === strandFilter.grade
    );
    const data = getValues();

    reset();
    reset({ user: data.user, grade: strandFilter.grade });
    setFilteredLearningAreas(lerning_areas);
  }, [strandFilter.grade]);
  const navigate = useNavigate();

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
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportDialog, setExportDialog] = useState(false);
  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      firstname: yup.string().required("First Name is required"),
      lastname: yup.string().required("Middle Name is required"),
      email: yup.string().required(" Email is required"),
      surname: yup.string().required("Surname is required"),
      phone: yup
        .string()
        .required("Phone number is required")
        .min(10, "Phone number must be at least 10 characters long"),
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
  const handleGradeChange = async (value: any) => {
    // const selectedValue = event.target.value;

    await setStrandFilter({
      learning_area: "na",
      term: "na",
      grade: value,
    });

    // You might want to fetch filtered data here
  };

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        const response = await ApiService.createTeachers(data);
        // if (!data._id) {
        //   navigate("/home/teacher/" + response._id);
        // }
        await getTeachers();
        cancel({ name: "" });
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage(
          isEditMode
            ? "Teacher updated successfully"
            : "Teacher created successfully."
        );
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(
          error.message || "An error occurred while creating the teacher."
        );
        notify.current?.showToast();
      }
    }
  };

  useEffect(() => {
    getTeachers();
  }, []);
  const getTeachers = async () => {
    isLoading(true);
    const response = await ApiService.getTeacher(teacher_id);
    setTeacher(response.data);

    isLoading(false);
  };
  useEffect(() => {
    getLearningAreas();
    getGrades();
  }, []);

  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });

    setGrades(response.data);
  };
  const getLearningAreas = async () => {
    const response = await ApiService.getLearningAreas({
      page: 1,
      limit: 100000,
    });
    setLearningAreas(response.data);
  };
  // const getAcademicYear = async () => {
  //   const response = await ApiService.getAcademic({ page: 1 });
  //   setAcademic(response.data);
  // };
  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteTeachers(teacher?._id);
      getTeachers();
      isLoading(false);
      setConfirmDelete(false);
      setSuccess(true);
      setMessage(res.message);
      notify.current?.showToast();
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };

  const editRecord = (record: any) => {
    setIsEditMode(true);
    setGroup(record.groups);
    reset(record);
    setDialog(true);
  };

  const cancel = (record: any) => {
    setGroup([""]);
    setPermission([""]);
    reset(record);
    setDialog(false);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log("upd.............");
      // Check file type
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        alert("Please upload a CSV file.");
        event.target.value = ""; // Clear the file input to prevent uploading
        return;
      }

      setSelectedFile(file);
    }
  };

  const exportTemplate = async () => {
    console.log(selectedFile);

    try {
      const res = await ApiService.exportTeachers({});
      setUploadDialog(false);
      setSuccess(true);
      setMessage(res.message);
      notify.current?.showToast();

      setDialog(false);
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      setMessage(error.message || "An error occurred while creating the role.");
      notify.current?.showToast();
    }
  };
  const importData = async () => {
    console.log(selectedFile);

    if (!loading) {
      if (!selectedFile) {
        // Handle case where no file is selected
        return;
      }
      isLoading(true);

      try {
        const formData = new FormData();
        formData.append("csvFile", selectedFile);

        const res = await ApiService.importTeachers(formData);
        // await getStrands();
        await getTeachers();
        isLoading(false);
        setUploadDialog(false);
        setSuccess(true);
        setMessage(res.message);
        notify.current?.showToast();

        setDialog(false);
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(
          error.message || "An error occurred while creating the role."
        );
        notify.current?.showToast();
      }
    }
  };
  return (
    <>
      {dialog ? (
        <>
          <div className="flex items-center mt-8 ">
            <a
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                reset({ name: "" });
                setDialog(false);
                setIsEditMode(false);
              }}
              href="#"
            >
              <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
            </a>
            <h2 className="mr-auto text-lg font-medium">
              {isEditMode ? "Edit Teacher" : "Add Teacher"}
            </h2>
          </div>

          <form className="mt-5 p-5   box validate-form" onSubmit={onSubmit}>
            <div>
              <a
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setDialog(false);
                }}
                className="absolute  top-0 right-0 mt-3 mr-3"
                href="#"
              ></a>
            </div>
            <div className="grid grid-cols-12 gap-4 gap-y-3">
              <div className="col-span-6 sm:col-span-6">
                <FormLabel>
                  First Name<span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("firstname")}
                  type="text"
                  name="firstname"
                  className={errors.firstname ? "border-danger" : ""}
                  placeholder="First name"
                />
                {errors.firstname && (
                  <div className="mt-2 text-danger">
                    {typeof errors.firstname.message === "string" &&
                      errors.firstname.message}
                  </div>
                )}
              </div>
              <div className="col-span-6 sm:col-span-6">
                <FormLabel>
                  Middle Name<span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("lastname")}
                  type="text"
                  name="lastname"
                  className={errors.lastname ? "border-danger" : ""}
                  placeholder="Middle name"
                />
                {errors.lastname && (
                  <div className="mt-2 text-danger">
                    {typeof errors.lastname.message === "string" &&
                      errors.lastname.message}
                  </div>
                )}
              </div>
              <div className="col-span-6 sm:col-span-6">
                <FormLabel>Surname</FormLabel>
                <FormInput
                  {...register("surname")}
                  type="text"
                  name="surname"
                  className={errors.surname ? "border-danger" : ""}
                  placeholder="Surname"
                />
                {errors.surname && (
                  <div className="mt-2 text-danger">
                    {typeof errors.surname.message === "string" &&
                      errors.surname.message}
                  </div>
                )}
              </div>
              <div className="col-span-6 sm:col-span-6">
                <FormLabel>
                  Phone Number<span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("phone", {
                    pattern: {
                      value: /^.{10,}$/,
                      message:
                        "Phone number must be at least 10 characters long",
                    },
                  })}
                  type="text"
                  name="phone"
                  className={errors.phone ? "border-danger" : ""}
                  placeholder="Phone Number"
                />

                {errors.phone && (
                  <div className="mt-2 text-danger">
                    {typeof errors.phone.message === "string" &&
                      errors.phone.message}
                  </div>
                )}
              </div>
              <div className="col-span-6 sm:col-span-6">
                <FormLabel>
                  Email <span className="text-danger ml-0.5">*</span>
                </FormLabel>
                <FormInput
                  {...register("email")}
                  type="email"
                  name="email"
                  className={errors.email ? "border-danger" : ""}
                  placeholder="Email"
                />
                {errors.email && (
                  <div className="mt-2 text-danger">
                    {typeof errors.email.message === "string" &&
                      errors.email.message}
                  </div>
                )}
              </div>

              <div className="col-span-12 sm:col-span-12 mt-3">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => cancel({ name: "" })}
                  className="w-20 mr-1"
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="w-20">
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
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="mt-1 text-lg font-medium ">Teachers</h2>
          <h2 className="mt-1 text-lg font-medium ">teachers</h2>
          <div className="content">
            {/* Custom Back Button */}
            <a
              onClick={(event) => {
                event.preventDefault();
                navigate(-1); // Navigate to the previous page
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
                                  src={c.IMG_URL + teacher?.photo}
                                  alt="teacher"
                                  className="w-9 h-9 rounded-lg border shadow-md"
                                  onError={(e) =>
                                    (e.currentTarget.src = leanerImg)
                                  }
                                />
                              </div> */}
                    <img
                      src={c.IMG_URL + teacher?.photo}
                      alt="photo"
                      className="rounded-full mx-auto"
                      style={{ width: "90%", height: "90%" }}
                      onError={(e) => (e.currentTarget.src = leanerImg)}
                    />
                    <h3 className="mt-3 text-lg font-semibold">
                      {`${teacher?.first_name} ${teacher?.surname}`}
                    </h3>
                  </div>
                </div>
              </div>

              {/* User Information */}
              <div className="w-full md:w-3/4 ">
                <div className="bg-white shadow-md rounded-lg  m-4">
                  <div className="p-6">
                    <h4 className="font-bold">teacher's Profile</h4>

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

                      <>
                        <li className="mr-2">
                          <button
                            className={`inline-block py-2 px-4 ${
                              activeTab === "learners"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                            } font-semibold`}
                            onClick={() => setActiveTab("learners")}
                          >
                            Learners
                          </button>
                        </li>
                      </>
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
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {`${teacher?.firstname} ${teacher?.lastname}`}
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  Email
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {teacher?.email || "N/A"}
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  Phone
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {teacher?.phone || "N/A"}
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  ID NO
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {teacher?.id_no || "N/A"}
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  School Code
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {teacher?.schoolCode || "N/A"}
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  Status
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  <div
                                    className={
                                      teacher?.status === 0
                                        ? "flex items-center text-danger"
                                        : "flex items-center text-success"
                                    }
                                  >
                                    {teacher?.status === 0
                                      ? "Inactive"
                                      : "Active"}
                                  </div>
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  Created At
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {formatDate(teacher?.createdAt, "DD-MM-YYYY")}
                                </td>
                              </tr>

                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  Updated At
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {formatDate(teacher?.updatedAt, "DD-MM-YYYY")}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Guardian 1 Tab */}
                      {activeTab === "learners" && (
                        <div className="tab-pane">
                          <h4 className="font-bold">Learners </h4>
                        </div>
                      )}

                      {/* Guardian 2 Tab */}

                      {/* Tab 3 */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
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
          <div className="font-medium">{success ? "Success" : "Failed"}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
}

export default Main;
