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
  const [academicYear, setAcademicYears] = useState<any>([]);
  const [grade, setGrade] = useState<any>([]);

  // const [terms, setTerms] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const terms = [
    { _id: 1, name: "Term 1" },
    { _id: 2, name: "Term 2" },
    { _id: 3, name: "Term 3" },
  ];
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
  const [selectedLearner, setSelectedLearner] = useState<any>("");
  const [selectedLearnerObj, setSelectedLearnerObj] = useState<any>({});

  const [test, setTest] = useState("");

  const [learners, setLearners] = useState<any>([]);
  const [strand, setStrand] = useState("");
  const [learnerReport, setLearnerReport] = useState<any>([]);
  const [tests, setTests] = useState<any>([]);
  const [yearFrom, setYearFrom] = useState(2020);
  const [yearTo, setYearTo] = useState(2020);

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
  const generateAcademicYears = () => {
    console.log(selectedLearnerObj);
    const currentYear = new Date().getFullYear();
    const yearsBack = 5;
    const yearsForward = 7;
    const years = [];

    for (let i = Number(2020); i <= 2027; i++) {
      years.push(`${i}-${i + 1}`);
    }

    setAcademicYears(years);
  };
  useEffect(() => {
    getLeaners();
  }, []);
  const getLeaners = async () => {
    const response = await ApiService.parentDashboard();

    setLearners(response.learners);
  };
  const getLeanerClasses = async () => {
    const response = await ApiService.leanerClasses({
      learner: selectedLearner,
    });

    setGrade(response.data);
  };

  const getTests = async () => {
    const response = await ApiService.getLeanerTests({
      learner: selectedLearner,
      term: selectedTerm,
      session: selectedAcademicYear,
    });

    setTests(response.data);
  };
  useEffect(() => {
    console.log(selectedLearnerObj);
    getLeanerClasses();
  }, [selectedLearner]);
  useEffect(() => {
    getTests();

    // getLearningAreas();
  }, [selectedTerm, selectedAcademicYear]);
  const notify = useRef<NotificationElement>();
  const generateAssessment = async () => {
    const data = {
      term: selectedTerm,
      learner: selectedLearner,
      test,
      session: selectedAcademicYear,
    };
    isLoading(true);
    try {
      if (selectedLearner == "") {
        throw Error("Select learner to continue");
      } else if (selectedTerm == "") {
        throw Error("Select term to continue");
      } else if (test == "") {
        throw Error("Select test to continue");
      }
      let res = await ApiService.getSummativeForParent(data);
      const blob = new Blob([res], { type: "application/pdf" });
      //   const url = URL.createObjectURL(blob);
      //   isLoading(true);      const blob = new Blob([res], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const popup = window.open(
        url,

        `width=${window.innerWidth},height=${window.innerHeight},scrollbars=no`
      );

      setPdfUrl(url);
      // setEnrollments(res);
      // const pagination = res.pagination;
      // setPagination({
      //   current_page: pagination.current_page,
      //   total: pagination.total,
      //   total_pages: pagination.total_pages,
      //   per_page: pagination.per_page,
      // });
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
          <form className="mt-5 p-5  validate-form  ">
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
          </form>
        </>
      ) : (
        <>
          <h2 className="mt-5 text-xl font-medium  flex flex-wrap">
            {learningArea?.name}
          </h2>
          <div className=" box mb-5 mt-5 items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
            <h2 className="mr-auto text-base font-medium border-b p-2">
              Learner Report
            </h2>
            <div className="grid grid-cols-6 gap-2 mt-10">
              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Learner</FormLabel>
                <TomSelect
                  {...register("learner")}
                  value={selectedLearner}
                  name="term"
                  onChange={(event: any) => {
                    const selectedId = event;
                    const fullLearner = learners.find(
                      (learner: any) => learner._id === selectedId
                    );
                    console.log(fullLearner);

                    setSelectedLearner(selectedId); // Set the entire learner object
                    setSelectedLearnerObj(fullLearner);
                  }}
                >
                  <option value={""}>Select Learner</option>
                  {learners.map((learner: any) => (
                    <option value={learner._id}>
                      {learner.adm_no}-{learner.first_name} {learner.surname}{" "}
                      {learner.last_name}
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
                {/* {JSON.stringify(academicYear)} */}
                <FormLabel htmlFor="modal-form-6">Grade </FormLabel>
                <TomSelect
                  {...register("grade")}
                  value={selectedAcademicYear}
                  name="grade"
                  onChange={(event: any) => setSelectedAcademicYear(event)}
                >
                  <option value={""}>Select Grade</option>
                  {grade.map((grade: any, key: any) => (
                    <option key={key} value={grade.session}>
                      {grade.grade}-{grade.stream}
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
                  <option value={""}>Select Term</option>
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
                <FormLabel htmlFor="modal-form-6">Test</FormLabel>
                <TomSelect
                  {...register("test")}
                  value={test}
                  name="test"
                  onChange={(event: any) => setTest(event)}
                >
                  <option value={""}>Select Test</option>
                  {tests.map((test: any, key: any) => (
                    <option key={key} value={test._id}>
                      {test.name}
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

              {/* {substrands.map((substrand: any, key: any) => (
                <span>{substrand.name}</span>
              ))} */}
            </div>
            <div className="p-5 mt-3  text-right">
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
