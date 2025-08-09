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
import { Controller, useForm } from "react-hook-form";
import LoadingIcon from "../../base-components/LoadingIcon";
import TomSelect from "../../base-components/TomSelect";
import * as c from "../../utils/constants";
import Pagination from "../../base-components/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import fakerData from "../../utils/faker";
import Tippy from "../../base-components/Tippy";
import logo from "../../assets/images/assess.jpeg";
import { useAuth } from "../../contexts/Auth";
import { getNextSession, getSchool } from "../../utils/helper";
import leanerImg from "../../assets/images/learner.jpeg";

interface TableRow {
  no: number;
  strandName: string;
}
interface School {
  school: Record<string, any>; // Replace `any` with specific types if known
  // Add other properties if needed
}

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const school = getSchool();
  const [grades, setGrades] = useState<any>([]);
  const [levels, setLevels] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [promotion, setPromotion] = useState<any>({});

  // const [permissions] = useState(['create', 'read-feed', 'update-feed', 'delete-feed', 'create-resource', 'read-resource', 'update-resource', 'delete-resource', 'create-user', 'read-user', 'update-user', 'delete-user', 'create-vendor', 'read-vendor', 'update-vendor', 'delete-vendor', 'create-speaker', 'read-speaker', 'update-speaker', 'delete-speaker', 'create-exhibitor', 'read-exhibitor', 'update-exhibitor', 'delete-exhibitor',  'create-place', 'read-place', 'update-place', 'delete-place', 'create-conference', 'read-conference', 'update-conference', 'delete-conference', 'create-theme', 'read-theme', 'update-theme', 'delete-theme', 'create-tag', 'read-tag', 'update-tag', 'delete-tag', 'create-event', 'read-event', 'update-event', 'delete-event', 'create-booking', 'read-booking', 'update-booking', 'cancel-booking', 'create-bus-schedule', 'read-bus-schedule', 'update-bus-schedule', 'delete-bus-schedule', 'manage-security-settings', 'update-policy']);
  const [permissions] = useState(["Add", "Edit", "View", "Delete"]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);
  const [hasTheme, setHasTheme] = useState(false);
  const [acadmic, setAcademic] = useState([]);
  const [year, setYear] = useState<any>({});
  const [nextYear, setNextYear] = useState<any>({});
  const [currentStream, setCurrentStream] = useState<any>({});
  const [nextStream, setNextStream] = useState<any>({});

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
  const navigate = useNavigate();
  const location = useLocation();
  const learningArea = location?.state?.data;
  console.log(learningArea);
  const initialState = {
    grade: learningArea?.grade_id?._id || "na",
    learning_area: learningArea?._id || "na",
    term: learningArea?._id ? 1 : "na",
  };
  const [selectedFromGrade, setSelectedFromGrade] = useState("");
  const [selectedToGrade, setSelectedToGrade] = useState("");

  // const [selectedStrand, setSelectedStrand] = useState(
  //   state_strand?._id || "na"
  // );

  // const [strandFilter, setStrandFilter] = useState({
  //   grade: "na",
  //   learning_area: "na",
  //   term: "na",
  // });

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup.object().shape({
    // from: yup.string().required("Current Academic Year is required"),
    // nextYear: yup.string().required("Next Academic Year is required"),
    // currentStream: yup.string().required("Current Stream is required"),
    // nextStream: yup.string().required("Next Stream is required"),
  });

  const {
    control,

    register,
    trigger,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const {
    control: controlEnroll,
    register: registerEnroll,
    trigger: triggerEnroll,
    getValues: getValuesEnroll,
    reset: resetEnroll,
    formState: { errors: errorsEnroll },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getGrades();
    getAcademic();
    // getLevels();
  }, []);
  const getAcademic = async () => {
    const response = await ApiService.getAcademic({
      page: 1,
    });
    setAcademic(response.data);
  };

  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });

    setGrades(response.data);
  };

  const handleReset = () => {
    setYear("");
    setNextYear("");
    setCurrentStream("");
    setNextStream("");
    reset({
      year: "",
      stream: "",
      grade: "",
      learning_area: "",
    });
  };

  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteStrand(recordId);

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
    setGroup(record.groups);
    reset(record);
    reset({ ...record, learning_area: record.learning_area._id });

    console.log(record);
    setDialog(true);
  };

  const cancel = (record: any) => {
    setGroup([""]);
    setPermission([""]);
    reset(record);
    setDialog(false);
  };

  const onSubmitEnrollment = async (event: any) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      try {
        const data = await getValuesEnroll();
        data.from_session = school?.current_session;
        data.next_session = getNextSession(school?.current_session);
        isLoading(true);
        let res = await ApiService.leanersPromote(data);
        // setPromotion(res.data);
        isLoading(false);
        if (res.success) {
          setPromotion({}); // Clear everything inside promotion

          setSuccess(true);
          setMessage(res.message);
          notify.current?.showToast();
        } else {
          setSuccess(true);
          setMessage(res.message);
          notify.current?.showToast();
          // setPromotion({});
        }

        setConfirmDelete(false);
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(error.message);
        notify.current?.showToast();
      }
    }
  };
  const onSubmit = async (event: any) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      try {
        const data = await getValues();
        data.from_session = school?.current_session;
        data.next_session = getNextSession(school?.current_session);
        // nextAcademicYearId: nextYear,
        // currentStreamId: currentStream,
        // nextStreamId: nextStream,
        // };

        isLoading(true);
        let res = await ApiService.fetchPromotion(data);
        isLoading(false);

        if (res.success) {
          setPromotion(res.data);
        } else {
          setSuccess(true);
          setMessage(res.message);
          notify.current?.showToast();
        }
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(error.message);
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
              }}
              href="#"
            >
              <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
            </a>
            <h2 className="mr-auto text-lg font-medium">New Strand</h2>
          </div>
          <br />
        </>
      ) : (
        <>
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Student Promotion Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage student promotions from one academic session to another
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Lucide icon="Users" className="w-6 h-6 text-primary" />
                <span className="text-sm text-gray-500">
                  {learningArea?.name || "All Learning Areas"}
                </span>
              </div>
            </div>
          </div>

          {/* Session Information Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 mb-8 border border-blue-100 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                  <Lucide icon="Calendar" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Academic Session Transition
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Promoting students from{" "}
                    <span className="font-semibold text-red-500">
                      {school?.current_session}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-green-500">
                      {getNextSession(school?.current_session)}
                    </span>
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <div className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    Active
                </span>
                </div>
              </div>
            </div>
                  </div>

          {/* Promotion Configuration Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Lucide icon="Settings" className="w-5 h-5 mr-2 text-primary" />
                Promotion Configuration
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Select the source and destination grades and streams for promotion
              </p>
                  </div>
            
            <div className="p-6">
              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* From Grade */}
                  <div>
                    <FormLabel htmlFor="from-grade" className="font-semibold text-gray-700 dark:text-gray-300">
                    From Grade
                  </FormLabel>
                  <Controller
                    control={control}
                    name="from_grade"
                    defaultValue=""
                    render={({ field }) => (
                      <TomSelect
                        {...field}
                          className={`w-full ${errors.from_grade ? "border-danger" : "border-gray-300 dark:border-gray-600"}`}
                        onChange={(value: any) => {
                            field.onChange(value);
                            setSelectedFromGrade(value);
                        }}
                      >
                          <option value="">Select Source Grade</option>
                        {grades.map((grade: any, key: any) => (
                          <option key={key} value={grade._id}>
                            {grade?.name}
                          </option>
                        ))}
                      </TomSelect>
                    )}
                  />
                  {errors.from_grade && (
                      <div className="mt-2 text-danger text-sm">
                      {typeof errors.from_grade.message === "string" &&
                        errors.from_grade.message}
                    </div>
                  )}
                </div>

                {/* From Stream */}
                  <div>
                    <FormLabel htmlFor="from-stream" className="font-semibold text-gray-700 dark:text-gray-300">
                    From Stream
                  </FormLabel>
                  <Controller
                    control={control}
                    name="from_stream"
                    defaultValue=""
                    render={({ field }) => (
                      <TomSelect
                        {...field}
                          className={`w-full ${errors.from_stream ? "border-danger" : "border-gray-300 dark:border-gray-600"}`}
                      >
                          <option value="">Select Source Stream</option>
                        {selectedFromGrade &&
                          grades
                            .find(
                              (grade: any) => grade._id === selectedFromGrade
                            )
                            ?.streams.map((stream: any, key: any) => (
                              <option key={key} value={stream._id}>
                                {stream.name}
                              </option>
                            ))}
                      </TomSelect>
                    )}
                  />
                  {errors.from_stream && (
                      <div className="mt-2 text-danger text-sm">
                      {typeof errors.from_stream.message === "string" &&
                        errors.from_stream.message}
                    </div>
                  )}
                </div>

                {/* To Grade */}
                  <div>
                    <FormLabel htmlFor="to-grade" className="font-semibold text-gray-700 dark:text-gray-300">
                    To Grade
                  </FormLabel>
                  <Controller
                    control={control}
                    name="to_grade"
                    defaultValue=""
                    render={({ field }) => (
                      <TomSelect
                        {...field}
                          className={`w-full ${errors.to_grade ? "border-danger" : "border-gray-300 dark:border-gray-600"}`}
                        onChange={(value: any) => {
                            field.onChange(value);
                            setSelectedToGrade(value);
                          }}
                        >
                          <option value="">Select Destination Grade</option>
                          {grades.map((grade: any, key: any) => (
                            <option key={key} value={grade._id}>
                              {grade?.name}
                            </option>
                          ))}
                      </TomSelect>
                    )}
                  />
                  {errors.to_grade && (
                      <div className="mt-2 text-danger text-sm">
                      {typeof errors.to_grade.message === "string" &&
                        errors.to_grade.message}
                    </div>
                  )}
                </div>

                {/* To Stream */}
                  <div>
                    <FormLabel htmlFor="to-stream" className="font-semibold text-gray-700 dark:text-gray-300">
                    To Stream
                  </FormLabel>
                  <Controller
                    control={control}
                    name="to_stream"
                    defaultValue=""
                    render={({ field }) => (
                      <TomSelect
                        {...field}
                          className={`w-full ${errors.to_stream ? "border-danger" : "border-gray-300 dark:border-gray-600"}`}
                      >
                          <option value="">Select Destination Stream</option>
                        {selectedToGrade &&
                          grades
                            .find((grade: any) => grade._id === selectedToGrade)
                            ?.streams.map((stream: any, key: any) => (
                              <option key={key} value={stream._id}>
                                {stream.name}
                              </option>
                            ))}
                      </TomSelect>
                    )}
                  />
                  {errors.to_stream && (
                      <div className="mt-2 text-danger text-sm">
                      {typeof errors.to_stream.message === "string" &&
                        errors.to_stream.message}
                    </div>
                  )}
                </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={handleReset}
                    className="px-6 py-2"
                    >
                    <Lucide icon="RefreshCw" className="w-4 h-4 mr-2" />
                      Reset
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="px-6 py-2"
                    disabled={loading}
                  >
                    <Lucide icon="Search" className="w-4 h-4 mr-2" />
                    {loading ? (
                      <LoadingIcon
                        icon="spinning-circles"
                        color="white"
                        className="w-4 h-4 mr-2"
                      />
                    ) : (
                      "Find Students"
                    )}
                  </Button>
                </div>
              </form>
              </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <LoadingIcon icon="spinning-circles" className="w-12 h-12 text-primary" />
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                Searching for students...
              </p>
            </div>
          )}

          {/* Students List */}
          {promotion?.learners?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                      <Lucide icon="Users" className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Students Found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Promoting {promotion?.learners?.length} students from{" "}
                        <span className="font-semibold text-teal-500">
                          {promotion?.from_stream?.grade?.name} {promotion?.from_stream?.name}
                    </span>{" "}
                        to{" "}
                        <span className="font-semibold text-purple-500">
                          {promotion?.to_stream?.grade?.name} {promotion?.to_stream?.name}
                    </span>
                      </p>
                </div>
                </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                    <FormInput
                      type="text"
                        className="w-64 pr-10"
                        placeholder="Search students..."
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Lucide
                      icon="Search"
                        className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3 text-gray-400"
                    />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={onSubmitEnrollment} className="space-y-6">
                  {/* Hidden form fields */}
                        <input
                          type="text"
                          hidden
                          {...registerEnroll(`from_grade`)}
                          defaultValue={promotion?.from_stream?.grade?._id}
                        />
                        <input
                          type="text"
                          hidden
                          {...registerEnroll(`from_stream`)}
                          defaultValue={promotion?.from_stream?._id}
                        />
                        <input
                          type="text"
                          hidden
                          {...registerEnroll(`to_grade`)}
                          defaultValue={promotion?.to_stream?.grade?._id}
                        />
                        <input
                          type="text"
                          hidden
                          {...registerEnroll(`to_stream`)}
                          defaultValue={promotion?.to_stream?._id}
                  />

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      type="submit"
                      className="px-8 py-3"
                      disabled={loading}
                    >
                      <Lucide icon="ArrowUp" className="w-4 h-4 mr-2" />
                      Promote All Students
                      {loading && (
                        <LoadingIcon
                          icon="spinning-circles"
                          color="white"
                          className="w-4 h-4 ml-2"
                        />
                      )}
                    </Button>
                        </div>

                  {/* Students Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            #
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Admission No
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            NEMIS No
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Current Grade
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Current Stream
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Action
                              </th>
                            </tr>
                          </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {promotion?.learners?.map((learner: any, key: any) => (
                                <tr
                                  key={key}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {key + 1}
                                  </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <img
                                        src={c.IMG_URL + learner?.photo}
                                        alt="Learner"
                                  className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                                        onError={(e) =>
                                          (e.currentTarget.src = leanerImg)
                                        }
                                      />
                                      <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                          {`${learner?.first_name} ${learner?.surname} ${learner?.last_name}`}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {learner?.stream?.grade?.name} {learner?.stream?.name}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {learner?.adm_no}
                                  </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {learner?.nemis_no}
                                  </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {learner?.grade?.name}
                                  </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {learner?.stream?.name}
                                  </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                      type="text"
                                      hidden
                                      {...registerEnroll(`learners[${key}].id`)}
                                      defaultValue={learner?._id}
                                    />
                                    <select
                                {...registerEnroll(`learners[${key}].status`)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                <option value="P" className="text-green-600">Promote</option>
                                <option value="L" className="text-red-600">Left</option>
                                <option value="G" className="text-blue-600">Graduated</option>
                                    </select>
                                  </td>
                                </tr>
                        ))}
                          </tbody>
                        </table>
                  </div>
                      </form>
                      </div>
                    </div>
          )}

          {/* Empty State */}
          {!loading && promotion?.learners?.length === 0 && promotion?.from_stream && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Lucide icon="Users" className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Students Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                No students were found for the selected grade and stream combination. Please verify your selection and try again.
              </p>
            </div>
          )}
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
