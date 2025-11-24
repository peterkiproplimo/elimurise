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
import * as ApiService from "../../../services/auth";

// Interfaces
interface LearningArea {
  _id: string;
  name: string;
  code: string;
}

interface Subject {
  _id: string;
  name: string;
  code: string;
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

interface Subject {
  _id: string;
  name: string;
  code: string;
}

const Competencies = () => {
  const navigate = useNavigate();
  
  // Get user data from localStorage
  const auth = localStorage.getItem("@AuthData");
  const auth_data = auth ? JSON.parse(auth) : null;
  const user = auth_data?.user;

  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [learningAreas, setLearningAreas] = useState<LearningArea[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [competencyToDelete, setCompetencyToDelete] = useState<Competency | null>(null);
  const [activeTab, setActiveTab] = useState("list"); // "list" or "add"
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompetencies, setTotalCompetencies] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLevel, setFilterLevel] = useState("");
  const [filterDomain, setFilterDomain] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  const notificationRef = useRef<NotificationElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(competencySchema),
  });

  // Fetch subjects and learning areas for dropdown
  const fetchSubjects = async () => {
    try {
      // Fetch subjects
      const subjectsResponse = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}subjects?limit=1000&status=active`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (subjectsResponse.ok) {
        const subjectsData = await subjectsResponse.json();
        setSubjects(subjectsData.subjects);
      }

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
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  // Fetch competencies
  const fetchCompetencies = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (searchTerm) params.append("search", searchTerm);
      if (filterCategory) params.append("category", filterCategory);
      if (filterLevel) params.append("level", filterLevel);
      if (filterDomain) params.append("domain", filterDomain);
      if (filterSubject) params.append("subject", filterSubject);

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}competencies?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCompetencies(data.competencies);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setTotalCompetencies(data.total);
      } else {
        throw new Error("Failed to fetch competencies");
      }
    } catch (error) {
      console.error("Error fetching competencies:", error);
      notificationRef.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchCompetencies();
  }, [searchTerm, filterCategory, filterLevel, filterDomain, filterSubject]);

  // Create competency
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_API_ENDPOINT}competencies`;
      const method = "POST";

      // Prepare the data with subjectId and subjectName
      const submitData = { ...data };
      
      // Add user information for createdBy field
      if (user) {
        submitData.createdBy = user._id;
        submitData.createdByName = `${user.firstname} ${user.lastname}`;
        submitData.createdByEmail = user.email;
      } else {
        throw new Error("User authentication data not found. Please log in again.");
      }
      
      // If a learning area is selected, find its details and add subjectId and subjectName
      if (data.subject && data.subject.trim() !== '') {
        const selectedLearningArea = learningAreas.find(la => la._id === data.subject);
        if (selectedLearningArea) {
          submitData.subjectId = selectedLearningArea._id;
          submitData.subjectName = selectedLearningArea.name;
          submitData.subjectCode = selectedLearningArea.code;
        }
        // Remove the original subject field to avoid confusion
        delete submitData.subject;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        notificationRef.current?.showToast();
        setActiveTab("list");
        reset();
        fetchCompetencies(currentPage);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save competency");
      }
    } catch (error: any) {
      console.error("Error saving competency:", error);
      notificationRef.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  // Delete competency
  const handleDelete = async () => {
    if (!competencyToDelete) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}competencies/${competencyToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
      notificationRef.current?.showToast();
        setDeleteConfirmationModal(false);
        setCompetencyToDelete(null);
        fetchCompetencies(currentPage);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete competency");
      }
    } catch (error: any) {
      console.error("Error deleting competency:", error);
      notificationRef.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  // Toggle competency status
  const toggleStatus = async (competency: Competency) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}competencies/${competency._id}/toggle-status`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
      notificationRef.current?.showToast();
        fetchCompetencies(currentPage);
      } else {
        throw new Error("Failed to toggle competency status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      notificationRef.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  // Edit competency
  const handleEdit = (competency: Competency) => {
    navigate('/home/competencies/edit', {
      state: { competency }
    });
  };

  const categories = [
    { value: "knowledge", label: "Knowledge" },
    { value: "skill", label: "Skill" },
    { value: "attitude", label: "Attitude" },
    { value: "behavior", label: "Behavior" },
    { value: "technical", label: "Technical" },
    { value: "soft", label: "Soft Skills" },
  ];

  const levels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "expert", label: "Expert" },
  ];

  const domains = [
    { value: "cognitive", label: "Cognitive" },
    { value: "psychomotor", label: "Psychomotor" },
    { value: "affective", label: "Affective" },
    { value: "social", label: "Social" },
    { value: "professional", label: "Professional" },
  ];

  const statuses = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="mr-auto text-lg font-medium">Competencies Management</h2>
      </div>

      {/* Tabs */}
      <div className="mt-5">
        <ul className="flex border-b border-gray-200 mb-4">
          <li className="mr-2">
            <button
              className={`inline-block py-2 px-4 font-semibold ${
                activeTab === "list"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("list")}
            >
              Competencies List
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-2 px-4 font-semibold ${
                activeTab === "add"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab("add")}
            >
              Add Competency
            </button>
          </li>
        </ul>
      </div>

      {/* List Tab Content */}
      {activeTab === "list" && (
        <>
      <div className="grid grid-cols-1 gap-4 mt-5 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <FormLabel htmlFor="search">Search</FormLabel>
          <FormInput
            id="search"
            type="text"
            placeholder="Search competencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <FormLabel htmlFor="category-filter">Category</FormLabel>
          <FormSelect
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </FormSelect>
        </div>
        <div>
          <FormLabel htmlFor="level-filter">Level</FormLabel>
          <FormSelect
            id="level-filter"
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
          >
            <option value="">All Levels</option>
            {levels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </FormSelect>
        </div>
        <div>
          <FormLabel htmlFor="domain-filter">Domain</FormLabel>
          <FormSelect
            id="domain-filter"
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
          >
            <option value="">All Domains</option>
            {domains.map((domain) => (
              <option key={domain.value} value={domain.value}>
                {domain.label}
              </option>
            ))}
          </FormSelect>
        </div>
        <div>
          <FormLabel htmlFor="subject-filter">Subject</FormLabel>
          <FormSelect
            id="subject-filter"
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.code} - {subject.name}
              </option>
            ))}
          </FormSelect>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row">
        <Button
          variant="primary"
          className="mr-2 mb-2"
          onClick={() => setActiveTab("add")}
        >
          <Lucide icon="Plus" className="w-4 h-4 mr-2" />
          Add Competency
        </Button>
      </div>

      {/* Competencies Table */}
      <div className="mt-5">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center mt-5">
              <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
            </div>
          ) : competencies.length === 0 ? (
            <div className="flex flex-col items-center mt-10 bg-white p-8">
              <p className="text-xl text-slate-500 ">No competencies found</p>
            </div>
          ) : (
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th className="whitespace-nowrap">Code</Table.Th>
                  <Table.Th className="whitespace-nowrap">Name</Table.Th>
                  <Table.Th className="whitespace-nowrap">Category</Table.Th>
                  <Table.Th className="whitespace-nowrap">Level</Table.Th>
                  <Table.Th className="whitespace-nowrap">Domain</Table.Th>
                  <Table.Th className="whitespace-nowrap">Subject</Table.Th>
                  <Table.Th className="whitespace-nowrap">Status</Table.Th>
                  <Table.Th className="text-center whitespace-nowrap">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {competencies.map((competency, index) => (
                  <Table.Tr key={competency._id}>
                    <Table.Td>{competency.code}</Table.Td>
                    <Table.Td>{competency.name}</Table.Td>
                    <Table.Td>
                      <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                        {competency.category}
                      </span>
                    </Table.Td>
                    <Table.Td>{competency.level}</Table.Td>
                    <Table.Td>{competency.domain}</Table.Td>
                    <Table.Td>
                      {competency.subject ? (
                        <span className="text-sm">
                          {competency.subject.code} - {competency.subject.name}
                        </span>
                      ) : competency.subjectName ? (
                        <span className="text-sm">
                          {competency.subjectCode} - {competency.subjectName}
                        </span>
                      ) : (
                        <span className="text-slate-400">General</span>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          competency.isActive
                            ? "bg-success/10 text-success"
                            : "bg-danger/10 text-danger"
                        }`}
                      >
                        {competency.status}
                      </span>
                    </Table.Td>
                    <Table.Td>
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="mr-2"
                          onClick={() => navigate('/home/competencies/view', {
                            state: { competency }
                          })}
                          title="View Competency"
                        >
                          <Lucide icon="Eye" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="mr-2"
                          onClick={() => handleEdit(competency)}
                        >
                          <Lucide icon="Edit" className="w-4 h-4" />
                        </Button>
          
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => {
                            setCompetencyToDelete(competency);
                            setDeleteConfirmationModal(true);
                          }}
                        >
                          <Lucide icon="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-5">
            <Pagination />
          </div>
        )}
      </div>
        </>
      )}

      {/* Add Tab Content */}
      {activeTab === "add" && (
        <div className="mt-5">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h4 className="font-bold mb-4">Add New Competency</h4>
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FormLabel htmlFor="name">Competency Name *</FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  placeholder="Enter competency name"
                  {...register("name")}
                />
                {errors.name && (
                    <div className="mt-1 text-danger">{String(errors.name.message)}</div>
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
                    <div className="mt-1 text-danger">{String(errors.code.message)}</div>
                )}
              </div>
              <div className="sm:col-span-2">
                <FormLabel htmlFor="description">Description</FormLabel>
                <FormTextarea
                  id="description"
                  placeholder="Enter competency description"
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
                    <div className="mt-1 text-danger">{String(errors.category.message)}</div>
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
                    <div className="mt-1 text-danger">{String(errors.level.message)}</div>
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
                    <div className="mt-1 text-danger">{String(errors.domain.message)}</div>
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
                  defaultValue="1.0"
                  {...register("version")}
                />
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button
                type="button"
                variant="outline-secondary"
                className="mr-2"
                  onClick={() => setActiveTab("list")}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? <LoadingIcon icon="oval" className="w-4 h-4" /> : "Save"}
              </Button>
            </div>
          </form>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      <Dialog open={deleteConfirmationModal} onClose={() => setDeleteConfirmationModal(false)}>
        <Dialog.Panel>
          <Dialog.Title>Delete Competency</Dialog.Title>
          <div className="mt-4">
            <p>Are you sure you want to delete the competency "{competencyToDelete?.name}"?</p>
            <p className="text-sm text-slate-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end mt-6">
            <Button
              type="button"
              variant="outline-secondary"
              className="mr-2"
              onClick={() => setDeleteConfirmationModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? <LoadingIcon icon="oval" className="w-4 h-4" /> : "Delete"}
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>

      <Notification getRef={(el) => { notificationRef.current = el; }} />
    </>
  );
};

export default Competencies;