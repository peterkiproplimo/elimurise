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
import leanerImg from "../../assets/images/student.jpeg";

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
  const [test, setTest] = useState([]);
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
  const initialState = {
    grade: learningArea?.grade_id?._id || "na",
    learning_area: learningArea?._id || "na",
    term: learningArea?._id ? 1 : "na",
  };
  const [academic_terms, setTerms] = useState([]);
  const [categories, setCategories] = useState([]);
  const fetchBehaviorCategories = async () => {
    try {
      const response = await ApiService.getBehaviour();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBehaviorCategories();
  }, []);

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
  useEffect(() => {
    generateAssessment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adm_no]);

  const handleGradeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedValue = event.target.value;
    setStream("");
    setStrands([]);
    setTest([]);
    await setStrandFilter({
      learning_area: "na",
      term: "na",
      grade: selectedValue,
    });
    getStreams(selectedValue);
    // You might want to fetch filtered data here
  };

  const handleTestChange = async () => {
    isLoading(true);
    const response = await ApiService.getTests({
      page: 1,
      grade: strandFilter.grade,
      term: selectedTerm,
    });
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
  const generateAssessment = async () => {
    const data = {
      term: selectedTerm,
      stream: stream,
      // learning_area: strandFilter.learning_area,
      behaviour: test,
      adm_no,
    };

    isLoading(true);
    try {
      let res = await ApiService.getBehaviourAssessment(data);
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
  const handleInputChange = async (data: any) => {
    // if (data.score < 1 || data.score > 4) {
    //   return false;
    // }
    const assessment = {
      stream: stream,
      term: selectedTerm,
      score: Number(data.score),
      learner: data?.learner?._id,
      behaviour: test,
    };
    let res = await ApiService.createBehaviourAssessment(assessment);
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
                Behaviour Assessment
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
            </div>
            {/* BEGIN: Data List */}
            <div className="col-span-12 overflow-x-auto overflow-y-visible 2xl:overflow-visible">
              <Table hover striped className="mt-6">
                <Table.Thead variant="modern">
                  <Table.Tr>
                    <Table.Th className="w-16 text-center">
                      #
                    </Table.Th>
                    <Table.Th className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <span>Student Name</span>
                      </div>
                    </Table.Th>
                    <Table.Th className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <span>Category</span>
                      </div>
                    </Table.Th>
                    <Table.Th className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <span>Score</span>
                      </div>
                    </Table.Th>
                    <Table.Th className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <span>Date</span>
                      </div>
                    </Table.Th>
                    <Table.Th className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                      <div className="flex items-center space-x-2">
                        <span>Comments</span>
                      </div>
                    </Table.Th>
                    <Table.Th className="text-center w-32">
                      Actions
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>

                <Table.Tbody>
                  {rows.map((row: any, key) => (
                    <Table.Tr key={key}>
                      <Table.Td className="text-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {key + 1}
                        </div>
                      </Table.Td>
                      
                      <Table.Td>
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-sm">
                            <img
                              src={leanerImg}
                              alt="Student"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {row.studentName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Student ID: {row.studentId}
                            </div>
                          </div>
                        </div>
                      </Table.Td>

                      <Table.Td>
                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 inline-block">
                          <span className="font-medium text-red-700 dark:text-red-300">
                            {row.category}
                          </span>
                        </div>
                      </Table.Td>
                      
                      <Table.Td>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg px-3 py-2 inline-block">
                          <span className="font-medium text-yellow-700 dark:text-yellow-300">
                            {row.score}
                          </span>
                        </div>
                      </Table.Td>
                      
                      <Table.Td>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2 inline-block">
                          <span className="font-medium text-blue-700 dark:text-blue-300">
                            {row.date}
                          </span>
                        </div>
                      </Table.Td>
                      
                      <Table.Td>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 inline-block max-w-xs">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {row.comments}
                          </span>
                        </div>
                      </Table.Td>

                      <Table.Td>
                        <div className="flex items-center justify-center space-x-2">
                          <Menu className="inline-block">
                            <Menu.Button className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                              <Lucide icon="MoreHorizontal" className="w-5 h-5" />
                            </Menu.Button>
                            <Menu.Items
                              className="w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 py-2 mt-2"
                              placement="bottom-end"
                            >
                              <Menu.Item className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                                <Lucide icon="Eye" className="w-4 h-4 mr-3 text-blue-500" />
                                View Details
                              </Menu.Item>
                              <Menu.Item className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200">
                                <Lucide icon="Edit" className="w-4 h-4 mr-3 text-green-500" />
                                Edit Assessment
                              </Menu.Item>
                              <Menu.Item className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200">
                                <Lucide icon="Trash2" className="w-4 h-4 mr-3 text-red-500" />
                                Delete Assessment
                              </Menu.Item>
                            </Menu.Items>
                          </Menu>
                        </div>
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
          <h2 className="mt-5 text-xl font-medium flex flex-wrap">
            {learningArea?.name}
          </h2>
          <div className="box mb-5 mt-5 items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 className="mr-auto text-base font-medium border-b p-2">
              Behaviour Assessment
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
                    {typeof errors.grade.message === "string" && errors.grade.message}
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
                    {typeof errors.grade.message === "string" && errors.grade.message}
                  </div>
                )}
              </div>
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
                  {terms.map((term: any, key) => (
                    <option key={key} value={term._id}>
                      {term.name}
                    </option>
                  ))}
                </TomSelect>
                {errors.grade && (
                  <div className="mt-2 text-danger">
                    {typeof errors.grade.message === "string" && errors.grade.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Behaviour</FormLabel>
                <FormSelect
                  {...register("behaviour")}
                  name="behaviour"
                  value={test}
                  onChange={(event: any) => setTest(event.target.value)}
                >
                  <option>Select Test</option>
                  {categories.map((test: any, key) => (
                    <option key={key} value={test._id}>
                      {test.name}
                    </option>
                  ))}
                </FormSelect>
                {errors.grade && (
                  <div className="mt-2 text-danger">
                    {typeof errors.grade.message === "string" && errors.grade.message}
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
        </>
      )}
    </>
  );
}

export default Main;