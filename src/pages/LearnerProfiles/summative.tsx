import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import { FormLabel } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { useForm } from "react-hook-form";
import LoadingIcon from "../../base-components/LoadingIcon";
import TomSelect from "../../base-components/TomSelect";
import * as ApiService from "../../services/auth";
import { useLocation } from "react-router-dom";
import Notification, {
  NotificationElement,
} from "../../base-components/Notification";
function Main() {
  // State for data
  const [learners, setLearners] = useState([]);
  const [grade, setGrade] = useState([]);
  const [tests, setTests] = useState([]);
  const terms = [
    { _id: 1, name: "Term 1" },
    { _id: 2, name: "Term 2" },
    { _id: 3, name: "Term 3" },
  ];

  // State for selections
  const [selectedLearner, setSelectedLearner] = useState("");
  const [selectedLearnerObj, setSelectedLearnerObj] = useState({});
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [test, setTest] = useState("");

  // Loading states for selects
  const [learnersLoading, setLearnersLoading] = useState(false);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [testsLoading, setTestsLoading] = useState(false);

  // State for notification and loading
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const notify = useRef<NotificationElement>();

  // Form handling
  const {
    register,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  // Location for learning area
  const location = useLocation();
  const learningArea = location?.state?.data;

  // Fetch learners on mount
  useEffect(() => {
    getLearners();
  }, []);

  // Fetch grades when learner changes
  useEffect(() => {
    if (selectedLearner) getLearnerClasses();
  }, [selectedLearner]);

  // Fetch tests when dependencies change
  useEffect(() => {
    if (selectedLearner && selectedTerm && selectedAcademicYear) getTests();
  }, [selectedLearner, selectedTerm, selectedAcademicYear]);

  // API functions with loading states
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
    if (!selectedLearner) return;
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

  const getTests = async () => {
    if (!selectedLearner || !selectedTerm || !selectedAcademicYear) return;
    setTestsLoading(true);
    try {
      const response = await ApiService.getLeanerTests({
        learner: selectedLearner,
        term: selectedTerm,
        session: selectedAcademicYear,
      });
      setTests(response.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setTestsLoading(false);
    }
  };

  const generateAssessment = async () => {
    const data = {
      term: selectedTerm,
      learner: selectedLearner,
      test,
      session: selectedAcademicYear,
    };
    setLoading(true);
    try {
      if (!selectedLearner) throw new Error("Select learner to continue");
      if (!selectedTerm) throw new Error("Select term to continue");
      if (!test) throw new Error("Select test to continue");
      const res = await ApiService.getSummativeForParent(data);
      const blob = new Blob([res], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(
        url,
        `width=${window.innerWidth},height=${window.innerHeight},scrollbars=no`
      );
      setSuccess(true);
      setMessage("Report generated successfully");
      notify.current?.showToast();
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.message);
      notify.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 min-h-screen">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        {learningArea?.name || "Learner Reports"}
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          Generate Learner Report
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Learner Select */}
          <div className="col-span-1">
            <FormLabel
              htmlFor="learner"
              className="text-gray-600 dark:text-gray-300 font-medium mb-1"
            >
              Learner
            </FormLabel>
            <div className="relative">
              <TomSelect
                {...register("learner")}
                value={selectedLearner}
                name="learner"
                onChange={(value: any) => {
                  const selectedId = value;
                  const fullLearner = learners.find(
                    (l: any) => l._id === selectedId
                  );
                  setSelectedLearner(selectedId);
                  setSelectedLearnerObj(fullLearner || {});
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
                {errors.learner?.message?.toString()}
              </div>
            )}
          </div>

          {/* Grade Select */}
          <div className="col-span-1">
            <FormLabel
              htmlFor="grade"
              className="text-gray-600 dark:text-gray-300 font-medium mb-1"
            >
              Grade
            </FormLabel>
            <div className="relative">
              <TomSelect
                {...register("grade")}
                value={selectedAcademicYear}
                name="grade"
                onChange={(value: any) => setSelectedAcademicYear(value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="">Select Grade</option>
                {grade.map((g: any, key: any) => (
                  <option key={key} value={g.session}>
                    {g.grade}-{g.stream}
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
                {errors.grade.message?.toString()}
              </div>
            )}
          </div>

          {/* Term Select */}
          <div className="col-span-1">
            <FormLabel
              htmlFor="term"
              className="text-gray-600 dark:text-gray-300 font-medium mb-1"
            >
              Term
            </FormLabel>
            <TomSelect
              {...register("term")}
              value={selectedTerm}
              name="term"
              onChange={(value: any) => setSelectedTerm(value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <option value="">Select Term</option>
              {terms.map((term) => (
                <option key={term._id} value={term._id}>
                  {term.name}
                </option>
              ))}
            </TomSelect>
            {errors.term && (
              <div className="mt-1 text-red-500 text-sm">
                {errors.term?.message?.toString()}
              </div>
            )}
          </div>

          {/* Test Select */}
          <div className="col-span-1">
            <FormLabel
              htmlFor="test"
              className="text-gray-600 dark:text-gray-300 font-medium mb-1"
            >
              Test
            </FormLabel>
            <div className="relative">
              <TomSelect
                {...register("test")}
                value={test}
                name="test"
                onChange={(value: any) => setTest(value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <option value="">Select Test</option>
                {tests
                  .filter((t: any) => t.isPublished === true)
                  .map((t: any, key) => (
                    <option key={key} value={t._id}>
                      {t.name}
                    </option>
                  ))}
              </TomSelect>
              {testsLoading && (
                <LoadingIcon
                  icon="spinning-circles"
                  className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                />
              )}
            </div>
            {errors.test && (
              <div className="mt-1 text-red-500 text-sm">
                {errors.test?.message?.toString()}
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={generateAssessment}
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

      {/* Notification */}
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
