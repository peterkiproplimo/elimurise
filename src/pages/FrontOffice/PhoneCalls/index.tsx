import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../../base-components/Button";
import PassportUpload from "./profilephoto";
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
import leanerImg from "../../assets/images/learner.jpeg";
import { formatDate, is_admin } from "../../../utils/helper";
import io, { Socket } from "socket.io-client";
import {
  Box,
  Typography,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";

import { Phone, PhoneMissed, PhoneForwarded } from "@mui/icons-material";
import React from "react";

interface CallLog {
  id: number;
  name: string;
  phone: string;
  type: "Incoming" | "Outgoing" | "Missed";
  time: string;
  followUp?: boolean;
}

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


  const [guardianIdNo, setGuardianIdNo] = useState("");
  const [guardianIdNo2, setGuardianIdNo2] = useState("");
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

  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // surname: yup.string().required("Surname is required"),
      adm_no: yup.string().required("Adm No is required"),
      grade: yup.string().required("Grade is required"),
      stream: yup.string().required("Stream is required"),
      guardian_first_name: yup.string().required("First name is required"),


    })
    .required();

  const {
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });


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


  const getStudents = async () => {
    isLoading(true);
    try {
      const response = await ApiService.getVisitors(
        {
          page,
          search,
          limit,
          grade,
          stream,
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
      console.log("Response data", response.data)
      setLearners(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      isLoading(false);
    }
  };


  const getStreams = async () => {
    const response = await ApiService.getStream({ grade: grade });
    console.log(response);
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

  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Function to always scroll to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" }); // Instant scroll
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom on message update

  }, [messages]);
  const [filter, setFilter] = useState<"All" | "Outgoing" | "Missed">("All");

  const callLogs: CallLog[] = [
    { id: 1, name: "John Doe", phone: "+254700123456", type: "Incoming", time: "9:45 AM" },
    { id: 2, name: "Jane Smith", phone: "+254711987654", type: "Missed", time: "8:30 AM", followUp: true },
    { id: 3, name: "Kevin Otieno", phone: "+254722456789", type: "Outgoing", time: "Yesterday 4:15 PM" },
  ];

  const filteredLogs = callLogs.filter(
    (log) =>
      (filter === "All" || log.type === filter) &&
      (log.name.toLowerCase().includes(search.toLowerCase()) ||
        log.phone.includes(search))
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "Incoming":
        return <Phone color="success" />;
      case "Outgoing":
        return <PhoneForwarded color="primary" />;
      case "Missed":
        return <PhoneMissed color="error" />;
      default:
        return <Phone />;
    }
  };

  const [activeTabLearner, setActiveTabLearner] = useState<
    "learner" | "parent1" | "parent2"
  >("learner");
  return (

   <Box p={4}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Phone Call Log
      </Typography>

      {/* Search & Filter Row */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <TextField
          label="Search by name or number"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button
          variant={filter === "All" ? "contained" : "outlined" as any}
          onClick={() => setFilter("All")}
        >
          All
        </Button>
        <Button
          variant={filter === "Outgoing" ? "contained" : "outlined" as any}
          onClick={() => setFilter("Outgoing")}
        >
          Outgoing
        </Button>
        <Button
          variant={filter === "Missed" ? "contained" : "outlined" as any}
          onClick={() => setFilter("Missed")}
        >
          Missed
        </Button>
      </Box>

      {/* Call Log List */}
      <List>
        {filteredLogs.map((log) => (
          <React.Fragment key={log.id}>
            <ListItem>
              <ListItemIcon>{getIcon(log.type)}</ListItemIcon>
              <ListItemText
                primary={`${log.name} (${log.phone})`}
                secondary={`${log.type} • ${log.time}`}
              />
              {log.type === "Missed" && (
                <Chip
                  label={log.followUp ? "Follow-up Pending" : "Missed Call"}
                  color={log.followUp ? "warning" : "error"}
                  size="small"
                />
              )}
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
 
    
  );
}

export default Main;
