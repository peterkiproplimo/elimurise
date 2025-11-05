import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../../../base-components/Button';
import Card from '../../../base-components/Card';
import Notification, { NotificationElement } from '../../../base-components/Notification';
import LoadingIcon from '../../../base-components/LoadingIcon';
import portfolioSummaryService from '../../../services/portfolioSummaryService';
import { 
  ArrowLeft,
  User,
  Image
} from 'lucide-react';

// Validation schema - no longer needed, just for form submission
const portfolioGenerationSchema = yup.object({});

interface Student {
  _id: string;
  first_name: string;
  last_name: string;
  surname?: string;
  adm_no: string;
  gender?: string;
  nemis_no?: string;
  guardian?: {
    _id?: string;
    first_name: string;
    last_name: string;
    surname?: string;
    email?: string;
    phone?: string;
    id_no?: string;
    gender?: string;
    schoolCode?: string;
    school?: string;
    status?: number;
    createdAt?: string;
    updatedAt?: string;
  };
  grade?: {
    name: string;
    level: number;
  };
  stream?: {
    name: string;
  };
  school?: string;
  current_session?: string;
  guardian_relationship?: string;
}

const PortfolioGenerationForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useRef<NotificationElement>();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);

  // Form setup
  const {
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(portfolioGenerationSchema),
    defaultValues: {}
  });

  // Get student data from location state and enrich from remote endpoint
  useEffect(() => {
    const selected = location.state?.student as Student | undefined;
    if (!selected?._id) return;

    // Set basic details immediately
    setStudentDetails(selected);

    // Fetch full learner history to enrich details (grade/level, stream, session, guardian)
    const controller = new AbortController();
    const fetchHistory = async () => {
      try {
        setLoading(true);
        // Use the same access token used across the app (as for learners)
        const authRaw = localStorage.getItem('@AuthData');
        const authObj = authRaw ? JSON.parse(authRaw) : null;
        const bearer = authObj?.user?.token ? `Bearer ${authObj.user.token}` : undefined;
        const res = await fetch(`https://demo.elimurise.com/api/portal/learners/${selected._id}/history?`, {
          method: 'GET',
          signal: controller.signal,
          headers: bearer ? { 'Authorization': bearer } : undefined
        });
        if (!res.ok) return; // keep basic details if fails
        const json = await res.json();
        const history = Array.isArray(json?.data) && json.data.length > 0 ? json.data[0] : null;
        if (!history) return;

        const learner = history.learner || {};
        const toGrade = history.to_grade || {};
        const toStream = history.to_stream || {};

        // Build enriched student details matching UI needs - preserve all guardian fields
        const enriched: Student = {
          _id: learner._id || selected._id,
          first_name: learner.first_name || selected.first_name,
          last_name: learner.last_name || selected.last_name,
          surname: learner.surname || selected.surname,
          adm_no: learner.adm_no || selected.adm_no,
          gender: learner.gender || selected.gender,
          nemis_no: learner.nemis_no || selected.nemis_no,
          // Preserve complete guardian object with all fields
          guardian: learner.guardian ? {
            _id: learner.guardian._id,
            first_name: learner.guardian.first_name,
            last_name: learner.guardian.last_name,
            surname: learner.guardian.surname,
            id_no: learner.guardian.id_no,
            email: learner.guardian.email,
            phone: learner.guardian.phone,
            gender: learner.guardian.gender,
            schoolCode: learner.guardian.schoolCode,
            school: learner.guardian.school,
            status: learner.guardian.status,
            createdAt: learner.guardian.createdAt,
            updatedAt: learner.guardian.updatedAt
          } : selected.guardian,
          grade: toGrade?._id ? { name: toGrade.name, level: toGrade.level } : selected.grade,
          stream: toStream?._id ? { name: toStream.name } : selected.stream,
          school: history.school?.name,
          current_session: history.to_session || learner.current_session || selected.current_session,
          guardian_relationship: learner.guardian_relationship || selected.guardian_relationship
        } as Student;

        setStudentDetails(enriched);
      } catch (e) {
        // swallow errors and keep basic details
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    return () => controller.abort();
  }, [location.state]);

  const handleGeneratePreview = async () => {
    try {
      setGeneratingPDF(true);
      const studentId = location.state?.student?._id;
      if (!studentId) {
        notify.current?.showToast();
        return;
      }
      
      const summaryData = await portfolioSummaryService.generatePortfolioSummary(studentId, {});
      
      // Navigate to the PDF viewer page with portfolio data
      navigate('/portfolio-summary/pdf-viewer', {
        state: { portfolioData: summaryData }
      });
      
      notify.current?.showToast();
    } catch (error) {
      console.error('Error generating preview:', error);
      notify.current?.showToast();
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleGoBack = () => {
    navigate('/portfolio-summary');
  };

  const getStudentName = (student: Student) => {
    return `${student.first_name} ${student.last_name} ${student.surname || ''}`.trim();
  };

  const selectedStudent = studentDetails || (location.state?.student as Student | undefined);

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification getRef={(el) => { notify.current = el; }} />
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleGoBack}
                    variant="outline-secondary"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Portfolio Summary
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Generate Portfolio Summary</h1>
                <p className="text-gray-600">Configure and generate comprehensive portfolio reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Student Information Display */}
          {selectedStudent && (
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-3">Personal Details</h3>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Full Name:</span>
                          <p className="font-medium text-gray-900">{getStudentName(selectedStudent)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Admission Number:</span>
                          <p className="font-medium text-gray-900">{selectedStudent.adm_no}</p>
                        </div>
                        {selectedStudent.nemis_no && (
                          <div>
                            <span className="text-sm text-gray-600">NEMIS No.:</span>
                            <p className="font-medium text-gray-900">{selectedStudent.nemis_no}</p>
                          </div>
                        )}
                        {selectedStudent.gender && (
                          <div>
                            <span className="text-sm text-gray-600">Gender:</span>
                            <p className="font-medium text-gray-900">{selectedStudent.gender}</p>
                          </div>
                        )}
                        {selectedStudent.school && (
                          <div>
                            <span className="text-sm text-gray-600">School:</span>
                            <p className="font-medium text-gray-900">{selectedStudent.school}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Guardian Information */}
                    {selectedStudent.guardian && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="font-medium text-green-900 mb-3">Guardian Information</h3>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-gray-600">Guardian Name:</span>
                            <p className="font-medium text-gray-900">
                              {selectedStudent.guardian.first_name} {selectedStudent.guardian.last_name} {selectedStudent.guardian.surname || ''}
                            </p>
                          </div>
                          {selectedStudent.guardian_relationship && (
                            <div>
                              <span className="text-sm text-gray-600">Relationship:</span>
                              <p className="font-medium text-gray-900">{selectedStudent.guardian_relationship}</p>
                            </div>
                          )}
                          {selectedStudent.guardian._id && (
                            <div>
                              <span className="text-sm text-gray-600">Guardian ID:</span>
                              <p className="font-medium text-gray-900">{selectedStudent.guardian._id}</p>
                            </div>
                          )}
                          {selectedStudent.guardian.id_no && (
                            <div>
                              <span className="text-sm text-gray-600">ID Number:</span>
                              <p className="font-medium text-gray-900">{selectedStudent.guardian.id_no}</p>
                            </div>
                          )}
                          {selectedStudent.guardian.gender && (
                            <div>
                              <span className="text-sm text-gray-600">Gender:</span>
                              <p className="font-medium text-gray-900">{selectedStudent.guardian.gender}</p>
                            </div>
                          )}
                          {selectedStudent.guardian.email && (
                            <div>
                              <span className="text-sm text-gray-600">Email:</span>
                              <p className="font-medium text-gray-900">{selectedStudent.guardian.email}</p>
                            </div>
                          )}
                          {selectedStudent.guardian.phone && (
                            <div>
                              <span className="text-sm text-gray-600">Phone:</span>
                              <p className="font-medium text-gray-900">{selectedStudent.guardian.phone}</p>
                            </div>
                          )}
                          {selectedStudent.guardian.schoolCode && (
                            <div>
                              <span className="text-sm text-gray-600">School Code:</span>
                              <p className="font-medium text-gray-900">{selectedStudent.guardian.schoolCode}</p>
                            </div>
                          )}
                          {selectedStudent.guardian.school && (
                            <div>
                              <span className="text-sm text-gray-600">School ID:</span>
                              <p className="font-medium text-gray-900">{selectedStudent.guardian.school}</p>
                            </div>
                          )}
                          {selectedStudent.guardian.status !== undefined && (
                            <div>
                              <span className="text-sm text-gray-600">Status:</span>
                              <p className="font-medium text-gray-900">{selectedStudent.guardian.status === 0 ? 'Active' : 'Inactive'}</p>
                            </div>
                          )}
                          {selectedStudent.guardian.createdAt && (
                            <div>
                              <span className="text-sm text-gray-600">Created At:</span>
                              <p className="font-medium text-gray-900">{new Date(selectedStudent.guardian.createdAt).toLocaleDateString()}</p>
                            </div>
                          )}
                          {selectedStudent.guardian.updatedAt && (
                            <div>
                              <span className="text-sm text-gray-600">Updated At:</span>
                              <p className="font-medium text-gray-900">{new Date(selectedStudent.guardian.updatedAt).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h3 className="font-medium text-purple-900 mb-3">Academic Details</h3>
                      <div className="space-y-2">
                        {selectedStudent.grade && (
                          <div>
                            <span className="text-sm text-gray-600">Grade:</span>
                            <p className="font-medium text-gray-900">{selectedStudent.grade.name} (Level {selectedStudent.grade.level})</p>
                          </div>
                        )}
                        {selectedStudent.stream && (
                          <div>
                            <span className="text-sm text-gray-600">Stream:</span>
                            <p className="font-medium text-gray-900">{selectedStudent.stream.name}</p>
                          </div>
                        )}
                        {selectedStudent.current_session && (
                          <div>
                            <span className="text-sm text-gray-600">Session:</span>
                            <p className="font-medium text-gray-900">{selectedStudent.current_session}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Preview Button */}
                <div className="flex justify-end gap-3 pt-6 mt-6 border-t">
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={handleGoBack}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    type="button"
                    variant="primary" 
                    onClick={handleGeneratePreview}
                    disabled={generatingPDF}
                    className="flex items-center gap-2"
                  >
                    {generatingPDF ? (
                      <>
                        <LoadingIcon icon="oval" className="w-4 h-4" />
                        Generating Preview...
                      </>
                    ) : (
                      <>
                        <Image className="h-4 w-4" />
                        Generate Preview
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioGenerationForm;
