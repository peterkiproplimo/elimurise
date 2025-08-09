import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import * as ApiService from "../../services/auth";
import "./striped.css";
// Loading Spinner Component
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

// Mock components (replace with actual imports)
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

// Types
interface LearningArea {
  _id: string;
  name: string;
  grade_id: { name: string };
}

interface Grade {
  _id: string;
  name: string;
  level_id: { _id: string; name: string };
  status: number;
  level: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Strand {
  _id: string;
  name: string;
  substrands: Substrand[];
}

interface Substrand {
  _id: string;
  name: string;
}

interface BreakItem {
  title: string;
  duration: string;
  startWeek: string;
  startLesson: string;
  endWeek: string;
  endLesson: string;
}

interface FormData {
  grade: string;
  learning_area: string;
  term: string;
  year: string;
  strands: string[];
  substrands: string[];
  lessonsPerWeek: string;
  firstWeek: string;
  firstLesson: string;
  lastWeek: string;
  lastLesson: string;
  doubleLesson: string;
  breaks: BreakItem[];
  currentStep?: number;
}

// Component
const SchemeGeneration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [learningAreas, setLearningAreas] = useState<LearningArea[]>([]);
  const [strands, setStrands] = useState<Strand[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [schemeId, setSchemeId] = useState<string | null>(null);
  const [selectedStrands, setSelectedStrands] = useState<string[]>([]);
  const notify = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [grade, setGrade] = useState<Grade | null>(
    location.state?.data || null
  );
  const [grades, setGrades] = useState<Grade[]>([]);

  const schema = yup
    .object({
      grade: yup.string().required("Grade is required"),
      learning_area: yup.string().required("Learning Area is required"),
      term: yup.string().required("Term is required"),
      year: yup.string().required("Year is required"),
      substrands: yup
        .array()
        .min(1, "At least one substrand is required")
        .when("currentStep", {
          is: 2,
          then: (schema) => schema.required(),
        }),
      lessonsPerWeek: yup
        .string()
        .required("Lessons per week is required")
        .when("currentStep", {
          is: 3,
          then: (schema) => schema.required(),
        }),
      firstWeek: yup
        .string()
        .required("First week is required")
        .when("currentStep", {
          is: 3,
          then: (schema) => schema.required(),
        }),
      firstLesson: yup
        .string()
        .required("First lesson is required")
        .when("currentStep", {
          is: 3,
          then: (schema) => schema.required(),
        }),
      lastWeek: yup
        .string()
        .required("Last week is required")
        .when("currentStep", {
          is: 3,
          then: (schema) => schema.required(),
        }),
      lastLesson: yup
        .string()
        .required("Last lesson is required")
        .when("currentStep", {
          is: 3,
          then: (schema) => schema.required(),
        }),
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
      grade: grade?._id || "",
      learning_area: "",
      term: "",
      year: "",
      strands: [],
      substrands: [],
      lessonsPerWeek: "5",
      firstWeek: "2",
      firstLesson: "1",
      lastWeek: "12",
      lastLesson: "5",
      doubleLesson: "",
      breaks: [],
      currentStep: 1,
    },
  });

  const formData = watch();

  useEffect(() => {
    const fetchGrades = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getGrades({ page: 1 });
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

  useEffect(() => {
    const fetchLearningAreas = async () => {
      if (!grade?._id) {
        setLearningAreas([]);
        setSuccess(false);
        // setMessage("No grade selected");
        notify.current?.classList.add("block");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await ApiService.getLearningAreas({
          page: 1,
          limit: 12,
          search: "",
          gradeId: grade._id,
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
  }, [grade]);
  const totalSteps = 5; // Total number of steps in the form
  const progressPercent = (currentStep / 5) * 100;

  useEffect(() => {
    const fetchStrands = async () => {
      if (!formData.learning_area) {
        setStrands([]);
        return;
      }
      setLoading(true);
      try {
        const response = await ApiService.getSchemeLearningAreas(
          formData.learning_area
        );
        setStrands(response.strands);
        setSuccess(true);
      } catch (error) {
        setSuccess(false);
        setMessage("Failed to fetch strands");
        notify.current?.classList.add("block");
      } finally {
        setLoading(false);
      }
    };
    fetchStrands();
  }, [formData.learning_area]);

  const handleNext = async () => {
    const fieldsToValidate = (() => {
      switch (currentStep) {
        case 1:
          return ["grade", "learning_area", "term", "year"];
        case 2:
          return ["substrands"];
        case 3:
          return [
            "lessonsPerWeek",
            "firstWeek",
            "firstLesson",
            "lastWeek",
            "lastLesson",
          ];
        default:
          return [];
      }
    })();
    setValue("currentStep", currentStep);
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setValue("currentStep", currentStep + 1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setValue("currentStep", currentStep - 1);
    setCurrentStep(currentStep - 1);
  };

  const handleStrandChange = (strandId: string, checked: boolean) => {
    const currentStrands = formData.strands || [];
    const updatedStrands = checked
      ? [...currentStrands, strandId]
      : currentStrands.filter((s) => s !== strandId);
    setValue("strands", updatedStrands, { shouldValidate: true });
    setSelectedStrands(updatedStrands);

    if (!checked) {
      const strandSubstrands =
        strands
          .find((s) => s._id === strandId)
          ?.substrands.map((ss) => ss._id) || [];
      const currentSubstrands = formData.substrands || [];
      const updatedSubstrands = currentSubstrands.filter(
        (ss) => !strandSubstrands.includes(ss)
      );
      setValue("substrands", updatedSubstrands, { shouldValidate: true });
    }
  };

  const handleSubstrandChange = (substrandId: string, checked: boolean) => {
    const currentSubstrands = formData.substrands || [];
    const updatedSubstrands = checked
      ? [...currentSubstrands, substrandId]
      : currentSubstrands.filter((s) => s !== substrandId);
    setValue("substrands", updatedSubstrands, { shouldValidate: true });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allStrandIds = strands.map((strand) => strand._id);
      const allSubstrandIds = strands.flatMap((strand) =>
        strand.substrands.map((ss) => ss._id)
      );
      setValue("strands", allStrandIds, { shouldValidate: true });
      setValue("substrands", allSubstrandIds, { shouldValidate: true });
      setSelectedStrands(allStrandIds);
    } else {
      setValue("strands", [], { shouldValidate: true });
      setValue("substrands", [], { shouldValidate: true });
      setSelectedStrands([]);
    }
  };

  const addBreak = () => {
    const currentBreaks = formData.breaks || [];
    setValue("breaks", [
      ...currentBreaks,
      {
        title: "",
        duration: "",
        startWeek: "",
        startLesson: "",
        endWeek: "",
        endLesson: "",
      },
    ]);
  };

  const updateBreak = (
    index: number,
    field: keyof BreakItem,
    value: string
  ) => {
    const currentBreaks = formData.breaks || [];
    const newBreaks = [...currentBreaks];
    newBreaks[index] = { ...newBreaks[index], [field]: value };
    setValue("breaks", newBreaks);

    if (field === "duration" && value === "predefined") {
      console.log(newBreaks);
      newBreaks[index] = {
        ...newBreaks[index],
        startLesson: "",
        endLesson: "",
        startWeek: newBreaks[index].endWeek || "",
      };
      setValue("breaks", newBreaks);
    }
    if (field === "endWeek" && newBreaks[index].duration === "predefined") {
      console.log(newBreaks);
      newBreaks[index] = {
        ...newBreaks[index],
        endWeek: newBreaks[index].endWeek || "",
        startLesson: "",
        endLesson: "",
        startWeek: newBreaks[index].endWeek || "",
      };
      setValue("breaks", newBreaks);
    }
  };

  const removeBreak = (index: number) => {
    const currentBreaks = formData.breaks || [];
    setValue(
      "breaks",
      currentBreaks.filter((_, i) => i !== index)
    );
  };
  //donwload scheme
  const downloadScheme = async () => {
    if (!schemeId) {
      setSuccess(false);
      setMessage("No scheme ID available");
      notify.current?.classList.add("block");
      return;
    }
    try {
      await ApiService.downloadScheme(schemeId);
    } catch (error) {
      setSuccess(false);
      setMessage("Failed to download scheme");
      notify.current?.classList.add("block");
    }
  };
  const onSubmit = async (data: FormData) => {
    setSubmitLoading(true);
    try {
      const response = await ApiService.createScheme(data);
      setSchemeId(response.data._id);
      setSuccess(true);
      setMessage("Scheme submitted successfully!");
      notify.current?.classList.add("block");
      setCurrentStep(5);
    } catch (error) {
      setSuccess(false);
      setMessage("Failed to submit scheme");
      notify.current?.classList.add("block");
    } finally {
      setSubmitLoading(false);
    }
  };
  const handlePreview = (scheme: Scheme) => {
    navigate("/home/schemes/list/" + scheme, {
      state: {
        scheme,
        grades,
        learningAreas,
      },
    });
  };
  const renderStep = () => {
    const stepVariants = {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
      exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
    };

    switch (currentStep) {
      case 1:
        return (
          <div
            variants={stepVariants}
            className="col-span-12 bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-primary">
              Learning Area & Grade Details
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
              <div className="col-span-12 md:col-span-6">
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
                      onChange={(option) => {
                        const selectedGrade =
                          grades.find((g) => g._id === option?.value) || null;
                        setGrade(selectedGrade);
                        field.onChange(option?.value || "");
                      }}
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
              <div className="col-span-12 md:col-span-6">
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
              <div className="col-span-12 md:col-span-6">
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
                  Year <span className="text-red-500">*</span>
                </FormLabel>
                <Controller
                  name="year"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={["2024", "2025", "2026", "2027"].map((y) => ({
                        value: y,
                        label: y,
                      }))}
                      value={["2024", "2025", "2026", "2027"]
                        .map((y) => ({ value: y, label: y }))
                        .find((option) => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || "")}
                      placeholder="Select Year"
                      className={errors.year ? "border-red-500" : ""}
                      isClearable
                    />
                  )}
                />
                {errors.year && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.year.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleNext} className="bg-primary text-white">
                Next <Lucide icon="ArrowRight" className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="col-span-12 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-primary">
              Strands & Substrands
            </h2>
            {errors.substrands && (
              <p className="text-red-500 text-sm text-center mb-4">
                {errors.substrands.message}
              </p>
            )}
            <FormLabel className="block text-base font-semibold text-gray-800 mb-3">
              Select strands and substrands related to your scheme
            </FormLabel>

            <div className="mb-5">
              <label className="inline-flex items-center space-x-3 cursor-pointer transition-all hover:bg-gray-50 p-2 rounded-md">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  checked={
                    formData.strands?.length === strands.length &&
                    strands.length > 0
                  }
                  className="h-5 w-5 text-primary border-gray-300 rounded-md transition duration-200 ease-in-out focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">
                  Select All Strands
                </span>
              </label>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {strands.map((strand) => (
                <div
                  key={strand._id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 transition-shadow hover:shadow-md"
                >
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <motion.input
                      type="checkbox"
                      layout
                      transition={{ type: "spring", stiffness: 300 }}
                      value={strand._id}
                      onChange={(e) =>
                        handleStrandChange(strand._id, e.target.checked)
                      }
                      checked={formData.strands?.includes(strand._id)}
                      className="h-5 w-5 text-indigo-600 rounded-md border-gray-300 transition duration-200 ease-in-out focus:ring-indigo-500"
                    />
                    <span className="text-base font-semibold text-gray-800">
                      {strand.name}
                    </span>
                  </label>

                  <AnimatePresence initial={false}>
                    {selectedStrands.includes(strand._id) &&
                      strand.substrands?.length > 0 && (
                        <motion.div
                          key="substrands"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="mt-3 pl-6 space-y-2 border-l-4 border-indigo-300 overflow-hidden"
                        >
                          {strand.substrands.map((substrand) => (
                            <label
                              key={substrand._id}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <motion.input
                                type="checkbox"
                                layout
                                value={substrand._id}
                                onChange={(e) =>
                                  handleSubstrandChange(
                                    substrand._id,
                                    e.target.checked
                                  )
                                }
                                checked={formData.substrands?.includes(
                                  substrand._id
                                )}
                                className="h-4 w-4 text-teal-600 border-gray-300 rounded transition duration-200 ease-in-out focus:ring-teal-500"
                              />
                              <span
                                className="text-gray-700 group-hover:text-teal-700 transition-colors duration-200"
                                dangerouslySetInnerHTML={{
                                  __html: substrand.name.replace(
                                    /(&nbsp;|\u00a0)/g,
                                    " "
                                  ),
                                }}
                              />
                            </label>
                          ))}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <Button onClick={handleBack} className="bg-yellow-500 text-white">
                <Lucide icon="ArrowLeft" className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button onClick={handleNext} className="bg-primary text-white">
                Next <Lucide icon="ArrowRight" className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="col-span-12 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center text-primary">
              Lessons' Structure Details
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
              <div className="col-span-12 md:col-span-6">
                <FormLabel>
                  Number of Lessons Per Week{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <Controller
                  name="lessonsPerWeek"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={[...Array(9)].map((_, i) => ({
                        value: String(i + 1),
                        label: String(i + 1),
                      }))}
                      value={[...Array(9)]
                        .map((_, i) => ({
                          value: String(i + 1),
                          label: String(i + 1),
                        }))
                        .find((option) => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || "")}
                      placeholder="Select Number of Lessons"
                      className={errors.lessonsPerWeek ? "border-red-500" : ""}
                      isClearable
                    />
                  )}
                />
                {errors.lessonsPerWeek && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lessonsPerWeek.message}
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormLabel>
                  First Week of Teaching <span className="text-red-500">*</span>
                </FormLabel>
                <Controller
                  name="firstWeek"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={[...Array(20)].map((_, i) => ({
                        value: String(i + 1),
                        label: String(i + 1),
                      }))}
                      value={[...Array(20)]
                        .map((_, i) => ({
                          value: String(i + 1),
                          label: String(i + 1),
                        }))
                        .find((option) => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || "")}
                      placeholder="Select Week Number"
                      className={errors.firstWeek ? "border-red-500" : ""}
                      isClearable
                    />
                  )}
                />
                {errors.firstWeek && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstWeek.message}
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormLabel>
                  First Lesson of Teaching{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <Controller
                  name="firstLesson"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={[
                        ...Array(parseInt(formData.lessonsPerWeek || "5")),
                      ].map((_, i) => ({
                        value: String(i + 1),
                        label: String(i + 1),
                      }))}
                      value={[
                        ...Array(parseInt(formData.lessonsPerWeek || "5")),
                      ]
                        .map((_, i) => ({
                          value: String(i + 1),
                          label: String(i + 1),
                        }))
                        .find((option) => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || "")}
                      placeholder="Select Lesson Number"
                      className={errors.firstLesson ? "border-red-500" : ""}
                      isClearable
                    />
                  )}
                />
                {errors.firstLesson && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstLesson.message}
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormLabel>
                  Last Week of Teaching <span className="text-red-500">*</span>
                </FormLabel>
                <Controller
                  name="lastWeek"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={[...Array(20)].map((_, i) => ({
                        value: String(i + 1),
                        label: String(i + 1),
                      }))}
                      value={[...Array(20)]
                        .map((_, i) => ({
                          value: String(i + 1),
                          label: String(i + 1),
                        }))
                        .find((option) => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || "")}
                      placeholder="Select Week Number"
                      className={errors.lastWeek ? "border-red-500" : ""}
                      isClearable
                    />
                  )}
                />
                {errors.lastWeek && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastWeek.message}
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormLabel>
                  Last Lesson of Teaching{" "}
                  <span className="text-red-500">*</span>
                </FormLabel>
                <Controller
                  name="lastLesson"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={[
                        ...Array(parseInt(formData.lessonsPerWeek || "5")),
                      ].map((_, i) => ({
                        value: String(i + 1),
                        label: String(i + 1),
                      }))}
                      value={[
                        ...Array(parseInt(formData.lessonsPerWeek || "5")),
                      ]
                        .map((_, i) => ({
                          value: String(i + 1),
                          label: String(i + 1),
                        }))
                        .find((option) => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || "")}
                      placeholder="Select Lesson Number"
                      className={errors.lastLesson ? "border-red-500" : ""}
                      isClearable
                    />
                  )}
                />
                {errors.lastLesson && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastLesson.message}
                  </p>
                )}
              </div>
              <div className="col-span-12 md:col-span-6">
                <FormLabel>Double Lesson</FormLabel>
                <Controller
                  name="doubleLesson"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={[
                        { value: "", label: "No double lesson" },
                        ...[
                          ...Array(
                            parseInt(formData.lessonsPerWeek || "5") - 1
                          ),
                        ].map((_, i) => ({
                          value: `${i + 1}-${i + 2}`,
                          label: `${i + 1} - ${i + 2}`,
                        })),
                      ]}
                      value={[
                        { value: "", label: "No double lesson" },
                        ...[
                          ...Array(
                            parseInt(formData.lessonsPerWeek || "5") - 1
                          ),
                        ].map((_, i) => ({
                          value: `${i + 1}-${i + 2}`,
                          label: `${i + 1} - ${i + 2}`,
                        })),
                      ].find((option) => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || "")}
                      placeholder="Select Double Lesson"
                      className={errors.doubleLesson ? "border-red-500" : ""}
                      isClearable
                    />
                  )}
                />
                {errors.doubleLesson && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.doubleLesson.message}
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
          </div>
        );
      case 4:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="col-span-12 bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-primary">
              Term Breaks and Interruptions
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
            <div className="mb-4">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setValue("breaks", []);
                    }
                  }}
                />
                <span className="text-sm font-medium text-gray-700">
                  No Breaks
                </span>
              </label>
            </div>
            {formData.breaks?.map((breakItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="border p-4 mb-4 rounded-lg bg-gray-50"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Break {index + 1}
                </h3>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <FormLabel>
                      Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      value={breakItem.title}
                      onChange={(e) =>
                        updateBreak(index, "title", e.target.value)
                      }
                      placeholder="e.g., Midterm Break"
                      className="w-full"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <FormLabel>
                      Duration <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      options={[
                        { value: "", label: "Select Duration" },
                        { value: "predefined", label: "Exactly 1 week" },
                        { value: "custom", label: "More/less than 1 week" },
                      ]}
                      value={[
                        { value: "", label: "Select Duration" },
                        { value: "predefined", label: "Exactly 1 week" },
                        { value: "custom", label: "More/less than 1 week" },
                      ].find((option) => option.value === breakItem.duration)}
                      onChange={(option) =>
                        updateBreak(index, "duration", option?.value || "")
                      }
                      className="w-full"
                    />
                  </div>
                  {breakItem.duration && (
                    <div className="col-span-12 md:col-span-6">
                      <FormLabel>
                        Week <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        options={[
                          ...Array(
                            parseInt(formData.lastWeek || "20") -
                              parseInt(formData.firstWeek || "1") +
                              1
                          ),
                        ].map((_, i) => {
                          const weekNum =
                            parseInt(formData.firstWeek || "1") + i;
                          return {
                            value: String(weekNum),
                            label: String(weekNum),
                          };
                        })}
                        value={[
                          ...Array(
                            parseInt(formData.lastWeek || "20") -
                              parseInt(formData.firstWeek || "1") +
                              1
                          ),
                        ]
                          .map((_, i) => {
                            const weekNum =
                              parseInt(formData.firstWeek || "1") + i;
                            return {
                              value: String(weekNum),
                              label: String(weekNum),
                            };
                          })
                          .find(
                            (option) => option.value === breakItem.startWeek
                          )}
                        onChange={(option) => {
                          updateBreak(index, "startWeek", option?.value || "");
                          if (breakItem.duration === "predefined") {
                            // updateBreak(
                            //   index,
                            //   "startWeek",
                            //   option?.value || ""
                            // );

                            updateBreak(index, "endWeek", option?.value || "");
                          }
                        }}
                        placeholder="Select Week"
                        className="w-full"
                      />
                    </div>
                  )}
                  {breakItem.duration === "custom" && (
                    <>
                      <div className="col-span-12 md:col-span-6">
                        <FormLabel>
                          Start Lesson <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          options={[
                            ...Array(parseInt(formData.lessonsPerWeek || "5")),
                          ].map((_, i) => ({
                            value: String(i + 1),
                            label: String(i + 1),
                          }))}
                          value={[
                            ...Array(parseInt(formData.lessonsPerWeek || "5")),
                          ]
                            .map((_, i) => ({
                              value: String(i + 1),
                              label: String(i + 1),
                            }))
                            .find(
                              (option) => option.value === breakItem.startLesson
                            )}
                          onChange={(option) =>
                            updateBreak(
                              index,
                              "startLesson",
                              option?.value || ""
                            )
                          }
                          placeholder="Select Lesson"
                          className="w-full"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <FormLabel>
                          End Week <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          options={[
                            ...Array(
                              parseInt(formData.lastWeek || "20") -
                                parseInt(formData.firstWeek || "1") +
                                1
                            ),
                          ].map((_, i) => {
                            const weekNum =
                              parseInt(formData.firstWeek || "1") + i;
                            return {
                              value: String(weekNum),
                              label: String(weekNum),
                            };
                          })}
                          value={[
                            ...Array(
                              parseInt(formData.lastWeek || "20") -
                                parseInt(formData.firstWeek || "1") +
                                1
                            ),
                          ]
                            .map((_, i) => {
                              const weekNum =
                                parseInt(formData.firstWeek || "1") + i;
                              return {
                                value: String(weekNum),
                                label: String(weekNum),
                              };
                            })
                            .find(
                              (option) => option.value === breakItem.endWeek
                            )}
                          onChange={(option) =>
                            updateBreak(index, "endWeek", option?.value || "")
                          }
                          placeholder="Select Week"
                          className="w-full"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-6">
                        <FormLabel>
                          End Lesson <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          options={[
                            ...Array(parseInt(formData.lessonsPerWeek || "5")),
                          ].map((_, i) => ({
                            value: String(i + 1),
                            label: String(i + 1),
                          }))}
                          value={[
                            ...Array(parseInt(formData.lessonsPerWeek || "5")),
                          ]
                            .map((_, i) => ({
                              value: String(i + 1),
                              label: String(i + 1),
                            }))
                            .find(
                              (option) => option.value === breakItem.endLesson
                            )}
                          onChange={(option) =>
                            updateBreak(index, "endLesson", option?.value || "")
                          }
                          placeholder="Select Lesson"
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
                <Button
                  onClick={() => removeBreak(index)}
                  className="mt-2 bg-red-500 text-white"
                >
                  <Lucide icon="Trash" className="w-4 h-4 mr-2" /> Remove
                </Button>
              </motion.div>
            ))}
            <Button onClick={addBreak} className="bg-gray-500 text-white mb-4">
              <Lucide icon="Plus" className="w-4 h-4 mr-2" /> New Break
            </Button>
            <div className="mt-6 flex justify-between">
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
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="col-span-12 bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Download Scheme Below
            </h2>

            <div className="flex flex-wrap justify-center gap-4 mb-4">
              <Button
                onClick={handleBack}
                className="bg-yellow-500 text-white flex items-center"
              >
                <Lucide icon="ArrowLeft" className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button
                onClick={() => handlePreview(schemeId)}
                className="bg-gray-500 text-white"
              >
                Preview
              </Button>
              <Button
                onClick={() => downloadScheme()}
                className="bg-green-500 text-white flex items-center"
              >
                <Lucide icon="Download" className="w-4 h-4 mr-2" /> Download
              </Button>

              <Button
                onClick={() => navigate("/home/schemes", { replace: true })}
                className="bg-primary text-white flex items-center"
              >
                <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Create Another
                Scheme
              </Button>
            </div>

            <hr className="w-full my-4" />

            <h3 className="text-lg font-semibold text-gray-800">
              Was Schemes of Work helpful? Share with friends!
            </h3>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
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
          {grade
            ? `Create a Scheme of Work for ${grade.name}`
            : "No Grade Selected"}
        </h2>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-12 gap-6 mt-5">
          <div className="col-span-12">
            {/* Progress Track */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
              {/* Animated Progress Fill with Stripes */}
              <motion.div
                key={currentStep} // Triggers re-animation
                className="bg-primary h-2.5 rounded-full bg-stripes animate-stripes"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              />
            </div>

            {/* Step Text */}
            <p className="text-sm text-center text-gray-600 mb-4">
              Step {currentStep} of {totalSteps}
            </p>

            {/* Content or Spinner */}
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

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gray-800 text-white p-4 mt-auto"
      >
        <div className="container mx-auto">
          <span>Copyright © 2014-2025 Schemes. All rights reserved.</span>
        </div>
      </motion.footer>

      {/* Notification */}
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

export default SchemeGeneration;
