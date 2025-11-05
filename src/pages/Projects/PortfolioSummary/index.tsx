import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../base-components/Button";
import Card from "../../../base-components/Card";
import Table from "../../../base-components/Table";
import Notification, { NotificationElement } from "../../../base-components/Notification";
import LoadingIcon from "../../../base-components/LoadingIcon";
import * as ApiService from "../../../services/auth";
import portfolioSummaryService from "../../../services/portfolioSummaryService";
import { 
  FileText, 
  Download, 
  Eye, 
  Search,
  Filter,
  Calendar,
  User,
  Award,
  BookOpen,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface Student {
  _id: string;
  adm_no: string;
  first_name: string;
  last_name: string;
  surname?: string;
  status?: string;
}

interface PortfolioSummary {
  student: {
    _id: string;
    adm_no: string;
    first_name: string;
    last_name: string;
    surname: string;
    fullName: string;
  };
  academicYear: string;
  term: string;
  generatedAt: string;
  statistics: {
    totalEvidences: number;
    totalCompetencies: number;
    totalLearningAreas: number;
    averageRating: number;
    evidenceByType: {
      photo: number;
      video: number;
    };
    photoCount: number;
    videoCount: number;
  };
  competenciesAchieved: Array<{
    competency: {
      _id: string;
      name: string;
      code: string;
    };
    count: number;
    evidences: any[];
  }>;
  learningAreasCovered: Array<{
    learningArea: {
      _id: string;
      name: string;
      code: string;
    };
    count: number;
    evidences: any[];
  }>;
  reflections: Array<{
    title: string;
    reflection: string;
    learningArea: string;
    competency: string;
    date: string;
  }>;
  teacherFeedbacks: Array<{
    evidenceTitle: string;
    comment: string;
    rating: number;
    feedbackBy: string;
    date: string;
    authenticityApproved: boolean;
  }>;
  strengths: string[];
  improvements: string[];
  projectEvidences: any[];
  summaryInsights: {
    mostActiveLearningArea: string;
    topCompetency: string;
    recentActivity: string | null;
  };
}

const PortfolioSummary: React.FC = () => {
  const navigate = useNavigate();
  const notify = useRef<NotificationElement>();
  
  // State management
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  
  // Search and filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [limit] = useState(10);

  // Load students on component mount
  useEffect(() => {
    loadStudents();
  }, [currentPage, searchTerm]);

  // Filter students based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.adm_no.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [students, searchTerm]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getLearnersEnroll(
        {
          page: currentPage,
          search: searchTerm,
          limit,
          status: ["P"], // Active students
        },
        {} // No strand filter
      );
      
      const studentsData = response.data || response.learners || [];
      setStudents(studentsData);
      setTotalStudents(response.pagination?.total || studentsData.length);
      setTotalPages(response.pagination?.total_pages || 1);
    } catch (error) {
      console.error('Error loading students:', error);
      notify.current?.showToast();
    } finally {
      setLoading(false);
    }
  };



  const handleStudentSelect = (student: Student) => {
    navigate('/home/portfolio-summary/generate', { state: { student } });
  };

  const getStudentName = (student: Student) => {
    return `${student.first_name} ${student.last_name} ${student.surname || ''}`.trim();
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="space-y-6">
      <Notification getRef={(el) => { notify.current = el; }} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Summary Generator</h1>
          <p className="text-muted-foreground">Generate comprehensive portfolio reports for students</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/home/portfolio-summary/pdf-test')}
            variant="outline-secondary"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Test PDF
          </Button>
          <Button
            onClick={() => navigate('/home/portfolio-summary/generate')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Generate Portfolio
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search students by name or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Students Table */}
      <Card>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingIcon icon="oval" color="primary" className="w-8 h-8" />
            </div>
          ) : (
            <>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Student Name</Table.Th>
                    <Table.Th>Admission Number</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredStudents.map((student) => (
                    <Table.Tr key={student._id}>
                      <Table.Td>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{getStudentName(student)}</div>
                          </div>
                        </div>
                      </Table.Td>
                      <Table.Td>
                        <span className="font-mono text-sm">{student.adm_no}</span>
                      </Table.Td>
                 
                      <Table.Td>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => handleStudentSelect(student)}
                            className="flex items-center gap-1"
                          >
                            <FileText className="h-4 w-4" />
                            Generate
                          </Button>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

    </div>
  );
};

export default PortfolioSummary;