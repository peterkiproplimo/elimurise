import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';

// Create comprehensive styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  redLine: {
    height: 8,
    backgroundColor: '#10b981',
    width: '100%',
    marginBottom: 2,
  },
  grayLine: {
    height: 1,
    backgroundColor: '#6b7280',
    width: '100%',
    marginBottom: 20,
  },
  letterheadHeader: {
    marginBottom: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  footerIcon: {
    width: 8,
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
    marginRight: 5,
  },
  footerText: {
    fontSize: 10,
    color: '#6b7280',
  },
  footerRedLine: {
    height: 4,
    backgroundColor: '#10b981',
    width: '100%',
    marginBottom: 2,
  },
  footerGrayLine: {
    height: 1,
    backgroundColor: '#6b7280',
    width: '100%',
    marginBottom: 10,
  },
  pageNumber: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 10,
  },
  
  // Cover page styles
  coverPage: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    border: '1px solid #000000',
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 1.2,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  studentDetails: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  cbcImage: {
    width: '100%',
    height: 300,
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center',
  },
  
  // Content page styles
  contentPage: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
    backgroundColor: '#10b981',
    padding: 10,
    borderRadius: 6,
  },
  
  // Competency chart styles
  competencyChart: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  competencyBar: {
    height: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    marginBottom: 8,
    position: 'relative',
  },
  competencyBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 10,
  },
  competencyLabel: {
    fontSize: 12,
    color: '#374151',
    marginBottom: 4,
  },
  competencyValue: {
    fontSize: 10,
    color: '#6b7280',
    position: 'absolute',
    right: 8,
    top: 2,
  },
  
  // Card styles
  reflectionCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
  },
  reflectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  reflectionContent: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 1.5,
    fontStyle: 'italic',
  },
  reflectionMeta: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'right',
  },
  
  teacherFeedbackCard: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    border: '1px solid #0ea5e9',
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 8,
  },
  feedbackContent: {
    fontSize: 12,
    color: '#0c4a6e',
    lineHeight: 1.5,
  },
  feedbackTeacher: {
    fontSize: 10,
    color: '#0369a1',
    marginTop: 8,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  
  strengthItem: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
    border: '1px solid #22c55e',
  },
  strengthText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: 'bold',
  },
  
  improvementItem: {
    backgroundColor: '#fef3c7',
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
    border: '1px solid #f59e0b',
  },
  improvementText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: 'bold',
  },
  
  growthTimelineItem: {
    backgroundColor: '#f8fafc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    border: '1px solid #cbd5e1',
  },
  timelineYear: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  timelineContent: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 1.4,
  },
  
  narrativeSummary: {
    backgroundColor: '#fefce8',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    border: '1px solid #eab308',
  },
  narrativeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#a16207',
    marginBottom: 8,
  },
  narrativeContent: {
    fontSize: 12,
    color: '#a16207',
    lineHeight: 1.5,
  },
  
  // Award and certificate styles
  achievementCard: {
    backgroundColor: '#ffffff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    border: '1px solid #e2e8f0',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 10,
    color: '#6b7280',
  },
  
  // Project evidence styles
  projectCard: {
    backgroundColor: '#f8fafc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    border: '1px solid #e2e8f0',
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.4,
  },
});

// Simplified Sample Data
const sampleData = {
  student: {
    first_name: 'Samwel',
    last_name: 'Mwendwa',
    surname: 'Kiprop',
    fullName: 'Samwel Mwendwa Kiprop',
    adm_no: 'ELM/2024/001',
    grade: 'Grade 8',
    stream: 'Blue',
  },
  academicYear: '2024',
  term: 'Term 3',
  generatedAt: new Date(),
  
  competenciesAchieved: [
    { competency: { name: 'Communication & Collaboration' }, rating: 4.5, count: 15 },
    { competency: { name: 'Critical Thinking' }, rating: 4.2, count: 12 },
    { competency: { name: 'Creativity & Innovation' }, rating: 4.8, count: 18 },
    { competency: { name: 'Digital Literacy' }, rating: 4.0, count: 10 },
  ],
  
  awards: [
    { title: 'Academic Excellence Award', issueDate: '2024-03-15', category: 'Academic', description: 'Top performer in Mathematics' },
    { title: 'Leadership Recognition', issueDate: '2024-02-20', category: 'Leadership', description: 'Student Council President' },
    { title: 'Community Service', issueDate: '2024-01-10', category: 'Service', description: 'Community garden project' },
  ],
  
  certificates: [
    { title: 'Mathematics Excellence', issueDate: '2024-03-15', grade: 'A+', score: '95%', description: 'Advanced Mathematics' },
    { title: 'Science Innovation', issueDate: '2024-04-05', grade: 'A', score: '92%', description: 'Science Fair Project' },
    { title: 'English Proficiency', issueDate: '2024-02-20', grade: 'A', score: '88%', description: 'Creative Writing' },
  ],
  
  projectEvidences: [
    { title: 'Solar Energy Project', description: 'Built a solar-powered water pump', evidenceType: 'Science Project', submittedAt: '2024-03-15', competency: 'Critical Thinking', reflection: 'Learned about renewable energy' },
    { title: 'Community Garden', description: 'Led school garden project', evidenceType: 'Community Service', submittedAt: '2024-02-20', competency: 'Social Responsibility', reflection: 'Learned teamwork and community engagement' },
    { title: 'Digital Storytelling', description: 'Created multimedia stories', evidenceType: 'Digital Project', submittedAt: '2024-04-10', competency: 'Digital Literacy', reflection: 'Combined creativity with technology' },
  ],
  
  reflections: [
    { reflection: 'This term has been transformative. I discovered my passion for environmental science through our conservation projects.', evidenceTitle: 'Community Garden', submittedAt: '2024-02-20' },
    { reflection: 'Mathematics used to be challenging, but through systematic problem-solving approaches, I\'ve developed confidence.', evidenceTitle: 'Peer Tutoring', submittedAt: '2024-03-05' },
  ],
  
  teacherFeedbacks: [
    { comment: 'Samwel demonstrates exceptional leadership qualities and consistently shows initiative in group projects.', feedbackBy: 'Ms. Sarah Kimani', evidenceTitle: 'Community Garden', date: '2024-02-25', rating: 5 },
    { comment: 'Outstanding mathematical reasoning and problem-solving skills.', feedbackBy: 'Mr. John Mwangi', evidenceTitle: 'Mathematics Project', date: '2024-03-30', rating: 5 },
  ],
  
  strengths: [
    'Demonstrates exceptional leadership and initiative',
    'Strong analytical and critical thinking skills',
    'Excellent communication abilities',
    'Creative problem-solving approach',
  ],
  
  improvements: [
    'Continue developing time management skills',
    'Enhance public speaking confidence',
    'Strengthen organizational skills',
  ],
  
  growthTimeline: [
    { year: 'Grade 4', title: 'Foundation Building', description: 'Established strong academic foundations' },
    { year: 'Grade 5', title: 'Skill Development', description: 'Enhanced problem-solving abilities' },
    { year: 'Grade 6', title: 'Leadership Emergence', description: 'Became class representative' },
    { year: 'Grade 7', title: 'Academic Excellence', description: 'Achieved top academic performance' },
    { year: 'Grade 8', title: 'Current Year', description: 'Demonstrating excellence across all areas' },
    { year: 'Grade 9', title: 'Future Goals', description: 'Planning advanced studies in STEM' },
  ],

  
};

const portfolioSummary = {
  
  student: {
    _id: "stu12345",
    name: "John Kiptoo",
    admissionNumber: "ADM2025-001",
    gender: "Male",
    dob: "2010-06-12",
    class: "Grade 7"
  },
  guardian: {
    name: "Mary Kiptoo",
    relationship: "Mother",
    phone: "+254712345678",
    email: "mary.kiptoo@example.com",
    address: "Kapsabet, Nandi County"
  },
  grade: {
    _id: "gr7",
    name: "Grade 7",
    level: "Junior Secondary"
  },
  stream: {
    _id: "strA",
    name: "7A"
  },
  academicYear: "2025",
  term: "Term 2",
  generatedAt: new Date("2025-11-01T09:00:00Z"),
  statistics: {
    totalEvidences: 25,
    totalCompetencies: 8,
    totalLearningAreas: 5,
    averageRating: 4.3,
    evidenceByType: {
      photo: 15,
      video: 8,
      document: 2
    },
    photoCount: 15,
    videoCount: 8
  },
  competenciesAchieved: [
    {
      competency: { _id: "comp101", name: "Critical Thinking", code: "CT101" },
      count: 5
    },
    {
      competency: { _id: "comp102", name: "Teamwork", code: "TW102" },
      count: 3
    }
  ],
  learningAreasCovered: [
    {
      learningArea: { _id: "la101", name: "Mathematics" },
      count: 7
    },
    {
      learningArea: { _id: "la102", name: "Science" },
      count: 5
    },
    {
      learningArea: { _id: "la103", name: "English" },
      count: 6
    }
  ],
  reflections: [
    "I enjoyed building a simple robot during the science project.",
    "Math quizzes helped me improve my problem-solving speed.",
    "Reading aloud in English class boosted my confidence.",
    "I learned how to work better in groups during art lessons."
  ],
  teacherFeedbacks: [
    {
      comment: "John shows great creativity in his science projects.",
      rating: 4.5,
      authenticityApproved: true,
      feedbackBy: "Mr. Kamau",
      feedbackDate: "2025-10-20T10:00:00Z"
    },
    {
      comment: "Needs to improve consistency in homework submissions.",
      rating: 3.8,
      authenticityApproved: true,
      feedbackBy: "Ms. Njeri",
      feedbackDate: "2025-10-18T12:30:00Z"
    }
  ],
  strengths: [
    "Excellent creativity and innovation",
    "Strong analytical and reasoning skills",
    "Good collaboration with peers"
  ],
  improvements: [
    "Continue developing time management skills",
    "Enhance public speaking confidence",
    "Strengthen organizational skills"
  ],
  projectEvidences: [
    {
      _id: "ev001",
      title: "Science Project - Solar System Model",
      caption: "My 3D model of the solar system using recycled materials",
      description: "A creative representation of the solar system demonstrating planetary motion.",
      reflection: "I learned about planet sizes and distances while being creative with recycled materials.",
      evidenceType: "photo",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/solar-system.jpg",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/solar-system-thumb.jpg",
      pci: "PCI-SC-2025-001",
      competency: { _id: "comp101", name: "Critical Thinking", code: "CT101" },
      learningArea: { _id: "la102", name: "Science" },
      submittedAt: "2025-10-15T08:00:00Z",
      status: "Approved",
      googleDriveFiles: [],
      googleDriveUrl: "https://drive.google.com/file/d/abcdef123456/view",
      googleDriveFileId: "abcdef123456",
      teacherFeedback: [
        {
          comment: "Well thought out and neatly done project.",
          rating: 4.7,
          authenticityApproved: true,
          feedbackBy: "Mr. Kamau",
          feedbackDate: "2025-10-17T09:00:00Z"
        }
      ]
    },
    {
      _id: "ev002",
      title: "English Presentation - My Favorite Book",
      caption: "An oral presentation about ‘The River and The Source’.",
      description: "A five-minute presentation summarizing key themes and lessons.",
      reflection: "I gained confidence speaking in front of others.",
      evidenceType: "video",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/english-presentation.mp4",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/english-thumb.jpg",
      pci: "PCI-EN-2025-002",
      competency: { _id: "comp102", name: "Teamwork", code: "TW102" },
      learningArea: { _id: "la103", name: "English" },
      submittedAt: "2025-10-10T09:00:00Z",
      status: "Reviewed",
      googleDriveFiles: [],
      googleDriveUrl: null,
      googleDriveFileId: null,
      teacherFeedback: [
        {
          comment: "Very engaging presentation. Work on eye contact.",
          rating: 4.0,
          authenticityApproved: true,
          feedbackBy: "Ms. Njeri",
          feedbackDate: "2025-10-12T10:30:00Z"
        }
      ]
    },
    {
      _id: "ev002",
      title: "English Presentation - My Favorite Book",
      caption: "An oral presentation about ‘The River and The Source’.",
      description: "A five-minute presentation summarizing key themes and lessons.",
      reflection: "I gained confidence speaking in front of others.",
      evidenceType: "video",
      mediaUrl: "https://school-portfolio.s3.amazonaws.com/evidence/english-presentation.mp4",
      thumbnailUrl: "https://school-portfolio.s3.amazonaws.com/evidence/thumbnails/english-thumb.jpg",
      pci: "PCI-EN-2025-002",
      competency: { _id: "comp102", name: "Teamwork", code: "TW102" },
      learningArea: { _id: "la103", name: "English" },
      submittedAt: "2025-10-10T09:00:00Z",
      status: "Reviewed",
      googleDriveFiles: [],
      googleDriveUrl: null,
      googleDriveFileId: null,
      teacherFeedback: [
        {
          comment: "Very engaging presentation. Work on eye contact.",
          rating: 4.0,
          authenticityApproved: true,
          feedbackBy: "Ms. Njeri",
          feedbackDate: "2025-10-12T10:30:00Z"
        }
      ]
    }
  ],
  certificates: [
    {
      title: "Best Science Project 2025",
      issuer: "Nandi Junior Academy",
      issuedDate: "2025-07-10",
      description: "Awarded for creativity and innovation in science"
    }
  ],
  awards: [
    {
      title: "Math Genius of the Term",
      term: "Term 1, 2025",
      description: "Recognized for outstanding performance in mathematics."
    }
  ],
  summaryInsights: {
    mostActiveLearningArea: "Mathematics",
    topCompetency: "Critical Thinking",
    recentActivity: "2025-10-15T08:00:00Z"
  }
};

const certificates = [
  {
    certificateName: "Best Academic Performance",
    certificateType: "Academic",
    issueDate: "2025-10-01T00:00:00.000+00:00",
    expiryDate: "2025-10-31T00:00:00.000+00:00",
    certificateFile: {
      fileName: "best-academic-performance.pdf",
      fileUrl: "https://school-portfolio.s3.amazonaws.com/certificates/best-academic-performance.pdf",
      fileType: "application/pdf"
    },
    issuedBy: "School Administration",
    status: "Active"
  },
  {
    certificateName: "Exemplary Leadership Award",
    certificateType: "Co-curricular",
    issueDate: "2025-09-15T00:00:00.000+00:00",
    expiryDate: "2026-09-15T00:00:00.000+00:00",
    certificateFile: {
      fileName: "leadership-award.pdf",
      fileUrl: "https://school-portfolio.s3.amazonaws.com/certificates/leadership-award.pdf",
      fileType: "application/pdf"
    },
    issuedBy: "Student Council",
    status: "Active"
  },
  {
    certificateName: "Science Fair Participation",
    certificateType: "Academic",
    issueDate: "2025-08-20T00:00:00.000+00:00",
    expiryDate: "2025-12-31T00:00:00.000+00:00",
    certificateFile: {
      fileName: "science-fair.pdf",
      fileUrl: "https://school-portfolio.s3.amazonaws.com/certificates/science-fair.pdf",
      fileType: "application/pdf"
    },
    issuedBy: "Science Department",
    status: "Active"
  },
  {
    certificateName: "Sportsmanship Award",
    certificateType: "Sports",
    issueDate: "2025-07-01T00:00:00.000+00:00",
    expiryDate: "2026-06-30T00:00:00.000+00:00",
    certificateFile: {
      fileName: "sportsmanship-award.pdf",
      fileUrl: "https://school-portfolio.s3.amazonaws.com/certificates/sportsmanship-award.pdf",
      fileType: "application/pdf"
    },
    issuedBy: "Games Department",
    status: "Active"
  },
  {
    certificateName: "Environmental Club Recognition",
    certificateType: "Club Activity",
    issueDate: "2025-06-10T00:00:00.000+00:00",
    expiryDate: "2026-06-10T00:00:00.000+00:00",
    certificateFile: {
      fileName: "environmental-club.pdf",
      fileUrl: "https://school-portfolio.s3.amazonaws.com/certificates/environmental-club.pdf",
      fileType: "application/pdf"
    },
    issuedBy: "Environmental Club",
    status: "Active"
  }
];


// Helper functions
const formatDate = (dateString: string | Date) => {
  if (!dateString) return 'N/A';
  try {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

const safeToISOString = (date: any) => {
  if (!date) return new Date().toISOString();
  try {
    if (date instanceof Date) {
      return date.toISOString();
    }
    if (typeof date === 'string') {
      return new Date(date).toISOString();
    }
    return new Date().toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
};

const getStudentFullName = (student: any) => {
  if (student?.fullName) return student.fullName;
  return `${student?.first_name || ''} ${student?.last_name || ''} ${student?.surname || ''}`.trim();
};

const isImageFile = (fileType: string) => {
  if (!fileType) return false;
  const lowerType = fileType.toLowerCase();
  return lowerType === 'image' || lowerType.includes('image') || 
         ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].some(ext => lowerType.includes(ext));
};

const getDirectImageUrl = (mediaUrl: string, googleDriveFileId?: string) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('google_access_token') : '';
  const appendToken = (url: string) => {
    if (!url) return url;
    const hasQuery = url.includes('?');
    const separator = hasQuery ? '&' : '?';
    return token ? `${url}${separator}access_token=${encodeURIComponent(token)}` : url;
  };
  // If we have a direct image URL, use it
  if (mediaUrl && (mediaUrl.includes('http') && !mediaUrl.includes('drive.google.com'))) {
    return mediaUrl;
  }
  
  // If we have a Google Drive file ID, convert to direct image URL
  if (googleDriveFileId) {
    return appendToken(`https://drive.google.com/uc?export=view&id=${googleDriveFileId}`);
  }
  
  // Try to extract file ID from Google Drive URL
  if (mediaUrl && mediaUrl.includes('drive.google.com')) {
    const match = mediaUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return appendToken(`https://drive.google.com/uc?export=view&id=${match[1]}`);
    }
  }
  
  return appendToken(mediaUrl);
};

const addAccessTokenToUrlIfDrive = (url?: string) => {
  if (!url) return url;
  const token = typeof window !== 'undefined' ? localStorage.getItem('google_access_token') : '';
  if (!token) return url;
  if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
    const hasQuery = url.includes('?');
    const separator = hasQuery ? '&' : '?';
    return `${url}${separator}access_token=${encodeURIComponent(token)}`;
  }
  return url;
};

// Portfolio PDF Document Component
const PortfolioPDFDocumentComprehensive = ({ data }: { data?: any }) => {
  try {
    console.log('PDF Component - Input data:', data);
    
    const portfolioData = data || sampleData;
    console.log('PDF Component - Portfolio data:', portfolioData);
    
    // Ensure portfolioData has all required array properties
    const safePortfolioData = {
      ...portfolioData,
      reflections: portfolioData?.reflections || [],
      teacherFeedbacks: portfolioData?.teacherFeedbacks || [],
      strengths: portfolioData?.strengths || [],
      improvements: portfolioData?.improvements || [],
      growthTimeline: portfolioData?.growthTimeline || [],
      awards: portfolioData?.awards || [],
      certificates: portfolioData?.certificates || [],
      projectEvidences: portfolioData?.projectEvidences || [],
      generatedAt: portfolioData?.generatedAt || new Date(),
      fees: portfolioData?.fees || {
        term1: { amountDue: 0, amountPaid: 0, balance: 0 },
        term2: { amountDue: 0, amountPaid: 0, balance: 0 },
        term3: { amountDue: 0, amountPaid: 0, balance: 0 },
        paymentDetails: []
      },
      termPerformance: portfolioData?.termPerformance || {
        term1: { averageRating: 4.2, evidenceCount: 8, competencyCount: 5, projectCount: 3 },
        term2: { averageRating: 4.4, evidenceCount: 12, competencyCount: 6, projectCount: 5 },
        term3: { averageRating: 4.6, evidenceCount: 15, competencyCount: 7, projectCount: 6 }
      },
      formativeAssessments: portfolioData?.formativeAssessments || [],
      summativeAssessments: portfolioData?.summativeAssessments || {
        term1: { exams: 2, tests: 3, averageScore: 75, grade: 'B+' },
        term2: { exams: 2, tests: 4, averageScore: 80, grade: 'A-' },
        term3: { exams: 2, tests: 4, averageScore: 85, grade: 'A' }
      },
      promotion: portfolioData?.promotion || {
        fromGrade: 'Grade 6',
        fromStream: null,
        promotedToGrade: portfolioData?.grade?.name || portfolioData?.student?.grade || 'Grade 7',
        promotedToStream: portfolioData?.stream?.name || portfolioData?.student?.stream || 'STREAM B',
        promotionDate: null,
        promotedBy: null
      },
      notices: portfolioData?.notices || [],
      additionalNotices: portfolioData?.additionalNotices || [],
      feesStructure: portfolioData?.feesStructure || null,
      events: portfolioData?.events || [],
    };
    
    console.log('PDF Component - Safe portfolio data:', safePortfolioData);
    console.log('PDF Component - GeneratedAt type:', typeof safePortfolioData.generatedAt);
    console.log('PDF Component - GeneratedAt value:', safePortfolioData.generatedAt);
    
    if (!safePortfolioData) {
      return (
        <Document>
          <Page size="A4" style={styles.page}>
            <Text>Error: No portfolio data available</Text>
          </Page>
        </Document>
      );
    }

  return (
    <Document>
      {/* Page 1: Cover Page */}
 
 
   
<Page size="A4" style={{ position: 'relative' }}>
  {/* === Background Image === */}
  <View
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      alignItems: 'center'    // horizontal centering
    }}
  >
    <Image
      src="/pdf images/coverpagebackground.jpg"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        opacity: 0.25,
        zIndex: 0
      }}
    />
  </View>

  {/* === Dark Overlay (for readability) === */}
  <View
    style={{
      position: 'absolute',
      top: 0,
      alignItems: 'center',     // horizontal centering
      left: 0,
      right: 0,
      bottom: 0,
      // backgroundColor: 'rgba(0, 0, 0, 0.55)', // dark transparent overlay
      zIndex: 1,
    }}
  />

  {/* === Foreground Content === */}
  <View
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      alignItems: 'center',     // horizontal centering
      textAlign: 'center',
      bottom: 0,
      padding: 20,
      zIndex: 2, // ensures text is above overlay
    }}
  >
    {/* Top Left Branding */}
    <View
      style={{
        position: 'absolute',
        top: 20,
        backgroundColor: 'rgba(75, 85, 99, 0.85)',
        padding: 15,
        borderRadius: 8,
        width: "70%",
        justifyContent: 'center', // vertical centering
        alignItems: 'center',     // horizontal centering
        textAlign: 'center',
      }}
    >

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 3 }}>
        ELIMURISE
      </Text>
      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff', marginBottom: 5 }}>
        INTERNATIONAL SCHOOLS
      </Text>

      <Text style={{ fontSize: 10, color: '#e5e7eb' }}>Dedicated to Excellence</Text>
    
    </View>



        {/* Top Left Branding */}
    <View
      style={{
        position: 'absolute',
        top: 200,
        backgroundColor: 'rgba(75, 85, 99, 0.85)',
        padding: 15,
        borderRadius: 8,
        width: "70%",
        height:200,
        justifyContent: 'center', // vertical centering
        alignItems: 'center',     // horizontal centering
        textAlign: 'center'
      }}
    >

      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#ffffff', marginBottom: 3 }}>
      {getStudentFullName(safePortfolioData.student) || 'N/A'}
      </Text>
    

      <Text style={{ fontSize: 10, color: '#e5e7eb' }}>Student Portfolio</Text>
    
    </View>



    {/* Page Number */}
    <View
      style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'rgba(75, 85, 99, 0.85)',
      }}
    >
      <Text style={{ fontSize: 10, color: '#ffffff' }}>Page 1 of 30</Text>
    </View>
  </View>
</Page>


      {/* Page 2: Student & Parent Information - DONE */} 
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Student & Parent Information</Text>
        
        <View style={{ marginTop: 30 }}>
          {/* Student Information Section */}
          <View style={{ marginBottom: 30 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 15, textAlign: 'center' }}>STUDENT DETAILS</Text>
            
            <View style={{ backgroundColor: '#f8fafc', padding: 20, borderRadius: 8, marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Full Name:</Text>
                <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{getStudentFullName(safePortfolioData.student) || 'N/A'}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Admission Number:</Text>
                <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student?.adm_no || 'N/A'}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>NEMIS Number:</Text>
                <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student?.nemis_no || 'N/A'}</Text>
              </View>
              {safePortfolioData.student?.gender && (
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Gender:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.gender}</Text>
                </View>
              )}
              {safePortfolioData.student?.grade?.name && (
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Grade:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>
                    {safePortfolioData.student.grade.name} {safePortfolioData.student.grade.level ? `(Level ${safePortfolioData.student.grade.level})` : ''}
                  </Text>
                </View>
              )}
              {safePortfolioData.student?.stream?.name && (
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Stream:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.stream.name}</Text>
                </View>
              )}
              {safePortfolioData.student?.current_session && (
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Academic Session:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.current_session}</Text>
                </View>
              )}
              {safePortfolioData.student?.school && (
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>School:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.school}</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Guardian Information Section */}
          {safePortfolioData.student?.guardian && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 15, textAlign: 'center' }}>GUARDIAN DETAILS</Text>
              
              {/* Guardian Information */}
              <View style={{ backgroundColor: '#f0f9ff', padding: 15, borderRadius: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 10 }}>
                  {safePortfolioData.student.guardian_relationship || 'Guardian'} Information
                </Text>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Full Name:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>
                    {safePortfolioData.student.guardian.first_name} {safePortfolioData.student.guardian.last_name} {safePortfolioData.student.guardian.surname || ''}
                  </Text>
                </View>
                {safePortfolioData.student.guardian_relationship && (
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Relationship:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.guardian_relationship}</Text>
                </View>
              )}
              {safePortfolioData.student.guardian.id_no && (
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>ID Number:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.guardian.id_no}</Text>
                </View>
              )}
              {safePortfolioData.student.guardian.gender && (
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Gender:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.guardian.gender}</Text>
                </View>
              )}
              {safePortfolioData.student.guardian.phone && (
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Phone:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.guardian.phone}</Text>
                </View>
              )}
              {safePortfolioData.student.guardian.email && (
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Email:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.guardian.email}</Text>
                </View>
              )}
              {safePortfolioData.student.guardian.schoolCode && (
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>School Code:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.guardian.schoolCode}</Text>
                </View>
              )}
            </View>
            </View>
          )}

          {/* Grade Details Section */}
          {safePortfolioData.student?.grade && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 15, textAlign: 'center' }}>GRADE DETAILS</Text>
              
              <View style={{ backgroundColor: '#f0fdf4', padding: 15, borderRadius: 8 }}>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Grade Name:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.grade.name || 'N/A'}</Text>
                </View>
                {safePortfolioData.student.grade.level && (
                  <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Grade Level:</Text>
                    <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>Level {safePortfolioData.student.grade.level}</Text>
                  </View>
                )}
                {safePortfolioData.student.grade._id && (
                  <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Grade ID:</Text>
                    <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.grade._id}</Text>
                  </View>
                )}
                {safePortfolioData.student.grade.code && (
                  <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Grade Code:</Text>
                    <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.grade.code}</Text>
                  </View>
                )}
                {safePortfolioData.student.grade.description && (
                  <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Description:</Text>
                    <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.grade.description}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Stream Details Section */}
          {safePortfolioData.student?.stream && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b', marginBottom: 15, textAlign: 'center' }}>STREAM DETAILS</Text>
              
              <View style={{ backgroundColor: '#fef3c7', padding: 15, borderRadius: 8 }}>
                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Stream Name:</Text>
                  <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.stream.name || 'N/A'}</Text>
                </View>
                {safePortfolioData.student.stream._id && (
                  <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Stream ID:</Text>
                    <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.stream._id}</Text>
                  </View>
                )}
                {safePortfolioData.student.stream.code && (
                  <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Stream Code:</Text>
                    <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.stream.code}</Text>
                  </View>
                )}
                {safePortfolioData.student.stream.description && (
                  <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#374151', width: '40%' }}>Description:</Text>
                    <Text style={{ fontSize: 12, color: '#374151', width: '60%' }}>{safePortfolioData.student.stream.description}</Text>
                </View>
              )}
            </View>
            </View>
          )}
          
          {/* Student Image */}
            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <Image
                src="/pdf images/kid-image.jpg"
                style={{
                  width: 250,
                  height: 300,
                  borderRadius: 12,
                  objectFit: 'cover',
                  border: '2px solid #e5e7eb'
                }}
              />
              <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 8, fontStyle: 'italic' }}>
                {getStudentFullName(safePortfolioData.student) || 'N/A'}
              </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 2 of 30</Text>
        </View>
      </Page>

      {/* Page 3: Student Promotion Management */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Student Promotion Management</Text>
        
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 25 }}>
            This section contains the official promotion status and academic advancement information for the student.
          </Text>
          
          {/* Promotion Card */}
          <View style={{
            backgroundColor: '#f0fdf4',
            padding: 25,
            borderRadius: 12,
            border: '2px solid #22c55e',
            marginBottom: 20
          }}>
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#22c55e',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 15
              }}>
                <Text style={{ fontSize: 24, color: '#ffffff', fontWeight: 'bold' }}>✓</Text>
              </View>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#166534', marginBottom: 5 }}>
                PROMOTED
              </Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                Academic Year {safePortfolioData.academicYear || new Date().getFullYear()}
              </Text>
            </View>
            
            {/* Current Grade and Stream */}
            <View style={{
              backgroundColor: '#ffffff',
              padding: 20,
              borderRadius: 8,
              marginBottom: 20,
              border: '1px solid #bbf7d0'
            }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#6b7280', marginBottom: 15, textTransform: 'uppercase' }}>
                Current Class
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', width: '40%' }}>Grade:</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#166534' }}>
                  {safePortfolioData.promotion?.promotedToGrade || safePortfolioData.grade?.name || safePortfolioData.student?.grade || 'Grade 7'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#374151', width: '40%' }}>Stream:</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#166534' }}>
                  {safePortfolioData.promotion?.promotedToStream || safePortfolioData.stream?.name || safePortfolioData.student?.stream || 'STREAM B'}
                </Text>
              </View>
            </View>
            
            {/* Promotion Details */}
            <View style={{
              backgroundColor: '#ffffff',
              padding: 20,
              borderRadius: 8,
              border: '1px solid #bbf7d0'
            }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#6b7280', marginBottom: 15, textTransform: 'uppercase' }}>
                Promotion Details
              </Text>
              
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 5 }}>From:</Text>
                <Text style={{ fontSize: 13, color: '#374151', fontWeight: 'bold' }}>
                  {safePortfolioData.promotion?.fromGrade || 'Grade 6'} {safePortfolioData.promotion?.fromStream ? `- ${safePortfolioData.promotion.fromStream}` : ''}
                </Text>
              </View>
              
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 5 }}>To:</Text>
                <Text style={{ fontSize: 13, color: '#166534', fontWeight: 'bold' }}>
                  {safePortfolioData.promotion?.promotedToGrade || safePortfolioData.grade?.name || 'Grade 7'} - {safePortfolioData.promotion?.promotedToStream || safePortfolioData.stream?.name || 'STREAM B'}
                </Text>
              </View>
              
              {safePortfolioData.promotion?.promotionDate && (
                <View style={{ marginBottom: 12 }}>
                  <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 5 }}>Promotion Date:</Text>
                  <Text style={{ fontSize: 13, color: '#374151' }}>
                    {formatDate(safePortfolioData.promotion.promotionDate)}
                  </Text>
                </View>
              )}
              
              {safePortfolioData.promotion?.promotedBy && (
                <View>
                  <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 5 }}>Promoted By:</Text>
                  <Text style={{ fontSize: 13, color: '#374151' }}>
                    {safePortfolioData.promotion.promotedBy}
                  </Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Promotion Criteria */}
          <View style={{
            backgroundColor: '#eff6ff',
            padding: 20,
            borderRadius: 8,
            border: '1px solid #bfdbfe',
            marginBottom: 20
          }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1e40af', marginBottom: 12 }}>
              Promotion Criteria Met
            </Text>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
                ✓ Minimum academic performance requirements achieved
              </Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
                ✓ Competency-based assessments completed successfully
              </Text>
            </View>
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
                ✓ Portfolio evidence demonstrates readiness for next level
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
                ✓ All required assessments and evaluations completed
              </Text>
            </View>
          </View>
          
          {/* Next Academic Year Information */}
          <View style={{
            backgroundColor: '#fef3c7',
            padding: 20,
            borderRadius: 8,
            border: '1px solid #fbbf24'
          }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#92400e', marginBottom: 12 }}>
              Next Academic Year
            </Text>
            <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 8 }}>
              The student is hereby promoted and will continue studies in:
            </Text>
            <View style={{
              backgroundColor: '#ffffff',
              padding: 15,
              borderRadius: 6,
              border: '1px solid #f59e0b',
              marginTop: 10
            }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#92400e', textAlign: 'center' }}>
                {safePortfolioData.promotion?.promotedToGrade || safePortfolioData.grade?.name || 'Grade 7'} - {safePortfolioData.promotion?.promotedToStream || safePortfolioData.stream?.name || 'STREAM B'}
              </Text>
            </View>
            <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 12, fontStyle: 'italic', textAlign: 'center' }}>
              Academic Year {(() => {
                const currentYear = safePortfolioData.academicYear || new Date().getFullYear();
                return typeof currentYear === 'string' ? currentYear : (parseInt(currentYear.toString()) + 1).toString();
              })()}
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 3 of 30</Text>
        </View>
      </Page>

      {/* Page 4: School Activities & Achievements */}
      <Page size="A4" style={styles.contentPage}>
        
        {/* Image Row with Dark Pattern Background */}
        <View style={{ 
          position: 'relative',
          marginTop: 20, 
          marginBottom: 20,
          padding: 20,
          borderRadius: 12,
          overflow: 'hidden'
        }}>
          {/* Dark Pattern Background */}
          <Image
            src="/pdf images/dark-pattern.png"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100%',
              opacity: 0.1,
              zIndex: 0
            }}
          />
          
          {/* Images Row */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Image 1 - Graduation Ceremony */}
            <View style={{ width: '23%' }}>
              <Image
                src="/pdf images/top1.jpg"
                style={{
                  width: '100%',
                  height: 150,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
          
            </View>
            
            {/* Image 2 - Sports Team */}
            <View style={{ width: '23%' }}>
              <Image
                src="/pdf images/top2.jpg"
                style={{
                  width: '100%',
                  height: 150,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
       
            </View>
            
            {/* Image 3 - Students Running */}
            <View style={{ width: '23%' }}>
              <Image
                src="/pdf images/top3.jpg"
                style={{
                  width: '100%',
                  height: 150,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
          
            </View>
            
            {/* Image 4 - School Event */}
            <View style={{ width: '23%' }}>
              <Image
                src="/pdf images/top4.jpg"
                style={{
                  width: '100%',
                  height: 150,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
        
            </View>
          </View>
        </View>
        
        {/* Two-Column Layout: Educational Philosophy */}
        <View style={{ 
          flexDirection: 'row', 
          marginTop: 30, 
          marginBottom: 20,
          height: 350
        }}>
          {/* Left Column - Text Content */}
          <View style={{ 
            width: '45%', 
            backgroundColor: '#374151',
            padding: 25,
            borderRadius: 12,
            position: 'relative',
            overflow: 'hidden',
            marginRight: 20,
            height: 450
          }}>
            {/* Background Pattern */}
            <Image
              src="/pdf images/dark-pattern.png"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
                height: '100%',
                opacity: 0.1,
                zIndex: 0
              }}
            />
            
            {/* Content */}
            <View style={{ position: 'relative', zIndex: 1 }}>
              {/* Title */}
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: '#f3f4f6', 
                marginBottom: 8,
                lineHeight: 1.2
              }}>
                Why choose
              </Text>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: '#e5e7eb', 
                marginBottom: 20,
                lineHeight: 1.2
              }}>
                Elimurise Early Years?
              </Text>
              
              {/* Body Text */}
              <Text style={{ 
                fontSize: 12, 
                color: '#d1d5db', 
                lineHeight: 1.6,
                marginBottom: 20
              }}>
                Our education instils a passion for lifelong learning in our pupils. Our young students enjoy the freedom to express themselves as valued members of the school environment and quickly build rapport with their classmates in teacher-led lessons. They are encouraged to experiment in the classroom, explore the school grounds and get involved in school life. Every child is supported in their transition from Early Years education and is welcomed into our supportive Early Years community from their very first day.
              </Text>
              
              {/* Button */}
       
            </View>
            
          </View>
          
          {/* Right Column - Image */}
          <View style={{ 
            width: '55%',
            height: 450
          }}>
            <Image
              src="/pdf images/early-years.jpg"
              style={{
                width: '100%',
                height: 450,
                borderRadius: 12,
                objectFit: 'cover'
              }}
            />
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 4 of 30</Text>
        </View>
      </Page>

      {/* Page 5: Table of Contents */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Table of Contents</Text>
        
        {/* Table of Contents */}
        <View style={{ marginTop: 20 }}>
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 }}>1. Student Information</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>1.1 Student Details .................... 2</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>1.2 Student Promotion Management ... 3</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 }}>2. Grade-Level Curriculum Guide</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>2.1 Grade 6 Decription .............. 5</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 }}>3. Student Portfolio</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>3.1 School Activities & Achievements .... 7</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>3.2 Student Reflections .................... 8</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>3.3 Teacher Feedback ...................... 9</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 }}>4. Academic Achievements</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>4.1 Certificates & Achievements .......... 11</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>4.2 Project Evidences ..................... 12</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 }}>4. Growth & Development</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>4.1 Strengths & Improvements ............. 13</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>4.2 Academic Growth Timeline ............. 14</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>4.3 Future Goals & Aspirations ............ 15</Text>
          </View>
          
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 }}>5. Portfolio Analytics & Insights</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>5.1 Competency Achievement Charts ....... 16</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>5.2 Termly/Annual Summary Reports ...... 17</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>5.3 Teacher Narrative Insights .......... 18</Text>
            <Text style={{ fontSize: 12, color: '#6b7280', marginLeft: 20, marginBottom: 4 }}>5.4 Long-term Growth Analysis ........... 19</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 5 of 30</Text>
        </View>
      </Page>

      {/* Page 6: Intermediate Phase (Grades 6)  - DONE*/}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Grade 6 Details</Text>
        
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 }}>Expanding Horizons</Text>
          
          <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 15 }}>
            Grade 6 is an intermediate Phase that marks a significant transition where students begin to develop 
            more specialized knowledge and skills. This phase focuses on building independence, 
            critical thinking, and subject-specific competencies.
          </Text>
          
          <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 15 }}>
            Students prepare for the senior phase by developing:
          </Text>
          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontSize: 12, color: '#374151', marginBottom: 6 }}>• Advanced research and presentation skills</Text>
            <Text style={{ fontSize: 12, color: '#374151', marginBottom: 6 }}>• Critical analysis and evaluation</Text>
            <Text style={{ fontSize: 12, color: '#374151', marginBottom: 6 }}>• Leadership and responsibility</Text>
            <Text style={{ fontSize: 12, color: '#374151', marginBottom: 6 }}>• Career awareness and exploration</Text>
            <Text style={{ fontSize: 12, color: '#374151', marginBottom: 6 }}>• Study skills and time management</Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 6 of 30</Text>
        </View>
      </Page>


 
      {/* Page 7: Strengths & Improvements */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Strengths & Areas for Growth</Text>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#166534', marginBottom: 10 }}>Key Strengths</Text>
          {(safePortfolioData.strengths || []).slice(0, 5).map((strength, index) => (
            <View key={index} style={styles.strengthItem}>
              <Text style={styles.strengthText}>✓ {strength}</Text>
          </View>
          ))}
        </View>
        
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#92400e', marginBottom: 10 }}>Areas for Improvement</Text>
          {(safePortfolioData.improvements || []).slice(0, 5).map((improvement, index) => (
            <View key={index} style={styles.improvementItem}>
              <Text style={styles.improvementText}>→ {improvement}</Text>
          </View>
        ))}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>ELIMURISE SCHOOL</Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>Excellence in Education</Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>www.elimurise.edu.ke</Text>
            </View>
          </View>
          <View style={styles.footerRedLine} />
          <View style={styles.footerGrayLine} />
          <Text style={styles.pageNumber}>Page 7 of 30</Text>
        </View>
      </Page>

      {/* Page 8: Grade 6 Designs - Learning Areas */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Grade 6 Learning Areas & Subjects</Text>
        
        {/* Grade 6 Subjects Grid */}
        <View style={{ marginTop: 20 }}>
          {/* Subjects Array */}
          {[
            'Agriculture',
            'Arabic',
            'Creative Arts',
            'CRE',
            'English',
            'French',
            'German',
            'HRE',
            'Indigenous Language',
            'IRE',
            'Kiswahili',
            'Mandarin',
            'Mathematics',
            'Science & Technology',
            'Social Studies'
          ].map((subject, index) => {
            // Alternate colors for visual variety
            const colorSchemes = [
              { bg: '#f0f9ff', border: '#0ea5e9', text: '#0c4a6e' }, // Blue
              { bg: '#f0fdf4', border: '#22c55e', text: '#166534' }, // Green
              { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' }, // Yellow/Orange
              { bg: '#fdf2f8', border: '#ec4899', text: '#9f1239' }, // Pink
              { bg: '#f3e8ff', border: '#a855f7', text: '#6b21a8' }, // Purple
            ];
            const colorScheme = colorSchemes[index % colorSchemes.length];
            
            return (
              <View key={index} style={{
                backgroundColor: colorScheme.bg,
                border: `2px solid ${colorScheme.border}`,
                borderRadius: 8,
                padding: 12,
                marginBottom: 10,
              }}>
                <Text style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: colorScheme.text,
                  textAlign: 'center'
                }}>
                  {subject}
                </Text>
          </View>
            );
          })}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>ELIMURISE SCHOOL</Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>Excellence in Education</Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>www.elimurise.edu.ke</Text>
            </View>
          </View>
          <View style={styles.footerRedLine} />
          <View style={styles.footerGrayLine} />
          <Text style={styles.pageNumber}>Page 8 of 30</Text>
        </View>
      </Page>

      {/* Page 9: Grade 6 Results Table */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Grade 6 Academic Results</Text>
        
        {/* Results Table */}
        <View style={{ marginTop: 20 }}>
          {/* Table Header */}
          <View style={{ 
            flexDirection: 'row', 
            backgroundColor: '#10b981', 
            padding: 12,
            borderRadius: 6,
            marginBottom: 8
          }}>
            <View style={{ width: '50%', paddingRight: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>Subject</Text>
            </View>
            <View style={{ width: '15%', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>Marks</Text>
            </View>
            <View style={{ width: '15%', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>Grade</Text>
            </View>
            <View style={{ width: '20%', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>Remarks</Text>
            </View>
        </View>
        
          {/* Sample Results Data */}
          {[
            { subject: 'Agriculture', marks: 85, grade: 'A', remarks: 'Excellent' },
            { subject: 'Arabic', marks: 78, grade: 'B+', remarks: 'Good' },
            { subject: 'Creative Arts', marks: 92, grade: 'A', remarks: 'Excellent' },
            { subject: 'CRE', marks: 88, grade: 'A', remarks: 'Excellent' },
            { subject: 'English', marks: 90, grade: 'A', remarks: 'Excellent' },
            { subject: 'French', marks: 75, grade: 'B', remarks: 'Good' },
            { subject: 'German', marks: 80, grade: 'A-', remarks: 'Very Good' },
            { subject: 'HRE', marks: 82, grade: 'A-', remarks: 'Very Good' },
            { subject: 'Indigenous Language', marks: 87, grade: 'A', remarks: 'Excellent' },
            { subject: 'IRE', marks: 83, grade: 'A-', remarks: 'Very Good' },
            { subject: 'Kiswahili', marks: 89, grade: 'A', remarks: 'Excellent' },
            { subject: 'Mandarin', marks: 76, grade: 'B+', remarks: 'Good' },
            { subject: 'Mathematics', marks: 94, grade: 'A', remarks: 'Outstanding' },
            { subject: 'Science & Technology', marks: 91, grade: 'A', remarks: 'Excellent' },
            { subject: 'Social Studies', marks: 86, grade: 'A', remarks: 'Excellent' },
          ].map((result, index) => {
            // Determine row color based on grade
            const getRowStyle = (grade: string) => {
              if (grade === 'A') return { bg: '#f0fdf4', border: '#22c55e' }; // Green
              if (grade.startsWith('A-')) return { bg: '#f0f9ff', border: '#0ea5e9' }; // Blue
              if (grade.startsWith('B+')) return { bg: '#fef3c7', border: '#f59e0b' }; // Yellow
              return { bg: '#f8fafc', border: '#cbd5e1' }; // Gray
            };
            
            const rowStyle = getRowStyle(result.grade);
            
            return (
              <View key={index} style={{ 
                flexDirection: 'row', 
                marginBottom: 6,
                border: `1px solid ${rowStyle.border}`,
                borderRadius: 4,
                backgroundColor: rowStyle.bg,
                padding: 10
              }}>
                <View style={{ width: '50%', paddingRight: 10 }}>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#1f2937' }}>
                    {result.subject}
                  </Text>
            </View>
                <View style={{ width: '15%', alignItems: 'center' }}>
                  <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#374151' }}>
                    {result.marks}%
                  </Text>
                </View>
                <View style={{ width: '15%', alignItems: 'center' }}>
                  <Text style={{ 
                    fontSize: 11, 
                    fontWeight: 'bold', 
                    color: result.grade === 'A' ? '#166534' : 
                           result.grade.startsWith('A-') ? '#0c4a6e' :
                           result.grade.startsWith('B+') ? '#92400e' : '#374151'
                  }}>
                    {result.grade}
                  </Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, color: '#6b7280', fontStyle: 'italic' }}>
                    {result.remarks}
                  </Text>
                </View>
              </View>
            );
          })}
          
          {/* Overall Class Position */}
          {safePortfolioData.cohortInfo && safePortfolioData.cohortInfo.classPosition && (
            <View style={{ 
              marginTop: 20,
              backgroundColor: '#f0f9ff',
              padding: 15,
              borderRadius: 8,
              border: '2px solid #0ea5e9',
              alignItems: 'center'
            }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1f2937', marginBottom: 5 }}>
                Overall Class Position
              </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0c4a6e' }}>
                Position {safePortfolioData.cohortInfo.classPosition} out of {safePortfolioData.cohortInfo.totalStudents} students
              </Text>
            </View>
          )}
          
          {/* Summary Section */}
          <View style={{ 
            marginTop: 80,
            backgroundColor: '#f8fafc',
            padding: 15,
            borderRadius: 8,
            border: '2px solid #10b981'
          }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1f2937', marginBottom: 10, textAlign: 'center' }}>
              Summary Statistics
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Average Marks</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}>84.5%</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Total Subjects</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}>15</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Overall Grade</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}>A</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>ELIMURISE SCHOOL</Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>Excellence in Education</Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>www.elimurise.edu.ke</Text>
            </View>
          </View>
          <View style={styles.footerRedLine} />
          <View style={styles.footerGrayLine} />
          <Text style={styles.pageNumber}>Page 9 of 30</Text>
        </View>
      </Page>

      {/* Page 10: Subject Performance & Enrollment Details */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Subject Performance & Enrollment Details</Text>
        
        <View style={{ marginTop: 20 }}>
          {/* Subject Enrollment Table */}
          <View style={{ marginBottom: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#166534', marginBottom: 10 }}>
              Current Subject Enrollments
            </Text>
            
            {/* Table Header */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#10b981',
              padding: 10,
              borderRadius: 6,
              marginBottom: 8
            }}>
              <View style={{ width: '25%' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>Subject</Text>
              </View>
              <View style={{ width: '15%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>Grade</Text>
              </View>
              <View style={{ width: '15%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>Score</Text>
              </View>
              <View style={{ width: '15%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>Attendance</Text>
              </View>
              <View style={{ width: '30%' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>Teacher</Text>
              </View>
            </View>
            
            {/* Table Rows */}
            {(safePortfolioData.subjectEnrollments || []).map((enrollment, index) => {
              const subject = enrollment.subject || {};
              const perf = enrollment.performance || {};
              
              return (
                <View key={index} style={{
                  flexDirection: 'row',
                  backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff',
                  padding: 10,
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <View style={{ width: '25%' }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#1f2937' }}>
                      {subject.name}
                    </Text>
                    <Text style={{ fontSize: 9, color: '#6b7280' }}>
                      {subject.code} ({subject.category})
                    </Text>
                  </View>
                  <View style={{ width: '15%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#166534' }}>
                      {perf.grade || 'N/A'}
                    </Text>
                  </View>
                  <View style={{ width: '15%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#374151' }}>
                      {perf.averageScore || 'N/A'}%
                    </Text>
                  </View>
                  <View style={{ width: '15%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#374151' }}>
                      {perf.attendance || 'N/A'}%
                    </Text>
                  </View>
                  <View style={{ width: '30%' }}>
                    <Text style={{ fontSize: 10, color: '#6b7280' }}>
                      {enrollment.teacher || 'N/A'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          
          {/* Summary Statistics */}
          <View style={{
            backgroundColor: '#f0fdf4',
            padding: 15,
            borderRadius: 8,
            border: '2px solid #22c55e',
            marginTop: 15
          }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#166534', marginBottom: 10 }}>
              Enrollment Summary
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Total Subjects</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#10b981' }}>
                  {(safePortfolioData.subjectEnrollments || []).length}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Total Credits</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#10b981' }}>
                  {(safePortfolioData.subjectEnrollments || []).reduce((sum, e) => sum + (e.credits || 0), 0)}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Hours/Week</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#10b981' }}>
                  {(safePortfolioData.subjectEnrollments || []).reduce((sum, e) => sum + (e.hoursPerWeek || 0), 0)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 10 of 30</Text>
        </View>
      </Page>

      {/* Page 11: Student Fees Summary (Term 1 to Term 3) */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Student Fees Summary</Text>
        
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 20 }}>
            This summary provides an overview of fees paid by the student from Term 1 to Term 3 of the academic year.
          </Text>
          
          {/* Fees Summary Table */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#166534', marginBottom: 10 }}>
              Fees Summary by Term
            </Text>
            
            {/* Table Header */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#10b981',
              padding: 10,
              borderRadius: 6,
              marginBottom: 8
            }}>
              <View style={{ width: '30%' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>Term</Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>Amount Due</Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>Amount Paid</Text>
              </View>
              <View style={{ width: '20%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>Balance</Text>
              </View>
            </View>
            
            {/* Term 1 Row */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#f8fafc',
              padding: 10,
              borderBottom: '1px solid #e2e8f0'
            }}>
              <View style={{ width: '30%' }}>
                <Text style={{ fontSize: 11, color: '#374151', fontWeight: 'bold' }}>Term 1</Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#374151' }}>
                  {safePortfolioData.fees?.term1?.amountDue ? 
                    `KES ${safePortfolioData.fees.term1.amountDue.toLocaleString()}` : 
                    'KES 0'}
                </Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#166534', fontWeight: 'bold' }}>
                  {safePortfolioData.fees?.term1?.amountPaid ? 
                    `KES ${safePortfolioData.fees.term1.amountPaid.toLocaleString()}` : 
                    'KES 0'}
                </Text>
              </View>
              <View style={{ width: '20%', alignItems: 'center' }}>
                <Text style={{ 
                  fontSize: 11, 
                  color: (safePortfolioData.fees?.term1?.balance || 0) > 0 ? '#dc2626' : '#166534',
                  fontWeight: 'bold'
                }}>
                  {safePortfolioData.fees?.term1?.balance !== undefined ? 
                    `KES ${safePortfolioData.fees.term1.balance.toLocaleString()}` : 
                    'KES 0'}
                </Text>
              </View>
            </View>
            
            {/* Term 2 Row */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#ffffff',
              padding: 10,
              borderBottom: '1px solid #e2e8f0'
            }}>
              <View style={{ width: '30%' }}>
                <Text style={{ fontSize: 11, color: '#374151', fontWeight: 'bold' }}>Term 2</Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#374151' }}>
                  {safePortfolioData.fees?.term2?.amountDue ? 
                    `KES ${safePortfolioData.fees.term2.amountDue.toLocaleString()}` : 
                    'KES 0'}
                </Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#166534', fontWeight: 'bold' }}>
                  {safePortfolioData.fees?.term2?.amountPaid ? 
                    `KES ${safePortfolioData.fees.term2.amountPaid.toLocaleString()}` : 
                    'KES 0'}
                </Text>
              </View>
              <View style={{ width: '20%', alignItems: 'center' }}>
                <Text style={{ 
                  fontSize: 11, 
                  color: (safePortfolioData.fees?.term2?.balance || 0) > 0 ? '#dc2626' : '#166534',
                  fontWeight: 'bold'
                }}>
                  {safePortfolioData.fees?.term2?.balance !== undefined ? 
                    `KES ${safePortfolioData.fees.term2.balance.toLocaleString()}` : 
                    'KES 0'}
                </Text>
              </View>
            </View>
            
            {/* Term 3 Row */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#f8fafc',
              padding: 10,
              borderBottom: '1px solid #e2e8f0'
            }}>
              <View style={{ width: '30%' }}>
                <Text style={{ fontSize: 11, color: '#374151', fontWeight: 'bold' }}>Term 3</Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#374151' }}>
                  {safePortfolioData.fees?.term3?.amountDue ? 
                    `KES ${safePortfolioData.fees.term3.amountDue.toLocaleString()}` : 
                    'KES 0'}
                </Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#166534', fontWeight: 'bold' }}>
                  {safePortfolioData.fees?.term3?.amountPaid ? 
                    `KES ${safePortfolioData.fees.term3.amountPaid.toLocaleString()}` : 
                    'KES 0'}
                </Text>
              </View>
              <View style={{ width: '20%', alignItems: 'center' }}>
                <Text style={{ 
                  fontSize: 11, 
                  color: (safePortfolioData.fees?.term3?.balance || 0) > 0 ? '#dc2626' : '#166534',
                  fontWeight: 'bold'
                }}>
                  {safePortfolioData.fees?.term3?.balance !== undefined ? 
                    `KES ${safePortfolioData.fees.term3.balance.toLocaleString()}` : 
                    'KES 0'}
                </Text>
              </View>
            </View>
            
            {/* Total Row */}
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#10b981',
              padding: 12,
              borderRadius: 6,
              marginTop: 8
            }}>
              <View style={{ width: '30%' }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>Total</Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>
                  {(() => {
                    const totalDue = (safePortfolioData.fees?.term1?.amountDue || 0) + 
                                   (safePortfolioData.fees?.term2?.amountDue || 0) + 
                                   (safePortfolioData.fees?.term3?.amountDue || 0);
                    return `KES ${totalDue.toLocaleString()}`;
                  })()}
                </Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>
                  {(() => {
                    const totalPaid = (safePortfolioData.fees?.term1?.amountPaid || 0) + 
                                    (safePortfolioData.fees?.term2?.amountPaid || 0) + 
                                    (safePortfolioData.fees?.term3?.amountPaid || 0);
                    return `KES ${totalPaid.toLocaleString()}`;
                  })()}
                </Text>
              </View>
              <View style={{ width: '20%', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>
                  {(() => {
                    const totalBalance = (safePortfolioData.fees?.term1?.balance || 0) + 
                                       (safePortfolioData.fees?.term2?.balance || 0) + 
                                       (safePortfolioData.fees?.term3?.balance || 0);
                    return `KES ${totalBalance.toLocaleString()}`;
                  })()}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Payment Details Section */}
          {safePortfolioData.fees?.paymentDetails && safePortfolioData.fees.paymentDetails.length > 0 && (
            <View style={{ marginTop: 25 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#166534', marginBottom: 10 }}>
                Payment Details
              </Text>
              
              {/* Payment Details Table Header */}
              <View style={{
                flexDirection: 'row',
                backgroundColor: '#10b981',
                padding: 10,
                borderRadius: 6,
                marginBottom: 8
              }}>
                <View style={{ width: '20%' }}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Date</Text>
                </View>
                <View style={{ width: '20%' }}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Term</Text>
                </View>
                <View style={{ width: '25%', alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Amount</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Method</Text>
                </View>
                <View style={{ width: '15%', alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Status</Text>
                </View>
              </View>
              
              {/* Payment Details Rows */}
              {safePortfolioData.fees.paymentDetails.slice(0, 10).map((payment: any, index: number) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff',
                  padding: 8,
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <View style={{ width: '20%' }}>
                    <Text style={{ fontSize: 9, color: '#374151' }}>
                      {payment.date ? formatDate(payment.date) : 'N/A'}
                    </Text>
                  </View>
                  <View style={{ width: '20%' }}>
                    <Text style={{ fontSize: 9, color: '#374151' }}>
                      {payment.term || 'N/A'}
                    </Text>
                  </View>
                  <View style={{ width: '25%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 9, color: '#374151', fontWeight: 'bold' }}>
                      {payment.amount ? `KES ${payment.amount.toLocaleString()}` : 'KES 0'}
                    </Text>
                  </View>
                  <View style={{ width: '20%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 9, color: '#374151' }}>
                      {payment.method || 'N/A'}
                    </Text>
                  </View>
                  <View style={{ width: '15%', alignItems: 'center' }}>
                    <Text style={{ 
                      fontSize: 9, 
                      color: payment.status === 'Completed' || payment.status === 'Paid' ? '#166534' : '#dc2626',
                      fontWeight: 'bold'
                    }}>
                      {payment.status || 'Pending'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
          
          {/* Summary Notes */}
          <View style={{ marginTop: 25, padding: 15, backgroundColor: '#f0fdf4', borderRadius: 6, border: '1px solid #bbf7d0' }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#166534', marginBottom: 8 }}>
              Summary Notes
            </Text>
            <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.5, marginBottom: 5 }}>
              • This summary reflects fees paid from Term 1 to Term 3 of the current academic year.
            </Text>
            <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.5, marginBottom: 5 }}>
              • All amounts are displayed in Kenya Shillings (KES).
            </Text>
            <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>
              • For detailed payment receipts or inquiries, please contact the school administration.
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 11 of 30</Text>
        </View>
      </Page>

      {/* Page 12: Term Performance Graphs (Term 1 to Term 3) */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Term Performance Analysis</Text>
        
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 20 }}>
            Visual representation of student performance across Term 1, Term 2, and Term 3, showcasing growth trends and achievement patterns.
          </Text>
          
          {/* Helper function to render bar chart */}
          {(() => {
            const renderBarChart = (title: any, data: any[], maxValue: number, unit: string = '') => {
              const maxBarHeight = 120;
              
              return (
                <View style={{ marginBottom: 25 }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#166534', marginBottom: 12 }}>
                    {title}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginBottom: 10 }}>
                    {data.map((item, index) => {
                      const barHeight = maxValue > 0 ? (item.value / maxValue) * maxBarHeight : 0;
                      return (
                        <View key={index} style={{ alignItems: 'center', width: '28%' }}>
                          <View style={{
                            width: '100%',
                            alignItems: 'center',
                            marginBottom: 5
                          }}>
                            <View style={{
                              width: '80%',
                              height: maxBarHeight,
                              backgroundColor: '#f0f0f0',
                              borderRadius: 4,
                              position: 'relative',
                              justifyContent: 'flex-end'
                            }}>
                              <View style={{
                                width: '100%',
                                height: barHeight,
                                backgroundColor: item.color,
                                borderRadius: 4,
                                border: '1px solid #e2e8f0'
                              }} />
                              <Text style={{
                                position: 'absolute',
                                top: barHeight > 15 ? -15 : barHeight + 5,
                                fontSize: 10,
                                fontWeight: 'bold',
                                color: '#374151',
                                width: '100%',
                                textAlign: 'center'
                              }}>
                                {item.value.toFixed(1)}{unit}
                              </Text>
                            </View>
                          </View>
                          <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 5, fontWeight: 'bold' }}>
                            {item.term}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  
                  {/* Y-axis labels */}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 5 }}>
                    <Text style={{ fontSize: 8, color: '#9ca3af' }}>0</Text>
                    <Text style={{ fontSize: 8, color: '#9ca3af' }}>{maxValue > 0 ? (maxValue / 2).toFixed(1) : ''}</Text>
                    <Text style={{ fontSize: 8, color: '#9ca3af' }}>{maxValue.toFixed(1)}{unit}</Text>
                  </View>
                </View>
              );
            };

            // Get term performance data
            const termPerformance = safePortfolioData.termPerformance || {
              term1: { averageRating: 4.2, evidenceCount: 8, competencyCount: 5 },
              term2: { averageRating: 4.4, evidenceCount: 12, competencyCount: 6 },
              term3: { averageRating: 4.6, evidenceCount: 15, competencyCount: 7 }
            };

            // Average Rating Chart
            const ratingData = [
              { term: 'Term 1', value: termPerformance.term1?.averageRating || 4.2, color: '#3b82f6' },
              { term: 'Term 2', value: termPerformance.term2?.averageRating || 4.4, color: '#10b981' },
              { term: 'Term 3', value: termPerformance.term3?.averageRating || 4.6, color: '#f59e0b' }
            ];
            const maxRating = Math.max(...ratingData.map(d => d.value), 5);

            // Evidence Count Chart
            const evidenceData = [
              { term: 'Term 1', value: termPerformance.term1?.evidenceCount || 8, color: '#3b82f6' },
              { term: 'Term 2', value: termPerformance.term2?.evidenceCount || 12, color: '#10b981' },
              { term: 'Term 3', value: termPerformance.term3?.evidenceCount || 15, color: '#f59e0b' }
            ];
            const maxEvidence = Math.max(...evidenceData.map(d => d.value), 20);

            // Competency Count Chart
            const competencyData = [
              { term: 'Term 1', value: termPerformance.term1?.competencyCount || 5, color: '#3b82f6' },
              { term: 'Term 2', value: termPerformance.term2?.competencyCount || 6, color: '#10b981' },
              { term: 'Term 3', value: termPerformance.term3?.competencyCount || 7, color: '#f59e0b' }
            ];
            const maxCompetency = Math.max(...competencyData.map(d => d.value), 10);

            return (
              <>
                {renderBarChart('Average Rating per Term', ratingData, maxRating, '/5')}
                {renderBarChart('Evidence Submissions per Term', evidenceData, maxEvidence, '')}
                {renderBarChart('Competencies Developed per Term', competencyData, maxCompetency, '')}
              </>
            );
          })()}
          
          {/* Performance Trend Summary Table */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#166534', marginBottom: 12 }}>
              Performance Summary by Term
            </Text>
            
            <View style={{
              backgroundColor: '#10b981',
              padding: 10,
              borderRadius: 6,
              marginBottom: 8,
              flexDirection: 'row'
            }}>
              <View style={{ width: '25%' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>Metric</Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>Term 1</Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>Term 2</Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#ffffff' }}>Term 3</Text>
              </View>
            </View>
            
            {(() => {
              const termPerf = safePortfolioData.termPerformance || {
                term1: { averageRating: 4.2, evidenceCount: 8, competencyCount: 5, projectCount: 3 },
                term2: { averageRating: 4.4, evidenceCount: 12, competencyCount: 6, projectCount: 5 },
                term3: { averageRating: 4.6, evidenceCount: 15, competencyCount: 7, projectCount: 6 }
              };

              const metrics = [
                { label: 'Avg Rating', term1: termPerf.term1?.averageRating || 0, term2: termPerf.term2?.averageRating || 0, term3: termPerf.term3?.averageRating || 0, format: (v: number) => v.toFixed(1) },
                { label: 'Evidences', term1: termPerf.term1?.evidenceCount || 0, term2: termPerf.term2?.evidenceCount || 0, term3: termPerf.term3?.evidenceCount || 0, format: (v: number) => v.toString() },
                { label: 'Competencies', term1: termPerf.term1?.competencyCount || 0, term2: termPerf.term2?.competencyCount || 0, term3: termPerf.term3?.competencyCount || 0, format: (v: number) => v.toString() },
                { label: 'Projects', term1: termPerf.term1?.projectCount || 0, term2: termPerf.term2?.projectCount || 0, term3: termPerf.term3?.projectCount || 0, format: (v: number) => v.toString() }
              ];

              return metrics.map((metric, index) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff',
                  padding: 10,
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <View style={{ width: '25%' }}>
                    <Text style={{ fontSize: 10, color: '#374151', fontWeight: 'bold' }}>{metric.label}</Text>
                  </View>
                  <View style={{ width: '25%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#374151' }}>{metric.format(metric.term1)}</Text>
                  </View>
                  <View style={{ width: '25%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#374151' }}>{metric.format(metric.term2)}</Text>
                  </View>
                  <View style={{ width: '25%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#374151', fontWeight: 'bold' }}>{metric.format(metric.term3)}</Text>
                  </View>
                </View>
              ));
            })()}
          </View>
          
          {/* Growth Trend Analysis */}
          <View style={{ marginTop: 20, padding: 15, backgroundColor: '#eff6ff', borderRadius: 6, border: '1px solid #bfdbfe' }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1e40af', marginBottom: 8 }}>
              Growth Trend Analysis
            </Text>
            <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.5, marginBottom: 5 }}>
              • The student shows consistent improvement across all performance metrics from Term 1 to Term 3.
            </Text>
            <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.5, marginBottom: 5 }}>
              • Evidence submissions increased by {(() => {
                const termPerf = safePortfolioData.termPerformance || {
                  term1: { evidenceCount: 8 },
                  term3: { evidenceCount: 15 }
                };
                const increase = (termPerf.term3?.evidenceCount || 15) - (termPerf.term1?.evidenceCount || 8);
                return `${increase}`;
              })()} submissions from Term 1 to Term 3.
            </Text>
            <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>
              • Average rating improved by {(() => {
                const termPerf = safePortfolioData.termPerformance || {
                  term1: { averageRating: 4.2 },
                  term3: { averageRating: 4.6 }
                };
                const improvement = ((termPerf.term3?.averageRating || 4.6) - (termPerf.term1?.averageRating || 4.2)).toFixed(1);
                return `${improvement}`;
              })()} points, demonstrating continuous academic growth.
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 12 of 30</Text>
        </View>
      </Page>

      {/* Page 13: Formative Assessments */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Formative Assessments</Text>
        
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 15 }}>
            Formative assessments are organized by Learning Area, Term, Strand, and Substrand, providing detailed evaluation of student progress across curriculum components.
          </Text>
          
          {/* Images Section */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            marginTop: 10
          }}>
            <View style={{ width: '48%' }}>
              <Image
                src="/pdf images/top3.jpg"
                style={{
                  width: '100%',
                  height: 100,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
              <Text style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', marginTop: 5, fontStyle: 'italic' }}>
                Ongoing Assessment
              </Text>
            </View>
            
            <View style={{ width: '48%' }}>
              <Image
                src="/pdf images/top4.jpg"
                style={{
                  width: '100%',
                  height: 100,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
              <Text style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', marginTop: 5, fontStyle: 'italic' }}>
                Learning Progress
              </Text>
            </View>
          </View>
          
          {/* Formative Assessments by Learning Area, Term, Strand, Substrand */}
          {(() => {
            const formativeAssessments = safePortfolioData.formativeAssessments || [
              {
                learningArea: 'English Language Activities',
                term: 'Term 1',
                strand: 'Listening and Speaking',
                substrand: 'Listening Comprehension',
                indicators: [
                  { description: 'Demonstrates understanding of spoken instructions', progress: '85%', method: 'Oral Assessment' },
                  { description: 'Responds appropriately to questions', progress: '78%', method: 'Class Discussion' },
                  { description: 'Follows multi-step directions', progress: '82%', method: 'Practical Task' }
                ]
              },
              {
                learningArea: 'English Language Activities',
                term: 'Term 1',
                strand: 'Reading',
                substrand: 'Reading Fluency',
                indicators: [
                  { description: 'Reads grade-level texts with accuracy', progress: '80%', method: 'Reading Assessment' },
                  { description: 'Uses appropriate expression and intonation', progress: '75%', method: 'Oral Reading' }
                ]
              },
              {
                learningArea: 'Mathematics',
                term: 'Term 1',
                strand: 'Number',
                substrand: 'Number Operations',
                indicators: [
                  { description: 'Performs addition and subtraction accurately', progress: '88%', method: 'Written Test' },
                  { description: 'Solves word problems involving operations', progress: '82%', method: 'Problem Solving' }
                ]
              },
              {
                learningArea: 'Mathematics',
                term: 'Term 2',
                strand: 'Measurement',
                substrand: 'Length and Area',
                indicators: [
                  { description: 'Measures length using standard units', progress: '90%', method: 'Practical Task' },
                  { description: 'Calculates area of simple shapes', progress: '85%', method: 'Written Assessment' }
                ]
              },
              {
                learningArea: 'Science and Technology',
                term: 'Term 2',
                strand: 'Living Things',
                substrand: 'Plants',
                indicators: [
                  { description: 'Identifies parts of a plant', progress: '92%', method: 'Observation' },
                  { description: 'Describes plant growth requirements', progress: '88%', method: 'Project Work' }
                ]
              },
              {
                learningArea: 'Science and Technology',
                term: 'Term 3',
                strand: 'Matter and Energy',
                substrand: 'Forces',
                indicators: [
                  { description: 'Identifies different types of forces', progress: '85%', method: 'Experiment' },
                  { description: 'Explains effects of forces on objects', progress: '80%', method: 'Written Test' }
                ]
              }
            ];

            // Group assessments by Learning Area
            const groupedByLearningArea: any = {};
            formativeAssessments.forEach((assessment: any) => {
              const key = assessment.learningArea || 'Other';
              if (!groupedByLearningArea[key]) {
                groupedByLearningArea[key] = [];
              }
              groupedByLearningArea[key].push(assessment);
            });

            return Object.entries(groupedByLearningArea).map(([learningArea, assessments]: [string, any]) => (
              <View key={learningArea} style={{ marginBottom: 20 }}>
                <View style={{
                  backgroundColor: '#10b981',
                  padding: 12,
                  borderRadius: 6,
                  marginBottom: 10
                }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#ffffff' }}>
                    {learningArea}
                  </Text>
                </View>

                {assessments.map((assessment: any, idx: number) => (
                  <View key={idx} style={{
                    backgroundColor: '#f8fafc',
                    padding: 12,
                    borderRadius: 6,
                    marginBottom: 12,
                    border: '1px solid #e2e8f0'
                  }}>
                    {/* Assessment Details Header */}
                    <View style={{
                      flexDirection: 'row',
                      marginBottom: 10,
                      flexWrap: 'wrap'
                    }}>
                      <View style={{ backgroundColor: '#e0f2fe', padding: 6, borderRadius: 4, marginRight: 8, marginBottom: 4 }}>
                        <Text style={{ fontSize: 9, color: '#0369a1', fontWeight: 'bold' }}>Term: {assessment.term}</Text>
                      </View>
                      <View style={{ backgroundColor: '#fef3c7', padding: 6, borderRadius: 4, marginRight: 8, marginBottom: 4 }}>
                        <Text style={{ fontSize: 9, color: '#92400e', fontWeight: 'bold' }}>Strand: {assessment.strand}</Text>
                      </View>
                      <View style={{ backgroundColor: '#f3e8ff', padding: 6, borderRadius: 4, marginBottom: 4 }}>
                        <Text style={{ fontSize: 9, color: '#6b21a8', fontWeight: 'bold' }}>Substrand: {assessment.substrand}</Text>
                      </View>
                    </View>

                    {/* Indicators Table */}
                    <View style={{ marginTop: 8 }}>
                      <View style={{
                        backgroundColor: '#1e293b',
                        padding: 8,
                        borderRadius: 4,
                        marginBottom: 6,
                        flexDirection: 'row'
                      }}>
                        <View style={{ width: '40%' }}>
                          <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#ffffff' }}>Description</Text>
                        </View>
                        <View style={{ width: '20%', alignItems: 'center' }}>
                          <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#ffffff' }}>Progress</Text>
                        </View>
                        <View style={{ width: '40%' }}>
                          <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#ffffff' }}>Method</Text>
                        </View>
                      </View>

                      {(assessment.indicators || []).map((indicator: any, indIdx: number) => (
                        <View key={indIdx} style={{
                          flexDirection: 'row',
                          backgroundColor: indIdx % 2 === 0 ? '#ffffff' : '#f8fafc',
                          padding: 8,
                          borderBottom: '1px solid #e2e8f0'
                        }}>
                          <View style={{ width: '40%' }}>
                            <Text style={{ fontSize: 9, color: '#374151', lineHeight: 1.4 }}>
                              {indicator.description}
                            </Text>
                          </View>
                          <View style={{ width: '20%', alignItems: 'center' }}>
                            <View style={{
                              backgroundColor: parseFloat(indicator.progress) >= 80 ? '#dcfce7' : parseFloat(indicator.progress) >= 60 ? '#fef3c7' : '#fee2e2',
                              padding: 4,
                              borderRadius: 4,
                              minWidth: 50
                            }}>
                              <Text style={{
                                fontSize: 9,
                                fontWeight: 'bold',
                                color: parseFloat(indicator.progress) >= 80 ? '#166534' : parseFloat(indicator.progress) >= 60 ? '#92400e' : '#dc2626'
                              }}>
                                {indicator.progress}
                              </Text>
                            </View>
                          </View>
                          <View style={{ width: '40%' }}>
                            <Text style={{ fontSize: 9, color: '#6b7280' }}>
                              {indicator.method}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ));
          })()}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 13 of 30</Text>
        </View>
      </Page>

      {/* Page 14: Summative Assessments */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Summative Assessments</Text>
        
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 15 }}>
            Summative assessments evaluate student learning at the end of instructional units or terms, providing comprehensive evaluation of achievement.
          </Text>
          
          {/* Images Section */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            marginTop: 10
          }}>
            <View style={{ width: '48%' }}>
              <Image
                src="/pdf images/early-years.jpg"
                style={{
                  width: '100%',
                  height: 120,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
              <Text style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', marginTop: 5, fontStyle: 'italic' }}>
                Final Evaluation
              </Text>
            </View>
            
            <View style={{ width: '48%' }}>
              <Image
                src="/pdf images/top1.jpg"
                style={{
                  width: '100%',
                  height: 120,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
              <Text style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', marginTop: 5, fontStyle: 'italic' }}>
                Achievement Recognition
              </Text>
            </View>
          </View>
          
          {/* Summative Assessment Charts */}
          {(() => {
            const renderBarChart = (title: any, data: any[], maxValue: number, unit: string = '') => {
              const maxBarHeight = 100;
              
              return (
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#166534', marginBottom: 12 }}>
                    {title}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', marginBottom: 10 }}>
                    {data.map((item, index) => {
                      const barHeight = maxValue > 0 ? (item.value / maxValue) * maxBarHeight : 0;
                      return (
                        <View key={index} style={{ alignItems: 'center', width: '28%' }}>
                          <View style={{
                            width: '100%',
                            alignItems: 'center',
                            marginBottom: 5
                          }}>
                            <View style={{
                              width: '80%',
                              height: maxBarHeight,
                              backgroundColor: '#f0f0f0',
                              borderRadius: 4,
                              position: 'relative',
                              justifyContent: 'flex-end'
                            }}>
                              <View style={{
                                width: '100%',
                                height: barHeight,
                                backgroundColor: item.color,
                                borderRadius: 4,
                                border: '1px solid #e2e8f0'
                              }} />
                              <Text style={{
                                position: 'absolute',
                                top: barHeight > 15 ? -15 : barHeight + 5,
                                fontSize: 9,
                                fontWeight: 'bold',
                                color: '#374151',
                                width: '100%',
                                textAlign: 'center'
                              }}>
                                {item.value.toFixed(1)}{unit}
                              </Text>
                            </View>
                          </View>
                          <Text style={{ fontSize: 9, color: '#6b7280', marginTop: 5, fontWeight: 'bold' }}>
                            {item.term}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 5 }}>
                    <Text style={{ fontSize: 8, color: '#9ca3af' }}>0</Text>
                    <Text style={{ fontSize: 8, color: '#9ca3af' }}>{maxValue > 0 ? (maxValue / 2).toFixed(1) : ''}</Text>
                    <Text style={{ fontSize: 8, color: '#9ca3af' }}>{maxValue.toFixed(1)}{unit}</Text>
                  </View>
                </View>
              );
            };

            // Get summative assessment data
            const summativeData = safePortfolioData.summativeAssessments || {
              term1: { exams: 2, tests: 3, averageScore: 75, grade: 'B+' },
              term2: { exams: 2, tests: 4, averageScore: 80, grade: 'A-' },
              term3: { exams: 2, tests: 4, averageScore: 85, grade: 'A' }
            };

            // Average Score Chart
            const scoreData = [
              { term: 'Term 1', value: summativeData.term1?.averageScore || 75, color: '#3b82f6' },
              { term: 'Term 2', value: summativeData.term2?.averageScore || 80, color: '#10b981' },
              { term: 'Term 3', value: summativeData.term3?.averageScore || 85, color: '#f59e0b' }
            ];
            const maxScore = Math.max(...scoreData.map(d => d.value), 100);

            // Number of Assessments Chart
            const assessmentCountData = [
              { term: 'Term 1', value: (summativeData.term1?.exams || 0) + (summativeData.term1?.tests || 0), color: '#3b82f6' },
              { term: 'Term 2', value: (summativeData.term2?.exams || 0) + (summativeData.term2?.tests || 0), color: '#10b981' },
              { term: 'Term 3', value: (summativeData.term3?.exams || 0) + (summativeData.term3?.tests || 0), color: '#f59e0b' }
            ];
            const maxCount = Math.max(...assessmentCountData.map(d => d.value), 10);

            return (
              <>
                {renderBarChart('Average Summative Assessment Scores', scoreData, maxScore, '%')}
                {renderBarChart('Total Summative Assessments per Term', assessmentCountData, maxCount, '')}
              </>
            );
          })()}
          
          {/* Summative Assessment Summary Table */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#166534', marginBottom: 12 }}>
              Summative Assessment Summary by Term
            </Text>
            
            <View style={{
              backgroundColor: '#10b981',
              padding: 10,
              borderRadius: 6,
              marginBottom: 8,
              flexDirection: 'row'
            }}>
              <View style={{ width: '25%' }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Assessment Type</Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Term 1</Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Term 2</Text>
              </View>
              <View style={{ width: '25%', alignItems: 'center' }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Term 3</Text>
              </View>
            </View>
            
            {(() => {
              const summativeData = safePortfolioData.summativeAssessments || {
                term1: { exams: 2, tests: 3, averageScore: 75, grade: 'B+' },
                term2: { exams: 2, tests: 4, averageScore: 80, grade: 'A-' },
                term3: { exams: 2, tests: 4, averageScore: 85, grade: 'A' }
              };

              const assessmentTypes = [
                { label: 'Exams', term1: summativeData.term1?.exams || 0, term2: summativeData.term2?.exams || 0, term3: summativeData.term3?.exams || 0 },
                { label: 'Tests', term1: summativeData.term1?.tests || 0, term2: summativeData.term2?.tests || 0, term3: summativeData.term3?.tests || 0 },
                { label: 'Avg Score %', term1: summativeData.term1?.averageScore || 0, term2: summativeData.term2?.averageScore || 0, term3: summativeData.term3?.averageScore || 0 },
                { label: 'Grade', term1: summativeData.term1?.grade || 'B+', term2: summativeData.term2?.grade || 'A-', term3: summativeData.term3?.grade || 'A' }
              ];

              return assessmentTypes.map((type, index) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff',
                  padding: 10,
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <View style={{ width: '25%' }}>
                    <Text style={{ fontSize: 10, color: '#374151', fontWeight: 'bold' }}>{type.label}</Text>
                  </View>
                  <View style={{ width: '25%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#374151' }}>
                      {type.label === 'Avg Score %' ? `${type.term1}%` : type.label === 'Grade' ? type.term1 : type.term1}
                    </Text>
                  </View>
                  <View style={{ width: '25%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#374151' }}>
                      {type.label === 'Avg Score %' ? `${type.term2}%` : type.label === 'Grade' ? type.term2 : type.term2}
                    </Text>
                  </View>
                  <View style={{ width: '25%', alignItems: 'center' }}>
                    <Text style={{ fontSize: 10, color: '#374151', fontWeight: 'bold' }}>
                      {type.label === 'Avg Score %' ? `${type.term3}%` : type.label === 'Grade' ? type.term3 : type.term3}
                    </Text>
                  </View>
                </View>
              ));
            })()}
          </View>
          
          {/* Performance Trend Analysis */}
          <View style={{ marginTop: 15, padding: 12, backgroundColor: '#eff6ff', borderRadius: 6, border: '1px solid #bfdbfe' }}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#1e40af', marginBottom: 6 }}>
              Assessment Performance Analysis
            </Text>
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5, marginBottom: 5 }}>
              • The student demonstrates consistent improvement in summative assessments across all terms.
            </Text>
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5, marginBottom: 5 }}>
              • Average scores increased from {(() => {
                const summativeData = safePortfolioData.summativeAssessments || {
                  term1: { averageScore: 75 },
                  term3: { averageScore: 85 }
                };
                return `${summativeData.term1?.averageScore || 75}%`;
              })()} to {(() => {
                const summativeData = safePortfolioData.summativeAssessments || {
                  term3: { averageScore: 85 }
                };
                return `${summativeData.term3?.averageScore || 85}%`;
              })()}, showing a {(() => {
                const summativeData = safePortfolioData.summativeAssessments || {
                  term1: { averageScore: 75 },
                  term3: { averageScore: 85 }
                };
                const improvement = (summativeData.term3?.averageScore || 85) - (summativeData.term1?.averageScore || 75);
                return `${improvement}`;
              })()}% improvement.
            </Text>
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
              • The progressive grade improvement from {(() => {
                const summativeData = safePortfolioData.summativeAssessments || {
                  term1: { grade: 'B+' }
                };
                return summativeData.term1?.grade || 'B+';
              })()} to {(() => {
                const summativeData = safePortfolioData.summativeAssessments || {
                  term3: { grade: 'A' }
                };
                return summativeData.term3?.grade || 'A';
              })()} reflects strong academic growth and achievement.
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 14 of 30</Text>
        </View>
      </Page>

      {/* Page 15: Notice Board */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Notice Board</Text>
        
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 20 }}>
            Important notices and announcements for the school community. This section contains critical information including fee payment deadlines, food requirements, and other essential updates.
          </Text>
          
          {/* Images Section */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            marginTop: 10
          }}>
            <View style={{ width: '48%' }}>
              <Image
                src="/pdf images/top1.jpg"
                style={{
                  width: '100%',
                  height: 100,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
              <Text style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', marginTop: 5, fontStyle: 'italic' }}>
                School Announcements
              </Text>
            </View>
            
            <View style={{ width: '48%' }}>
              <Image
                src="/pdf images/top2.jpg"
                style={{
                  width: '100%',
                  height: 100,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
              <Text style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', marginTop: 5, fontStyle: 'italic' }}>
                Community Updates
              </Text>
            </View>
          </View>
          
          {/* Notices */}
          {(() => {
            const notices = safePortfolioData.notices || [
              {
                title: 'School Fee Payment Deadline',
                message: 'Kindly note that the school fee payment deadline for Term 1 is 15th February 2025. All payments should be made through the school payment portal or directly at the accounts office. Late payments may attract additional charges. For any queries regarding fee payments, please contact the accounts office at accounts@elimurise.edu.ke or call +254 700 000000.',
                date: new Date().toISOString(),
                priority: 'high',
                category: 'Financial'
              },
              {
                title: 'Food Requirements for Students',
                message: 'Students are required to bring the following food items for the school term:\n\n• Breakfast: Students should bring KES 500 worth of breakfast items per week\n• Lunch: School provides lunch at KES 1,200 per term\n• Snacks: Students may bring healthy snacks (fruits, nuts) for break time\n\nPlease ensure all food items are properly labeled with the student\'s name and class. For students with special dietary requirements, please contact the school nurse at least one week before the term begins.',
                date: new Date().toISOString(),
                priority: 'medium',
                category: 'Food & Nutrition'
              }
            ];

            return notices.map((notice: any, index: number) => {
              const priorityColors: any = {
                high: { bg: '#fee2e2', border: '#dc2626', text: '#991b1b', badge: '#dc2626' },
                medium: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', badge: '#f59e0b' },
                low: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', badge: '#3b82f6' }
              };

              const priorityLabels: any = {
                high: 'URGENT',
                medium: 'IMPORTANT',
                low: 'NOTICE'
              };

              const colors = priorityColors[notice.priority || 'medium'] || priorityColors.medium;

              return (
                <View key={index} style={{
                  backgroundColor: colors.bg,
                  padding: 15,
                  borderRadius: 8,
                  marginBottom: 15,
                  border: `2px solid ${colors.border}`
                }}>
                  {/* Notice Header */}
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 12
                  }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: colors.text,
                        marginBottom: 5
                      }}>
                        {notice.title}
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {notice.category && (
                          <View style={{
                            backgroundColor: '#ffffff',
                            padding: 4,
                            borderRadius: 4,
                            marginRight: 8,
                            marginBottom: 4
                          }}>
                            <Text style={{ fontSize: 8, color: '#6b7280', fontWeight: 'bold' }}>
                              {notice.category}
                            </Text>
                          </View>
                        )}
                        {notice.date && (
                          <View style={{
                            backgroundColor: '#ffffff',
                            padding: 4,
                            borderRadius: 4,
                            marginBottom: 4
                          }}>
                            <Text style={{ fontSize: 8, color: '#6b7280' }}>
                              {formatDate(notice.date)}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={{
                      backgroundColor: colors.badge,
                      padding: 6,
                      borderRadius: 4,
                      minWidth: 60
                    }}>
                      <Text style={{
                        fontSize: 9,
                        fontWeight: 'bold',
                        color: '#ffffff',
                        textAlign: 'center'
                      }}>
                        {priorityLabels[notice.priority || 'medium']}
                      </Text>
                    </View>
                  </View>

                  {/* Notice Message */}
                  <View style={{
                    backgroundColor: '#ffffff',
                    padding: 12,
                    borderRadius: 6,
                    border: `1px solid ${colors.border}`
                  }}>
                    <Text style={{
                      fontSize: 11,
                      color: '#374151',
                      lineHeight: 1.6
                    }}>
                      {notice.message}
                    </Text>
                  </View>
                </View>
              );
            });
          })()}
          
          {/* Notice Board Footer */}
          <View style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: '#f0fdf4',
            borderRadius: 6,
            border: '1px solid #bbf7d0'
          }}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#166534', marginBottom: 6 }}>
              Notice Board Information
            </Text>
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5, marginBottom: 4 }}>
              • All notices are published by the school administration and are binding for all students and parents.
            </Text>
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5, marginBottom: 4 }}>
              • For urgent matters, please contact the school office immediately.
            </Text>
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
              • Notices are updated regularly. Please check this section frequently for important updates.
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 15 of 30</Text>
        </View>
      </Page>

      {/* Page 16: Additional Notices (if needed) */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Notice Board (Continued)</Text>
        
        <View style={{ marginTop: 15 }}>
          {/* Additional Notices */}
          {(() => {
            const additionalNotices = safePortfolioData.additionalNotices || [];
            
            // Only show additional notices page if there are notices
            if (additionalNotices.length === 0) {
              return (
                <View style={{
                  padding: 20,
                  backgroundColor: '#f8fafc',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  alignItems: 'center'
                }}>
                  <Text style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>
                    No additional notices at this time.
                  </Text>
                </View>
              );
            }

            return additionalNotices.map((notice: any, index: number) => {
              const priorityColors: any = {
                high: { bg: '#fee2e2', border: '#dc2626', text: '#991b1b', badge: '#dc2626' },
                medium: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', badge: '#f59e0b' },
                low: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', badge: '#3b82f6' }
              };

              const priorityLabels: any = {
                high: 'URGENT',
                medium: 'IMPORTANT',
                low: 'NOTICE'
              };

              const colors = priorityColors[notice.priority || 'medium'] || priorityColors.medium;

              return (
                <View key={index} style={{
                  backgroundColor: colors.bg,
                  padding: 15,
                  borderRadius: 8,
                  marginBottom: 15,
                  border: `2px solid ${colors.border}`
                }}>
                  {/* Notice Header */}
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 12
                  }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: colors.text,
                        marginBottom: 5
                      }}>
                        {notice.title}
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {notice.category && (
                          <View style={{
                            backgroundColor: '#ffffff',
                            padding: 4,
                            borderRadius: 4,
                            marginRight: 8,
                            marginBottom: 4
                          }}>
                            <Text style={{ fontSize: 8, color: '#6b7280', fontWeight: 'bold' }}>
                              {notice.category}
                            </Text>
                          </View>
                        )}
                        {notice.date && (
                          <View style={{
                            backgroundColor: '#ffffff',
                            padding: 4,
                            borderRadius: 4,
                            marginBottom: 4
                          }}>
                            <Text style={{ fontSize: 8, color: '#6b7280' }}>
                              {formatDate(notice.date)}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={{
                      backgroundColor: colors.badge,
                      padding: 6,
                      borderRadius: 4,
                      minWidth: 60
                    }}>
                      <Text style={{
                        fontSize: 9,
                        fontWeight: 'bold',
                        color: '#ffffff',
                        textAlign: 'center'
                      }}>
                        {priorityLabels[notice.priority || 'medium']}
                      </Text>
                    </View>
                  </View>

                  {/* Notice Message */}
                  <View style={{
                    backgroundColor: '#ffffff',
                    padding: 12,
                    borderRadius: 6,
                    border: `1px solid ${colors.border}`
                  }}>
                    <Text style={{
                      fontSize: 11,
                      color: '#374151',
                      lineHeight: 1.6
                    }}>
                      {notice.message}
                    </Text>
                  </View>
                </View>
              );
            });
          })()}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 16 of 30</Text>
        </View>
      </Page>

      {/* Page 17: Fees Structure for Grade 7 */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Fees Structure - Grade 7</Text>
        
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 20 }}>
            This page outlines the complete fee structure for Grade 7 for the upcoming academic year. All fees are payable per term unless otherwise stated.
          </Text>
          
          {/* Images Section */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            marginTop: 10
          }}>
            <View style={{ width: '48%' }}>
              <Image
                src="/pdf images/top2.jpg"
                style={{
                  width: '100%',
                  height: 100,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
              <Text style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', marginTop: 5, fontStyle: 'italic' }}>
                Academic Excellence
              </Text>
            </View>
            
            <View style={{ width: '48%' }}>
              <Image
                src="/pdf images/top3.jpg"
                style={{
                  width: '100%',
                  height: 100,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
              <Text style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', marginTop: 5, fontStyle: 'italic' }}>
                Quality Education
              </Text>
            </View>
          </View>
          
          {/* Fees Structure Table */}
          {(() => {
            const nextGrade = safePortfolioData.promotion?.promotedToGrade || 
                             safePortfolioData.grade?.name || 
                             safePortfolioData.student?.grade || 
                             'Grade 7';
            
            const feesStructure = safePortfolioData.feesStructure || {
              grade: nextGrade,
              academicYear: safePortfolioData.academicYear || new Date().getFullYear().toString(),
              items: [
                { category: 'Tuition Fee', term1: 25000, term2: 25000, term3: 25000, total: 75000, description: 'Core academic instruction and curriculum delivery' },
                { category: 'Development Fee', term1: 5000, term2: 5000, term3: 5000, total: 15000, description: 'School infrastructure and facility maintenance' },
                { category: 'Activity Fee', term1: 3000, term2: 3000, term3: 3000, total: 9000, description: 'Co-curricular activities and sports programs' },
                { category: 'Library Fee', term1: 2000, term2: 2000, term3: 2000, total: 6000, description: 'Library resources and learning materials' },
                { category: 'Laboratory Fee', term1: 4000, term2: 4000, term3: 4000, total: 12000, description: 'Science laboratory equipment and materials' },
                { category: 'Computer Lab Fee', term1: 3000, term2: 3000, term3: 3000, total: 9000, description: 'ICT resources and computer facilities' },
                { category: 'Medical Fee', term1: 2000, term2: 2000, term3: 2000, total: 6000, description: 'Health services and medical care' },
                { category: 'Examination Fee', term1: 1500, term2: 1500, term3: 1500, total: 4500, description: 'Assessment and examination costs' },
                { category: 'Stationery Fee', term1: 2500, term2: 2500, term3: 2500, total: 7500, description: 'Books, notebooks, and learning materials' },
                { category: 'Uniform Fee (One-time)', term1: 8000, term2: 0, term3: 0, total: 8000, description: 'Complete school uniform set (paid once)' },
                { category: 'Sports Equipment', term1: 2000, term2: 2000, term3: 2000, total: 6000, description: 'Sports and physical education equipment' },
                { category: 'Transport Fee (Optional)', term1: 6000, term2: 6000, term3: 6000, total: 18000, description: 'School bus transportation (if applicable)' }
              ],
              paymentMethods: [
                'M-Pesa Paybill: 555555 Account: Student Admission Number',
                'Bank Transfer: Elimurise School Account',
                'Direct Payment at School Accounts Office',
                'Online Payment Portal: www.elimurise.edu.ke/payments'
              ],
              importantNotes: [
                'All fees are payable per term before the term begins',
                'Late payment attracts a 5% penalty fee',
                'Uniform fee is a one-time payment for new students',
                'Transport fee is optional and only for students using school transport',
                'Payment receipts must be kept for all transactions',
                'Fee payment deadline: 15th day of each term'
              ]
            };

            return (
              <>
                {/* Grade and Academic Year Header */}
                <View style={{
                  backgroundColor: '#10b981',
                  padding: 15,
                  borderRadius: 8,
                  marginBottom: 15
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', marginBottom: 5 }}>
                        {feesStructure.grade} - Fees Structure
                      </Text>
                      <Text style={{ fontSize: 11, color: '#f0fdf4' }}>
                        Academic Year: {feesStructure.academicYear}
                      </Text>
                    </View>
                    <View style={{
                      backgroundColor: '#ffffff',
                      padding: 8,
                      borderRadius: 6
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#166534' }}>
                        All amounts in KES
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Fees Breakdown Table */}
                <View style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#166534', marginBottom: 12 }}>
                    Fee Breakdown by Category
                  </Text>
                  
                  <View style={{
                    backgroundColor: '#10b981',
                    padding: 10,
                    borderRadius: 6,
                    marginBottom: 8,
                    flexDirection: 'row'
                  }}>
                    <View style={{ width: '30%' }}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Fee Category</Text>
                    </View>
                    <View style={{ width: '15%', alignItems: 'center' }}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Term 1</Text>
                    </View>
                    <View style={{ width: '15%', alignItems: 'center' }}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Term 2</Text>
                    </View>
                    <View style={{ width: '15%', alignItems: 'center' }}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Term 3</Text>
                    </View>
                    <View style={{ width: '25%', alignItems: 'center' }}>
                      <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#ffffff' }}>Annual Total</Text>
                    </View>
                  </View>

                  {(feesStructure.items || []).map((item: any, index: number) => (
                    <View key={index} style={{
                      flexDirection: 'row',
                      backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff',
                      padding: 10,
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      <View style={{ width: '30%' }}>
                        <Text style={{ fontSize: 10, color: '#374151', fontWeight: 'bold' }}>
                          {item.category}
                        </Text>
                        {item.description && (
                          <Text style={{ fontSize: 8, color: '#6b7280', marginTop: 2, fontStyle: 'italic' }}>
                            {item.description}
                          </Text>
                        )}
                      </View>
                      <View style={{ width: '15%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: '#374151' }}>
                          {item.term1 ? `KES ${item.term1.toLocaleString()}` : '-'}
                        </Text>
                      </View>
                      <View style={{ width: '15%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: '#374151' }}>
                          {item.term2 ? `KES ${item.term2.toLocaleString()}` : '-'}
                        </Text>
                      </View>
                      <View style={{ width: '15%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: '#374151' }}>
                          {item.term3 ? `KES ${item.term3.toLocaleString()}` : '-'}
                        </Text>
                      </View>
                      <View style={{ width: '25%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 10, color: '#166534', fontWeight: 'bold' }}>
                          KES {item.total.toLocaleString()}
                        </Text>
                      </View>
                    </View>
                  ))}

                  {/* Total Row */}
                  <View style={{
                    flexDirection: 'row',
                    backgroundColor: '#10b981',
                    padding: 12,
                    borderRadius: 6,
                    marginTop: 8
                  }}>
                    <View style={{ width: '30%' }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>TOTAL</Text>
                    </View>
                    <View style={{ width: '15%', alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>
                        {(() => {
                          const totalTerm1 = (feesStructure.items || []).reduce((sum: number, item: any) => sum + (item.term1 || 0), 0);
                          return `KES ${totalTerm1.toLocaleString()}`;
                        })()}
                      </Text>
                    </View>
                    <View style={{ width: '15%', alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>
                        {(() => {
                          const totalTerm2 = (feesStructure.items || []).reduce((sum: number, item: any) => sum + (item.term2 || 0), 0);
                          return `KES ${totalTerm2.toLocaleString()}`;
                        })()}
                      </Text>
                    </View>
                    <View style={{ width: '15%', alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>
                        {(() => {
                          const totalTerm3 = (feesStructure.items || []).reduce((sum: number, item: any) => sum + (item.term3 || 0), 0);
                          return `KES ${totalTerm3.toLocaleString()}`;
                        })()}
                      </Text>
                    </View>
                    <View style={{ width: '25%', alignItems: 'center' }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>
                        {(() => {
                          const totalAnnual = (feesStructure.items || []).reduce((sum: number, item: any) => sum + (item.total || 0), 0);
                          return `KES ${totalAnnual.toLocaleString()}`;
                        })()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Payment Methods */}
                <View style={{
                  backgroundColor: '#eff6ff',
                  padding: 15,
                  borderRadius: 8,
                  border: '1px solid #bfdbfe',
                  marginBottom: 15
                }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1e40af', marginBottom: 10 }}>
                    Payment Methods
                  </Text>
                  {(feesStructure.paymentMethods || []).map((method: string, idx: number) => (
                    <View key={idx} style={{ marginBottom: 6 }}>
                      <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
                        {idx + 1}. {method}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Important Notes */}
                <View style={{
                  backgroundColor: '#fef3c7',
                  padding: 15,
                  borderRadius: 8,
                  border: '1px solid #fbbf24'
                }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#92400e', marginBottom: 10 }}>
                    Important Notes
                  </Text>
                  {(feesStructure.importantNotes || []).map((note: string, idx: number) => (
                    <View key={idx} style={{ marginBottom: 6, flexDirection: 'row' }}>
                      <Text style={{ fontSize: 10, color: '#92400e', marginRight: 6 }}>•</Text>
                      <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5, flex: 1 }}>
                        {note}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            );
          })()}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 17 of 30</Text>
        </View>
      </Page>

      {/* Page 18: School Events */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>School Events</Text>
        
        <View style={{ marginTop: 15 }}>
          <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 20 }}>
            This section highlights important school events including Prayer Day, Parents Day, and Student Academic Day. These events provide opportunities for community engagement, spiritual growth, and academic celebration.
          </Text>
          
          {/* Images Section */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            marginTop: 10
          }}>
            <View style={{ width: '48%' }}>
              <Image
                src="/pdf images/top1.jpg"
                style={{
                  width: '100%',
                  height: 100,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
              <Text style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', marginTop: 5, fontStyle: 'italic' }}>
                Community Events
              </Text>
            </View>
            
            <View style={{ width: '48%' }}>
              <Image
                src="/pdf images/top2.jpg"
                style={{
                  width: '100%',
                  height: 100,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
              <Text style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', marginTop: 5, fontStyle: 'italic' }}>
                School Celebrations
              </Text>
            </View>
          </View>
          
          {/* Events */}
          {(() => {
            const events = safePortfolioData.events || [
              {
                title: 'Prayer Day',
                date: '2025-03-15',
                time: '9:00 AM - 12:00 PM',
                location: 'School Chapel / Main Hall',
                description: 'A special day dedicated to prayer, reflection, and spiritual growth. Students, parents, and staff come together to pray for the school community, academic success, and personal well-being. This event includes guided prayers, worship sessions, and fellowship activities.',
                activities: [
                  'Morning prayer session',
                  'Worship and praise',
                  'Testimonies and sharing',
                  'Fellowship and refreshments',
                  'Closing prayer and benediction'
                ],
                dressCode: 'Smart casual or school uniform',
                attendance: 'All students, parents, and staff are welcome',
                contact: 'For more information, contact the school chaplain or school office'
              },
              {
                title: 'Parents Day',
                date: '2025-04-20',
                time: '8:00 AM - 4:00 PM',
                location: 'School Grounds',
                description: 'Parents Day is an important occasion for parents to visit the school, meet with teachers, discuss their children\'s progress, and participate in various school activities. This day provides an opportunity for parents to engage with the school community and understand the school\'s programs and facilities.',
                activities: [
                  'Parent-Teacher meetings',
                  'School tours and facility visits',
                  'Student performance showcases',
                  'Exhibition of student work',
                  'Interactive sessions with school administration',
                  'Lunch and refreshments'
                ],
                dressCode: 'Smart casual',
                attendance: 'All parents and guardians are invited',
                contact: 'Please confirm attendance by contacting the school office at least one week before the event'
              },
              {
                title: 'Student Academic Day',
                date: '2025-05-10',
                time: '8:00 AM - 3:00 PM',
                location: 'School Campus',
                description: 'Student Academic Day celebrates academic excellence and showcases student achievements throughout the year. This event includes presentations, exhibitions, competitions, and recognition ceremonies for outstanding academic performance.',
                activities: [
                  'Academic presentations and projects',
                  'Science fair exhibitions',
                  'Mathematics and quiz competitions',
                  'Essay and creative writing displays',
                  'Awards and recognition ceremony',
                  'Guest speaker presentations',
                  'Student-led workshops'
                ],
                dressCode: 'School uniform',
                attendance: 'All students, parents, and invited guests',
                contact: 'For participation inquiries, contact the academic coordinator'
              }
            ];

            return events.map((event: any, index: number) => {
              const eventColors = [
                { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', accent: '#fbbf24' },
                { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', accent: '#60a5fa' },
                { bg: '#f0fdf4', border: '#10b981', text: '#166534', accent: '#34d399' }
              ];

              const colors = eventColors[index % eventColors.length];

              return (
                <View key={index} style={{
                  backgroundColor: colors.bg,
                  padding: 18,
                  borderRadius: 10,
                  marginBottom: 20,
                  border: `2px solid ${colors.border}`
                }}>
                  {/* Event Header */}
                  <View style={{
                    backgroundColor: colors.border,
                    padding: 12,
                    borderRadius: 6,
                    marginBottom: 15
                  }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#ffffff',
                      marginBottom: 8
                    }}>
                      {event.title}
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                      <View style={{
                        backgroundColor: '#ffffff',
                        padding: 6,
                        borderRadius: 4,
                        marginRight: 8,
                        marginBottom: 4
                      }}>
                        <Text style={{ fontSize: 9, color: colors.text, fontWeight: 'bold' }}>
                          📅 {formatDate(event.date)}
                        </Text>
                      </View>
                      <View style={{
                        backgroundColor: '#ffffff',
                        padding: 6,
                        borderRadius: 4,
                        marginRight: 8,
                        marginBottom: 4
                      }}>
                        <Text style={{ fontSize: 9, color: colors.text, fontWeight: 'bold' }}>
                          ⏰ {event.time}
                        </Text>
                      </View>
                      <View style={{
                        backgroundColor: '#ffffff',
                        padding: 6,
                        borderRadius: 4,
                        marginBottom: 4
                      }}>
                        <Text style={{ fontSize: 9, color: colors.text, fontWeight: 'bold' }}>
                          📍 {event.location}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Event Description */}
                  <View style={{
                    backgroundColor: '#ffffff',
                    padding: 12,
                    borderRadius: 6,
                    marginBottom: 12,
                    border: `1px solid ${colors.border}`
                  }}>
                    <Text style={{
                      fontSize: 11,
                      color: '#374151',
                      lineHeight: 1.6
                    }}>
                      {event.description}
                    </Text>
                  </View>

                  {/* Activities Section */}
                  <View style={{
                    backgroundColor: '#ffffff',
                    padding: 12,
                    borderRadius: 6,
                    marginBottom: 12,
                    border: `1px solid ${colors.border}`
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: colors.text,
                      marginBottom: 8
                    }}>
                      Event Activities:
                    </Text>
                    {(event.activities || []).map((activity: string, actIdx: number) => (
                      <View key={actIdx} style={{ flexDirection: 'row', marginBottom: 4 }}>
                        <Text style={{ fontSize: 10, color: colors.text, marginRight: 6 }}>•</Text>
                        <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5, flex: 1 }}>
                          {activity}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Event Details */}
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginBottom: 8
                  }}>
                    {event.dressCode && (
                      <View style={{
                        backgroundColor: '#ffffff',
                        padding: 8,
                        borderRadius: 4,
                        marginRight: 8,
                        marginBottom: 4,
                        flex: 1,
                        minWidth: '45%'
                      }}>
                        <Text style={{ fontSize: 9, color: '#6b7280', fontWeight: 'bold', marginBottom: 3 }}>
                          Dress Code:
                        </Text>
                        <Text style={{ fontSize: 9, color: '#374151' }}>
                          {event.dressCode}
                        </Text>
                      </View>
                    )}
                    {event.attendance && (
                      <View style={{
                        backgroundColor: '#ffffff',
                        padding: 8,
                        borderRadius: 4,
                        marginBottom: 4,
                        flex: 1,
                        minWidth: '45%'
                      }}>
                        <Text style={{ fontSize: 9, color: '#6b7280', fontWeight: 'bold', marginBottom: 3 }}>
                          Attendance:
                        </Text>
                        <Text style={{ fontSize: 9, color: '#374151' }}>
                          {event.attendance}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Contact Information */}
                  {event.contact && (
                    <View style={{
                      backgroundColor: colors.accent + '20',
                      padding: 10,
                      borderRadius: 6,
                      border: `1px solid ${colors.border}`
                    }}>
                      <Text style={{
                        fontSize: 10,
                        color: colors.text,
                        fontWeight: 'bold',
                        marginBottom: 4
                      }}>
                        ℹ️ Additional Information:
                      </Text>
                      <Text style={{ fontSize: 9, color: '#374151', lineHeight: 1.5 }}>
                        {event.contact}
                      </Text>
                    </View>
                  )}
                </View>
              );
            });
          })()}
          
          {/* Events Calendar Summary */}
          <View style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: '#eff6ff',
            borderRadius: 8,
            border: '1px solid #bfdbfe'
          }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1e40af', marginBottom: 10 }}>
              Events Calendar Summary
            </Text>
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5, marginBottom: 5 }}>
              • All events are scheduled during school terms and are part of the school calendar.
            </Text>
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5, marginBottom: 5 }}>
              • Parents and guardians are encouraged to attend these events to support their children and engage with the school community.
            </Text>
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
              • For event updates or changes, please check the school notice board or contact the school office.
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 18 of 30</Text>
        </View>
      </Page>


      {/* Page 19: Communication & Parent Engagement */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Communication & Parent Engagement</Text>
        
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 }}>
            Parent-School Communication Log
          </Text>
          
          {(safePortfolioData.communicationLogs || []).map((log, index) => (
            <View key={index} style={{
              backgroundColor: '#f8fafc',
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
              border: '1px solid #e2e8f0'
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1f2937' }}>
                    {log.type}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#6b7280' }}>
                    {formatDate(log.date)}
                  </Text>
                </View>
                {log.duration && (
                  <Text style={{ fontSize: 10, color: '#6b7280', fontStyle: 'italic' }}>
                    Duration: {log.duration} min
                  </Text>
                )}
              </View>
              
              <View style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#374151', marginBottom: 4 }}>
                  Purpose: {log.purpose}
                </Text>
              </View>
              
              <View style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 2 }}>
                  Participant: {log.participant}
                </Text>
              </View>
              
              <View style={{
                backgroundColor: '#f0f9ff',
                padding: 8,
                borderRadius: 4,
                marginBottom: 6
              }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#0c4a6e', marginBottom: 4 }}>
                  Summary:
                </Text>
                <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
                  {log.summary}
                </Text>
              </View>
              
              {log.outcome && (
                <View style={{
                  backgroundColor: '#f0fdf4',
                  padding: 8,
                  borderRadius: 4
                }}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#166534', marginBottom: 4 }}>
                    Outcome:
                  </Text>
                  <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
                    {log.outcome}
                  </Text>
                </View>
              )}
            </View>
          ))}
          
          {/* Communication Statistics */}
          <View style={{
            backgroundColor: '#e0f2fe',
            padding: 12,
            borderRadius: 8,
            marginTop: 10,
            border: '2px solid #0ea5e9'
          }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0c4a6e', marginBottom: 8, textAlign: 'center' }}>
              Communication Summary
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Total Communications</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0ea5e9' }}>
                  {(safePortfolioData.communicationLogs || []).length}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Phone Calls</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0ea5e9' }}>
                  {(safePortfolioData.communicationLogs || []).filter(l => l.type === 'Phone Call').length}
                </Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Meetings</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0ea5e9' }}>
                  {(safePortfolioData.communicationLogs || []).filter(l => l.type.includes('Meeting')).length}
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 19 of 30</Text>
        </View>
      </Page>

      {/* Page 20: Cohort & Class Information */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Cohort & Class Information</Text>
        
        <View style={{ marginTop: 20 }}>
          {safePortfolioData.cohortInfo && (
            <>
              {/* Class Header */}
              <View style={{
                backgroundColor: '#10b981',
                padding: 15,
                borderRadius: 8,
                marginBottom: 20
              }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: 5 }}>
                  {safePortfolioData.cohortInfo.cohortName}
                </Text>
                <Text style={{ fontSize: 12, color: '#ffffff', textAlign: 'center' }}>
                  Academic Year: {safePortfolioData.cohortInfo.academicYear}
                </Text>
              </View>
              
              {/* Class Details Grid */}
              <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginBottom: 20
              }}>
                <View style={{
                  width: '48%',
                  backgroundColor: '#f0fdf4',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 12,
                  border: '2px solid #22c55e'
                }}>
                  <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Class Teacher</Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#166534' }}>
                    {safePortfolioData.cohortInfo.classTeacher}
                  </Text>
                </View>
                
                <View style={{
                  width: '48%',
                  backgroundColor: '#f0f9ff',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 12,
                  border: '2px solid #0ea5e9'
                }}>
                  <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Total Students</Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0c4a6e' }}>
                    {safePortfolioData.cohortInfo.totalStudents}
                  </Text>
                </View>
                
                <View style={{
                  width: '48%',
                  backgroundColor: '#fef3c7',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 12,
                  border: '2px solid #f59e0b'
                }}>
                  <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Class Position</Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#92400e' }}>
                    Position {safePortfolioData.cohortInfo.classPosition} of {safePortfolioData.cohortInfo.totalStudents}
                  </Text>
                </View>
                
                <View style={{
                  width: '48%',
                  backgroundColor: '#fdf2f8',
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 12,
                  border: '2px solid #ec4899'
                }}>
                  <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Class Average</Text>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#9f1239' }}>
                    {safePortfolioData.cohortInfo.classAverage}%
                  </Text>
                </View>
              </View>
              
              {/* Date Range */}
              <View style={{
                backgroundColor: '#f8fafc',
                padding: 12,
                borderRadius: 8,
                marginBottom: 15,
                border: '1px solid #cbd5e1'
              }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1f2937', marginBottom: 6 }}>
                  Academic Year Period
                </Text>
                <Text style={{ fontSize: 11, color: '#374151', marginBottom: 2 }}>
                  Start Date: {formatDate(safePortfolioData.cohortInfo.startDate)}
                </Text>
                <Text style={{ fontSize: 11, color: '#374151' }}>
                  End Date: {formatDate(safePortfolioData.cohortInfo.endDate)}
                </Text>
              </View>
              
              {/* Subjects */}
              <View style={{
                backgroundColor: '#f0f9ff',
                padding: 12,
                borderRadius: 8,
                marginBottom: 15,
                border: '2px solid #0ea5e9'
              }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#0c4a6e', marginBottom: 8 }}>
                  Subjects Offered
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {(safePortfolioData.cohortInfo.subjects || []).map((subject, index) => (
                    <View key={index} style={{
                      backgroundColor: '#ffffff',
                      padding: 6,
                      borderRadius: 4,
                      border: '1px solid #0ea5e9'
                    }}>
                      <Text style={{ fontSize: 10, color: '#0c4a6e', fontWeight: 'bold' }}>
                        {subject}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              
              {/* Class Achievements */}
              <View style={{
                backgroundColor: '#fef3c7',
                padding: 12,
                borderRadius: 8,
                border: '2px solid #f59e0b'
              }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#92400e', marginBottom: 8 }}>
                  Notable Class Achievements
                </Text>
                {(safePortfolioData.cohortInfo.achievements || []).map((achievement, index) => (
                  <View key={index} style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: index < (safePortfolioData.cohortInfo.achievements || []).length - 1 ? 6 : 0
                  }}>
                    <Text style={{ fontSize: 11, color: '#92400e', fontWeight: 'bold', marginRight: 6, marginTop: 2 }}>
                      ✓
                    </Text>
                    <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.5, flex: 1 }}>
                      {achievement}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 20 of 30</Text>
        </View>
      </Page>

      {/* Page 21: Additional Records & Statistics */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Additional Records & Statistics</Text>
        
        <View style={{ marginTop: 20 }}>
          {safePortfolioData.additionalRecords && (
            <>
              {/* Attendance Records */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#166534', marginBottom: 12 }}>
                  Attendance Records
                </Text>
                <View style={{
                  backgroundColor: '#f0fdf4',
                  padding: 15,
                  borderRadius: 8,
                  border: '2px solid #22c55e'
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Total Days</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}>
                        {safePortfolioData.additionalRecords.attendance?.totalDays || 0}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Present</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}>
                        {safePortfolioData.additionalRecords.attendance?.present || 0}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Absent</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#dc2626' }}>
                        {safePortfolioData.additionalRecords.attendance?.absent || 0}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Percentage</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}>
                        {safePortfolioData.additionalRecords.attendance?.percentage || 0}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Behavior Records */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#92400e', marginBottom: 12 }}>
                  Behavior Records
                </Text>
                <View style={{
                  backgroundColor: '#fef3c7',
                  padding: 15,
                  borderRadius: 8,
                  border: '2px solid #f59e0b'
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Excellent</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#10b981' }}>
                        {safePortfolioData.additionalRecords.behavior?.excellent || 0}%
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Good</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0ea5e9' }}>
                        {safePortfolioData.additionalRecords.behavior?.good || 0}%
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Needs Improvement</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#f59e0b' }}>
                        {safePortfolioData.additionalRecords.behavior?.needsImprovement || 0}%
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Incidents</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#dc2626' }}>
                        {safePortfolioData.additionalRecords.behavior?.incidents || 0}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Participation Records */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#0c4a6e', marginBottom: 12 }}>
                  Participation & Involvement
                </Text>
                <View style={{
                  backgroundColor: '#e0f2fe',
                  padding: 15,
                  borderRadius: 8,
                  border: '2px solid #0ea5e9'
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>School Events</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0ea5e9' }}>
                        {safePortfolioData.additionalRecords.participation?.schoolEvents || 0}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Competitions</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0ea5e9' }}>
                        {safePortfolioData.additionalRecords.participation?.competitions || 0}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Leadership Roles</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0ea5e9' }}>
                        {safePortfolioData.additionalRecords.participation?.leadershipRoles || 0}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>Community Service</Text>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0ea5e9' }}>
                        {safePortfolioData.additionalRecords.participation?.communityService || 0}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              {/* Final Summary */}
              <View style={{
                backgroundColor: '#f8fafc',
                padding: 15,
                borderRadius: 8,
                border: '2px solid #10b981',
                marginTop: 10
              }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1f2937', marginBottom: 10, textAlign: 'center' }}>
                  Overall Record Summary
                </Text>
                <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.6, textAlign: 'center' }}>
                  The student demonstrates exceptional attendance, exemplary behavior, and active participation 
                  in school activities. These records reflect a commitment to academic excellence and personal 
                  growth throughout the academic year.
                </Text>
              </View>
            </>
          )}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 21 of 30</Text>
        </View>
      </Page>

      {/* Page 22: Certificates */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Certificates & Academic Achievements</Text>
        
        {/* Certificate Table */}
        <View style={{ marginTop: 20 }}>
          {/* Table Header */}
          <View style={{ 
            flexDirection: 'row', 
            backgroundColor: '#10b981', 
            padding: 10,
            borderRadius: 6,
            marginBottom: 10
          }}>
            <View style={{ width: '55%', paddingRight: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>Certificate Details</Text>
            </View>
            <View style={{ width: '45%' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#ffffff' }}>Certificate Image</Text>
            </View>
          </View>
          
          {/* Table Rows */}
          {(safePortfolioData.certificates || []).map((certificate, index) => {
            // Handle both certificate formats (from PDFTestPage and regular format)
            const certName = certificate.certificateName || certificate.title || 'Certificate';
            const certType = certificate.certificateType || certificate.category || 'Academic';
            const issueDate = certificate.issueDate || null;
            const expiryDate = certificate.expiryDate || null;
            const issuedBy = certificate.issuedBy || certificate.feedbackBy || 'School Administration';
            const status = certificate.status || 'Active';
            const description = certificate.description || '';
            const grade = certificate.grade || '';
            const score = certificate.score || '';
            
            // Cycle through images: top1, top2, top3, top4, early-years
            const imageFiles = ['top1.jpg', 'top2.jpg', 'top3.jpg', 'top4.jpg', 'early-years.jpg'];
            const imageFile = imageFiles[index % imageFiles.length];
            
            return (
              <View key={index} style={{ 
                flexDirection: 'row', 
                marginBottom: 15,
                border: '1px solid #e2e8f0',
                borderRadius: 6,
                overflow: 'hidden'
              }}>
                {/* Certificate Details Column */}
                <View style={{ 
                  width: '55%', 
                  padding: 12,
                  backgroundColor: '#f8fafc'
                }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1f2937', marginBottom: 6 }}>
                    {certName}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>
                    Type: {certType}
                  </Text>
                  {issueDate && (
                    <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>
                      Issued: {formatDate(issueDate)}
                    </Text>
                  )}
                  {expiryDate && (
                    <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>
                      Expires: {formatDate(expiryDate)}
                    </Text>
                  )}
                  {issuedBy && (
                    <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>
                      Issued By: {issuedBy}
                    </Text>
                  )}
                  {grade && score && (
                    <Text style={{ fontSize: 10, color: '#6b7280', marginBottom: 4 }}>
                      Grade: {grade} ({score})
                    </Text>
                  )}
                  {description && (
                    <Text style={{ fontSize: 10, color: '#374151', marginTop: 4, fontStyle: 'italic' }}>
                      {description}
                    </Text>
                  )}
                  <Text style={{ fontSize: 9, color: '#10b981', marginTop: 6, fontWeight: 'bold' }}>
                    Status: {status}
                  </Text>
                </View>
                
                {/* Image Column */}
                <View style={{ 
                  width: '45%', 
                  padding: 8,
                  backgroundColor: '#ffffff',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Image
                    src={`/pdf images/${imageFile}`}
                    style={{
                      width: '100%',
                      height: 120,
                      borderRadius: 4,
                      objectFit: 'cover'
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>ELIMURISE SCHOOL</Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>Excellence in Education</Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>www.elimurise.edu.ke</Text>
            </View>
          </View>
          <View style={styles.footerRedLine} />
          <View style={styles.footerGrayLine} />
          <Text style={styles.pageNumber}>Page 22 of 30</Text>
        </View>
      </Page>

      {/* Page 23: Project Evidences */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Project Evidences & Learning Artifacts</Text>
        
        <View style={{ marginTop: 20 }}>
          {(safePortfolioData.projectEvidences || []).map((project, index) => (
            <View key={index} style={{ marginBottom: 30 }}>
              {/* Evidence Title and Description - Matching Page 5 styling */}
              <View style={{ backgroundColor: '#f8fafc', padding: 15, borderRadius: 8, marginBottom: 15 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 }}>
                  {project.title || 'Untitled Evidence'}
                </Text>

                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#374151', marginBottom: 5 }}>
                    Description:
                  </Text>
                {project.description && (
                  <Text style={{ fontSize: 11, color: '#374151', marginBottom: 5 }}>
                    {project.description}
                  </Text>
                )}
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#374151', marginBottom: 5 }}>
                    Caption:
                  </Text>
                {project.caption && (
                
                  <Text style={{ fontSize: 10, color: '#6b7280', fontStyle: 'italic' }}>
                    {project.caption}
                  </Text>
                )}
                <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 5 }}>
                  {project.evidenceType} • {project?.competency?.name || (typeof project.competency === 'string' ? project.competency : 'N/A')} • {formatDate(project.submittedAt)}
                </Text>
              </View>
              
              {/* Display 5 images from Pdf Images folder for each project evidence */}
              <View style={{ 
                flexDirection: 'row', 
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginTop: 10,
                marginBottom: 10
              }}>
                {/* Image 1 - top1.jpg */}
                <View style={{ width: '19%', marginBottom: 8 }}>
                  <Image
                    src="/pdf images/top1.jpg"
                    style={{
                      width: '100%',
                      height: 120,
                      borderRadius: 6,
                    }}
                  />
                </View>
                
                {/* Image 2 - top2.jpg */}
                <View style={{ width: '19%', marginBottom: 8 }}>
                  <Image
                    src="/pdf images/top2.jpg"
                    style={{
                      width: '100%',
                      height: 120,
                      borderRadius: 6,
                    }}
                  />
                </View>
                
                {/* Image 3 - top3.jpg */}
                <View style={{ width: '19%', marginBottom: 8 }}>
                  <Image
                    src="/pdf images/top3.jpg"
                    style={{
                      width: '100%',
                      height: 120,
                      borderRadius: 6,
                    }}
                  />
                </View>
                
                {/* Image 4 - top4.jpg */}
                <View style={{ width: '19%', marginBottom: 8 }}>
                  <Image
                    src="/pdf images/top4.jpg"
                    style={{
                      width: '100%',
                      height: 120,
                      borderRadius: 6,
                    }}
                  />
                </View>
                
                {/* Image 5 - early-years.jpg */}
                <View style={{ width: '19%', marginBottom: 8 }}>
                  <Image
                    src="/pdf images/early-years.jpg"
                    style={{
                      width: '100%',
                      height: 120,
                      borderRadius: 6,
                    }}
                  />
                </View>
              </View>
              
              {/* Reflection if available - Matching Page 5 styling */}
              {project.reflection && (
                <View style={{ 
                  backgroundColor: '#fefce8', 
                  padding: 12, 
                  borderRadius: 6,
                  marginTop: 10
                }}>
                  <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#374151', marginBottom: 5 }}>
                    Reflection:
                  </Text>
                  <Text style={{ fontSize: 10, color: '#374151' }}>
                    {project.reflection}
                  </Text>
                </View>
              )}
          </View>
        ))}
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 23 of 30</Text>
        </View>
      </Page>

      {/* Page 24: Sports & Co-Curricular Activities - Football */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Sports & Co-Curricular Activities</Text>
        
        {/* Football Activity Section */}
        <View style={{ marginTop: 20 }}>
          {/* Activity Title */}
          <View style={{
            backgroundColor: '#10b981',
            padding: 12,
            borderRadius: 6,
            marginBottom: 15
          }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' }}>
              Football Participation & Development
            </Text>
          </View>
          
          {/* Activity Description */}
          <View style={{
            backgroundColor: '#f0fdf4',
            padding: 15,
            borderRadius: 6,
            marginBottom: 15,
            border: '2px solid #22c55e'
          }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#166534', marginBottom: 8 }}>
              About My Football Journey
            </Text>
            <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.6, marginBottom: 10 }}>
              Football has become one of my favorite co-curricular activities at Elimurise School. Through regular training sessions, matches, and team participation, I have developed not only my physical skills but also important life skills such as teamwork, discipline, and perseverance.
            </Text>
            <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.6, marginBottom: 10 }}>
              I participate in the school football team where I play as a midfielder. This position has taught me to be alert, make quick decisions, and support both defense and attack. Our team practices three times a week, focusing on ball control, passing, shooting, and tactical understanding of the game.
            </Text>
            <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.6 }}>
              Beyond the field, football has taught me valuable lessons about sportsmanship, respect for opponents, and the importance of regular exercise for overall health and well-being. I have participated in several inter-school matches and tournaments, which have helped build my confidence and competitive spirit.
            </Text>
          </View>
          
          {/* Skills Developed Section */}
          <View style={{
            backgroundColor: '#f8fafc',
            padding: 12,
            borderRadius: 6,
            marginBottom: 15,
            border: '1px solid #cbd5e1'
          }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
              Skills & Competencies Developed:
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {['Teamwork', 'Leadership', 'Discipline', 'Physical Fitness', 'Strategic Thinking', 'Communication', 'Resilience', 'Time Management'].map((skill, index) => (
                <View key={index} style={{
                  backgroundColor: '#e0f2fe',
                  padding: 6,
                  borderRadius: 4,
                  border: '1px solid #0ea5e9'
                }}>
                  <Text style={{ fontSize: 9, color: '#0c4a6e', fontWeight: 'bold' }}>
                    ✓ {skill}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Football Images Grid */}
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#1f2937', marginBottom: 10, marginTop: 5 }}>
            Football Activities Gallery
          </Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginTop: 10,
            marginBottom: 10
          }}>
            {/* Image 1 - football1.jpeg */}
            <View style={{ width: '19%', marginBottom: 8 }}>
              <Image
                src="/pdf images/football1.jpeg"
                style={{
                  width: '100%',
                  height: 120,
                  borderRadius: 6,
                  objectFit: 'cover'
                }}
              />
          
            </View>
            
            {/* Image 2 - football2.jpg */}
            <View style={{ width: '19%', marginBottom: 8 }}>
              <Image
                src="/pdf images/football2.jpg"
                style={{
                  width: '100%',
                  height: 120,
                  borderRadius: 6,
                  objectFit: 'cover'
                }}
              />
      
            </View>
            
            {/* Image 3 - football3.jpeg */}
            <View style={{ width: '19%', marginBottom: 8 }}>
              <Image
                src="/pdf images/football3.jpeg"
                style={{
                  width: '100%',
                  height: 120,
                  borderRadius: 6,
                  objectFit: 'cover'
                }}
              />
        
            </View>
            
            {/* Image 4 - football4.jpg */}
            <View style={{ width: '19%', marginBottom: 8 }}>
              <Image
                src="/pdf images/football3.jpeg"
                style={{
                  width: '100%',
                  height: 120,
                  borderRadius: 6,
                  objectFit: 'cover'
                }}
              />
 
            </View>
            
            {/* Image 5 - football5.jpg */}
            <View style={{ width: '19%', marginBottom: 8 }}>
              <Image
                src="/pdf images/football3.jpeg"
                style={{
                  width: '100%',
                  height: 120,
                  borderRadius: 6,
                  objectFit: 'cover'
                }}
              />
       
            </View>

            <View style={{ width: '19%', marginBottom: 8 }}>
              <Image
                src="/pdf images/football3.jpeg"
                style={{
                  width: '100%',
                  height: 120,
                  borderRadius: 6,
                  objectFit: 'cover'
                }}
              />
       
            </View>

            <View style={{ width: '19%', marginBottom: 8 }}>
              <Image
                src="/pdf images/football1.jpeg"
                style={{
                  width: '100%',
                  height: 120,
                  borderRadius: 6,
                  objectFit: 'cover'
                }}
              />
       
            </View>
          </View>
          
          {/* Reflection Section */}
          <View style={{
            backgroundColor: '#fef3c7',
            padding: 12,
            borderRadius: 6,
            marginTop: 15,
            border: '2px solid #f59e0b'
          }}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#92400e', marginBottom: 6 }}>
              My Reflection:
            </Text>
            <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
              Playing football has been incredibly rewarding. It has improved my physical fitness, taught me the value of teamwork, and given me confidence. I enjoy the strategy involved in the game and the friendships I've built with my teammates. Football has become more than just a sport—it's a passion that helps me stay active and healthy while having fun.
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>ELIMURISE SCHOOL</Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>Excellence in Education</Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>www.elimurise.edu.ke</Text>
            </View>
          </View>
          <View style={styles.footerRedLine} />
          <View style={styles.footerGrayLine} />
          <Text style={styles.pageNumber}>Page 24 of 30</Text>
        </View>
      </Page>

      {/* Page 25: Project Images Gallery */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Project Images Gallery</Text>
        
        {/* Project Images Section */}
        <View style={{ marginTop: 20 }}>
          {/* Row 1 - First 4 images */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15
          }}>
            {/* Image 1 - projects1.jpeg */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/projects1.jpeg"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
          </View>
            
            {/* Image 2 - projects2.jpeg */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/projects2.jpeg"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </View>
          </View>
          
          {/* Row 2 - Next 2 images */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15
          }}>
            {/* Image 3 - projects3.jpeg */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/projects3.jpeg"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </View>
            
            {/* Image 4 - projects4.jpeg */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/projects4.jpeg"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </View>
          </View>

                   {/* Row 2 - Next 2 images */}
                   <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15
          }}>
            {/* Image 3 - projects3.jpeg */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/projects3.jpeg"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </View>
            
            {/* Image 4 - projects4.jpeg */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/projects4.jpeg"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </View>
          </View>

                   {/* Row 2 - Next 2 images */}
                   <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15
          }}>
            {/* Image 3 - projects3.jpeg */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/projects3.jpeg"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </View>
            
            {/* Image 4 - projects4.jpeg */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/projects4.jpeg"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </View>
          </View>


                   {/* Row 2 - Next 2 images */}
                   <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15
          }}>
            {/* Image 3 - projects3.jpeg */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/projects3.jpeg"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </View>
            
            {/* Image 4 - projects4.jpeg */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/projects4.jpeg"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </View>
          </View>
          
          {/* Row 3 - Next 2 images */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15
          }}>
            {/* Image 5 - projects5.jpeg */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/projects5.jpeg"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </View>
            
            {/* Image 6 - project6.jpeg */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/project6.jpeg"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </View>
          </View>
          
          {/* Row 4 - Last 2 images */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 15
          }}>
            {/* Image 7 - project7.jpeg */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/project7.jpeg"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </View>
            
            {/* Image 8 - project8.png */}
            <View style={{ width: '48%', marginBottom: 10 }}>
              <Image
                src="/pdf images/projects/project8.png"
                style={{
                  width: '100%',
                  height: 160,
                  borderRadius: 8,
                  objectFit: 'cover'
                }}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>ELIMURISE SCHOOL</Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>Excellence in Education</Text>
            </View>
            <View style={styles.footerItem}>
              <View style={styles.footerIcon} />
              <Text style={styles.footerText}>www.elimurise.edu.ke</Text>
            </View>
          </View>
          <View style={styles.footerRedLine} />
          <View style={styles.footerGrayLine} />
          <Text style={styles.pageNumber}>Page 25 of 30</Text>
        </View>
      </Page>

      {/* Page 26: CBC Image Integration */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Competency-Based Curriculum Integration</Text>
        
        <Image 
          style={styles.cbcImage} 
          src="/cbc1.jpeg" 
        />
        
        <View style={styles.narrativeSummary}>
          <Text style={styles.narrativeTitle}>CBC Implementation Summary</Text>
          <Text style={styles.narrativeContent}>
            This portfolio demonstrates comprehensive integration of the Competency-Based Curriculum (CBC) framework. 
            The student has successfully developed core competencies including communication, critical thinking, 
            creativity, digital literacy, and social responsibility through authentic learning experiences and 
            project-based assessments.
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 26 of 30</Text>
        </View>
      </Page>

      {/* Page 27: Additional Strengths & Improvements */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Extended Strengths & Growth Areas</Text>
        
        {/* Images Section */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
          marginTop: 10
        }}>
          <View style={{ width: '48%' }}>
            <Image
              src="/pdf images/top1.jpg"
              style={{
                width: '100%',
                height: 140,
                borderRadius: 8,
                objectFit: 'cover'
              }}
            />
            <Text style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', marginTop: 5, fontStyle: 'italic' }}>
              Academic Excellence
            </Text>
          </View>
          
          <View style={{ width: '48%' }}>
            <Image
              src="/pdf images/top2.jpg"
              style={{
                width: '100%',
                height: 140,
                borderRadius: 8,
                objectFit: 'cover'
              }}
            />
            <Text style={{ fontSize: 9, color: '#6b7280', textAlign: 'center', marginTop: 5, fontStyle: 'italic' }}>
              Personal Growth
            </Text>
          </View>
        </View>
        
        {/* Strengths Section */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#166534', marginBottom: 12 }}>
            Additional Strengths
          </Text>
          <View style={{
            backgroundColor: '#f0fdf4',
            padding: 12,
            borderRadius: 8,
            border: '2px solid #22c55e'
          }}>
          {(safePortfolioData.strengths || []).slice(5).map((strength, index) => (
              <View key={index} style={{
                marginBottom: index < (safePortfolioData.strengths || []).slice(5).length - 1 ? 8 : 0,
                flexDirection: 'row',
                alignItems: 'flex-start'
              }}>
                <Text style={{ fontSize: 11, color: '#166534', fontWeight: 'bold', marginRight: 6, marginTop: 2 }}>
                  ✓
                </Text>
                <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.5, flex: 1 }}>
                  {strength}
                </Text>
            </View>
          ))}
          </View>
        </View>
        
        {/* Growth Areas Section */}
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#92400e', marginBottom: 12 }}>
            Additional Growth Areas
          </Text>
          <View style={{
            backgroundColor: '#fef3c7',
            padding: 12,
            borderRadius: 8,
            border: '2px solid #f59e0b'
          }}>
            {(safePortfolioData.improvements || []).slice(4).map((improvement, index) => (
              <View key={index} style={{
                marginBottom: index < (safePortfolioData.improvements || []).slice(4).length - 1 ? 8 : 0,
                flexDirection: 'row',
                alignItems: 'flex-start'
              }}>
                <Text style={{ fontSize: 11, color: '#92400e', fontWeight: 'bold', marginRight: 6, marginTop: 2 }}>
                  →
                </Text>
                <Text style={{ fontSize: 11, color: '#374151', lineHeight: 1.5, flex: 1 }}>
                  {improvement}
                </Text>
            </View>
          ))}
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 27 of 30</Text>
        </View>
      </Page>

      {/* Page 28: Teacher Narrative Summary */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Teacher Narrative Summary</Text>
        
        <View style={styles.narrativeSummary}>
          <Text style={styles.narrativeTitle}>Overall Assessment</Text>
          <Text style={styles.narrativeContent}>
            Samwel Mwendwa has demonstrated exceptional growth and achievement throughout the academic year. 
            His leadership qualities, combined with strong academic performance and commitment to community service, 
            make him an outstanding student. He consistently shows initiative in group projects and demonstrates 
            excellent problem-solving skills across all subject areas.
          </Text>
        </View>
        
        <View style={styles.narrativeSummary}>
          <Text style={styles.narrativeTitle}>Academic Excellence</Text>
          <Text style={styles.narrativeContent}>
            In mathematics and science, Samwel shows exceptional analytical thinking and systematic approach to 
            problem-solving. His ability to mentor junior students demonstrates deep understanding of concepts 
            and excellent communication skills. His science projects, particularly the solar energy initiative, 
            showcase practical application of theoretical knowledge.
          </Text>
        </View>
        
        <View style={styles.narrativeSummary}>
          <Text style={styles.narrativeTitle}>Leadership & Character</Text>
          <Text style={styles.narrativeContent}>
            As Student Council President, Samwel has shown remarkable leadership skills and commitment to 
            environmental conservation. His community garden initiative and environmental campaigns have 
            positively impacted the entire school community. He embodies the values of social responsibility 
            and environmental stewardship.
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 28 of 30</Text>
        </View>
      </Page>

      {/* Page 29: Future Goals & Recommendations */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Future Goals & Recommendations</Text>
        
        <View style={styles.narrativeSummary}>
          <Text style={styles.narrativeTitle}>Academic Recommendations</Text>
          <Text style={styles.narrativeContent}>
            • Continue pursuing advanced studies in STEM fields, particularly focusing on renewable energy and environmental science
            • Develop deeper expertise in programming and digital technology applications
            • Expand research skills through independent study projects
            • Consider participating in national science competitions and innovation challenges
          </Text>
        </View>
        
        <View style={styles.narrativeSummary}>
          <Text style={styles.narrativeTitle}>Leadership Development</Text>
          <Text style={styles.narrativeContent}>
            • Continue developing public speaking and presentation skills
            • Expand community service initiatives beyond the school environment
            • Mentor more students in mathematics and science subjects
            • Consider leadership roles in regional environmental conservation programs
          </Text>
        </View>
        
        <View style={styles.narrativeSummary}>
          <Text style={styles.narrativeTitle}>Personal Growth</Text>
          <Text style={styles.narrativeContent}>
            • Enhance time management skills for complex, long-term projects
            • Develop more systematic approaches to research and documentation
            • Build resilience and stress management strategies for challenging academic work
            • Continue exploring diverse learning approaches and cultural perspectives
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 29 of 30</Text>
        </View>
      </Page>

      {/* Page 30: Conclusion & Contact */}
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Portfolio Summary Conclusion</Text>
        
        <View style={styles.narrativeSummary}>
          <Text style={styles.narrativeTitle}>Comprehensive Achievement Summary</Text>
          <Text style={styles.narrativeContent}>
            This portfolio represents authentic evidence of Samwel Mwendwa's holistic growth and achievement 
            throughout the academic year. The comprehensive documentation showcases development across all 
            competency areas, demonstrating excellence in academic performance, leadership, community service, 
            and personal character development.
          </Text>
        </View>
        
        <View style={styles.narrativeSummary}>
          <Text style={styles.narrativeTitle}>Key Achievements</Text>
          <Text style={styles.narrativeContent}>
            • {(safePortfolioData.awards || []).length} Awards & Recognition certificates
            • {(safePortfolioData.certificates || []).length} Academic achievement certificates  
            • {(safePortfolioData.projectEvidences || []).length} Project evidences demonstrating competency development
            • {(safePortfolioData.competenciesAchieved || []).length} Core competencies with average rating of 4.4/5
            • Leadership role as Student Council President
            • Environmental conservation initiatives impacting the school community
          </Text>
        </View>
        
        <View style={styles.narrativeSummary}>
          <Text style={styles.narrativeTitle}>Contact Information</Text>
          <Text style={styles.narrativeContent}>
            ELIMURISE SCHOOL
            Excellence in Education
            Email: info@elimurise.edu.ke
            Website: www.elimurise.edu.ke
            Phone: +254 700 000000
            
            This portfolio is generated for KICD compliance and school records.
            Generated on: {formatDate(safeToISOString(safePortfolioData.generatedAt))}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.pageNumber}>Page 30 of 30</Text>
        </View>
      </Page>
      <Page size="A4" style={styles.contentPage}>
        
        <Text style={styles.sectionHeader}>Academic Growth Timeline</Text>
        
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 }}>Long-term Growth Perspective</Text>
          
          <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.6, marginBottom: 20 }}>
            This timeline showcases the student's academic journey and growth over multiple years, 
            demonstrating the cumulative effect of our competency-based education approach.
          </Text>
          
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 }}>Grade 6: Foundation Building</Text>
            <Text style={{ fontSize: 11, color: '#6b7280', marginBottom: 5 }}>2021-2023</Text>
            <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.5, marginBottom: 10 }}>
              • Established strong literacy and numeracy foundations
            </Text>
            <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.5, marginBottom: 10 }}>
              • Developed critical thinking and problem-solving skills
            </Text>
            <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.5, marginBottom: 10 }}>
              • Built confidence in collaborative learning environments
            </Text>
            <Text style={{ fontSize: 12, color: '#374151', lineHeight: 1.5, marginBottom: 10 }}>
              • Showed consistent improvement in all subject areas
            </Text>
          </View>
          
          </View>
          
      </Page>

    </Document>
  );
  } catch (error) {
    console.error('PDF Component Error:', error);
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={{ fontSize: 16, color: 'red', marginBottom: 20 }}>Error Generating PDF</Text>
          <Text style={{ fontSize: 12, color: '#666' }}>Error: {error?.message || 'Unknown error occurred'}</Text>
          <Text style={{ fontSize: 10, color: '#999', marginTop: 20 }}>
            Please check the console for more details and ensure all required data is available.
          </Text>
        </Page>
      </Document>
    );
  }
};

export default PortfolioPDFDocumentComprehensive;
