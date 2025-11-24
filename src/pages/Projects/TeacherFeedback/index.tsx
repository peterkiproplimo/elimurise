import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../base-components/Button";
import {
  FormInput,
  FormLabel,
  FormSelect,
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

// Validation schema for teacher feedback
const feedbackSchema = yup.object({
  comment: yup.string().required("Comment is required"),
  rating: yup.string().required("Rating is required"),
  authenticityApproved: yup.string().required("Authenticity approval is required"),
});

interface ProjectEvidence {
  _id: string;
  title: string;
  description: string;
  studentName: string;
  studentId: string;
  submittedAt: string;
  status: string;
  evidenceType: string;
  mediaUrl?: string;
  cloudinaryData?: {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
  };
  thumbnailUrl?: string;
  competency?: {
    name: string;
    code: string;
  };
  reflection?: string;
  caption?: string;
  teacherFeedback?: Array<{
    comment: string;
    rating: number;
    authenticityApproved: boolean;
    feedbackBy: string;
    feedbackBy_name?: string;
    feedbackDate: string;
  }>;
}

const TeacherFeedback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef<NotificationElement>();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<ProjectEvidence | null>(null);

  const {
    register: registerFeedback,
    handleSubmit: handleFeedbackSubmit,
    formState: { errors: feedbackErrors },
    reset: resetFeedback,
    setValue: setFeedbackValue,
  } = useForm({
    resolver: yupResolver(feedbackSchema),
    defaultValues: {
      comment: "",
      rating: "",
      authenticityApproved: "true",
    },
  });

  useEffect(() => {
    // Get project data from location state
    if (location.state?.project) {
      setProject(location.state.project);
      
      // If editing existing feedback, populate the form
      if (location.state.project.teacherFeedback && location.state.project.teacherFeedback.length > 0) {
        const latestFeedback = location.state.project.teacherFeedback[location.state.project.teacherFeedback.length - 1];
        setFeedbackValue("comment", latestFeedback.comment);
        setFeedbackValue("rating", latestFeedback.rating.toString());
        setFeedbackValue("authenticityApproved", latestFeedback.authenticityApproved.toString());
      }
    } else {
      // If no project data, redirect back to projects
      navigate('/projectsmodule');
    }
  }, [location.state, navigate, setFeedbackValue]);

  const onSubmitFeedback = async (data: any) => {
    if (!project) return;

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}project-evidences/${project._id}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        notificationRef.current?.showToast({
          title: "Success",
          message: "Feedback submitted successfully",
          type: "success",
        });
        
      // Navigate back to projects after successful submission
        setTimeout(() => {
          navigate('/projectsmodule');
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit feedback");
      }
    } catch (error: any) {
      console.error("Error submitting feedback:", error);
      notificationRef.current?.showToast({
        title: "Error",
        message: error.message || "Failed to submit feedback",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/projectsmodule');
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingIcon icon="oval" className="w-8 h-8" />
          <p className="mt-4 text-gray-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification getRef={(el) => { notificationRef.current = el; }} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleGoBack}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Lucide icon="ArrowLeft" className="h-4 w-4" />
                Back to Projects
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add Teacher Feedback</h1>
                <p className="text-gray-600">Provide feedback for student project evidence</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Project Information Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                  <p className="text-gray-900 font-medium">{project.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                  <p className="text-gray-900 font-medium">{project.studentName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Evidence Type</label>
                  <p className="text-gray-900 font-medium capitalize">{project.evidenceType}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Submitted Date</label>
                  <p className="text-gray-900 font-medium">
                    {new Date(project.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {project.description && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <p className="text-gray-900">{project.description}</p>
                </div>
              )}
              {project.reflection && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Reflection</label>
                  <p className="text-gray-900 italic">"{project.reflection}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Feedback Form */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Teacher Feedback</h2>
              
              <form onSubmit={handleFeedbackSubmit(onSubmitFeedback)}>
                <div className="space-y-6">
                  <div>
                    <FormLabel htmlFor="comment">Comment *</FormLabel>
                    <FormTextarea
                      id="comment"
                      placeholder="Enter your detailed feedback comment"
                      rows={6}
                      {...registerFeedback("comment")}
                    />
                    {feedbackErrors.comment && (
                      <div className="mt-1 text-red-500 text-sm">{String(feedbackErrors.comment.message)}</div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <FormLabel htmlFor="rating">Rating (1-5) *</FormLabel>
                      <FormSelect id="rating" {...registerFeedback("rating")}>
                        <option value="">Select rating</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Below Average</option>
                        <option value="3">3 - Average</option>
                        <option value="4">4 - Good</option>
                        <option value="5">5 - Excellent</option>
                      </FormSelect>
                      {feedbackErrors.rating && (
                        <div className="mt-1 text-red-500 text-sm">{String(feedbackErrors.rating.message)}</div>
                      )}
                    </div>
                    
                    <div>
                      <FormLabel htmlFor="authenticityApproved">Authenticity Approved *</FormLabel>
                      <FormSelect id="authenticityApproved" {...registerFeedback("authenticityApproved")}>
                        <option value="true">Yes - Evidence is authentic</option>
                        <option value="false">No - Evidence needs verification</option>
                      </FormSelect>
                      {feedbackErrors.authenticityApproved && (
                        <div className="mt-1 text-red-500 text-sm">{String(feedbackErrors.authenticityApproved.message)}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-8">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={handleGoBack}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <LoadingIcon icon="oval" className="w-4 h-4" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Lucide icon="Check" className="w-4 h-4" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherFeedback;
