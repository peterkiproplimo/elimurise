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
import logo2 from "../../assets/images/edu.jpeg";

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
    // const enrollments = await ApiService.getEnrolments({ stream: stream }, {});
    // setEnrollments(enrollments?.data);
  };
  useEffect(() => {
    getEnrollments();
  }, [indicator]);

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
  const generateAssessment = async () => {
    const data = { indicator, term: selectedTerm, stream };
    console.log(substrand);
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
            <div className="assessment-header">
              <div className="meta-info flex  h-20 bg-white rounded-xl  shadow-md">
                <h2 className="text-xl flex items-center font-semibold ml-5">
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
                </h2>
                <div className="flex justify-center items-center ">
                  <img src={logo2} alt="Learner" className="w-12 h-12 ml-5  " />

                  <p className="ml-5 text-2xl gray-800 font-medium">
                    All Learners
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
              <div className="flex flex-wrap  col-span-12 mt-2 intro-y xl:flex-nowrap">
                <div className="hidden mx-auto md:block text-slate-500 mt-5">
                  Showing{" "}
                  {pagination.current_page +
                    " to " +
                    pagination.total_pages +
                    " of " +
                    pagination.total}{" "}
                  entries
                </div>
                <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-3 ">
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
              <Table className="border-spacing-y-[3px] border-separate mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      <FormCheck.Input type="checkbox" />
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      LEARNER NAME
                    </Table.Th>
                    <Table.Th className="text-left border-b-0 whitespace-nowrap">
                      ADMISSION NUMBER
                    </Table.Th>
                    <Table.Th className="text-left border-b-0 whitespace-nowrap">
                      NEMIS NO.
                    </Table.Th>
                    <Table.Th className="text-left border-b-0 whitespace-nowrap">
                      SCORE
                    </Table.Th>
                    <Table.Th className="text-left border-b-0 whitespace-wrap w-[500px] overflow-hidden">
                      DESCRIPTION
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {enrollments.map((enrollment: any, key) => (
                    <Table.Tr key={key} className="intro-x">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <FormCheck.Input type="checkbox" />
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <div className="flex">
                          <img
                            src={logo}
                            alt="Learner"
                            className="w-12 h-12   "
                          />
                          <div className="ml-4">
                            <a href="#" className="font-semibold">
                              {enrollment?.learner?.first_name}{" "}
                              {enrollment?.learner?.last_name}
                            </a>
                            <div className="text-gray-600 text-sm ">
                              {enrollment?.learner?.surname}
                            </div>
                          </div>
                        </div>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="flex items-center  ">
                          {enrollment?.learner?.adm_no}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <span className="flex items-center  ">
                          {enrollment?.learner?.nemis_no}
                        </span>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {enrollment?.assessmentDetails?.score}
                      </Table.Td>
                      <Table.Td
                        className={`first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]  ${getDescriptionColor(
                          enrollment?.assessmentDetails?.score
                        )}`}
                      >
                        <span>
                          <b>
                            {enrollment?.assessmentDetails?.score == 4
                              ? "Exceeding Expectation: "
                              : ""}
                            {enrollment?.assessmentDetails?.score == 3
                              ? "Meeting Expectation: "
                              : ""}
                            {enrollment?.assessmentDetails?.score == 2
                              ? "Approaching Expectation: "
                              : ""}
                            {enrollment?.assessmentDetails?.score == 1
                              ? "Below Expectation: "
                              : ""}
                          </b>
                          <br />
                          {enrollment?.assessmentDetails?.description}
                        </span>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </div>
            <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap mt-5">
              <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                <Pagination className="w-full sm:w-auto sm:mr-auto">
                  <button
                    onClick={() => setPage(previous_page)}
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
                    onClick={() => setPage(next_page)}
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
              All Students Report
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-10">
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

              <div className="col-span-12 sm:col-span-2">
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
              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Term</FormLabel>
                <FormSelect
                  {...register("term")}
                  value={strandFilter.term}
                  name="term"
                  onChange={(event: any) => handleTermChange(event)}
                >
                  <option>Select Term</option>
                  {terms.map((term: any, key) => (
                    <option key={key} value={term._id}>
                      {term.name}
                    </option>
                  ))}
                </FormSelect>
                {errors.term && (
                  <div className="mt-2 text-danger">
                    {typeof errors.term.message === "string" &&
                      errors.term.message}
                  </div>
                )}
              </div>
              {/* {substrands.map((substrand: any, key: any) => (
                <span>{substrand.name}</span>
              ))} */}

              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Strand</FormLabel>
                <FormSelect
                  {...register("strand")}
                  name="strand"
                  value={strand}
                  onChange={(event: any) => handleStrandChange(event)}
                >
                  <option>Select Strand</option>
                  {strands.map((strand: any, key) => (
                    <option key={key} value={strand._id}>
                      {strand.name}
                    </option>
                  ))}
                </FormSelect>
                {errors.theme && (
                  <div className="mt-2 text-danger">
                    {typeof errors.theme.message === "string" &&
                      errors.theme.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-4">
                <FormLabel htmlFor="modal-form-6">Substrand</FormLabel>
                <FormSelect
                  {...register("substrand")}
                  // Assuming selectedSubStrand is the selected object
                  name="substrand"
                  onChange={(selectedOption: any) => {
                    // console.log(substrands);
                    // console.log("jee");
                    handleSubStrandChange(
                      substrands.at(selectedOption),
                      selectedOption
                    );
                  }}
                >
                  <option>Select Substrand</option>
                  {substrands.map((substrand: any, key: any) => (
                    <option key={key} value={key}>
                      {substrand.name}
                    </option>
                  ))}
                </FormSelect>
                {errors.theme && (
                  <div className="mt-2 text-danger">
                    {typeof errors.theme.message === "string" &&
                      errors.theme.message}
                  </div>
                )}
              </div>

              <div className="col-span-12 sm:col-span-4">
                <FormLabel htmlFor="modal-form-6">Indicators</FormLabel>
                <TomSelect
                  {...register("indicator")}
                  value={indicator}
                  name="indicator"
                  onChange={(event: any) => setIndicator(event)}
                >
                  <option>Select Indicator</option>
                  {substrand?.indicators?.map((indicator: any, key: any) => (
                    <option key={key} value={indicator[0]?._id}>
                      {indicator[0]?.description}
                    </option>
                  ))}
                </TomSelect>
                {errors.theme && (
                  <div className="mt-2 text-danger">
                    {typeof errors.theme.message === "string" &&
                      errors.theme.message}
                  </div>
                )}
              </div>
            </div>
            {/* <div className="px-5 pb-8 text-right">
              <Button
                onClick={() => generateAssessment()}
                variant="primary"
                type="button"
                className="w-24 text-white"
              >
                Assess
              </Button>
            </div> */}
          </div>
          <div className=" box mb-5 mt-5 items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 className="mr-auto text-base font-medium border-b p-2">
              Learner Details
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-10">
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
            </div>
            <div className="px-5 pb-8 text-right">
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

          {/* <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
            <h2>Assessment Marks Entry Form</h2>
            <div className="mb-4">
              <span>
                Last Saved: {lastSaved ? lastSaved : "Never"} (Auto-saving every
                5 minutes)
              </span>
            </div>
            <Table className="border-spacing-y-[10px] border-separate -mt-2">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    <FormCheck.Input type="checkbox" />
                  </Table.Th>
                  <Table.Th className="border-b-0 whitespace-nowrap">
                    LEARNER NAME
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    ADMISSION NUMBER
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    GENDER
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    NEMIS NO.
                  </Table.Th>
                  <Table.Th className="text-center border-b-0 whitespace-nowrap">
                    SCORE
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {enrollments.map((enrollment: any, key) => (
                  <Table.Tr key={key} className="intro-x">
                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-10 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <FormCheck.Input type="checkbox" />
                    </Table.Td>
                    <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <div className="flex items-center">
                        <div className="w-9 h-9 image-fit zoom-in">
                          
                        </div>
                        <div className="ml-4">
                          <a href="" className="font-medium whitespace-nowrap">
                            {enrollment?.learner?.first_name}
                          </a>
                          <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                            {enrollment?.learner?.last_name}
                          </div>
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      <span className="flex items-center justify-center underline decoration-dotted">
                        {enrollment?.learner?.adm_no}
                      </span>
                    </Table.Td>
                    <Table.Td className="first:rounded-l-md last:rounded-r-md text-center capitalize bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      {enrollment?.learner?.gender}
                    </Table.Td>
                    <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                      {enrollment?.learner?.nemis_no}
                    </Table.Td>
                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                      <input
                        type="text"
                        className="form-control"
                        value={enrollment.score || ""}
                        onChange={(e) => handleInputChange(key, e)}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div> */}
          {/* <div className="grid grid-cols-12 gap-6">
           

        
         
            <div className="col-span-12 intro-y md:col-span-6 cursor-pointer">
            
               <div className="box" >
                   <div className=" lg:flex lg:justify-between gap-4 p-5 min-h-[100px] ">
                     <div className="lg:flex lg:h-12 image-fit lg:justify-start">
                     <div> 
                      <img alt="Midone Tailwind HTML Admin Template" className="rounded-full w-30 h-20" src={logo}/>
                      </div>
                    <div className="mt-3 ml-4 lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                        <h2 className="font-bold text-xl">Name:</h2>
                    <div className="text  mt-0.5">Adm No: </div>
               </div>
             </div>
             <div className=" mt-4 lg:mt-0 lg:justify-end justify-center">
              <h2 className="mb-2 text-xl font-bold">Score</h2>

                 <button className="border items-center justify-center shadow-sm rounded-md font-medium cursor-pointer  bg-primary border-primary text-white dark:border-primary px-2 py-1 mr-2">Assess Learner</button>
           </div>
             </div>
           </div>
          
          </div>
          <div className="col-span-12 intro-y md:col-span-6 cursor-pointer">
            
            <div className="box" >
                <div className=" lg:flex lg:justify-between gap-4 p-5 min-h-[100px] ">
                  <div className="lg:flex lg:h-12 image-fit lg:justify-start">
                  <div> 
                   <img alt="Midone Tailwind HTML Admin Template" className="rounded-full p-0 w-30 h-20" src={logo}/>
                   </div>
                 <div className="mt-3 ml-4 lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                     <h2 className="font-bold text-xl">Name:</h2>
                 <div className="text  mt-0.5">Adm No: </div>
            </div>
          </div>
          <div className="flex mt-4 lg:mt-0 lg:justify-end justify-center">
              <button className="border items-center justify-center shadow-sm rounded-md font-medium cursor-pointer  bg-primary border-primary text-white dark:border-primary px-2 py-1 mr-2">Assess Learner</button>
              <button className="transition duration-200 border shadow-sm inline-flex items-center justify-center rounded-md font-medium cursor-pointer focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus-visible:outline-none dark:focus:ring-slate-700 dark:focus:ring-opacity-50 [&amp;:hover:not(:disabled)]:bg-opacity-90 [&amp;:hover:not(:disabled)]:border-opacity-90 [&amp;:not(button)]:text-center disabled:opacity-70 disabled:cursor-not-allowed border-secondary text-slate-500 dark:border-darkmode-100/40 dark:text-slate-300 [&amp;:hover:not(:disabled)]:bg-secondary/20 [&amp;:hover:not(:disabled)]:dark:bg-darkmode-100/10 px-5 py-1">Profile</button>
          </div>
          </div>
        </div>
       
       </div>
        
           
          
         

  



            <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
              <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                <Pagination className="w-full sm:w-auto sm:mr-auto">
                  <button
                    onClick={() => setPage(previous_page)}
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
                    onClick={() => setPage(next_page)}
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
          </div> */}
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
