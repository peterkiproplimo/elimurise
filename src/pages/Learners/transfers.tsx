import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import PassportUpload from "./profilephoto";
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
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import TomSelect from "../../base-components/TomSelect";
import * as C from "../../utils/constants";
import Pagination from "../../base-components/Pagination";
import Alert from "../../base-components/Alert";
import Dropzone from "dropzone";
import Tippy from "../../base-components/Tippy";
import * as c from "../../utils/constants";

interface TableRow {
  no: number;
  strandName: string;
}

function Main() {
  // const [confirmDelete, setConfirmDelete] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const deleteButtonRef = useRef(null);
  const [grades, setGrades] = useState([]);
  const [grade, setGrade] = useState("");
  const [learners, setLearners] = useState([]);

  const [schools, setSchools] = useState([]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState("");

  const [tranfers, setTransfers] = useState([]);
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
  const [parents, setParents] = useState(false);
  const [guardianIdNo, setGuardianIdNo] = useState("");
  const [guardianIdNo2, setGuardianIdNo2] = useState("");
  const [stream, setStream] = useState("");
  const [learner, setLearner] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const navigate = useNavigate();

  const handleNavigate = (learnerId: any) => {
    navigate(`/learner/${learnerId}`, {
      replace: true,
      state: { data: learnerId },
    });
  };
  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      learnerId: yup.string().required("Learner is required"),
      newSchoolCode: yup.string().required("School Code is required"),
      reason: yup.string().required("Reason is required"),
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

  const onSubmit = async (event: any) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        await ApiService.createTransfers(data);
        await getTransfers();
        cancel({name:""})
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage(isEditMode?"Transfer Updated successfully": "Transfer initiated successfully.");
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(
          error.message || "An error occurred while creating the learner."
        );
        notify.current?.showToast();
      }
    }
  };
  const getGrades = async () => {
    const response = await ApiService.getGrades({ page });
    setGrades(response.data);
  };
  useEffect(() => {
    getGrades();
    getParents();
  }, []);
  useEffect(() => {
    getStreams();
  }, [grade]);
  useEffect(() => {
    getStudents();
  }, [strandFilter]);
  useEffect(() => {
    getTransfers();
  }, [search, page, limit]);

  const getTransfers = async () => {
    isLoading(true);
    const response = await ApiService.getTransfers({
      page,
      limit,
      search
    });
    const pagination = response.pagination;
    setPagination({
      current_page: pagination.current_page,
      total: pagination.total,
      total_pages: pagination.total_pages,
      per_page: pagination.per_page,
    });
    setTransfers(response.data);
    isLoading(false);
  };
  const getParents = async () => {
    const response = await ApiService.getLearners(
      {
        page: 1,
      },
      {}
    );
    setParents(response.data);
  };
  const getStreams = async () => {
    const response = await ApiService.getStream({ grade: grade });
    setStreams(response.data);
    console.log(response);
  };

  const getAcademics = async () => {
    const response = await ApiService.getAcademic({
      page: 1,
    });
    setAcademic(response.data);
  };

  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteLearner(recordId);
      getTransfers();
      isLoading(false);
      // setConfirmDelete(false);
      setSuccess(true);
      setMessage("Learner record deleted successfully");
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
    setPhoto(record.learner.photo);

    console.log(record);
    setDialog(true);
  };
  const handleGuardianIdNoBlur = async () => {
    reset({
      ...getValues(),
      guardian_id_no: guardianIdNo,
      guardian: "",
      guardian_first_name: "",
      guardian_email: "",
      guardian_last_name: "",
      guardian_surname: "",
      guardian_phone: "",
    });
    const res = await ApiService.getOneParents({ search: guardianIdNo });
    const response = res.data;
    console.log(response._id);
    reset({
      ...getValues(),
      guardian_id_no: guardianIdNo,
      guardian: response._id,
      guardian_first_name: response.first_name,
      guardian_email: response.email,
      guardian_last_name: response.last_name,
      guardian_surname: response.surname,
      guardian_phone: response.phone,
    });
  };
  const handleGuardianIdNoBlur2 = async () => {
    reset({
      ...getValues(),
      guardian2_id_no: guardianIdNo2,
      guardian2: "",
      guardian2_first_name: "",
      guardian2_email: "",
      guardian2_last_name: "",
      guardian2_surname: "",
      guardian2_phone: "",
    });
    const res = await ApiService.getOneParents({ search: guardianIdNo2 });
    const response = res.data;
    reset({
      ...getValues(),
      guardian2_id_no: guardianIdNo2,
      guardian2: response._id,
      guardian2_first_name: response.first_name,
      guardian2_email: response.email,
      guardian2_last_name: response.last_name,
      guardian2_surname: response.surname,
      guardian2_phone: response.phone,
    });
  };
  const cancel = (record: any) => {
    setGroup([""]);
    setPermission([""]);
    reset({ name: "" });
    setDialog(false);
    setIsEditMode(false);
  };
  const getStudents = async () => {
    isLoading(true);
    const response = await ApiService.getEnrolments(
      {
        page: 1,
        ...strandFilter,
      },
      {}
    );
    const pagination = response.pagination;
    setPagination({
      current_page: pagination.current_page,
      total: pagination.total,
      total_pages: pagination.total_pages,
      per_page: pagination.per_page,
    });
    setEnrollments(response.data);
    isLoading(false);
  };

  const [rows, setRows] = useState<TableRow[]>([
    { no: 1, strandName: "Example Strand" },
  ]);

  const addRow = () => {
    const newRow: TableRow = {
      no: rows.length + 1,
      strandName: "New Strand",
    };

    setRows([...rows, newRow]);
  };
  return (
    <>
      {dialog ? (
        <>
          <div className="flex items-center mt-8 intro-y">
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
              {isEditMode ? "Edit Transfer" : "New Transfer"}
            </h2>
          </div>
          <br />
          <form
            className="mt-5 p-5 intro-y box validate-form"
            onSubmit={onSubmit}
          >
            {/* {message && !success && (
              <Alert
                variant="soft-danger"
                className="flex items-center mb-2"
                dismissTimeout={9000}
              >
                <Lucide icon="AlertCircle" className="w-6 h-6 mr-2" /> {message}
              </Alert>

                <div
                className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
                role="alert"
              >
                <svg
                  className="flex-shrink-0 inline w-4 h-4 me-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="font-medium">Success alert!</span> {message}
                </div>
              </div>
            )} */}
            <div>
              <a
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setPhoto("");
                  setIsEditMode(false);
                  setDialog(false);
                }}
                className="absolute top-0 right-0 mt-3 mr-3"
                href="#"
              ></a>
            </div>
            <fieldset className="mt-5 p-5 intro-y box validate-form">
              <div className="grid grid-cols-12 gap-4 gap-y-3">
                <div className="col-span-4 sm:col-span-4">
                  <FormLabel htmlFor="modal-form-6">
                    Grade<span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <TomSelect
                    name="grade"
                    value={grade}
                    onChange={(event: any) => {
                      reset({ ...getValues(), grade: event });
                      console.log("test");
                      setGrade(event);
                    }}
                    disabled={isEditMode}
                  >
                    <option>Select Grade</option>
                    {grades.map((grade: any, key) => (
                      <option key={key} value={grade._id}>
                        {grade.name}
                      </option>
                    ))}
                  </TomSelect>
                  {errors.grade && (
                    <div className="mt-2 text-danger">
                      {typeof errors.grade.message === "string" &&
                        errors.grade.message}
                    </div>
                  )}
                </div>
                <div className="col-span-12 sm:col-span-4">
                  <FormLabel htmlFor="modal-form-6">
                    Select Stream<span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <FormSelect
                    {...register("stream")}
                    name="stream"
                    onChange={(e) =>
                      setStrandFilter({
                        ...strandFilter,
                        stream: e.target.value,
                      })
                    }
                  >
                    <option>Select Stream</option>

                    {streams.map((stream: any, key) => (
                      <option key={key} value={stream._id}>
                        {stream.name}
                      </option>
                    ))}
                  </FormSelect>
                </div>
                <div className="col-span-4 sm:col-span-4">
                  <FormLabel>
                    Learner<span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <FormSelect
                    {...register("learnerId")}
                    name="learnerId"
                    value={learner}
                    onChange={(event) => setLearner(event.target.value)}
                  >
                    <option>Select Learner</option>

                    {enrollments?.map((enrollment: any, key) => (
                      <option key={key} value={enrollment?.learner?._id}>
                        {enrollment?.learner?.first_name}{" "}
                        {enrollment?.learner?.surname}{" "}
                        {enrollment?.learner?.last_name} |{" "}
                        {enrollment?.learner?.adm_no}
                      </option>
                    ))}
                  </FormSelect>
                  {errors.learnerId && (
                    <div className="mt-2 text-danger">
                      {typeof errors.learnerId.message === "string" &&
                        errors.learnerId.message}
                    </div>
                  )}
                </div>

                <div className="col-span-4 sm:col-span-4">
                  <FormLabel>
                    New School<span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <FormInput
                    {...register("newSchoolCode")}
                    type="text"
                    name="newSchoolCode"
                    className={errors.last_name ? "border-danger" : ""}
                    placeholder="school"
                  />
                  {errors.newSchoolCode && (
                    <div className="mt-2 text-danger">
                      {typeof errors.newSchoolCode.message === "string" &&
                        errors.newSchoolCode.message}
                    </div>
                  )}
                </div>
                <div className="col-span-4 sm:col-span-4">
                  <FormLabel>Reason</FormLabel>
                  <FormInput
                    {...register("reason")}
                    type="text"
                    name="reason"
                    className={errors.reason ? "border-danger" : ""}
                    placeholder="reason"
                  />
                  {errors.reason && (
                    <div className="mt-2 text-danger">
                      {typeof errors.reason.message === "string" &&
                        errors.reason.message}
                    </div>
                  )}
                </div>
              </div>
            </fieldset>

            <div className="col-span-12 sm:col-span-12 mt-3 ml-5">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => {
                  cancel({ name: "" });
                  reset({ name: "" });
                  setPhoto("");
                }}
                className="p-3 mr-1"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="p-5">
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
        </>
      ) : (
        <>
          <h2 className="mt-1 text-lg font-medium intro-y">Transfers</h2>
          {message && success && (
            <Alert
              variant="soft-success"
              className="flex items-center mb-2"
              dismissTimeout={3000}
              role="alert"
            >
              <svg
                className="flex-shrink-0 inline w-4 h-4 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              {message}
            </Alert>

            //   <div
            //   className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
            //   role="alert"
            // >

            //   <span className="sr-only">Info</span>
            //   <div>
            //     <span className="font-medium">Success alert!</span> {message}
            //   </div>
            // </div>
          )}

          <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
            <Button
              variant="primary"
              className="mr-2 shadow-md"
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                setDialog(true);
                setIsEditMode(false);
              }}
            >
              Initiate Transfer
            </Button>

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
                  className="w-56 pr-10 !box"
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

          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
              {loading ? (
                <div className="flex flex-col items-center mt-5">
                  <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                </div>
              ) : tranfers.length === 0 ? (
                <div className="flex flex-col items-center mt-10 bg-white p-8">
                  {/* <Search size={28} className="" /> */}
                  <p className="text-xl text-slate-500 ">No records found</p>
                </div>
              ) : (
                <>
                  <Table className="border-spacing-y-[3px] border-separate mt-2">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="border-b-0 whitespace-nowrap w-10">
                          No.
                        </Table.Th>

                        <Table.Th className="border-b-0 whitespace-nowrap w-24">
                          Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Adm No
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Transfer Code
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          New School
                        </Table.Th>

                        <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Payment Status
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Approval Status
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap w-20">
                          Reason
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap text-center w-20">
                          Actions
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {tranfers.map((tranfer: any, key) => (
                        <Table.Tr key={key} className="intro-x">
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-10">
                            <span className="font-medium whitespace-nowrap">
                              {key + 1}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <div className="flex items-center">
                              <div className="w-9 h-9 image-fit zoom-in">
                                <Tippy
                                  as="img"
                                  alt=""
                                  className="border-white rounded-lg shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                  src={c.IMG_URL + tranfer?.learner?.photo}
                                  content={
                                    tranfer?.learner?.first_name +
                                    " " +
                                    tranfer?.learner?.last_name
                                  }
                                />
                              </div>
                              <div className="ml-4">
                                <a
                                  href="#"
                                  onClick={() => editRecord(tranfer)}
                                  className="font-medium whitespace-nowrap"
                                >
                                  {tranfer?.learner?.first_name &&
                                    tranfer?.learner?.first_name}
                                  {" " +
                                    tranfer?.learner?.surname +
                                    " " +
                                    tranfer?.learner?.last_name}
                                </a>
                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                  {tranfer?.stream?.grade?.name}{" "}
                                  {tranfer?.stream?.name}
                                </div>
                              </div>
                            </div>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {tranfer?.learner?.adm_no}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {tranfer?.transferCode}{" "}
                            </span>
                          </Table.Td>

                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              <div className="ml-0">
                                {tranfer?.newSchool?.name}

                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                  {tranfer?.newSchool?.schoolCode}
                                </div>
                              </div>
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {tranfer?.paymentStatus}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {tranfer?.approvalStatus}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {tranfer?.reason}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md w-20 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center justify-center">
                              <a
                                className="flex items-center mr-3 text-success"
                                href="#"
                                onClick={() => editRecord(tranfer)}
                              >
                                <Lucide
                                  icon="CheckSquare"
                                  className="w-4 h-4 mr-1"
                                />{" "}
                                Edit
                              </a>
                              {/* <a
                            className="flex items-center text-primary"
                            onClick={(e: any) => handleNavigate(learner)}
                        >
                            <Lucide icon="Eye" className="w-4 h-4 mr-1" /> View More
                        </a> */}

                              {/* Uncomment the following block if you want to enable the delete action */}
                              {/* <a
              className="flex items-center text-danger"
              href="#"
              onClick={() => {
                setRecordId(learner.learner._id),
                setConfirmDelete(true);
              }}
            >
              <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
            </a> */}
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>

                  <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                    <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
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
                              page < pagination.total_pages ? page - 1 : 1
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
                  </div>
                </>
              )}
            </div>

            {/* END: Data List */}
          </div>
          <Dialog
            staticBackdrop
            size="lg"
            open={dialog}
            onClose={() => {
              setDialog(false);
            }}
          >
            <Dialog.Panel></Dialog.Panel>
          </Dialog>
          {/* BEGIN: Delete Confirmation Modal */}
          <Dialog
            open={viewMore}
            onClose={() => {
              setViewMore(false);
            }}
            initialFocus={deleteButtonRef}
          >
            <Dialog.Panel>
              <div className="p-5 text-center">
                <Lucide
                  icon="XCircle"
                  className="w-16 h-16 mx-auto mt-3 text-danger"
                />
                <div className="mt-5 text-3xl">Are you sure?</div>
                <div className="mt-2 text-slate-500">
                  Do you really want to delete this record? <br />
                  This process cannot be undone.
                </div>
              </div>
              <div className="px-5 pb-8 text-center">
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => {
                    setViewMore(false);
                  }}
                  className="w-24 mr-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteRecord()}
                  variant="danger"
                  type="button"
                  className="w-24"
                  ref={deleteButtonRef}
                >
                  Delete
                </Button>
              </div>
            </Dialog.Panel>
          </Dialog>
          {/* END: Delete Confirmation Modal */}
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
