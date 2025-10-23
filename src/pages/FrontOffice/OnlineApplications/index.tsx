import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../../base-components/Button";

import { X, Paperclip, Send, MoreHorizontal, Eye, Edit, ArrowLeftRight, LogOut } from "lucide-react"; // Using Lucide icons for a modern look
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormSwitch,
  FormTextarea,
} from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import { Dialog, Menu } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import * as ApiService from "../../../services/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Notification, {
  NotificationElement,
} from "../../../base-components/Notification";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../contexts/Auth";

import LoadingIcon from "../../../base-components/LoadingIcon";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, Search } from "lucide-react";
import TomSelect from "../../../base-components/TomSelect";
import * as C from "../../../utils/constants";
import Pagination from "../../../base-components/Pagination";
import Alert from "../../../base-components/Alert";
import Dropzone from "dropzone";
import Tippy from "../../../base-components/Tippy";
import * as c from "../../../utils/constants";
import leanerImg from "../../../assets/images/learner.jpeg";
import { formatDate, is_admin } from "../../../utils/helper";
import io, { Socket } from "socket.io-client";

interface TableRow {
  no: number;
  strandName: string;
}
const auth = localStorage.getItem("@AuthData"); // No need for `await` since `localStorage` is synchronous

let auth_data = auth ? JSON.parse(auth) : null; // Prevents JSON.parse(null) error

let user = auth_data?.user;

const socket: Socket = io(import.meta.env.VITE_API_ENDPOINT, {
  transports: ["websocket"],
  auth: {
    token: `Bearer ${user?.token}`,
  },
});




function Main() {
  // const [confirmDelete, setConfirmDelete] = useState(false);
  const { hasPermission } = useAuth();
  const [exit, setExit] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const deleteButtonRef = useRef(null);
  const [grades, setGrades] = useState([]);
  const [test, setTest] = useState("");
  const [tests, setTests] = useState<any>([]);

  const [learner_grades, setLearnerGrades] = useState([]);
  const [grade, setGrade] = useState("");
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportDialog, setExportDialog] = useState(false);
  const approveButtonRef = useRef(null);
  const [approveDialog, setApproveDialog] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<any>(null);
  const [approveTranfer, setApproveTranfer] = useState<any>({
    learner: [],
    to_stream: "",
    to_grade: "",
    from_grade: "",
    from_stream: "",
    from_session: "",
    next_session: "",
    exit: false,
  });
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [schools, setSchools] = useState([]);
  const [selectGroup, setGroup] = useState([""]);
  const [selectPermission, setPermission] = useState([""]);
  const [recordId, setRecordId] = useState(null);
  const [dialog, setDialog] = useState(false);
  const [loading, isLoading] = useState(true);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState("");
  const [profile, setProfile] = useState(false);
  const [learner, setLearner] = useState<any>({});
  const [learners, setLearners] = useState([]);
  const [stream, setStream] = useState("");
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
  const [strandFilter, setStrandFilter] = useState({
    school: "na",
    grade: "na",
    stream: "na",
  });
  const [pdfUrl, setPdfUrl] = useState("");

  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedLeaningArea, setSelectedLearningArea] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");

  const [streams, setStreams] = useState([]);
  const [academic, setAcademic] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [parents, setParents] = useState([]);
  const [guardianIdNo, setGuardianIdNo] = useState("");
  const [guardianIdNo2, setGuardianIdNo2] = useState("");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basicInfo"); // Default to Basic Info
  const [learningAreas, setLearningAreas] = useState([]);
  const [messages, setMessages] = useState<any>([]);
  const [loadings, setLoading] = useState<boolean>(false);
  const [parentLoading, setParentLoading] = useState<boolean>(true);
  
  // Link generation states
  const [linkDialog, setLinkDialog] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [linkData, setLinkData] = useState({
    startDate: "",
    endDate: "",
    applicationFee: 1000,
    title: ""
  });

  // Cohort-related state variables
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [selectedCohort, setSelectedCohort] = useState<any>(null);
  const [cohortDialog, setCohortDialog] = useState(false);
  const [cohortData, setCohortData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
    maxApplications: 100,
    isActive: true,
    generatedBy: user?.id || user?._id
  });
  const [viewCohortDialog, setViewCohortDialog] = useState(false);
  const [selectedCohortFilter, setSelectedCohortFilter] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('');
  const [mainActiveTab, setMainActiveTab] = useState<'applicants' | 'cohorts'>('applicants');
  interface ChatComponentProps {
    user: { _id: string };
    selectedParent: {
      _id: string;
      first_name: string;
      last_name: string;
    } | null;
    socket: any; // Replace with your socket type (e.g., Socket from "socket.io-client")
  }
  interface ChatComponentProps {
    user: { _id: string };
    selectedParent: {
      _id: string;
      first_name: string;
      last_name: string;
    } | null;
    socket: any; // Replace with your socket type (e.g., Socket from "socket.io-client")
  }
  interface Message {
    learner: string;
    sender: string;
    receiver: string;
    message?: string;
    attachments?: {
      url: string;
      fileName: string;
      fileType: string;
      fileSize: number;
    }[];
    createdAt: string;
  }
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const [attachments, setAttachments] = useState<File[]>([]);
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setAttachments((prev) => [...prev, ...files]);
  };



  useEffect(() => {
    if (!socket) return;

    socket.emit("register", { userId: user?._id, userType: "parent" });

    const handleReceiveMessage = (newMessage: Message) => {
      setMessages((prev: any) => [...prev, newMessage]);
      if (!audioRef.current) {
        audioRef.current = new Audio("/audio/notification.mp3");
      }
      audioRef.current
        .play()
        .catch((err) => console.error("Audio play failed:", err));
    };

    socket.on("receiveMessage", handleReceiveMessage);

    // Cleanup function
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, user?._id]);

  const handleNavigate = (learnerId: any) => {
    navigate(`/learner/${learnerId}`, {
      replace: true,
      state: { data: learnerId },
    });
  };
  const terms = [
    { _id: 1, name: "Term 1" },
    { _id: 2, name: "Term 2" },
    { _id: 3, name: "Term 3" },
  ];
  const getLeanerClasses = async (learner: any) => {
    const response = await ApiService.learnerHistory(learner);
    setLearnerGrades(response.data);
  };
  const getLearningAreas = async () => {
    const response = await ApiService.getLeanerLeaningAreaAdmin({
      term: selectedTerm,
      learner: learner._id,
      session: selectedAcademicYear,
    });
    setLearningAreas(response.data);
  };

  // Success notification
  const notify = useRef<NotificationElement>();
  const schema = yup
    .object({
      first_name: yup.string().required("First name is required"),
      gender: yup.string().required("Gender  is required"),
      // surname: yup.string().required("Surname is required"),
      adm_no: yup.string().required("Adm No is required"),
      grade: yup.string().required("Grade is required"),
      stream: yup.string().required("Stream is required"),
      guardian_first_name: yup.string().required("First name is required"),

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



 
  const onSubmitMesage = async (e?: any) => {
    // if (e) e.preventDefault();
    if (!content.trim() && attachments.length === 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("learner", learner._id);

      formData.append("sender", user?._id);
      formData.append("senderModel", "PortalUser");
      formData.append("receiver", selectedParent?._id ?? "");
      formData.append("receiverModel", "Parent");
      formData.append("message", content || "");

      attachments.forEach((file: any) => formData.append("attachments", file));
      console.log(attachments);
      const response = await ApiService.sendMessage(formData);

      fetchMessages();
      setContent("");
      setAttachments([]);
      setLoading(false);
      notify.current?.showToast();
    } catch (error) {
      console.error("Failed to send message:", error);
      setLoading(false);
      notify.current?.showToast();
    }
  };

  const fetchMessages = async () => {
    if (!selectedParent) return;
    setLoading(true);
    try {
      const response = await ApiService.getMessage({
        parent: selectedParent._id,
        learner: learner._id,
      });
      setMessages(response.data as Message[]);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setLoading(false);
    }
  };
  const onSubmit = async (event: any) => {
    event.preventDefault();
    const result = await trigger();
    if (result && !loading) {
      isLoading(true);
      setIsEditMode(false);
      try {
        const data = await getValues();
        await ApiService.createLearner(data);
        await getStudents();
        await cancel({ name: "" });
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage(
          isEditMode
            ? "Learner Updated successfully"
            : "Learner created successfully."
        );
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(
          error.message || "An error occurred while creating the learner."
        );
        notify.current?.showToast();
      }
    }
  };
  const getTests = async () => {
    const response = await ApiService.getLeanerTests({
      learner: learner._id,
      term: selectedTerm,
      session: selectedAcademicYear,
    });

    setTests(response.data);
  };
  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });

    setGrades(response.data);
  };
  useEffect(() => {
    getGrades();
    loadCohorts();
    // getParents();
  }, []);
  useEffect(() => {
    getStreams();
  }, [grade]);
  useEffect(() => {
    getStudents();
  }, [search, page, limit, grade, stream, sortField, sortOrder, selectedCohortFilter, selectedStatusFilter]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Check file type
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        alert("Please upload a CSV file.");
        event.target.value = ""; // Clear the file input to prevent uploading
        return;
      }

      setSelectedFile(file);
    }
  };
  const approveTranferSubmit = async () => {
    console.log("event");
    // event.preventDefault();
    // const result = await trigger();
    console.log(approveTranfer);
    // return;
    if (!loading) {
      isLoading(true);
      try {
        const data = await getValues();
        console.log();
        // data.transferCode = approveTranfer.transferCode;
        let res = await ApiService.leanersPromote(approveTranfer);
        if (!res.success) {
          throw Error("Failed To tranfer");
        }
        await getStudents();

        await reset({ name: "" });
        isLoading(false);
        setApproveDialog(false);
        setSuccess(true);
        setMessage(
          !approveTranfer.exit
            ? "Transfer Approved successfully."
            : "Learner Exited successfully."
        );
        notify.current?.showToast();
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(
          error.message || "An error occurred while creating the learner."
        );
        notify.current?.showToast();
      }
    }
  };
  const exportTemplate = async () => {
    console.log(selectedFile);

    try {
      if (!stream) {
        throw Error("Select stream to download");
      }
      const res = await ApiService.exportLearners({
        stream: stream,
      });
      setUploadDialog(false);
      setSuccess(true);
      setMessage(res.message);
      notify.current?.showToast();

      setDialog(false);
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      setMessage(error.message || "An error occurred while creating the role.");
      notify.current?.showToast();
    }
  };

  // Call the function with API response
  const exportToCSV = (jsonData: any) => {
    if (!jsonData || (!jsonData.data && !jsonData.errors)) return;

    // Extract and merge data from both arrays
    const combinedData = [...(jsonData.data || []), ...(jsonData.errors || [])];

    if (combinedData.length === 0) return;

    // Extract headers from the first object
    const headers = Object.keys(combinedData[0]);

    // Convert JSON to CSV
    const csvRows = [
      headers.join(","), // Header row
      ...combinedData.map((row) =>
        headers.map((field) => `"${row[field] || ""}"`).join(",")
      ),
    ];

    // Create Blob and download
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "export.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const importData = async () => {
    console.log(selectedFile);

    if (!loading) {
      if (!selectedFile) {
        // Handle case where no file is selected
        return;
      }
      isLoading(true);

      try {
        const formData = new FormData();
        formData.append("csvFile", selectedFile);
        formData.append("stream", "");

        const res = await ApiService.importLearners(formData);
        // await getStrands();
        exportToCSV(res);
        await getStudents();
        isLoading(false);
        setUploadDialog(false);
        setSuccess(true);
        setMessage(res.message);
        notify.current?.showToast();

        setDialog(false);
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(
          error.message || "An error occurred while creating the role."
        );
        notify.current?.showToast();
      }
    }
  };
  const getStudents = async () => {
    isLoading(true);
    try {
      const response = await ApiService.getOnlineApplicants(
        {
          page,
          search,
          limit,
          grade,
          stream,
          sortField,
          sortOrder, // Include sorting in API request
          // status: selectedStatusFilter ? [selectedStatusFilter] : ["P"],
          cohortId: selectedCohortFilter || undefined, // Add cohort filtering
        },
        strandFilter
      );
      const pagination = response?.pagination;

      // Apply client-side filtering based on selectedStatusFilter
      let filteredApplicants = response?.applicants || [];
      
      if (selectedStatusFilter) {
        filteredApplicants = filteredApplicants.filter((applicant: any) => 
          applicant.applicationStatus === selectedStatusFilter
        );
      }
      
      // Update pagination to reflect filtered results
      const filteredPagination = {
        current_page: Number(pagination?.current_page),
        total: filteredApplicants.length, // Use filtered count
        total_pages: Math.ceil(filteredApplicants.length / parseInt(limit.toString())),
        per_page: Number(pagination?.per_page),
      };
      
      setPagination(filteredPagination);
      setLearners(filteredApplicants);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLearners([]); // Ensure learners is always an array
    } finally {
      isLoading(false);
    }
  };

  // Link generation functions - now creates cohorts in backend
  const generateLink = async () => {
    try {
      if (!linkData.title || !linkData.startDate || !linkData.endDate) {
        alert('Please fill in all required fields (Title, Start Date, End Date)');
        return;
      }

      // Create cohort data
      const cohortPayload = {
        name: linkData.title,
        description: `Online application form for ${linkData.title}`,
        startDate: linkData.startDate,
        endDate: linkData.endDate,
        applicationFee: linkData.applicationFee || 1000,
        maxApplications: 1000, // Default max applications
        isActive: true,
        generatedBy: user?.id || user?._id,
        settings: {
          allowLateApplications: false,
          requireDocuments: true,
          autoApprove: false
        }
      };

      // Create cohort in backend
      const response = await ApiService.createCohort(cohortPayload);
      
      if (response.cohort) {
        const cohort = response.cohort;
        
        // Update generated link with cohort URL
        setGeneratedLink(cohort.applicationUrl);
        
        // Copy to clipboard
        await navigator.clipboard.writeText(cohort.applicationUrl);
        
        // Refresh cohorts list
        loadCohorts();
        
        // Show success message
        alert(`Cohort created successfully!\n\nCohort: ${cohort.name}\nApplication URL copied to clipboard!`);
        
        // Close dialog
        setLinkDialog(false);
      }
      
    } catch (error) {
      console.error('Error creating cohort:', error);
      alert('Error creating cohort. Please try again.');
    }
  };

  // Load cohorts from backend
  const loadCohorts = async () => {
    try {
      const response = await ApiService.getAllCohorts();
      if (response.cohorts) {
        setCohorts(response.cohorts);
      }
    } catch (error) {
      console.error('Error loading cohorts:', error);
    }
  };

  // Cohort management functions
  const createCohort = async () => {
    try {
      if (!cohortData.name || !cohortData.startDate || !cohortData.endDate) {
        alert('Please fill in all required fields');
        return;
      }

      const cohortPayload = {
        ...cohortData,
        generatedBy: user?.id || user?._id,
        settings: {
          allowLateApplications: false,
          requireDocuments: true,
          autoApprove: false
        }
      };

      // Create cohort in backend
      const response = await ApiService.createCohort(cohortPayload);
      
      if (response.cohort) {
        // Refresh cohorts list
        loadCohorts();
        
        // Reset form
        setCohortData({
          name: "",
          startDate: "",
          endDate: "",
          description: "",
          maxApplications: 100,
          isActive: true,
          generatedBy: user?.id || user?._id
        });
        
        setCohortDialog(false);
        alert('Cohort created successfully!');
      }
      
    } catch (error) {
      console.error('Error creating cohort:', error);
      alert('Error creating cohort. Please try again.');
    }
  };

  const generateCohortLink = async (cohort: any) => {
    try {
      // Copy the cohort's application URL to clipboard
      if (cohort.applicationUrl) {
        await navigator.clipboard.writeText(cohort.applicationUrl);
        alert(`Cohort link copied to clipboard!\nCohort: ${cohort.name}`);
      } else {
        alert('No application URL found for this cohort');
      }
    } catch (error) {
      console.error('Error copying cohort link:', error);
      alert('Error copying cohort link. Please try again.');
    }
  };

  const viewCohortApplications = (cohort: any) => {
    setSelectedCohort(cohort);
    setViewCohortDialog(true);
    // Filter applications by cohort
    getStudentsByCohort(cohort.id);
  };

  const getStudentsByCohort = async (cohortId: string) => {
    isLoading(true);
    try {
      const response = await ApiService.getCohortApplications(cohortId, {
        page,
        search,
        limit,
        status: "Pending"
      });
      
      if (response.applications) {
        setLearners(response.applications);
        const pagination = response?.pagination;
        setPagination({
          current_page: Number(pagination?.current_page),
          total: pagination?.total,
          total_pages: pagination?.total_pages,
          per_page: Number(pagination?.per_page),
        });
      }
    } catch (error) {
      console.error("Error fetching cohort students:", error);
      setLearners([]); // Ensure learners is always an array
    } finally {
      isLoading(false);
    }
  };

  const handleCohortDataChange = (field: string, value: any) => {
    setCohortData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCohortFilterChange = (cohortId: string) => {
    setSelectedCohortFilter(cohortId);
    setPage(1); // Reset to first page when filtering
  };

  const clearCohortFilter = () => {
    setSelectedCohortFilter('');
    setPage(1); // Reset to first page when clearing filter
  };

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatusFilter(status);
    setPage(1); // Reset to first page when filtering
  };

  const clearStatusFilter = () => {
    setSelectedStatusFilter('');
    setPage(1); // Reset to first page when clearing filter
  };

  const generateToken = () => {
    // Generate a secure random token
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleLinkDataChange = (field: string, value: any) => {
    setLinkData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSort = (field: string) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  const getStreams = async () => {
    const response = await ApiService.getStream({ grade: grade });
    setStreams(response.data);
    console.log(response);
  };

  const deleteRecord = async () => {
    isLoading(true);
    try {
      let res = await ApiService.deleteLearner(recordId);
      getStudents();
      setViewMore(false);
      isLoading(false);
      // setConfirmDelete(false);
      setSuccess(true);
      setMessage("Learner record deleted successfully");
      notify.current?.showToast();
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };
  const disableRecord = async (record: any) => {
    isLoading(true);
    try {
      let res = await ApiService.toggleLearnerStatus(record);
      getStudents();
      setViewMore(false);
      isLoading(false);
      // setConfirmDelete(false);
      setSuccess(true);
      setMessage("Learner Deactivated successfully.");
      notify.current?.showToast();
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };
  const profileRecord = (record: any) => {
    // setIsEditMode(true);
    // setGroup(record?.groups);
    // setPhoto(record?.photo);
    // setGrade(record?.stream?.grade?._id);
    // setGuardianIdNo(record?.guardian?.email);
    // setGuardianIdNo2(record?.guardian2?.email);
    setLearner(record);
    getLeanerClasses(record._id);
    console.log(record);
    setProfile(true);
  };

  // Application status management functions
  const handleShortlistApplicant = async (applicantId: string) => {
    isLoading(true);
    try {
      const res = await ApiService.shortlistApplicant(applicantId);
      if (res.success) {
        setSuccess(true);
        setMessage("Applicant shortlisted successfully!");
        await getStudents(); // Refresh the list
      } else {
        throw new Error(res.message || "Failed to shortlist applicant");
      }
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.message || "Failed to shortlist applicant");
    } finally {
      isLoading(false);
      notify.current?.showToast();
    }
  };

  const handleConfirmApplicant = async (applicantId: string) => {
    isLoading(true);
    try {
      const res = await ApiService.confirmApplicant(applicantId);
      if (res.success) {
        setSuccess(true);
        setMessage("Applicant confirmed successfully!");
        await getStudents(); // Refresh the list
      } else {
        throw new Error(res.message || "Failed to confirm applicant");
      }
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.message || "Failed to confirm applicant");
    } finally {
      isLoading(false);
      notify.current?.showToast();
    }
  };

  const handleRejectApplicant = async (applicantId: string) => {
    isLoading(true);
    try {
      const res = await ApiService.rejectApplicant(applicantId);
      if (res.success) {
        setSuccess(true);
        setMessage("Applicant rejected successfully!");
        await getStudents(); // Refresh the list
      } else {
        throw new Error(res.message || "Failed to reject applicant");
      }
    } catch (error: any) {
      setSuccess(false);
      setMessage(error.message || "Failed to reject applicant");
    } finally {
      isLoading(false);
      notify.current?.showToast();
    }
  };
  const learner_state = location.state; // The object passed in `state`
  useEffect(() => {
    if (learner_state) {
      profileRecord(learner_state);
    }
  }, [learner_state]);
  const editRecord = (record: any) => {
    setIsEditMode(true);
    setGroup(record?.groups);
    setPhoto(record?.photo);
    setGrade(record?.stream?.grade?._id);

    // setGuardianIdNo(record?.guardian?.email);
    // setGuardianIdNo2(record?.guardian2?.email);
    reset({
      ...record,
      image: "",
      stream: record?.stream?._id,
      grade: record?.stream?.grade?._id,
      guardian_id_no: record?.guardian?.id_no,
      guardian: record?.guardian?._id,
      guardian_first_name: record?.guardian?.first_name,
      guardian_email: record?.guardian?.email,
      guardian_last_name: record?.guardian?.last_name,
      guardian_surname: record?.guardian?.surname,
      guardian_phone: record?.guardian?.phone,
      guardian2_: record?.guardian2?.id_no,
      guardian2_id_no: record?.guardian2?.id_no,
      guardian2: record?.guardian2?._id,
      guardian2_first_name: record?.guardian2?.first_name,
      guardian2_email: record?.guardian2?.email,
      guardian2_last_name: record?.guardian2?.last_name,
      guardian2_surname: record?.guardian2?.surname,
      guardian2_phone: record?.guardian2?.phone,
    });
    console.log(record);
    setDialog(true);
  };
  useEffect(() => {
    handleGuardianIdNoBlur();
  }, [guardianIdNo]);
  useEffect(() => {
    if (selectedTerm && selectedAcademicYear) {
      getTests();
      getLearningAreas();
    }
  }, [selectedAcademicYear, selectedTerm]);

  useEffect(() => {
    handleGuardianIdNoBlur2();
  }, [guardianIdNo2]);
  const unreadMessages = {
    guardian1: 3, // Replace with actual count
    guardian2: 1, // Replace with actual count
  };

  const handleGuardianIdNoBlur = async () => {
    reset({
      ...getValues(),
      guardian_id_no: guardianIdNo,
      guardian: "",
      guardian_first_name: "",
      guardian_email: "",
      guardian_last_name: "",
      guardian_surname: "",
      guardian_phone: "",
    });
    const res = await ApiService.getOneParents({ search: guardianIdNo });
    const response = res.data;
    console.log(response._id);
    reset({
      ...getValues(),
      guardian_id_no: guardianIdNo,
      guardian: response._id,
      guardian_first_name: response.first_name,
      guardian_email: response.email,
      guardian_last_name: response.last_name,
      guardian_surname: response.surname,
      guardian_phone: response.phone,
    });
  };
  const handleGuardianIdNoBlur2 = async () => {
    reset({
      ...getValues(),
      guardian2_id_no: guardianIdNo2,
      guardian2: "",
      guardian2_first_name: "",
      guardian2_email: "",
      guardian2_last_name: "",
      guardian2_surname: "",
      guardian2_phone: "",
    });
    const res = await ApiService.getOneParents({ search: guardianIdNo2 });
    const response = res.data;
    reset({
      ...getValues(),
      guardian2_id_no: guardianIdNo2,
      guardian2: response._id,
      guardian2_first_name: response.first_name,
      guardian2_email: response.email,
      guardian2_last_name: response.last_name,
      guardian2_surname: response.surname,
      guardian2_phone: response.phone,
    });
  };
  const cancel = (record: any) => {
    setGrade("");
    setGuardianIdNo("");
    setPhoto("");
    setGuardianIdNo2("");
    setGroup([""]);
    setPermission([""]);
    reset({ name: "" });
    setDialog(false);
    setIsEditMode(false);
  };

  // Function to open chat

  const [isOpen, setIsOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState<any>(null);
  useEffect(() => {
    if (selectedParent && isOpen) fetchMessages();
  }, [selectedParent, isOpen]);
  useEffect(() => {
    // messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    messagesEndRef.current?.scrollIntoView({
      behavior: "instant" as ScrollBehavior,
    });
  }, [messages]);
  const openChat = (parent: any) => {
    setSelectedParent(parent);
    setIsOpen(true);
  };
  const generateAssessment = async () => {
    isLoading(true);

    const data = {
      learning_area: selectedLeaningArea,
      term: selectedTerm,
      learner: learner._id,
      type: "learner",
    };

    isLoading(true);
    try {
      if (data.learner == "") {
        throw Error("Select learner to continue");
      } else if (data.term == "") {
        throw Error("Select term to continue");
      } else if (data.learning_area == "") {
        throw Error("Select learning area to continue");
      }
      let res = await ApiService.getReportByLearners(data);
      const blob = new Blob([res], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const popup = window.open(
        url,
        // "_blank",
        `width=${window.innerWidth},height=${window.innerHeight},scrollbars=yes`
      );

      setPdfUrl(url);
      // setEnrollments(res);

      // setDialog(true);
      isLoading(false);
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      console.log(error);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };
  const [rows, setRows] = useState<TableRow[]>([
    { no: 1, strandName: "Example Strand" },
  ]);

  const addRow = () => {
    const newRow: TableRow = {
      no: rows.length + 1,
      strandName: "New Strand",
    };

    setRows([...rows, newRow]);
  };
  const generateAssessmentSummative = async () => {
    isLoading(true);
    const data = {
      test: test,
      term: selectedTerm,
      stream: stream,
      learner: learner._id,
      type: "learner",
    };
    console.log(data);
    isLoading(true);
    try {
      if (learner == "") {
        throw Error("Select learner to continue");
      } else if (selectedTerm == "") {
        throw Error("Select term to continue");
      } else if (test == "") {
        throw Error("Select test to continue");
      }
      let res = await ApiService.getSummativeByLearners(data);
      const blob = new Blob([res], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const popup = window.open(
        url,
        `width=${window.innerWidth},height=${window.innerHeight},scrollbars=yes`
      );

      setPdfUrl(url);
      // setEnrollments(res);

      // setDialog(true);
      isLoading(false);
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      console.log(error);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };
  const [showParent2, setShowParent2] = useState(false);


  const [content, setContent] = useState("");

  const handleChange = (e: any) => {
    console.log(e.target.value);
    setContent(e.target.value);
  };
  const handleSend = () => {
    if (!content.trim()) return; // Prevent sending empty messages
    console.log(content);
    onSubmitMesage(content); // Call function with the message
    setContent(""); // Clear input after sending
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Function to always scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" }); // Instant scroll
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom on message update

    
  }, [messages]);

  const triggerFileInput = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("fileInputRef.current:", fileInputRef.current);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const openZoom = (imageUrl: string) => {
    setZoomedImage(imageUrl);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };
  const [activeTabLearner, setActiveTabLearner] = useState<
    "learner" | "parent1" | "parent2"
  >("learner");
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="w-[450px] h-[600px] bg-white rounded-2xl shadow-xl flex flex-col font-sans overflow-hidden border border-gray-100">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-4 flex justify-between items-center">
              <span className="font-semibold text-xl tracking-tight">
                {selectedParent
                  ? `Chat with ${selectedParent.first_name} ${selectedParent.last_name}`
                  : "Messages"}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-indigo-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-5 overflow-y-auto bg-gray-50 space-y-4">
              {messages.map((msg: any, index: any) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === user?._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[75%] group">
                    <div
                      className={`p-4 rounded-2xl shadow-md transition-all ${
                        msg.sender === user?._id
                          ? "bg-indigo-500 text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      {msg.message && <p className="text-sm">{msg.message}</p>}
                      {msg.attachments?.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {msg.attachments.map(
                                (attachment: any, idx: any) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2"
                                  >
                                    {attachment.fileType.startsWith(
                                      "image/"
                                    ) ? (
                                      <img
                                        src={`${C.IMG_URL}${attachment.url}`}
                                        alt={attachment.fileName}
                                        className="max-w-[200px] rounded-lg shadow-sm cursor-pointer hover:opacity-90 transition-opacity duration-200"
                                        onClick={() =>
                                          openZoom(
                                            `${C.IMG_URL}${attachment.url}`
                                          )
                                        }
                                      />
                                    ) : (
                                      <a
                                        href={`${C.IMG_URL}${attachment.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white-500 hover:underline text-sm flex items-center gap-1"
                                      >
                                        <Paperclip className="w-4 h-4" />
                                        {attachment.fileName} (
                                        {(attachment.fileSize / 1024).toFixed(
                                          2
                                        )}{" "}
                                        KB)
                                      </a>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {/* Zoom Modal */}
                          {zoomedImage && (
                            <div
                              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                              onClick={closeZoom}
                            >
                              <div
                                className="relative max-w-[90vw] max-h-[90vh] overflow-auto"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
                              >
                                <img
                                  src={zoomedImage}
                                  alt="Zoomed image"
                                  className="w-full h-auto rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-125"
                                />
                                <button
                                  className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                                  onClick={closeZoom}
                                  aria-label="Close zoom"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-xs mt-1 block opacity-0 group-hover:opacity-100 transition-opacity ${
                        msg.sender === user?._id
                          ? "text-right text-gray-400"
                          : "text-left text-gray-500"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={(e: any) => {
                e.preventDefault();
                handleSend();
              }}
              encType="multipart/form-data"
              className="p-4 bg-white border-t border-gray-100"
            >
              {/* File Previews */}
              {attachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="relative flex items-center bg-gray-100 p-2 rounded-lg shadow-sm"
                    >
                      <span className="text-sm text-gray-700 truncate max-w-[120px]">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="content"
                    value={content}
                    onChange={handleChange}
                    className="w-full p-3 pr-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-sm placeholder-gray-400"
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <label className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      onChange={handleFileChanges} // Fixed to singular "handleFileChange"
                      className="hidden"
                    />
                    <Paperclip
                      className="w-5 h-5 text-gray-500 hover:text-indigo-500 cursor-pointer"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        triggerFileInput(e);
                      }}
                    />
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-full disabled:opacity-50 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      {dialog && !profile ? (
        <>

    
        </>
      ) : !profile && !dialog ? (
        <>
          <div className="flex items-center justify-between">
            <h2 className="mt-1 text-lg font-medium ">Online Applicants</h2>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setMainActiveTab('cohorts')}
                variant="secondary"
                className="bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center"
              >
                <Lucide icon="Users" className="w-4 h-4 mr-2" />
                View Cohorts
              </Button>
              <Button
                onClick={() => setLinkDialog(true)}
                variant="primary"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center"
              >
                <Lucide icon="Link" className="w-4 h-4 mr-2" />
                Generate Online Link
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1 mt-6">
            <button
              onClick={() => setMainActiveTab('applicants')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                mainActiveTab === 'applicants'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Lucide icon="Users" className="w-4 h-4 mr-2" />
              Applicants
            </button>
            <button
              onClick={() => setMainActiveTab('cohorts')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                mainActiveTab === 'cohorts'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Lucide icon="Calendar" className="w-4 h-4 mr-2" />
              Cohorts
            </button>
          </div>

          {/* Tab Content */}
          {mainActiveTab === 'applicants' && (
            <>
              <div className="flex flex-wrap items-center col-span-12 mt-2  xl:flex-nowrap">
                {(is_admin() ||
                  hasPermission("parental-communication", "read")) && (
                  <>
                    {" "}
 
                <Menu>
            
                  <Menu.Items className="w-40">
                    <Menu.Item onClick={() => setUploadDialog(true)}>
                      <Lucide icon="Book" className="w-4 h-4 mr-2" /> Import
                      Data
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        setExportDialog(true);
                      }}
                    >
                      <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                      Template
                    </Menu.Item>
                    {/* <Menu.Item>
                   <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                   to PDF
                 </Menu.Item> */}
                  </Menu.Items>
                </Menu>
              </>
            )}
     

            <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0 space-x-3">
              <div className="relative w-56 text-slate-500">
                <FormInput
                  type="text"
                  className="w-56 pr-10 !box"
                  placeholder="Search..."
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Lucide
                  icon="Search"
                  className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                />
              </div>
              
              {/* Cohort Filter Dropdown */}
              <div className="relative w-64">
                <FormSelect
                  value={selectedCohortFilter}
                  onChange={(e) => handleCohortFilterChange(e.target.value)}
                  className={`w-64 !box ${selectedCohortFilter ? 'border-blue-500 bg-blue-50' : ''}`}
                >
                  <option value="">All Cohorts</option>
                  {cohorts.map((cohort: any) => (
                    <option key={cohort._id} value={cohort._id}>
                      {cohort.name}
                    </option>
                  ))}
                </FormSelect>
                {selectedCohortFilter && (
                  <button
                    onClick={clearCohortFilter}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors"
                    title="Clear filter"
                  >
                    <Lucide icon="X" className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative w-48">
                <FormSelect
                  value={selectedStatusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className={`w-48 !box ${selectedStatusFilter ? 'border-green-500 bg-green-50' : ''}`}
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Rejected">Rejected</option>
                </FormSelect>
                {selectedStatusFilter && (
                  <button
                    onClick={clearStatusFilter}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700 transition-colors"
                    title="Clear filter"
                  >
                    <Lucide icon="X" className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Active Filter Indicator */}
              {(selectedCohortFilter || selectedStatusFilter) && (
                <div className="flex items-center space-x-3 flex-wrap">
                  {selectedCohortFilter && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600 font-medium">
                        Cohort: {cohorts.find((c: any) => c._id === selectedCohortFilter)?.name || 'Unknown'}
                      </span>
                    </div>
                  )}
                  {selectedStatusFilter && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600 font-medium">
                        Status: {selectedStatusFilter}
                      </span>
                    </div>
                  )}
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                    {(learners || []).length} results
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="col-span-12 overflow-auto  2xl:overflow-visible">
              {loading ? (
                <div className="flex flex-col items-center mt-5">
                  <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                </div>
              ) : (learners || []).length === 0 ? (
                <div className="flex flex-col items-center mt-10 bg-white p-8">
                  {/* <Search size={28} className="" /> */}
                  <p className="text-xl text-slate-500 ">No records found</p>
                </div>
              ) : (
                <>
                  <Table hover striped className="mt-6">
                    <Table.Thead variant="modern">
                      <Table.Tr>
                        <Table.Th className="w-16 text-center">
                          #
                        </Table.Th>

                        <Table.Th
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          onClick={() => handleSort("first_name")}
                        >
                          <div className="flex items-center space-x-2">
                            <span>Student Name</span>
                            {sortField === "first_name" && (
                              <Lucide 
                                icon={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"} 
                                className="w-4 h-4" 
                              />
                            )}
                          </div>
                        </Table.Th>

          

                        <Table.Th
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          onClick={() => handleSort("grade")}
                        >
                          <div className="flex items-center space-x-2">
                            <span>Parent Name</span>
                            {sortField === "grade" && (
                              <Lucide 
                                icon={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"} 
                                className="w-4 h-4" 
                              />
                            )}
                          </div>
                        </Table.Th>

                        <Table.Th
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          onClick={() => handleSort("stream")}
                        >
                          <div className="flex items-center space-x-2">
                            <span>Parent Relationship</span>
                            {sortField === "stream" && (
                              <Lucide 
                                icon={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"} 
                                className="w-4 h-4" 
                              />
                            )}
                          </div>
                        </Table.Th>

                        <Table.Th
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          onClick={() => handleSort("session")}
                        >
                          <div className="flex items-center space-x-2">
                            <span>Parent Phone</span>
                            {sortField === "session" && (
                              <Lucide 
                                icon={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"} 
                                className="w-4 h-4" 
                              />
                            )}
                          </div>
                        </Table.Th>

                        <Table.Th
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center space-x-2">
                            <span>Status</span>
                            {sortField === "status" && (
                              <Lucide 
                                icon={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"} 
                                className="w-4 h-4" 
                              />
                            )}
                          </div>
                        </Table.Th>

                        {selectedCohortFilter && (
                          <Table.Th className="text-center">
                            Cohort
                          </Table.Th>
                        )}
                        <Table.Th className="text-center w-32">
                          Actions
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {(learners || []).map((applicant: any, key) => (
                        <Table.Tr key={key}>
                          <Table.Td className="text-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {limit * (page - 1) + key + 1}
                            </div>
                          </Table.Td>
                          
                          <Table.Td>
                            <div className="flex items-center space-x-4">
                        
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                                     onClick={() => profileRecord(applicant)}>
                                  {applicant?.first_name && applicant?.first_name}
                                  {" " + applicant?.last_name + " " + applicant?.last_name}
                                </div>
                              
                              </div>
                            </div>
                          </Table.Td>

      
                          
                          <Table.Td>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2 inline-block">
                              
                            <div>
                                <div className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 cursor-pointer"
                                     onClick={() => profileRecord(applicant)}>
                                  {applicant?.guardian_first_name && applicant?.guardian_first_name}
                                  {" " + applicant?.guardian_surname + " " + applicant?.guardian_last_name}
                                </div>
                              
                              </div>
                            </div>
                          </Table.Td>
                          
                          <Table.Td>
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg px-3 py-2 inline-block">
                              <span className="font-medium text-purple-700 dark:text-purple-300">
                                {applicant?.guardian_relationship}
                              </span>
                            </div>
                          </Table.Td>
               
                          <Table.Td>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2 inline-block">
                              <span className="font-medium text-green-700 dark:text-green-300">
                                {applicant?.guardian_phone}
                              </span>
                            </div>
                          </Table.Td>
                          
                          <Table.Td>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              applicant?.status === "L" || applicant?.status === "G"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                : applicant?.status === "D"
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                applicant?.status === "L" || applicant?.status === "G"
                                  ? "bg-red-500"
                                  : applicant?.status === "D"
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                              }`}>
                                
                              </div>

                              
                              {/* {applicant?.status === "L" || applicant?.status === "G" ? "Left" : ""} */}
                              {applicant?.applicationStatus === "Shortlisted" ? "Shortlisted" : ""}
                              {applicant?.applicationStatus === "Confirmed" ? "Confirmed" : ""}
                              {applicant?.applicationStatus === "Pending" ? "Pending" : ""}
                              {applicant?.applicationStatus === "Rejected" ? "Rejected" : ""}
                            </div>
                          </Table.Td>

                          {selectedCohortFilter && (
                            <Table.Td>
                              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg px-3 py-2 inline-block">
                                <span className="font-medium text-indigo-700 dark:text-indigo-300 text-sm">
                                  {cohorts.find((c: any) => c._id === selectedCohortFilter)?.name || 'Unknown'}
                                </span>
                              </div>
                            </Table.Td>
                          )}

                          <Table.Td>
                            <div className="flex items-center justify-center space-x-2">
                              <Menu className="inline-block">
                                <Menu.Button className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                                  <Lucide icon="MoreHorizontal" className="w-5 h-5" />
                                </Menu.Button>
                                <Menu.Items
                                  className="w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600 py-2 mt-2"
                                  placement="bottom-end"
                                >
                                  <Menu.Item
                                    onClick={(e: any) => {
                                      e.preventDefault();
                                      profileRecord(applicant);
                                    }}
                                    className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                  >
                                    <Lucide icon="Eye" className="w-4 h-4 mr-3 text-blue-500" />
                                    Review
                                  </Menu.Item>

                                  {/* Application Status Actions */}
                                  {applicant?.applicationStatus === 'Pending' && (
                                    <>
                                      <Menu.Item
                                        onClick={(e: any) => {
                                          e.preventDefault();
                                          handleShortlistApplicant(applicant._id);
                                        }}
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors duration-200"
                                      >
                                        <Lucide icon="UserCheck" className="w-4 h-4 mr-3 text-yellow-500" />
                                        Shortlist
                                      </Menu.Item>
                                      
                                      <Menu.Item
                                        onClick={(e: any) => {
                                          e.preventDefault();
                                          handleRejectApplicant(applicant._id);
                                        }}
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                                      >
                                        <Lucide icon="XCircle" className="w-4 h-4 mr-3 text-red-500" />
                                        Reject
                                      </Menu.Item>
                                    </>
                                  )}

                                  {applicant?.applicationStatus === 'Shortlisted' && (
                                    <>
                                      <Menu.Item
                                        onClick={(e: any) => {
                                          e.preventDefault();
                                          handleConfirmApplicant(applicant._id);
                                        }}
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                                      >
                                        <Lucide icon="CheckCircle" className="w-4 h-4 mr-3 text-green-500" />
                                        Confirm
                                      </Menu.Item>
                                      
                                      <Menu.Item
                                        onClick={(e: any) => {
                                          e.preventDefault();
                                          handleRejectApplicant(applicant._id);
                                        }}
                                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                                      >
                                        <Lucide icon="XCircle" className="w-4 h-4 mr-3 text-red-500" />
                                        Reject
                                      </Menu.Item>
                                    </>
                                  )}

                                  {hasPermission("learners", "delete") && (
                                    <Menu.Item
                                      onClick={(e: any) => {
                                        e.preventDefault();
                                        setRecordId(applicant._id);
                                        setViewMore(true);
                                      }}
                                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                      >
                                       <Lucide icon="Trash2" className="w-4 h-4 mr-3 text-blue-500" />
                                        Delete
                                    </Menu.Item>
                                  )}
                                </Menu.Items>
                              </Menu>
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>

                  <div className="flex flex-wrap items-center col-span-12 sm:flex-nowrap gap-4 mt-6">
                    {/* Pagination */}
                    <div className="flex items-center w-full sm:w-auto sm:mr-auto">
                      <nav className="flex items-center space-x-1">
                        {/* Previous Button */}
                        <button
                          onClick={() => setPage(page > 1 ? page - 1 : 1)}
                          disabled={page === 1}
                          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors duration-200"
                        >
                          <Lucide icon="ChevronLeft" className="w-5 h-5" />
                        </button>

                        {/* Page Numbers with Ellipsis */}
                        {pagination.total_pages <= 7 ? (
                          // Show all pages if total_pages <= 7
                          _.times(pagination.total_pages).map((_, index) => {
                            const pageNum = index + 1;
                            return (
                              <button
                                key={index}
                                onClick={() => setPage(pageNum)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                  pageNum === pagination.current_page
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })
                        ) : (
                          // Show limited pages with ellipsis for larger counts
                          <>
                            {/* First Page */}
                            <button
                              onClick={() => setPage(1)}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                1 === pagination.current_page
                                  ? "bg-indigo-600 text-white shadow-md"
                                  : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                              }`}
                            >
                              1
                            </button>

                            {/* Ellipsis or nearby pages */}
                            {pagination.current_page > 3 && (
                              <span className="px-4 py-2 text-gray-500">
                                ...
                              </span>
                            )}

                            {/* Dynamic middle pages */}
                            {_.range(
                              Math.max(2, pagination.current_page - 1),
                              Math.min(
                                pagination.total_pages,
                                pagination.current_page + 2
                              )
                            ).map((pageNum) => (
                              <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                  pageNum === pagination.current_page
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                                }`}
                              >
                                {pageNum}
                              </button>
                            ))}

                            {/* Ellipsis or last pages */}
                            {pagination.current_page <
                              pagination.total_pages - 2 && (
                              <span className="px-4 py-2 text-gray-500">
                                ...
                              </span>
                            )}

                            {/* Last Page */}
                            <button
                              onClick={() => setPage(pagination.total_pages)}
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                pagination.total_pages ===
                                pagination.current_page
                                  ? "bg-indigo-600 text-white shadow-md"
                                  : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                              }`}
                            >
                              {pagination.total_pages}
                            </button>
                          </>
                        )}

                        {/* Next Button */}
                        <button
                          onClick={() =>
                            setPage(
                              page < pagination.total_pages
                                ? page + 1
                                : pagination.total_pages
                            )
                          }
                          disabled={page === pagination.total_pages}
                          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors duration-200"
                        >
                          <Lucide icon="ChevronRight" className="w-5 h-5" />
                        </button>
                      </nav>
                    </div>

                    {/* Total and Limit Selector */}
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span className="text-sm font-medium">
                        Total: {pagination.total}
                      </span>
                      <FormSelect
                        className="w-32 py-2 text-sm bg-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        onChange={(e) => setLimit(parseInt(e.target.value))}
                      >
                        <option value={10}>10 / page</option>
                        <option value={25}>25 / page</option>
                        <option value={50}>50 / page</option>
                        <option value={100}>100 / page</option>
                      </FormSelect>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* END: Data List */}
          </div>
            </>
          )}

          {/* Cohorts Tab Content */}
          {mainActiveTab === 'cohorts' && (
            <div className="mt-6">
              {cohorts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <Lucide icon="Calendar" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No cohorts found</h3>
                  <p className="text-gray-500 mb-6">Create your first cohort using the "Generate Online Link" button</p>
                  <Button
                    onClick={() => setLinkDialog(true)}
                    variant="primary"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Lucide icon="Link" className="w-4 h-4 mr-2" />
                    Create First Cohort
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table hover striped>
                    <Table.Thead variant="modern">
                      <Table.Tr>
                        <Table.Th className="whitespace-nowrap">Cohort Name</Table.Th>
                        <Table.Th className="whitespace-nowrap">Start Date</Table.Th>
                        <Table.Th className="whitespace-nowrap">End Date</Table.Th>
                        <Table.Th className="whitespace-nowrap">Status</Table.Th>
                        <Table.Th className="whitespace-nowrap">Applications</Table.Th>
                        <Table.Th className="whitespace-nowrap">Fee</Table.Th>
                        <Table.Th className="whitespace-nowrap">Actions</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {cohorts.map((cohort: any, index: number) => (
                        <Table.Tr key={cohort._id || index}>
                          <Table.Td>
                            <div>
                              <div className="font-medium">{cohort.name}</div>
                              {cohort.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {cohort.description}
                                </div>
                              )}
                            </div>
                          </Table.Td>
                          <Table.Td>
                            {new Date(cohort.startDate).toLocaleDateString()}
                          </Table.Td>
                          <Table.Td>
                            {new Date(cohort.endDate).toLocaleDateString()}
                          </Table.Td>
                          <Table.Td>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              cohort.status === 'active' ? 'bg-green-100 text-green-800' :
                              cohort.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                              cohort.status === 'closed' ? 'bg-red-100 text-red-800' :
                              cohort.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {cohort.status || 'Active'}
                            </span>
                          </Table.Td>
                          <Table.Td>
                            <div className="text-sm">
                              <div className="font-medium">
                                {cohort.applicationStats?.total || 0} Total
                              </div>
                              <div className="text-gray-500">
                                {cohort.applicationStats?.pending || 0} Pending
                              </div>
                            </div>
                          </Table.Td>
                          <Table.Td>
                            <span className="font-medium text-green-600">
                              KES {cohort.applicationFee?.toLocaleString() || '1,000'}
                            </span>
                          </Table.Td>
                          <Table.Td>
                            <div className="flex items-center space-x-2">
                              <Tippy content="Copy Link">
                                <Button
                                  onClick={() => generateCohortLink(cohort)}
                                  variant="outline-secondary"
                                  className="p-1"
                                >
                                  <Lucide icon="Link" className="w-4 h-4" />
                                </Button>
                              </Tippy>
                              <Tippy content="View Applications">
                                <Button
                                  onClick={() => {
                                    setSelectedCohortFilter(cohort._id);
                                    setMainActiveTab('applicants');
                                  }}
                                  variant="outline-secondary"
                                  className="p-1"
                                >
                                  <Lucide icon="Eye" className="w-4 h-4" />
                                </Button>
                              </Tippy>
                              <Tippy content="Edit Cohort">
                                <Button
                                  onClick={() => {
                                    // TODO: Implement edit cohort functionality
                                    alert('Edit cohort functionality coming soon!');
                                  }}
                                  variant="outline-secondary"
                                  className="p-1"
                                >
                                  <Lucide icon="Edit" className="w-4 h-4" />
                                </Button>
                              </Tippy>
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </div>
              )}
            </div>
          )}

          {/* BEGIN: Delete Confirmation Modal */}
          <Dialog
            open={viewMore}
            onClose={() => {
              setViewMore(false);
            }}
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
                  onClick={() => {
                    setViewMore(false);
                  }}
                  className="w-24 mr-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => deleteRecord()}
                  variant="danger"
                  type="button"
                  className="w-24"
                  ref={deleteButtonRef}
                >
                  Delete
                </Button>
              </div>
            </Dialog.Panel>
          </Dialog>
          {/* END: Delete Confirmation Modal */}
        </>
      ) : profile ? (
        <div className="content">
          {/* Custom Back Button */}
          <a
            onClick={(event) => {
              event.preventDefault();
              cancel({ name: "" }); // Call the cancel function with desired parameters
              setDialog(false); // Assuming setDialog is defined in the parent component
              setProfile(false); // Assuming setProfile is defined in the parent component
            }}
            href="#"
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
            Back
          </a>

          <div className="flex flex-wrap">
            {/* Profile Picture and Name Section */}
            <div className="w-full md:w-1/4 text-center mb-4 md:mb-0">
              <div className="bg-white shadow-md m-4 rounded-lg overflow-hidden ">
                <div className="p-6">
         
                  <img
                    src={c.IMG_URL + learner?.photo}
                    alt="photo"
                    className="rounded-full mx-auto"
                    style={{ width: "90%", height: "90%" }}
                    onError={(e) => (e.currentTarget.src = leanerImg)}
                  />
                  <h3 className="mt-3 text-lg font-semibold">
                    {`${learner.first_name} ${learner.last_name}`}
                  </h3>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="w-full md:w-3/4 ">
              <div className="bg-white shadow-md rounded-lg  m-4">
                <div className="p-6">
                  <h4 className="font-bold">Applicant's Information</h4>

                  {/* Tabs for Basic Info, Documents, and Payments */}
                  <ul className="flex border-b border-gray-200 mb-4">
                    <li className="mr-2">
                      <button
                        className={`inline-block py-2 px-4 ${
                          activeTab === "basicInfo"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                        } font-semibold`}
                        onClick={() => setActiveTab("basicInfo")}
                      >
                        Basic Info
                      </button>
                    </li>
                    <li className="mr-2">
                      <button
                        className={`inline-block py-2 px-4 ${
                          activeTab === "documents"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                        } font-semibold`}
                        onClick={() => setActiveTab("documents")}
                      >
                        Documents
                      </button>
                    </li>
                    <li className="mr-2">
                      <button
                        className={`inline-block py-2 px-4 ${
                          activeTab === "payments"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                        } font-semibold`}
                        onClick={() => setActiveTab("payments")}
                      >
                        Payments
                      </button>
                    </li>
                  </ul>

                  {/* Tab Content */}
                  <div className="tab-content">
                    {/* Basic Info Tab */}

                    {activeTab === "basicInfo" && (
                      <div className="tab-pane active">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Student Information */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-bold text-lg mb-4 text-blue-600">Student Information</h5>
                            <table className="min-w-full">
                              <tbody>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Full Name</td>
                                  <td className="px-3 py-2 text-sm">{`${learner?.first_name || ''} ${learner?.middle_name || ''} ${learner?.last_name || ''}`.trim()}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Gender</td>
                                  <td className="px-3 py-2 text-sm">{learner?.gender || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Date of Birth</td>
                                  <td className="px-3 py-2 text-sm">
                                    {learner?.dateOfBirth ? new Date(learner.dateOfBirth).toLocaleDateString() : 'N/A'}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Nationality</td>
                                  <td className="px-3 py-2 text-sm">{learner?.nationality || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">County/Sub-County</td>
                                  <td className="px-3 py-2 text-sm">{learner?.countySubCounty || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Birth Certificate No.</td>
                                  <td className="px-3 py-2 text-sm">{learner?.birthCertificateNo || 'N/A'}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Guardian Information */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-bold text-lg mb-4 text-green-600">Guardian Information</h5>
                            <table className="min-w-full">
                              <tbody>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Relationship</td>
                                  <td className="px-3 py-2 text-sm">{learner?.guardian_relationship || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Full Name</td>
                                  <td className="px-3 py-2 text-sm">{`${learner?.guardian_first_name || ''} ${learner?.guardian_surname || ''} ${learner?.guardian_last_name || ''}`.trim()}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Email</td>
                                  <td className="px-3 py-2 text-sm">{learner?.guardian_email || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Phone</td>
                                  <td className="px-3 py-2 text-sm">{learner?.guardian_phone || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Postal Address</td>
                                  <td className="px-3 py-2 text-sm">{learner?.postalAddress || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">ID Number</td>
                                  <td className="px-3 py-2 text-sm">{learner?.idNumber || 'N/A'}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Academic Information */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-bold text-lg mb-4 text-purple-600">Academic Information</h5>
                            <table className="min-w-full">
                              <tbody>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Current/Last School</td>
                                  <td className="px-3 py-2 text-sm">{learner?.currentOrLastSchool || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Current Class</td>
                                  <td className="px-3 py-2 text-sm">{learner?.currentClass || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Class Applying For</td>
                                  <td className="px-3 py-2 text-sm">{learner?.classApplyingFor || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">KCPE Index Number</td>
                                  <td className="px-3 py-2 text-sm">{learner?.kcpeIndexNumber || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">KCPE Marks</td>
                                  <td className="px-3 py-2 text-sm">{learner?.kcpeMarks || 'N/A'}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Address Information */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-bold text-lg mb-4 text-orange-600">Address Information</h5>
                            <table className="min-w-full">
                              <tbody>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Home Address</td>
                                  <td className="px-3 py-2 text-sm">{learner?.homeAddress || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Nearest Landmark</td>
                                  <td className="px-3 py-2 text-sm">{learner?.nearestLandmark || 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Distance from School</td>
                                  <td className="px-3 py-2 text-sm">{learner?.distanceFromSchool ? `${learner.distanceFromSchool} km` : 'N/A'}</td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Application Status</td>
                                  <td className="px-3 py-2 text-sm">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      learner?.applicationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                      learner?.applicationStatus === 'Shortlisted' ? 'bg-blue-100 text-blue-800' :
                                      learner?.applicationStatus === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {learner?.applicationStatus || 'N/A'}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <td className="px-3 py-2 font-semibold text-sm">Application Date</td>
                                  <td className="px-3 py-2 text-sm">
                                    {learner?.createdAt ? new Date(learner.createdAt).toLocaleDateString() : 'N/A'}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Current Status Display */}
                        <div className="mt-6 mb-4 text-center">
                          <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-50 border">
                            <span className="text-sm font-medium text-gray-600 mr-2">Current Status:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              learner?.applicationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              learner?.applicationStatus === 'Shortlisted' ? 'bg-blue-100 text-blue-800' :
                              learner?.applicationStatus === 'Confirmed' ? 'bg-green-100 text-green-800' :
                              learner?.applicationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {learner?.applicationStatus || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex justify-center space-x-4">
                          {learner?.applicationStatus === 'Pending' && (
                            <button
                              onClick={() => handleShortlistApplicant(learner._id)}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                            >
                              Short List
                            </button>
                          )}
                          
                          {learner?.applicationStatus === 'Shortlisted' && (
                            <button
                              onClick={() => handleConfirmApplicant(learner._id)}
                              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                            >
                              Confirm Application
                            </button>
                          )}
                          
                          {(learner?.applicationStatus === 'Pending' || learner?.applicationStatus === 'Shortlisted') && (
                            <button
                              onClick={() => handleRejectApplicant(learner._id)}
                              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                            >
                              Reject Application
                            </button>
                          )}
                        </div>

                        {/* Action Descriptions */}
                        <div className="mt-4 text-center">
                          {learner?.applicationStatus === 'Pending' && (
                            <div className="text-sm text-gray-600">
                              <p className="mb-2">Available actions for pending applications:</p>
                              <div className="flex justify-center space-x-6 text-xs">
                                <span className="flex items-center">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                  <strong>Short List:</strong> Move to shortlist for review
                                </span>
                                <span className="flex items-center">
                                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                  <strong>Reject:</strong> Decline the application
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {learner?.applicationStatus === 'Shortlisted' && (
                            <div className="text-sm text-gray-600">
                              <p className="mb-2">Available actions for shortlisted applications:</p>
                              <div className="flex justify-center space-x-6 text-xs">
                                <span className="flex items-center">
                                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                  <strong>Confirm:</strong> Accept the application
                                </span>
                                <span className="flex items-center">
                                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                  <strong>Reject:</strong> Decline the application
                                </span>
                              </div>
                            </div>
                          )}

                          {(learner?.applicationStatus === 'Confirmed' || learner?.applicationStatus === 'Rejected') && (
                            <div className="text-sm text-gray-500 italic">
                              No further actions available for {learner?.applicationStatus?.toLowerCase()} applications.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Documents Tab */}
                    {activeTab === "documents" && (
                      <div className="tab-pane active">
                        <h4 className="font-bold text-lg mb-4 text-blue-600">Uploaded Documents</h4>
                        
                        {learner?.documents ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(learner.documents).map(([docType, docInfo]: [string, any]) => (
                              <div key={docType} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                  <h6 className="font-semibold text-sm text-gray-800 capitalize">
                                    {docType.replace(/([A-Z])/g, ' $1').trim()}
                                  </h6>
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    docInfo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {docInfo ? 'Uploaded' : 'Missing'}
                                  </span>
                                </div>
                                
                                {docInfo ? (
                                  <div className="space-y-2">
                                    <div className="text-xs text-gray-600">
                                      <strong>File:</strong> {docInfo.originalName}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      <strong>Type:</strong> {docInfo.mimetype}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      <strong>Size:</strong> {(docInfo.size / 1024).toFixed(1)} KB
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      <strong>Uploaded:</strong> {new Date(docInfo.uploadDate).toLocaleDateString()}
                                    </div>
                                    
                                    <div className="flex space-x-2 mt-3">
                                      {/* <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition-colors">
                                        View
                                      </button> */}
                                      <button className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors">
                                        Download
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-500 italic">
                                    No document uploaded
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p>No documents uploaded</p>
                          </div>
                        )}

                        {/* Document Summary */}
                        {learner?.documents && (
                          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-semibold text-sm mb-2">Document Summary</h5>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                              <div className="text-center">
                                <div className="font-semibold text-green-600">
                                  {Object.values(learner.documents).filter(doc => doc).length}
                                </div>
                                <div className="text-gray-600">Uploaded</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-red-600">
                                  {Object.values(learner.documents).filter(doc => !doc).length}
                                </div>
                                <div className="text-gray-600">Missing</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-blue-600">
                                  {Object.values(learner.documents).filter((doc: any) => doc?.mimetype?.includes('pdf')).length}
                                </div>
                                <div className="text-gray-600">PDF Files</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold text-purple-600">
                                  {Object.values(learner.documents).filter((doc: any) => doc?.mimetype?.includes('image')).length}
                                </div>
                                <div className="text-gray-600">Images</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Payments Tab */}
                    {activeTab === "payments" && (
                      <div className="tab-pane active">
                        <h4 className="font-bold text-lg mb-4 text-blue-600">Payment Information</h4>
                        
                        {learner?.payment ? (
                          <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Payment Details */}
                              <div>
                                <h5 className="font-semibold text-sm mb-3 text-gray-700">Payment Details</h5>
                                <table className="min-w-full">
                                  <tbody>
                                    <tr>
                                      <td className="px-3 py-2 font-semibold text-sm">Method</td>
                                      <td className="px-3 py-2 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                          learner.payment.method === 'M-Pesa' ? 'bg-green-100 text-green-800' :
                                          learner.payment.method === 'Bank Transfer' ? 'bg-blue-100 text-blue-800' :
                                          'bg-gray-100 text-gray-800'
                                        }`}>
                                          {learner.payment.method || 'N/A'}
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-3 py-2 font-semibold text-sm">Amount</td>
                                      <td className="px-3 py-2 text-sm font-semibold text-green-600">
                                        KES {learner.payment.amount ? learner.payment.amount.toLocaleString() : 'N/A'}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-3 py-2 font-semibold text-sm">Transaction Code</td>
                                      <td className="px-3 py-2 text-sm font-mono text-blue-600">
                                        {learner.payment.transactionCode || 'N/A'}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-3 py-2 font-semibold text-sm">Payment Date</td>
                                      <td className="px-3 py-2 text-sm">
                                        {learner.payment.paymentDate ? new Date(learner.payment.paymentDate).toLocaleDateString() : 'N/A'}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className="px-3 py-2 font-semibold text-sm">Status</td>
                                      <td className="px-3 py-2 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                          learner.payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                          learner.payment.status === 'Verified' ? 'bg-green-100 text-green-800' :
                                          learner.payment.status === 'Failed' ? 'bg-red-100 text-red-800' :
                                          'bg-gray-100 text-gray-800'
                                        }`}>
                                          {learner.payment.status || 'N/A'}
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>

                              {/* Payment Actions */}
                              {/* <div>
                                <h5 className="font-semibold text-sm mb-3 text-gray-700">Payment Actions</h5>
                                <div className="space-y-3">
                                  <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm">
                                    Verify Payment
                                  </button>
                                  <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold text-sm">
                                    Mark as Verified
                                  </button>
                                  <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm">
                                    Request Receipt
                                  </button>
                                  <button className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm">
                                    Flag Payment Issue
                                  </button>
                                </div>
                              </div> */}
                            </div>

                            {/* Payment History/Notes */}
                            <div className="mt-6 pt-4 border-t border-gray-200">
                              <h5 className="font-semibold text-sm mb-3 text-gray-700">Payment Notes</h5>
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">
                                  Payment was made during the online registration process. 
                                  {learner.payment.transactionCode && ` Transaction code: ${learner.payment.transactionCode}`}
                                  {learner.payment.paymentDate && ` Date: ${new Date(learner.payment.paymentDate).toLocaleDateString()}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p>No payment information available</p>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <Dialog
        open={approveDialog}
        onClose={() => {
          setApproveDialog(false);
        }}
        initialFocus={approveButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5">
            {/* <Lucide
                  icon="XCircle"
                  className="w-16 h-16 mx-auto mt-3 text-danger"
                /> */}
            <div className="mt-5  font-medium">Incoming Tranfer</div>
            <div className="mt-2 text-slate-500">
              {!approveTranfer.exit
                ? " Do you really approve this record?"
                : "Do you really approve to exit this learner?"}
            </div>
            {!approveTranfer.exit && (
              <>
                <div className="col-span-4 sm:col-span-4">
                  <FormLabel htmlFor="grade">
                    Grade<span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <TomSelect
                    id="grade"
                    name="grade"
                    value={grade}
                    onChange={(event: any) => {
                      // reset({ ...getValues(), grade: event });
                      console.log("test");
                      setApproveTranfer({
                        ...approveTranfer,
                        to_grade: event,
                      });
                      setGrade(event);
                    }}
                    disabled={isEditMode}
                  >
                    <option value="">Select Grade</option>
                    {grades.map((grade: any, key) => (
                      <option key={key} value={grade._id}>
                        {grade.name}
                      </option>
                    ))}
                  </TomSelect>
                  {errors.grade && (
                    <div className="mt-2 text-danger">
                      {typeof errors.grade.message === "string" &&
                        errors.grade.message}
                    </div>
                  )}
                </div>

                <div className="col-span-12 sm:col-span-4 mt-2">
                  <FormLabel htmlFor="stream">
                    Select Stream<span className="text-danger ml-0.5">*</span>
                  </FormLabel>
                  <FormSelect
                    id="stream"
                    // {...register("stream")}
                    name="stream"
                    defaultValue={approveTranfer.to_stream}
                    onChange={(e) => {
                      setApproveTranfer({
                        ...approveTranfer,
                        to_stream: e.target.value,
                      });
                    }}
                  >
                    <option value="">Select Stream</option>
                    {streams.map((stream: any, key) => (
                      <option key={key} value={stream._id}>
                        {stream.name}
                      </option>
                    ))}
                  </FormSelect>
                  {errors.stream && (
                    <div className="mt-2 text-danger">
                      {typeof errors.stream.message === "string" &&
                        errors.stream.message}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="col-span-12 mt-4 text-right">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => {
                  setApproveDialog(false);
                }}
                className="w-24 mr-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => approveTranferSubmit()}
                variant="success"
                type="submit"
                className="w-24 ml-4 text-white"
                ref={approveButtonRef}
              >
                Approve
              </Button>
            </div>
          </div>
          <div className="px-5 pb-8 text-center"></div>
        </Dialog.Panel>
      </Dialog>
      <Dialog
        staticBackdrop
        size="lg"
        open={exportDialog}
        onClose={() => {
          setDialog(false);
        }}
      >
        <Dialog.Panel className="w-full max-w-screen-lg">
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">
              Download learners import Template
            </h2>
            <a
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                setUploadDialog(false);
              }}
              className="absolute top-0 right-0 mt-3 mr-3"
              href="#"
            >
              <Lucide icon="X" className="w-8 h-8 text-slate-400" />
            </a>
          </Dialog.Title>
          <div className="grid grid-cols-12 gap-4 gap-y-3 p-4">
            <div className="flex flex-wrap items-center col-span-12 mr-3  xl:flex-nowrap">
              <TomSelect
                value={grade}
                className=" w-full text-slate-500 "
                onChange={(event: any) => {
                  reset({ ...getValues(), grade: event });
                  setStream("");
                  setGrade(event);
                }}
              >
                <option value={""} selected>
                  All Grades
                </option>
                {grades.map((grade: any, key) => (
                  <option key={key} value={grade._id}>
                    {grade.name}
                  </option>
                ))}
              </TomSelect>
            </div>
            <div className="flex flex-wrap items-center col-span-12 mr-3  xl:flex-nowrap">
              <FormSelect
                // {...register("stream")}
                // name="stream"
                value={stream}
                onChange={(e: any) => {
                  setStream(e.target.value);
                }}
                className={errors.stream ? "border-danger" : ""}
                disabled={isEditMode}
              >
                <option value={""}>Select Stream</option>
                {streams.map((stream: any, key) => (
                  <option key={key} value={stream._id}>
                    {stream.name}
                  </option>
                ))}
              </FormSelect>
            </div>
          </div>
          <Dialog.Footer>
            <div className=" text-right">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => {
                  setExportDialog(false);
                }}
                className="w-24 mr-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => exportTemplate()}
                variant="primary"
                type="button"
                className="m-3 w-24"
                ref={deleteButtonRef}
              >
                Download
                {loading && (
                  <LoadingIcon
                    icon="spinning-circles"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                )}
              </Button>
            </div>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
      <Dialog
        staticBackdrop
        size="lg"
        open={uploadDialog}
        onClose={() => {
          setUploadDialog(false);
        }}
      >
        <Dialog.Panel className="w-full max-w-screen-lg">
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Import Learners</h2>
            <a
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                setUploadDialog(false);
              }}
              className="absolute top-0 right-0 mt-3 mr-3"
              href="#"
            >
              <Lucide icon="X" className="w-8 h-8 text-slate-400" />
            </a>
          </Dialog.Title>
     
          <div className="p-1">
            Choose the file to upload. <i>Type must be csv</i>
            <input
              id="file_input"
              type="file"
              onChange={handleFileChange}
              className="p-4 border border-gray-300 rounded-md items-center w-full rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
          </div>

          <Dialog.Footer>
            <div className=" text-right">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => {
                  setUploadDialog(false);
                }}
                className="w-24 mr-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => importData()}
                variant="primary"
                type="button"
                className="m-3 w-24"
                ref={deleteButtonRef}
              >
                Import
                {loading && (
                  <LoadingIcon
                    icon="spinning-circles"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                )}
              </Button>
            </div>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>

      {/* Generate Online Link Dialog */}
      <Dialog
        open={linkDialog}
        onClose={() => {
          setLinkDialog(false);
          setGeneratedLink("");
        }}
      >
        <Dialog.Panel>
          <Dialog.Title>
            <h2 className="mr-auto text-base font-medium">Generate Online Application Link</h2>
            <a
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                setLinkDialog(false);
                setGeneratedLink("");
              }}
              className="absolute top-0 right-0 mt-5 mr-5 text-slate-400"
            >
              <Lucide icon="X" className="w-4 h-4" />
            </a>
          </Dialog.Title>
          
          <div className="p-5">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <FormLabel htmlFor="title">Application Title</FormLabel>
                <FormInput
                  id="title"
                  type="text"
                  value={linkData.title}
                  onChange={(e) => handleLinkDataChange('title', e.target.value)}
                  placeholder="Enter application title"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormLabel htmlFor="startDate">Application Start Date</FormLabel>
                  <FormInput
                    id="startDate"
                    type="date"
                    value={linkData.startDate}
                    onChange={(e) => handleLinkDataChange('startDate', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <FormLabel htmlFor="endDate">Application End Date</FormLabel>
                  <FormInput
                    id="endDate"
                    type="date"
                    value={linkData.endDate}
                    onChange={(e) => handleLinkDataChange('endDate', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <FormLabel htmlFor="applicationFee">Application Fee (KES)</FormLabel>
                <FormInput
                  id="applicationFee"
                  type="number"
                  value={linkData.applicationFee}
                  onChange={(e) => handleLinkDataChange('applicationFee', parseInt(e.target.value) || 1000)}
                  placeholder="1000"
                  className="mt-1"
                />
              </div>

              {generatedLink && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Generated Link:</h4>
                  <div className="flex items-center gap-2">
                    <FormInput
                      type="text"
                      value={generatedLink}
                      readOnly
                      className="flex-1 bg-white"
                    />
                    <Button
                      onClick={() => navigator.clipboard.writeText(generatedLink)}
                      variant="outline-secondary"
                      className="px-3"
                    >
                      <Lucide icon="Copy" className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-green-700 mt-2">
                    Link copied to clipboard! Share this link with applicants.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Dialog.Footer>
            <div className="text-right">
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setLinkDialog(false);
                  setGeneratedLink("");
                }}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                onClick={generateLink}
                variant="primary"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Lucide icon="Link" className="w-4 h-4 mr-2" />
                Generate Link
              </Button>
            </div>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>


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
