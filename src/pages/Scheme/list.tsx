import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faBuilding,
  faEye,
  faDownload,
  faCaretDown,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import * as ApiService from "../../services/auth";

interface LoadingSpinnerProps {
  className?: string;
}
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <svg
      className="animate-spin h-8 w-8 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  isLoading?: boolean;
}
const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  isLoading = false,
  ...props
}) => (
  <motion.button
    className={`px-4 py-2 rounded flex items-center justify-center ${className}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    disabled={isLoading || props.disabled}
    {...props}
  >
    {isLoading ? <LoadingSpinner className="h-5 w-5" /> : children}
  </motion.button>
);

interface NotificationProps {
  children: React.ReactNode;
  getRef?: (el: HTMLDivElement | null) => void;
  className?: string;
  options?: { duration: number };
}
const Notification: React.FC<NotificationProps> = ({
  children,
  getRef,
  className = "",
  options,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (getRef) getRef(ref.current);
    if (ref.current && options?.duration) {
      const timeout = setTimeout(() => ref.current?.remove(), options.duration);
      return () => clearTimeout(timeout);
    }
  }, [getRef, options?.duration]);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`flex p-4 rounded-lg shadow-lg bg-white ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface Grade {
  _id: string;
  name: string;
}
interface LearningArea {
  _id: string;
  grade_id: string;
  name: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  short_name?: string;
}
interface Scheme {
  _id: string;
  grade?: Grade;
  learning_area: LearningArea;
  term: string;
  year: string;
  strands?: string[];
  substrands?: string[];
  lessonsPerWeek?: string;
  firstWeek?: string;
  firstLesson?: string;
  lastWeek?: string;
  lastLesson?: string;
  doubleLesson?: string;
  breaks: BreakItem[];
  createdAt: string;
  updatedAt: string;
  reference_book?: string;
  created_by?: any;
  weeks?: Week[];
  paid?: boolean;
  school?: string;
}
interface BreakItem {
  title: string;
  duration: string;
  startWeek: string;
  startLesson: string;
  endWeek: string;
  endLesson: string;
  _id?: string;
}
interface Week {
  week: number;
  lessons: { scheme_lesson: SchemeLesson }[];
}
interface SchemeLesson {
  lesson_number: string;
  learning_outcome?: string;
  suggested_learning_experiences?: string;
  key_inquiry_questions?: string;
  suggested_learning_resources?: string;
  suggested_assessment_methods?: string;
}

const SchemeList: React.FC = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [learningAreas, setLearningAreas] = useState<LearningArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [downloadLoading, setDownloadLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const notify = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const gradesResponse = await ApiService.getGrades({ page: 1 });
        setGrades(gradesResponse.data);
        const learningAreasResponse = await ApiService.getLearningAreas({
          page: 1,
          limit: 100,
          search: "",
        });
        setLearningAreas(learningAreasResponse.data);
        const schemesResponse = await ApiService.getScheme({
          page: 1,
          limit: 100,
        });
        const normalizedSchemes = schemesResponse.data.map(
          (scheme: Scheme) => ({
            ...scheme,
            grade: scheme.learning_area.grade_id,
            learning_area: scheme.learning_area,
            term: String(scheme.term),
            year: String(scheme.year),
            breaks: scheme.breaks.map((b: BreakItem) => ({
              ...b,
              startWeek: String(b.startWeek),
              startLesson: String(b.startLesson),
              endWeek: String(b.endWeek),
              endLesson: String(b.endLesson),
            })),
            firstWeek: scheme.weeks
              ? String(Math.min(...scheme.weeks.map((w) => w.week)))
              : undefined,
            firstLesson: scheme.weeks ? "1" : undefined,
            lastWeek: scheme.weeks
              ? String(Math.max(...scheme.weeks.map((w) => w.week)))
              : undefined,
            lastLesson: scheme.weeks
              ? String(
                  scheme.weeks.reduce(
                    (max, w) =>
                      w.week === Math.max(...scheme.weeks.map((w) => w.week))
                        ? w.lessons.length
                        : max,
                    0
                  )
                )
              : undefined,
            school: scheme.created_by?.school || "Unknown",
            paid: scheme.paid ?? false,
          })
        );
        setSchemes(normalizedSchemes);
        setSuccess(true);
        setMessage("");
      } catch (err: any) {
        setSuccess(false);
        setMessage(
          err.response?.data?.message ||
            "Failed to fetch schemes or related data"
        );
        notify.current?.classList.add("block");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDownload = async (schemeId: string, margin: string = "") => {
    setDownloadLoading((prev) => ({ ...prev, [schemeId]: true }));
    try {
      await ApiService.downloadScheme(schemeId, { margin });
      setSuccess(true);
      setMessage("Scheme downloaded successfully!");
      notify.current?.classList.add("block");
    } catch (err: any) {
      setSuccess(false);
      setMessage(err.response?.data?.message || "Failed to download scheme");
      notify.current?.classList.add("block");
    } finally {
      setDownloadLoading((prev) => ({ ...prev, [schemeId]: false }));
    }
  };

  const handlePreview = (scheme: Scheme) => {
    navigate("/home/schemes/list/" + scheme._id, {
      state: {
        scheme,
        grades,
        learningAreas,
      },
    });
  };

  const getGradeName = (gradeId?: string) =>
    gradeId
      ? grades.find((g) => g._id === gradeId)?.name || gradeId
      : "Unknown Grade";
  const getLearningAreaName = (learningAreaId: string | LearningArea) =>
    typeof learningAreaId === "string"
      ? learningAreas.find((la) => la._id === learningAreaId)?.name ||
        learningAreaId
      : learningAreaId.name;
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-white shadow"
      >
        <h2 className="text-lg font-medium flex items-center">
          <a
            onClick={() => navigate("/home/schemes/list", { replace: true })}
            className="mr-5 cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faCalendar}
              className="text-gray-400 w-5 h-5"
            />
          </a>
          Schemes of Work
        </h2>
      </motion.div>

      <section className="flex-1 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex items-center justify-center h-64">
              <LoadingSpinner className="h-12 w-12" />
            </div>
          ) : schemes.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              No schemes found.
            </p>
          ) : (
            schemes.map((scheme) => (
              <div key={scheme._id} className="col-span-1">
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex flex-col justify-between h-full">
                  {/* Header */}
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                    <span className="font-medium">{scheme.grade.name}</span>
                    <span className="text-xs text-gray-400">
                      ID: {scheme._id}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex gap-4">
                    {/* Info Section */}
                    <div className="w-2/3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {getLearningAreaName(scheme.learning_area)}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <b>
                          Term {scheme.term} - {scheme.year}
                        </b>
                      </p>
                      <ul className="text-sm text-gray-500 space-y-1 mb-2">
                        <li className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faCalendar} />
                          {formatDate(scheme.createdAt)}
                        </li>
                        <li className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faBuilding} />
                          {scheme.school || "Unknown"}
                        </li>
                      </ul>
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                          scheme.paid
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {!scheme.paid ? "Draft" : "Approved"}
                      </span>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-1/3 flex justify-center items-center">
                      <img
                        src="https://schemesofwork.com/client/images/pdf.png"
                        alt="PDF"
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex justify-between items-center mt-4 flex-wrap gap-2">
                    <div className="flex gap-2">
                      <Button
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm px-3 py-1 rounded-md"
                        onClick={() => handlePreview(scheme)}
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        Preview
                      </Button>
                      <Button
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-md"
                        isLoading={downloadLoading[scheme._id]}
                        onClick={() => handleDownload(scheme._id)}
                      >
                        <FontAwesomeIcon icon={faDownload} className="mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="card-footer"></div>
      </section>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800 text-white p-4 mt-auto"
      >
        <div className="container mx-auto">
          <span>Copyright © 2014-2025 Schemes. All rights reserved.</span>
        </div>
      </motion.footer>

      <AnimatePresence>
        {message && (
          <Notification
            options={{ duration: 3000 }}
            getRef={(el) => (notify.current = el)}
            className="absolute top-4 right-4 z-50 shadow-lg"
          >
            <FontAwesomeIcon
              icon={faCheckCircle}
              className={success ? "text-green-500" : "text-red-500"}
            />
            <div className="ml-4 mr-4">
              <div className="font-medium text-gray-800">
                {success ? "Success" : "Failed"}
              </div>
              <div className="mt-1 text-gray-500">{message}</div>
            </div>
          </Notification>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchemeList;
