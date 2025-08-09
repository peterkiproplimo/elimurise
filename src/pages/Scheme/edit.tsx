import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import DOMPurify from "dompurify";
import * as ApiService from "../../services/auth";

// Custom debounce hook
const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

// LoadingSpinner Component
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

// Button Component
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

// Notification Component
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
      const timeout = setTimeout(() => {
        if (ref.current) ref.current.style.display = "none";
      }, options.duration);
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

// Interfaces
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
  learning_area: LearningArea | string;
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
  lessons: { scheme_lesson: SchemeLesson; scheme_lesson_id?: string }[];
  isBreak?: boolean;
  breakTitle?: string;
}
interface SchemeLesson {
  _id: string;
  lesson_number: string;
  learning_outcome?: string;
  suggested_learning_experiences?: string;
  key_inquiry_questions?: string;
  suggested_learning_resources?: string;
  suggested_assessment_methods?: string;
  reflection?: string;
  substrand?: { name?: string; strand?: { name?: string } };
}

// SchemeEdit Component
const SchemeEdit: React.FC = () => {
  const { schemeId } = useParams<{ schemeId: string }>();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const notify = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [notificationKey, setNotificationKey] = useState(0);
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        setMessage("");
        setNotificationKey((prev) => prev + 1); // Increment key to force re-render
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);
  // State to track the last edited field
  const [editedField, setEditedField] = useState<{
    scheme_lesson_id: string;
    week: number;
    lessonIndex: number;
    field: keyof SchemeLesson;
    value: string;
  } | null>(null);

  // Sanitize HTML input to prevent XSS
  const sanitizeInput = (input: string) => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ["b", "i", "u", "p", "br"],
    });
  };

  // Save logic
  // const saveScheme = async () => {
  //   if (!scheme || !schemeId || !editedField) return;

  //   setSaving(true);
  //   try {
  //     // Prepare minimal payload with scheme_lesson_id, field, and value
  //     const updatedScheme = {
  //       scheme_lesson_id: editedField.scheme_lesson_id,
  //       field: editedField.field,
  //       value: editedField.value,
  //     };

  //     // Log updated scheme data
  //     console.log("Submitting Edited Scheme Lesson:", updatedScheme);

  //     await ApiService.updateScheme(schemeId, updatedScheme);
  //     setSuccess(true);
  //     setMessage("Scheme lesson updated successfully!");
  //     // Clear edited state after successful save
  //     // setEditedField(null);
  //   } catch (err: any) {
  //     setSuccess(false);
  //     setMessage(err.response?.data?.message || "Failed to save scheme lesson");
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  // Debounced save function (500ms delay)
  // const debouncedSave = useDebounce(saveScheme, 500);

  useEffect(() => {
    const fetchScheme = async () => {
      if (!schemeId) return;
      setLoading(true);
      try {
        const response = await ApiService.getSchemeById(schemeId);
        const schemeData = {
          ...response.data,
          grade: response.data.grade_id,
          learning_area: response.data.learning_area,
          term: String(response.data.term),
          year: String(response.data.year),
          breaks: response.data.breaks.map((b: BreakItem) => ({
            ...b,
            startWeek: String(b.startWeek),
            startLesson: String(b.startLesson),
            endWeek: String(b.endWeek),
            endLesson: String(b.endLesson),
          })),
          firstWeek: response.data.weeks
            ? String(Math.min(...response.data.weeks.map((w: Week) => w.main)))
            : undefined,
          firstLesson: response.data.weeks ? "1" : undefined,
          lastWeek: response.data.weeks
            ? String(Math.max(...response.data.weeks.map((w: Week) => w.week)))
            : undefined,
          lastLesson: response.data.weeks
            ? String(
                response.data.weeks.reduce(
                  (max: number, w: Week) =>
                    w.week ===
                    Math.max(...response.data.weeks.map((w: Week) => w.week))
                      ? w.lessons.length
                      : max,
                  0
                )
              )
            : undefined,
          school: response.data.created_by?.school || "Unknown",
          paid: response.data.paid ?? false,
          // Ensure scheme_lesson_id is set for each lesson
          weeks: response.data.weeks.map((week: Week) => ({
            ...week,
            lessons: week.lessons.map((lesson) => ({
              ...lesson,
              scheme_lesson_id: lesson.scheme_lesson._id,
            })),
          })),
        };
        setScheme(schemeData);
        setSuccess(true);
        setMessage("");
      } catch (err: any) {
        setSuccess(false);
        setMessage(err.response?.data?.message || "Failed to fetch scheme");
      } finally {
        setLoading(false);
      }
    };
    fetchScheme();
  }, [schemeId]);

  const handleContentChange = async (
    week: number,
    lessonIndex: number,
    scheme_lesson_id: string,
    field: keyof SchemeLesson,
    value: string
  ) => {
    const sanitizedValue = sanitizeInput(value);
    // Log the updated row object
    console.log(`Updated Lesson (Week ${week}, Lesson ${lessonIndex + 1}):`, {
      week,
      lesson_number: lessonIndex + 1,
      scheme_lesson_id,
      [field]: sanitizedValue,
    });

    // Update local scheme state immediately
    setScheme((prevScheme) => {
      if (!prevScheme) return prevScheme;
      const updatedWeeks = prevScheme.weeks?.map((w) => {
        if (w.week === week) {
          const updatedLessons = w.lessons.map((l, idx) => {
            if (idx === lessonIndex) {
              return {
                ...l,
                scheme_lesson: { ...l.scheme_lesson, [field]: sanitizedValue },
              };
            }
            return l;
          });
          return { ...w, lessons: updatedLessons };
        }
        return w;
      });
      return { ...prevScheme, weeks: updatedWeeks };
    });

    // Save to the server
    await saveScheme(scheme_lesson_id, field, sanitizedValue);
  };

  const saveScheme = async (
    scheme_lesson_id: string,
    field: keyof SchemeLesson,
    value: string
  ) => {
    if (!scheme || !schemeId) return;

    setSaving(true);
    try {
      const updatedScheme = {
        scheme_lesson_id,
        field,
        value,
      };

      console.log("Submitting Edited Scheme Lesson:", updatedScheme);

      await ApiService.updateScheme(schemeId, updatedScheme);
      setSuccess(true);
      setMessage("Scheme lesson updated successfully!");
    } catch (err: any) {
      console.error("Save error:", err);
      setSuccess(false);
      setMessage(err.response?.data?.message || "Failed to save scheme lesson");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner className="h-12 w-12" />
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Scheme not found.</p>
      </div>
    );
  }

  const { breaks, weeks = [] } = scheme;
  const weeksWithBreaks = [...weeks];
  breaks.forEach((breakItem) => {
    for (
      let week = parseInt(breakItem.startWeek);
      week <= parseInt(breakItem.endWeek);
      week++
    ) {
      weeksWithBreaks.push({
        week,
        isBreak: true,
        breakTitle: breakItem.title,
      });
    }
  });
  const sortedItems = weeksWithBreaks.sort((a, b) => a.week - b.week);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-white shadow"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium flex items-center">
            <Button
              onClick={() => navigate("/home/schemes/list")}
              className="mr-4 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            Edit Scheme of Work
          </h2>
        </div>
      </motion.div>

      <section className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Scheme of Work</h1>
            <p className="text-sm text-gray-600">
              <strong>Learning Area:</strong>{" "}
              {typeof scheme.learning_area === "string"
                ? scheme.learning_area
                : scheme.learning_area.name || "N/A"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Term:</strong> {scheme.term}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Year:</strong> {scheme.year}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Reference Book:</strong> {scheme.reference_book || "N/A"}
            </p>
          </div>

          <table className="w-full table-fixed border-collapse font-sans text-sm">
            <thead>
              <tr className="bg-gray-100 font-bold text-sm">
                <th className="w-[3%] border border-gray-300 p-2 text-center">
                  WK
                </th>
                <th className="w-[3%] border border-gray-300 p-2 text-center">
                  LSN
                </th>
                <th className="border border-gray-300 p-2">STRAND</th>
                <th className="border border-gray-300 p-2">SUB-STRAND</th>
                <th className="w-[20%] border border-gray-300 p-2">
                  LESSON LEARNING OUTCOMES
                </th>
                <th className="w-[20%] border border-gray-300 p-2">
                  LEARNING EXPERIENCES
                </th>
                <th className="border border-gray-300 p-2">
                  KEY INQUIRY QUESTIONS
                </th>
                <th className="border border-gray-300 p-2">
                  LEARNING RESOURCES
                </th>
                <th className="border border-gray-300 p-2">
                  ASSESSMENT METHODS
                </th>
                <th className="border border-gray-300 p-2">REFLECTION</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item, index) => {
                const isFirstOfWeek =
                  index === 0 || sortedItems[index - 1].week !== item.week;
                const lessons = item.lessons || [];
                const rowspan = lessons.length || 1;
                const isBreak =
                  item.isBreak ||
                  (!lessons.length &&
                    breaks.some(
                      (b) =>
                        parseInt(b.startWeek) <= item.week &&
                        parseInt(b.endWeek) >= item.week
                    ));
                const breakTitle =
                  item.breakTitle ||
                  breaks.find(
                    (b) =>
                      parseInt(b.startWeek) <= item.week &&
                      parseInt(b.endWeek) >= item.week
                  )?.title ||
                  "No Lessons Scheduled";

                if (isBreak) {
                  return (
                    <tr key={`break-${item.week}`}>
                      {isFirstOfWeek && (
                        <td
                          className="border border-gray-300 p-2 text-center align-top"
                          rowSpan={rowspan}
                        >
                          {item.week}
                        </td>
                      )}
                      <td
                        colSpan={9}
                        className="border border-gray-300 p-2 text-center font-bold bg-gray-50"
                      >
                        {breakTitle}
                      </td>
                    </tr>
                  );
                }

                return lessons.map((lesson, lessonIndex) => (
                  <tr key={`${item.week}-${lessonIndex}`}>
                    {isFirstOfWeek && lessonIndex === 0 && (
                      <td
                        className="border border-gray-300 p-2 text-center align-top"
                        rowSpan={rowspan}
                      >
                        {item.week}
                      </td>
                    )}

                    {/* Lesson Number */}
                    <td className="border border-gray-300 p-2">
                      {lessonIndex + 1}
                    </td>

                    {/* Strand Name (read-only) */}
                    <td className="border border-gray-300 p-2">
                      {lesson.scheme_lesson.substrand?.strand?.name ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              lesson.scheme_lesson.substrand.strand.name,
                              { ALLOWED_TAGS: ["b", "i", "u", "p", "br"] }
                            ),
                          }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>

                    <td className="border border-gray-300 p-2">
                      {lesson.scheme_lesson.substrand?.name ? (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              lesson.scheme_lesson.substrand.name,
                              { ALLOWED_TAGS: ["b", "i", "u", "p", "br"] }
                            ),
                          }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>

                    {/* Learning Outcome */}
                    <td className="border border-gray-300 p-2">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="min-h-[1.5em] outline-none"
                        dangerouslySetInnerHTML={{
                          __html:
                            (editedField?.scheme_lesson_id ===
                              lesson.scheme_lesson._id &&
                              editedField?.field === "learning_outcome" &&
                              editedField?.value) ||
                            lesson.scheme_lesson.learning_outcome ||
                            "N/A",
                        }}
                        onBlur={(e) =>
                          handleContentChange(
                            item.week,
                            lessonIndex,
                            lesson.scheme_lesson._id,
                            "learning_outcome",
                            e.currentTarget.innerHTML || ""
                          )
                        }
                      />
                    </td>

                    {/* Suggested Learning Experiences */}
                    <td className="border border-gray-300 p-2">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="min-h-[1.5em] outline-none"
                        dangerouslySetInnerHTML={{
                          __html:
                            (editedField?.scheme_lesson_id ===
                              lesson.scheme_lesson._id &&
                              editedField?.field ===
                                "suggested_learning_experiences" &&
                              editedField?.value) ||
                            lesson.scheme_lesson
                              .suggested_learning_experiences ||
                            "N/A",
                        }}
                        onBlur={(e) =>
                          handleContentChange(
                            item.week,
                            lessonIndex,
                            lesson.scheme_lesson._id,
                            "suggested_learning_experiences",
                            e.currentTarget.innerHTML || ""
                          )
                        }
                      />
                    </td>

                    {/* Key Inquiry Questions */}
                    <td className="border border-gray-300 p-2">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="min-h-[1.5em] outline-none"
                        dangerouslySetInnerHTML={{
                          __html:
                            (editedField?.scheme_lesson_id ===
                              lesson.scheme_lesson._id &&
                              editedField?.field === "key_inquiry_questions" &&
                              editedField?.value) ||
                            lesson.scheme_lesson.key_inquiry_questions ||
                            "N/A",
                        }}
                        onBlur={(e) =>
                          handleContentChange(
                            item.week,
                            lessonIndex,
                            lesson.scheme_lesson._id,
                            "key_inquiry_questions",
                            e.currentTarget.innerHTML || ""
                          )
                        }
                      />
                    </td>

                    {/* Suggested Learning Resources */}
                    <td className="border border-gray-300 p-2">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="min-h-[1.5em] outline-none"
                        dangerouslySetInnerHTML={{
                          __html:
                            (editedField?.scheme_lesson_id ===
                              lesson.scheme_lesson._id &&
                              editedField?.field ===
                                "suggested_learning_resources" &&
                              editedField?.value) ||
                            lesson.scheme_lesson.suggested_learning_resources ||
                            "N/A",
                        }}
                        onBlur={(e) =>
                          handleContentChange(
                            item.week,
                            lessonIndex,
                            lesson.scheme_lesson._id,
                            "suggested_learning_resources",
                            e.currentTarget.innerHTML || ""
                          )
                        }
                      />
                    </td>

                    {/* Suggested Assessment Methods */}
                    <td className="border border-gray-300 p-2">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="min-h-[1.5em] outline-none"
                        dangerouslySetInnerHTML={{
                          __html:
                            (editedField?.scheme_lesson_id ===
                              lesson.scheme_lesson._id &&
                              editedField?.field ===
                                "suggested_assessment_methods" &&
                              editedField?.value) ||
                            lesson.scheme_lesson.suggested_assessment_methods ||
                            "N/A",
                        }}
                        onBlur={(e) =>
                          handleContentChange(
                            item.week,
                            lessonIndex,
                            lesson.scheme_lesson._id,
                            "suggested_assessment_methods",
                            e.currentTarget.innerHTML || ""
                          )
                        }
                      />
                    </td>

                    {/* Reflection */}
                    <td className="border border-gray-300 p-2">
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="min-h-[1.5em] outline-none"
                        dangerouslySetInnerHTML={{
                          __html:
                            (editedField?.scheme_lesson_id ===
                              lesson.scheme_lesson._id &&
                              editedField?.field === "reflection" &&
                              editedField?.value) ||
                            lesson.scheme_lesson.reflection ||
                            "N/A",
                        }}
                        onBlur={(e) =>
                          handleContentChange(
                            item.week,
                            lessonIndex,
                            lesson.scheme_lesson._id,
                            "reflection",
                            e.currentTarget.innerHTML || ""
                          )
                        }
                      />
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        </div>
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
            key={notificationKey} // Unique key to force re-render
            getRef={(el) => (notify.current = el)}
            className="absolute top-4 right-4 z-50 shadow-lg"
            options={{ duration: 3000 }}
          >
            <FontAwesomeIcon
              icon={faCheckCircle}
              className={success ? "text-green-500" : "text-red-500"}
            />
            <div className="ml-4 mr-4">
              <div className="font-medium text-gray-800">
                {success ? "Success" : "Failed"}
              </div>
              <div className="mt-1 text-gray-600">{message}</div>
            </div>
          </Notification>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchemeEdit;
