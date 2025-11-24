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
import * as ApiService from "../../../services/auth";

// Interfaces
interface LearningArea {
  _id: string;
  name: string;
  code: string;
}

interface Competency {
  _id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  level: string;
  domain: string;
  subject?: {
    _id: string;
    name: string;
    code: string;
  };
  subjectId?: string;
  subjectName?: string;
  subjectCode?: string;
  createdBy?: string;
  createdByName?: string;
  createdByEmail?: string;
  framework: string;
  version: string;
  isActive: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Validation schema
const competencySchema = yup.object({
  name: yup.string().required("Competency name is required"),
  code: yup.string().required("Competency code is required"),
  description: yup.string(),
  category: yup.string().required("Category is required"),
  level: yup.string().required("Level is required"),
  domain: yup.string().required("Domain is required"),
  subject: yup.string(),
  framework: yup.string(),
  version: yup.string(),
});

const EditCompetency: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef<NotificationElement>();
  const [loading, setLoading] = useState(false);
  const [competency, setCompetency] = useState<Competency | null>(null);
  const [learningAreas, setLearningAreas] = useState<LearningArea[]>([]);

  // Get user data from localStorage
  const auth = localStorage.getItem("@AuthData");
  const auth_data = auth ? JSON.parse(auth) : null;
  const user = auth_data?.user;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(competencySchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      category: "",
      level: "",
      domain: "",
      subject: "",
      framework: "",
      version: "",
    },
  });

  useEffect(() => {
    // Get competency data from location state
    if (location.state?.competency) {
      setCompetency(location.state.competency);
      populateForm(location.state.competency);
    } else {
      // If no competency data, redirect back to competencies
      navigate('/home/competencies');
    }

    // Fetch learning areas
    fetchLearningAreas();
  }, [location.state, navigate]);

  const fetchLearningAreas = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}learning-areas?limit=1000&status=active`
      );
      if (response.ok) {
        const data = await response.json();
        setLearningAreas(data.data || data.learningAreas || []);
      }
    } catch (error) {
      console.error("Error fetching learning areas:", error);
    }
  };

  const populateForm = (competency: Competency) => {
    setValue("name", competency.name);
    setValue("code", competency.code);
    setValue("description", competency.description || "");
    setValue("category", competency.category);
    setValue("level", competency.level);
    setValue("domain", competency.domain);
    
    // Handle both old subject object format and new subjectId format
    const subjectId = competency.subject?._id || competency.subjectId || "";
    setValue("subject", subjectId);
    setValue("framework", competency.framework || "");
    setValue("version", competency.version || "");
  };

  const onSubmit = async (data: any) => {
    if (!competency) return;

    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_ENDPOINT}competencies/${competency._id}`;
      const method = "PUT";

      // Prepare the data with subjectId and subjectName
      const submitData = { ...data };
      
      // Add user information for createdBy field
      if (user) {
        submitData.createdBy = user._id;
        submitData.createdByName = user.name;
        submitData.createdByEmail = user.email;
      }

      // Add subject information if subject is selected
      if (data.subject && data.subject.trim() !== '') {
        const selectedLearningArea = learningAreas.find(la => la._id === data.subject);
        if (selectedLearningArea) {
          submitData.subjectId = selectedLearningArea._id;
          submitData.subjectName = selectedLearningArea.name;
          submitData.subjectCode = selectedLearningArea.code;
        }
      } else {
        // Remove subject field if empty to avoid ObjectId casting error
        delete submitData.subject;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        notificationRef.current?.showToast({
          title: "Success",
          message: "Competency updated successfully",
          type: "success",
        });
        
        // Navigate back to competencies after successful update
        setTimeout(() => {
          navigate('/home/competencies');
        }, 1500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update competency");
      }
    } catch (error: any) {
      console.error("Error updating competency:", error);
      notificationRef.current?.showToast({
        title: "Error",
        message: error.message || "Failed to update competency",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/home/competencies');
  };

  if (!competency) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingIcon icon="oval" className="w-8 h-8" />
          <p className="mt-4 text-gray-600">Loading competency details...</p>
        </div>
      </div>
    );
  }

  const categories = [
    { value: "knowledge", label: "Knowledge" },
    { value: "skill", label: "Skill" },
    { value: "attitude", label: "Attitude" },
    { value: "value", label: "Value" },
  ];

  const levels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" },
  ];

  const domains = [
    { value: "cognitive", label: "Cognitive" },
    { value: "affective", label: "Affective" },
    { value: "psychomotor", label: "Psychomotor" },
    { value: "social", label: "Social" },
  ];

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
                Back to Competencies
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Competency</h1>
                <p className="text-gray-600">Update competency information</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Edit Form */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Update Competency</h2>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <FormLabel htmlFor="name">Competency Name *</FormLabel>
                    <FormInput
                      id="name"
                      type="text"
                      placeholder="Enter competency name"
                      {...register("name")}
                    />
                    {errors.name && (
                      <div className="mt-1 text-red-500 text-sm">{String(errors.name.message)}</div>
                    )}
                  </div>
                  <div>
                    <FormLabel htmlFor="code">Competency Code *</FormLabel>
                    <FormInput
                      id="code"
                      type="text"
                      placeholder="Enter competency code"
                      {...register("code")}
                    />
                    {errors.code && (
                      <div className="mt-1 text-red-500 text-sm">{String(errors.code.message)}</div>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <FormTextarea
                      id="description"
                      placeholder="Enter competency description"
                      rows={4}
                      {...register("description")}
                    />
                  </div>
                  <div>
                    <FormLabel htmlFor="category">Category *</FormLabel>
                    <FormSelect id="category" {...register("category")}>
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </FormSelect>
                    {errors.category && (
                      <div className="mt-1 text-red-500 text-sm">{String(errors.category.message)}</div>
                    )}
                  </div>
                  <div>
                    <FormLabel htmlFor="level">Level *</FormLabel>
                    <FormSelect id="level" {...register("level")}>
                      <option value="">Select level</option>
                      {levels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </FormSelect>
                    {errors.level && (
                      <div className="mt-1 text-red-500 text-sm">{String(errors.level.message)}</div>
                    )}
                  </div>
                  <div>
                    <FormLabel htmlFor="domain">Domain *</FormLabel>
                    <FormSelect id="domain" {...register("domain")}>
                      <option value="">Select domain</option>
                      {domains.map((domain) => (
                        <option key={domain.value} value={domain.value}>
                          {domain.label}
                        </option>
                      ))}
                    </FormSelect>
                    {errors.domain && (
                      <div className="mt-1 text-red-500 text-sm">{String(errors.domain.message)}</div>
                    )}
                  </div>
                  <div>
                    <FormLabel htmlFor="subject">Learning Area / Subject</FormLabel>
                    <FormSelect id="subject" {...register("subject")}>
                      <option value="">Select learning area (optional)</option>
                      {learningAreas.map((learningArea) => (
                        <option key={learningArea._id} value={learningArea._id}>
                          {learningArea.code} - {learningArea.name}
                        </option>
                      ))}
                    </FormSelect>
                  </div>
                  <div>
                    <FormLabel htmlFor="framework">Framework</FormLabel>
                    <FormInput
                      id="framework"
                      type="text"
                      placeholder="Enter framework name"
                      {...register("framework")}
                    />
                  </div>
                  <div>
                    <FormLabel htmlFor="version">Version</FormLabel>
                    <FormInput
                      id="version"
                      type="text"
                      placeholder="Enter version"
                      {...register("version")}
                    />
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
                        Updating...
                      </>
                    ) : (
                      <>
                        <Lucide icon="Check" className="w-4 h-4" />
                        Update Competency
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

export default EditCompetency;
