import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../../base-components/Button";
import Card from "../../../base-components/Card";
import { convertElementToPDF } from "../../../utils/htmlToPdf";
import { 
  ArrowLeft,
  Download, 
  FileText,
  User,
  Award,
  BookOpen,
  TrendingUp,
  Star,
  CheckCircle,
  AlertCircle,
  Calendar,
  Eye,
  Loader2,
  Camera
} from 'lucide-react';

interface Student {
  _id: string;
  adm_no: string;
  first_name: string;
  last_name: string;
  surname?: string;
  fullName: string;
}

interface PortfolioSummary {
  student: Student;
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
      name: string;
      code: string;
    };
    count: number;
  }>;
  learningAreasCovered: Array<{
    learningArea: {
      name: string;
    };
    count: number;
  }>;
  reflections: Array<{
    evidenceTitle: string;
    reflection: string;
    submittedAt: string;
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
  projectEvidences: Array<{
    title: string;
    description: string;
    submittedAt: string;
    status: string;
    evidenceType: string;
    mediaUrl: string;
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
  }>;
  summaryInsights: {
    mostActiveLearningArea: string;
    topCompetency: string;
    recentActivity: string | null;
  };
  customTitle?: string;
  customIntroduction?: string;
}

const PortfolioPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [previewData, setPreviewData] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    // Get portfolio data from location state
    if (location.state?.portfolioData) {
      setPreviewData(location.state.portfolioData);
      setLoading(false);
    } else {
      // If no data in state, redirect back to portfolio summary
      navigate('/portfolio-summary');
    }
  }, [location.state, navigate]);

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

  const handleDownloadPDF = async () => {
    if (!previewData) return;
    
    try {
      setDownloadingPDF(true);
      console.log('Converting HTML to PDF...');
      
      // Get the main content element
      const contentElement = document.getElementById('portfolio-content');
      if (!contentElement) {
        throw new Error('Portfolio content element not found');
      }
      
      const filename = `portfolio-summary-${previewData.student.adm_no}-${previewData.academicYear}.pdf`;
      
      await convertElementToPDF(contentElement, {
        filename: filename,
        quality: 1,
        scale: 2,
        backgroundColor: '#ffffff',
        margin: 10
      });
      
      console.log('PDF generated successfully!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // You could add a toast notification here
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleGoBack = () => {
    navigate('/portfolio-summary');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portfolio preview...</p>
        </div>
      </div>
    );
  }

  if (!previewData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Portfolio Data</h2>
          <p className="text-gray-600 mb-4">Unable to load portfolio preview data.</p>
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio Summary
          </Button>
        </div>
      </div>
    );
  }

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
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {previewData.customTitle || 'Portfolio Summary Preview'}
                </h1>
                <p className="text-gray-600">
                  {previewData.student.fullName} • {previewData.student.adm_no}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleDownloadPDF}
                disabled={downloadingPDF}
                className="flex items-center gap-2"
              >
                {downloadingPDF ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        id="portfolio-content" 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        style={{
          backgroundColor: '#ffffff',
          minHeight: '100vh',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          pageBreakInside: 'avoid',
          breakInside: 'avoid'
        }}
      >
        {/* PAGE 1: Student Information */}
        <div 
          className="min-h-screen"
          style={{
            pageBreakAfter: 'always',
            breakAfter: 'page',
            backgroundColor: '#ffffff',
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {previewData.customTitle || 'Portfolio Summary'}
            </h1>
            <div className="w-32 h-2 bg-blue-600 mx-auto rounded"></div>
          </div>

          {/* Main Content Section */}
          <div className="flex-1 flex flex-col justify-center">
            <Card className="max-w-5xl mx-auto w-full">
              <div className="p-10">
                <div className="flex items-center justify-center gap-4 mb-12">
                  <User className="h-10 w-10 text-blue-600" />
                  <h2 className="text-3xl font-bold text-gray-900">Student Information</h2>
                </div>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <User className="h-8 w-8 text-blue-600" />
                      <p className="text-xl font-semibold text-blue-900">Full Name</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-800">{previewData.student.fullName}</p>
              </div>
                  
                  <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <FileText className="h-8 w-8 text-green-600" />
                      <p className="text-xl font-semibold text-green-900">Admission Number</p>
              </div>
                    <p className="text-2xl font-bold text-green-800 font-mono">{previewData.student.adm_no}</p>
                </div>
                  
                  <div className="bg-purple-50 p-8 rounded-2xl border-2 border-purple-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <Calendar className="h-8 w-8 text-purple-600" />
                      <p className="text-xl font-semibold text-purple-900">Academic Year</p>
                </div>
                    <p className="text-2xl font-bold text-purple-800">{previewData.academicYear}</p>
                </div>
                  
                  <div className="bg-orange-50 p-8 rounded-2xl border-2 border-orange-200 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <BookOpen className="h-8 w-8 text-orange-600" />
                      <p className="text-xl font-semibold text-orange-900">Term</p>
                </div>
                    <p className="text-2xl font-bold text-orange-800">{previewData.term}</p>
              </div>
            </div>

                {/* Portfolio Overview Section */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border-2 border-gray-200 shadow-lg">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Portfolio Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                      <div className="bg-blue-100 p-6 rounded-xl shadow-md">
                        <FileText className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                        <p className="text-3xl font-bold text-blue-800">{previewData.statistics.totalEvidences}</p>
                        <p className="text-sm text-blue-600 font-medium">Total Evidences</p>
                  </div>
                </div>
                <div className="text-center">
                      <div className="bg-green-100 p-6 rounded-xl shadow-md">
                        <Award className="h-10 w-10 text-green-600 mx-auto mb-3" />
                        <p className="text-3xl font-bold text-green-800">{previewData.statistics.totalCompetencies}</p>
                        <p className="text-sm text-green-600 font-medium">Competencies</p>
                  </div>
                </div>
                <div className="text-center">
                      <div className="bg-purple-100 p-6 rounded-xl shadow-md">
                        <BookOpen className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                        <p className="text-3xl font-bold text-purple-800">{previewData.statistics.totalLearningAreas}</p>
                        <p className="text-sm text-purple-600 font-medium">Learning Areas</p>
                  </div>
                </div>
                <div className="text-center">
                      <div className="bg-yellow-100 p-6 rounded-xl shadow-md">
                        <Star className="h-10 w-10 text-yellow-600 mx-auto mb-3" />
                        <p className="text-3xl font-bold text-yellow-800">{previewData.statistics.averageRating}</p>
                        <p className="text-sm text-yellow-600 font-medium">Avg Rating</p>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          </div>

          {/* Footer Section */}
          <div className="text-center mt-12">
            <div className="text-sm text-gray-500">
              Generated on {new Date(previewData.generatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* PAGE 2: Introduction */}
        <div 
          className="min-h-screen"
          style={{
            pageBreakAfter: 'always',
            breakAfter: 'page',
            backgroundColor: '#ffffff',
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Introduction</h1>
            <div className="w-32 h-2 bg-indigo-600 mx-auto rounded"></div>
          </div>

          {/* Main Content Section */}
          <div className="flex-1 flex flex-col justify-center">
            <Card className="max-w-5xl mx-auto w-full">
              <div className="p-10">
                <div className="flex items-center justify-center gap-4 mb-12">
                  <Eye className="h-10 w-10 text-indigo-600" />
                  <h2 className="text-3xl font-bold text-gray-900">Portfolio Introduction</h2>
                </div>
              
                {/* Custom Introduction or Default */}
                <div className="prose prose-lg max-w-none">
                  {previewData.customIntroduction ? (
                    <div className="bg-indigo-50 p-8 rounded-2xl border-2 border-indigo-200 shadow-lg">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-lg">
                        {previewData.customIntroduction}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="bg-indigo-50 p-8 rounded-2xl border-2 border-indigo-200 shadow-lg">
                        <h3 className="text-2xl font-semibold text-indigo-900 mb-6">Welcome to {previewData.student.fullName}'s Portfolio</h3>
                        <p className="text-gray-800 leading-relaxed text-lg">
                          This portfolio represents a comprehensive collection of {previewData.student.fullName}'s academic journey 
                          during the {previewData.academicYear} academic year. Through this portfolio, we showcase the student's 
                          achievements, growth, and learning experiences across various competencies and learning areas.
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-200 shadow-lg">
                        <h3 className="text-2xl font-semibold text-blue-900 mb-6">Portfolio Highlights</h3>
                        <ul className="space-y-4 text-gray-800">
                          <li className="flex items-start gap-4">
                            <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-lg"><strong>{previewData.statistics.totalEvidences}</strong> pieces of evidence demonstrating learning and growth</span>
                          </li>
                          <li className="flex items-start gap-4">
                            <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-lg"><strong>{previewData.statistics.totalCompetencies}</strong> competencies developed and mastered</span>
                          </li>
                          <li className="flex items-start gap-4">
                            <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-lg"><strong>{previewData.statistics.totalLearningAreas}</strong> learning areas explored and engaged with</span>
                          </li>
                          <li className="flex items-start gap-4">
                            <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                            <span className="text-lg">Average rating of <strong>{previewData.statistics.averageRating}</strong> across all assessments</span>
                          </li>
                        </ul>
                      </div>

                      <div className="bg-purple-50 p-8 rounded-2xl border-2 border-purple-200 shadow-lg">
                        <h3 className="text-2xl font-semibold text-purple-900 mb-6">Learning Journey</h3>
                        <p className="text-gray-800 leading-relaxed text-lg">
                          Throughout this academic period, {previewData.student.fullName} has demonstrated remarkable dedication 
                          to learning and personal development. The evidence presented in this portfolio reflects not just 
                          academic achievements, but also the development of critical thinking, creativity, and practical 
                          application of knowledge across various domains.
                        </p>
                      </div>

                      <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-200 shadow-lg">
                        <h3 className="text-2xl font-semibold text-green-900 mb-6">Reflection and Growth</h3>
                        <p className="text-gray-800 leading-relaxed text-lg">
                          This portfolio includes thoughtful reflections on learning experiences, teacher feedback that has 
                          guided improvement, and evidence of continuous growth. Each piece of evidence tells a story of 
                          learning, challenges overcome, and skills developed.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Footer Section */}
          <div className="text-center mt-12">
            <div className="text-sm text-gray-500">
              Portfolio Summary • {previewData.academicYear} • {previewData.term}
            </div>
          </div>
        </div>

        {/* Additional Content - Portfolio Details */}
        <div className="space-y-8">

          {/* Competencies Achieved */}
          {previewData.competenciesAchieved.length > 0 && (
            <Card style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold">Competencies Achieved</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {previewData.competenciesAchieved.map((competency, index) => (
                    <div key={index} className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-purple-900">{competency.competency.name}</h4>
                        <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-sm">
                          {competency.count}
                        </span>
                      </div>
                      <p className="text-sm text-purple-700">{competency.competency.code}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Learning Areas Covered */}
          {previewData.learningAreasCovered.length > 0 && (
            <Card style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold">Learning Areas Covered</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {previewData.learningAreasCovered.map((area, index) => (
                    <div key={index} className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-green-900">{area.learningArea.name}</h4>
                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">
                          {area.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Project Evidence Photos */}
          {previewData.projectEvidences && previewData.projectEvidences.length > 0 && (
            <Card style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Camera className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold">Project Evidence Photos</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {previewData.projectEvidences
                    .filter(evidence => evidence.evidenceType === 'photo')
                    .map((evidence, index) => {
                      const imageUrl = evidence.cloudinaryData?.secure_url || evidence.mediaUrl || evidence.thumbnailUrl;
                      return (
                        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border">
                          {imageUrl && (
                            <div className="aspect-w-16 aspect-h-12">
                              <img
                                src={imageUrl}
                                alt={evidence.title}
                                className="w-full h-48 object-cover"
                                crossOrigin="anonymous"
                                onError={(e) => {
                                  console.error('Error loading image:', imageUrl);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-800 mb-2">{evidence.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{evidence.description}</p>
                            {evidence.caption && (
                              <p className="text-sm text-gray-500 italic mb-2">"{evidence.caption}"</p>
                            )}
                            {evidence.competency && (
                              <div className="flex items-center mb-2">
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                  {evidence.competency.name}
                                </span>
                              </div>
                            )}
                            {evidence.reflection && (
                              <div className="mt-2 p-2 bg-gray-50 rounded">
                                <p className="text-xs text-gray-600">
                                  <strong>Reflection:</strong> {evidence.reflection}
                                </p>
                              </div>
                            )}
                            <div className="flex justify-between items-center mt-2">
                              <span className={`text-xs px-2 py-1 rounded ${
                                evidence.status === 'approved' ? 'bg-green-100 text-green-800' :
                                evidence.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {evidence.status}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(evidence.submittedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </Card>
          )}

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            {previewData.strengths.length > 0 && (
              <Card>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold">Strengths</h3>
                  </div>
                  <ul className="space-y-2">
                    {previewData.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}

            {/* Areas for Improvement */}
            {previewData.improvements.length > 0 && (
              <Card>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                    <h3 className="text-lg font-semibold">Areas for Improvement</h3>
                  </div>
                  <ul className="space-y-2">
                    {previewData.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )}
          </div>

          {/* Recent Reflections */}
          {previewData.reflections.length > 0 && (
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Recent Reflections</h3>
                </div>
                <div className="space-y-4">
                  {previewData.reflections.slice(0, 5).map((reflection, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-blue-900">{reflection.evidenceTitle}</h4>
                        <span className="text-sm text-blue-600">
                          {new Date(reflection.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-blue-800">{reflection.reflection}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Recent Teacher Feedback */}
          {previewData.teacherFeedbacks.length > 0 && (
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="h-6 w-6 text-yellow-600" />
                  <h3 className="text-lg font-semibold">Recent Teacher Feedback</h3>
                </div>
                <div className="space-y-4">
                  {previewData.teacherFeedbacks.slice(0, 5).map((feedback, index) => (
                    <div key={index} className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-yellow-900">{feedback.evidenceTitle}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {getRatingStars(feedback.rating)}
                          </div>
                          <span className="text-sm text-yellow-600">
                            {new Date(feedback.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-yellow-800 mb-2">{feedback.comment}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-yellow-700">
                          Feedback by: {feedback.feedbackBy}
                        </span>
                        {feedback.authenticityApproved && (
                          <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs">
                            Authenticated
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Summary Insights */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
                <h3 className="text-lg font-semibold">Summary Insights</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-2">Most Active Learning Area</h4>
                  <p className="text-indigo-800">{previewData.summaryInsights.mostActiveLearningArea}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-2">Top Competency</h4>
                  <p className="text-indigo-800">{previewData.summaryInsights.topCompetency}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-indigo-900 mb-2">Recent Activity</h4>
                  <p className="text-indigo-800">
                    {previewData.summaryInsights.recentActivity 
                      ? new Date(previewData.summaryInsights.recentActivity).toLocaleDateString()
                      : 'No recent activity'
                    }
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreviewPage;


