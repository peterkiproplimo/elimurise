import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import { X, Paperclip, Send, MoreHorizontal, Eye, Edit, ArrowLeftRight, LogOut } from "lucide-react"; // Using Lucide icons for a modern look
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormSwitch,
  FormTextarea,
} from "../../base-components/Form";
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
import { useAuth } from "../../contexts/Auth";

import LoadingIcon from "../../base-components/LoadingIcon";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, Search } from "lucide-react";
import TomSelect from "../../base-components/TomSelect";
import * as C from "../../utils/constants";
import Pagination from "../../base-components/Pagination";
import Alert from "../../base-components/Alert";
import Dropzone from "dropzone";
import Tippy from "../../base-components/Tippy";
import * as c from "../../utils/constants";
import leanerImg from "../../assets/images/learner.jpeg";
import { formatDate, is_admin } from "../../utils/helper";
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
  
  // Certificate form states
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [studentCertificates, setStudentCertificates] = useState<any>({});
  const [certificatesDialog, setCertificatesDialog] = useState(false);
  const [selectedStudentForCertificates, setSelectedStudentForCertificates] = useState<any>(null);
  
  // Certificate view dialog states
  const [certificateViewDialog, setCertificateViewDialog] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  
  // Students for dropdown
  const [students, setStudents] = useState<any>([]);
  
  // Certificates table states
  const [certificates, setCertificates] = useState([]);
  const [certificatePagination, setCertificatePagination] = useState({
    current_page: 1,
    total: 0,
    total_pages: 1,
    per_page: 10,
  });
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
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('');
  const [selectedCertificateCategoriesFilter, setSelectedCertificateCategoriesFilter] = useState<string>('');
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
      studentId: yup.string().required("Student ID is required"),
      certificateName: yup.string().required("Certificate name is required"),
      certificateType: yup.string().required("Certificate type is required"),
      certificateCategories: yup.string().required("Certificate categories is required"),
      issueDate: yup.string().required("Issue date is required"),
      expiryDate: yup.string().optional(),
  

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
        
        // Validate required fields
        if (!selectedStudentId) {
          throw new Error("Please select a student");
        }
        
        if (!certificateFile) {
          throw new Error("Please upload a certificate file");
        }

        // Find selected student data
        const selectedStudent = students.find((student: any) => student._id === selectedStudentId);
        if (!selectedStudent) {
          throw new Error("Selected student not found");
        }
        
        // Create FormData for file upload
        const formDataToSend = new FormData();
        
        // Add form data
        formDataToSend.append('studentId', selectedStudentId);
        formDataToSend.append('studentName', `${selectedStudent.first_name} ${selectedStudent.last_name}`);
        formDataToSend.append('studentAdmNo', selectedStudent.adm_no);
        formDataToSend.append('certificateName', data.certificateName);
        formDataToSend.append('certificateType', data.certificateType);
        formDataToSend.append('certificateCategories', data.certificateCategories);
        formDataToSend.append('issueDate', data.issueDate);
        
        if (data.expiryDate) {
          formDataToSend.append('expiryDate', data.expiryDate);
        }
        
        // Add default values
        formDataToSend.append('issuedBy', 'School Administration');
        formDataToSend.append('status', 'Active');
        formDataToSend.append('isVerified', 'false');

        // Add certificate file
        formDataToSend.append('certificateFile', certificateFile);

        // Create certificate using API
        console.log("Creating certificate with FormData:", Object.fromEntries(formDataToSend.entries()));
        const response = await ApiService.createCertificate(formDataToSend);
        console.log("Certificate creation response:", response);
        
        // Refresh student certificates after successful creation
        await fetchStudentCertificates(learners);
        
        await cancel({ name: "" });
        isLoading(false);
        setDialog(false);
        setSuccess(true);
        setMessage(
          isEditMode
            ? "Certificate Updated successfully"
            : "Certificate created successfully."
        );
        notify.current?.showToast();
        
        // Reset form
        setCertificateFile(null);
        setSelectedStudentId("");
        
      } catch (error: any) {
        isLoading(false);
        setSuccess(false);
        setMessage(
          error.message || "An error occurred while creating the certificate."
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
  useEffect(() => {
    getStreams();
  }, [grade]);
  useEffect(() => {
    getStudents();
  }, [search, page, limit, grade, stream, sortField, sortOrder, selectedTypeFilter, selectedCertificateCategoriesFilter]);

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
      // Fetch certificates instead of students
      const response = await ApiService.getCertificates({
        page,
        search,
        limit: limit,
        sortBy: sortField,
        sortOrder: sortOrder,
        type: selectedTypeFilter,
        certificateCategories: selectedCertificateCategoriesFilter
      });
      
      console.log("Certificates response:", response);
      setLearners(response.certificates || []); // Use learners state to store certificates
      
      const pagination = response.pagination;
      setPagination({
        current_page: Number(pagination?.current_page || 1),
        total: pagination?.total || 0,
        total_pages: pagination?.total_pages || 1,
        per_page: Number(pagination?.per_page || limit),
      });
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      isLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      console.log("Fetching students...");
      
      // Try getLearnersEnroll first
      try {
        const response = await ApiService.getLearnersEnroll({}, {});
        console.log("getLearnersEnroll response:", response);
        console.log("Response structure:", Object.keys(response));
        
        const studentsData = response.learners || response.data || response || [];
        console.log("Students data from getLearnersEnroll:", studentsData);
        console.log("Students count:", studentsData.length);
        
        if (studentsData.length > 0) {
          setStudents(studentsData);
          return;
        }
      } catch (enrollError) {
        console.log("getLearnersEnroll failed, trying getLearners:", enrollError);
      }
      
      // Fallback to getLearners
      const response = await ApiService.getLearners({}, {});
      console.log("getLearners response:", response);
      console.log("Response structure:", Object.keys(response));
      
      const studentsData = response.learners || response.data || response || [];
      console.log("Students data from getLearners:", studentsData);
      console.log("Students count:", studentsData.length);
      
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
      console.error("Error details:", error);
    }
  };

  // Function to fetch all certificates
  const fetchCertificates = async () => {
    try {
      console.log("Fetching all certificates...");
      const response = await ApiService.getCertificates({
        page: certificatePagination.current_page,
        limit: certificatePagination.per_page
      });
      
      console.log("Certificates response:", response);
      setCertificates(response.certificates || []);
      setCertificatePagination({
        current_page: response.pagination?.current_page || 1,
        total: response.pagination?.total || 0,
        total_pages: response.pagination?.total_pages || 1,
        per_page: response.pagination?.per_page || 10,
      });
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  // Function to fetch certificates for all students (keep for compatibility)
  const fetchStudentCertificates = async (students: any[]) => {
    try {
      console.log("Fetching certificates for students:", students.length);
      
      const certificatePromises = students.map(async (student) => {
        try {
          console.log(`Fetching certificates for student: ${student._id} (${student.first_name} ${student.last_name})`);
          const certificates = await ApiService.getCertificatesByStudent(student._id);
          console.log(`Certificates for ${student._id}:`, certificates);
          return { studentId: student._id, certificates: certificates.certificates || [] };
        } catch (error) {
          console.error(`Error fetching certificates for student ${student._id}:`, error);
          return { studentId: student._id, certificates: [] };
        }
      });

      const results = await Promise.all(certificatePromises);
      console.log("Certificate fetch results:", results);
      
      const certificateMap: any = {};
      results.forEach(({ studentId, certificates }) => {
        certificateMap[studentId] = certificates;
      });
      
      console.log("Final certificate map:", certificateMap);
      setStudentCertificates(certificateMap);
    } catch (error) {
      console.error("Error fetching student certificates:", error);
    }
  };

  // Function to view student certificates
  const viewStudentCertificates = (student: any) => {
    setSelectedStudentForCertificates(student);
    setCertificatesDialog(true);
  };
  const handleSort = (field: string) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  // Filter handler functions
  const handleTypeFilterChange = (type: string) => {
    setSelectedTypeFilter(type);
    setPage(1); // Reset to first page when filtering
  };

  const clearTypeFilter = () => {
    setSelectedTypeFilter('');
    setPage(1); // Reset to first page when clearing filter
  };

  const handleCertificateCategoriesFilterChange = (certificateCategories: string) => {
    setSelectedCertificateCategoriesFilter(certificateCategories);
    setPage(1); // Reset to first page when filtering
  };

  const clearCertificateCategoriesFilter = () => {
    setSelectedCertificateCategoriesFilter('');
    setPage(1); // Reset to first page when clearing filter
  };
  const getParents = async (search: any) => {
    const response = await ApiService.getParents({
      page: 1,
      search,
    });
    // setParents(response.data);
    return response.data;
  };
  const getStreams = async () => {
    const response = await ApiService.getStream({ grade: grade });
    setStreams(response.data);
    console.log(response);
  };

  const deleteRecord = async () => {
    if (!recordId) {
      setSuccess(false);
      setMessage("No record ID provided");
      notify.current?.showToast();
      return;
    }
    
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
    // Reset certificate form fields
    setSelectedStudentId("");
    setCertificateFile(null);
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
      // const pagination = res.pagination;
      // setPagination({
      //   current_page: pagination?.current_page,
      //   total: pagination?.total,
      //   total_pages: pagination?.total_pages,
      //   per_page: pagination?.per_page,
      // });
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
      // const pagination = res.pagination;
      // setPagination({
      //   current_page: pagination?.current_page,
      //   total: pagination?.total,
      //   total_pages: pagination?.total_pages,
      //   per_page: pagination?.per_page,
      // });
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

  const handleToggleParent2 = (event: any) => {
    if (!event.target.checked) {
      // Clear "Parent 2 Details" fields when unchecked
      reset({
        ...getValues(),
        guardian2_id_no: "",
        guardian2_relationship: "",
        guardian2_first_name: "",
        guardian2_surname: "",
        guardian2_last_name: "",
        guardian2_email: "",
        guardian2_phone: "",
      });
      setGuardianIdNo2("");
    }
    setShowParent2(event.target.checked); // Toggle visibility
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

    // Play sound for new messages from others
    // if (
    //   messages.length > 0 &&
    //   messages[messages.length - 1].sender !== user._id
    // ) {
    //   if (!audioRef.current) {
    //     audioRef.current = new Audio("/audio/notification.mp3");
    //   }
    //   audioRef.current.play();
    // }
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
                    msg.sender === user._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[75%] group">
                    <div
                      className={`p-4 rounded-2xl shadow-md transition-all ${
                        msg.sender === user._id
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
                        msg.sender === user._id
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
              {isEditMode ? "Edit Certificate" : "New Certificate"}
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

            {/* Certificate Form Content */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Student Selection */}
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                    Student ID <span className="text-red-500">*</span>
                        </FormLabel>
                        <TomSelect
                    value={selectedStudentId}
                          onChange={(event: any) => {
                      setSelectedStudentId(event);
                      reset({ ...getValues(), studentId: event });
                    }}
                    className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                  >
                    <option value="">Select Student</option>
                    {students.length > 0 ? (
                      students.map((student: any, key) => (
                        <option key={key} value={student._id}>
                          {student.adm_no} - {student.first_name} {student.last_name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No students found</option>
                    )}
                        </TomSelect>
                          </div>

                {/* Certificate Name */}
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                    Certificate Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormInput
                    {...register("certificateName")}
                        type="text"
                    name="certificateName"
                        className={`mt-1 w-full rounded-lg border ${
                      errors.certificateName ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500 transition-all`}
                    placeholder="Enter certificate name"
                  />
                  {errors.certificateName && (
                        <div className="mt-2 text-red-500 text-sm">
                      {typeof errors.certificateName.message === "string" &&
                        errors.certificateName.message}
                        </div>
                      )}
                    </div>

                {/* Certificate Type */}
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                    Type <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormSelect
                    {...register("certificateType")}
                    name="certificateType"
                        className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                      >
                    <option value="">Select Certificate Type</option>
                    <option value="Academic">Academic</option>
                    <option value="Training">Training</option>
                    <option value="Sports">Sports</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Community Service">Community Service</option>
                    <option value="Other">Other</option>
                      </FormSelect>
                  {errors.certificateType && (
                        <div className="mt-2 text-red-500 text-sm">
                      {typeof errors.certificateType.message === "string" &&
                        errors.certificateType.message}
                        </div>
                      )}
                    </div>

                {/* Certificate Categories */}
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                    Certificate Categories <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormSelect
                    {...register("certificateCategories")}
                    name="certificateCategories"
                        className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                      >
                    <option value="">Select Certificate Category</option>
                    <option value="Upload scanned certificates">Upload scanned certificates</option>
                    <option value="Awards">Awards</option>
                    <option value="Recognitions">Recognitions</option>
                    <option value="Academic">Academic</option>
                    <option value="Training">Training</option>
                    <option value="Sports">Sports</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Community Service">Community Service</option>
                    <option value="Other">Other</option>
                      </FormSelect>
                  {errors.certificateCategories && (
                        <div className="mt-2 text-red-500 text-sm">
                      {typeof errors.certificateCategories.message === "string" &&
                        errors.certificateCategories.message}
                        </div>
                      )}
                    </div>

                {/* Issue Date */}
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                    Issue Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormInput
                    {...register("issueDate")}
                    type="date"
                    name="issueDate"
                        className={`mt-1 w-full rounded-lg border ${
                      errors.issueDate ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500 transition-all`}
                  />
                  {errors.issueDate && (
                        <div className="mt-2 text-red-500 text-sm">
                      {typeof errors.issueDate.message === "string" &&
                        errors.issueDate.message}
                        </div>
                      )}
                    </div>

                {/* Expiry Date */}
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                    Expiry Date
                      </FormLabel>
                      <FormInput
                    {...register("expiryDate")}
                    type="date"
                    name="expiryDate"
                        className={`mt-1 w-full rounded-lg border ${
                      errors.expiryDate ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500 transition-all`}
                  />
                  {errors.expiryDate && (
                        <div className="mt-2 text-red-500 text-sm">
                      {typeof errors.expiryDate.message === "string" &&
                        errors.expiryDate.message}
                        </div>
                      )}
                    </div>

                {/* File Upload */}
                <div className="md:col-span-2">
                      <FormLabel className="text-sm font-medium text-gray-700">
                    Upload File <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormInput
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCertificateFile(file);
                      }
                    }}
                    className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  {certificateFile && (
                    <div className="mt-2 text-green-600 text-sm">
                      ✓ File selected: {certificateFile.name}
                        </div>
                      )}
                    </div>
                        </div>
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
          <h2 className="mt-1 text-lg font-medium ">Certificates</h2>
    

          <div className="flex flex-wrap items-center col-span-12 mt-2  xl:flex-nowrap">
            {(is_admin() ||
              hasPermission("parental-communication", "read")) && (
              <>
                {" "}
                <Button
                  variant="primary"
                  className="mr-2 shadow-md"
                  onClick={async (event: React.MouseEvent) => {
                    event.preventDefault();
                    // Fetch students for dropdown when opening certificate form
                    await fetchStudents();
                    setDialog(true);
                    setIsEditMode(false);
                  }}
                >
                  New Certificate
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
                    {/* <Menu.Item>
                   <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                   to PDF
                 </Menu.Item> */}
                  </Menu.Items>
                </Menu>
              </>
            )}
            <div className="hidden mx-auto md:block text-slate-500">
              Showing{" "}
              {pagination.current_page +
                " to " +
                pagination.total_pages +
                " of " +
                pagination.total}{" "}
              entries
            </div>
      
   
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

              {/* Type Filter Dropdown */}
              <div className="relative w-48">
                <FormSelect
                  value={selectedTypeFilter}
                  onChange={(e) => handleTypeFilterChange(e.target.value)}
                  className={`w-48 !box ${selectedTypeFilter ? 'border-blue-500 bg-blue-50' : ''}`}
                >
                  <option value="">All Types</option>
                  <option value="Academic">Academic</option>
                  <option value="Completion">Completion</option>
                  <option value="Achievement">Achievement</option>
                  <option value="Participation">Participation</option>
                  <option value="Merit">Merit</option>
                </FormSelect>
                {selectedTypeFilter && (
                  <button
                    onClick={clearTypeFilter}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors"
                    title="Clear type filter"
                  >
                    <Lucide icon="X" className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Certificate Categories Filter Dropdown */}
              <div className="relative w-48">
                <FormSelect
                  value={selectedCertificateCategoriesFilter}
                  onChange={(e) => handleCertificateCategoriesFilterChange(e.target.value)}
                  className={`w-48 !box ${selectedCertificateCategoriesFilter ? 'border-orange-500 bg-orange-50' : ''}`}
                >
                  <option value="">All Categories</option>
                  <option value="Upload scanned certificates">Upload scanned certificates</option>
                  <option value="Awards">Awards</option>
                  <option value="Recognitions">Recognitions</option>
                  <option value="Academic">Academic</option>
                  <option value="Training">Training</option>
                  <option value="Sports">Sports</option>
                  <option value="Leadership">Leadership</option>
                  <option value="Community Service">Community Service</option>
                  <option value="Other">Other</option>
                </FormSelect>
                {selectedCertificateCategoriesFilter && (
                  <button
                    onClick={clearCertificateCategoriesFilter}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500 hover:text-orange-700 transition-colors"
                    title="Clear certificate categories filter"
                  >
                    <Lucide icon="X" className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Active Filter Indicators */}
            {(selectedTypeFilter || selectedCertificateCategoriesFilter) && (
              <div className="flex items-center space-x-3 flex-wrap mt-3">
                {selectedTypeFilter && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-blue-600 font-medium">
                      Type: {selectedTypeFilter}
                    </span>
                  </div>
                )}
                {selectedCertificateCategoriesFilter && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-orange-600 font-medium">
                      Category: {selectedCertificateCategoriesFilter}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="col-span-12 overflow-auto  2xl:overflow-visible pb-4">
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
                          onClick={() => handleSort("studentName")}
                        >
                          <div className="flex items-center space-x-2">
                            <span>Student Name</span>
                            {sortField === "studentName" && (
                              <Lucide 
                                icon={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"} 
                                className="w-4 h-4" 
                              />
                            )}
                          </div>
                        </Table.Th>

                        <Table.Th
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          onClick={() => handleSort("certificateName")}
                        >
                          <div className="flex items-center space-x-2">
                            <span>Certificate Name</span>
                            {sortField === "certificateName" && (
                              <Lucide 
                                icon={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"} 
                                className="w-4 h-4" 
                              />
                            )}
                          </div>
                        </Table.Th>

                        <Table.Th
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          onClick={() => handleSort("certificateType")}
                        >
                          <div className="flex items-center space-x-2">
                            <span>Type</span>
                            {sortField === "certificateType" && (
                              <Lucide 
                                icon={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"} 
                                className="w-4 h-4" 
                              />
                            )}
                          </div>
                        </Table.Th>

                        <Table.Th
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                          onClick={() => handleSort("issueDate")}
                        >
                          <div className="flex items-center space-x-2">
                            <span>Issue Date</span>
                            {sortField === "issueDate" && (
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

                        <Table.Th className="text-center w-32">
                          Actions
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {learners.map((certificate: any, key) => {
                        const isLastRow = key === learners.length - 1;
                        const isSecondLastRow = key === learners.length - 2;
                        const shouldOpenUpward = isLastRow || isSecondLastRow;
                        return (
                        <Table.Tr key={key}>
                          <Table.Td className="text-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {limit * (page - 1) + key + 1}
                            </div>
                          </Table.Td>
                          
                          <Table.Td>
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-sm bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                <Lucide icon="Award" className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {certificate?.studentName || "Unknown Student"}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  {certificate?.studentAdmNo || "N/A"}
                                </div>
                              </div>
                            </div>
                          </Table.Td>

                          <Table.Td>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2 inline-block">
                              <span className="font-medium text-blue-700 dark:text-blue-300">
                                {certificate?.certificateName}
                              </span>
                            </div>
                          </Table.Td>

                          <Table.Td>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              certificate?.certificateType === 'Academic' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : certificate?.certificateType === 'Sports'
                                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                : certificate?.certificateType === 'Leadership'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                            }`}>
                              {certificate?.certificateType}
                            </div>
                          </Table.Td>

                          <Table.Td>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 inline-block">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {new Date(certificate?.issueDate).toLocaleDateString()}
                              </span>
                            </div>
                          </Table.Td>
                          
                          
                          <Table.Td>
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              certificate?.status === "Active"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : certificate?.status === "Expired"
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                : certificate?.status === "Revoked"
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
                            }`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                certificate?.status === "Active"
                                  ? "bg-green-500"
                                  : certificate?.status === "Expired"
                                  ? "bg-red-500"
                                  : certificate?.status === "Revoked"
                                  ? "bg-orange-500"
                                  : "bg-gray-500"
                              }`}></div>
                              {certificate?.status || "Pending"}
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
                                  placement={shouldOpenUpward ? "top-end" : "bottom-end"}
                                >
                                  <Menu.Item
                                    onClick={(e: any) => {
                                      e.preventDefault();
                                      setSelectedCertificate(certificate);
                                      setCertificateViewDialog(true);
                                    }}
                                    className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                  >
                                    <Lucide icon="Eye" className="w-4 h-4 mr-3 text-blue-500" />
                                    View Certificate
                                  </Menu.Item>

                                  <Menu.Item
                                    onClick={(e: any) => {
                                      e.preventDefault();
                                      // Download certificate file
                                      if (certificate?.certificateFile?.filename) {
                                        window.open(`/api/certificates/file/${certificate.certificateFile.filename}`, '_blank');
                                      }
                                    }}
                                    className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                                  >
                                    <Lucide icon="Download" className="w-4 h-4 mr-3 text-green-500" />
                                    Download
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
                                      Edit Profile
                                    </Menu.Item>
                                  )}

                                  {hasPermission("enrollment", "promote") && (
                                    <Menu.Item
                                      className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                                      onClick={() => {
                                        setApproveTranfer({
                                          learners: [
                                            {
                                              id: learner._id,
                                              status: "P",
                                            },
                                          ],
                                          from_stream: learner.stream._id,
                                          from_grade: learner.grade._id,
                                          to_grade: learner.grade._id,
                                          from_session: learner.current_session,
                                          next_session: learner.current_session,
                                        });
                                        setApproveDialog(true);
                                      }}
                                    >
                                      <Lucide icon="ArrowLeftRight" className="w-4 h-4 mr-3 text-purple-500" />
                                      Transfer
                                    </Menu.Item>
                                  )}
                                  
                                  <Menu.Item
                                    className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200"
                                    onClick={() => {
                                      setApproveTranfer({
                                        learners: [
                                          {
                                            id: learner._id,
                                            status: "G",
                                          },
                                        ],
                                        from_stream: learner.stream._id,
                                        from_grade: learner.grade._id,
                                        exit: true,
                                      });
                                      setApproveDialog(true);
                                    }}
                                  >
                                    <Lucide icon="LogOut" className="w-4 h-4 mr-3 text-orange-500" />
                                    Exit Student
                                  </Menu.Item>
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
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    >
                                      <i className="icon-eye mr-2"></i> Delete
                                    </Menu.Item>
                                  )}
                                </Menu.Items>
                              </Menu>
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      )})}
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
                  {/* <div className="w-9 h-9 ">
                                <img
                                  src={c.IMG_URL + learner?.photo}
                                  alt="Learner"
                                  className="w-9 h-9 rounded-lg border shadow-md"
                                  onError={(e) =>
                                    (e.currentTarget.src = leanerImg)
                                  }
                                />
                              </div> */}
                  <img
                    src={c.IMG_URL + learner?.photo}
                    alt="photo"
                    className="rounded-full mx-auto"
                    style={{ width: "90%", height: "90%" }}
                    onError={(e) => (e.currentTarget.src = leanerImg)}
                  />
                  <h3 className="mt-3 text-lg font-semibold">
                    {`${learner.first_name} ${learner.surname}`}
                  </h3>
                </div>
              </div>
            </div>

            {/* User Information */}
            <div className="w-full md:w-3/4 ">
              <div className="bg-white shadow-md rounded-lg  m-4">
                <div className="p-6">
                  <h4 className="font-bold">Learner's Information</h4>

                  {/* Tabs for Basic Info and Guardians */}
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
                    {(is_admin() ||
                      hasPermission("parental-communication", "read")) && (
                      <>
                        <li className="mr-2 flex items-center">
                          <button
                            className={`inline-block py-2 px-4 ${
                              activeTab === "guardian1"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                            } font-semibold flex items-center`}
                            onClick={() => setActiveTab("guardian1")}
                          >
                            <span>Parent 1</span>
                            {learner?.guardian?.email &&
                              (hasPermission(
                                "parental-communication",
                                "read"
                              ) ||
                                is_admin()) && (
                                <div
                                  className="relative"
                                  onClick={() => openChat(learner?.guardian)}
                                >
                                  <MessageCircle className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-700" />
                                  {/* {unreadMessages?.guardian1 > 0 && (
                                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {unreadMessages?.guardian1}
                                  </span>
                                )} */}
                                </div>
                              )}
                          </button>
                        </li>
                        <li className="mr-2 flex items-center">
                          <button
                            className={`inline-block py-2 px-4 ${
                              activeTab === "guardian2"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600 hover:text-blue-600"
                            } font-semibold flex items-center`}
                            onClick={() => setActiveTab("guardian2")}
                          >
                            <span>Parent 2</span>
                            {learner?.guardian2?.email &&
                              (hasPermission(
                                "parental-communication",
                                "read"
                              ) ||
                                is_admin()) && (
                                <div
                                  className="relative"
                                  onClick={() => openChat(learner?.guardian2)}
                                >
                                  <MessageCircle className="w-6 h-6 text-blue-500 cursor-pointer hover:text-blue-700" />
                                  {/* {unreadMessages?.guardian2 > 0 && (
                                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {unreadMessages?.guardian2}
                                  </span>
                                )} */}
                                </div>
                              )}
                          </button>
                        </li>
                      </>
                    )}
                    <li className="mr-2">
                      <button
                        className={`inline-block py-2 px-4 ${
                          activeTab === "tab4"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                        } font-semibold`}
                        onClick={() => setActiveTab("tab4")}
                      >
                        Formative Assessments
                      </button>
                    </li>
                    <li className="mr-2">
                      <button
                        className={`inline-block py-2 px-4 ${
                          activeTab === "tab3"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                        } font-semibold`}
                        onClick={() => setActiveTab("tab3")}
                      >
                        Summative Assessments
                      </button>
                    </li>
                    <li className="mr-2">
                      <button
                        className={`inline-block py-2 px-4 ${
                          activeTab === "tab5"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                        } font-semibold`}
                        onClick={() => setActiveTab("tab5")}
                      >
                        History
                      </button>
                    </li>
                    <li className="mr-2">
                      <button
                        className={`inline-block py-2 px-4 ${
                          activeTab === "tab6"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-blue-600"
                        } font-semibold`}
                        onClick={() => setActiveTab("tab6")}
                      >
                        E-Portfolio
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
                              <td className="px-4 py-4 border-b border-gray-200">{`${learner?.first_name} ${learner.surname}`}</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                ADM NO
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.adm_no}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Gender
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.gender}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Class
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.grade.name}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Stream
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.stream?.name}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Year Admitted
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {new Date(learner?.createdAt).getFullYear()}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Email
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian?.email || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                NEMIS NO
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.nemis_no}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Current Session
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.current_session}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Status
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                <div
                                  className={
                                    learner?.status != "L"
                                      ? "flex items-center text-success"
                                      : "flex items-center text-danger"
                                  }
                                >
                                  {learner?.status == "L" ? "Left" : ""}
                                  {learner?.status == "G" ? "Left" : ""}
                                  {learner?.status == "P" ? "In Session" : ""}
                                </div>
                              </td>
                            </tr>
                            {learner?.status == "G" && (
                              <tr>
                                <td className="px-4 py-4 font-bold border-b border-gray-200">
                                  Left On
                                </td>
                                <td className="px-4 py-4 border-b border-gray-200">
                                  {formatDate(learner?.grad_date, "DD-MM-YYYY")}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Parent 1 Tab */}
                    {activeTab === "guardian1" && (
                      <div className="tab-pane">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold">Parent 1 Information</h4>
                        </div>
                        <table className="min-w-full border border-gray-200 mt-2">
                          <tbody>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Name
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian?.first_name}{" "}
                                {learner?.guardian?.surname}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Relationship
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian_relationship}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Contact
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian?.phone || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Email
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian?.email || "N/A"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Parent 2 Tab */}
                    {activeTab === "guardian2" && (
                      <div className="tab-pane">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold">Parent 2 Information</h4>
                        </div>
                        <table className="min-w-full border border-gray-200 mt-2">
                          <tbody>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Name
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian2?.first_name}{" "}
                                {learner?.guardian2?.surname || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Relationship
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian2_relationship || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Contact
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian2?.phone || "N/A"}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-4 font-bold border-b border-gray-200">
                                Email
                              </td>
                              <td className="px-4 py-4 border-b border-gray-200">
                                {learner?.guardian2?.email || "N/A"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Tab 3 */}
                    {activeTab === "tab3" && (
                      <div className="tab-pane">
                        <div className=" box mb-5 mt-5 items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                          <h2 className="mr-auto text-base font-medium border-b p-2">
                            Learner Report
                          </h2>
                          <div className="grid grid-cols-6 gap-2 mt-10">
                            <div className="col-span-12 sm:col-span-2">
                              {/* {JSON.stringify(academicYear)} */}
                              <FormLabel htmlFor="modal-form-6">
                                Grade{" "}
                              </FormLabel>
                              <TomSelect
                                {...register("grade")}
                                value={selectedAcademicYear}
                                name="grade"
                                onChange={(event: any) => {
                                  setSelectedAcademicYear(event);
                                }}
                              >
                                <option value={""}>Select Grade</option>
                                {learner_grades?.map((grade: any, key: any) => (
                                  <option key={key} value={grade.to_session}>
                                    {grade?.to_grade?.name}-
                                    {grade?.to_stream?.name}- {grade.to_session}
                                    {/* {grade?.to_stream?.name}- {grade.to_session} */}
                                  </option>
                                ))}
                              </TomSelect>
                              {errors.term && (
                                <div className="mt-2 text-danger">
                                  {typeof errors.term.message === "string" &&
                                    errors.term.message}
                                </div>
                              )}
                            </div>
                            <div className="col-span-12 sm:col-span-2">
                              <FormLabel htmlFor="modal-form-6">Term</FormLabel>
                              <TomSelect
                                {...register("term")}
                                value={selectedTerm}
                                name="term"
                                onChange={(event: any) =>
                                  setSelectedTerm(event)
                                }
                              >
                                <option value={""}>Select Term</option>
                                {terms.map((term: any, key) => (
                                  <option key={key} value={term._id}>
                                    {term.name}
                                  </option>
                                ))}
                              </TomSelect>
                              {errors.term && (
                                <div className="mt-2 text-danger">
                                  {typeof errors.term.message === "string" &&
                                    errors.term.message}
                                </div>
                              )}
                            </div>
                            <div className="col-span-12 sm:col-span-2">
                              <FormLabel htmlFor="modal-form-6">Test</FormLabel>
                              <TomSelect
                                {...register("test")}
                                value={test}
                                name="test"
                                onChange={(event: any) => setTest(event)}
                              >
                                <option value={""}>Select Test</option>
                                {tests.map((test: any, key: any) => (
                                  <option key={key} value={test._id}>
                                    {test.name}- {test?.type}
                                  </option>
                                ))}
                              </TomSelect>
                              {errors.term && (
                                <div className="mt-2 text-danger">
                                  {typeof errors.term.message === "string" &&
                                    errors.term.message}
                                </div>
                              )}
                            </div>

                            {/* {substrands.map((substrand: any, key: any) => (
                <span>{substrand.name}</span>
              ))} */}
                          </div>
                          <div className="p-5 mt-3  text-right">
                            <Button
                              onClick={() => generateAssessmentSummative()}
                              variant="primary"
                              type="button"
                              className="w-50 text-white"
                            >
                              Generate Report
                              {loading && (
                                <LoadingIcon
                                  icon="spinning-circles"
                                  color="white"
                                  className="w-4 h-4 ml-2"
                                />
                              )}
                            </Button>
                          </div>
                        </div>
                        {/* You can include more fields or tables here as needed */}
                      </div>
                    )}
                    {activeTab === "tab4" && (
                      <div className="tab-pane">
                        <div className=" box mb-5 mt-5 items-center p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                          <h2 className="mr-auto text-base font-medium border-b p-2">
                            Learner Report
                          </h2>
                          <div className="grid grid-cols-6 gap-2 mt-10">
                            <div className="col-span-12 sm:col-span-2">
                              {/* {JSON.stringify(academicYear)} */}
                              <FormLabel htmlFor="modal-form-6">
                                Grade{" "}
                              </FormLabel>
                              <TomSelect
                                {...register("grade")}
                                value={selectedAcademicYear}
                                name="grade"
                                onChange={(event: any) => {
                                  setSelectedAcademicYear(event);
                                }}
                              >
                                <option value={""}>Select Grade</option>
                                {learner_grades?.map((grade: any, key: any) => (
                                  <option key={key} value={grade.to_session}>
                                    {grade?.to_grade?.name}-
                                    {grade?.to_stream?.name}- {grade.to_session}
                                  </option>
                                ))}
                              </TomSelect>
                              {errors.term && (
                                <div className="mt-2 text-danger">
                                  {typeof errors.term.message === "string" &&
                                    errors.term.message}
                                </div>
                              )}
                            </div>
                            <div className="col-span-12 sm:col-span-2">
                              <FormLabel htmlFor="modal-form-6">Term</FormLabel>
                              <TomSelect
                                {...register("term")}
                                value={selectedTerm}
                                name="term"
                                onChange={(event: any) =>
                                  setSelectedTerm(event)
                                }
                              >
                                <option value={""}>Select Term</option>
                                {terms.map((term: any, key) => (
                                  <option key={key} value={term._id}>
                                    {term.name}
                                  </option>
                                ))}
                              </TomSelect>
                              {errors.term && (
                                <div className="mt-2 text-danger">
                                  {typeof errors.term.message === "string" &&
                                    errors.term.message}
                                </div>
                              )}
                            </div>

                            <div className="col-span-12 sm:col-span-2">
                              <FormLabel htmlFor="modal-form-6">
                                Learning Area
                              </FormLabel>
                              <TomSelect
                                {...register("learning_area")}
                                value={selectedLeaningArea}
                                name="learning_area"
                                onChange={(event: any) =>
                                  setSelectedLearningArea(event)
                                }
                              >
                                <option>Select Learning Area</option>
                                {learningAreas?.map(
                                  (filteredArea: any, key) => (
                                    <option key={key} value={filteredArea?._id}>
                                      {filteredArea.name}
                                    </option>
                                  )
                                )}
                              </TomSelect>
                              {errors.learning_area && (
                                <div className="mt-2 text-danger">
                                  {typeof errors.learning_area.message ===
                                    "string" && errors.learning_area.message}
                                </div>
                              )}
                            </div>

                            {/* {substrands.map((substrand: any, key: any) => (
                <span>{substrand.name}</span>
              ))} */}
                          </div>
                          <div className="px-5  mt-5 text-right">
                            <Button
                              onClick={() => generateAssessment()}
                              variant="primary"
                              type="button"
                              className="w-50 text-white"
                            >
                              Generate Report
                              {loading && (
                                <LoadingIcon
                                  icon="spinning-circles"
                                  color="white"
                                  className="w-4 h-4 ml-2"
                                />
                              )}
                            </Button>
                          </div>
                        </div>
                        {/* You can include more fields or tables here as needed */}
                      </div>
                    )}
                    {activeTab === "tab5" && (
                      <div className="tab-pane">
                        <h4 className="font-bold">Additional Information</h4>
                        <p>Comming soon...2</p>
                        {/* You can include more fields or tables here as needed */}
                      </div>
                    )}
                    {activeTab === "tab6" && (
                      <div className="tab-pane">
                        <h4 className="font-bold">Information</h4>
                        <p>Comming soon...2</p>
                        {/* You can include more fields or tables here as needed */}
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

      {/* Certificates Dialog */}
      <Dialog open={certificatesDialog} onClose={() => setCertificatesDialog(false)}>
        <Dialog.Panel className="max-w-4xl mx-auto">
          <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Certificates - {selectedStudentForCertificates?.first_name} {selectedStudentForCertificates?.last_name}
          </Dialog.Title>
          
          <div className="max-h-96 overflow-y-auto">
            {selectedStudentForCertificates && studentCertificates[selectedStudentForCertificates._id] && 
             studentCertificates[selectedStudentForCertificates._id].length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studentCertificates[selectedStudentForCertificates._id].map((certificate: any, index: number) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {certificate.certificateName}
                        </h3>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Type:</span> {certificate.certificateType}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Issue Date:</span> {new Date(certificate.issueDate).toLocaleDateString()}
                          </p>
                          {certificate.expiryDate && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Expiry Date:</span> {new Date(certificate.expiryDate).toLocaleDateString()}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Issued By:</span> {certificate.issuedBy}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Status:</span> 
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                              certificate.status === 'Active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : certificate.status === 'Expired'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                            }`}>
                              {certificate.status}
                            </span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Verified:</span> 
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                              certificate.isVerified 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                              {certificate.isVerified ? 'Yes' : 'No'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            if (certificate.certificateFile?.filename) {
                              // Open certificate file in new tab
                              window.open(`/api/certificates/file/${certificate.certificateFile.filename}`, '_blank');
                            }
                          }}
                          className="text-xs"
                        >
                          <Lucide icon="Eye" className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Lucide icon="Award" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Certificates</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This student doesn't have any certificates yet.
                </p>
              </div>
            )}
          </div>

          <Dialog.Footer className="mt-6">
            <Button
              variant="outline-secondary"
              onClick={() => setCertificatesDialog(false)}
            >
              Close
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>

      {/* Certificate View Dialog */}
      <Dialog open={certificateViewDialog} onClose={() => setCertificateViewDialog(false)}>
        <Dialog.Panel className="max-w-4xl mx-auto">
          <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Lucide icon="Award" className="w-6 h-6 mr-3 text-blue-600" />
            Certificate Details
          </Dialog.Title>
          
          {selectedCertificate && (
            <div className="space-y-6">
              {/* Certificate Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedCertificate.certificateName}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCertificate.certificateType === 'Academic' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : selectedCertificate.certificateType === 'Sports'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                          : selectedCertificate.certificateType === 'Leadership'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                      }`}>
                        {selectedCertificate.certificateType}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedCertificate.status === "Active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : selectedCertificate.status === "Expired"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          : selectedCertificate.status === "Revoked"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          selectedCertificate.status === "Active"
                            ? "bg-green-500"
                            : selectedCertificate.status === "Expired"
                            ? "bg-red-500"
                            : selectedCertificate.status === "Revoked"
                            ? "bg-orange-500"
                            : "bg-gray-500"
                        }`}></div>
                        {selectedCertificate.status || "Pending"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Certificate ID</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">
                      {selectedCertificate._id?.slice(-8) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Lucide icon="User" className="w-5 h-5 mr-2 text-blue-600" />
                  Student Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Student Name</label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedCertificate.studentName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Admission Number</label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedCertificate.studentAdmNo || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Student ID</label>
                    <p className="text-gray-900 dark:text-white font-mono">
                      {selectedCertificate.studentId || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Certificate Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Lucide icon="FileText" className="w-5 h-5 mr-2 text-blue-600" />
                  Certificate Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Issue Date</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedCertificate.issueDate ? new Date(selectedCertificate.issueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiry Date</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedCertificate.expiryDate ? new Date(selectedCertificate.expiryDate).toLocaleDateString() : 'No expiry'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Issued By</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedCertificate.issuedBy || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Issuer Title</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedCertificate.issuerTitle || 'N/A'}
                    </p>
                  </div>
                  {selectedCertificate.description && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</label>
                      <p className="text-gray-900 dark:text-white">
                        {selectedCertificate.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Details */}
              {(selectedCertificate.academicYear || selectedCertificate.term || selectedCertificate.grade) && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Lucide icon="GraduationCap" className="w-5 h-5 mr-2 text-blue-600" />
                    Academic Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedCertificate.academicYear && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Academic Year</label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedCertificate.academicYear}
                        </p>
                      </div>
                    )}
                    {selectedCertificate.term && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Term</label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedCertificate.term}
                        </p>
                      </div>
                    )}
                    {selectedCertificate.grade && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Grade</label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedCertificate.grade}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* File Information */}
              {selectedCertificate.certificateFile && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Lucide icon="File" className="w-5 h-5 mr-2 text-blue-600" />
                    Certificate File
                  </h4>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <Lucide icon="FileText" className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedCertificate.certificateFile.originalName || 'Certificate File'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {(selectedCertificate.certificateFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline-primary"
                      onClick={() => {
                        if (selectedCertificate.certificateFile?.filename) {
                          window.open(`/api/certificates/file/${selectedCertificate.certificateFile.filename}`, '_blank');
                        }
                      }}
                      className="flex items-center"
                    >
                      <Lucide icon="Download" className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              )}

              {/* Verification Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Lucide icon="Shield" className="w-5 h-5 mr-2 text-blue-600" />
                  Verification Status
                </h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      selectedCertificate.isVerified ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {selectedCertificate.isVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                  {selectedCertificate.verifiedAt && (
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Verified on {new Date(selectedCertificate.verifiedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-gray-600 dark:text-gray-400">Created</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedCertificate.createdAt ? new Date(selectedCertificate.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-600 dark:text-gray-400">Last Updated</label>
                    <p className="text-gray-900 dark:text-white">
                      {selectedCertificate.updatedAt ? new Date(selectedCertificate.updatedAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Dialog.Footer className="mt-6">
            <Button
              variant="outline-secondary"
              onClick={() => setCertificateViewDialog(false)}
            >
              Close
            </Button>
            {selectedCertificate?.certificateFile?.filename && (
              <Button
                variant="primary"
                onClick={() => {
                  window.open(`/api/certificates/file/${selectedCertificate.certificateFile.filename}`, '_blank');
                }}
                className="ml-3"
              >
                <Lucide icon="Download" className="w-4 h-4 mr-2" />
                Download Certificate
              </Button>
            )}
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

export default Main;
