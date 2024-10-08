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

interface TableRow {
  no: number;
  strandName: string;
}

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef(null);
  const [learningAreas, setLearningAreas] = useState([]);
  const [academicYear, setAcademicYears] = useState([]);
  const [terms, setTerms] = useState([]);

  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");

  const [strands, setStrands] = useState([]);
  // const [learner, setLearner] = useState("");
  const [substrand, setSubstrand] = useState<any>({});
  const [indicator, setIndicator] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedLeaningArea, setSelectedLearningArea] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedLearner, setSelectedLearner] = useState("");

  const [learners, setLearners] = useState<any>([]);
  const [strand, setStrand] = useState("");
  const [learnerReport, setLearnerReport] = useState<any>([]);

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

  const getLearningAreas = async () => {
    const response = await ApiService.getLeanerLeaningArea({
      term: selectedTerm,
      learner: selectedLearner,
    });
    setLearningAreas(response.data);
  };
  const getLearningAcademicYear = async () => {
    const response = await ApiService.getLeanerAcademicYear({
      learner: selectedLearner,
    });
    setAcademicYears(response.data);
  };
  useEffect(() => {
    getLeaners();
  }, []);
  const getLeaners = async () => {
    const response = await ApiService.parentDashboard();

    setLearners(response.learners);
  };

  const getLearningTerm = async () => {
    const response = await ApiService.getLeanerTerm({
      academic_year: selectedAcademicYear,
    });
    setTerms(response.data);
  };
  useEffect(() => {
    getLearningAcademicYear();
  }, [selectedLearner]);
  useEffect(() => {
    console.log(selectedAcademicYear);
    getLearningTerm();
  }, [selectedAcademicYear]);
  useEffect(() => {
    getLearningAreas();
  }, [selectedTerm]);
  const notify = useRef<NotificationElement>();
  const generateAssessment = async () => {
    const data = {
      term: selectedTerm,
      learning_area: selectedLeaningArea,
      learner: selectedLearner,
    };
    console.log(data);
    isLoading(true);
    try {
      let res = await ApiService.getLeanerAssessmentReport(data);
      setLearnerReport(res);
      // setEnrollments(res);
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
          <form className="mt-5 p-5 intro-y validate-form  ">
            <div className="assessment-header">
              <h2 className="text-xl flex items-center font-semibold mb-5">
                <a
                  onClick={(event: React.MouseEvent) => {
                    event.preventDefault();

                    setDialog(false);
                  }}
                  href="#"
                >
                  <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
                </a>{" "}
                Learner Report
              </h2>
              {/* <div className="meta-info grid grid-cols-2 gap-x-4 p-4 bg-white rounded-lg shadow-md">
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
                    {substrand?.name}
                  </span>
                </div>
                <div className="meta-row flex items-center mb-2">
                  <label className="font-semibold text-md text-gray-700">
                    Indicator:
                  </label>
                </div>
                <div className="meta-row flex items-center col-span-2 mt-0.5">
                  <Loader className="text-success animate-spin mr-2" />

                  <span className="text-sm text-success font-medium">
                    (Auto-saving)
                  </span>
                </div>
              </div> */}
            </div>
            <div className="grid min-h-screen place-items-center bg-white-400 print:min-h-0 mt-5">
              <main className="m-4 h-[297mm] w-[380mm] overflow-y-auto rounded-md bg-white p-8 shadow-lg print:m-0 print:h-screen print:w-screen print:rounded-none print:shadow-none">
                <div className=" overflow-hidden intro-y box">
                  <div className="flex flex-col  text-center lg:flex-row justify-between sm:px-20 sm:pt-20 lg:pb-1 sm:text-left up-part">
                    <div className="text-base text-slate-500lg:ml-auto lg:text-left flex">
                      <div>
                        <img
                          src={logo}
                          alt="Learner"
                          className="w-32 h-32 mb-2"
                        />
                      </div>

                      <div className="text-lg font-semibold text-primary ml-5">
                        Name:
                        <br />
                        Adm No:
                        <br />
                        Year:
                        <br />
                        Term:
                        <br />
                      </div>
                    </div>
                    <div className="mt-2 topic">
                      <div></div>
                    </div>
                  </div>
                  <div className="px- py-2 sm:px-16 sm:py-20 mt-5">
                    <div className="text-center font-bold text-xl mb-5">
                      Performance Report
                    </div>
                    <Table className="border">
                      <Table.Thead>
                        <Table.Tr className="bg-secondary ">
                          <Table.Th className="border-b-0 whitespace-nowrap">
                            Strand
                          </Table.Th>
                          <Table.Th className="border-b-0 whitespace-nowrap text-left">
                            Substrand
                          </Table.Th>
                          <Table.Th className="border-b-0 whitespace-nowrap text-left">
                            Learning Area
                          </Table.Th>
                          <Table.Th className="border-b-0 whitespace-nowrap text-center">
                            Indicator Description
                          </Table.Th>
                          <Table.Th className="border-b-0 whitespace-nowrap text-left">
                            Score
                          </Table.Th>
                          <Table.Th className="border-b-0 whitespace-nowrap text-center">
                            Description
                          </Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody className="bg-white divide-y divide-gray-300 dark:divide-gray-700 dark:bg-gray-900 ">
                        {learnerReport?.assessment?.map(
                          (enrollment: any, index: any) => (
                            <Table.Tr key={index} className="bg-secondary">
                              <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                {enrollment.strand.name}
                              </Table.Td>
                              <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                {enrollment.substrand.name}
                              </Table.Td>
                              <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                {enrollment.learning_area.name}
                              </Table.Td>
                              <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                {enrollment.indicator_description}
                              </Table.Td>
                              <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                {enrollment.score}
                              </Table.Td>
                              <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                {enrollment.description}
                              </Table.Td>
                            </Table.Tr>
                          )
                        )}
                      </Table.Tbody>
                    </Table>
                    {loading && (
                      <div className="flex flex-col items-center mt-5">
                        <LoadingIcon
                          icon="spinning-circles"
                          className="w-8 h-8"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </main>
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
              Learner Report
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-10">
              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Learner</FormLabel>
                <TomSelect
                  {...register("learner")}
                  value={selectedLearner}
                  name="term"
                  onChange={(event: any) => setSelectedLearner(event)}
                >
                  <option>Select Learner</option>
                  {learners.map((learner: any) => (
                    <option value={learner.learner._id}>
                      {learner.stream.grade.name}
                      {learner.learner.surname}
                    </option>
                  ))}
                </TomSelect>
                {errors.term && (
                  <div className="mt-2 text-danger">
                    {typeof errors.term.message === "string" &&
                      errors.term.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Class</FormLabel>
                <TomSelect
                  {...register("term")}
                  value={selectedAcademicYear}
                  name="term"
                  onChange={(event: any) => setSelectedAcademicYear(event)}
                >
                  <option>Select Term</option>
                  {academicYear.map((year: any, key) => (
                    <option key={key} value={year.academicYear._id}>
                      {year.stream.grade.name}
                    </option>
                  ))}
                </TomSelect>
                {errors.term && (
                  <div className="mt-2 text-danger">
                    {typeof errors.term.message === "string" &&
                      errors.term.message}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Term</FormLabel>
                <TomSelect
                  {...register("term")}
                  value={selectedTerm}
                  name="term"
                  onChange={(event: any) => setSelectedTerm(event)}
                >
                  <option>Select Term</option>
                  {terms.map((term: any, key) => (
                    <option key={key} value={term._id}>
                      {term.name}
                    </option>
                  ))}
                </TomSelect>
                {errors.term && (
                  <div className="mt-2 text-danger">
                    {typeof errors.term.message === "string" &&
                      errors.term.message}
                  </div>
                )}
              </div>

              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Learning Area</FormLabel>
                <TomSelect
                  {...register("learning_area")}
                  value={selectedLeaningArea}
                  name="learning_area"
                  onChange={(event: any) => setSelectedLearningArea(event)}
                >
                  <option>Select Learning Area</option>
                  {learningAreas?.map((filteredArea: any, key) => (
                    <option key={key} value={filteredArea?._id}>
                      {filteredArea.name}
                    </option>
                  ))}
                </TomSelect>
                {errors.learning_area && (
                  <div className="mt-2 text-danger">
                    {typeof errors.learning_area.message === "string" &&
                      errors.learning_area.message}
                  </div>
                )}
              </div>

              {/* {substrands.map((substrand: any, key: any) => (
                <span>{substrand.name}</span>
              ))} */}
            </div>
            <div className="px-5  text-right">
              <Button
                onClick={() => generateAssessment()}
                variant="primary"
                type="button"
                className="w-50 text-white"
              >
                Generate Report
              </Button>
            </div>
          </div>

          {/* BEGIN: Delete Confirmation Modal */}

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
