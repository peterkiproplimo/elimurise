import axios from "axios";
import * as c from "../utils/constants";

// Portfolio Summary Service Functions
export const portfolioSummaryService = {
  // Generate portfolio summary data for a student
  generatePortfolioSummary: async (studentId: string, params: any = {}) => {
    try {
      // Send accessToken in JSON body via POST for compatibility
      const authRaw = localStorage.getItem('@AuthData');
      const authObj = authRaw ? JSON.parse(authRaw) : null;
      const accessToken = authObj?.user?.token;

      const response = await axios.post(`${c.PORTFOLIOSUMMARY}/${studentId}`, {
        ...params,
        accessToken
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating portfolio summary:', error);
      throw error;
    }
  },

  // Generate PDF portfolio summary data
  generatePortfolioPDF: async (studentId: string, data: any) => {
    try {
      const response = await axios.post(`${c.PORTFOLIOSUMMARY}/${studentId}/pdf`, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error generating portfolio PDF data:', error);
      throw error;
    }
  },

  // Download PDF file
  downloadPDF: (pdfBlob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

export default portfolioSummaryService;
