import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000000',
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    color: '#000000',
  },
  debug: {
    fontSize: 10,
    marginBottom: 5,
    color: '#666666',
  },
});

interface TestPDFProps {
  data: any;
}

const TestPDF: React.FC<TestPDFProps> = ({ data }) => {
  console.log('TestPDF - Received data:', data);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Portfolio Data Debug</Text>
        
        <Text style={styles.text}>Data Type: {typeof data}</Text>
        <Text style={styles.text}>Data Keys: {data ? Object.keys(data).join(', ') : 'No data'}</Text>
        
        {data && data.student && (
          <>
            <Text style={styles.text}>Student Name: {data.student.fullName || 'No name'}</Text>
            <Text style={styles.text}>Student ID: {data.student._id || 'No ID'}</Text>
            <Text style={styles.text}>Admission Number: {data.student.adm_no || 'No adm_no'}</Text>
          </>
        )}
        
        {data && data.statistics && (
          <>
            <Text style={styles.text}>Total Evidences: {data.statistics.totalEvidences || 0}</Text>
            <Text style={styles.text}>Total Competencies: {data.statistics.totalCompetencies || 0}</Text>
            <Text style={styles.text}>Total Learning Areas: {data.statistics.totalLearningAreas || 0}</Text>
          </>
        )}
        
        {data && data.competenciesAchieved && (
          <Text style={styles.text}>Competencies Count: {data.competenciesAchieved.length || 0}</Text>
        )}
        
        {data && data.strengths && (
          <Text style={styles.text}>Strengths Count: {data.strengths.length || 0}</Text>
        )}
        
        <Text style={styles.debug}>Raw Data: {JSON.stringify(data, null, 2)}</Text>
      </Page>
    </Document>
  );
};

export default TestPDF;
