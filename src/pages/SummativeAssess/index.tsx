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
import { Loader } from "lucide-react";
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
import debounce from "lodash.debounce"; // Ensure lodash.debounce is installedss

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
  const [tests, setTests] = useState([]);
  const [test, setTest] = useState("");
  const [published, setPublished] = useState(false);
  const [streams, setStreams] = useState([]);
  const [substrands, setSubstrands] = useState([]);
  const [stream, setStream] = useState("");
  const [substrand, setSubstrand] = useState<any>({});
  const [indicator, setIndicator] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [strand, setStrand] = useState("");
  const [selectedSubStrand, setSelectedSubStrand] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [meta, setMeta] = useState<any>({});

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

  const [academic_terms, setTerms] = useState([]);

  // const [selectedStrand, setSelectedStrand] = useState(
  //   state_strand?._id || "na"
  // );

  // const [strandFilter, setStrandFilter] = useState({
  //   grade: "na",
  //   learning_area: "na",
  //   term: "na",
  // });
  // useState(() => {
  //   console.log(selectedSubStrand);
  // }, []);
  const [strandFilter, updateStrandFilter] = useState({
    grade: "",
    learning_area: "",
    term: "",
  });
  const terms = [
    { _id: 1, name: "Term 1" },
    { _id: 2, name: "Term 2" },
    { _id: 3, name: "Term 3" },
  ];
  // const getTerms = async () => {
  //   const response = await ApiService.getTerm({});
  //   setTerms(response.data);
  // };
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

  const getEnrollments = async () => {
    // const enrollments = await ApiService.getEnrolments({ stream: stream }, {});
    // setEnrollments(enrollments?.data);
  };
  useEffect(() => {
    getEnrollments();
  }, [indicator]);

  useEffect(() => {
    getGrades();
    // getTerms();
    // getLevels();
    handleTestChange();
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
  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });

    setGrades(response.data);
  };
  const getLearningAreas = async () => {
    const response = await ApiService.getLearningAreas({ limit: 100000 });
    setLearningAreas(response.data);
  };

  const openSubStrand = (strand: any) => {
    navigate("/substrand", {
      replace: true,
      state: { data: strand, learningArea: learningArea },
    });
  };

  const openLearningArea = (strand: any) => {
    navigate("/learning_areas", {
      replace: true,
      state: { data: strand },
    });
  };

  const setStrandFilter = (newFilter: any) => {
    updateStrandFilter((prevFilter: any) => ({ ...prevFilter, ...newFilter }));
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
    if (adm_no) {
      generateAssessment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adm_no]);

  const handleGradeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setStream("");
    setStrands([]);
    // setTests([]);
    await setStrandFilter({
      learning_area: "",
      term: "1",
      grade: selectedValue,
    });
    getStreams(selectedValue);
    // You might want to fetch filtered data here
  };

  const handleTestChange = async () => {
    isLoading(true);
    const response = await ApiService.getTests({});
    setTests(response.data);
    isLoading(false);
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
  const validateData = (data: any) => {
    // Check each key for null or undefined
    if (!data.term) {
      throw new Error("Academic Term is required.");
    }

    if (!data.stream) {
      throw new Error("Stream is required.");
    }

    if (!data.learning_area) {
      throw new Error("Learning Area is required.");
    }

    if (!data.test) {
      throw new Error("Test is required.");
    }

    // if (!data.adm_no) {
    //   throw new Error("Admission number (ADM NO) is required.");
    // }
  };

  const generateAssessment = async () => {
    const data = {
      term: selectedTerm,
      stream: stream,
      learning_area: strandFilter.learning_area,
      test: test,
      adm_no,
    };

    isLoading(true);
    try {
      validateData(data);

      let res = await ApiService.getSummativeAssessment(data);
      setEnrollments(res.data);
      setMeta(res.meta);
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
  const validateAssessmentData = (data: any) => {
    // Check each key for null or undefined
    if (!data.stream) {
      throw new Error("Stream is required.");
    }

    if (!data.term) {
      throw new Error("Academic Term is required.");
    }

    if (!data.learning_area) {
      throw new Error("Learning Area is required.");
    }

    if (!data.test) {
      throw new Error("Test is required.");
    }

    if (isNaN(data.score) || data.score === null || data.score === undefined) {
      throw new Error("Score must be a valid number.");
    }

    if (!data.learner) {
      throw new Error("Learner information is missing or invalid.");
    }
  };

  const handleInputChange = async (data: any) => {
    // if (data.score < 1 || data.score > 4) {
    //   return false;
    // }
    try {
      const assessment = {
        stream: stream,
        term: selectedTerm,
        learning_area: strandFilter.learning_area,
        test: test,
        score: Number(data.score),
        learner: data?.learner?._id,
      };
      await validateAssessmentData(assessment);
      let res = await ApiService.createSummativeTests(assessment);
      console.log(assessment);
      console.log(res);
      generateAssessment();
    } catch (error: any) {
      setSuccess(false);
      console.log(error);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };

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
  const isSwahili = /kiswahili/i.test(meta?.learningArea?.name);

  return (
    <>
      {dialog ? (
        <>
          {/* path: 'strand',
        populate: {
            path: 'learning_area',
            populate: {
                path: 'grade_id'
            }
        } */}
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
              Summative Assessment
            </h2>
          </div>
          <div className="meta-info grid grid-cols-2 gap-x-4 p-4 bg-white rounded-lg ">
            <div className="meta-row flex items-center mb-2">
              <label className="font-semibold text-md text-gray-700">
                Grade:
              </label>
              <span className="text-md text-gray-800 ml-2">
                {meta?.stream?.grade?.name}
              </span>
            </div>
            <div className="meta-row flex items-center mb-2">
              <label className="font-semibold text-md text-gray-700">
                Stream:
              </label>
              <span className="text-md text-gray-800 ml-2">
                {meta?.stream?.name}
              </span>
            </div>
            <div className="meta-row flex items-center mb-2">
              <label className="font-semibold text-md text-gray-700">
                Learning Area:
              </label>
              <span className="text-md text-gray-800 ml-2">
                {meta?.learningArea?.name}
              </span>
            </div>
          </div>
          <div className="col-span-12 overflow-auto  2xl:overflow-visible">
            <div className="flex flex-wrap  col-span-12 mt-2  xl:flex-nowrap">
              <div className="hidden  md:block ">
                {/* Showing{" "}
                  {pagination.current_page +
                    " to " +
                    pagination.total_pages +
                    " of " +
                    pagination.total}{" "}
                  entries */}
              </div>
              <div className="hidden  mx-auto md:block  mt-5"></div>
              <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-3  ">
                <div className="relative w-56 text-slate-500">
                  <FormInput
                    type="text"
                    className="w-56 pr-10 !box"
                    placeholder="Adm No"
                    onChange={(e) => setAdmNo(e.target.value)}
                  />
                  <Lucide
                    icon="Search"
                    className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                  />
                </div>
              </div>
            </div>
            <Table className="border-spacing-y-[0px] border-separate mt-2 p-2">
              <Table.Thead>
                <Table.Tr className="bg-white">
                  <Table.Th className="text-left border-b-1 whitespace-nowrap  w-[20px] ">
                    No
                  </Table.Th>
                  <Table.Th className="text-left border-b-1 whitespace-nowrap  w-[150px] ">
                    ADM No
                  </Table.Th>

                  <Table.Th className="border-b-1 whitespace-nowrap w-[300px] ">
                    NAME
                  </Table.Th>
                  <Table.Th className="text-left border-b-1 whitespace-nowrap  w-[100px]">
                    Score
                  </Table.Th>
                  <Table.Th className="text-left border-b-1 whitespace-wrap ">
                    DESCRIPTOR
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {enrollments?.map((assessment: any, key) => (
                  <Table.Tr key={key} className="border-b-4 border-grey">
                    <Table.Td className="  bg-white border-b border-grey dark:bg-darkmode-600">
                      {key + 1}
                    </Table.Td>

                    <Table.Td className="  text-center bg-white border-b border-grey dark:bg-darkmode-600">
                      <span className="flex items-center">
                        {assessment?.learner?.adm_no}
                      </span>
                    </Table.Td>

                    <Table.Td className="  bg-white border-b border-grey dark:bg-darkmode-600">
                      <div className="flex">
                        <div className="ml-4">
                          {assessment?.learner?.first_name}{" "}
                          {assessment?.learner?.last_name}{" "}
                          {assessment?.learner?.surname}
                        </div>
                      </div>
                    </Table.Td>

                    <Table.Td className="  bg-white border-b border-grey dark:bg-darkmode-600">
                      <FormInput
                        {...register("score[" + key + "]")}
                        type="number"
                        className={`no-spinner appearance-none form-control w-[100px] ${
                          getValues("score") &&
                          parseInt(getValues("score")[key]) > 100
                            ? "is-invalid"
                            : ""
                        }`}
                        defaultValue={assessment?.assessmentDetails?.score}
                        max={100}
                        min={1}
                        onChange={debounce((e) => {
                          const enteredValue = parseInt(e.target.value);

                          if (enteredValue > 100) {
                            alert("Score cannot exceed 100");
                            e.target.value =
                              assessment?.assessmentDetails?.score; // Reset input value
                            return; // Prevent further processing
                          }

                          // Call handleInputChange with debounced value
                          handleInputChange({
                            score: enteredValue ? enteredValue : "",
                            ...assessment,
                          });
                        }, 300)}
                      />
                    </Table.Td>

                    <Table.Td
                      className={`  bg-white border-b border-grey dark:bg-darkmode-600 `}
                    >
                      <span
                        className={`${getDescriptionColor(
                          assessment?.assessmentDetails?.grading_score || 0 // Fallback if score is undefined
                        )}`}
                      >
                        <b>
                          {assessment?.assessmentDetails?.grading_score == 4
                            ? isSwahili
                              ? "Kuzidisha Matarajio: " +
                                assessment?.learner?.first_name
                              : "Exceeding Expectation: " +
                                assessment?.learner?.first_name
                            : ""}
                          {assessment?.assessmentDetails?.grading_score == 3
                            ? isSwahili
                              ? "Kufikia Matarajio: " +
                                assessment?.learner?.first_name
                              : "Meeting Expectation: " +
                                assessment?.learner?.first_name
                            : ""}
                          {assessment?.assessmentDetails?.grading_score == 2
                            ? isSwahili
                              ? "Kukaribia Matarajio: " +
                                assessment?.learner?.first_name
                              : "Approaching Expectation: " +
                                assessment?.learner?.first_name
                            : ""}
                          {assessment?.assessmentDetails?.grading_score == 1
                            ? isSwahili
                              ? "Mbali na Matarajio: " +
                                assessment?.learner?.first_name
                              : "Below Expectation: " +
                                assessment?.learner?.first_name
                            : ""}
                        </b>{" "}
                        <br />
                      </span>
                      {assessment?.assessmentDetails?.description ||
                        "Not assessed"}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
          <div className="flex flex-wrap items-center col-span-12  sm:flex-row sm:flex-nowrap tt">
            {/* <div className="flex flex-wrap items-center col-span-12  sm:flex-row sm:flex-nowrap tt">
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
                      setPage(page < pagination.total_pages ? page + 1 : 1)
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
              </div> */}
          </div>
        </>
      ) : (
        <>
          <h2 className="mt-5 text-xl font-medium  flex flex-wrap">
            {learningArea?.name}
          </h2>
          <div className=" box mb-5 mt-5 items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 className="mr-auto text-base font-medium border-b p-2">
              Summative Assessment
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-10">
              <div className="col-span-12 sm:col-span-4">
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
              <div className="col-span-12 sm:col-span-4">
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

              <div className="col-span-12  sm:col-span-4">
                <FormLabel htmlFor="modal-form-6">Academic Term</FormLabel>
                <TomSelect
                  name="stream"
                  value={selectedTerm}
                  onChange={(event: any) => {
                    setSelectedTerm(event);
                    // handleTestChange();
                  }}
                >
                  <option>Select Academic Term</option>

                  {terms.map((term: any, key) => (
                    <option key={key} value={term._id}>
                      {term.name}
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
                <FormLabel htmlFor="modal-form-6">Tests</FormLabel>
                <FormSelect
                  {...register("test")}
                  name="test"
                  value={test}
                  onChange={(event: any) => setTest(event.target.value)}
                >
                  {/* ee */}
                  <option>Select Test</option>
                  {tests
                    .filter(
                      (test: any) =>
                        test?.grade?._id == strandFilter.grade &&
                        test?.term == selectedTerm &&
                        (test?.isPublished === false ||
                          test?.isPublished === undefined)
                    )
                    .map((test: any, key) => (
                      <option key={key} value={test._id}>
                        {test.name} - {test?.type} - (
                        {test?.school ? "Custom" : "Hero"})
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
              <div className="col-span-12 sm:col-span-4">
                <FormLabel htmlFor="modal-form-6">Learning Area</FormLabel>
                <FormSelect
                  {...register("learning_area")}
                  value={strandFilter.learning_area}
                  name="learning_area"
                  onChange={(event) => handleLearningAreaChange(event)}
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
                  <div className="mt-2 text-danger">
                    {typeof errors.learning_area.message === "string" &&
                      errors.learning_area.message}
                  </div>
                )}
              </div>
            </div>
            <div className="px-5 pb-8 text-right">
              <Button
                onClick={() => generateAssessment()}
                variant="primary"
                type="button"
                className="w-24 text-white"
              >
                Assess
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
