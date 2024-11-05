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
          <h2 className="mt-5 text-xl font-medium  flex flex-wrap">
            {learningArea?.name}
          </h2>
          <div className=" box mb-5 mt-5 items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            {/* <h2 className="mr-auto text-base font-medium border-b p-2">
              Student Promotion From 2019-2020 TO 2020-2021 Session
            </h2> */}
            <div className="flex items-center justify-between border-b pb-4">
              <h5 className="text-xl font-bold">
                Student Promotion From
                <span className="text-red-500">
                  {" "}
                  {school?.current_session}{" "}
                </span>
                TO
                <span className="text-green-500">
                  {" "}
                  {getNextSession(school?.current_session)}{" "}
                </span>
                Session
              </h5>
              <div className="flex space-x-2">
                <button
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Collapse"
                >
                  <i className="fas fa-minus" />
                </button>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Remove"
                >
                  <i className="fas fa-times" />
                </button>
              </div>
            </div>

            {/*  <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">
                  Current Academic Year
                </FormLabel>
                <TomSelect
                  {...register("current_session")}
                  name="year"
                  value={year}
                  onChange={(event) => setYear(event)}
                >
                  <option>Current Academic Year</option>
                  {acadmic.map((year: any, key: any) => (
                    <option key={key} value={year._id}>
                      {year.name}
                    </option>
                  ))}
                </TomSelect>
                {errors.year && (
                  <div className="mt-2 text-danger">
                    {typeof errors.year.message === "string" &&
                      errors.year.message}
                  </div>
                )}
              </div> */}
            {/* 
              <div className="col-span-12 sm:col-span-3">
                <FormLabel htmlFor="modal-form-6">Next Academic year</FormLabel>
                <TomSelect
                  {...register("stream")}
                  name="stream"
                  value={nextYear}
                  onChange={(event) => setNextYear(event)}
                >
                  <option>Next Academic Year</option>
                  {acadmic.map((year: any, key: any) => (
                    <option key={key} value={year._id}>
                      {year.name}
                    </option>
                  ))}
                </TomSelect>
                {errors.nextYear && (
                  <div className="mt-2 text-danger">
                    {typeof errors.nextYear.message === "string" &&
                      errors.nextYear.message}
                  </div>
                )}
              </div> */}
            <form className="mt-5 pl-5  box validate-form" onSubmit={onSubmit}>
              <div className="grid grid-cols-12 gap-1">
                {/* From Grade */}
                <div className="col-span-12 sm:col-span-2">
                  <FormLabel htmlFor="from-grade" className="font-bold">
                    From Grade
                  </FormLabel>
                  <Controller
                    control={control}
                    name="from_grade"
                    defaultValue=""
                    render={({ field }) => (
                      <TomSelect
                        {...field}
                        className={errors.from_grade ? "border-danger" : ""}
                        onChange={(value: any) => {
                          field.onChange(value); // Update form state
                          setSelectedFromGrade(value); // Update selected grade state
                        }}
                      >
                        <option value="">Choose From Grade</option>
                        {grades.map((grade: any, key: any) => (
                          <option key={key} value={grade._id}>
                            {grade?.name}
                          </option>
                        ))}
                      </TomSelect>
                    )}
                  />
                  {errors.from_grade && (
                    <div className="mt-2 text-danger">
                      {typeof errors.from_grade.message === "string" &&
                        errors.from_grade.message}
                    </div>
                  )}
                </div>

                {/* From Stream */}
                <div className="col-span-12 sm:col-span-2">
                  <FormLabel htmlFor="from-stream" className="font-bold">
                    From Stream
                  </FormLabel>
                  <Controller
                    control={control}
                    name="from_stream"
                    defaultValue=""
                    render={({ field }) => (
                      <TomSelect
                        {...field}
                        className={errors.from_stream ? "border-danger" : ""}
                      >
                        <option value="">Choose From Stream</option>
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
                    <div className="mt-2 text-danger">
                      {typeof errors.from_stream.message === "string" &&
                        errors.from_stream.message}
                    </div>
                  )}
                </div>

                {/* To Grade */}
                <div className="col-span-12 sm:col-span-2">
                  <FormLabel htmlFor="to-grade" className="font-bold">
                    To Grade
                  </FormLabel>
                  <Controller
                    control={control}
                    name="to_grade"
                    defaultValue=""
                    render={({ field }) => (
                      <TomSelect
                        {...field}
                        className={errors.to_grade ? "border-danger" : ""}
                        onChange={(value: any) => {
                          field.onChange(value); // Update form state
                          setSelectedToGrade(value); // Update selected grade state
                        }}
                      >
                        <option value="">Choose To Grade</option>
                        {grades
                          // .filter((grade) => grade._id !== selectedFromGrade)
                          .map((grade: any, key: any) => (
                            <option key={key} value={grade._id}>
                              {grade?.name}
                            </option>
                          ))}
                      </TomSelect>
                    )}
                  />
                  {errors.to_grade && (
                    <div className="mt-2 text-danger">
                      {typeof errors.to_grade.message === "string" &&
                        errors.to_grade.message}
                    </div>
                  )}
                </div>

                {/* To Stream */}
                <div className="col-span-12 sm:col-span-2">
                  <FormLabel htmlFor="to-stream" className="font-bold">
                    To Stream
                  </FormLabel>
                  <Controller
                    control={control}
                    name="to_stream"
                    defaultValue=""
                    render={({ field }) => (
                      <TomSelect
                        {...field}
                        className={errors.to_stream ? "border-danger" : ""}
                      >
                        <option value="">Choose To Stream</option>
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
                    <div className="mt-2 text-danger">
                      {typeof errors.to_stream.message === "string" &&
                        errors.to_stream.message}
                    </div>
                  )}
                </div>
                <div className="col-span-12 sm:col-span-2">
                  {/* <Button
                      type="button"
                      variant="outline-secondary"
                      onClick={handleReset}
                      className="w-20 ml-4"
                    >
                      Reset
                    </Button> */}
                  <Button
                    variant="primary"
                    type="submit"
                    className=" ml-5 mt-5"
                    // onClick={async () => {
                    //   const result = await trigger();
                    //   if (result) {
                    //     handleTransition();
                    //   }
                    // }}
                  >
                    Manage Promotion
                    {loading && (
                      <LoadingIcon
                        icon="spinning-circles"
                        color="white"
                        className="w-4 h-4 ml-"
                      />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
          {loading ? (
            <div className="flex flex-col items-center mt-5">
              <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
            </div>
          ) : (
            ""
          )}
          {promotion?.learners?.length > 0 ? (
            <div className="p-5 box ">
              {" "}
              <div className="flex flex-wrap items-center col-span-12   xl:flex-nowrap ">
                <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
                  {" "}
                  <h5 className="text-lg font-bold">
                    Promote Learners From
                    <span className="text-teal-500">
                      {" "}
                      {promotion?.from_stream?.grade?.name}{" "}
                      {promotion?.from_stream?.name}
                    </span>{" "}
                    TO
                    <span className="text-purple-500">
                      {" "}
                      {promotion?.to_stream?.grade?.name}{" "}
                      {promotion?.to_stream?.name}{" "}
                    </span>
                  </h5>
                </div>
                <div className="hidden mx-auto md:block text-slate-500">
                  Showing{" "}
                  {pagination.current_page +
                    " to " +
                    pagination.total_pages +
                    " of " +
                    pagination.total}{" "}
                  entries
                </div>
                <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
                  <div className="relative w-56 text-slate-500">
                    <FormInput
                      type="text"
                      className="w-56 pr-10 "
                      placeholder="Search..."
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Lucide
                      icon="Search"
                      className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12  ">
                <div className="col-span-12 overflow-auto  2xl:overflow-visible">
                  {promotion?.learners?.length === 0 ? (
                    <div className="flex flex-col items-center mt-10 bg-white p-8">
                      {/* <Search size={28} className="" /> */}
                      <p className="text-xl text-slate-500 ">
                        No records found
                      </p>
                    </div>
                  ) : (
                    <>
                      <form
                        className="space-y-4 p-2"
                        onSubmit={onSubmitEnrollment}
                      >
                        <input
                          type="text"
                          hidden
                          {...registerEnroll(`from_grade`)}
                          defaultValue={promotion?.from_stream?.grade?._id}
                          className="w-full px-3 py-2 border rounded dark:bg-darkmode-700 dark:border-darkmode-500"
                        />
                        <input
                          type="text"
                          hidden
                          {...registerEnroll(`from_stream`)}
                          defaultValue={promotion?.from_stream?._id}
                          className="w-full px-3 py-2 border rounded dark:bg-darkmode-700 dark:border-darkmode-500"
                        />

                        <input
                          type="text"
                          hidden
                          {...registerEnroll(`to_grade`)}
                          defaultValue={promotion?.to_stream?.grade?._id}
                          className="w-full px-3 py-2 border rounded dark:bg-darkmode-700 dark:border-darkmode-500"
                        />
                        <input
                          type="text"
                          hidden
                          {...registerEnroll(`to_stream`)}
                          defaultValue={promotion?.to_stream?._id}
                          className="w-full px-3 py-2 border rounded dark:bg-darkmode-700 dark:border-darkmode-500"
                        />
                        <div className="w-100">
                          <button className="mt-2 ml-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded flex items-center">
                            <i className="icon-stairs-up mr-2"></i>
                            Promote Learners
                          </button>
                        </div>
                        <table className="min-w-full bg-white border border-gray-200 dark:bg-darkmode-600">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left">#</th>
                              <th className="px-4 py-2 text-left">
                                Learner Name
                              </th>
                              <th className="px-4 py-2 text-left">Adm No</th>
                              <th className="px-4 py-2 text-left">Nemis No</th>
                              <th className="px-4 py-2 text-left">Grade</th>
                              <th className="px-4 py-2 text-left">Stream</th>
                              <th className="px-4 py-2 text-left">Action</th>
                              {/* <th className="px-4 py-2 text-left">Actions</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {promotion?.learners?.map(
                              (learner: any, key: any) => (
                                <tr
                                  key={key}
                                  className="border-t dark:border-darkmode-400"
                                >
                                  <td className="px-4 py-3 text-center font-medium">
                                    {key + 1}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center">
                                      <img
                                        src={c.IMG_URL + learner?.photo}
                                        alt="Learner"
                                        className="w-9 h-9 rounded-lg border shadow-md"
                                        onError={(e) =>
                                          (e.currentTarget.src = leanerImg)
                                        }
                                      />
                                      <div className="ml-4">
                                        <a
                                          href="#"
                                          onClick={() => editRecord(learner)}
                                          className="font-medium text-primary"
                                        >
                                          {`${learner?.first_name} ${learner?.surname} ${learner?.last_name}`}
                                        </a>
                                        <div className="text-sm text-gray-500">
                                          {learner?.stream?.grade?.name}{" "}
                                          {learner?.stream?.name}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 font-medium">
                                    {learner?.adm_no}
                                  </td>
                                  <td className="px-4 py-3 font-medium">
                                    {learner?.nemis_no}
                                  </td>
                                  <td className="px-4 py-3 font-medium">
                                    {learner?.grade?.name}
                                  </td>
                                  <td className="px-4 py-3 font-medium">
                                    {learner?.stream?.name}
                                  </td>
                                  <td className="px-4 py-3 space-y-2">
                                    <input
                                      type="text"
                                      hidden
                                      {...registerEnroll(`learners[${key}].id`)}
                                      defaultValue={learner?._id}
                                      className="w-full px-3 py-2 border rounded dark:bg-darkmode-700 dark:border-darkmode-500"
                                    />
                                    <select
                                      {...registerEnroll(
                                        `learners[${key}].status`
                                      )}
                                      className="w-full px-3 py-2 border rounded dark:bg-darkmode-700 dark:border-darkmode-500"
                                    >
                                      <option value="P">Promote</option>
                                      <option value="L">Left</option>
                                      <option value="G">Graduated</option>
                                    </select>
                                  </td>

                                  {/* <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                                  onClick={() => removeLearner(learner)}
                                >
                                  Remove
                                </button>
                              </td> */}
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </form>

                      {/* <div className="flex flex-wrap items-center col-span-12  sm:flex-row sm:flex-nowrap tt">
                    <div className="flex flex-wrap items-center col-span-12  sm:flex-row sm:flex-nowrap tt">
                      <Pagination className="w-full sm:w-auto sm:mr-auto">
                        <button
                          onClick={() => setPage(page > 1 ? page - 1 : 1)}
                          className="py-2 px-4 rounded-md"
                        >
                          <Lucide icon="ChevronLeft" className="w-4 h-4" />
                        </button>
                        {_.times(pagination.total_pages).map((page, key) =>
                          page + 1 == pagination.current_page ? (
                            <button
                              onClick={() => setPage(page + 1)}
                              key={key}
                              className="py-2 px-4 bg-white rounded-md"
                            >
                              {page + 1}
                            </button>
                          ) : (
                            <button
                              onClick={() => setPage(page + 1)}
                              key={key}
                              className="py-2 px-4 rounded-md"
                            >
                              {page + 1}
                            </button>
                          )
                        )}
                        <button
                          onClick={() =>
                            setPage(
                              page < pagination.total_pages ? page + 1 : 1
                            )
                          }
                          className="py-2 px-4 rounded-md"
                        >
                          <Lucide icon="ChevronRight" className="w-4 h-4" />
                        </button>
                      </Pagination>
                      <div className="text-slate-500">
                        <span className="mr-3">Total {pagination.total}</span>
                        <FormSelect
                          className="w-30 mt-3 !box sm:mt-0"
                          onChange={(e) => setLimit(parseInt(e.target.value))}
                        >
                          <option value={10}>10/page</option>
                          <option value={25}>25/page</option>
                          <option value={50}>50/page</option>
                          <option value={100}>100/page</option>
                        </FormSelect>
                      </div>
                    </div>
                  </div> */}
                    </>
                  )}
                </div>

                {/* END: Data List */}
              </div>
            </div>
          ) : (
            ""
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
