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
  const [visitors, setVisitors] = useState([]);
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
  
  // Filter states
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('');
  const [selectedPurposeFilter, setSelectedPurposeFilter] = useState<string>('');
  
  // Date filter states
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
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

    socket.emit("register", { userId: user._id, userType: "parent" });

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
  }, [socket, user._id]);

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
      fullName: yup.string().required("First name is required"),
      idNumber: yup.string().required("ID No is required"),
      phoneNumber: yup.string().required("Phone Number is required"),
      email: yup.string().required("Email Address is required"),
      company: yup.string().required("Company is required"),
      purpose: yup.string().required("Purpose of visit is required"),
      hostName: yup.string().required("Host name is required"),
      visitDate: yup.string().required("Visit Date Time is required"),
      status: yup.string().required("Select Status is required"),
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

      formData.append("sender", user._id);
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
        await ApiService.createVisitor(data);
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
    // getParents();
  }, []);

  // Trigger data refresh when date filters change
  useEffect(() => {
    if (fromDate || toDate) {
      getStudents();
    }
  }, [fromDate, toDate]);
  useEffect(() => {
    getStreams();
  }, [grade]);
  useEffect(() => {
    getStudents();
  }, [search, page, limit, grade, stream, sortField, sortOrder, selectedStatusFilter, selectedCompanyFilter, selectedPurposeFilter]);


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
      const visitorsResponse = await ApiService.getVisitors(
        {
          page,
          search,
          limit,
          grade,
          stream,
          sortField,
          sortOrder, // Include sorting in API request
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
          // status: selectedStatusFilter ? [selectedStatusFilter] : [],
          // company: selectedCompanyFilter,
          // purpose: selectedPurposeFilter,
        },
        strandFilter
      );
      const pagination = visitorsResponse?.pagination;
      setPagination({
        current_page: Number(pagination?.current_page),
        total: pagination?.total || 0,
        total_pages: pagination?.total_pages || 1,
        per_page: Number(pagination?.per_page),
      });

      console.log("Visitors data", visitorsResponse.data);
      setLearners(visitorsResponse.data || []);

    } catch (error) {
      console.error("Error fetching students:", error);
      setLearners([]);
      setPagination({
        current_page: 1,
        total: 0,
        total_pages: 1,
        per_page: 0,
      });
    } finally {
      isLoading(false);
    }
  };

  const handleSort = (field: string) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  // Filter handler functions
  const handleStatusFilterChange = (status: string) => {
    setSelectedStatusFilter(status);
    setPage(1); // Reset to first page when filtering
  };

  const clearStatusFilter = () => {
    setSelectedStatusFilter('');
    setPage(1); // Reset to first page when clearing filter
  };

  const handleCompanyFilterChange = (company: string) => {
    setSelectedCompanyFilter(company);
    setPage(1); // Reset to first page when filtering
  };

  const clearCompanyFilter = () => {
    setSelectedCompanyFilter('');
    setPage(1); // Reset to first page when clearing filter
  };

  const handlePurposeFilterChange = (purpose: string) => {
    setSelectedPurposeFilter(purpose);
    setPage(1); // Reset to first page when filtering
  };

  const clearPurposeFilter = () => {
    setSelectedPurposeFilter('');
    setPage(1); // Reset to first page when clearing filter
  };

  // Date filter handler functions
  const handleFromDateChange = (date: string) => {
    setFromDate(date);
    setPage(1); // Reset to first page when filtering
  };

  const handleToDateChange = (date: string) => {
    setToDate(date);
    setPage(1); // Reset to first page when filtering
  };

  const clearDateFilters = () => {
    setFromDate('');
    setToDate('');
    setPage(1); // Reset to first page when clearing filters
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


  const checkoutVisitor = async () => {
    isLoading(true);
    try {
      let res = await ApiService.checkoutVisitor(recordId);
      getStudents();
      setViewMore(false);
      isLoading(false);
      // setConfirmDelete(false);
      setSuccess(true);
      setMessage("Visitor Checked out successfully");
      notify.current?.showToast();
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };

  // Duration monitoring helper functions
  const calculateAverageDuration = () => {
    const checkedOutVisitors = learners.filter((v: any) => v.actualDuration);
    if (checkedOutVisitors.length === 0) return 0;
    
    const totalDuration = checkedOutVisitors.reduce((sum: number, v: any) => sum + (v.actualDuration || 0), 0);
    return Math.round(totalDuration / checkedOutVisitors.length);
  };

  const calculateCurrentDuration = (visitor: any) => {
    if (!visitor.checkInTime) return 0;
    
    const currentTime = new Date();
    const checkInTime = new Date(visitor.checkInTime);
    const durationMs = currentTime.getTime() - checkInTime.getTime();
    return Math.round(durationMs / (1000 * 60)); // Convert to minutes
  };

  const checkOverstayedVisitors = async () => {
    try {
      const response = await ApiService.checkOverstayedVisitors();
      console.log('Overstayed visitors check:', response);
      
      // Refresh the visitors list to get updated data
      await getStudents();
      
      setSuccess(true);
      setMessage(`Found ${response.overstayedCount} overstayed visitors and ${response.warningCount} warnings`);
      notify.current?.showToast();
    } catch (error: any) {
      setSuccess(false);
      setMessage('Error checking overstayed visitors: ' + error.message);
      notify.current?.showToast();
    }
  };

  const handleCheckOut = async (visitorId: string) => {
    try {
      await ApiService.checkoutVisitor(visitorId);
      await getStudents(); // Refresh the list
      setSuccess(true);
      setMessage('Visitor checked out successfully');
      notify.current?.showToast();
    } catch (error: any) {
      setSuccess(false);
      setMessage('Error checking out visitor: ' + error.message);
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
 
    setLearner(record);
    getLeanerClasses(record._id);
    console.log(record);
    setProfile(true);
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

    reset({
      ...record,
      image: "",
  
    });
    console.log(record);
    setDialog(true);
  };

  useEffect(() => {
    // handleGuardianIdNoBlur();
  }, [guardianIdNo]);
  useEffect(() => {
    if (selectedTerm && selectedAcademicYear) {
      getTests();
      getLearningAreas();
    }
  }, [selectedAcademicYear, selectedTerm]);

  useEffect(() => {
    // handleGuardianIdNoBlur2();
  }, [guardianIdNo2]);
  const unreadMessages = {
    guardian1: 3, // Replace with actual count
    guardian2: 1, // Replace with actual count
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
 
      isLoading(false);
    } catch (error: any) {
      isLoading(false);
      setSuccess(false);
      console.log(error);
      setMessage(error.message);
      notify.current?.showToast();
    }
  };

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
                  className={`flex ${msg.sender === user._id ? "justify-end" : "justify-start"
                    }`}
                >
                  <div className="max-w-[75%] group">
                    <div
                      className={`p-4 rounded-2xl shadow-md transition-all ${msg.sender === user._id
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
                      className={`text-xs mt-1 block opacity-0 group-hover:opacity-100 transition-opacity ${msg.sender === user._id
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
          {/* Enhanced Top Section */}
          <div className="flex items-center bg-white  p-4 rounded-t-2xl shadow-lg">
            <a
              onClick={(event: React.MouseEvent) => {
                event.preventDefault();
                cancel({ name: "" });
                setDialog(false);
                setIsEditMode(false);
              }}
              href="#"
              className="text-black hover:text-gray-200 transition-colors"
            >
              <Lucide icon="ArrowLeft" className="w-6 h-6" />
            </a>
            <h2 className="ml-4 text-xl font-semibold text-black">
              {isEditMode ? "Edit Visitor" : "New Visitor"}
            </h2>
          </div>
          <form
            className="mt-8 p-8 bg-white rounded-2xl shadow-xl  mx-auto border border-gray-100 animate-fade-in"
            onSubmit={onSubmit}
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4">
              <a
                onClick={(event: React.MouseEvent) => {
                  event.preventDefault();
                  setPhoto("");
                  setIsEditMode(false);
                  setDialog(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                href="#"
              >
                <Lucide icon="X" className="w-6 h-6" />
              </a>
            </div>


            {/* NEW VISITORS DETAILS */}
            {/* Tab Content */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              {activeTabLearner === "learner" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("fullName")}
                      type="text"
                      name="fullName"
                      className={`mt-1 w-full rounded-lg border ${errors.fullName ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Full Name"
                    />
                    {errors.fullName && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.fullName.message === "string" &&
                          errors.fullName.message}
                      </div>
                    )}
                  </div>


                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      ID Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("idNumber")}
                      type="text"
                      name="idNumber"
                      className={`mt-1 w-full rounded-lg border ${errors.idNumber ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="ID number"
                    />
                    {errors.idNumber && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.idNumber.message === "string" &&
                          errors.idNumber.message}
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("phoneNumber")}
                      type="text"
                      name="phoneNumber"
                      className={`mt-1 w-full rounded-lg border ${errors.phoneNumber ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Phone number"
                    />
                    {errors.phoneNumber && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.phoneNumber.message === "string" &&
                          errors.phoneNumber.message}
                      </div>
                    )}
                  </div>


                  {/* Email address*/}

                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("email")}
                      type="text"
                      name="email"
                      className={`mt-1 w-full rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Email Address"
                    />
                    {errors.email && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.email.message === "string" &&
                          errors.email.message}
                      </div>
                    )}
                  </div>

                  {/* Company*/}

                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Company <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("company")}
                      type="text"
                      name="company"
                      className={`mt-1 w-full rounded-lg border ${errors.company ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Company"
                    />
                    {errors.company && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.company.message === "string" &&
                          errors.company.message}
                      </div>
                    )}
                  </div>

                  {/* Purpose of Visit */}

                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Purpose of Visit <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("purpose")}
                      type="text"
                      name="purpose"
                      className={`mt-1 w-full rounded-lg border ${errors.purpose ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Purpose of Visit"
                    />
                    {errors.purpose && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.purpose.message === "string" &&
                          errors.purpose.message}
                      </div>
                    )}
                  </div>

                  {/* Host Name */}

                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Host Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("hostName")}
                      type="text"
                      name="hostName"
                      className={`mt-1 w-full rounded-lg border ${errors.hostName ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Host Name"
                    />
                    {errors.hostName && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.hostName.message === "string" &&
                          errors.hostName.message}
                      </div>
                    )}
                  </div>



                  {/* Visit Date & Time */}

                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Visit Date & Time <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("visitDate")}
                      type="datetime-local"
                      name="visitDate"
                      className={`mt-1 w-full rounded-lg border ${errors.visitDate ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Select Visit Date & Time"
                    />
                    {errors.visitDate && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.visitDate.message === "string" &&
                          errors.visitDate.message}
                      </div>
                    )}
                  </div>

                  {/* Status */}

                  <div>
                    <FormLabel
                      className="text-sm font-medium text-gray-700"
                      htmlFor="modal-form-6"
                    >
                      Status
                    </FormLabel>
                    <FormSelect
                      {...register("status")}
                      name="status"
                      className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Checked In">Checked In</option>
                      <option value="Checked Out">Checked Out</option>
                    </FormSelect>
                    {errors.status && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.status.message ===
                          "string" && errors.status.message}
                      </div>
                    )}
                  </div>

                </div>
              )}


            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => cancel({ name: "" })}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center disabled:bg-indigo-400"
                disabled={loading}
              >
                Save
                {loading && (
                  <LoadingIcon
                    icon="spinning-circles"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                )}
              </Button>
            </div>
          </form>
        </>
      ) : !profile && !dialog ? (
        <>
          <h2 className="mt-1 text-lg font-medium ">Visitors</h2>


          <div className="flex flex-wrap items-center col-span-12 mt-2  xl:flex-nowrap">
            {(is_admin() ||
              hasPermission("parental-communication", "read")) && (
                <>
                  {" "}
                  <Button
                    variant="primary"
                    className="mr-2 shadow-md"
                    onClick={(event: React.MouseEvent) => {
                      event.preventDefault();
                      setDialog(true);
                      setIsEditMode(false);
                    }}
                  >
                    New Visitor
                  </Button>
                  <Menu>
                    <Menu.Button as={Button} className="px-2 !box">
                      <span className="flex items-center justify-center w-5 h-5">
                        <Lucide icon="Plus" className="w-4 h-4" />
                      </span>
                    </Menu.Button>
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

                    </Menu.Items>
                  </Menu>
                </>
              )}
            {/* <div className="hidden mx-auto md:block text-slate-500">
              Showing{" "}
              {pagination.current_page +
                " to " +
                pagination.total_pages +
                " of " +
                pagination.total}{" "}
              entries
            </div> */}
  
       
            <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0 space-x-3">
              <div className="relative w-56 text-slate-500">
                <FormInput
                  type="text"
                  className="w-56 pr-10 !box"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search ? (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Clear search"
                  >
                    <Lucide icon="X" className="w-4 h-4" />
                  </button>
                ) : (
                  <Lucide
                    icon="Search"
                    className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                  />
                )}
              </div>

              {/* Date Filter Inputs */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <FormInput
                    type="date"
                    className="w-40 !box"
                    placeholder="From Date"
                    value={fromDate}
                    onChange={(e) => handleFromDateChange(e.target.value)}
                  />
                  <Lucide
                    icon="Calendar"
                    className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3 text-gray-400"
                  />
                </div>
                <span className="text-gray-500">to</span>
                <div className="relative">
                  <FormInput
                    type="date"
                    className="w-40 !box"
                    placeholder="To Date"
                    value={toDate}
                    onChange={(e) => handleToDateChange(e.target.value)}
                  />
                  <Lucide
                    icon="Calendar"
                    className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3 text-gray-400"
                  />
                </div>
                {(fromDate || toDate) && (
                  <button
                    onClick={clearDateFilters}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Clear date filters"
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
                  <option value="Checked In">Checked In</option>
                  <option value="Checked Out">Checked Out</option>
                </FormSelect>
                {selectedStatusFilter && (
                  <button
                    onClick={clearStatusFilter}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-700 transition-colors"
                    title="Clear status filter"
                  >
                    <Lucide icon="X" className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Company Filter Dropdown */}
              <div className="relative w-48">
                <FormSelect
                  value={selectedCompanyFilter}
                  onChange={(e) => handleCompanyFilterChange(e.target.value)}
                  className={`w-48 !box ${selectedCompanyFilter ? 'border-blue-500 bg-blue-50' : ''}`}
                >
                  <option value="">All Companies</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Google">Google</option>
                  <option value="Apple">Apple</option>
                  <option value="Amazon">Amazon</option>
                  <option value="Other">Other</option>
                </FormSelect>
                {selectedCompanyFilter && (
                  <button
                    onClick={clearCompanyFilter}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors"
                    title="Clear company filter"
                  >
                    <Lucide icon="X" className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Purpose Filter Dropdown */}
              <div className="relative w-48">
                <FormSelect
                  value={selectedPurposeFilter}
                  onChange={(e) => handlePurposeFilterChange(e.target.value)}
                  className={`w-48 !box ${selectedPurposeFilter ? 'border-purple-500 bg-purple-50' : ''}`}
                >
                  <option value="">All Purposes</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Interview">Interview</option>
                  <option value="Delivery">Delivery</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Other">Other</option>
                </FormSelect>
                {selectedPurposeFilter && (
                  <button
                    onClick={clearPurposeFilter}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-500 hover:text-purple-700 transition-colors"
                    title="Clear purpose filter"
                  >
                    <Lucide icon="X" className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Active Filter Indicators */}
            {(selectedStatusFilter || selectedCompanyFilter || selectedPurposeFilter || fromDate || toDate) && (
              <div className="flex items-center space-x-3 flex-wrap mt-3">
                {selectedStatusFilter && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-600 font-medium">
                      Status: {selectedStatusFilter}
                    </span>
                  </div>
                )}
                {selectedCompanyFilter && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-600 font-medium">
                      Company: {selectedCompanyFilter}
                    </span>
                  </div>
                )}
                {selectedPurposeFilter && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-purple-600 font-medium">
                      Purpose: {selectedPurposeFilter}
                    </span>
                  </div>
                )}
                {(fromDate || toDate) && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-orange-600 font-medium">
                      Date: {fromDate || 'Start'} to {toDate || 'End'}
                    </span>
                  </div>
                )}
              </div>
            )}

          </div>

          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="col-span-12 overflow-auto  2xl:overflow-visible">
              {loading ? (
                <div className="flex flex-col items-center mt-5">
                  <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
                </div>
              ) : learners.length === 0 ? (
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
                            <span>Full Name</span>
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
                          onClick={() => handleSort("id_number")}
                        >
                          <div className="flex items-center space-x-2">
                            <span>ID Number</span>
                            {sortField === "id_number" && (
                              <Lucide
                                icon={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"}
                                className="w-4 h-4"
                              />
                            )}
                          </div>
                        </Table.Th>

                        <Table.Th
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          onClick={() => handleSort("phone_number")}
                        >
                          <div className="flex items-center space-x-2">
                            <span>Phone Number</span>
                            {sortField === "phone_number" && (
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

                        <Table.Th className="text-center">
                          Duration
                        </Table.Th>

                        <Table.Th
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-center"
                          onClick={() => handleSort("createdAt")}
                        >
                          <div className="flex items-center justify-center space-x-1">
                            <span>Created Date</span>
                            {sortField === "createdAt" && (
                              <Lucide
                                icon={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"}
                                className="w-4 h-4"
                              />
                            )}
                          </div>
                        </Table.Th>

                        <Table.Th className="text-center w-32">
                          Actions
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {learners.map((learner: any, key) => (
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
                                  onClick={() => profileRecord(learner)}>
                                  {learner?.fullName && learner?.fullName}
                                </div>
                              </div>
                            </div>
                          </Table.Td>

                          <Table.Td>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 inline-block">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {learner?.idNumber}
                              </span>
                            </div>
                          </Table.Td>

                          <Table.Td>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2 inline-block">
                              <span className="font-medium text-blue-700 dark:text-blue-300">
                                {learner?.phoneNumber}
                              </span>
                            </div>
                          </Table.Td>

                          <Table.Td>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${learner?.status === "L" || learner?.status === "G"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              : learner?.status === "D"
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              }`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${learner?.status === "L" || learner?.status === "G"
                                ? "bg-red-500"
                                : learner?.status === "D"
                                  ? "bg-orange-500"
                                  : "bg-green-500"
                                }`}></div>
                      
                              {learner?.status === "Checked Out" ? "Checked Out" : ""}
                              {learner?.status === "Checked In" ? "Checked In" : ""}
                            </div>
                          </Table.Td>

                          <Table.Td className="text-center">
                            <div className="flex flex-col items-center space-y-1">
                              {learner?.status === "Checked In" ? (
                                <>
                                  <div className={`text-sm font-medium ${learner?.isOverstayed ? 'text-red-600' : 'text-gray-600'}`}>
                                    {calculateCurrentDuration(learner)}m
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    / {learner?.expectedDuration || 60}m
                                  </div>
                                  {learner?.isOverstayed && (
                                    <div className="text-xs text-red-500 font-medium">
                                      +{learner?.overstayMinutes || 0}m
                                    </div>
                                  )}
                                </>
                              ) : learner?.actualDuration ? (
                                <div className="text-sm font-medium text-gray-600">
                                  {learner.actualDuration}m
                                </div>
                              ) : (
                                <div className="text-sm text-gray-400">-</div>
                              )}
                            </div>
                          </Table.Td>

                          <Table.Td className="text-center">
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 inline-block">
                              <span className="font-medium text-gray-900 dark:text-white text-sm">
                                {learner?.createdAt ? formatDate(learner.createdAt) : 'N/A'}
                              </span>
                            </div>
                          </Table.Td>

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
                                      profileRecord(learner);
                                    }}
                                    className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                  >
                                    <Lucide icon="Eye" className="w-4 h-4 mr-3 text-blue-500" />
                                    View Details
                                  </Menu.Item>

                                  {hasPermission("learners", "update") && (
                                    <Menu.Item
                                      onClick={(e: any) => {
                                        e.preventDefault();
                                        editRecord(learner);
                                      }}
                                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                                    >
                                      <Lucide icon="Edit" className="w-4 h-4 mr-3 text-green-500" />
                                      Edit Visitor
                                    </Menu.Item>
                                  )}

              
      
                                  {(learner.status === "D" ||
                                    learner.status === "P") &&
                                    hasPermission("learners", "delete") && (
                                      <Menu.Item
                                        onClick={(e: any) => {
                                          e.preventDefault();
                                          disableRecord(learner._id);
                                          setSelectedLearner(learner);
                                          // assuming you meant disableRecord instead of disbaleRecord
                                        }}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                      >
                                        <i className="icon-eye mr-2"></i>
                                        {learner.status === "D"
                                          ? "Activate "
                                          : "Deactivate "}
                                      </Menu.Item>
                                    )}

                                  {hasPermission("learners", "delete") && (
                                    <Menu.Item
                                      onClick={(e: any) => {
                                        e.preventDefault();
                                        setRecordId(learner._id);
                                        setViewMore(true);
                                      }}
                                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                                    >
                                    <Lucide icon="LogOut" className="w-4 h-4 mr-3 text-green-500" />
                                       Check Out
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
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${pageNum === pagination.current_page
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
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${1 === pagination.current_page
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
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${pageNum === pagination.current_page
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
                              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${pagination.total_pages ===
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
                  icon="LogOut"
                  className="w-16 h-16 mx-auto mt-3 text-danger"
                />
                <div className="mt-5 text-3xl">Are you sure?</div>
                <div className="mt-2 text-slate-500">
                  Do you really want to checkout this Visitor? <br />
               
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
                  onClick={() => checkoutVisitor()}
                  variant="danger"
                  type="button"
                  className="w-24"
                  ref={deleteButtonRef}
                >
                  Checkout
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
                    {`${learner.fullName}`}
                  </h3>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="w-full md:w-3/4 ">
              <div className="bg-white shadow-md rounded-lg  m-4">
                <div className="p-6">
                  <h4 className="font-bold">Visitor's Details</h4>

                  {/* Tabs for Basic Info and Guardians */}
                  <ul className="flex border-b border-gray-200 mb-4">
                    <li className="mr-2">
                      <button
                        className={`inline-block py-2 px-4 ${activeTab === "basicInfo"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-600 hover:text-blue-600"
                          } font-semibold`}
                        onClick={() => setActiveTab("basicInfo")}
                      >
                        Basic Info
                      </button>
                    </li>
          

                  </ul>

                  {/* Tab Content */}
                  <div className="tab-content">
                    {/* Basic Info Tab */}

                    {activeTab === "basicInfo" && (
                      <div className="tab-pane active">
                        <h4 className="font-bold">Bascic Information</h4>

                        <table className="min-w-full border border-gray-200">
                          <tbody>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Name
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">{`${learner?.fullName}`}</td>
                            </tr>
                  
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Id Number
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">{`${learner?.idNumber}`}</td>
                            </tr>

                           <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Phone Number
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">{`${learner?.phoneNumber}`}</td>
                            </tr>

                             <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Email
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">{`${learner?.email}`}</td>
                            </tr>

                            
                             <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Company
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">{`${learner?.company}`}</td>
                            </tr>

                           <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Purpose
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">{`${learner?.purpose}`}</td>
                            </tr>

                            
                           <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Host Name
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">{`${learner?.hostName}`}</td>
                            </tr>

                             <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Status
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">{`${learner?.status}`}</td>
                            </tr>

                           <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Pass Id
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">{`${learner?.passId}`}</td>
                            </tr>

                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Visit Date
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">{`${learner?.visitDate}`}</td>
                            </tr>
              
                          </tbody>
                        </table>
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
          {/* <div className="p-5 text-center">
                <Lucide
                  icon="XCircle"
                  className="w-16 h-16 mx-auto mt-3 text-danger"
                />
              </div> */}
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
