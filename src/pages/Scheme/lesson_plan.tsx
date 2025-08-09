import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import * as ApiService from "../../services/auth";
import "./striped.css";

// Interfaces
interface Grade {
  _id: string;
  name: string;
}

interface LearningArea {
  _id: string;
  name: string;
}

interface Scheme {
  _id: string;
  learning_area: { _id: string; name: string };
  term: string;
  year: string;
  created_by: { name: string };
  weeks: { week: number; lessons: { scheme_lesson: SchemeLesson }[] }[];
}

interface SchemeLesson {
  _id: string;
  lesson_number: number;
  learning_outcome: string;
  substrand: { _id: string; name: string; strand: { name: string } };
}

interface FormData {
  grade: string;
  learning_area: string;
  term: string;
  scheme: string;
  week: string;
  lessons: { scheme_lesson: string; reflection: string }[];
  date: string;
  time: string;
  type: "single" | "double" | "custom";
  currentStep?: number;
}

// Mock Components
const LoadingSpinner: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div className={`flex items-center justify-center ${className}`}>
    <svg
      className="animate-spin h-8 w-8 text-primary"
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

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}
const FormInput: React.FC<FormInputProps> = ({ className = "", ...props }) => (
  <input
    className={`w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${className}`}
    {...props}
  />
);

interface FormLabelProps {
  className?: string;
  children: React.ReactNode;
}
const FormLabel: React.FC<FormLabelProps> = ({ children, className = "" }) => (
  <label className={`block text-sm font-medium text-gray-700 ${className}`}>
    {children}
  </label>
);

interface LucideProps {
  icon: string;
  className?: string;
}
const Lucide: React.FC<LucideProps> = ({ icon, className = "" }) => (
  <i className={`fas fa-${icon.toLowerCase()} ${className}`}></i>
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

// Component
const GenerateLessonPlan: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [learningAreas, setLearningAreas] = useState<LearningArea[]>([]);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [weeks, setWeeks] = useState<
    { week: number; lessons: { scheme_lesson: SchemeLesson }[] }[]
  >([]);
  const [lessons, setLessons] = useState<SchemeLesson[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [lessonPlanId, setLessonPlanId] = useState<string | null>(null);
  const notify = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const schema = yup
    .object({
      grade: yup.string().required("Grade is required"),
      learning_area: yup.string().required("Learning Area is required"),
      term: yup.string().required("Term is required"),
      scheme: yup.string().required("Scheme is required"),
      week: yup.string().required("Week is required"),
      lessons: yup
        .array()
        .of(
          yup.object({
            scheme_lesson: yup.string().required("Lesson is required"),
            reflection: yup
              .string()
              .max(500, "Reflection cannot exceed 500 characters"),
          })
        )
        .min(1, "At least one lesson is required")
        .when("currentStep", {
          is: 2,
          then: (schema) => schema.required(),
        }),
      // date: yup
      //   .string()
      //   .required("Date is required")
      //   .when("currentStep", {
      //     is: 3,
      //     then: (schema) => schema.required(),
      //   }),
      // time: yup
      //   .string()
      //   .required("Time is required")
      //   .matches(
      //     /^\d{1,2}:\d{2}(AM|PM)\s*-\s*\d{1,2}:\d{2}(AM|PM)$/,
      //     "Invalid time format (e.g., 10:00AM - 11:30AM)"
      //   )
      //   .when("currentStep", {
      //     is: 3,
      //     then: (schema) => schema.required(),
      //   }),
      // type: yup
      //   .string()
      //   .required("Lesson type is required")
      //   .oneOf(["single", "double", "custom"], "Invalid lesson type")
      //   .when("currentStep", {
      //     is: 3,
      //     then: (schema) => schema.required(),
      //   }),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      grade: "",
      learning_area: "",
      term: "",
      scheme: "",
      week: "",
      lessons: [],
      date: "",
      time: "10:30AM - 12:00PM",
      type: "single",
      currentStep: 1,
    },
  });

  const formData = watch();
  const totalSteps = 4;
  const progressPercent = ((formData.currentStep || 1) / totalSteps) * 100;

  // Fetch grades
  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getGrades({ page: 1, limit: 100 });
        setGrades(response.data);
        setSuccess(true);
      } catch (error) {
        setSuccess(false);
        setMessage("Failed to fetch grades");
        notify.current?.classList.add("block");
      } finally {
        setLoading(false);
      }
    };
    fetchGrades();
  }, []);

  // Fetch learning areas
  useEffect(() => {
    const fetchLearningAreas = async () => {
      if (!formData.grade) {
        setLearningAreas([]);
        return;
      }
      setLoading(true);
      try {
        const response = await ApiService.getLearningAreas({
          grade: formData.grade,
        });
        setLearningAreas(response.data);
        setSuccess(true);
      } catch (error) {
        setSuccess(false);
        setMessage("Failed to fetch learning areas");
        notify.current?.classList.add("block");
      } finally {
        setLoading(false);
      }
    };
    fetchLearningAreas();
  }, [formData.grade]);

  // Fetch schemes
  useEffect(() => {
    const fetchSchemes = async () => {
      if (!formData.grade || !formData.learning_area || !formData.term) {
        setSchemes([]);
        setWeeks([]);
        return;
      }
      setLoading(true);
      try {
        const response = await ApiService
          .getScheme
          //   {
          //   grade: formData.grade,
          //   learning_area: formData.learning_area,
          //   term: formData.term,
          // }
          ();
        setSchemes(response.data);
        setSuccess(true);
      } catch (error) {
        setSuccess(false);
        setMessage("Failed to fetch schemes");
        notify.current?.classList.add("block");
      } finally {
        setLoading(false);
      }
    };
    fetchSchemes();
  }, [formData.grade, formData.learning_area, formData.term]);

  // Fetch weeks and lessons
  useEffect(() => {
    const fetchWeeksAndLessons = async () => {
      if (!formData.scheme) {
        setWeeks([]);
        setLessons([]);
        return;
      }
      setLoading(true);
      try {
        const response = await ApiService.getSchemeById(formData.scheme);
        const schemeWeeks = response.data.weeks;
        setWeeks(schemeWeeks);
        if (formData.week) {
          const selectedWeek = schemeWeeks.find(
            (w: any) => w.week.toString() === formData.week
          );
          const schemeLessons = selectedWeek
            ? selectedWeek.lessons.map((l: any) => l.scheme_lesson)
            : [];
          setLessons(schemeLessons);
        }
        setSuccess(true);
      } catch (error) {
        setSuccess(false);
        setMessage("Failed to fetch scheme weeks or lessons");
        notify.current?.classList.add("block");
      } finally {
        setLoading(false);
      }
    };
    fetchWeeksAndLessons();
  }, [formData.scheme, formData.week]);

  const handleNext = async () => {
    const fieldsToValidate = (() => {
      switch (formData.currentStep) {
        case 1:
          return ["grade", "learning_area", "term", "scheme", "week"];
        case 2:
          return ["lessons"];
        case 3:
          return ["date", "time", "type"];
        default:
          return [];
      }
    })();
    setValue("currentStep", formData.currentStep || 1);
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setValue("currentStep", (formData.currentStep || 1) + 1);
    }
  };

  const handleBack = () => {
    setValue("currentStep", (formData.currentStep || 1) - 1);
  };

  const handleLessonToggle = (lessonId: string, checked: boolean) => {
    const currentLessons = formData.lessons || [];
    const updatedLessons = checked
      ? [...currentLessons, { scheme_lesson: lessonId, reflection: "" }]
      : currentLessons.filter((l) => l.scheme_lesson !== lessonId);
    setValue("lessons", updatedLessons, { shouldValidate: true });
  };

  const handleReflectionChange = (lessonId: string, reflection: string) => {
    const currentLessons = formData.lessons || [];
    const updatedLessons = currentLessons.map((l) =>
      l.scheme_lesson === lessonId ? { ...l, reflection } : l
    );
    setValue("lessons", updatedLessons, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setSubmitLoading(true);
    try {
      const payload = {
        teacher_id: "6638bf8b45ac1b3a23c553cc", // Replace with actual teacher ID
        scheme_id: data.scheme,
        type: data.type,
        date: data.date,
        time: data.time,
        scheme_lessons: data.lessons,
      };
      console.log("Submitting lesson plan:", payload);
      const response = await ApiService.createLessonPlan(payload);
      setLessonPlanId(response.data._id);
      setSuccess(true);
      setMessage("Lesson plan created successfully!");
      notify.current?.classList.add("block");
      setValue("currentStep", 4);
    } catch (error) {
      console.error("Submit error:", error);
      setSuccess(false);
      setMessage("Failed to create lesson plan");
      notify.current?.classList.add("block");
    } finally {
      setSubmitLoading(false);
    }
  };

  const downloadLessonPlan = async () => {
    if (!lessonPlanId) {
      setSuccess(false);
      setMessage("No lesson plan ID available");
      notify.current?.classList.add("block");
      return;
    }
    try {
      await ApiService.downloadLessonPlan(lessonPlanId);
    } catch (error) {
      setSuccess(false);
      setMessage("Failed to download lesson plan");
      notify.current?.classList.add("block");
    }
  };

  const renderStep = () => {
    const stepVariants = {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
      exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
    };

    switch (formData.currentStep) {
      case 1:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="col-span-12 bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-primary">
              Select Grade, Learning Area, Term, Scheme, and Week
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Fields marked with <span className="text-red-500">*</span> are
              mandatory
            </p>
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-center mb-4">
                Please fill all mandatory fields
              </p>
            )}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <FormLabel>
                  Grade <span className="text-red-500">*</span>
                </FormLabel>
                <Controller
                  name="grade"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={grades.map((g) => ({
                        value: g._id,
                        label: g.name,
                      }))}
                      value={grades
                        .map((g) => ({ value: g._id, label: g.name }))
                        .find((option) => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || "")}
                      placeholder="Select Grade"
                      className={errors.grade ? "border-red-500" : ""}
                      isClearable
                    />
                  )}
                />
                {errors.grade && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.grade.message}
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-4">
                <FormLabel>
                  Learning Area <span className="text-red-500">*</span>
                </FormLabel>
                <Controller
                  name="learning_area"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={learningAreas.map((area) => ({
                        value: area._id,
                        label: area.name,
                      }))}
                      value={learningAreas
                        .map((area) => ({ value: area._id, label: area.name }))
                        .find((option) => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || "")}
                      placeholder="Select Learning Area"
                      className={errors.learning_area ? "border-red-500" : ""}
                      isClearable
                    />
                  )}
                />
                {errors.learning_area && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.learning_area.message}
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-4">
                <FormLabel>
                  Term <span className="text-red-500">*</span>
                </FormLabel>
                <Controller
                  name="term"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={["1", "2", "3"].map((t) => ({
                        value: t,
                        label: t,
                      }))}
                      value={["1", "2", "3"]
                        .map((t) => ({ value: t, label: t }))
                        .find((option) => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || "")}
                      placeholder="Select Term"
                      className={errors.term ? "border-red-500" : ""}
                      isClearable
                    />
                  )}
                />
                {errors.term && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.term.message}
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormLabel>
                  Scheme <span className="text-red-500">*</span>
                </FormLabel>
                <Controller
                  name="scheme"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={schemes.map((s) => ({
                        value: s._id,
                        label: `${s.learning_area.name} - Term ${s.term} ${s.year}`,
                      }))}
                      value={schemes
                        .map((s) => ({
                          value: s._id,
                          label: `${s.learning_area.name} - Term ${s.term} ${s.year}`,
                        }))
                        .find((option) => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || "")}
                      placeholder="Select Scheme"
                      className={errors.scheme ? "border-red-500" : ""}
                      isClearable
                    />
                  )}
                />
                {errors.scheme && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.scheme.message}
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormLabel>
                  Week <span className="text-red-500">*</span>
                </FormLabel>
                <Controller
                  name="week"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={weeks.map((w) => ({
                        value: w.week.toString(),
                        label: `Week ${w.week}`,
                      }))}
                      value={weeks
                        .map((w) => ({
                          value: w.week.toString(),
                          label: `Week ${w.week}`,
                        }))
                        .find((option) => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || "")}
                      placeholder="Select Week"
                      className={errors.week ? "border-red-500" : ""}
                      isClearable
                    />
                  )}
                />
                {errors.week && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.week.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNext} className="bg-primary text-white">
                Next <Lucide icon="ArrowRight" className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="col-span-12 bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-primary">
              Select Lessons & Add Reflections
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Fields marked with <span className="text-red-500">*</span> are
              mandatory
            </p>
            {errors.lessons && (
              <p className="text-red-500 text-sm text-center mb-4">
                {errors.lessons.message}
              </p>
            )}
            <div className="mb-4">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setValue(
                        "lessons",
                        lessons.map((l) => ({
                          scheme_lesson: l._id,
                          reflection: "",
                        })),
                        { shouldValidate: true }
                      );
                    } else {
                      setValue("lessons", [], { shouldValidate: true });
                    }
                  }}
                  checked={
                    formData.lessons?.length === lessons.length &&
                    lessons.length > 0
                  }
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All Lessons
                </span>
              </label>
            </div>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">Select</th>
                    <th className="px-4 py-2">Lesson</th>
                    <th className="px-4 py-2">Substrand</th>
                    <th className="px-4 py-2">Learning Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson) => (
                    <tr key={lesson._id} className="border-b hover:bg-gray-100">
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={formData.lessons?.some(
                            (l) => l.scheme_lesson === lesson._id
                          )}
                          onChange={(e) =>
                            handleLessonToggle(lesson._id, e.target.checked)
                          }
                          className="h-4 w-4 text-primary"
                        />
                      </td>
                      <td className="px-4 py-2">{lesson.lesson_number}</td>
                      <td className="px-4 py-2">
                        {" "}
                        <span
                          className="text-gray-700 group-hover:text-teal-700 transition-colors duration-200"
                          dangerouslySetInnerHTML={{
                            __html: lesson.substrand.name.replace(
                              /(&nbsp;|\u00a0)/g,
                              " "
                            ),
                          }}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className="text-gray-700 group-hover:text-teal-700 transition-colors duration-200"
                          dangerouslySetInnerHTML={{
                            __html: lesson.learning_outcome.replace(
                              /(&nbsp;|\u00a0)/g,
                              " "
                            ),
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {formData.lessons?.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Reflections
                </h3>
                {formData.lessons.map((l, index) => {
                  const lesson = lessons.find(
                    (lesson) => lesson._id === l.scheme_lesson
                  );
                  return (
                    <motion.div
                      key={l.scheme_lesson}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="border p-4 rounded-lg bg-gray-50"
                    >
                      <h4 className="font-medium">
                        Lesson
                        <span
                          className="text-gray-700 group-hover:text-teal-700 transition-colors duration-200"
                          dangerouslySetInnerHTML={{
                            __html: lesson?.learning_outcome.replace(
                              /(&nbsp;|\u00a0)/g,
                              " "
                            ),
                          }}
                        />
                      </h4>
                      <p className="text-sm text-gray-600">
                        Substrand:
                        <span
                          className="text-gray-700 group-hover:text-teal-700 transition-colors duration-200"
                          dangerouslySetInnerHTML={{
                            __html: lesson?.substrand.name.replace(
                              /(&nbsp;|\u00a0)/g,
                              " "
                            ),
                          }}
                        />
                      </p>
                      <FormInput
                        value={l.reflection}
                        onChange={(e) =>
                          handleReflectionChange(
                            l.scheme_lesson,
                            e.target.value
                          )
                        }
                        placeholder="Enter reflection for this lesson"
                        className="mt-2"
                      />
                      {errors.lessons?.[index]?.reflection && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.lessons[index].reflection.message}
                        </p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
            <div className="mt-6 flex justify-between">
              <Button onClick={handleBack} className="bg-yellow-500 text-white">
                <Lucide icon="ArrowLeft" className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={handleNext} className="bg-primary text-white">
                Next <Lucide icon="ArrowRight" className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="col-span-12 bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-primary">
              Lesson Plan Details
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Fields marked with <span className="text-red-500">*</span> are
              mandatory
            </p>
            {Object.keys(errors).length > 0 && (
              <p className="text-red-500 text-center mb-4">
                Please fill all mandatory fields
              </p>
            )}
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-4">
                <FormLabel>
                  Date <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  type="date"
                  {...register("date")}
                  className={errors.date ? "border-red-500" : ""}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-4">
                <FormLabel>
                  Time <span className="text-red-500">*</span>
                </FormLabel>
                <FormInput
                  {...register("time")}
                  placeholder="e.g., 10:30AM - 12:00PM"
                  className={errors.time ? "border-red-500" : ""}
                />
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.time.message}
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-4">
                <FormLabel>
                  Lesson Type <span className="text-red-500">*</span>
                </FormLabel>
                <div className="flex space-x-4">
                  {["single", "double", "custom"].map((t) => (
                    <label key={t} className="flex items-center">
                      <input
                        type="radio"
                        value={t}
                        {...register("type")}
                        checked={formData.type === t}
                        className="mr-2"
                      />
                      <span
                        className={`capitalize px-2 py-1 rounded-full text-sm ${
                          t === "single"
                            ? "bg-blue-100 text-blue-800"
                            : t === "double"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {t}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button onClick={handleBack} className="bg-yellow-500 text-white">
                <Lucide icon="ArrowLeft" className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={handleNext} className="bg-primary text-white">
                Next <Lucide icon="ArrowRight" className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="col-span-12 bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Review & Download Lesson Plan
            </h2>
            <div className="space-y-4 w-full max-w-md">
              <p>
                <strong>Grade:</strong>{" "}
                {grades.find((g) => g._id === formData.grade)?.name || "N/A"}
              </p>
              <p>
                <strong>Learning Area:</strong>{" "}
                {learningAreas.find((a) => a._id === formData.learning_area)
                  ?.name || "N/A"}
              </p>
              <p>
                <strong>Term:</strong> {formData.term}
              </p>
              <p>
                <strong>Scheme:</strong>{" "}
                {
                  schemes.find((s) => s._id === formData.scheme)?.learning_area
                    .name
                }{" "}
                - Term {schemes.find((s) => s._id === formData.scheme)?.term}{" "}
                {schemes.find((s) => s._id === formData.scheme)?.year}
              </p>
              <p>
                <strong>Week:</strong> {formData.week}
              </p>
              <p>
                <strong>Lessons:</strong>
              </p>
              <ul className="list-disc pl-5 text-left">
                {formData.lessons?.map((l) => {
                  const lesson = lessons.find(
                    (lesson) => lesson._id === l.scheme_lesson
                  );
                  return (
                    <li key={l.scheme_lesson}>
                      Lesson {lesson?.lesson_number}: {lesson?.learning_outcome}{" "}
                      (Reflection: {l.reflection || "None"})
                    </li>
                  );
                })}
              </ul>
              <p>
                <strong>Date:</strong> {formData.date}
              </p>
              <p>
                <strong>Time:</strong> {formData.time}
              </p>
              <p>
                <strong>Type:</strong> {formData.type}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Button onClick={handleBack} className="bg-yellow-500 text-white">
                <Lucide icon="ArrowLeft" className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                className="bg-primary text-white"
                isLoading={submitLoading}
              >
                Submit <Lucide icon="ArrowRight" className="w-4 h-4 ml-2" />
              </Button>
              {lessonPlanId && (
                <Button
                  onClick={downloadLessonPlan}
                  className="bg-green-500 text-white"
                >
                  <Lucide icon="Download" className="w-4 h-4 mr-2" /> Download
                </Button>
              )}
              <Button
                onClick={() =>
                  navigate("/home/lesson-plans", { replace: true })
                }
                className="bg-gray-500 text-white"
              >
                <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Create Another
              </Button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-white shadow"
      >
        <h2 className="text-lg font-medium flex items-center">
          <a
            onClick={() => navigate("/home/grade", { replace: true })}
            className="mr-5 cursor-pointer"
          >
            <Lucide icon="ArrowLeft" className="text-gray-400 w-5 h-5" />
          </a>
          Create a Lesson Plan
        </h2>
      </motion.div>
      <div className="flex-1 p-4">
        <div className="grid grid-cols-12 gap-6 mt-5">
          <div className="col-span-12">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
              <motion.div
                key={formData.currentStep}
                className="bg-primary h-2.5 rounded-full bg-stripes animate-stripes"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>
            <p className="text-sm text-center text-gray-600 mb-4">
              Step {formData.currentStep} of {totalSteps}
            </p>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner className="h-12 w-12" />
              </div>
            ) : (
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
            )}
          </div>
        </div>
      </div>
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800 text-white p-4 mt-auto"
      >
        <div className="container mx-auto">
          Copyright © 2014-2025 Lesson Plans. All rights reserved.
        </div>
      </motion.footer>
      <AnimatePresence>
        {message && (
          <Notification
            options={{ duration: 3000 }}
            getRef={(el) => (notify.current = el)}
            className="absolute top-4 right-4 z-50 shadow-lg"
          >
            <Lucide
              icon={success ? "CheckCircle" : "XCircle"}
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

export default GenerateLessonPlan;
