import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts (you can add custom fonts here)
Font.register({
  family: 'Roboto',
  src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2'
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2 solid #3b82f6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: '1 solid #e5e7eb',
  },
  studentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoItem: {
    flex: 1,
    marginRight: 10,
  },
  infoLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#f8fafc',
    marginRight: 5,
    borderRadius: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  competenciesList: {
    marginBottom: 10,
  },
  competencyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#f3f4f6',
    marginBottom: 5,
    borderRadius: 3,
  },
  competencyName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
  },
  competencyCount: {
    fontSize: 10,
    color: '#6b7280',
  },
  strengthsList: {
    marginBottom: 10,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  bullet: {
    fontSize: 12,
    color: '#10b981',
    marginRight: 5,
    marginTop: 1,
  },
  strengthText: {
    fontSize: 10,
    color: '#374151',
    flex: 1,
  },
  improvementsList: {
    marginBottom: 10,
  },
  improvementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  improvementText: {
    fontSize: 10,
    color: '#374151',
    flex: 1,
  },
  reflectionItem: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 3,
  },
  reflectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  reflectionText: {
    fontSize: 9,
    color: '#6b7280',
    lineHeight: 1.4,
  },
  feedbackItem: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 3,
  },
  feedbackTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  feedbackComment: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 3,
  },
  feedbackMeta: {
    fontSize: 8,
    color: '#9ca3af',
  },
  insightsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightItem: {
    flex: 1,
    padding: 8,
    backgroundColor: '#ede9fe',
    marginRight: 5,
    borderRadius: 3,
  },
  insightLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6b21a8',
    marginBottom: 2,
  },
  insightValue: {
    fontSize: 10,
    color: '#374151',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
  },
});

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
  }>;
  summaryInsights: {
    mostActiveLearningArea: string;
    topCompetency: string;
    recentActivity: string | null;
  };
  customTitle?: string;
  customIntroduction?: string;
}

interface PortfolioPDFProps {
  data: PortfolioSummary;
}

const PortfolioPDF: React.FC<PortfolioPDFProps> = ({ data }) => {
  console.log('PortfolioPDF Component - Received data:', data);
  console.log('PortfolioPDF Component - Student:', data.student);
  console.log('PortfolioPDF Component - Statistics:', data.statistics);
  
  return (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {data.customTitle || 'Portfolio Summary Report'}
        </Text>
        <Text style={styles.subtitle}>
          Generated on {new Date(data.generatedAt).toLocaleDateString()}
        </Text>
      </View>

      {/* Custom Introduction */}
      {data.customIntroduction && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={{ fontSize: 10, color: '#374151', lineHeight: 1.4 }}>
            {data.customIntroduction}
          </Text>
        </View>
      )}

      {/* Student Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student Information</Text>
        <View style={styles.studentInfo}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{data.student.fullName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Admission Number</Text>
            <Text style={styles.infoValue}>{data.student.adm_no}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Academic Year</Text>
            <Text style={styles.infoValue}>{data.academicYear}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Term</Text>
            <Text style={styles.infoValue}>{data.term}</Text>
          </View>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Portfolio Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.statistics.totalEvidences}</Text>
            <Text style={styles.statLabel}>Total Evidences</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.statistics.totalCompetencies}</Text>
            <Text style={styles.statLabel}>Competencies</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.statistics.totalLearningAreas}</Text>
            <Text style={styles.statLabel}>Learning Areas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.statistics.averageRating}</Text>
            <Text style={styles.statLabel}>Avg Rating</Text>
          </View>
        </View>
      </View>

      {/* Competencies Achieved */}
      {data.competenciesAchieved.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Competencies Achieved</Text>
          <View style={styles.competenciesList}>
            {data.competenciesAchieved.map((competency, index) => (
              <View key={index} style={styles.competencyItem}>
                <Text style={styles.competencyName}>{competency.competency.name}</Text>
                <Text style={styles.competencyCount}>{competency.count} evidence</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Strengths and Improvements */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {/* Strengths */}
          {data.strengths.length > 0 && (
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.sectionTitle}>Strengths</Text>
              <View style={styles.strengthsList}>
                {data.strengths.map((strength, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.strengthText}>{strength}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Areas for Improvement */}
          {data.improvements.length > 0 && (
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.sectionTitle}>Areas for Improvement</Text>
              <View style={styles.improvementsList}>
                {data.improvements.map((improvement, index) => (
                  <View key={index} style={styles.improvementItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.improvementText}>{improvement}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Recent Reflections */}
      {data.reflections.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reflections</Text>
          {data.reflections.slice(0, 3).map((reflection, index) => (
            <View key={index} style={styles.reflectionItem}>
              <Text style={styles.reflectionTitle}>{reflection.evidenceTitle}</Text>
              <Text style={styles.reflectionText}>
                {reflection.reflection.substring(0, 200)}...
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Recent Teacher Feedback */}
      {data.teacherFeedbacks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Teacher Feedback</Text>
          {data.teacherFeedbacks.slice(0, 3).map((feedback, index) => (
            <View key={index} style={styles.feedbackItem}>
              <Text style={styles.feedbackTitle}>{feedback.evidenceTitle}</Text>
              <Text style={styles.feedbackComment}>{feedback.comment}</Text>
              <Text style={styles.feedbackMeta}>
                {feedback.feedbackBy} • {new Date(feedback.date).toLocaleDateString()} • 
                Rating: {feedback.rating}/5
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Summary Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary Insights</Text>
        <View style={styles.insightsGrid}>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Most Active Learning Area</Text>
            <Text style={styles.insightValue}>{data.summaryInsights.mostActiveLearningArea}</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Top Competency</Text>
            <Text style={styles.insightValue}>{data.summaryInsights.topCompetency}</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Recent Activity</Text>
            <Text style={styles.insightValue}>
              {data.summaryInsights.recentActivity 
                ? new Date(data.summaryInsights.recentActivity).toLocaleDateString()
                : 'No recent activity'
              }
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        Portfolio Summary Report - {data.student.fullName} ({data.student.adm_no}) - {data.academicYear}
      </Text>
    </Page>
  </Document>
  );
};

export default PortfolioPDF;
