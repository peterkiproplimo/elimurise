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
  const [pdfUrl, setPdfUrl] = useState("");
  const terms = [
    { _id: 1, name: "Term 1" },
    { _id: 2, name: "Term 2" },
    { _id: 3, name: "Term 3" },
  ];
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");

  // Loading states for select inputs
  const [learnersLoading, setLearnersLoading] = useState(false);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [termsLoading, setTermsLoading] = useState(false);
  const [learningAreasLoading, setLearningAreasLoading] = useState(false);

  const [strands, setStrands] = useState([]);
  const [substrand, setSubstrand] = useState<any>({});
  const [indicator, setIndicator] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedLearningArea, setSelectedLearningArea] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedLearner, setSelectedLearner] = useState("");
  const [grade, setGrade] = useState<any>([]);

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

  const getLearningAreas = async () => {
    setLearningAreasLoading(true);
    try {
      const response = await ApiService.getLeanerLeaningArea({
        term: selectedTerm,
        learner: selectedLearner,
        session: selectedAcademicYear,
      });
      setLearningAreas(response.data);
    } catch (error) {
      console.error("Error fetching learning areas:", error);
    } finally {
      setLearningAreasLoading(false);
    }
  };

  const getLearners = async () => {
    setLearnersLoading(true);
    try {
      const response = await ApiService.parentDashboard();
      setLearners(response.learners);
    } catch (error) {
      console.error("Error fetching learners:", error);
    } finally {
      setLearnersLoading(false);
    }
  };

  const getLearnerClasses = async () => {
    setGradesLoading(true);
    try {
      const response = await ApiService.leanerClasses({
        learner: selectedLearner,
      });
      setGrade(response.data);
    } catch (error) {
      console.error("Error fetching learner classes:", error);
    } finally {
      setGradesLoading(false);
    }
  };

  useEffect(() => {
    getLearners();
  }, []);

  useEffect(() => {
    if (selectedLearner) {
      getLearnerClasses();
    }
  }, [selectedLearner]);

  useEffect(() => {
    if (selectedTerm && selectedLearner && selectedAcademicYear) {
      getLearningAreas();
    }
  }, [selectedTerm, selectedLearner, selectedAcademicYear]);

  const notify = useRef<NotificationElement>();

  const generateAssessment = async () => {
    const data = {
      term: selectedTerm,
      learning_area: selectedLearningArea,
      learner: selectedLearner,
      session: selectedAcademicYear,
    };
    isLoading(true);
    try {
      if (!data.learner) throw new Error("Select learner to continue");
      if (!data.term) throw new Error("Select term to continue");
      if (!data.learning_area)
        throw new Error("Select learning area to continue");
      if (!data.session) throw new Error("Select test to continue");
      const res = await ApiService.getLeanerAssessmentReport(data);
      const blob = new Blob([res], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(
        url,
        `width=${window.innerWidth},height=${window.innerHeight},scrollbars=no`
      );
      setPdfUrl(url);
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.message);
      notify.current?.showToast();
    } finally {
      isLoading(false);
    }
  };

  const getDescriptionColor = (score: any) => {
    switch (score) {
      case 4:
        return "text-green-600";
      case 3:
        return "text-blue-600";
      case 2:
        return "text-yellow-600";
      case 1:
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        <Lucide icon="BookOpen" className="w-6 h-6 mr-2 text-blue-600" />
        {learningArea?.name || "Learner Report Dashboard"}
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transition-all duration-300 hover:shadow-xl">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
          Generate Learner Report
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Learner Select */}
          <div>
            <FormLabel
              htmlFor="learner"
              className="text-gray-600 dark:text-gray-300 font-medium"
            >
              Learner
            </FormLabel>
            <div className="relative">
              <TomSelect
                {...register("learner")}
                value={selectedLearner}
                name="learner"
                onChange={(value) => setSelectedLearner(value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="">Select Learner</option>
                {learners
                  .filter((learner: any) => learner.status !== "D")
                  .map((learner: any) => (
                    <option key={learner._id} value={learner._id}>
                      {learner.adm_no} - {learner.first_name} {learner.surname}{" "}
                      {learner.last_name}
                    </option>
                  ))}
              </TomSelect>
              {learnersLoading && (
                <LoadingIcon
                  icon="spinning-circles"
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                />
              )}
            </div>
            {errors.learner && (
              <div className="mt-1 text-red-500 text-sm">
                {errors.learner.message}
              </div>
            )}
          </div>

          {/* Grade Select */}
          <div>
            <FormLabel
              htmlFor="grade"
              className="text-gray-600 dark:text-gray-300 font-medium"
            >
              Grade
            </FormLabel>
            <div className="relative">
              <TomSelect
                {...register("grade")}
                value={selectedAcademicYear}
                name="grade"
                onChange={(value) => setSelectedAcademicYear(value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="">Select Grade</option>
                {grade.map((grade: any, key: any) => (
                  <option key={key} value={grade.session}>
                    {grade.grade} - {grade.stream}
                  </option>
                ))}
              </TomSelect>
              {gradesLoading && (
                <LoadingIcon
                  icon="spinning-circles"
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                />
              )}
            </div>
            {errors.grade && (
              <div className="mt-1 text-red-500 text-sm">
                {errors.grade.message}
              </div>
            )}
          </div>

          {/* Term Select */}
          <div>
            <FormLabel
              htmlFor="term"
              className="text-gray-600 dark:text-gray-300 font-medium"
            >
              Term
            </FormLabel>
            <div className="relative">
              <TomSelect
                {...register("term")}
                value={selectedTerm}
                name="term"
                onChange={(value) => setSelectedTerm(value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="">Select Term</option>
                {terms.map((term: any) => (
                  <option key={term._id} value={term._id}>
                    {term.name}
                  </option>
                ))}
              </TomSelect>
              {termsLoading && (
                <LoadingIcon
                  icon="spinning-circles"
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                />
              )}
            </div>
            {errors.term && (
              <div className="mt-1 text-red-500 text-sm">
                {errors.term.message}
              </div>
            )}
          </div>

          {/* Learning Area Select */}
          <div>
            <FormLabel
              htmlFor="learning_area"
              className="text-gray-600 dark:text-gray-300 font-medium"
            >
              Learning Area
            </FormLabel>
            <div className="relative">
              <TomSelect
                {...register("learning_area")}
                value={selectedLearningArea}
                name="learning_area"
                onChange={(value) => setSelectedLearningArea(value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="">Select Learning Area</option>
                {learningAreas.map((area: any) => (
                  <option key={area._id} value={area._id}>
                    {area.name}
                  </option>
                ))}
              </TomSelect>
              {learningAreasLoading && (
                <LoadingIcon
                  icon="spinning-circles"
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                />
              )}
            </div>
            {errors.learning_area && (
              <div className="mt-1 text-red-500 text-sm">
                {errors.learning_area.message}
              </div>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={generateAssessment}
            variant="primary"
            className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200 flex items-center"
            disabled={loading}
          >
            Generate Report
            {loading && (
              <LoadingIcon icon="spinning-circles" className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>
      </div>

      <Notification
        options={{ duration: 3000 }}
        getRef={(el) => {
          notify.current = el;
        }}
        className="flex items-center bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4"
      >
        <Lucide
          icon={success ? "CheckCircle" : "XCircle"}
          className={`w-6 h-6 ${success ? "text-green-500" : "text-red-500"}`}
        />
        <div className="ml-4">
          <div className="font-semibold text-gray-800 dark:text-gray-200">
            {success ? "Success" : "Failed"}
          </div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            {message}
          </div>
        </div>
      </Notification>
    </div>
  );
}

export default Main;
