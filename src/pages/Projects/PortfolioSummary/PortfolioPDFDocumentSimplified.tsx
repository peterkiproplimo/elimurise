import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Create simplified styles
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
};

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getStudentFullName = (student: any) => {
  if (student?.fullName) return student.fullName;
  return `${student?.first_name || ''} ${student?.last_name || ''} ${student?.surname || ''}`.trim();
};

// Simplified Portfolio PDF Document Component
const PortfolioPDFDocumentSimplified = ({ data }: { data?: any }) => {
  const portfolioData = data || sampleData;
  
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
      {/* Page 1: Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.letterheadHeader}>
          <View style={styles.redLine} />
          <View style={styles.grayLine} />
        </View>
        
        <View style={styles.coverTitle}>
          <Text>PORTFOLIO</Text>
          <Text>SUMMARY</Text>
        </View>
        
        <View style={styles.studentDetails}>
          <Text style={{ fontSize: 14, color: '#6b7280', marginBottom: 4 }}>Submitted By:</Text>
          <Text style={styles.studentName}>{getStudentFullName(portfolioData.student)}</Text>
          <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 8 }}>Class: {portfolioData.student?.grade || 'N/A'}</Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>Roll No: {portfolioData.student?.adm_no || 'N/A'}</Text>
        </View>
        
        <Image 
          style={styles.cbcImage} 
          src="/cbc1.jpeg" 
        />
        
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
          <Text style={styles.pageNumber}>Page 1 of 8</Text>
        </View>
      </Page>

      {/* Page 2: Competency Achievement Charts */}
      <Page size="A4" style={styles.contentPage}>
        <View style={styles.letterheadHeader}>
          <View style={styles.redLine} />
          <View style={styles.grayLine} />
        </View>
        
        <Text style={styles.sectionHeader}>Competency Achievement Overview</Text>
        
        <View style={styles.competencyChart}>
          <Text style={styles.chartTitle}>Core Competencies Performance</Text>
          {(portfolioData.competenciesAchieved || []).map((comp, index) => (
            <View key={index} style={{ marginBottom: 12 }}>
              <Text style={styles.competencyLabel}>{comp.competency.name}</Text>
              <View style={styles.competencyBar}>
                <View style={[styles.competencyBarFill, { width: `${(comp.rating / 5) * 100}%` }]} />
                <Text style={styles.competencyValue}>{comp.rating}/5</Text>
              </View>
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
          <Text style={styles.pageNumber}>Page 2 of 8</Text>
        </View>
      </Page>

      {/* Page 3: Student Reflections */}
      <Page size="A4" style={styles.contentPage}>
        <View style={styles.letterheadHeader}>
          <View style={styles.redLine} />
          <View style={styles.grayLine} />
        </View>
        
        <Text style={styles.sectionHeader}>Student Reflections</Text>
        
        {(portfolioData.reflections || []).map((reflection, index) => (
          <View key={index} style={styles.reflectionCard}>
            <Text style={styles.reflectionTitle}>{reflection.evidenceTitle}</Text>
            <Text style={styles.reflectionContent}>{reflection.reflection}</Text>
            <Text style={styles.reflectionMeta}>- {formatDate(reflection.submittedAt)}</Text>
          </View>
        ))}
        
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
          <Text style={styles.pageNumber}>Page 3 of 8</Text>
        </View>
      </Page>

      {/* Page 4: Teacher Feedback */}
      <Page size="A4" style={styles.contentPage}>
        <View style={styles.letterheadHeader}>
          <View style={styles.redLine} />
          <View style={styles.grayLine} />
        </View>
        
        <Text style={styles.sectionHeader}>Teacher Feedback & Comments</Text>
        
        {(portfolioData.teacherFeedbacks || []).map((feedback, index) => (
          <View key={index} style={styles.teacherFeedbackCard}>
            <Text style={styles.feedbackTitle}>{feedback.evidenceTitle}</Text>
            <Text style={styles.feedbackContent}>{feedback.comment}</Text>
            <Text style={styles.feedbackTeacher}>- {feedback.feedbackBy} • {formatDate(feedback.date)} • Rating: {feedback.rating}/5</Text>
          </View>
        ))}
        
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
          <Text style={styles.pageNumber}>Page 4 of 8</Text>
        </View>
      </Page>

      {/* Page 5: Strengths & Improvements */}
      <Page size="A4" style={styles.contentPage}>
        <View style={styles.letterheadHeader}>
          <View style={styles.redLine} />
          <View style={styles.grayLine} />
        </View>
        
        <Text style={styles.sectionHeader}>Strengths & Areas for Growth</Text>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#166534', marginBottom: 10 }}>Key Strengths</Text>
          {(portfolioData.strengths || []).map((strength, index) => (
            <View key={index} style={styles.strengthItem}>
              <Text style={styles.strengthText}>✓ {strength}</Text>
            </View>
          ))}
        </View>
        
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#92400e', marginBottom: 10 }}>Areas for Improvement</Text>
          {(portfolioData.improvements || []).map((improvement, index) => (
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
          <Text style={styles.pageNumber}>Page 5 of 8</Text>
        </View>
      </Page>

      {/* Page 6: Awards & Certificates */}
      <Page size="A4" style={styles.contentPage}>
        <View style={styles.letterheadHeader}>
          <View style={styles.redLine} />
          <View style={styles.grayLine} />
        </View>
        
        <Text style={styles.sectionHeader}>Awards & Certificates</Text>
        
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 10 }}>Awards & Recognition</Text>
          {(portfolioData.awards || []).map((award, index) => (
            <View key={index} style={styles.achievementCard}>
              <Text style={styles.achievementTitle}>{award.title}</Text>
              <Text style={styles.achievementDate}>{formatDate(award.issueDate)} • {award.category}</Text>
              <Text style={{ fontSize: 11, color: '#374151', marginTop: 4 }}>{award.description}</Text>
            </View>
          ))}
        </View>
        
        <View>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 10 }}>Academic Certificates</Text>
          {(portfolioData.certificates || []).map((certificate, index) => (
            <View key={index} style={styles.achievementCard}>
              <Text style={styles.achievementTitle}>{certificate.title}</Text>
              <Text style={styles.achievementDate}>{formatDate(certificate.issueDate)} • Grade: {certificate.grade} ({certificate.score})</Text>
              <Text style={{ fontSize: 11, color: '#374151', marginTop: 4 }}>{certificate.description}</Text>
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
          <Text style={styles.pageNumber}>Page 6 of 8</Text>
        </View>
      </Page>

      {/* Page 7: Project Evidences */}
      <Page size="A4" style={styles.contentPage}>
        <View style={styles.letterheadHeader}>
          <View style={styles.redLine} />
          <View style={styles.grayLine} />
        </View>
        
        <Text style={styles.sectionHeader}>Project Evidences & Learning Artifacts</Text>
        
        {(portfolioData.projectEvidences || []).map((project, index) => (
          <View key={index} style={styles.projectCard}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectDescription}>{project.description}</Text>
            <Text style={{ fontSize: 10, color: '#6b7280', marginTop: 4 }}>
              {project.evidenceType} • {project.competency} • {formatDate(project.submittedAt)}
            </Text>
            <Text style={{ fontSize: 10, color: '#374151', marginTop: 4, fontStyle: 'italic' }}>
              Reflection: {project.reflection}
            </Text>
          </View>
        ))}
        
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
          <Text style={styles.pageNumber}>Page 7 of 8</Text>
        </View>
      </Page>

      {/* Page 8: CBC Integration & Conclusion */}
      <Page size="A4" style={styles.contentPage}>
        <View style={styles.letterheadHeader}>
          <View style={styles.redLine} />
          <View style={styles.grayLine} />
        </View>
        
        <Text style={styles.sectionHeader}>CBC Integration & Summary</Text>
        
        <Image 
          style={styles.cbcImage} 
          src="/cbc1.jpeg" 
        />
        
        <View style={styles.narrativeSummary}>
          <Text style={styles.narrativeTitle}>Portfolio Summary</Text>
          <Text style={styles.narrativeContent}>
            This portfolio demonstrates comprehensive integration of the Competency-Based Curriculum (CBC) framework. 
            The student has successfully developed core competencies including communication, critical thinking, 
            creativity, and digital literacy through authentic learning experiences and project-based assessments.
          </Text>
        </View>
        
        <View style={styles.narrativeSummary}>
          <Text style={styles.narrativeTitle}>Key Achievements</Text>
          <Text style={styles.narrativeContent}>
            • {(portfolioData.awards || []).length} Awards & Recognition certificates
            • {(portfolioData.certificates || []).length} Academic achievement certificates  
            • {(portfolioData.projectEvidences || []).length} Project evidences demonstrating competency development
            • {(portfolioData.competenciesAchieved || []).length} Core competencies with strong performance ratings
            • Leadership role as Student Council President
            • Environmental conservation initiatives impacting the school community
          </Text>
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
          <Text style={styles.pageNumber}>Page 8 of 8</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PortfolioPDFDocumentSimplified;
