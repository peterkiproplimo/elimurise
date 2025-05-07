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
import { motion, AnimatePresence } from "framer-motion";
import * as c from "../../utils/constants";

interface TableRow {
  no: number;
  strandName: string;
}

interface Assessment {
  _id: string;
  learner: {
    _id: string;
    first_name: string;
    surname: string;
    last_name: string;
    adm_no: string;
  };
  indicator_description: string;
  score: number;
  uploadUrl: string;
  learning_area: { name: string };
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [assessments, setAssessments] = useState<Assessment[]>([]); // State for assessments

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
  const [previous_page, setPrevious_page] = useState(1);
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

  const generateAssessment = async (learner: any) => {
    const data = {
      learner: learner,
    };
    isLoading(true);
    try {
      if (!data.learner) throw new Error("Select learner to continue");

      // Fetch assessments with uploads
      const res = await ApiService.getLeanerAssessmentReportUploads(data);
      setAssessments(res.assessments || []);

      // Fetch PDF (separate endpoint or query param)
      //   const pdfRes = await ApiService.getLeanerAssessmentReport({
      //     ...data,
      //     format: "pdf", // Hypothetical param for PDF
      //   });
      //   const blob = new Blob([pdfRes], { type: "application/pdf" });
      //   const url = URL.createObjectURL(blob);
      //   window.open(
      //     url,
      //     `width=${window.innerWidth},height=${window.innerHeight},scrollbars=no`
      //   );
      //   setPdfUrl(url);
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
          Learner Portfolio
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
                onChange={(value: any) => {
                  setSelectedLearner(value);
                  generateAssessment(value);
                }}
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
                {typeof errors.learner.message === "string" &&
                  errors.learner.message}
              </div>
            )}
          </div>

          {/* Grade Select */}

          {/* Term Select */}
        </div>
      </div>

      {/* Assessment Report Section */}
      {assessments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 mb-8 transition-all duration-300 hover:shadow-2xl"
        >
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-4 mb-6 flex items-center">
            <Lucide
              icon="BookOpen"
              className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400"
            />
            Assessment Portfolio
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assessments.map((assessment) => (
              <motion.div
                key={assessment._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden"
              >
                {/* Ribbon for score */}
                <div
                  className={`absolute top-0 right-0 w-16 h-16 ${getDescriptionColor(
                    assessment.score
                  )} transform translate-x-4 -translate-y-4 rotate-45`}
                >
                  <span className="absolute bottom-2 left-0 right-0 text-xs font-bold text-white text-center">
                    {assessment.score === 4
                      ? "Exceeding Expectation"
                      : assessment.score === 3
                      ? "Meeting Expectation"
                      : assessment.score === 2
                      ? "Approaching Expectation"
                      : "Below Expectation"}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3 pr-12 line-clamp-2">
                  {assessment.indicator_description}
                </h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <Lucide
                      icon="User"
                      className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
                    />
                    <span>
                      {assessment.learner.first_name}{" "}
                      {assessment.learner.surname}{" "}
                      {assessment.learner.last_name} (
                      {assessment.learner.adm_no})
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                    <Lucide
                      icon="Book"
                      className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
                    />
                    <span>{assessment.learning_area?.name}</span>
                  </p>
                  <p className="text-sm font-medium flex items-center">
                    <Lucide
                      icon="Star"
                      className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
                    />
                    <span className={getDescriptionColor(assessment.score)}>
                      Score:{" "}
                      {assessment.score === 4
                        ? "Exceeding Expectation"
                        : assessment.score === 3
                        ? "Meeting Expectation"
                        : assessment.score === 2
                        ? "Approaching Expectation"
                        : "Below Expectation"}
                    </span>
                  </p>
                </div>
                {assessment.uploadUrl && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                      <Lucide
                        icon="Paperclip"
                        className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
                      />
                      Attachment
                    </p>
                    {assessment.uploadUrl.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <Tippy content="Click to preview image">
                        <img
                          src={c.IMG_URL + "/" + assessment.uploadUrl}
                          alt={assessment.indicator_description}
                          className="w-32 h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200"
                          onClick={() =>
                            setPreviewImage(
                              c.IMG_URL + "/" + assessment.uploadUrl
                            )
                          }
                        />
                      </Tippy>
                    ) : (
                      <Tippy content="Download file">
                        <a
                          href={c.IMG_URL + "/" + assessment.uploadUrl}
                          download
                          className="text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200"
                        >
                          <Lucide icon="Download" className="w-5 h-5" />
                          <span className="text-sm">Download File</span>
                        </a>
                      </Tippy>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <Dialog
            open={!!previewImage}
            onClose={() => setPreviewImage(null)}
            staticBackdrop
            size="lg"
          >
            <Dialog.Panel>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    Image Preview
                  </h3>
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <Lucide icon="X" className="w-6 h-6" />
                  </button>
                </div>
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full max-h-[70vh] object-contain rounded-lg"
                />
              </motion.div>
            </Dialog.Panel>
          </Dialog>
        )}
      </AnimatePresence>

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
