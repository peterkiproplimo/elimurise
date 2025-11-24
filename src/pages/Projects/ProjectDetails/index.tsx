import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormTextarea,
} from "../../../base-components/Form";
import Lucide from "../../../base-components/Lucide";
import Notification, {
  NotificationElement,
} from "../../../base-components/Notification";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import LoadingIcon from "../../../base-components/LoadingIcon";
import * as ApiService from "../../../services/auth";

// Validation schema for feedback
const feedbackSchema = yup.object({
  comment: yup.string().required("Comment is required"),
  rating: yup.number().required("Rating is required").min(1).max(5),
  authenticityApproved: yup.boolean(),
});

interface ProjectEvidence {
  _id: string;
  title: string;
  description: string;
  caption: string;
  reflection: string;
  subject: {  // Backend uses 'subject' field
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

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectEvidence | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{url: string, type: string, title: string} | null>(null);
  const [activeTab, setActiveTab] = useState("basicInfo");

  const notificationRef = useRef<NotificationElement>(null);

  const {
    register: registerFeedback,
    handleSubmit: handleFeedbackSubmit,
    formState: { errors: feedbackErrors },
    reset: resetFeedback,
    setValue: setFeedbackValue,
  } = useForm({
    resolver: yupResolver(feedbackSchema),
  });

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        console.log('Fetching project with ID:', id);
        console.log('API Endpoint:', `${import.meta.env.VITE_API_ENDPOINT}project-evidences/${id}`);
        
        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}project-evidences/${id}`);
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Project data:', data);
          setProject(data);
        } else {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(`Failed to fetch project details: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        notificationRef.current?.showToast();
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Handle feedback submission
  const onSubmitFeedback = async (data: any) => {
    if (!project) return;

    try {
      setSubmittingFeedback(true);
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}project-evidences/${project._id}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        notificationRef.current?.showToast();
        setShowFeedbackForm(false);
        resetFeedback();
        // Refresh project data
        const updatedResponse = await fetch(`${import.meta.env.VITE_API_ENDPOINT}project-evidences/${project._id}`);
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setProject(updatedData);
        }
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      notificationRef.current?.showToast();
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Handle viewing file
  const handleViewFile = () => {
    if (!project) return;
    
    const fileUrl = project.cloudinaryData?.secure_url || project.cloudinaryData?.url || project.mediaUrl;
    if (fileUrl) {
      setSelectedFile({
        url: fileUrl,
        type: project.evidenceType,
        title: project.title
      });
      setViewModal(true);
    }
  };

  // Handle downloading file
  const handleDownloadFile = async () => {
    if (!project) return;
    
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIcon icon="oval" className="w-8 h-8" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/home/projectsmodule')} variant="primary">
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      {/* Custom Back Button */}
      <a
        onClick={(event) => {
          event.preventDefault();
          navigate('/home/projectsmodule');
        }}
        href="#"
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <Lucide icon="ArrowLeft" className="text-slate-400 mr-3" />
        Back
      </a>

      <div className="flex flex-wrap">
        {/* Project Evidence Preview Section */}
        <div className="w-full md:w-1/4 text-center mb-4 md:mb-0">
          <div className="bg-white shadow-md m-4 rounded-lg overflow-hidden">
            <div className="p-6">
              {project.evidenceType === 'photo' ? (
                <img
                  src={project.cloudinaryData?.secure_url || project.cloudinaryData?.url || project.mediaUrl}
                  alt="Project evidence"
                  className="rounded-lg mx-auto"
                  style={{ width: "90%", height: "90%" }}
                />
              ) : (
                <video
                  src={project.cloudinaryData?.secure_url || project.cloudinaryData?.url || project.mediaUrl}
                  controls
                  className="rounded-lg mx-auto"
                  style={{ width: "90%", height: "90%" }}
                />
              )}
              <h3 className="mt-3 text-lg font-semibold">
                {project.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {project.evidenceType === 'photo' ? 'Photo Evidence' : 'Video Evidence'}
              </p>
              <div className="mt-4 space-y-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleViewFile}
                  className="w-full"
                >
                  <Lucide icon="Eye" className="w-4 h-4 mr-2" />
                  View File
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={handleDownloadFile}
                  className="w-full"
                >
                  <Lucide icon="Download" className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div className="w-full md:w-3/4">
          <div className="bg-white shadow-md rounded-lg m-4">
            <div className="p-6">
              <h4 className="font-bold">Project Details</h4>

              {/* Tabs for Basic Info and Feedback */}
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
                <li className="mr-2">
                  <button
                    className={`inline-block py-2 px-4 ${activeTab === "feedback"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                      } font-semibold`}
                    onClick={() => setActiveTab("feedback")}
                  >
                    Teacher Feedback
                  </button>
                </li>
              </ul>

              {/* Tab Content */}
              <div className="tab-content">
                {/* Basic Info Tab */}
                {activeTab === "basicInfo" && (
                  <div className="tab-pane active">
                    <h4 className="font-bold">Basic Information</h4>

                    <table className="min-w-full border border-gray-200">
                      <tbody>
                        <tr>
                          <td className="px-4 py-4 font-bold border-b border-gray-200">
                            Project Title
                          </td>
                          <td className="px-4 py-4 border-b border-gray-200">{project.title}</td>
                        </tr>
                        
                        <tr>
                          <td className="px-4 py-4 font-bold border-b border-gray-200">
                            Student Name
                          </td>
                          <td className="px-4 py-4 border-b border-gray-200">
                            {project.studentName || 'Unknown Student'}
                          </td>
                        </tr>

                        <tr>
                          <td className="px-4 py-4 font-bold border-b border-gray-200">
                            Admission Number
                          </td>
                          <td className="px-4 py-4 border-b border-gray-200">{project.studentId || 'N/A'}</td>
                        </tr>

                        <tr>
                          <td className="px-4 py-4 font-bold border-b border-gray-200">
                            Learning Area
                          </td>
                          <td className="px-4 py-4 border-b border-gray-200">
                            {project.subject ? `${project.subject.code} - ${project.subject.name}` : 'Not specified'}
                          </td>
                        </tr>

                        <tr>
                          <td className="px-4 py-4 font-bold border-b border-gray-200">
                            Competency
                          </td>
                          <td className="px-4 py-4 border-b border-gray-200">
                            {project.competency ? `${project.competency.code} - ${project.competency.name}` : 'Not specified'}
                          </td>
                        </tr>

                        <tr>
                          <td className="px-4 py-4 font-bold border-b border-gray-200">
                            PCI
                          </td>
                          <td className="px-4 py-4 border-b border-gray-200">{project.pci}</td>
                        </tr>

                        <tr>
                          <td className="px-4 py-4 font-bold border-b border-gray-200">
                            Evidence Type
                          </td>
                          <td className="px-4 py-4 border-b border-gray-200">
                            <span className="px-2 py-1 text-xs rounded-full bg-info/10 text-info">
                              {project.evidenceType}
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td className="px-4 py-4 font-bold border-b border-gray-200">
                            Status
                          </td>
                          <td className="px-4 py-4 border-b border-gray-200">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              project.status === 'approved'
                                ? "bg-green-100 text-green-800"
                                : project.status === 'rejected'
                                ? "bg-red-100 text-red-800"
                                : project.status === 'reviewed'
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }`}>
                              {project.status}
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <td className="px-4 py-4 font-bold border-b border-gray-200">
                            Submitted Date
                          </td>
                          <td className="px-4 py-4 border-b border-gray-200">
                            {new Date(project.submittedAt).toLocaleDateString()}
                          </td>
                        </tr>

                        <tr>
                          <td className="px-4 py-4 font-bold border-b border-gray-200">
                            Description
                          </td>
                          <td className="px-4 py-4 border-b border-gray-200">{project.description}</td>
                        </tr>

                        <tr>
                          <td className="px-4 py-4 font-bold border-b border-gray-200">
                            Caption
                          </td>
                          <td className="px-4 py-4 border-b border-gray-200">{project.caption}</td>
                        </tr>

                        <tr>
                          <td className="px-4 py-4 font-bold border-b border-gray-200">
                            Reflection
                          </td>
                          <td className="px-4 py-4 border-b border-gray-200">{project.reflection}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Feedback Tab */}
                {activeTab === "feedback" && (
                  <div className="tab-pane active">
                    <h4 className="font-bold">Teacher Feedback</h4>

                    {project.teacherFeedback && project.teacherFeedback.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h5 className="font-semibold">All Teacher Feedback ({project.teacherFeedback.length})</h5>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setShowFeedbackForm(true)}
                          >
                            <Lucide icon="MessageSquare" className="w-4 h-4 mr-2" />
                            Add Feedback
                          </Button>
                        </div>
                        
                        {project.teacherFeedback.map((feedback, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h6 className="font-medium text-gray-900">
                                  Feedback #{index + 1}
                                </h6>
                                <p className="text-sm text-gray-500">
                                  By: {feedback.feedbackBy?.name || feedback.feedbackBy_name || 'Unknown Teacher'} • 
                                  {new Date(feedback.feedbackDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">Rating: {feedback.rating}/5</span>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  feedback.authenticityApproved
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}>
                                  {feedback.authenticityApproved ? 'Approved' : 'Not Approved'}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-700">{feedback.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">No feedback provided yet.</p>
                        <Button
                          variant="primary"
                          onClick={() => setShowFeedbackForm(true)}
                        >
                          <Lucide icon="MessageSquare" className="w-4 h-4 mr-2" />
                          Add Feedback
                        </Button>
                      </div>
                    )}

                    {/* Feedback Form */}
                    {showFeedbackForm && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-semibold mb-4">Add Teacher Feedback</h5>
                        <form onSubmit={handleFeedbackSubmit(onSubmitFeedback)} className="space-y-4">
                          <div>
                            <FormLabel htmlFor="comment">Comment *</FormLabel>
                            <FormTextarea
                              id="comment"
                              rows={4}
                              placeholder="Enter your feedback comment"
                              {...registerFeedback("comment")}
                            />
                            {feedbackErrors.comment && (
                              <p className="text-red-500 text-sm mt-1">{String(feedbackErrors.comment.message)}</p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <FormLabel htmlFor="rating">Rating *</FormLabel>
                              <select
                                id="rating"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...registerFeedback("rating")}
                              >
                                <option value="">Select rating</option>
                                <option value={1}>1 - Poor</option>
                                <option value={2}>2 - Fair</option>
                                <option value={3}>3 - Good</option>
                                <option value={4}>4 - Very Good</option>
                                <option value={5}>5 - Excellent</option>
                              </select>
                              {feedbackErrors.rating && (
                                <p className="text-red-500 text-sm mt-1">{String(feedbackErrors.rating.message)}</p>
                              )}
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="authenticityApproved"
                                className="mr-2"
                                {...registerFeedback("authenticityApproved")}
                              />
                              <FormLabel htmlFor="authenticityApproved">Authenticity Approved</FormLabel>
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline-secondary"
                              onClick={() => setShowFeedbackForm(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              variant="primary"
                              disabled={submittingFeedback}
                            >
                              {submittingFeedback ? (
                                <LoadingIcon icon="oval" className="w-4 h-4 mr-2" />
                              ) : null}
                              Submit Feedback
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File View Modal */}
      {viewModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">View File - {selectedFile.title}</h3>
              <Button
                variant="outline-secondary"
                onClick={() => setViewModal(false)}
              >
                <Lucide icon="X" className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 text-center">
              {selectedFile.type === 'photo' ? (
                <img
                  src={selectedFile.url}
                  alt={selectedFile.title}
                  className="max-w-full max-h-96 mx-auto rounded-lg"
                />
              ) : (
                <video
                  src={selectedFile.url}
                  controls
                  className="max-w-full max-h-96 mx-auto rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      )}

      <Notification getRef={(el) => { notificationRef.current = el; }} />
    </div>
  );
};

export default ProjectDetails;