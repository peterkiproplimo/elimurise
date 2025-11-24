import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import { Dialog } from "../../../base-components/Headless";
import Table from "../../../base-components/Table";
import Notification, {
  NotificationElement,
} from "../../../base-components/Notification";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingIcon from "../../../base-components/LoadingIcon";
import Pagination from "../../../base-components/Pagination";
import Dropzone from "dropzone";
import * as ApiService from "../../../services/auth";
import GoogleDriveUpload from '../../../components/GoogleDriveUpload';
import ImageDriveUpload from '../../../components/ImageDriveUpload';
import { GoogleDriveFile } from '../../../utils/googleDriveConfig';
import googleImageUploadService from '../../../services/googleImageUploadService';

// Validation schema for project evidence submission
const projectEvidenceSchema = yup.object({
  title: yup.string().required("Project title is required"),
  description: yup.string().required("Project description is required"),
  caption: yup.string().required("Caption is required"),
  reflection: yup.string().required("Reflection text is required"),
  learningArea: yup.string(),
  competency: yup.string(),
  pci: yup.string().required("Pertinent & Contemporary Issue is required"),
  evidenceType: yup.string().required("Evidence type is required"),
  student: yup.string().required("Student selection is required"),
});


interface ProjectEvidence {
  _id: string;
  title: string;
  description: string;
  caption: string;
  reflection: string;
  learningArea: {
    _id: string;
    name: string;
    code: string;
  };
  competency: {
    _id: string;
    name: string;
    code: string;
  };
  pci: string;
  evidenceType: 'photo' | 'video';
  mediaUrl: string;
  googleDriveFiles?: Array<{
    mediaUrl: string;
    googleDriveUrl: string;
    googleDriveFileId: string;
    fileType: string;
  }>;
  googleDriveUrl?: string;
  googleDriveFileId?: string;
  cloudinaryData?: {
    public_id: string;
    secure_url: string;
    url: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
    folder: string;
    folderStructure: {
      mainFolder: string;
      studentFolder: string;
      projectFolder: string;
    };
  };
  thumbnailUrl?: string;
  student: {
    _id: string;
    adm_no: string;
    first_name: string;
    last_name: string;
    surname?: string;
  };
  studentName: string;
  studentId: string;
  teacherFeedback?: Array<{
    comment: string;
    rating: number;
    authenticityApproved: boolean;
    feedbackBy?: {
      _id: string;
      name: string;
    };
    feedbackBy_name?: string;
    feedbackDate: string;
  }>;
  status: 'submitted' | 'reviewed' | 'approved' | 'rejected';
  submittedAt: string;
  updatedAt: string;
}

interface LearningArea {
  _id: string;
  name: string;
  code: string;
}

interface Competency {
  _id: string;
  name: string;
  code: string;
}

interface Student {
  _id: string;
  adm_no: string;
  first_name: string;
  last_name: string;
  surname?: string;
  status?: string;
}

const ProjectsModule = () => {
  const navigate = useNavigate();
  const [projectEvidences, setProjectEvidences] = useState<ProjectEvidence[]>([]);
  const [learningAreas, setLearningAreas] = useState<LearningArea[]>([]);
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [submissionModal, setSubmissionModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectEvidence | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLearningArea, setFilterLearningArea] = useState("");
  const [filterCompetency, setFilterCompetency] = useState("");
  const [filterStudent, setFilterStudent] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [activeTab, setActiveTab] = useState("list"); // "list" or "submit"
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [selectedFileForView, setSelectedFileForView] = useState<{url: string, type: string, title: string} | null>(null);
  const [googleDriveUploadModal, setGoogleDriveUploadModal] = useState(false);
  const [viewDetailsTab, setViewDetailsTab] = useState<'basic' | 'feedback' | 'evidences'>('basic');

  const notificationRef = useRef<NotificationElement>(null);

  // Google Drive upload handlers
  const handleGoogleDriveUploadSuccess = (file: GoogleDriveFile) => {
    console.log('File uploaded to Google Drive:', file);
    // You can add additional logic here, like updating the UI or showing a success message
    setGoogleDriveUploadModal(false);
  };

  const handleGoogleDriveUploadError = (error: string) => {
    console.error('Google Drive upload error:', error);
    // You can add additional error handling here, like showing an error notification
  };

  const {
    register: registerSubmission,
    handleSubmit: handleSubmissionSubmit,
    formState: { errors: submissionErrors },
    reset: resetSubmission,
    setValue: setSubmissionValue,
  } = useForm({
    resolver: yupResolver(projectEvidenceSchema),
  });


  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch learning areas using ApiService
      try {
        const learningAreasData = await ApiService.getLearningAreas({
          gradeId: "65dc82fc14736ba5fcadf989",
          limit: 1000,
          status: "active"
        });
        setLearningAreas(learningAreasData.data || learningAreasData.learningAreas || []);
      } catch (error) {
        console.error("Error fetching learning areas:", error);
        notificationRef.current?.showToast();
      }

      // Fetch competencies
      const competenciesResponse = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}competencies?limit=1000&status=active`
      );
      if (competenciesResponse.ok) {
        const competenciesData = await competenciesResponse.json();
        setCompetencies(competenciesData.competencies);
      }

      // Fetch students using existing API service
      try {
        const studentsResponse = await ApiService.getLearnersEnroll(
          {
            page: 1,
            search: "",
            limit: 1000,
            status: ["P"], // Active students
          },
          {} // No strand filter
        );
        console.log("Students response:", studentsResponse);
        const studentsData = studentsResponse.data || studentsResponse.learners || [];
        console.log("Students data:", studentsData);
        console.log("Students count:", studentsData.length);
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
        // Fallback to getLearners if getLearnersEnroll fails
        try {
          const fallbackResponse = await ApiService.getLearners({}, {});
          console.log("Fallback students response:", fallbackResponse);
          const fallbackData = fallbackResponse.data || fallbackResponse.learners || [];
          console.log("Fallback students data:", fallbackData);
          setStudents(fallbackData);
        } catch (fallbackError) {
          console.error("Error fetching students from fallback:", fallbackError);
          setStudents([]);
        }
      }

      // Fetch project evidences
      await fetchProjectEvidences();
    } catch (error) {
      console.error("Error fetching data:", error);
      notificationRef.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  // Fetch project evidences
  const fetchProjectEvidences = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (filterLearningArea) params.append("learningArea", filterLearningArea);
      if (filterCompetency) params.append("competency", filterCompetency);
      if (filterStudent) params.append("student", filterStudent);
      if (filterStatus) params.append("status", filterStatus);
      if (filterDateFrom) params.append("dateFrom", filterDateFrom);
      if (filterDateTo) params.append("dateTo", filterDateTo);

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}project-evidences?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProjectEvidences(data.projectEvidences || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
        setTotalProjects(data.total || 0);
      } else {
        throw new Error("Failed to fetch project evidences");
      }
    } catch (error) {
      console.error("Error fetching project evidences:", error);
      notificationRef.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, filterLearningArea, filterCompetency, filterStudent, filterStatus, filterDateFrom, filterDateTo]);

  // Filter students based on search term
  useEffect(() => {
    if (studentSearchTerm.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) =>
        `${student.adm_no} ${student.first_name} ${student.last_name} ${student.surname || ""}`
          .toLowerCase()
          .includes(studentSearchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [students, studentSearchTerm]);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Handle student selection
  const handleStudentSelect = (student: Student) => {
    setStudentSearchTerm(`${student.adm_no} - ${student.first_name} ${student.last_name}`);
    setSelectedStudentId(student._id);
    setShowStudentDropdown(false);
    // Update form value using react-hook-form setValue
    setSubmissionValue("student", student._id);
    // Also store the full student data for sending to backend
    setSubmissionValue("studentName", `${student.first_name} ${student.last_name}${student.surname ? ` ${student.surname}` : ''}`);
    setSubmissionValue("studentId", student.adm_no);
  };

  // Handle student search input change
  const handleStudentSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStudentSearchTerm(value);
    setShowStudentDropdown(true);
    
    // Clear form value if search is cleared
    if (value === "") {
      setSelectedStudentId("");
      setSubmissionValue("student", "");
      setSubmissionValue("studentName", "");
      setSubmissionValue("studentId", "");
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.student-search-container')) {
        setShowStudentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle viewing file
  const handleViewFile = (project: any) => {
    const fileUrl = project.cloudinaryData?.secure_url || project.cloudinaryData?.url || project.mediaUrl;
    if (fileUrl) {
      setSelectedFileForView({
        url: fileUrl,
        type: project.evidenceType,
        title: project.title
      });
      setViewModal(true);
    }
  };

  // Handle downloading file
  const handleDownloadFile = async (project: any) => {
    const fileUrl = project.cloudinaryData?.secure_url || project.cloudinaryData?.url || project.mediaUrl;
    if (fileUrl) {
      try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${project.title}.${project.evidenceType === 'photo' ? 'jpg' : 'mp4'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading file:', error);
        notificationRef.current?.showToast();
      }
    }
  };

  // Start camera capture
  const startCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      setMediaStream(stream);
      setIsCapturing(true);
      
      if (videoRef) {
        videoRef.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      notificationRef.current?.showToast();
    }
  };

  // Stop camera capture
  const stopCameraCapture = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setIsCapturing(false);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef && canvasRef) {
      const context = canvasRef.getContext('2d');
      if (context) {
        context.drawImage(videoRef, 0, 0, canvasRef.width, canvasRef.height);
        canvasRef.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
            handleFileSelect(file);
            stopCameraCapture();
          }
        }, 'image/jpeg');
      }
    }
  };

  // Submit project evidence
  const onSubmitProjectEvidence = async (data: any) => {
    if (!selectedFile) {
      notificationRef.current?.showToast();
      return;
    }

    setLoading(true);
    let googleDriveUrl = null;

    try {
      // Check if signed in to Google Drive
      const isSignedIn = googleImageUploadService.isSignedIn();
      const selectedStudent = students.find(s => s._id === selectedStudentId);
      const studentName = selectedStudent ? `${selectedStudent.first_name}_${selectedStudent.last_name}` : 'Unknown';

      // Upload to Google Drive if signed in
      if (isSignedIn && selectedStudent) {
        try {
          console.log('Uploading to Google Drive with student name:', studentName);
          
          // Get the elimurise folder (will create if doesn't exist)
          const elimuriseFolderId = await googleImageUploadService.getOrCreateElimuriseFolder();
          
          // Upload to a subfolder with student name
          const studentFolderId = await googleImageUploadService.getOrCreateFolder(studentName, elimuriseFolderId);
          
          // Upload the file
          const uploadedFile = await googleImageUploadService.uploadImage(selectedFile, studentFolderId);
          googleDriveUrl = uploadedFile.webViewLink;
          
          console.log('File uploaded to Google Drive:', googleDriveUrl);
        } catch (error: any) {
          console.error('Error uploading to Google Drive:', error);
          // Continue with the submission even if Google Drive upload fails
        }
      }

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('caption', data.caption);
      formData.append('reflection', data.reflection);
      formData.append('learningArea', data.learningArea);
      
      // Find and send learning area details
      const selectedLearningArea = learningAreas.find(la => la._id === data.learningArea);
      if (selectedLearningArea) {
        formData.append('learningAreaName', selectedLearningArea.name);
        formData.append('learningAreaCode', selectedLearningArea.code);
      }
      
      formData.append('competency', data.competency);
      
      // Find and send competency details
      const selectedCompetency = competencies.find(c => c._id === data.competency);
      if (selectedCompetency) {
        formData.append('competencyName', selectedCompetency.name);
        formData.append('competencyCode', selectedCompetency.code);
      }
      formData.append('pci', data.pci);
      formData.append('evidenceType', data.evidenceType);
      formData.append('student', data.student);
      formData.append('studentName', data.studentName);
      formData.append('studentId', data.studentId);
      formData.append('media', selectedFile);
      formData.append('uploadToCloudinary', 'true'); // Always use Cloudinary for backup
      
      // Add Google Drive URL if available
      if (googleDriveUrl) {
        formData.append('googleDriveUrl', googleDriveUrl);
      }

      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}project-evidences`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        notificationRef.current?.showToast();
        setSubmissionModal(false);
        resetSubmission();
        setSelectedFile(null);
        setPreviewUrl("");
        setStudentSearchTerm("");
        setSelectedStudentId("");
        setSubmissionValue("studentName", "");
        setSubmissionValue("studentId", "");
        setActiveTab("list");
        fetchProjectEvidences(currentPage);
      } else {
        throw new Error(result.message || "Failed to submit project evidence");
      }
    } catch (error: any) {
      console.error("Error submitting project evidence:", error);
      notificationRef.current?.showToast();
    } finally {
      setLoading(false);
    }
  };


  // Handle feedback submission
  const handleFeedback = (project: ProjectEvidence) => {
    navigate('/home/projects/teacher-feedback', {
      state: { project }
    });
  };

  const pciOptions = [
    "Environment",
    "Health",
    "Gender",
    "Values",
    "Human Rights",
    "Child Protection",
    "Life Skills",
    "Citizenship",
    "Peace Education",
    "Technology",
    "Innovation",
    "Entrepreneurship"
  ];

  const statusOptions = [
    { value: "submitted", label: "Submitted" },
    { value: "reviewed", label: "Reviewed" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Project Evidence Management</h2>
      </div>

      {/* Tabs - Only show when submitting */}
      {activeTab === "submit" && (
        <div className="mt-5">
          <ul className="flex border-b border-gray-200 mb-4">
            <li className="mr-2">
              <button
                className="inline-block py-2 px-4 text-gray-600 hover:text-blue-600 font-semibold"
                onClick={() => setActiveTab("list")}
              >
                Project List
              </button>
            </li>
            <li className="mr-2">
              <button
                className="inline-block py-2 px-4 text-blue-600 border-b-2 border-blue-600 font-semibold"
                onClick={() => setActiveTab("submit")}
              >
                Submit Evidence
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Filters and Table - Only show when on list view */}
      {activeTab === "list" && (
        <>
          {/* Filters */}
          <div className="grid grid-cols-1 gap-4 mt-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <FormLabel htmlFor="search">Search</FormLabel>
              <FormInput
                id="search"
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <FormLabel htmlFor="learningArea-filter">Learning Area</FormLabel>
              <FormSelect
                id="learningArea-filter"
                value={filterLearningArea}
                onChange={(e) => setFilterLearningArea(e.target.value)}
              >
                <option value="">All Learning Areas</option>
                {learningAreas.map((learningArea) => (
                  <option key={learningArea._id} value={learningArea._id}>
                    {learningArea.code} - {learningArea.name}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div>
              <FormLabel htmlFor="competency-filter">Competency</FormLabel>
              <FormSelect
                id="competency-filter"
                value={filterCompetency}
                onChange={(e) => setFilterCompetency(e.target.value)}
              >
                <option value="">All Competencies</option>
                {competencies.map((competency) => (
                  <option key={competency._id} value={competency._id}>
                    {competency.code} - {competency.name}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div>
              <FormLabel htmlFor="student-filter">Student</FormLabel>
              <FormSelect
                id="student-filter"
                value={filterStudent}
                onChange={(e) => setFilterStudent(e.target.value)}
              >
                <option value="">All Students</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.adm_no} - {student.first_name} {student.last_name}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div>
              <FormLabel htmlFor="status-filter">Status</FormLabel>
              <FormSelect
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </FormSelect>
            </div>
            <div>
              <FormLabel htmlFor="date-from">Date From</FormLabel>
              <FormInput
                id="date-from"
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>
            <div>
              <FormLabel htmlFor="date-to">Date To</FormLabel>
              <FormInput
                id="date-to"
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row mt-5">
            <Button
              variant="primary"
              className="mr-2 mb-2"
              onClick={() => navigate('/projectsmodule/create')}
            >
              <Lucide icon="Plus" className="w-4 h-4 mr-2" />
              Submit Project Evidence
            </Button>
            {/* <Button
              variant="outline-primary"
              className="mr-2 mb-2"
              onClick={() => setGoogleDriveUploadModal(true)}
            >
              <Lucide icon="Upload" className="w-4 h-4 mr-2" />
              Upload to Google Drive
            </Button> */}
          </div>

          {/* Projects Table */}
          <div className="mt-5">
            {loading ? (
              <div className="flex flex-col items-center mt-5">
                <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
              </div>
            ) : projectEvidences.length === 0 ? (
              <div className="flex flex-col items-center mt-10 bg-white p-8">
                <p className="text-xl text-slate-500">No records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th className="whitespace-nowrap">Title</Table.Th>
                      <Table.Th className="whitespace-nowrap">Student</Table.Th>
                      <Table.Th className="whitespace-nowrap">Submitted</Table.Th>
                      <Table.Th className="text-center whitespace-nowrap">Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {projectEvidences.map((project) => {
                      return (
                        <React.Fragment key={project._id}>
                          <Table.Tr>
                            <Table.Td>
                              <div className="max-w-xs truncate" title={project.title}>
                                {project.title}
                              </div>
                            </Table.Td>
                            <Table.Td>
                              <div className="text-sm">
                                <div className="font-medium">{project.studentName || 'Unknown Student'}</div>
                                <div className="text-gray-500">{project.studentId || 'N/A'}</div>
                              </div>
                            </Table.Td>
                            
                            <Table.Td>
                              <span className="text-sm">
                                {new Date(project.submittedAt).toLocaleDateString()}
                              </span>
                            </Table.Td>
                            <Table.Td>
                              <div className="flex items-center justify-center">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => navigate(`/home/project-details/${project._id}`)}
                                  title="View Details"
                                >
                                  <Lucide icon="Eye" className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => {
                                    navigate('/home/projects/teacher-feedback', {
                                      state: { project }
                                    });
                                  }}
                                  title="Add Feedback"
                                >
                                  <Lucide icon="MessageSquare" className="w-4 h-4" />
                                </Button>
                                {/* Cloudinary View and Download buttons */}
                                {(project.cloudinaryData?.secure_url || project.cloudinaryData?.url || project.mediaUrl) && (
                                  <>
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      className="mr-2"
                                      onClick={() => handleViewFile(project)}
                                      title="View File"
                                    >
                                      <Lucide icon="Play" className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      className="mr-2"
                                      onClick={() => handleDownloadFile(project)}
                                      title="Download File"
                                    >
                                      <Lucide icon="Download" className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </Table.Td>
                          </Table.Tr>
                        </React.Fragment>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-5">
                <Pagination />
              </div>
            )}
          </div>
        </>
      )}

      {/* Submit Project Evidence Tab */}
      {activeTab === "submit" && (
        <div className="mt-5">
          {/* Google Drive Sign In Section */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            {!googleImageUploadService.isSignedIn() && (
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Google Drive Integration</h5>
                  <p className="text-sm text-gray-600">
                    Sign in to Google Drive to save project files with student names automatically.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    const authUrl = googleImageUploadService.generateAuthUrl();
                    window.location.href = authUrl;
                  }}
                  variant="primary"
                >
                  <Lucide icon="LogIn" className="w-4 h-4 mr-2" />
                  Sign In to Google Drive
                </Button>
              </div>
            )}
            {googleImageUploadService.isSignedIn() && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lucide icon="CheckCircle" className="w-5 h-5 text-green-600" />
                  <div>
                    <h5 className="font-semibold text-gray-700">Signed in to Google Drive</h5>
                    <p className="text-sm text-gray-600">
                      Files will be automatically saved to your "elimurise" folder with student names.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    googleImageUploadService.signOut();
                    notificationRef.current?.showToast();
                  }}
                  variant="outline-secondary"
                >
                  Sign Out
                </Button>
              </div>
            )}
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h4 className="font-bold mb-4">Submit Project Evidence</h4>
            <form onSubmit={handleSubmissionSubmit(onSubmitProjectEvidence)}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <FormLabel htmlFor="title">Project Title *</FormLabel>
                  <FormInput
                    id="title"
                    type="text"
                    placeholder="Enter project title"
                    {...registerSubmission("title")}
                  />
                  {submissionErrors.title && (
                    <div className="mt-1 text-danger">{String(submissionErrors.title.message)}</div>
                  )}
                </div>
                <div>
                  <FormLabel htmlFor="evidenceType">Evidence Type *</FormLabel>
                  <FormSelect id="evidenceType" {...registerSubmission("evidenceType")}>
                    <option value="">Select evidence type</option>
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                  </FormSelect>
                  {submissionErrors.evidenceType && (
                    <div className="mt-1 text-danger">{String(submissionErrors.evidenceType.message)}</div>
                  )}
                </div>
                <div>
                  <FormLabel htmlFor="student">Student *</FormLabel>
                  <div className="relative student-search-container">
                    <FormInput
                      id="student-search"
                      type="text"
                      placeholder="Search for student..."
                      value={studentSearchTerm}
                      onChange={handleStudentSearchChange}
                      onFocus={() => setShowStudentDropdown(true)}
                      className="w-full"
                    />
                    <input
                      id="student"
                      type="hidden"
                      value={selectedStudentId}
                      {...registerSubmission("student")}
                    />
                    
                    {/* Dropdown */}
                    {showStudentDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => (
                            <div
                              key={student._id}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => handleStudentSelect(student)}
                            >
                              <div className="font-medium text-gray-900">
                                {student.adm_no} - {student.first_name} {student.last_name}
                              </div>
                              {student.surname && (
                                <div className="text-sm text-gray-500">
                                  {student.surname}
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-gray-500">
                            No students found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {submissionErrors.student && (
                    <div className="mt-1 text-danger">{String(submissionErrors.student.message)}</div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <FormLabel htmlFor="description">Project Description *</FormLabel>
                  <FormTextarea
                    id="description"
                    placeholder="Describe your project"
                    {...registerSubmission("description")}
                  />
                  {submissionErrors.description && (
                    <div className="mt-1 text-danger">{String(submissionErrors.description.message)}</div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <FormLabel htmlFor="caption">Caption *</FormLabel>
                  <FormTextarea
                    id="caption"
                    placeholder="Enter caption for your evidence"
                    {...registerSubmission("caption")}
                  />
                  {submissionErrors.caption && (
                    <div className="mt-1 text-danger">{String(submissionErrors.caption.message)}</div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <FormLabel htmlFor="reflection">Reflection - What did I learn? *</FormLabel>
                  <FormTextarea
                    id="reflection"
                    placeholder="Reflect on what you learned from this project"
                    {...registerSubmission("reflection")}
                  />
                  {submissionErrors.reflection && (
                    <div className="mt-1 text-danger">{String(submissionErrors.reflection.message)}</div>
                  )}
                </div>
                <div>
                  <FormLabel htmlFor="learningArea">Learning Area / Strand *</FormLabel>
                  <FormSelect id="learningArea" {...registerSubmission("learningArea")}>
                    <option value="">Select learning area</option>
                    {learningAreas.map((learningArea) => (
                      <option key={learningArea._id} value={learningArea._id}>
                        {learningArea.code} - {learningArea.name}
                      </option>
                    ))}
                  </FormSelect>
                  {submissionErrors.learningArea && (
                    <div className="mt-1 text-danger">{String(submissionErrors.learningArea.message)}</div>
                  )}
                </div>
                <div>
                  <FormLabel htmlFor="competency">Competency (CBC) *</FormLabel>
                  <FormSelect id="competency" {...registerSubmission("competency")}>
                    <option value="">Select competency</option>
                    {competencies.map((competency) => (
                      <option key={competency._id} value={competency._id}>
                        {competency.code} - {competency.name}
                      </option>
                    ))}
                  </FormSelect>
                  {submissionErrors.competency && (
                    <div className="mt-1 text-danger">{String(submissionErrors.competency.message)}</div>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <FormLabel htmlFor="pci">Pertinent & Contemporary Issues *</FormLabel>
                  <FormSelect id="pci" {...registerSubmission("pci")}>
                    <option value="">Select PCI</option>
                    {pciOptions.map((pci) => (
                      <option key={pci} value={pci}>
                        {pci}
                      </option>
                    ))}
                  </FormSelect>
                  {submissionErrors.pci && (
                    <div className="mt-1 text-danger">{String(submissionErrors.pci.message)}</div>
                  )}
                </div>
              </div>

              {/* Media Upload Section */}
              <div className="mt-6">
                <FormLabel>Upload or Capture Evidence *</FormLabel>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {!selectedFile ? (
                    <div className="text-center">
                      <div className="flex justify-center space-x-4">
                        <Button
                          type="button"
                          variant="outline-primary"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Lucide icon="Upload" className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                        <Button
                          type="button"
                          variant="outline-secondary"
                          onClick={startCameraCapture}
                        >
                          <Lucide icon="Camera" className="w-4 h-4 mr-2" />
                          Capture Photo
                        </Button>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*,video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mb-4">
                        {selectedFile.type.startsWith('image/') ? (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-w-full max-h-64 mx-auto rounded-lg"
                          />
                        ) : (
                          <video
                            src={previewUrl}
                            controls
                            className="max-w-full max-h-64 mx-auto rounded-lg"
                          />
                        )}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                      <Button
                        type="button"
                        variant="outline-danger"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl("");
                        }}
                      >
                        <Lucide icon="X" className="w-4 h-4 mr-2" />
                        Remove File
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Camera Capture Modal */}
              {isCapturing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <h3 className="text-lg font-semibold mb-4">Capture Photo</h3>
                    <div className="mb-4">
                      <video
                        ref={setVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-64 bg-gray-200 rounded-lg"
                      />
                      <canvas
                        ref={setCanvasRef}
                        className="hidden"
                        width="640"
                        height="480"
                      />
                    </div>
                    <div className="flex justify-end space-x-2"> 
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={stopCameraCapture}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={capturePhoto}
                      >
                        <Lucide icon="Camera" className="w-4 h-4 mr-2" />
                        Capture
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cloudinary Upload Information */}
              <div className="mt-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Files will be automatically uploaded to Cloudinary for secure storage and easy access.
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  type="button"
                  variant="outline-secondary"
                  className="mr-2"
                  onClick={() => {
                    resetSubmission();
                    setStudentSearchTerm("");
                    setSelectedStudentId("");
                    setSubmissionValue("studentName", "");
                    setSubmissionValue("studentId", "");
                    setActiveTab("list");
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={loading || !selectedFile}>
                  {loading ? <LoadingIcon icon="oval" className="w-4 h-4" /> : "Submit Evidence"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Project Evidence Modal */}
      <Dialog open={submissionModal} onClose={() => setSubmissionModal(false)}>
        <Dialog.Panel>
          <Dialog.Title>Project Evidence Details</Dialog.Title>
          {selectedProject && (
            <div className="mt-4">
              {/* Tabs for Basic Info / Teacher Feedback / Evidences */}
              <div className="flex border-b mb-4">
                <button
                  className={`px-4 py-2 -mb-px border-b-2 ${viewDetailsTab === 'basic' ? 'border-primary text-primary' : 'border-transparent text-gray-600'}`}
                  onClick={() => setViewDetailsTab('basic')}
                >
                  Basic Info
                </button>
                <button
                  className={`ml-4 px-4 py-2 -mb-px border-b-2 ${viewDetailsTab === 'feedback' ? 'border-primary text-primary' : 'border-transparent text-gray-600'}`}
                  onClick={() => setViewDetailsTab('feedback')}
                >
                  Teacher Feedback
                </button>
                <button
                  className={`ml-4 px-4 py-2 -mb-px border-b-2 ${viewDetailsTab === 'evidences' ? 'border-primary text-primary' : 'border-transparent text-gray-600'}`}
                  onClick={() => setViewDetailsTab('evidences')}
                >
                  Evidences
                </button>
              </div>

              {viewDetailsTab === 'basic' && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedProject.title}</h3>
                  <p className="text-gray-600">{selectedProject.description}</p>
                </div>
                <div>
                  <h4 className="font-medium">Caption:</h4>
                  <p className="text-gray-700">{selectedProject.caption}</p>
                </div>
                <div>
                  <h4 className="font-medium">Reflection:</h4>
                  <p className="text-gray-700">{selectedProject.reflection}</p>
                </div>
                <div>
                  <h4 className="font-medium">Student:</h4>
                  <div className="text-sm">
                    <div className="font-medium">{selectedProject.studentName || 'Unknown Student'}</div>
                    <div className="text-gray-500">{selectedProject.studentId || 'N/A'}</div>
                  </div>
                </div>
                  <div>
                  <h4 className="font-medium">Learning Area:</h4>
                  <p className="text-gray-700">
                    {selectedProject.learningArea ? `${selectedProject.learningArea.code} - ${selectedProject.learningArea.name}` : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Competency:</h4>
                  <p className="text-gray-700">
                    {selectedProject.competency ? `${selectedProject.competency.code} - ${selectedProject.competency.name}` : 'Not specified'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">PCI:</h4>
                  <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                    {selectedProject.pci}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">Evidence:</h4>
                  {selectedProject.evidenceType === 'photo' ? (
                    <img
                      src={selectedProject.mediaUrl}
                      alt="Project evidence"
                      className="max-w-full max-h-64 rounded-lg"
                    />
                  ) : (
                    <video
                      src={selectedProject.mediaUrl}
                      controls
                      className="max-w-full max-h-64 rounded-lg"
                    />
                  )}
                </div>
                
              </div>
              )}

              {viewDetailsTab === 'feedback' && (
                <div className="border-t pt-4">
                  <h4 className="font-medium">Teacher Feedback ({selectedProject.teacherFeedback?.length || 0}):</h4>
                  {selectedProject.teacherFeedback && selectedProject.teacherFeedback.length > 0 ? (
                    <div className="space-y-3 mt-3">
                      {selectedProject.teacherFeedback.map((feedback, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-sm">Feedback #{index + 1}</h5>
                            <span className="text-xs text-gray-500">
                              {new Date(feedback.feedbackDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{feedback.comment}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm">
                              Rating: {feedback.rating}/5
                            </span>
                            <span className={`text-sm px-2 py-1 rounded ${feedback.authenticityApproved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {feedback.authenticityApproved ? 'Approved' : 'Not Approved'}
                            </span>
                            <span className="text-xs text-gray-500">
                              By: {feedback.feedbackBy?.name || feedback.feedbackBy_name || 'Unknown Teacher'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-600 mt-2">No feedback yet.</div>
                  )}
              </div>
              )}

              {viewDetailsTab === 'evidences' && (
                <div className="space-y-4">
                  {/* Google Drive files grid for images */}
                  {selectedProject.googleDriveFiles && selectedProject.googleDriveFiles.length > 0 ? (
                    <>
                      <h4 className="font-medium">Google Drive Files</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedProject.googleDriveFiles.map((file, idx) => (
                          <div key={file.googleDriveFileId || idx} className="border rounded-lg p-2">
                            {file.fileType?.startsWith('image') ? (
                              <img
                                src={file.mediaUrl || file.googleDriveUrl}
                                alt={selectedProject.title}
                                className="w-full h-40 object-cover rounded"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              />
                            ) : file.fileType === 'application/pdf' ? (
                              <a
                                href={file.googleDriveUrl || file.mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline block truncate"
                              >
                                View PDF
                              </a>
                            ) : (
                              <a
                                href={file.googleDriveUrl || file.mediaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline block truncate"
                              >
                                Open File
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-gray-600">No Google Drive evidences available.</div>
                  )}

                  {/* Fallback single file link if present */}
                  {!selectedProject.googleDriveFiles?.length && selectedProject.googleDriveUrl && (
                    <a
                      href={selectedProject.googleDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Open Evidence in Google Drive
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end mt-6">
            <Button
              type="button"
              variant="outline-secondary"
              onClick={() => setSubmissionModal(false)}
            >
              Close
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>


      {/* File View Modal */}
      <Dialog open={viewModal} onClose={() => setViewModal(false)}>
        <Dialog.Panel className="max-w-4xl">
          <Dialog.Title>View File - {selectedFileForView?.title}</Dialog.Title>
          <div className="mt-4">
            {selectedFileForView && (
              <div className="text-center">
                {selectedFileForView.type === 'photo' ? (
                  <img
                    src={selectedFileForView.url}
                    alt={selectedFileForView.title}
                    className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <video
                    src={selectedFileForView.url}
                    controls
                    className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                    onError={(e) => {
                      console.error('Error loading video:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
                <div className="mt-4">
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedFileForView.url;
                      link.target = '_blank';
                      link.click();
                    }}
                    className="mr-2"
                  >
                    <Lucide icon="ExternalLink" className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                  <Button
                    variant="outline-success"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = selectedFileForView.url;
                      link.download = `${selectedFileForView.title}.${selectedFileForView.type === 'photo' ? 'jpg' : 'mp4'}`;
                      link.click();
                    }}
                  >
                    <Lucide icon="Download" className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-6">
            <Button
              variant="outline-secondary"
              onClick={() => setViewModal(false)}
            >
              Close
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Google Drive Upload Modal */}
      <Dialog open={googleDriveUploadModal} onClose={() => setGoogleDriveUploadModal(false)}>
        <Dialog.Panel>
          <Dialog.Footer>
      
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>

      <Notification getRef={(el) => { notificationRef.current = el; }} />
    </>
  );
};

export default ProjectsModule;