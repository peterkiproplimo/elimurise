import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Simplified styles for better performance
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#10b981',
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#f0fdf4',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  item: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 10,
    color: '#6b7280',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#6b7280',
  },
});

// Helper function to format dates
const formatDate = (date: string | Date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Simplified sample data
const sampleData = {
  student: {
    fullName: 'John Michael Smith',
    adm_no: 'ADM001',
    grade: 'Grade 8',
  },
  academicYear: '2024',
  term: 'Term 1',
  generatedAt: new Date(),
  awards: [
    { title: 'Student of the Month', issueDate: '2024-01-15', category: 'Academic Excellence' },
    { title: 'Science Fair Winner', issueDate: '2024-02-20', category: 'Science' },
    { title: 'Math Olympiad Bronze', issueDate: '2024-03-10', category: 'Mathematics' },
  ],
  certificates: [
    { title: 'Mathematics Excellence', issueDate: '2024-01-20', grade: 'A+', score: '95%' },
    { title: 'Science Achievement', issueDate: '2024-02-25', grade: 'A', score: '88%' },
    { title: 'English Proficiency', issueDate: '2024-03-15', grade: 'A+', score: '92%' },
  ],
  projects: [
    { title: 'Solar System Model', description: 'Created a detailed model of the solar system', submittedAt: '2024-01-15' },
    { title: 'Historical Timeline', description: 'Developed a comprehensive timeline of world history', submittedAt: '2024-02-20' },
    { title: 'Math Problem Solving', description: 'Solved complex mathematical problems', submittedAt: '2024-03-10' },
  ],
  competencies: [
    { name: 'Communication', rating: 4.5 },
    { name: 'Critical Thinking', rating: 4.2 },
    { name: 'Creativity', rating: 4.8 },
    { name: 'Collaboration', rating: 4.0 },
  ],
};

// Simplified PDF Document Component
const PortfolioPDFDocumentSimple = ({ data }: { data?: any }) => {
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
      {/* Page 1: Cover & Overview */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>ELIMURISE SCHOOL</Text>
          <Text style={styles.subtitle}>Student Portfolio Summary</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <View style={styles.item}>
            <Text style={styles.itemTitle}>Name: {portfolioData.student?.fullName || 'N/A'}</Text>
            <Text style={styles.itemText}>Admission Number: {portfolioData.student?.adm_no || 'N/A'}</Text>
            <Text style={styles.itemText}>Grade: {portfolioData.student?.grade || 'N/A'}</Text>
            <Text style={styles.itemText}>Academic Year: {portfolioData.academicYear || 'N/A'} • {portfolioData.term || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{portfolioData.awards?.length || 0}</Text>
            <Text style={styles.statLabel}>Awards</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{portfolioData.certificates?.length || 0}</Text>
            <Text style={styles.statLabel}>Certificates</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{portfolioData.projects?.length || 0}</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{portfolioData.competencies?.length || 0}</Text>
            <Text style={styles.statLabel}>Competencies</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Awards & Recognition</Text>
          {(portfolioData.awards || []).map((award, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{award.title || 'N/A'}</Text>
              <Text style={styles.itemText}>
                {formatDate(award.issueDate)} • {award.category || 'N/A'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📜 Certificates</Text>
          {(portfolioData.certificates || []).map((certificate, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{certificate.title || 'N/A'}</Text>
              <Text style={styles.itemText}>
                Grade: {certificate.grade || 'N/A'} ({certificate.score || 'N/A'}) • {formatDate(certificate.issueDate)}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Generated on {formatDate(portfolioData.generatedAt)} • Page 1 of 2
        </Text>
      </Page>

      {/* Page 2: Projects & Competencies */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Portfolio Summary</Text>
          <Text style={styles.subtitle}>Projects & Competencies</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Project Highlights</Text>
          {(portfolioData.projects || []).map((project, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{project.title || 'N/A'}</Text>
              <Text style={styles.itemText}>
                {project.description || 'N/A'} • {formatDate(project.submittedAt)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Competency Overview</Text>
          {(portfolioData.competencies || []).map((comp, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemTitle}>{comp.name || 'N/A'}</Text>
              <Text style={styles.itemText}>Rating: {comp.rating || 'N/A'}/5</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Key Strengths</Text>
          <View style={styles.item}>
            <Text style={styles.itemText}>• Demonstrates exceptional creativity and innovation</Text>
            <Text style={styles.itemText}>• Shows strong leadership and collaboration skills</Text>
            <Text style={styles.itemText}>• Excellent problem-solving and critical thinking abilities</Text>
            <Text style={styles.itemText}>• Outstanding communication and presentation skills</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Areas for Growth</Text>
          <View style={styles.item}>
            <Text style={styles.itemText}>• Could improve time management for complex projects</Text>
            <Text style={styles.itemText}>• Needs to work on asking for help when needed</Text>
            <Text style={styles.itemText}>• Should practice more structured problem-solving approaches</Text>
            <Text style={styles.itemText}>• Could benefit from more peer collaboration opportunities</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Generated on {formatDate(portfolioData.generatedAt)} • Page 2 of 2
        </Text>
      </Page>
    </Document>
  );
};

export default PortfolioPDFDocumentSimple;
