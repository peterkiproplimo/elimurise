import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import PassportUpload from "./profilephoto";
import { X, Paperclip, Send } from "lucide-react"; // Using Lucide icons for a modern look
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

const socket: Socket = io(new URL(import.meta.env.VITE_API_ENDPOINT).origin, {
  transports: ["websocket"],
  auth: {
    token: `Bearer ${user?.token}`, // Use the token from localStorage
  },
});
function Main() {
  // const [confirmDelete, setConfirmDelete] = useState(false);
  const { hasPermission } = useAuth();

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
  // const handleFileChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files ? Array.from(e.target.files) : [];
  //   setAttachments((prev) => [...prev, ...files]);
  //   if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
  // };
  const handleFileChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setAttachments((prev) => [...prev, ...files]);
  };

  // const fetchMessages = async () => {
  //   setLoading(true);
  //   try {
  //     console.log(selectedParent);
  //     const response = await ApiService.getMessage({
  //       parent: selectedParent._id,
  //     });
  //     console.log(response);
  //     setMessages(response.data);
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //     // setMessage("Failed to load messages");
  //     // notify.current?.showToast();
  //   }
  // };

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
      first_name: yup.string().required("First name is required"),
      gender: yup.string().required("Gender  is required"),
      // surname: yup.string().required("Surname is required"),
      adm_no: yup.string().required("Adm No is required"),
      grade: yup.string().required("Grade is required"),
      stream: yup.string().required("Stream is required"),
      guardian_first_name: yup.string().required("First name is required"),
      // guardian_last_name: yup.string().required("Last name is required"),
      // guardian_id_no: yup.string().required("ID Number is required"),
      // guardian_email: yup.string().required("Email is required"),
      // guardian_phone: yup.string().required("Phone Number is required"),
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
  // const onSubmitMesage = async (data: any) => {
  //   setLoading(true);
  //   try {
  //     const newMessage = {
  //       sender: user._id,
  //       senderModel: "Parent",
  //       receiver: selectedParent?._id, // Use selected parent
  //       receiverModel: "Parent",
  //       message: data,
  //     };
  //     const response = await ApiService.sendMessage(newMessage);

  //     // socket.emit("sendMessage", newMessage);
  //     fetchMessages();

  //     reset();
  //     setLoading(false);
  //     // setMessage("Message sent successfully");
  //     notify.current?.showToast();
  //   } catch (error) {
  //     setLoading(false);
  //     setMessage("Failed to send message");
  //     notify.current?.showToast();
  //   }
  // };
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
    // getParents();
  }, []);
  useEffect(() => {
    getStreams();
  }, [grade]);
  useEffect(() => {
    getStudents();
  }, [search, page, limit, grade, stream, sortField, sortOrder]);

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
      const response = await ApiService.getLearnersEnroll(
        {
          page,
          search,
          limit,
          grade,
          stream,
          sortField,
          sortOrder, // Include sorting in API request
          status: ["D"], // Filter for "Left" or "Exited" learners
        },
        strandFilter
      );
      const pagination = response.pagination;
      setPagination({
        current_page: Number(pagination.current_page),
        total: pagination.total,
        total_pages: pagination.total_pages,
        per_page: Number(pagination.per_page),
      });
      setLearners(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      isLoading(false);
    }
  };
  const handleSort = (field: string) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
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
      setMessage("Learner activated successfully.");
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
              {isEditMode ? "Edit Learner" : "New Learner"}
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

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                type="button"
                className={`flex-1 py-3 px-4 text-center font-semibold text-sm transition-all ${
                  activeTabLearner === "learner"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 hover:text-indigo-500"
                }`}
                onClick={() => setActiveTabLearner("learner")}
              >
                Learner Details
              </button>
              <button
                type="button"
                className={`flex-1 py-3 px-4 text-center font-semibold text-sm transition-all ${
                  activeTabLearner === "parent1"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 hover:text-indigo-500"
                }`}
                onClick={() => setActiveTabLearner("parent1")}
              >
                Parent 1 Details
              </button>
              <button
                type="button"
                className={`flex-1 py-3 px-4 text-center font-semibold text-sm transition-all ${
                  activeTabLearner === "parent2"
                    ? "border-b-2 border-indigo-600 text-indigo-600"
                    : "text-gray-500 hover:text-indigo-500"
                }`}
                onClick={() => setActiveTabLearner("parent2")}
              >
                Parent 2 Details
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              {activeTabLearner === "learner" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("first_name")}
                      type="text"
                      name="first_name"
                      className={`mt-1 w-full rounded-lg border ${
                        errors.first_name ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="First name"
                    />
                    {errors.first_name && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.first_name.message === "string" &&
                          errors.first_name.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Middle Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("last_name")}
                      type="text"
                      name="last_name"
                      className={`mt-1 w-full rounded-lg border ${
                        errors.last_name ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Last name"
                    />
                    {errors.last_name && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.last_name.message === "string" &&
                          errors.last_name.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Surname
                    </FormLabel>
                    <FormInput
                      {...register("surname")}
                      type="text"
                      name="surname"
                      className={`mt-1 w-full rounded-lg border ${
                        errors.surname ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Surname"
                    />
                    {errors.surname && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.surname.message === "string" &&
                          errors.surname.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <FormLabel
                      className="text-sm font-medium text-gray-700"
                      htmlFor="modal-form-6"
                    >
                      Gender
                    </FormLabel>
                    <FormSelect
                      {...register("gender")}
                      name="gender"
                      className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </FormSelect>
                    {errors.guardian2_relationship && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.guardian2_relationship.message ===
                          "string" && errors.guardian2_relationship.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Admission Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("adm_no")}
                      type="text"
                      name="adm_no"
                      className={`mt-1 w-full rounded-lg border ${
                        errors.adm_no ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Admission no"
                    />
                    {errors.adm_no && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.adm_no.message === "string" &&
                          errors.adm_no.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Nemis No
                    </FormLabel>
                    <FormInput
                      {...register("nemis_no")}
                      type="number"
                      name="nemis_no"
                      className={`mt-1 w-full rounded-lg border ${
                        errors.nemis_no ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Nemis no"
                    />
                    {errors.nemis_no && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.nemis_no.message === "string" &&
                          errors.nemis_no.message}
                      </div>
                    )}
                  </div>
                  {!isEditMode && (
                    <>
                      <div>
                        <FormLabel
                          className="text-sm font-medium text-gray-700"
                          htmlFor="modal-form-6"
                        >
                          Grade <span className="text-red-500">*</span>
                        </FormLabel>
                        <TomSelect
                          name="grade"
                          value={grade}
                          className={`mt-1 w-full rounded-lg ${
                            errors.grade ? "border-red-500" : "border-gray-300"
                          }`}
                          onChange={(event: any) => {
                            reset({ ...getValues(), grade: event });
                            setGrade(event);
                          }}
                          disabled={isEditMode}
                        >
                          <option value="" selected>
                            Select Grade
                          </option>
                          {grades.map((grade: any, key) => (
                            <option key={key} value={grade._id}>
                              {grade.name}
                            </option>
                          ))}
                        </TomSelect>
                        {errors.grade && (
                          <div className="mt-2 text-red-500 text-sm">
                            {typeof errors.grade.message === "string" &&
                              errors.grade.message}
                          </div>
                        )}
                      </div>
                      <div>
                        <FormLabel
                          className="text-sm font-medium text-gray-700"
                          htmlFor="modal-form-6"
                        >
                          Stream <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormSelect
                          {...register("stream")}
                          name="stream"
                          className={`mt-1 w-full rounded-lg border ${
                            errors.stream ? "border-red-500" : "border-gray-300"
                          } focus:ring-2 focus:ring-indigo-500 transition-all`}
                          disabled={isEditMode}
                        >
                          <option value="">Select Stream</option>
                          {streams.map((stream: any, key) => (
                            <option key={key} value={stream._id}>
                              {stream.name}
                            </option>
                          ))}
                        </FormSelect>
                        {errors.stream && (
                          <div className="mt-2 text-red-500 text-sm">
                            {typeof errors.stream.message === "string" &&
                              errors.stream.message}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  <div>
                    <FormLabel
                      className="text-sm font-medium text-gray-700"
                      htmlFor="modal-form-6"
                    >
                      Passport Photo
                    </FormLabel>
                    <PassportUpload
                      name="image"
                      register={register}
                      errors={errors}
                      initialImageUrl={c.IMG_URL + photo}
                      // className="mt-1 w-full"
                    />
                  </div>
                </div>
              )}

              {activeTabLearner === "parent1" && (
                <>
                  <div className="mb-6">
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Search Parent <span className="text-red-500">*</span>
                    </FormLabel>
                    <TomSelect
                      {...register("guardian_id_no")}
                      name="guardian_id_no"
                      value={guardianIdNo}
                      onChange={(event: any) => {
                        reset({ ...getValues(), parent: event });
                        setGuardianIdNo(event);
                        handleGuardianIdNoBlur();
                      }}
                      className={`mt-1 w-full rounded-lg ${
                        errors.guardian_id_no
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm`}
                      options={{
                        load: async (query: any, callback: any) => {
                          const parents = await getParents(query);
                          const options = parents
                            .filter(
                              (parent: any) => parent.email !== guardianIdNo2
                            )
                            .map((parent: any) => ({
                              value: parent.email,
                              text: `${parent.first_name} ${parent.last_name} - ${parent.email}`,
                            }));
                          callback(options);
                        },
                        placeholder: "Search for a parent by email...",
                        loadThrottle: 300,
                        maxOptions: 50,
                      }}
                    >
                      <option value="">Select Email</option>
                    </TomSelect>
                    <FormInput
                      {...register("guardian")}
                      type="hidden"
                      name="guardian"
                      className={
                        errors.guardian_id_no
                          ? "border-red-500"
                          : "border-gray-300"
                      }
                      placeholder="Parent ID number"
                    />
                    {errors.guardian_id_no && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.guardian_id_no.message === "string" &&
                          errors.guardian_id_no.message}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <FormLabel
                        className="text-sm font-medium text-gray-700"
                        htmlFor="modal-form-6"
                      >
                        Relationship
                      </FormLabel>
                      <FormSelect
                        {...register("guardian_relationship")}
                        name="guardian_relationship"
                        className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                      >
                        <option value="">Select Relationship</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                      </FormSelect>
                      {errors.guardian_relationship && (
                        <div className="mt-2 text-red-500 text-sm">
                          {typeof errors.guardian_relationship.message ===
                            "string" && errors.guardian_relationship.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Parent First Name{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormInput
                        {...register("guardian_first_name")}
                        type="text"
                        name="guardian_first_name"
                        className={`mt-1 w-full rounded-lg border ${
                          errors.guardian_first_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-gray-100`}
                        placeholder="Parent First name"
                        disabled
                      />
                      {errors.guardian_first_name && (
                        <div className="mt-2 text-red-500 text-sm">
                          {typeof errors.guardian_first_name.message ===
                            "string" && errors.guardian_first_name.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Parent Surname
                      </FormLabel>
                      <FormInput
                        {...register("guardian_surname")}
                        type="text"
                        name="guardian_surname"
                        className={`mt-1 w-full rounded-lg border ${
                          errors.guardian_surname
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-gray-100`}
                        placeholder="Parent surname"
                        disabled
                      />
                      {errors.guardian_surname && (
                        <div className="mt-2 text-red-500 text-sm">
                          {typeof errors.guardian_surname.message ===
                            "string" && errors.guardian_surname.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Parent Last Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormInput
                        {...register("guardian_last_name")}
                        type="text"
                        name="guardian_last_name"
                        className={`mt-1 w-full rounded-lg border ${
                          errors.guardian_last_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-gray-100`}
                        placeholder="Parent Last name"
                        disabled
                      />
                      {errors.guardian_last_name && (
                        <div className="mt-2 text-red-500 text-sm">
                          {typeof errors.guardian_last_name.message ===
                            "string" && errors.guardian_last_name.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Parent Email
                      </FormLabel>
                      <FormInput
                        {...register("guardian_email")}
                        type="text"
                        name="guardian_email"
                        className={`mt-1 w-full rounded-lg border ${
                          errors.guardian_email
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-gray-100`}
                        placeholder="Parent email"
                        disabled
                      />
                      {errors.guardian_email && (
                        <div className="mt-2 text-red-500 text-sm">
                          {typeof errors.guardian_email.message === "string" &&
                            errors.guardian_email.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Parent Phone
                      </FormLabel>
                      <FormInput
                        {...register("guardian_phone")}
                        type="text"
                        name="guardian_phone"
                        className={`mt-1 w-full rounded-lg border ${
                          errors.guardian_phone
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-gray-100`}
                        placeholder="Parent phone"
                        disabled
                      />
                      {errors.guardian_phone && (
                        <div className="mt-2 text-red-500 text-sm">
                          {typeof errors.guardian_phone.message === "string" &&
                            errors.guardian_phone.message}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTabLearner === "parent2" && (
                <>
                  <div className="flex items-center mb-6">
                    <div className="flex-1">
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Search Parent 2 <span className="text-red-500">*</span>
                      </FormLabel>
                      <TomSelect
                        {...register("guardian_id_no")}
                        name="guardian_id_no"
                        value={guardianIdNo}
                        onChange={(event: any) => {
                          reset({ ...getValues(), guardian2_id_no: event });
                          setGuardianIdNo2(event);
                          handleGuardianIdNoBlur2();
                        }}
                        className={`mt-1 w-full rounded-lg ${
                          errors.guardian_id_no
                            ? "border-red-500"
                            : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all bg-white shadow-sm`}
                        options={{
                          load: async (query: any, callback: any) => {
                            const parents = await getParents(query);
                            const options = parents
                              .filter(
                                (parent: any) => parent.email !== guardianIdNo
                              )
                              .map((parent: any) => ({
                                value: parent.email,
                                text: `${parent.first_name} ${parent.last_name} - ${parent.email}`,
                              }));
                            callback(options);
                          },
                          placeholder: "Search for a parent by email...",
                          loadThrottle: 300,
                          maxOptions: 50,
                        }}
                      >
                        <option value="">Select Email</option>
                      </TomSelect>
                      <FormInput
                        {...register("guardian2")}
                        type="hidden"
                        name="guardian2"
                        className={
                          errors.guardian2_id_no
                            ? "border-red-500"
                            : "border-gray-300"
                        }
                        placeholder="Second Parent ID number"
                      />
                      {errors.guardian2_id_no && (
                        <div className="mt-2 text-red-500 text-sm">
                          {typeof errors.guardian2_id_no.message === "string" &&
                            errors.guardian2_id_no.message}
                        </div>
                      )}
                    </div>
                    <Lucide
                      icon="Trash"
                      className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer transition-colors ml-4 mt-6"
                      onClick={handleToggleParent2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <FormLabel
                        className="text-sm font-medium text-gray-700"
                        htmlFor="modal-form-6"
                      >
                        Relationship
                      </FormLabel>
                      <FormSelect
                        {...register("guardian2_relationship")}
                        name="guardian2_relationship"
                        className="mt-1 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                      >
                        <option value="">Select Relationship</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                      </FormSelect>
                      {errors.guardian2_relationship && (
                        <div className="mt-2 text-red-500 text-sm">
                          {typeof errors.guardian2_relationship.message ===
                            "string" && errors.guardian2_relationship.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Parent First Name{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormInput
                        {...register("guardian2_first_name")}
                        type="text"
                        name="guardian2_first_name"
                        className={`mt-1 w-full rounded-lg border ${
                          errors.guardian2_first_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-gray-100`}
                        placeholder="Second Parent First name"
                        disabled
                      />
                      {errors.guardian2_first_name && (
                        <div className="mt-2 text-red-500 text-sm">
                          {typeof errors.guardian2_first_name.message ===
                            "string" && errors.guardian2_first_name.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Parent Surname
                      </FormLabel>
                      <FormInput
                        {...register("guardian2_surname")}
                        type="text"
                        name="guardian2_surname"
                        className={`mt-1 w-full rounded-lg border ${
                          errors.guardian2_surname
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-gray-100`}
                        placeholder="Second Parent surname"
                        disabled
                      />
                      {errors.guardian2_surname && (
                        <div className="mt-2 text-red-500 text-sm">
                          {typeof errors.guardian2_surname.message ===
                            "string" && errors.guardian2_surname.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Parent Last Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormInput
                        {...register("guardian2_last_name")}
                        type="text"
                        name="guardian2_last_name"
                        className={`mt-1 w-full rounded-lg border ${
                          errors.guardian2_last_name
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-gray-100`}
                        placeholder="Second Parent Last name"
                        disabled
                      />
                      {errors.guardian2_last_name && (
                        <div className="mt-2 text-red-500 text-sm">
                          {typeof errors.guardian2_last_name.message ===
                            "string" && errors.guardian2_last_name.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Parent Email
                      </FormLabel>
                      <FormInput
                        {...register("guardian2_email")}
                        type="email"
                        name="guardian2_email"
                        className={`mt-1 w-full rounded-lg border ${
                          errors.guardian2_email
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-gray-100`}
                        placeholder="Second Parent email"
                        disabled
                      />
                      {errors.guardian2_email && (
                        <div className="mt-2 text-red-500 text-sm">
                          {typeof errors.guardian2_email.message === "string" &&
                            errors.guardian2_email.message}
                        </div>
                      )}
                    </div>
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Parent Phone
                      </FormLabel>
                      <FormInput
                        {...register("guardian2_phone")}
                        type="text"
                        name="guardian2_phone"
                        className={`mt-1 w-full rounded-lg border ${
                          errors.guardian2_phone
                            ? "border-red-500"
                            : "border-gray-300"
                        } bg-gray-100`}
                        placeholder="Second Parent phone"
                        disabled
                      />
                      {errors.guardian2_phone && (
                        <div className="mt-2 text-red-500 text-sm">
                          {typeof errors.guardian2_phone.message === "string" &&
                            errors.guardian2_phone.message}
                        </div>
                      )}
                    </div>
                  </div>
                </>
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
          <h2 className="mt-1 text-lg font-medium ">Learners</h2>
          {/* {message && success && (
            <Alert
              variant="soft-success"
              className="flex items-center mb-2"
              dismissTimeout={3000}
              role="alert"
            >
              <svg
                className="flex-shrink-0 inline w-4 h-4 me-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
              {message}
            </Alert>

          )} */}

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
                  New Learner
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
            <div className="flex flex-wrap items-center col-span-12 mr-3  xl:flex-nowrap">
              <TomSelect
                value={grade}
                className="relative w-56 text-slate-500 "
                onChange={(event: any) => {
                  reset({ ...getValues(), grade: event, stream: "" });
                  setStream("");
                  // reset({ ...getValues(), grade: event });

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
                {...register("stream")}
                name="stream"
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
            <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
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
            </div>
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
                  <Table className="border-spacing-y-[3px] border-separate mt-2">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="border-b-0 whitespace-nowrap w-10">
                          No.
                        </Table.Th>

                        <Table.Th
                          className="border-b-0 whitespace-nowrap w-24 cursor-pointer"
                          onClick={() => handleSort("first_name")}
                        >
                          Name{" "}
                          {sortField === "first_name"
                            ? sortOrder === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </Table.Th>

                        <Table.Th
                          className="border-b-0 whitespace-nowrap w-20 cursor-pointer"
                          onClick={() => handleSort("adm_no")}
                        >
                          Adm No{" "}
                          {sortField === "adm_no"
                            ? sortOrder === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </Table.Th>

                        {/* <Table.Th
                          className="border-b-0 whitespace-nowrap w-20 cursor-pointer"
                          onClick={() => handleSort("nemis_no")}
                        >
                          Nemis{" "}
                          {sortField === "nemis_no"
                            ? sortOrder === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </Table.Th> */}

                        <Table.Th
                          className="border-b-0 whitespace-nowrap w-20 cursor-pointer"
                          onClick={() => handleSort("grade")}
                        >
                          Grade{" "}
                          {sortField === "grade"
                            ? sortOrder === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </Table.Th>

                        <Table.Th
                          className="border-b-0 whitespace-nowrap w-20 cursor-pointer"
                          onClick={() => handleSort("stream")}
                        >
                          Stream{" "}
                          {sortField === "stream"
                            ? sortOrder === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </Table.Th>

                        <Table.Th
                          className="border-b-0 whitespace-nowrap w-24 cursor-pointer"
                          onClick={() => handleSort("session")}
                        >
                          Session{" "}
                          {sortField === "session"
                            ? sortOrder === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </Table.Th>

                        <Table.Th
                          className="border-b-0 whitespace-nowrap w-24 cursor-pointer"
                          onClick={() => handleSort("status")}
                        >
                          Status{" "}
                          {sortField === "status"
                            ? sortOrder === "asc"
                              ? "▲"
                              : "▼"
                            : ""}
                        </Table.Th>

                        <Table.Th className="border-b-0 whitespace-nowrap text-center w-20">
                          Actions
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {learners.map((learner: any, key) => (
                        <Table.Tr key={key} className="">
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-10">
                            <span className="font-medium whitespace-nowrap">
                              {limit * (page - 1) + key + 1}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <div className="flex items-center">
                              <div className="w-9 h-9 ">
                                <img
                                  src={c.IMG_URL + learner?.photo}
                                  alt="Learner"
                                  className="w-9 h-9 rounded-lg border shadow-md"
                                  onError={(e) =>
                                    (e.currentTarget.src = leanerImg)
                                  }
                                />
                              </div>
                              <div className="ml-4">
                                <a
                                  href="#"
                                  onClick={() => profileRecord(learner)}
                                  className="font-medium whitespace-nowrap"
                                >
                                  {learner?.first_name && learner?.first_name}
                                  {" " +
                                    learner?.surname +
                                    " " +
                                    learner?.last_name}
                                </a>
                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                  {learner?.stream?.grade?.name}{" "}
                                  {learner?.stream?.name}
                                </div>
                              </div>
                            </div>
                          </Table.Td>

                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.adm_no}
                            </span>
                          </Table.Td>
                          {/* <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.assessment_no ?? "N/A"}
                            </span>
                          </Table.Td> */}
                          {/* <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.nemis_no}
                            </span>
                          </Table.Td> */}
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.grade?.name}{" "}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.stream?.name}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <span className="font-medium whitespace-nowrap">
                              {learner?.current_session}
                            </span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-20">
                            <div
                              className={
                                learner?.status == "L"
                                  ? "flex items-center text-primary"
                                  : learner?.status == "D"
                                  ? "flex items-center text-danger"
                                  : "flex items-center text-success"
                              }
                            >
                              {learner?.status == "L" ? "Left" : ""}
                              {learner?.status == "G" ? "Left" : ""}
                              {learner?.status == "P" ? "In Session" : ""}
                              {learner?.status == "D" ? "Deactivated" : ""}
                            </div>
                          </Table.Td>

                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0  before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center justify-center">
                              <Menu className="inline-block mb-2 mr-1 box">
                                <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
                                  <Lucide
                                    icon="AlignJustify"
                                    className="w-4 h-4 mr-1"
                                  />{" "}
                                </Menu.Button>
                                <Menu.Items
                                  className="w-40"
                                  placement="bottom-end"
                                >
                                  <Menu.Item
                                    onClick={(e: any) => {
                                      e.preventDefault();
                                      profileRecord(learner);
                                    }}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                  >
                                    <i className="icon-eye mr-2"></i> View
                                    Profile
                                  </Menu.Item>

                                  {hasPermission("learners", "update") && (
                                    <Menu.Item
                                      onClick={(e: any) => {
                                        e.preventDefault();
                                        editRecord(learner);
                                      }}
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    >
                                      <i className="icon-eye mr-2"></i> Edit
                                      Profile
                                    </Menu.Item>
                                  )}

                                  {hasPermission("enrollment", "promote") && (
                                    <Menu.Item
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
                                      {/* <Lucide
                                            icon="CheckSquare"
                                            className="w-4 h-4 mr-1"
                                          />{" "} */}
                                      <i className="icon-eye mr-2"></i>
                                      Transfer
                                    </Menu.Item>
                                  )}
                                  <Menu.Item
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
                                    {/* <Lucide
                                            icon="CheckSquare"
                                            className="w-4 h-4 mr-1"
                                          />{" "} */}
                                    <i className="icon-eye mr-2"></i>
                                    Exit
                                  </Menu.Item>
                                  {(learner.status === "D" ||
                                    learner.status === "P") &&
                                    hasPermission("learners", "delete") && (
                                      <Menu.Item
                                        onClick={(e: any) => {
                                          e.preventDefault();
                                          disableRecord(learner._id);
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
