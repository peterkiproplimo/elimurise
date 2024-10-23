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
import logo2 from "../../assets/images/Untitled-1.png";
import jsPDF from "jspdf";
import "jspdf-autotable";

interface TableRow {
  no: number;
  strandName: string;
}

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [lastSaved, setLastSaved] = useState(null);
  const [tests, setTests] = useState([]);
  const [test, setTest] = useState("");

  const [type, setType] = useState("");
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
  const [learner, setLearner] = useState("");
  const [substrand, setSubstrand] = useState<any>({});
  const [indicator, setIndicator] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [strand, setStrand] = useState("");
  const [selectedSubStrand, setSelectedSubStrand] = useState("");
  const [enrollments, setEnrollments] = useState([]);
  const [assessmentsData, setAssesmentsData] = useState<any>([]);
  const [pdfUrl, setPdfUrl] = useState("");

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
  const initialState = {
    grade: learningArea?.grade_id?._id || "na",
    learning_area: learningArea?._id || "na",
    term: learningArea?._id ? 1 : "na",
  };
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
  const [strandFilter, updateStrandFilter] = useState(() => {
    const savedState = localStorage.getItem("strandFilter");
    return initialState;
  });
  const terms = [
    { _id: 1, name: "Term 1" },
    { _id: 2, name: "Term 2" },
    { _id: 3, name: "Term 3" },
  ];
  const getTerms = async () => {
    const response = await ApiService.getTerm({});
    setTerms(response.data);
  };
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
    const enrollments = await ApiService.getEnrolmentsByStream(
      { stream: stream },
      {}
    );
    setEnrollments(enrollments?.data);
  };
  const getTextColor = (score: any) => {
    switch (score) {
      case 4:
        return "text-green-500"; // green text for score 4
      case 3:
        return "text-red-500"; // red text for score 3
      case 2:
        return "text-yellow-500"; // yellow text for score 2
      case 1:
        return "text-blue-500"; // blue text for score 1
      default:
        return "text-gray-500"; // gray text for other scores
    }
  };
  useEffect(() => {
    getEnrollments();
  }, [stream]);

  useEffect(() => {
    getGrades();
    getTerms();
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
    const response = await ApiService.getStrands(
      {
        page: page,
        search: search,
        limit: limit,
      },
      strandFilter
    );
    setStrands(response.data);
  };

  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });

    setGrades(response.data);
  };
  const getLearningAreas = async () => {
    const response = await ApiService.getLearningAreas({ limit: 100000 });
    setLearningAreas(response.data);
  };

  const setStrandFilter = (newFilter: any) => {
    updateStrandFilter((prevFilter: any) => ({ ...prevFilter, ...newFilter }));
  };

  const handleSubStrandChange = (data: any, key: any) => {
    setSelectedSubStrand(key);
    setSubstrand(data);
    // console.log(selectedSubStrand);
    // console.log(substrand);

    // ///call substrands for this strand
    // let res = await ApiService.getSubstrandByStrand(selectedValue);
    // setSubstrands([]);
    // setSubstrands(res.data);
  };
  const handleTestChange = async () => {
    console.log(selectedTerm);
    const response = await ApiService.getTests({
      page: 1,
      grade: strandFilter.grade,
      term: selectedTerm,
    });
    setTests(response.data);
  };
  useEffect(() => {
    handleTestChange();
  }, [selectedTerm, strandFilter.grade]);
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
    setTest("");
    await setStrandFilter({
      learning_area: "na",
      term: "na",
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
  function validateData(data: any) {
    console.log(data);
    // Loop through each key-value pair in the data object
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === "") {
        // If a value is undefined, throw a generic error with 'required'
        throw new Error(`${key} is required`);
      }
    }
  }
  const generateAssessment = async () => {
    isLoading(true);
    let data = {};
    if (type == "grade") {
      data = {
        test: test,
        term: selectedTerm,
        type: type,
        grade: strandFilter.grade,
      };
    } else if (type == "stream") {
      data = {
        test: test,
        term: selectedTerm,
        stream: stream,
        type: type,
      };
    } else if (type == "learner") {
      data = {
        test: test,
        term: selectedTerm,
        stream: stream,
        learner,
        type: type,
      };
    } else if (type == "analysis-stream") {
      data = {
        test: test,
        term: selectedTerm,
        stream: stream,
        type: type,
      };
    } else if (type == "analysis-grade") {
      data = {
        test: test,
        term: selectedTerm,
        grade: strandFilter.grade,
        type: type,
      };
    }
    isLoading(true);
    try {
      validateData(data);

      let res = await ApiService.getSummativeByLearners(data);
      const blob = new Blob([res], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const popup = window.open(
        url,
        `width=${window.innerWidth},height=${window.innerHeight},scrollbars=yes`
      );

      setPdfUrl(url);
      // setEnrollments(res);
      // const pagination = res.pagination;
      // setPagination({
      //   current_page: pagination?.current_page,
      //   total: pagination?.total,
      //   total_pages: pagination?.total_pages,
      //   per_page: pagination?.per_page,
      // });
      // setDialog(true);
      isLoading(false);
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      console.log(error);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };

  type Enrollment = {
    learning_area: {
      name: string;
    };
    strand: {
      name: string;
    };
    substrand: {
      name: string;
    };
    indicator_description: string;
    score: number;
    description: string;
  };

  const generatePDF = () => {
    isLoading(true);
    const doc = new jsPDF();

    // Ensure that assessmentsData has a defined structure
    const data: Enrollment[] = assessmentsData?.assessment || [];

    const tableData = data.map((enrollment: Enrollment) => [
      enrollment.learning_area.name,
      enrollment.strand.name,
      enrollment.substrand.name,
      enrollment.indicator_description,
      enrollment.score,
      enrollment.description,
    ]);

    (doc as any).autoTable({
      head: [
        [
          "Learning Area",
          "Strand",
          "Substrand",
          "Indicator Description",
          "Score",
          "Description",
        ],
      ],
      body: tableData,
    });

    doc.save("report.pdf");
    isLoading(false);
  };
  const handleInputChange = async (data: any) => {
    if (data.score < 1 || data.score > 4) {
      return false;
    }
    const assessment = {
      substrand: substrand?._id,
      indicator,
      term: selectedTerm,
      learning_area: strandFilter.learning_area,
      score: Number(data.score),
      strand: strand,
      enrollment: data?.enrollment?.enrollmentId,
    };
    let res = await ApiService.createAssessment(assessment);
    console.log(assessment);
    console.log(res);
    generateAssessment();
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
          <form
            className="mt-5 p-5 intro-y validate-form  "
            onSubmit={onSubmit}
          >
            <div className="assessment-header"></div>
            <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
              <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-xl font-semibold  ml-5 flex">
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
                  <div className="flex justify-center items-center ">
                    <p className="ml-5 text-2xl gray-800 font-medium">
                      Formative Report
                    </p>
                  </div>
                </h2>

                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                  <Button
                    variant="primary"
                    className="mr-2 shadow-md "
                    onClick={generatePDF}
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
              <iframe
                src={pdfUrl}
                width="100%"
                height="900px"
                title="PDF Viewer"
              />
            </div>
            <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap tt">
              <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap tt">
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
              </div>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2 className="mt-5 text-xl font-medium intro-y flex flex-wrap">
            {learningArea?.name}
          </h2>
          <div className=" box mb-5 mt-5 items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 className="mr-auto text-base font-medium border-b p-2">
              Summary Report
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-10">
              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Type</FormLabel>
                <FormSelect
                  value={type}
                  onChange={(event) => {
                    setStream("");
                    setType(event.target.value);
                  }}
                >
                  <option value={""}>Select Type</option>

                  <option value={"grade"}>Grade Report</option>
                  <option value={"stream"}>Stream Report</option>
                  <option value={"learner"}>Learner Report</option>
                  <option value={"analysis-stream"}>
                    Stream Analysis Report
                  </option>
                  <option value={"analysis-grade"}>
                    Grade Analysis Report{" "}
                  </option>
                </FormSelect>
                {errors.grade && (
                  <div className="mt-2 text-danger">
                    {typeof errors.grade.message === "string" &&
                      errors.grade.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Grade</FormLabel>
                <FormSelect
                  {...register("grade")}
                  name="grade"
                  value={strandFilter.grade}
                  onChange={(event) => handleGradeChange(event)}
                >
                  <option>Select Grade</option>
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
              {(type == "stream" ||
                type == "learner" ||
                type == "analysis-stream") && (
                <div className="col-span-12 sm:col-span-2">
                  <FormLabel htmlFor="modal-form-6">Stream</FormLabel>
                  <FormSelect
                    {...register("stream")}
                    name="stream"
                    value={stream}
                    onChange={(event) => {
                      setEnrollments([]);
                      setStream(event.target.value);
                    }}
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
              )}

              {type == "learner" && (
                <div className="col-span-12 sm:col-span-2">
                  <FormLabel htmlFor="modal-form-6">Learners</FormLabel>
                  <FormSelect
                    {...register("learner")}
                    name="learner"
                    value={learner}
                    onChange={(event) => setLearner(event.target.value)}
                  >
                    <option value={""}>Select Learner</option>

                    {enrollments?.map((enrollment: any, key) => (
                      <option key={key} value={enrollment?._id}>
                        {enrollment?.learner.first_name}
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
              )}

              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Academic Term</FormLabel>
                <TomSelect
                  name="stream"
                  value={selectedTerm}
                  onChange={(event: any) => {
                    setSelectedTerm(event);
                    handleTestChange();
                  }}
                >
                  <option>Select Academic Term</option>

                  {academic_terms.map((term: any, key) => (
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

              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Tests</FormLabel>
                <FormSelect
                  {...register("test")}
                  name="test"
                  value={test}
                  onChange={(event: any) => setTest(event.target.value)}
                >
                  <option>Select Test</option>
                  {tests.map((test: any, key) => (
                    <option key={key} value={test._id}>
                      {test.name}
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

              {/* {substrands.map((substrand: any, key: any) => (
                <span>{substrand.name}</span>
              ))} */}
            </div>
            <div className="px-5 mt-5 text-right">
              <Button
                onClick={() => generateAssessment()}
                variant="primary"
                type="button"
                className="w-50 text-white"
              >
                Generate Report
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
