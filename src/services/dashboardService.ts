import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface DashboardOverview {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    totalParents: number;
    currentAcademicYear: string;
    currentTerm: string;
  };
  enrollment: any;
  attendance: any;
  performance: any;
  financial: any;
  recentActivities: any[];
  lastUpdated: string;
}

export interface EnrollmentAnalytics {
  enrollmentByGrade: any[];
  enrollmentTrends: any[];
  genderDistribution: any[];
  ageDistribution: any[];
  totalEnrolled: number;
}

export interface PerformanceAnalytics {
  formativePerformance: any[];
  summativePerformance: any[];
  performanceBySubject: any[];
  performanceTrends: any[];
}

export interface AttendanceAnalytics {
  attendanceByGrade: any[];
  attendanceTrends: any[];
  attendanceByDay: any[];
  totalStudents: number;
}

export interface FinancialAnalytics {
  paymentAnalytics: any[];
  paymentTrends: any[];
  paymentByMethod: any[];
  kpis: {
    totalRevenue: number;
    pendingPayments: number;
    collectionRate: number;
    totalTransactions: number;
  };
}

export interface TeacherAnalytics {
  teacherPerformance: any[];
  teacherWorkload: any[];
  totalTeachers: number;
}

export interface BehaviorAnalytics {
  behaviorByCategory: any[];
  behaviorTrends: any[];
  behaviorByGrade: any[];
  totalIncidents: number;
}

export interface CommunicationAnalytics {
  messageAnalytics: any[];
  noticeAnalytics: any[];
  communicationTrends: any[];
  totalMessages: number;
  totalNotices: number;
}

export interface RealtimeData {
  todayAttendance: number;
  todayPresent: number;
  todayAssessments: number;
  todayPayments: number;
  todayMessages: number;
  attendanceRate: number;
  lastUpdated: string;
}

class DashboardService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Get dashboard overview
   */
  async getOverview(schoolId: string, academicYear?: string, term?: string): Promise<DashboardOverview> {
    try {
      const params = new URLSearchParams();
      if (academicYear) params.append('academicYear', academicYear);
      if (term) params.append('term', term);

      const response = await axios.get(
        `${API_BASE_URL}/dashboard/overview/${schoolId}?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch dashboard overview:', error);
      throw error;
    }
  }

  /**
   * Get enrollment analytics
   */
  async getEnrollmentAnalytics(
    schoolId: string,
    academicYear?: string,
    term?: string,
    grade?: string
  ): Promise<EnrollmentAnalytics> {
    try {
      const params = new URLSearchParams();
      if (academicYear) params.append('academicYear', academicYear);
      if (term) params.append('term', term);
      if (grade) params.append('grade', grade);

      const response = await axios.get(
        `${API_BASE_URL}/dashboard/enrollment/${schoolId}?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch enrollment analytics:', error);
      throw error;
    }
  }

  /**
   * Get performance analytics
   */
  async getPerformanceAnalytics(
    schoolId: string,
    academicYear?: string,
    term?: string,
    grade?: string,
    stream?: string
  ): Promise<PerformanceAnalytics> {
    try {
      const params = new URLSearchParams();
      if (academicYear) params.append('academicYear', academicYear);
      if (term) params.append('term', term);
      if (grade) params.append('grade', grade);
      if (stream) params.append('stream', stream);

      const response = await axios.get(
        `${API_BASE_URL}/dashboard/performance/${schoolId}?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch performance analytics:', error);
      throw error;
    }
  }

  /**
   * Get attendance analytics
   */
  async getAttendanceAnalytics(
    schoolId: string,
    academicYear?: string,
    term?: string,
    grade?: string,
    stream?: string,
    dateRange?: { startDate: string; endDate: string }
  ): Promise<AttendanceAnalytics> {
    try {
      const params = new URLSearchParams();
      if (academicYear) params.append('academicYear', academicYear);
      if (term) params.append('term', term);
      if (grade) params.append('grade', grade);
      if (stream) params.append('stream', stream);
      if (dateRange) {
        params.append('dateRange', JSON.stringify(dateRange));
      }

      const response = await axios.get(
        `${API_BASE_URL}/dashboard/attendance/${schoolId}?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch attendance analytics:', error);
      throw error;
    }
  }

  /**
   * Get financial analytics
   */
  async getFinancialAnalytics(
    schoolId: string,
    academicYear?: string,
    term?: string,
    dateRange?: { startDate: string; endDate: string }
  ): Promise<FinancialAnalytics> {
    try {
      const params = new URLSearchParams();
      if (academicYear) params.append('academicYear', academicYear);
      if (term) params.append('term', term);
      if (dateRange) {
        params.append('dateRange', JSON.stringify(dateRange));
      }

      const response = await axios.get(
        `${API_BASE_URL}/dashboard/financial/${schoolId}?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch financial analytics:', error);
      throw error;
    }
  }

  /**
   * Get teacher analytics
   */
  async getTeacherAnalytics(
    schoolId: string,
    academicYear?: string,
    term?: string
  ): Promise<TeacherAnalytics> {
    try {
      const params = new URLSearchParams();
      if (academicYear) params.append('academicYear', academicYear);
      if (term) params.append('term', term);

      const response = await axios.get(
        `${API_BASE_URL}/dashboard/teachers/${schoolId}?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch teacher analytics:', error);
      throw error;
    }
  }

  /**
   * Get behavior analytics
   */
  async getBehaviorAnalytics(
    schoolId: string,
    academicYear?: string,
    term?: string,
    grade?: string,
    stream?: string
  ): Promise<BehaviorAnalytics> {
    try {
      const params = new URLSearchParams();
      if (academicYear) params.append('academicYear', academicYear);
      if (term) params.append('term', term);
      if (grade) params.append('grade', grade);
      if (stream) params.append('stream', stream);

      const response = await axios.get(
        `${API_BASE_URL}/dashboard/behavior/${schoolId}?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch behavior analytics:', error);
      throw error;
    }
  }

  /**
   * Get communication analytics
   */
  async getCommunicationAnalytics(
    schoolId: string,
    academicYear?: string,
    term?: string,
    dateRange?: { startDate: string; endDate: string }
  ): Promise<CommunicationAnalytics> {
    try {
      const params = new URLSearchParams();
      if (academicYear) params.append('academicYear', academicYear);
      if (term) params.append('term', term);
      if (dateRange) {
        params.append('dateRange', JSON.stringify(dateRange));
      }

      const response = await axios.get(
        `${API_BASE_URL}/dashboard/communication/${schoolId}?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch communication analytics:', error);
      throw error;
    }
  }

  /**
   * Get real-time data
   */
  async getRealtimeData(schoolId: string): Promise<RealtimeData> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/dashboard/realtime/${schoolId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch realtime data:', error);
      throw error;
    }
  }

  /**
   * Get comparative analytics
   */
  async getComparativeAnalytics(
    schoolId: string,
    metric: string,
    comparisonType: string,
    dateRange?: { startDate: string; endDate: string }
  ): Promise<any> {
    try {
      const params = new URLSearchParams();
      params.append('metric', metric);
      params.append('comparisonType', comparisonType);
      if (dateRange) {
        params.append('dateRange', JSON.stringify(dateRange));
      }

      const response = await axios.get(
        `${API_BASE_URL}/dashboard/comparative/${schoolId}?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch comparative analytics:', error);
      throw error;
    }
  }

  /**
   * Get predictive analytics
   */
  async getPredictiveAnalytics(
    schoolId: string,
    metric: string,
    timeframe: string
  ): Promise<any> {
    try {
      const params = new URLSearchParams();
      params.append('metric', metric);
      params.append('timeframe', timeframe);

      const response = await axios.get(
        `${API_BASE_URL}/dashboard/predictive/${schoolId}?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch predictive analytics:', error);
      throw error;
    }
  }

  /**
   * Export dashboard data
   */
  async exportDashboardData(
    schoolId: string,
    reportType: string,
    filters: any,
    format: string
  ): Promise<any> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/dashboard/export/${schoolId}`,
        {
          reportType,
          filters,
          format
        },
        { headers: this.getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      console.error('Failed to export dashboard data:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService(); 