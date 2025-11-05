import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
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
    fontSize: 8,
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
  // Simplified Scientific Illustration Styles
  scientificIcon: {
    position: 'absolute',
    width: 25,
    height: 25,
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    border: '1px solid #d1d5db',
  },
  
  cbcImage: {
    width: '100%',
    height: 300,
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center',
  },
  // Additional styles for comprehensive portfolio
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
  reflectionCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'center',
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: 10,
    borderRadius: 6,
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
  // New Booklet Design Styles
  bookletCover: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    border: '1px solid #000000',
  },
  coverHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  schoolLogo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 8,
    textAlign: 'center',
  },
  schoolTagline: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    // color: '#1f2937',
    color: '#10b981',
    // backgroundColor: '#10b981',

    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 1.2,
  },
  coverSubtitle: {
    fontSize: 18,
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  studentPhoto: {
    width: 120,
    height: 120,
    backgroundColor: '#e5e7eb',
    borderRadius: 60,
    marginBottom: 20,
    alignSelf: 'center',
    borderWidth: 4,
    borderColor: '#10b981',
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
  academicInfo: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  academicYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 8,
  },
  academicTerm: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  coverFooter: {
    alignItems: 'center',
    marginTop: 40,
  },
  coverDate: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  profilePage: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
    minHeight: '100vh',
  },
  profileHeader: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  profileSubtitle: {
    fontSize: 14,
    color: '#f0fdf4',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  competencyDashboard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  competencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  competencyItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  competencyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  competencyProgress: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  competencyBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  competencyRating: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'right',
  },
  achievementsShowcase: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  showcaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  achievementCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 10,
    color: '#6b7280',
  },
  projectHighlights: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  projectCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 10,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  growthTimeline: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  timelineYear: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
    width: 60,
    marginRight: 15,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  timelineDescription: {
    fontSize: 10,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  feedbackHighlights: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  feedbackCard: {
    backgroundColor: '#fef7ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  feedbackQuote: {
    fontSize: 12,
    color: '#581c87',
    fontStyle: 'italic',
    lineHeight: 1.4,
    marginBottom: 6,
  },
  feedbackTeacher: {
    fontSize: 10,
    color: '#6b21a8',
    fontWeight: 'bold',
  },
  strengthsImprovements: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  strengthsSection: {
    marginBottom: 15,
  },
  improvementsSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  strengthIcon: {
    width: 12,
    height: 12,
    backgroundColor: '#10b981',
    borderRadius: 6,
    marginRight: 8,
    marginTop: 2,
  },
  improvementIcon: {
    width: 12,
    height: 12,
    backgroundColor: '#f59e0b',
    borderRadius: 6,
    marginRight: 8,
    marginTop: 2,
  },
  strengthText: {
    fontSize: 10,
    color: '#166534',
    lineHeight: 1.4,
    flex: 1,
  },
  improvementText: {
    fontSize: 10,
    color: '#92400e',
    lineHeight: 1.4,
    flex: 1,
  },
});

// Helper function to format dates
const formatDate = (date: string | Date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Helper function to get student full name
const getStudentFullName = (student: any) => {
  if (student.fullName) return student.fullName;
  const parts = [student.first_name, student.last_name, student.surname].filter(Boolean);
  return parts.join(' ') || 'Student Name';
};

// Comprehensive sample data for 23-page portfolio
const sampleData = {
  student: {
    fullName: 'John Michael Smith',
    first_name: 'John',
    last_name: 'Michael',
    surname: 'Smith',
    adm_no: 'ADM001',
    grade: 'Grade 8',
    stream: 'Blue',
  },
  academicYear: '2024',
  term: 'Term 1',
  generatedAt: new Date(),
  competenciesAchieved: [
    { competency: { name: 'Communication', code: 'COM001' }, rating: 4.5, count: 15 },
    { competency: { name: 'Critical Thinking', code: 'CT001' }, rating: 4.2, count: 12 },
    { competency: { name: 'Creativity', code: 'CRE001' }, rating: 4.8, count: 18 },
    { competency: { name: 'Collaboration', code: 'COL001' }, rating: 4.0, count: 10 },
    { competency: { name: 'Digital Literacy', code: 'DL001' }, rating: 4.6, count: 16 },
    { competency: { name: 'Problem Solving', code: 'PS001' }, rating: 4.3, count: 14 },
    { competency: { name: 'Leadership', code: 'LEAD001' }, rating: 4.7, count: 13 },
    { competency: { name: 'Research Skills', code: 'RS001' }, rating: 4.4, count: 11 },
  ],
  awards: [
    { title: 'Student of the Month', issueDate: '2024-01-15', category: 'Academic Excellence' },
    { title: 'Science Fair Winner', issueDate: '2024-02-20', category: 'Science' },
    { title: 'Math Olympiad Bronze', issueDate: '2024-03-10', category: 'Mathematics' },
    { title: 'Creative Writing Award', issueDate: '2024-04-05', category: 'English' },
    { title: 'Sports Excellence', issueDate: '2024-05-12', category: 'Sports' },
    { title: 'Leadership Award', issueDate: '2024-06-18', category: 'Leadership' },
    { title: 'Community Service', issueDate: '2024-07-22', category: 'Service' },
    { title: 'Art Competition Winner', issueDate: '2024-08-30', category: 'Arts' },
    { title: 'Debate Champion', issueDate: '2024-09-15', category: 'Debate' },
    { title: 'Environmental Steward', issueDate: '2024-10-08', category: 'Environment' },
    { title: 'Technology Innovation', issueDate: '2024-11-12', category: 'Technology' },
    { title: 'Peer Mentor Award', issueDate: '2024-12-05', category: 'Mentoring' },
    { title: 'Academic Excellence', issueDate: '2024-01-30', category: 'Overall' },
    { title: 'Perfect Attendance', issueDate: '2024-02-28', category: 'Attendance' },
    { title: 'Library Ambassador', issueDate: '2024-03-25', category: 'Library' },
  ],
  certificates: [
    { title: 'Mathematics Excellence', issueDate: '2024-01-20', grade: 'A+', score: '95%' },
    { title: 'Science Achievement', issueDate: '2024-02-25', grade: 'A', score: '88%' },
    { title: 'English Proficiency', issueDate: '2024-03-15', grade: 'A+', score: '92%' },
    { title: 'History Knowledge', issueDate: '2024-04-10', grade: 'A', score: '85%' },
    { title: 'Geography Mastery', issueDate: '2024-05-18', grade: 'A+', score: '90%' },
    { title: 'Computer Skills', issueDate: '2024-06-22', grade: 'A', score: '87%' },
    { title: 'Art Appreciation', issueDate: '2024-07-30', grade: 'A+', score: '94%' },
    { title: 'Music Theory', issueDate: '2024-08-12', grade: 'A', score: '89%' },
    { title: 'Physical Education', issueDate: '2024-09-20', grade: 'A+', score: '91%' },
    { title: 'Language Arts', issueDate: '2024-10-15', grade: 'A', score: '86%' },
    { title: 'Social Studies', issueDate: '2024-11-08', grade: 'A+', score: '93%' },
    { title: 'Technology Integration', issueDate: '2024-12-12', grade: 'A', score: '88%' },
  ],
  projectEvidences: [
    { title: 'Solar System Model', description: 'Created a detailed model of the solar system', evidenceType: 'Project', submittedAt: '2024-01-15' },
    { title: 'Historical Timeline', description: 'Developed a comprehensive timeline of world history', evidenceType: 'Presentation', submittedAt: '2024-02-20' },
    { title: 'Math Problem Solving', description: 'Solved complex mathematical problems', evidenceType: 'Assignment', submittedAt: '2024-03-10' },
    { title: 'Creative Writing', description: 'Wrote original short stories and poems', evidenceType: 'Portfolio', submittedAt: '2024-04-05' },
    { title: 'Science Experiment', description: 'Conducted chemistry experiments', evidenceType: 'Lab Report', submittedAt: '2024-05-12' },
    { title: 'Art Portfolio', description: 'Created various art pieces', evidenceType: 'Portfolio', submittedAt: '2024-06-18' },
    { title: 'Geography Project', description: 'Mapped different countries and cultures', evidenceType: 'Project', submittedAt: '2024-07-22' },
    { title: 'Music Composition', description: 'Composed original music pieces', evidenceType: 'Audio', submittedAt: '2024-08-30' },
    { title: 'Technology Project', description: 'Built a simple computer program', evidenceType: 'Code', submittedAt: '2024-09-15' },
    { title: 'Environmental Study', description: 'Researched local environmental issues', evidenceType: 'Research', submittedAt: '2024-10-08' },
    { title: 'Language Learning', description: 'Demonstrated proficiency in multiple languages', evidenceType: 'Assessment', submittedAt: '2024-11-12' },
    { title: 'Community Service', description: 'Organized community service activities', evidenceType: 'Service', submittedAt: '2024-12-05' },
    { title: 'Physics Lab Report', description: 'Conducted physics experiments and documented results', evidenceType: 'Lab Report', submittedAt: '2024-01-25' },
    { title: 'Literature Analysis', description: 'Analyzed classic literature works', evidenceType: 'Essay', submittedAt: '2024-02-28' },
    { title: 'Economics Simulation', description: 'Participated in economic simulation games', evidenceType: 'Simulation', submittedAt: '2024-03-20' },
  ],
  reflections: [
    { reflection: 'I learned that persistence is key to solving complex problems', evidenceTitle: 'Math Problem Solving', submittedAt: '2024-03-10' },
    { reflection: 'Working in teams helped me understand different perspectives', evidenceTitle: 'Science Experiment', submittedAt: '2024-05-12' },
    { reflection: 'Creativity comes from exploring new ideas and taking risks', evidenceTitle: 'Art Portfolio', submittedAt: '2024-06-18' },
    { reflection: 'Research skills are essential for understanding complex topics', evidenceTitle: 'Environmental Study', submittedAt: '2024-10-08' },
    { reflection: 'Technology can be a powerful tool for learning and expression', evidenceTitle: 'Technology Project', submittedAt: '2024-09-15' },
    { reflection: 'Music composition taught me about structure and creativity', evidenceTitle: 'Music Composition', submittedAt: '2024-08-30' },
    { reflection: 'Community service showed me the importance of giving back', evidenceTitle: 'Community Service', submittedAt: '2024-12-05' },
    { reflection: 'Language learning opened my mind to different cultures', evidenceTitle: 'Language Learning', submittedAt: '2024-11-12' },
  ],
  teacherFeedbacks: [
    { comment: 'Excellent work! Shows great understanding of the concepts', rating: 5, evidenceTitle: 'Solar System Model', feedbackBy: 'Ms. Johnson', date: '2024-01-15' },
    { comment: 'Outstanding creativity and attention to detail', rating: 5, evidenceTitle: 'Art Portfolio', feedbackBy: 'Mr. Davis', date: '2024-06-18' },
    { comment: 'Great problem-solving approach and clear explanations', rating: 4, evidenceTitle: 'Math Problem Solving', feedbackBy: 'Mrs. Wilson', date: '2024-03-10' },
    { comment: 'Very thorough research and well-presented findings', rating: 4, evidenceTitle: 'Environmental Study', feedbackBy: 'Dr. Brown', date: '2024-10-08' },
    { comment: 'Impressive technical skills and innovative thinking', rating: 5, evidenceTitle: 'Technology Project', feedbackBy: 'Mr. Taylor', date: '2024-09-15' },
    { comment: 'Excellent collaboration skills and leadership qualities', rating: 4, evidenceTitle: 'Community Service', feedbackBy: 'Ms. Anderson', date: '2024-12-05' },
    { comment: 'Outstanding musical talent and composition skills', rating: 5, evidenceTitle: 'Music Composition', feedbackBy: 'Mr. Garcia', date: '2024-08-30' },
    { comment: 'Great historical analysis and critical thinking', rating: 4, evidenceTitle: 'Historical Timeline', feedbackBy: 'Mrs. Martinez', date: '2024-02-20' },
    { comment: 'Excellent writing skills and creative expression', rating: 5, evidenceTitle: 'Creative Writing', feedbackBy: 'Ms. Thompson', date: '2024-04-05' },
    { comment: 'Very good geographical knowledge and presentation skills', rating: 4, evidenceTitle: 'Geography Project', feedbackBy: 'Mr. Lee', date: '2024-07-22' },
    { comment: 'Outstanding language skills and cultural awareness', rating: 5, evidenceTitle: 'Language Learning', feedbackBy: 'Ms. Rodriguez', date: '2024-11-12' },
    { comment: 'Excellent scientific methodology and analysis', rating: 4, evidenceTitle: 'Science Experiment', feedbackBy: 'Dr. White', date: '2024-05-12' },
    { comment: 'Great physics understanding and experimental design', rating: 5, evidenceTitle: 'Physics Lab Report', feedbackBy: 'Dr. Chen', date: '2024-01-25' },
    { comment: 'Outstanding literary analysis and critical thinking', rating: 4, evidenceTitle: 'Literature Analysis', feedbackBy: 'Ms. Williams', date: '2024-02-28' },
    { comment: 'Excellent economic reasoning and strategic thinking', rating: 5, evidenceTitle: 'Economics Simulation', feedbackBy: 'Mr. Johnson', date: '2024-03-20' },
  ],
  strengths: [
    'Demonstrates exceptional creativity and innovation',
    'Shows strong leadership and collaboration skills',
    'Excellent problem-solving and critical thinking abilities',
    'Outstanding communication and presentation skills',
    'Strong work ethic and persistence',
    'Great attention to detail and quality',
    'Excellent time management and organization',
    'Strong analytical and research skills',
    'Outstanding artistic and musical talents',
    'Excellent technological proficiency',
    'Great adaptability and flexibility',
    'Strong empathy and social awareness',
  ],
  improvements: [
    'Could improve time management for complex projects',
    'Needs to work on asking for help when needed',
    'Should practice more structured problem-solving approaches',
    'Could benefit from more peer collaboration opportunities',
    'Needs to develop more confidence in public speaking',
    'Should work on balancing perfectionism with efficiency',
    'Could improve note-taking and study strategies',
    'Needs to practice more independent research skills',
    'Should work on managing stress during challenging tasks',
    'Could benefit from more diverse learning approaches',
    'Needs to develop more patience with slower learners',
    'Should work on accepting constructive criticism better',
  ],
  growthTimeline: [
    { year: 'Grade 4', title: 'Foundation Year', description: 'Established strong reading and basic math skills' },
    { year: 'Grade 5', title: 'Skill Development', description: 'Developed critical thinking and problem-solving abilities' },
    { year: 'Grade 6', title: 'Academic Growth', description: 'Excelled in science and mathematics subjects' },
    { year: 'Grade 7', title: 'Leadership Emergence', description: 'Began taking leadership roles in group projects' },
    { year: 'Grade 8', title: 'Current Year', description: 'Demonstrating excellence across all subject areas' },
    { year: 'Grade 9', title: 'Future Goals', description: 'Planning to pursue advanced studies in STEM fields' },
  ],
};

// Portfolio PDF Document Component
const PortfolioPDFDocument = ({ data }: { data?: any }) => {
  // Use sample data instead of props data, or fallback to sample data
  const portfolioData = data || sampleData;
  
  // Ensure we have valid data
  if (!portfolioData) {
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
      {/* Page 1: Chemistry Project Style Cover */}
      <Page size="A4" style={styles.bookletCover}>
        {/* Header with green and gray lines */}
        {/* <View style={styles.letterheadHeader}>
          <View style={styles.redLine} />
          <View style={styles.grayLine} />
        </View> */}
        
        {/* Simplified Scientific Icons around the perimeter */}
        <View style={[styles.scientificIcon, { top: 60, left: 60, backgroundColor: '#86efac' }]} />
        <View style={[styles.scientificIcon, { top: 60, right: 60, backgroundColor: '#93c5fd' }]} />
        <View style={[styles.scientificIcon, { top: 100, right: 100, backgroundColor: '#fecaca' }]} />
        <View style={[styles.scientificIcon, { top: '50%', left: 50, backgroundColor: '#f9a8d4' }]} />
        <View style={[styles.scientificIcon, { top: '45%', right: 50, backgroundColor: '#d97706' }]} />
        <View style={[styles.scientificIcon, { bottom: 80, left: 60, backgroundColor: '#fb923c' }]} />
        <View style={[styles.scientificIcon, { bottom: 100, left: '50%', backgroundColor: '#3b82f6' }]} />
        <View style={[styles.scientificIcon, { bottom: 80, right: 60, backgroundColor: '#fbbf24' }]} />
        <View style={[styles.scientificIcon, { bottom: 60, right: 100, backgroundColor: '#fb923c' }]} />
        
        {/* Main Title - Centered */}
        <View style={styles.coverTitle}>
          <Text>ELIMURISE SCHOOL</Text>
          {/* <Text>SUMMARY</Text> */}
        </View>
        
        {/* Submission Details */}
        <View style={styles.studentDetails}>
          {/* <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Submitted By:</Text> */}
          {/* <Text style={styles.studentName}>{getStudentFullName(portfolioData.student)}</Text> */}
          <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8, textAlign: 'center', fontWeight: 'bold' }}>Samwel Mwendwa</Text>
          {/* <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>Class: {portfolioData.student?.grade || 'N/A'}</Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>Roll No: {portfolioData.student?.adm_no || 'N/A'}</Text> */}
        </View>
        
        {/* CBC Image */}
        {/* <Image 
          style={styles.cbcImage} 
          src="/cbc1.jpeg" 
        /> */}
        {/* styles.studentName */}
        {/* Footer with green and gray lines */}
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
          <Text style={styles.pageNumber}>Page 1 of 1</Text>
        </View>
      </Page>

    </Document>
  );
};

export default PortfolioPDFDocument;