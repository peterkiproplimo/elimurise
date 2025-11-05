import React from 'react';
import { pdf } from '@react-pdf/renderer';
import TestPDF from './testPDFGenerator';

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

export const generatePortfolioPDF = async (data: PortfolioSummary): Promise<Blob> => {
  try {
    console.log('PDF Generation - Received data:', data);
    console.log('PDF Generation - Student data:', data.student);
    console.log('PDF Generation - Statistics:', data.statistics);
    console.log('PDF Generation - Competencies:', data.competenciesAchieved);
    
    const doc = <TestPDF data={data} />;
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    return blob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

export const downloadPortfolioPDF = async (data: PortfolioSummary, filename?: string): Promise<void> => {
  try {
    const blob = await generatePortfolioPDF(data);
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `portfolio-summary-${data.student.adm_no}-${data.academicYear}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF');
  }
};

export const previewPortfolioPDF = async (data: PortfolioSummary): Promise<string> => {
  try {
    const blob = await generatePortfolioPDF(data);
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error('Error previewing PDF:', error);
    throw new Error('Failed to preview PDF');
  }
};
