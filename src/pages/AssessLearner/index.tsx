import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Button from "../../base-components/Button";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormSwitch,
  FormTextarea,
} from "../../base-components/Form";
import { CheckSquare, Loader, Upload, AlertCircle } from "lucide-react";
import Lucide from "../../base-components/Lucide";
import { Dialog } from "../../base-components/Headless";
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
import Pagination from "../../base-components/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";

// Debounce utility
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

interface TableRow {
  no: number;
  strandName: string;
}

interface StrandFilter {
  grade: string;
  learning_area: string;
  term: string;
}

interface Assessment {
  learner: {
    _id: string;
    adm_no: string;
    first_name: string;
    last_name: string;
    surname: string;
  };
  assessmentDetails: {
    score: number;
    method: string;
    description: string;
    uploadUrl: string | null;
    published: boolean;
    _id?: string;
  };
}

function Main() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteButtonRef = useRef<HTMLButtonElement>(null);
  const notify = useRef<NotificationElement>(null);

  const [grades, setGrades] = useState<any[]>([]);
  const [learningAreas, setLearningAreas] = useState<any[]>([]);
  const [strands, setStrands] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [substrands, setSubstrands] = useState<any[]>([]);
  const [stream, setStream] = useState("");
  const [substrand, setSubstrand] = useState<any>({});
  const [indicator, setIndicator] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [strand, setStrand] = useState("");
  const [selectedSubStrand, setSelectedSubStrand] = useState("");
  const [enrollments, setEnrollments] = useState<Assessment[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 0,
  });
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [adm_no, setAdmNo] = useState("");
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [dialog, setDialog] = useState(false);

  const [assessmentMethods, setAssessmentMethods] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: File | null;
  }>({});
  const [saveStatus, setSaveStatus] = useState<{
    [key: string]: "idle" | "saving" | "saved" | "error";
  }>({});

  const [isGradesLoading, setIsGradesLoading] = useState(false);
  const [isStreamsLoading, setIsStreamsLoading] = useState(false);
  const [isLearningAreasLoading, setIsLearningAreasLoading] = useState(false);
  const [isStrandsLoading, setIsStrandsLoading] = useState(false);
  const [isSubstrandsLoading, setIsSubstrandsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const learningArea = location?.state?.data;

  const initialState: StrandFilter = {
    grade: learningArea?.grade_id?._id || "",
    learning_area: learningArea?._id || "",
    term: learningArea?._id ? "1" : "",
  };

  const [strandFilter, setStrandFilter] = useState<StrandFilter>(() => {
    const savedState = localStorage.getItem("strandFilter");
    return savedState ? JSON.parse(savedState) : initialState;
  });

  const terms = [
    { _id: "1", name: "Term 1" },
    { _id: "2", name: "Term 2" },
    { _id: "3", name: "Term 3" },
  ];
  const [assessmentMethod, setAssessmentMethod] = useState<string[]>([]);
  const assessmentMethodOptions = [
    "Observation",
    "Portfolio",
    "Written Test",
    "Oral Assessment",
    "Project",
    "Practical Assessment",
    "Journal Assessment",
  ];

  interface ConfirmDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  }

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
      assessmentMethod: yup
        .array()
        .of(yup.string().required("Assessment method is required")),
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

  const getEnrollments = useCallback(async () => {
    if (!stream || !indicator) return;
    setLoading(true);
    try {
      const enrollments = await ApiService.getEnrolments({ stream }, {});
      setEnrollments(enrollments?.data || []);
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.message || "Failed to fetch enrollments.");
      notify.current?.showToast();
    } finally {
      setLoading(false);
    }
  }, [stream, indicator]);

  const getGrades = useCallback(async () => {
    setIsGradesLoading(true);
    try {
      const response = await ApiService.getGrades({ page: 1 });
      setGrades(response.data || []);
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.message || "Failed to fetch grades.");
      notify.current?.showToast();
    } finally {
      setIsGradesLoading(false);
    }
  }, []);

  const getLearningAreas = useCallback(async () => {
    setIsLearningAreasLoading(true);
    try {
      const response = await ApiService.getLearningAreas({});
      setLearningAreas(response.data || []);
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.message || "Failed to fetch learning areas.");
      notify.current?.showToast();
    } finally {
      setIsLearningAreasLoading(false);
    }
  }, []);

  const getStreams = useCallback(async (grade: string) => {
    if (!grade) return;
    setIsStreamsLoading(true);
    try {
      const response = await ApiService.getStream({ page: 1, grade });
      setStreams(response.data || []);
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.message || "Failed to fetch streams.");
      notify.current?.showToast();
    } finally {
      setIsStreamsLoading(false);
    }
  }, []);

  const getStrands = useCallback(async () => {
    if (!strandFilter.grade || !strandFilter.term) return;
    setIsStrandsLoading(true);
    try {
      const response = await ApiService.getStrands(
        { page, search, limit: 1000 },
        strandFilter
      );
      setStrands(response.data || []);
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.message || "Failed to fetch strands.");
      notify.current?.showToast();
    } finally {
      setIsStrandsLoading(false);
    }
  }, [strandFilter, page, search, limit]);

  const fetchIndicator = useCallback(async () => {
    if (!stream || !selectedSubStrand) return;
    setLoading(true);
    try {
      const response = await ApiService.getSingleSubstrand(
        stream,
        selectedSubStrand
      );
      setSubstrand(response.data || {});
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.message || "Failed to fetch indicator.");
      notify.current?.showToast();
    } finally {
      setLoading(false);
    }
  }, [stream, selectedSubStrand]);

  const generateAssessment = useCallback(
    async (indicatorId: string) => {
      if (
        !stream ||
        !selectedTerm ||
        !strandFilter.learning_area ||
        !indicatorId
      ) {
        setSuccess(false);
        setMessage(
          "Please select all required fields (Stream, Term, Learning Area, Indicator)."
        );
        notify.current?.showToast();
        return;
      }
      setLoading(true);
      try {
        const data = {
          indicator: indicatorId,
          term: selectedTerm,
          stream,
          adm_no,
        };
        const res = await ApiService.getAssessmentLerners(data);
        setEnrollments(res || []);
        setAssessmentMethods(
          res.map(
            (assessment: Assessment) =>
              assessment?.assessmentDetails?.method || ""
          )
        );
        setDialog(true);
      } catch (error: any) {
        setSuccess(false);
        setMessage(error.message || "Failed to generate assessment.");
        notify.current?.showToast();
      } finally {
        setLoading(false);
      }
    },
    [stream, selectedTerm, strandFilter.learning_area, adm_no]
  );

  // const handleInputChange = useCallback(
  //   async (
  //     assessment: Assessment,
  //     index: number,
  //     field: string,
  //     value: any
  //   ) => {
  //     const learnerId = assessment?.learner?._id;
  //     if (!learnerId) return;

  //     if (field === "score" && (value > 4 || value < 1)) {
  //       setSuccess(false);
  //       setMessage("Score must be between 1 and 4.");
  //       notify.current?.showToast();
  //       return;
  //     }

  //     if (
  //       field !== "description" &&
  //       (!substrand?._id ||
  //         !indicator ||
  //         !selectedTerm ||
  //         !strandFilter.learning_area ||
  //         !strand ||
  //         !learnerId)
  //     ) {
  //       setSuccess(false);
  //       setMessage("Please ensure all required fields are selected.");
  //       notify.current?.showToast();
  //       return;
  //     }

  //     setSaveStatus((prev) => ({ ...prev, [learnerId]: "saving" }));

  //     try {
  //       let updatedAssessment: any = {
  //         substrand: substrand?._id,
  //         indicator,
  //         term: selectedTerm,
  //         learning_area: strandFilter.learning_area,
  //         score:
  //           field === "score"
  //             ? Number(value)
  //             : Number(assessment?.assessmentDetails?.score || 1),
  //         strand,
  //         learner: learnerId,
  //         method:
  //           field === "method"
  //             ? value
  //             : assessment?.assessmentDetails?.method || "Written Test",
  //         description:
  //           field === "description"
  //             ? value
  //             : assessment?.assessmentDetails?.description || "",
  //         uploadUrl: assessment?.assessmentDetails?.uploadUrl || null,
  //       };

  //       if (field === "file" && value) {
  //         const formData = new FormData();
  //         formData.append("file", value);
  //         formData.append(
  //           "assessmentId",
  //           assessment?.assessmentDetails?._id || ""
  //         );
  //         const uploadResponse = await ApiService.uploadFile(formData);
  //         updatedAssessment.uploadUrl = uploadResponse.url;
  //         setUploadedFiles((prev) => ({ ...prev, [learnerId]: value }));
  //       }

  //       await ApiService.createAssessment(updatedAssessment);
  //       await generateAssessment(indicator);
  //       await fetchIndicator();
  //       setSaveStatus((prev) => ({ ...prev, [learnerId]: "saved" }));

  //       setTimeout(() => {
  //         setSaveStatus((prev) => ({ ...prev, [learnerId]: "idle" }));
  //       }, 2000);
  //     } catch (error: any) {
  //       setSaveStatus((prev) => ({ ...prev, [learnerId]: "error" }));
  //       setSuccess(false);
  //       setMessage(error.message || "Failed to save assessment.");
  //       notify.current?.showToast();
  //     }
  //   },
  //   [
  //     substrand,
  //     indicator,
  //     selectedTerm,
  //     strandFilter.learning_area,
  //     strand,
  //     generateAssessment,
  //     fetchIndicator,
  //   ]
  // );
  const handleInputChange = async (
    assessment: Assessment,
    index: number,
    field: string,
    value: any
  ) => {
    const learnerId = assessment?.learner?._id;
    console.log("assessment", assessment);

    if (!learnerId) return;

    // if (field === "score" && (value > 4 || value < 1)) {
    //   setSuccess(false);
    //   setMessage("Score must be between 1 and 4.");
    //   notify.current?.showToast();
    //   return;
    // }
    if (
      field !== "description" &&
      (!substrand?._id ||
        !indicator ||
        !selectedTerm ||
        !strandFilter.learning_area ||
        !strand ||
        !learnerId)
    ) {
      setSuccess(false);
      setMessage("Please ensure all required fields are selected.");
      notify.current?.showToast();
      return;
    }

    setSaveStatus((prev) => ({ ...prev, [learnerId]: "saving" }));

    try {
      console.log(assessment);
      const updatedAssessment: any = {
        substrand: substrand?._id,
        indicator,
        term: selectedTerm,
        learning_area: strandFilter.learning_area,
        score:
          field === "score"
            ? Number(value)
            : Number(assessment?.assessmentDetails?.score || 1),
        strand,
        learner: learnerId,
        method:
          field === "method"
            ? value
            : assessment?.assessmentDetails?.method || assessmentMethod,
        description: assessment?.assessmentDetails?.description || "",
        additionalDescription: assessment?.assessmentDetails?.description || "",
      };

      // Handle file upload
      if (field === "file" && value) {
        const formData = new FormData();
        formData.append("file", value);
        formData.append("learner", learnerId);
        formData.append("term", selectedTerm);
        formData.append("strand", strand);
        formData.append("substrand", substrand?._id);
        formData.append("indicator", indicator);
        formData.append("learning_area", strandFilter.learning_area);
        formData.append("score", updatedAssessment.score.toString());
        formData.append("method", updatedAssessment.method);
        formData.append("additionalDescription", updatedAssessment.description);
        formData.append("description", updatedAssessment.description);

        // console.log(formData);
        const response = await ApiService.createAssessment(formData);
        setUploadedFiles((prev) => ({ ...prev, [learnerId]: value }));
        updatedAssessment.uploadUrl = response.uploadUrl;
      } else {
        console.log(updatedAssessment);
        // Regular assessment update without file
        await ApiService.createAssessment(updatedAssessment);
        setEditingRow(null); // Set the editing row to the current learnerId
      }

      await generateAssessment(indicator);
      await fetchIndicator();
      setSaveStatus((prev) => ({ ...prev, [learnerId]: "saved" }));

      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, [learnerId]: "idle" }));
      }, 2000);
    } catch (error: any) {
      setSaveStatus((prev) => ({ ...prev, [learnerId]: "error" }));
      setSuccess(false);
      setMessage(error.message || "Failed to save assessment.");
      notify.current?.showToast();
    }
  };
  // const debouncedHandleInput = useMemo(
  //   () =>
  //     debounce(
  //       (
  //         assessment: Assessment,
  //         index: number,
  //         field: string,
  //         value: string
  //       ) => {
  //         handleInputChange(assessment, index, field, value);
  //       },
  //       5000
  //     ),
  //   [handleInputChange]
  // );

  const handleGradeChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      setStream("");
      setStrands([]);
      setSelectedSubStrand("");
      setSubstrands([]);
      setIndicator("");
      setStrandFilter((prev) => ({
        ...prev,
        grade: selectedValue,
        learning_area: "",
        term: "",
      }));
      await getStreams(selectedValue);
    },
    [getStreams]
  );

  const handleLearningAreaChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      setStrands([]);
      setSelectedSubStrand("");
      setSubstrands([]);
      setIndicator("");
      setStrandFilter((prev) => ({ ...prev, learning_area: selectedValue }));
    },
    []
  );

  const handleTermChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      setStrands([]);
      setStrandFilter((prev) => ({ ...prev, term: selectedValue }));
      setSelectedTerm(selectedValue);
    },
    []
  );

  const handleStrandChange = useCallback(
    async (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = event.target.value;
      setSubstrands([]);
      setSelectedSubStrand("");
      setIndicator("");
      setStrand(selectedValue);
      try {
        const res = await ApiService.getSubstrandByStrand(
          { limit: 10000 },
          selectedValue
        );
        setSubstrands(res.data || []);
      } catch (error: any) {
        setSuccess(false);
        setMessage(error.message || "Failed to fetch substrands.");
        notify.current?.showToast();
      }
    },
    []
  );

  const handleSubStrandChange = useCallback((value: string) => {
    setSelectedSubStrand(value);
  }, []);

  const publishIndicator = useCallback(async () => {
    const confirmed = await new Promise((resolve) => {
      setConfirmDialog({
        open: true,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });

    if (confirmed && indicator && selectedTerm && stream) {
      setLoading(true);
      try {
        await ApiService.toggleIdicatorStatus(indicator, {
          term: selectedTerm,
          stream,
        });
        await generateAssessment(indicator);
        setSuccess(true);
        setMessage("Indicator published successfully.");
        notify.current?.showToast();
      } catch (error: any) {
        setSuccess(false);
        setMessage(error.message || "Failed to publish indicator.");
        notify.current?.showToast();
      } finally {
        setLoading(false);
      }
    }
  }, [indicator, selectedTerm, stream, generateAssessment]);

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogProps>({
    open: false,
    onConfirm: () => {},
    onCancel: () => {},
  });

  const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onConfirm,
    onCancel,
  }) => (
    <Dialog open={open} onClose={onCancel}>
      <Dialog.Panel>
        <div className="p-5 text-center">
          <Lucide
            icon="AlertCircle"
            className="w-16 h-16 mx-auto mt-3 text-warning"
          />
          <div className="mt-5 text-3xl">Are you sure?</div>
          <div className="mt-2 text-slate-500">
            Once you publish, the results will be sent directly to the
            individual parents and this action is irreversible. Please confirm
            to continue or cancel to go back.
          </div>
        </div>
        <div className="px-5 pb-8 text-center">
          <Button
            variant="outline-secondary"
            type="button"
            onClick={onCancel}
            className="w-24 mr-1"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="primary"
            type="button"
            className="w-24"
          >
            Publish
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );

  const getDescriptionColor = (score: number) => {
    switch (score) {
      case 4:
        return "text-green-700";
      case 3:
        return "text-success";
      case 2:
        return "text-purple-600";
      case 1:
        return "text-orange-700";
      default:
        return "text-gray-600";
    }
  };

  useEffect(() => {
    getGrades();
    getLearningAreas();
  }, [getGrades, getLearningAreas]);

  useEffect(() => {
    getEnrollments();
  }, [getEnrollments]);

  useEffect(() => {
    getStrands();
  }, [getStrands]);

  useEffect(() => {
    fetchIndicator();
  }, [fetchIndicator]);

  useEffect(() => {
    if (indicator && stream && selectedTerm && strandFilter.learning_area) {
      generateAssessment(indicator);
    }
  }, [
    indicator,
    stream,
    selectedTerm,
    strandFilter.learning_area,
    generateAssessment,
  ]);

  useEffect(() => {
    localStorage.setItem("strandFilter", JSON.stringify(strandFilter));
  }, [strandFilter]);

  return (
    <>
      <ConfirmDialog
        open={confirmDialog.open}
        onConfirm={() => {
          confirmDialog.onConfirm();
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
        onCancel={() => {
          confirmDialog.onCancel();
          setConfirmDialog({ ...confirmDialog, open: false });
        }}
      />
      {dialog ? (
        <form className="mt-5 p-5 validate-form">
          <div className="assessment-header">
            <h2 className="text-xl flex items-center font-semibold mb-5">
              <a
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  reset();
                  setDialog(false);
                }}
                href="#"
              >
                <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
              </a>
              Assessment Score Entry Form
            </h2>
            <div className="meta-info grid grid-cols-2 gap-x-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="meta-row flex items-center mb-2">
                <label className="font-semibold text-md text-gray-700">
                  Grade:
                </label>
                <span className="text-md text-gray-800 ml-2">
                  {substrand?.strand?.learning_area?.grade_id?.name || "N/A"}
                </span>
              </div>
              <div className="meta-row flex items-center mb-2">
                <label className="font-semibold text-md text-gray-700">
                  Learning Area:
                </label>
                <span className="text-md text-gray-800 ml-2">
                  {substrand?.strand?.learning_area?.name || "N/A"}
                </span>
              </div>
              <div className="meta-row flex items-center mb-2">
                <label className="font-semibold text-md text-gray-700">
                  Strand:
                </label>
                <span className="text-md text-gray-800 ml-2">
                  {substrand?.strand?.name || "N/A"}
                </span>
              </div>
              <div className="meta-row flex items-center mb-2">
                <label className="font-semibold text-md text-gray-700">
                  Substrand:
                </label>
                <span className="text-md text-gray-800 ml-2">
                  <div
                    className="font-medium inline-block richtext"
                    dangerouslySetInnerHTML={{
                      __html: substrand.name || "N/A",
                    }}
                  />
                </span>
              </div>
              <div className="meta-row flex items-center mb-2">
                <label className="font-semibold text-md text-gray-700">
                  Indicator:
                </label>
                <span className="text-md text-gray-800 ml-2">
                  {substrand?.indicators
                    ?.flat()
                    .find((ind: any) => ind._id === indicator)?.description ||
                    "N/A"}
                </span>
              </div>
              <div className="meta-row flex items-center mb-2">
                <label className="font-semibold text-md text-gray-700">
                  Publish:
                </label>
                <span className="text-md text-gray-800 ml-2">
                  <FormInput
                    type="checkbox"
                    className="w-5 h-5"
                    onChange={(e: any) => publishIndicator()}
                  />
                </span>
              </div>
              <div className="meta-row flex items-center col-span-2 mt-0.5">
                <Loader className="text-success animate-spin mr-2" />
                <span className="text-sm text-success font-medium">
                  (Auto-saving)
                </span>
              </div>
            </div>
          </div>
          <div className="col-span-12 overflow-auto 2xl:overflow-visible">
            <div className="flex flex-wrap col-span-12 mt-2 xl:flex-nowrap">
              <div className="hidden mx-auto md:block text-slate-500 mt-5" />
              <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-3">
                <div className="relative w-56 text-slate-500">
                  <FormInput
                    type="text"
                    className="w-56 pr-10 !box rounded-lg"
                    placeholder="Adm No..."
                    onChange={(e) => setAdmNo(e.target.value)}
                  />
                  <Lucide
                    icon="Search"
                    className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                  />
                </div>
              </div>
            </div>
            <Table className="border-spacing-y-[3px] border-separate mt-2">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="text-left border-b-1 whitespace-nowrap w-[20px]">
                    No
                  </Table.Th>
                  <Table.Th className="text-left border-b-1 whitespace-nowrap w-[150px]">
                    ADM No
                  </Table.Th>
                  <Table.Th className="border-b-1 whitespace-nowrap w-[300px]">
                    NAME
                  </Table.Th>
                  <Table.Th className="text-left border-b-1 whitespace-nowrap w-[100px]">
                    Score
                  </Table.Th>
                  <Table.Th className="text-left border-b-1 whitespace-nowrap w-[150px]">
                    Assessment Method
                  </Table.Th>
                  <Table.Th className="text-left border-b-1 whitespace-wrap">
                    DESCRIPTION
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {enrollments.map((assessment, key) => {
                  const learnerId = assessment?.learner?._id;
                  const isEditing = editingRow === learnerId; // Track edit state per row

                  return (
                    <Table.Tr key={key} className="">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {key + 1}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {assessment?.learner?.adm_no || "N/A"}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <div className="flex">
                          <div className="ml-4">
                            {`${assessment?.learner?.first_name || ""} ${
                              assessment?.learner?.last_name || ""
                            } ${assessment?.learner?.surname || ""}`}
                          </div>
                        </div>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <FormInput
                          {...register(`score[${key}]`)}
                          type="text" // Use "text" to have better control over input length
                          onKeyDown={(e) => {
                            const allowedKeys = [
                              "1",
                              "2",
                              "3",
                              "4",
                              "Backspace",
                              "Tab",
                              "ArrowLeft",
                              "ArrowRight",
                            ];
                            if (!allowedKeys.includes(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onInput={(e: any) => {
                            const val = e.target.value;
                            // Remove any non-allowed characters or extra digits
                            if (!["1", "2", "3", "4"].includes(val)) {
                              e.target.value = "";
                            } else if (val.length > 1) {
                              e.target.value = val[0]; // Trim to first allowed character
                            }
                          }}
                          maxLength={1}
                          className="form-control w-[100px]"
                          defaultValue={assessment?.assessmentDetails?.score}
                          disabled={assessment?.assessmentDetails?.published}
                          onChange={(e) =>
                            handleInputChange(
                              assessment,
                              key,
                              "score",
                              e.target.value
                            )
                          }
                        />
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <div className="flex items-center">
                          <FormSelect
                            {...register(`assessmentMethod[${key}]`)}
                            className="w-[120px]"
                            value={assessmentMethods[key] || ""}
                            onChange={(e) => {
                              const newMethods = [...assessmentMethods];
                              newMethods[key] = e.target.value;
                              setAssessmentMethods(newMethods);
                              handleInputChange(
                                assessment,
                                key,
                                "method",
                                e.target.value
                              );
                            }}
                            disabled={assessment?.assessmentDetails?.published}
                          >
                            <option value="">Select Method</option>
                            {assessmentMethodOptions.map((method, idx) => (
                              <option key={idx} value={method}>
                                {method}
                              </option>
                            ))}
                          </FormSelect>
                          {[
                            "Portfolio",
                            "Project",
                            "Journal Assessment",
                            "Practical Assessment",
                          ].includes(assessmentMethods[key]) && (
                            <div className="ml-2">
                              <label className="cursor-pointer">
                                <Upload className="w-5 h-5 text-blue-500" />
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx,.jpg,.png"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleInputChange(
                                      assessment,
                                      key,
                                      "file",
                                      e.target.files?.[0] || null
                                    )
                                  }
                                  disabled={
                                    assessment?.assessmentDetails?.published
                                  }
                                />
                              </label>
                              {uploadedFiles[learnerId] && (
                                <span className="text-xs text-green-600 ml-1">
                                  Uploaded
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </Table.Td>
                      {isEditing ? (
                        <Table.Td
                          className={`first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] ${getDescriptionColor(
                            assessment?.assessmentDetails?.score
                          )}`}
                        >
                          <div className="flex items-center">
                            <FormTextarea
                              className="w-full"
                              value={
                                assessment?.assessmentDetails?.description || ""
                              }
                              onBlur={() => {
                                handleInputChange(
                                  assessment,
                                  key,
                                  "description",
                                  assessment?.assessmentDetails?.description
                                );
                                //  setEditingRow(null); // Exit edit mode after saving
                              }}
                              onChange={(e) => {
                                e.target.style.height = "auto";
                                e.target.style.height = `${e.target.scrollHeight}px`;
                                setEnrollments((prev) =>
                                  prev.map((item, index) =>
                                    index === key
                                      ? {
                                          ...item,
                                          assessmentDetails: {
                                            ...item.assessmentDetails,
                                            description: e.target.value,
                                          },
                                        }
                                      : item
                                  )
                                );
                              }}
                              disabled={
                                assessment?.assessmentDetails?.published
                              }
                            />
                            <div className="ml-2 flex items-center">
                              {saveStatus[learnerId] === "saving" && (
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Loader className="w-4 h-4 animate-spin mr-1" />
                                  Saving...
                                </span>
                              )}
                              {saveStatus[learnerId] === "saved" && (
                                <span className="text-xs text-green-600 flex items-center">
                                  <Lucide
                                    icon="CheckCircle"
                                    className="w-4 h-4 mr-1"
                                  />
                                  Saved
                                </span>
                              )}
                              {saveStatus[learnerId] === "error" && (
                                <span
                                  className="text-xs text-red-600 flex items-center cursor-pointer"
                                  onClick={() =>
                                    handleInputChange(
                                      assessment,
                                      key,
                                      "description",
                                      assessment?.assessmentDetails?.description
                                    )
                                  }
                                >
                                  <Lucide
                                    icon="XCircle"
                                    className="w-4 h-4 mr-1"
                                  />
                                  Retry
                                </span>
                              )}
                            </div>
                          </div>
                        </Table.Td>
                      ) : (
                        <Table.Td
                          className={`first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] ${getDescriptionColor(
                            assessment?.assessmentDetails?.score
                          )}`}
                        >
                          <span>
                            <b>
                              {assessment?.assessmentDetails?.score == 4
                                ? "Exceeding Expectation: " +
                                  assessment?.learner?.first_name
                                : ""}
                              {assessment?.assessmentDetails?.score == 3
                                ? "Meeting Expectation: " +
                                  assessment?.learner?.first_name
                                : ""}
                              {assessment?.assessmentDetails?.score == 2
                                ? "Approaching Expectation: " +
                                  assessment?.learner?.first_name
                                : ""}
                              {assessment?.assessmentDetails?.score == 1
                                ? "Below Expectation: " +
                                  assessment?.learner?.first_name
                                : ""}
                            </b>{" "}
                            {assessment?.assessmentDetails?.description
                              ? assessment.assessmentDetails.description
                                  .charAt(0)
                                  .toLowerCase() +
                                assessment.assessmentDetails.description.slice(
                                  1
                                )
                              : ""}
                            {!assessment?.assessmentDetails?.published && (
                              <a
                                href="#"
                                className="ml-2 text-blue-600 hover:underline"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setEditingRow(learnerId);
                                }}
                              >
                                Edit
                              </a>
                            )}
                          </span>
                        </Table.Td>
                      )}
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </div>
        </form>
      ) : (
        <>
          <h2 className="mt-5 text-xl font-medium flex flex-wrap">
            {learningArea?.name || "N/A"}
          </h2>
          <div className="box mb-5 mt-5 items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400 rounded-lg shadow-sm">
            <h2 className="mr-auto text-base font-medium border-b p-2">
              Learners Details
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="col-span-12 sm:col-span-2 relative">
                <FormLabel htmlFor="modal-form-6">Grade</FormLabel>
                <FormSelect
                  {...register("grade")}
                  name="grade"
                  value={strandFilter.grade}
                  onChange={handleGradeChange}
                  className="rounded-lg hover:border-blue-500"
                >
                  <option value="">Select Grade</option>
                  {grades.map((grade: any) => (
                    <option key={grade._id} value={grade._id}>
                      {grade.name}
                    </option>
                  ))}
                </FormSelect>
                {isGradesLoading && (
                  <LoadingIcon
                    icon="spinning-circles"
                    className="absolute right-2 top-10 w-4 h-4 text-blue-500"
                  />
                )}
                {errors.grade?.message && (
                  <div className="mt-2 text-danger">
                    {String(errors.grade.message)}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-2 relative">
                <FormLabel htmlFor="modal-form-6">Stream</FormLabel>
                <FormSelect
                  {...register("stream")}
                  name="stream"
                  value={stream}
                  onChange={(event) => setStream(event.target.value)}
                  className="rounded-lg hover:border-blue-500"
                >
                  <option value="">Select Stream</option>
                  {streams.map((stream: any) => (
                    <option key={stream._id} value={stream._id}>
                      {stream.name}
                    </option>
                  ))}
                </FormSelect>
                {isStreamsLoading && (
                  <LoadingIcon
                    icon="spinning-circles"
                    className="absolute right-2 top-10 w-4 h-4 text-blue-500"
                  />
                )}
                {errors.stream && (
                  <div className="mt-2 text-danger">
                    {typeof errors.stream.message === "string"
                      ? errors.stream.message
                      : ""}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-2">
                <FormLabel htmlFor="modal-form-6">Academic Term</FormLabel>
                <TomSelect
                  name="term"
                  value={selectedTerm}
                  onChange={setSelectedTerm}
                  className="rounded-lg hover:border-blue-500"
                >
                  <option value="">Select Academic Term</option>
                  {terms.map((term) => (
                    <option key={term._id} value={term._id}>
                      {term.name}
                    </option>
                  ))}
                </TomSelect>
                {errors.term && (
                  <div className="mt-2 text-danger">
                    {typeof errors.term.message === "string"
                      ? errors.term.message
                      : ""}
                  </div>
                )}
              </div>
            </div>
            <h2 className="mr-auto text-base font-medium border-b p-2 mt-3">
              Assessment Details
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-10">
              <div className="col-span-12 sm:col-span-2 relative">
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Learning Area
                </FormLabel>
                <FormSelect
                  {...register("learning_area")}
                  value={strandFilter.learning_area}
                  name="learning_area"
                  onChange={handleLearningAreaChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500"
                >
                  <option value="">Select Learning Area</option>
                  {learningAreas
                    .filter(
                      (area: any) => area?.grade_id?._id === strandFilter?.grade
                    )
                    .map((area: any) => (
                      <option key={area._id} value={area._id}>
                        {area.name}
                      </option>
                    ))}
                </FormSelect>
                {isLearningAreasLoading && (
                  <LoadingIcon
                    icon="spinning-circles"
                    className="absolute right-2 top-10 w-4 h-4 text-blue-500"
                  />
                )}
                {errors.learning_area && (
                  <div className="mt-2 text-sm text-red-600">
                    {typeof errors.learning_area.message === "string"
                      ? errors.learning_area.message
                      : ""}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-2">
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Term
                </FormLabel>
                <FormSelect
                  {...register("term")}
                  value={strandFilter.term}
                  name="term"
                  onChange={handleTermChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500"
                >
                  <option value="">Select Term</option>
                  {terms.map((term) => (
                    <option key={term._id} value={term._id}>
                      {term.name}
                    </option>
                  ))}
                </FormSelect>
                {errors.term && (
                  <div className="mt-2 text-sm text-red-600">
                    {typeof errors.term.message === "string"
                      ? errors.term.message
                      : ""}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-2 relative">
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Strand
                </FormLabel>
                <FormSelect
                  {...register("strand")}
                  name="strand"
                  value={strand}
                  onChange={handleStrandChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500"
                >
                  <option value="">Select Strand</option>
                  {strands.map((strand) => (
                    <option key={strand._id} value={strand._id}>
                      <div
                        className="font-medium inline-block richtext"
                        dangerouslySetInnerHTML={{ __html: strand.name }}
                      />
                    </option>
                  ))}
                </FormSelect>
                {isStrandsLoading && (
                  <LoadingIcon
                    icon="spinning-circles"
                    className="absolute right-2 top-10 w-4 h-4 text-blue-500"
                  />
                )}
                {errors.strand && (
                  <div className="mt-2 text-sm text-red-600">
                    {typeof errors.strand.message === "string"
                      ? errors.strand.message
                      : ""}
                  </div>
                )}
              </div>
              <div className="col-span-12 sm:col-span-4 relative">
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Substrand
                </FormLabel>
                <TomSelect
                  {...register("substrand")}
                  value={selectedSubStrand}
                  name="substrand"
                  onChange={handleSubStrandChange}
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-blue-500"
                >
                  <option value="">Select Substrand</option>
                  {substrands.map((substrand) => (
                    <option key={substrand._id} value={substrand._id}>
                      <div
                        className="font-medium inline-block richtext"
                        dangerouslySetInnerHTML={{ __html: substrand.name }}
                      />
                    </option>
                  ))}
                </TomSelect>
                {isSubstrandsLoading && (
                  <LoadingIcon
                    icon="spinning-circles"
                    className="absolute right-2 top-10 w-4 h-4 text-blue-500"
                  />
                )}
                {errors.substrand && (
                  <div className="mt-2 text-sm text-red-600">
                    {typeof errors.substrand.message === "string"
                      ? errors.substrand.message
                      : ""}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="box mb-5 mt-5 p-6 border rounded-lg shadow-md bg-white dark:bg-darkmode-700 dark:border-darkmode-400">
            <div className="col-span-12 sm:col-span-4">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-800 dark:text-gray-100">
                Indicator
              </h2>
              <Table className="border-spacing-y-2 border-separate">
                <Table.Thead className="bg-gray-100 dark:bg-darkmode-800">
                  <Table.Tr>
                    <Table.Th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </Table.Th>

                    <Table.Th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 text-left">
                      Assessment Progress
                    </Table.Th>
                    <Table.Th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 text-left">
                      Assessment Method
                    </Table.Th>
                    <Table.Th className="py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Actions
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {substrand?.indicators?.map((indicator: any, key: number) => (
                    <Table.Tr
                      key={key}
                      className="hover:bg-gray-50 dark:hover:bg-darkmode-600 transition-colors"
                      // onClick={() => setIndicator(indicator[0]?._id)}
                    >
                      <Table.Td className="py-3 px-4 bg-white dark:bg-darkmode-600 shadow-sm rounded-md">
                        {indicator[0]?.description || "N/A"}
                      </Table.Td>
                      <Table.Td className="py-3 px-4 bg-white dark:bg-darkmode-600 shadow-sm rounded-md">
                        <ProgressBar
                          total={indicator[0]?.total_learners || 0}
                          assessed={indicator[0]?.total_learners_assessed || 0}
                        />
                      </Table.Td>
                      <Table.Td className="py-3 px-4 bg-white dark:bg-darkmode-600 shadow-sm rounded-md">
                        <FormSelect
                          className="w-[120px]"
                          value={indicator[0]?.method || ""}
                          onChange={(e) => {
                            setSubstrand((prev: any) => {
                              if (!prev) return prev;
                              const updatedIndicators = [...prev.indicators];
                              updatedIndicators[key] = [
                                {
                                  ...indicator[0],
                                  method: e.target.value,
                                },
                              ];
                              return { ...prev, indicators: updatedIndicators };
                            });
                          }}
                        >
                          <option value="">Select Method</option>
                          {assessmentMethodOptions.map((method, idx) => (
                            <option key={idx} value={method}>
                              {method}
                            </option>
                          ))}
                        </FormSelect>
                      </Table.Td>
                      <Table.Td className="py-3 px-4 bg-white dark:bg-darkmode-600 shadow-sm rounded-md">
                        <Button
                          onClick={() => {
                            if (!indicator[0]?.method) {
                              alert("Select Assessement Method");
                              return;
                            }
                            setAssessmentMethod(indicator[0]?.method);
                            setIndicator(indicator[0]?._id);
                            generateAssessment(indicator[0]?._id);
                          }}
                          variant="primary"
                          type="button"
                          className="w-28 text-white bg-blue-600 hover:bg-blue-700 transition-all rounded-lg py-2"
                          disabled={
                            !stream ||
                            !selectedTerm ||
                            !strandFilter.learning_area
                          }
                        >
                          Assess
                          {loading && (
                            <LoadingIcon
                              icon="spinning-circles"
                              color="white"
                              className="w-4 h-4 ml-2 animate-spin"
                            />
                          )}
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
              {errors.indicator && (
                <div className="mt-3 text-sm text-red-600 dark:text-red-400">
                  {String(errors.indicator.message)}
                </div>
              )}
            </div>
          </div>
          <Dialog
            staticBackdrop
            size="lg"
            open={dialog}
            onClose={() => setDialog(false)}
          >
            <Dialog.Panel />
          </Dialog>
          <Dialog
            open={confirmDelete}
            onClose={() => setConfirmDelete(false)}
            initialFocus={deleteButtonRef}
          >
            <Dialog.Panel>
              <div className="p-5 text-center">
                <Lucide
                  icon="XCircle"
                  className="w-16 h-16 mx-auto mt-3 text-danger"
                />
                <div className="mt-5 text-3xl">Are you sure?</div>
                <div className="mt-2 text-slate-500">
                  Do you really want to delete this record? <br />
                  This process cannot be undone.
                </div>
              </div>
              <div className="px-5 pb-8 text-center">
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="w-24 mr-1 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    // Implement deleteRecord if needed
                    setConfirmDelete(false);
                  }}
                  variant="danger"
                  type="button"
                  className="w-24 rounded-lg"
                  ref={deleteButtonRef}
                >
                  Delete
                </Button>
              </div>
            </Dialog.Panel>
          </Dialog>
        </>
      )}
      <Notification
        options={{ duration: 3000 }}
        // getRef={(el) => (notify.current = el)}
        className="flex rounded-lg shadow-md"
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
