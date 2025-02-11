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
import { CheckSquare, Loader } from "lucide-react";
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
import { useLocation, useNavigate } from "react-router-dom";
import fakerData from "../../utils/faker";
import Tippy from "../../base-components/Tippy";
import logo from "../../assets/images/student.jpeg";
import ProgressBar from "./ProgressBar";

interface TableRow {
  no: number;
  strandName: string;
}

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [lastSaved, setLastSaved] = useState(null);

  const [grades, setGrades] = useState([]);
  const [levels, setLevels] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
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
  const [strands, setStrands] = useState([]);
  const [streams, setStreams] = useState([]);
  const [substrands, setSubstrands] = useState([]);
  const [stream, setStream] = useState("");
  const [substrand, setSubstrand] = useState<any>({});
  const [indicator, setIndicator] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [strand, setStrand] = useState("");
  const [selectedSubStrand, setSelectedSubStrand] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 0,
  });
  const [search, setSearch] = useState("");

  const [adm_no, setAdmNo] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [next_page, setNextPage] = useState(1);
  const [previous_page, setPreviousPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const learningArea = location?.state?.data;
  const initialState = {
    grade: learningArea?.grade_id?._id || "",
    learning_area: learningArea?._id || "",
    term: learningArea?._id ? 1 : "",
  };
  const [academic_terms, setTerms] = useState([]);

  // const [selectedStrand, setSelectedStrand] = useState(
  //   state_strand?._id || ""
  // );

  // const [strandFilter, setStrandFilter] = useState({
  //   grade: "",
  //   learning_area: "",
  //   term: "",
  // });
  // useState(() => {
  //   console.log(selectedSubStrand);
  // }, []);
  const [strandFilter, updateStrandFilter] = useState(() => {
    const savedState = localStorage.getItem("strandFilter");
    return initialState;
  });
  const terms = [
    { _id: 1, name: "Term 1" },
    { _id: 2, name: "Term 2" },
    { _id: 3, name: "Term 3" },
  ];

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      score: yup
        .array()
        .of(
          yup
            .number()
            .required("Score is required")
            .min(1, "Minimum value is 1")
            .max(4, "Maximum value is 4")
        ),
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

  const onSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      try {
        const data = await getValues();
        await ApiService.createStrand(data);
        await getStrands();
        await reset();
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage("Strand created successfully.");
        notify.current?.showToast();
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
  const getEnrollments = async () => {
    // const enrollments = await ApiService.getEnrolments({ stream: stream }, {});
    // setEnrollments(enrollments?.data);
  };
  useEffect(() => {
    getEnrollments();
  }, [indicator]);

  useEffect(() => {
    getGrades();
    // getLevels();
    getLearningAreas();
  }, []);
  const getStreams = async (selectedValue: any) => {
    setStreams([]);
    const response = await ApiService.getStream({
      page: 1,
      grade: selectedValue,
    });
    setStreams(response.data);
  };
  const getStrands = async () => {
    if (strandFilter.grade && strandFilter.term) {
      const response = await ApiService.getStrands(
        {
          page: page,
          search: search,
          limit: limit,
        },
        strandFilter
      );
      setStrands(response.data);
    }
  };

  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });

    setGrades(response.data);
  };
  const getLearningAreas = async () => {
    const response = await ApiService.getLearningAreas({});
    setLearningAreas(response.data);
  };

  useEffect(() => {
    if (indicator) {
      generateAssessment(indicator);
    }
  }, [adm_no]);

  const setStrandFilter = (newFilter: any) => {
    updateStrandFilter((prevFilter: any) => ({ ...prevFilter, ...newFilter }));
  };

  const fetchIndicator = async () => {
    const response = await ApiService.getSingleSubstrand(
      stream,
      selectedSubStrand
    );
    setSubstrand(response.data);
  };
  useEffect(() => {
    fetchIndicator();
  }, [selectedSubStrand]);

  const handleSubStrandChange = async (data: any) => {
    console.log(data);
    setSelectedSubStrand(data);
    // setSubstrand(data);

    // console.log(selectedSubStrand);
    // console.log(substrand);

    // ///call substrands for this strand
    // let res = await ApiService.getSubstrandByStrand(selectedValue);
    // setSubstrands([]);
    // setSubstrands(res.data);
  };

  const handleStrandChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    // await setSelectedStrand(selectedValue);
    setSubstrands([]);
    setStrand(selectedValue);
    // ///call substrands for this strand
    let res = await ApiService.getSubstrandByStrand(
      { limit: 10000 },
      selectedValue
    );
    console.log(res.data);

    setSubstrands(res.data);
    // You might want to fetch filtered data here
  };

  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteStrand(recordId);
      getStrands();
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
  useEffect(() => {
    getStrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strandFilter, search, page, limit]);

  const handleGradeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setStream("");
    setStrands([]);
    await setStrandFilter({
      learning_area: "",
      term: "",
      grade: selectedValue,
    });
    getStreams(selectedValue);
    // You might want to fetch filtered data here
  };
  const handleLearningAreaChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setStrands([]);
    await setStrandFilter({
      ...strandFilter,
      learning_area: selectedValue,
    });
    // You might want to fetch filtered data here
  };

  const handleTermChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setStrands([]);
    await setStrandFilter({
      ...strandFilter,
      term: selectedValue,
    });
    // You might want to fetch filtered data here
  };
  const handleHasThemeChange = async (event: any) => {
    const isChecked = event.target.checked;
    setStrands([]);
    setHasTheme(isChecked);
    // You might want to fetch filtered data here
  };
  const [rows, setRows] = useState<TableRow[]>([
    { no: 1, strandName: "Example Strand" },
  ]);
  // useEffect(() => {

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [indicator]);

  const generateAssessment = async (indicator: any) => {
    const data = { indicator, term: selectedTerm, stream, adm_no };
    isLoading(true);
    try {
      let res = await ApiService.getAssessmentLerners(data);
      setEnrollments(res);
      // const pagination = res.pagination;
      // setPagination({
      //   current_page: pagination.current_page,
      //   total: pagination.total,
      //   total_pages: pagination.total_pages,
      //   per_page: pagination.per_page,
      // });
      setDialog(true);
      isLoading(false);
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      console.log(error);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };
  const handleInputChange = async (data: any) => {
    if (data.score > 4) {
      return false;
    }
    const assessment = {
      substrand: substrand?._id,
      indicator,
      term: selectedTerm,
      learning_area: strandFilter.learning_area,
      score: Number(data.score),
      strand: strand,
      learner: data?.learner?._id,
    };
    console.log(data);

    console.log(assessment);
    let res = await ApiService.createAssessment(assessment);
    console.log(assessment);
    console.log(res);
    generateAssessment(indicator);
    fetchIndicator();
  };
  const publishIndicator = async () => {
    const confirmed = await new Promise((resolve) => {
      setConfirmDialog({
        open: true,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    if (confirmed) {
      let res = await ApiService.toggleIdicatorStatus(indicator, {
        term: selectedTerm,
        stream: stream,
      });
      generateAssessment(indicator);
    }
  };

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const ConfirmDialog = ({ open, onConfirm, onCancel }) => (
    <Dialog open={open} onClose={onCancel}>
      <Dialog.Panel>
        <div className="p-5 text-center">
          <Lucide
            icon="AlertCircle"
            className="w-16 h-16 mx-auto mt-3 text-warning"
          />
          <div className="mt-5 text-3xl">Are you sure?</div>
          <div className="mt-2 text-slate-500">
            Once you publish, the results will be sent directly to the
            individual parents and this action is irreversible . Please confirm
            to continue or cancel to go back.
          </div>
        </div>
        <div className="px-5 pb-8 text-center">
          <Button
            variant="outline-secondary"
            type="button"
            onClick={onCancel}
            className="w-24 mr-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="primary"
            type="button"
            className="w-24"
          >
            Publish
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );

  const getDescriptionColor = (score: any) => {
    switch (score) {
      case 4:
        return "text-green-700"; // Exceeding Expectation
      case 3:
        return "text-success"; // Meeting Expectation
      case 2:
        return "text-purple-600"; // Approaching Expectation
      case 1:
        return "text-orange-700"; // Below Expectation
      default:
        return "text-gray-600";
    }
  };

  const addRow = () => {
    const newRow: TableRow = {
      no: rows.length + 1,
      strandName: "New Strand",
    };

    setRows([...rows, newRow]);
  };
  const [formData, setFormData] = useState({ score: 1 });

  return (
    <>
      <ConfirmDialog
        open={confirmDialog.open}
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
        onCancel={() => {
          confirmDialog.onCancel();
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
      />
      ;
      {dialog ? (
        <>
          {/* path: 'strand',
        populate: {
            path: 'learning_area',
            populate: {
                path: 'grade_id'
            }
        } */}
          <form className="mt-5 p-5  validate-form  " onSubmit={onSubmit}>
            <div className="assessment-header">
              <h2 className="text-xl flex items-center font-semibold mb-5">
                <a
                  onClick={(event: React.MouseEvent) => {
                    event.preventDefault();
                    reset({ name: "" });
                    setDialog(false);
                  }}
                  href="#"
                >
                  <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
                </a>{" "}
                Assessment Score Entry Form
              </h2>
              <div className="meta-info grid grid-cols-2 gap-x-4 p-4 bg-white rounded-lg ">
                <div className="meta-row flex items-center mb-2">
                  <label className="font-semibold text-md text-gray-700">
                    Grade:
                  </label>
                  <span className="text-md text-gray-800 ml-2">
                    {substrand?.strand?.learning_area?.grade_id?.name}
                  </span>
                </div>
                <div className="meta-row flex items-center mb-2">
                  <label className="font-semibold text-md text-gray-700">
                    Learning Area:
                  </label>
                  <span className="text-md text-gray-800 ml-2">
                    {substrand?.strand?.learning_area?.name}
                  </span>
                </div>
                <div className="meta-row flex items-center mb-2">
                  <label className="font-semibold text-md text-gray-700">
                    Strand:
                  </label>
                  <span className="text-md text-gray-800 ml-2">
                    {substrand?.strand?.name}
                  </span>
                </div>
                <div className="meta-row flex items-center mb-2">
                  <label className="font-semibold text-md text-gray-700">
                    Substrand:
                  </label>
                  <span className="text-md text-gray-800 ml-2">
                    {/* {substrand?.name} */}
                    <div
                      className="font-medium inline-block richtext"
                      dangerouslySetInnerHTML={{
                        __html: substrand.name,
                      }}
                    ></div>
                  </span>
                </div>
                <div className="meta-row flex items-center mb-2">
                  <label className="font-semibold text-md text-gray-700">
                    Indicator:
                  </label>
                  <span className="text-md text-gray-800 ml-2">
                    {
                      substrand?.indicators
                        .flat()
                        .find((ind: any) => ind._id === indicator).description
                    }
                  </span>
                </div>
                <div className="meta-row flex items-center mb-2">
                  <label className="font-semibold text-md text-gray-700">
                    Publish:
                  </label>
                  <span className="text-md text-gray-800 ml-2">
                    <FormInput
                      type="checkbox"
                      className="w-5 h-5"
                      onChange={(e: any) => publishIndicator()}
                    />
                  </span>
                </div>
                <div className="meta-row flex items-center col-span-2 mt-0.5">
                  <Loader className="text-success animate-spin mr-2" />

                  <span className="text-sm text-success font-medium">
                    (Auto-saving)
                  </span>
                </div>
              </div>
            </div>
            <div className="col-span-12 overflow-auto  2xl:overflow-visible">
              <div className="flex flex-wrap  col-span-12 mt-2  xl:flex-nowrap">
                <div className="hidden mx-auto md:block text-slate-500 mt-5"></div>
                <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-3 ">
                  <div className="relative w-56 text-slate-500">
                    <FormInput
                      type="text"
                      className="w-56 pr-10 !box"
                      placeholder="Adm No..."
                      onChange={(e) => setAdmNo(e.target.value)}
                    />
                    <Lucide
                      icon="Search"
                      className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                    />
                  </div>
                </div>
              </div>
              <Table className="border-spacing-y-[3px] border-separate mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="text-left border-b-1 whitespace-nowrap  w-[20px] ">
                      No
                    </Table.Th>
                    <Table.Th className="text-left border-b-1 whitespace-nowrap  w-[150px] ">
                      ADM No
                    </Table.Th>
                    <Table.Th className="text-left border-b-1 whitespace-nowrap w-[150px] ">
                      NEMIS NO.
                    </Table.Th>
                    <Table.Th className="border-b-1 whitespace-nowrap w-[300px] ">
                      NAME
                    </Table.Th>
                    <Table.Th className="text-left border-b-1 whitespace-nowrap  w-[100px]">
                      Score
                    </Table.Th>
                    <Table.Th className="text-left border-b-1 whitespace-wrap ">
                      DESCRIPTION
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {enrollments.map((assessment: any, key) => (
                    <Table.Tr key={key} className="">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {key + 1}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="flex items-center  ">
                          {assessment?.learner?.adm_no}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="flex items-center  ">
                          {assessment?.learner?.nemis_no}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <div className="flex">
                          {/* <img
                            src={logo}
                            alt="Learner"
                            className="w-12 h-12   "
                          /> */}
                          <div className="ml-4">
                            {assessment?.learner?.first_name}{" "}
                            {assessment?.learner?.last_name}{" "}
                            {assessment?.learner?.surname}
                          </div>
                        </div>
                      </Table.Td>

                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <FormInput
                          {...register("score[" + key + "]")}
                          type="number"
                          className={`form-control  w-[100px] ${
                            getValues("score") ? "is-invalid" : ""
                          }`}
                          defaultValue={assessment?.assessmentDetails?.score}
                          max={4}
                          min={1}
                          disabled={assessment?.assessmentDetails?.published}
                          onChange={(e) => {
                            const enteredValue = parseInt(e.target.value);
                            if (enteredValue > 4) {
                              e.target.value = "4"; // Set the value to the maximum allowed
                            }
                            handleInputChange({
                              score: e.target.value,
                              ...assessment,
                            });
                          }}
                        />
                      </Table.Td>
                      <Table.Td
                        className={`first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]  ${getDescriptionColor(
                          assessment?.assessmentDetails?.score
                        )}`}
                      >
                        <span>
                          <b>
                            {" "}
                            {assessment?.assessmentDetails?.score == 4
                              ? "Exceeding Expectation: " +
                                assessment?.learner?.first_name
                              : ""}
                            {assessment?.assessmentDetails?.score == 3
                              ? "Meeting Expectation: " +
                                assessment?.learner?.first_name
                              : ""}
                            {assessment?.assessmentDetails?.score == 2
                              ? "Approaching Expectation: " +
                                assessment?.learner?.first_name
                              : ""}
                            {assessment?.assessmentDetails?.score == 1
                              ? "Below Expectation: " +
                                assessment?.learner?.first_name
                              : ""}{" "}
                          </b>{" "}
                          {assessment?.assessmentDetails?.description
                            ? assessment.assessmentDetails.description
                                .charAt(0)
                                .toLowerCase() +
                              assessment.assessmentDetails.description.slice(1)
                            : ""}
                        </span>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="mt-5 text-xl font-medium  flex flex-wrap">
            {learningArea?.name}
          </h2>
          <div className=" box mb-5 mt-5 items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 className="mr-auto text-base font-medium border-b p-2">
              Learners Details
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="col-span-12 sm:col-span-2">
                <FormLabel
                  htmlFor="modal-form-6"
                  onClick={(e) => {
                    alert("hello");
                  }}
                >
                  Grade
                </FormLabel>
                <FormSelect
                  {...register("grade")}
                  name="grade"
                  value={strandFilter.grade}
                  onChange={(event) => handleGradeChange(event)}
                >
                  <option
                    onClick={(e) => {
                      alert("hello");
                    }}
                  >
                    Select Grade
                  </option>
                  {grades.map((grade: any, key) => (
                    <option key={key} value={grade._id}>
                      {grade.name}
                    </option>
                  ))}
                </FormSelect>
                {errors.grade && (
                  <div className="mt-2 text-danger">
                    {typeof errors.grade.message === "string" &&
                      errors.grade.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Stream</FormLabel>
                <FormSelect
                  {...register("stream")}
                  name="stream"
                  value={stream}
                  onChange={(event) => setStream(event.target.value)}
                >
                  <option>Select Stream</option>

                  {streams.map((grade: any, key) => (
                    <option key={key} value={grade._id}>
                      {grade.name}
                    </option>
                  ))}
                </FormSelect>
                {errors.grade && (
                  <div className="mt-2 text-danger">
                    {typeof errors.grade.message === "string" &&
                      errors.grade.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Academic Term</FormLabel>
                <TomSelect
                  name="stream"
                  value={selectedTerm}
                  onChange={(event: any) => setSelectedTerm(event)}
                >
                  <option>Select Academic Term</option>
                  {/* <option>Select Term</option> */}
                  {terms.map((term: any, key) => (
                    <option key={key} value={term._id}>
                      {term.name}
                    </option>
                  ))}
                  {/* {.map((term: any, key) => (
                    <option key={key} value={term._id}>
                      {term.name}
                    </option>
                  ))} */}
                </TomSelect>
                {errors.grade && (
                  <div className="mt-2 text-danger">
                    {typeof errors.grade.message === "string" &&
                      errors.grade.message}
                  </div>
                )}
              </div>
            </div>

            <h2 className="mr-auto text-base font-medium border-b p-2 mt-3">
              Assessment Details
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-10">
              <div className="col-span-12 sm:col-span-2">
                <FormLabel
                  htmlFor="modal-form-6"
                  className="block text-sm font-medium text-gray-700"
                >
                  Learning Area
                </FormLabel>
                <FormSelect
                  {...register("learning_area")}
                  value={strandFilter.learning_area}
                  name="learning_area"
                  onChange={handleLearningAreaChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Select Learning Area</option>
                  {learningAreas
                    .filter(
                      (area: any) => area?.grade_id?._id === strandFilter?.grade
                    )
                    .map((filteredArea: any, key) => (
                      <option key={key} value={filteredArea?._id}>
                        {filteredArea.name}
                      </option>
                    ))}
                </FormSelect>
                {errors.learning_area && (
                  <div className="mt-2 text-sm text-red-600">
                    {typeof errors.learning_area.message === "string" &&
                      errors.learning_area.message}
                  </div>
                )}
              </div>

              <div className="col-span-12 sm:col-span-2">
                <FormLabel
                  htmlFor="modal-form-6"
                  className="block text-sm font-medium text-gray-700"
                >
                  Term
                </FormLabel>
                <FormSelect
                  {...register("term")}
                  value={strandFilter.term}
                  name="term"
                  onChange={handleTermChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Select Term</option>
                  {terms.map((term: any, key) => (
                    <option key={key} value={term._id}>
                      {term.name}
                    </option>
                  ))}
                </FormSelect>
                {errors.term && (
                  <div className="mt-2 text-sm text-red-600">
                    {typeof errors.term.message === "string" &&
                      errors.term.message}
                  </div>
                )}
              </div>

              <div className="col-span-12 sm:col-span-2">
                <FormLabel
                  htmlFor="modal-form-6"
                  className="block text-sm font-medium text-gray-700"
                >
                  Strand
                </FormLabel>
                <FormSelect
                  {...register("strand")}
                  name="strand"
                  value={strand}
                  onChange={handleStrandChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Select Strand</option>
                  {strands.map((strand: any, key) => (
                    <option key={key} value={strand._id}>
                      <div
                        className="font-medium inline-block richtext"
                        dangerouslySetInnerHTML={{
                          __html: strand.name,
                        }}
                      ></div>
                    </option>
                  ))}
                </FormSelect>
                {errors.theme && (
                  <div className="mt-2 text-sm text-red-600">
                    {typeof errors.theme.message === "string" &&
                      errors.theme.message}
                  </div>
                )}
              </div>

              <div className="col-span-12 sm:col-span-4">
                <FormLabel
                  htmlFor="modal-form-6"
                  className="block text-sm font-medium text-gray-700"
                >
                  Substrand
                </FormLabel>
                <TomSelect
                  {...register("substrand")}
                  value={selectedSubStrand}
                  name="substrand"
                  onChange={handleSubStrandChange}
                  className="mt-1  w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>Select Substrand</option>
                  {substrands.map((substrand: any, key: any) => (
                    <option key={key} value={substrand._id}>
                      <div
                        className="font-medium inline-block richtext"
                        dangerouslySetInnerHTML={{
                          __html: substrand.name,
                        }}
                      ></div>
                    </option>
                  ))}
                </TomSelect>
                {errors.theme && (
                  <div className="mt-2 text-sm text-red-600">
                    {typeof errors.theme.message === "string" &&
                      errors.theme.message}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="box mb-5 mt-5 p-6 border rounded-lg shadow-md bg-white dark:bg-darkmode-700 dark:border-darkmode-400">
            <div className="col-span-12 sm:col-span-4">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-800 dark:text-gray-100">
                Indicator
              </h2>
              <Table className="border-spacing-y-2 border-separate">
                <Table.Thead className="bg-gray-100 dark:bg-darkmode-800">
                  <Table.Tr>
                    <Table.Th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </Table.Th>
                    <Table.Th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 text-left">
                      Assessment Progress
                    </Table.Th>
                    <Table.Th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Actions
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {substrand?.indicators?.map((indicator: any, key: any) => (
                    <Table.Tr
                      key={key}
                      className="hover:bg-gray-50 dark:hover:bg-darkmode-600 transition-colors"
                      onClick={() => setIndicator(indicator[0]?._id)}
                    >
                      <Table.Td className="py-3 px-4 bg-white dark:bg-darkmode-600 shadow-sm rounded-md">
                        {indicator[0]?.description}
                      </Table.Td>
                      <Table.Td className="py-3 px-4 bg-white dark:bg-darkmode-600 shadow-sm rounded-md">
                        <ProgressBar
                          total={indicator[0]?.total_learners || 0}
                          assessed={indicator[0]?.total_learners_assessed || 0}
                        />
                      </Table.Td>
                      <Table.Td className="py-3 px-4 bg-white dark:bg-darkmode-600 shadow-sm rounded-md">
                        <Button
                          onClick={() => {
                            setIndicator(indicator[0]?._id);
                            generateAssessment(indicator[0]?._id);
                          }}
                          variant="primary"
                          type="button"
                          className="w-28 text-white bg-blue-600 hover:bg-blue-700 transition-all rounded-lg py-2"
                        >
                          Assess
                          {loading && (
                            <LoadingIcon
                              icon="spinning-circles"
                              color="white"
                              className="w-4 h-4 ml-2 animate-spin"
                            />
                          )}
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              {errors.theme && (
                <div className="mt-3 text-sm text-red-600 dark:text-red-400">
                  {typeof errors.theme.message === "string" &&
                    errors.theme.message}
                </div>
              )}
            </div>
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
            open={confirmDelete}
            onClose={() => {
              setConfirmDelete(false);
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
                    setConfirmDelete(false);
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
