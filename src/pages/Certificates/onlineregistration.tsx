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
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exportDialog, setExportDialog] = useState(false);
  const approveButtonRef = useRef(null);
  const [approveDialog, setApproveDialog] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<any>(null);
  const [approveTranfer, setApproveTranfer] = useState<any>({
    learner: [],
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
  const [profile, setProfile] = useState(false);
  const [learner, setLearner] = useState<any>({});
  const [learners, setLearners] = useState([]);
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
  });
  const [pdfUrl, setPdfUrl] = useState("");

  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedLeaningArea, setSelectedLearningArea] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");

  const [academic, setAcademic] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [parents, setParents] = useState([]);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("basicInfo"); // Default to Basic Info
  const [learningAreas, setLearningAreas] = useState([]);
  const [messages, setMessages] = useState<any>([]);
  const [loadings, setLoading] = useState<boolean>(false);
  const [parentLoading, setParentLoading] = useState<boolean>(true);


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
  const isPublicView = location.pathname.startsWith("/onlineregistration");
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
      adm_no: yup.string().required("Adm No is required"),
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
    console.log("Validation result:", result);
    console.log("Loading:", loading);
    // if (result && !loading) {
    if (result && !loading) {
      isLoading(true);
      setIsEditMode(false);



      try {
        const data = await getValues();

        console.log("Data here", data)
        // const jsonData = JSON.stringify(data);

        await ApiService.createOnlineApplicant(data);

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


  useEffect(() => {
    getStudents();
  }, [search, page, limit, sortField, sortOrder]);

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
      const res = await ApiService.exportLearners({});
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
          sortField,
          sortOrder, // Include sorting in API request
          status: ["P"],
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

    reset({
      ...record,
      image: "",
      guardian_first_name: record?.guardian?.first_name,
      guardian_email: record?.guardian?.email,
      guardian_last_name: record?.guardian?.last_name,
      guardian_surname: record?.guardian?.surname,
      guardian_phone: record?.guardian?.phone,
    });
    console.log(record);
    setDialog(true);
  };
  useEffect(() => {
    if (selectedTerm && selectedAcademicYear) {
      getTests();
      getLearningAreas();
    }
  }, [selectedAcademicYear, selectedTerm]);

  const unreadMessages = {
    guardian1: 3, // Replace with actual count
  };


  const cancel = (record: any) => {
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
      {(isPublicView || (dialog && !profile)) ? (
        <>
          {/* Enhanced Top Section */}
          <div className="flex items-center bg-white  p-4 rounded-t-2xl shadow-lg">
            {!isPublicView && (
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
            )}
            <h2 className="ml-4 text-xl font-semibold text-black">
              Online Registration
            </h2>
          </div>
          <form
            className="mt-8 p-8 bg-white rounded-2xl shadow-xl  mx-auto border border-gray-100 animate-fade-in"
            onSubmit={onSubmit}
          >
            {/* Close Button */}
            {!isPublicView && (
              <div className="absolute top-4 right-4">
                <a
                  onClick={(event: React.MouseEvent) => {
                    event.preventDefault();
                    setIsEditMode(false);
                    setDialog(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  href="#"
                >
                  <Lucide icon="X" className="w-6 h-6" />
                </a>
              </div>
            )}

            {/* Form Content */}
            <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              {/* Student Details Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
                  Student Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("first_name")}
                      type="text"
                      name="first_name"
                      className={`mt-1 w-full rounded-lg border ${errors.first_name ? "border-red-500" : "border-gray-300"
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
                      {...register("middle_name")}
                      type="text"
                      name="middle_name"
                      className={`mt-1 w-full rounded-lg border ${errors.middle_name ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Last name"
                    />
                    {errors.middle_name && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.middle_name.message === "string" &&
                          errors.middle_name.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Last Name
                    </FormLabel>
                    <FormInput
                      {...register("last_name")}
                      type="text"
                      name="last_name"
                      className={`mt-1 w-full rounded-lg border ${errors.last_name ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="last_name"
                    />
                    {errors.last_name && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.last_name.message === "string" &&
                          errors.last_name.message}
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


                  {/* Visit Date & Time */}

                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("dateOfBirth")}
                      type="datetime-local"
                      name="dateOfBirth"
                      className={`mt-1 w-full rounded-lg border ${errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Date of Birth"
                    />
                    {errors.dateOfBirth && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.dateOfBirth.message === "string" &&
                          errors.dateOfBirth.message}
                      </div>
                    )}
                  </div>


                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Nationality <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("nationality")}
                      type="text"
                      name="nationality"
                      className={`mt-1 w-full rounded-lg border ${errors.nationality ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Nationality"
                    />
                    {errors.nationality && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.nationality.message === "string" &&
                          errors.nationality.message}
                      </div>
                    )}
                  </div>


                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      County / Sub-county <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("countySubCounty")}
                      type="text"
                      name="countySubCounty"
                      className={`mt-1 w-full rounded-lg border ${errors.countySubCounty ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="County / Sub-county"
                    />
                    {errors.countySubCounty && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.countySubCounty.message === "string" &&
                          errors.countySubCounty.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Birth Certificate Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("birthCertificateNo")}
                      type="text"
                      name="birthCertificateNo"
                      className={`mt-1 w-full rounded-lg border ${errors.birthCertificateNo ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Birth Certificate Number"
                    />
                    {errors.birthCertificateNo && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.birthCertificateNo.message === "string" &&
                          errors.birthCertificateNo.message}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Parent Details Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
                  Parent Details
                </h3>
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
                      className={`mt-1 w-full rounded-lg border ${errors.guardian_first_name
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Parent First name"
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
                      className={`mt-1 w-full rounded-lg border ${errors.guardian_surname
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Parent surname"
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
                      className={`mt-1 w-full rounded-lg border ${errors.guardian_last_name
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Parent Last name"
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
                      type="email"
                      name="guardian_email"
                      className={`mt-1 w-full rounded-lg border ${errors.guardian_email
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Parent email"
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
                      className={`mt-1 w-full rounded-lg border ${errors.guardian_phone
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Parent phone"
                    />
                    {errors.guardian_phone && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.guardian_phone.message === "string" &&
                          errors.guardian_phone.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Postal Address
                    </FormLabel>
                    <FormInput
                      {...register("postalAddress")}
                      type="text"
                      name="postalAddress"
                      className={`mt-1 w-full rounded-lg border ${errors.postalAddress
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Parent phone"
                    />
                    {errors.postalAddress && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.postalAddress.message === "string" &&
                          errors.postalAddress.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Id Number
                    </FormLabel>
                    <FormInput
                      {...register("idNumber")}
                      type="text"
                      name="idNumber"
                      className={`mt-1 w-full rounded-lg border ${errors.idNumber
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Parent phone"
                    />
                    {errors.idNumber && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.idNumber.message === "string" &&
                          errors.idNumber.message}
                      </div>
                    )}
                  </div>

                </div>
              </div>


            {/* Academic Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Current / Last School{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("currentOrLastSchool")}
                      type="text"
                      name="currentOrLastSchool"
                      className={`mt-1 w-full rounded-lg border ${errors.currentOrLastSchool
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Current / Last School"
                    />
                    {errors.currentOrLastSchool && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.currentOrLastSchool.message ===
                          "string" && errors.currentOrLastSchool.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Current Class
                    </FormLabel>
                    <FormInput
                      {...register("currentClass")}
                      type="text"
                      name="currentClass"
                      className={`mt-1 w-full rounded-lg border ${errors.currentClass
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Parent surname"
                    />
                    {errors.currentClass && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.currentClass.message ===
                          "string" && errors.currentClass.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Class Applying For <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("classApplyingFor")}
                      type="text"
                      name="classApplyingFor"
                      className={`mt-1 w-full rounded-lg border ${errors.classApplyingFor
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Parent Last name"
                    />
                    {errors.classApplyingFor && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.classApplyingFor.message ===
                          "string" && errors.classApplyingFor.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      KCPE Index Number
                    </FormLabel>
                    <FormInput
                      {...register("kcpeIndexNumber")}
                      type="text"
                      name="kcpeIndexNumber"
                      className={`mt-1 w-full rounded-lg border ${errors.kcpeIndexNumber
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="KCPE Index Number"
                    />
                    {errors.kcpeIndexNumber && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.kcpeIndexNumber.message === "string" &&
                          errors.kcpeIndexNumber.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      KCPE Marks
                    </FormLabel>
                    <FormInput
                      {...register("kcpeMarks")}
                      type="text"
                      name="kcpeMarks"
                      className={`mt-1 w-full rounded-lg border ${errors.kcpeMarks
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="KCPE Marks"
                    />
                    {errors.kcpeMarks && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.kcpeMarks.message === "string" &&
                          errors.kcpeMarks.message}
                      </div>
                    )}
                  </div>

                </div>
              </div>


                    {/* Academic Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
                  Address / Contact Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Current / Last School{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormInput
                      {...register("currentOrLastSchool")}
                      type="text"
                      name="currentOrLastSchool"
                      className={`mt-1 w-full rounded-lg border ${errors.currentOrLastSchool
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Current / Last School"
                    />
                    {errors.currentOrLastSchool && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.currentOrLastSchool.message ===
                          "string" && errors.currentOrLastSchool.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Current Class
                    </FormLabel>
                    <FormInput
                      {...register("currentClass")}
                      type="text"
                      name="currentClass"
                      className={`mt-1 w-full rounded-lg border ${errors.currentClass
                          ? "border-red-500"
                          : "border-gray-300"
                        } focus:ring-2 focus:ring-indigo-500 transition-all`}
                      placeholder="Parent surname"
                    />
                    {errors.currentClass && (
                      <div className="mt-2 text-red-500 text-sm">
                        {typeof errors.currentClass.message ===
                          "string" && errors.currentClass.message}
                      </div>
                    )}
                  </div>
  
  

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
          <h2 className="mt-1 text-lg font-medium ">Online Registration</h2>


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
                    Online Applicant Registration
                  </Button>

                </>
              )}

          </div>

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
                        className={`inline-block py-2 px-4 ${activeTab === "basicInfo"
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
                              className={`inline-block py-2 px-4 ${activeTab === "guardian1"
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
                              className={`inline-block py-2 px-4 ${activeTab === "guardian2"
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
                        className={`inline-block py-2 px-4 ${activeTab === "tab4"
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
                        className={`inline-block py-2 px-4 ${activeTab === "tab3"
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
                        className={`inline-block py-2 px-4 ${activeTab === "tab5"
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
                        className={`inline-block py-2 px-4 ${activeTab === "tab6"
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
