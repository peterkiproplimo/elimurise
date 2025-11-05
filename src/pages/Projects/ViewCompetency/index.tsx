import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../base-components/Button";
import Lucide from "../../../base-components/Lucide";
import LoadingIcon from "../../../base-components/LoadingIcon";

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

const ViewCompetency: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [competency, setCompetency] = useState<Competency | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get competency data from location state
    if (location.state?.competency) {
      setCompetency(location.state.competency);
    } else {
      // If no competency data, redirect back to competencies
      navigate('/home/competencies');
    }
  }, [location.state, navigate]);

  const handleGoBack = () => {
    navigate('/home/competencies');
  };

  const handleEdit = () => {
    if (competency) {
      navigate('/home/competencies/edit', {
        state: { competency }
      });
    }
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

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      knowledge: "Knowledge",
      skill: "Skill",
      attitude: "Attitude",
      value: "Value"
    };
    return categories[category] || category;
  };

  const getLevelLabel = (level: string) => {
    const levels: { [key: string]: string } = {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      expert: "Expert"
    };
    return levels[level] || level;
  };

  const getDomainLabel = (domain: string) => {
    const domains: { [key: string]: string } = {
      cognitive: "Cognitive",
      affective: "Affective",
      psychomotor: "Psychomotor",
      social: "Social"
    };
    return domains[domain] || domain;
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Competency Details</h1>
                <p className="text-gray-600">View competency information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleEdit}
                variant="primary"
                className="flex items-center gap-2"
              >
                <Lucide icon="Edit" className="h-4 w-4" />
                Edit Competency
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Competency Name</label>
                  <p className="text-gray-900 font-medium text-lg">{competency.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Competency Code</label>
                  <p className="text-gray-900 font-medium text-lg font-mono">{competency.code}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    competency.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {competency.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <p className="text-gray-900 font-medium">{getCategoryLabel(competency.category)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <p className="text-gray-900 font-medium">{getLevelLabel(competency.level)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
                  <p className="text-gray-900 font-medium">{getDomainLabel(competency.domain)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {competency.description && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-900 leading-relaxed">{competency.description}</p>
              </div>
            </div>
          )}

          {/* Learning Area / Subject */}
          {(competency.subject || competency.subjectName) && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Area / Subject</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                    <p className="text-gray-900 font-medium">
                      {competency.subject?.name || competency.subjectName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
                    <p className="text-gray-900 font-medium font-mono">
                      {competency.subject?.code || competency.subjectCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Framework Information */}
          {(competency.framework || competency.version) && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Framework Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {competency.framework && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Framework</label>
                      <p className="text-gray-900 font-medium">{competency.framework}</p>
                    </div>
                  )}
                  {competency.version && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
                      <p className="text-gray-900 font-medium">{competency.version}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Creation Information */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Creation Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created By</label>
                  <p className="text-gray-900 font-medium">
                    {competency.createdByName || competency.createdByEmail || 'Unknown'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created Date</label>
                  <p className="text-gray-900 font-medium">
                    {new Date(competency.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
                  <p className="text-gray-900 font-medium">
                    {new Date(competency.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCompetency;
