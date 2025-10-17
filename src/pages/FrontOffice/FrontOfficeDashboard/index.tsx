import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lucide from '../../../base-components/Lucide';
import Button from '../../../base-components/Button';
import { Dialog, Menu } from '../../../base-components/Headless';
import Table from '../../../base-components/Table';
import * as ApiService from '../../../services/auth';
import { useAuth } from '../../../contexts/Auth';
import LoadingIcon from '../../../base-components/LoadingIcon';
import Notification, { NotificationElement } from '../../../base-components/Notification';

// Import chart components (you may need to create these)
import ReportDonutChart from '../../../components/ReportDonutChart';
import StackedBarChart from '../../../components/VerticalBarChart';

interface DashboardStats {
  totalEnquiries: number;
  totalVisitors: number;
  totalComplaints: number;
  totalApplications: number;
  conversionRate: number;
  avgResponseTime: number;
  pendingComplaints: number;
  resolvedComplaints: number;
}

interface EnquiryConversion {
  stage: string;
  count: number;
  percentage: number;
}

interface VisitorReport {
  date: string;
  visitors: number;
  enquiries: number;
  conversions: number;
}

interface ComplaintSLA {
  category: string;
  total: number;
  onTime: number;
  overdue: number;
  slaPercentage: number;
}

interface ApplicationPipeline {
  stage: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

function FrontOfficeDashboard() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const notify = useRef<NotificationElement>();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalEnquiries: 0,
    totalVisitors: 0,
    totalComplaints: 0,
    totalApplications: 0,
    conversionRate: 0,
    avgResponseTime: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0
  });
  
  const [enquiryConversion, setEnquiryConversion] = useState<EnquiryConversion[]>([]);
  const [visitorReports, setVisitorReports] = useState<VisitorReport[]>([]);
  const [complaintSLA, setComplaintSLA] = useState<ComplaintSLA[]>([]);
  const [applicationPipeline, setApplicationPipeline] = useState<ApplicationPipeline[]>([]);
  
  // Date range for reports
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load all dashboard data in parallel
      const [
        statsData,
        conversionData,
        visitorData,
        complaintData,
        pipelineData
      ] = await Promise.all([
        loadDashboardStats(),
        loadEnquiryConversion(),
        loadVisitorReports(),
        loadComplaintSLA(),
        loadApplicationPipeline()
      ]);

      setStats(statsData);
      setEnquiryConversion(conversionData);
      setVisitorReports(visitorData);
      setComplaintSLA(complaintData);
      setApplicationPipeline(pipelineData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardStats = async (): Promise<DashboardStats> => {
    try {
      const response = await ApiService.getFrontOfficeStats(dateRange);
      return response.data;
    } catch (error) {
      console.error('Error loading stats:', error);
      return {
        totalEnquiries: 0,
        totalVisitors: 0,
        totalComplaints: 0,
        totalApplications: 0,
        conversionRate: 0,
        avgResponseTime: 0,
        pendingComplaints: 0,
        resolvedComplaints: 0
      };
    }
  };

  const loadEnquiryConversion = async (): Promise<EnquiryConversion[]> => {
    try {
      const response = await ApiService.getEnquiryConversionFunnel(dateRange);
      return response.data;
    } catch (error) {
      console.error('Error loading conversion data:', error);
      return [];
    }
  };

  const loadVisitorReports = async (): Promise<VisitorReport[]> => {
    try {
      const response = await ApiService.getVisitorReports(dateRange);
      return response.data;
    } catch (error) {
      console.error('Error loading visitor reports:', error);
      return [];
    }
  };

  const loadComplaintSLA = async (): Promise<ComplaintSLA[]> => {
    try {
      const response = await ApiService.getComplaintSLAReports(dateRange);
      return response.data;
    } catch (error) {
      console.error('Error loading complaint SLA:', error);
      return [];
    }
  };

  const loadApplicationPipeline = async (): Promise<ApplicationPipeline[]> => {
    try {
      const response = await ApiService.getApplicationPipelineReports(dateRange);
      return response.data;
    } catch (error) {
      console.error('Error loading application pipeline:', error);
      return [];
    }
  };

  const exportReport = async (reportType: string) => {
    try {
      const response = await ApiService.exportFrontOfficeReport(reportType, dateRange);
      
      // Create download link
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportType}_report_${dateRange.startDate}_to_${dateRange.endDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingIcon icon="spinning-circles" className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Front Office Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of front office operations</p>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <Button
            onClick={loadDashboardData}
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Lucide icon="RefreshCw" className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Lucide icon="MessageSquare" className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Enquiries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEnquiries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Lucide icon="Users" className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVisitors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <Lucide icon="AlertTriangle" className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalComplaints}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <Lucide icon="FileText" className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.conversionRate}%</div>
            <p className="text-sm text-gray-600">Enquiry to Application</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Avg Response Time</h3>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.avgResponseTime}h</div>
            <p className="text-sm text-gray-600">Complaint Resolution</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaint Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pending:</span>
              <span className="text-sm font-medium text-red-600">{stats.pendingComplaints}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Resolved:</span>
              <span className="text-sm font-medium text-green-600">{stats.resolvedComplaints}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enquiry Conversion Funnel */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Enquiry Conversion Funnel</h3>
            <Button
              onClick={() => exportReport('enquiry_conversion')}
              variant="outline-secondary"
              className="text-sm"
            >
              <Lucide icon="Download" className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="h-64">
            <ReportDonutChart
              data={enquiryConversion.map(item => ({
                label: item.stage,
                value: item.count,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`
              }))}
            />
          </div>
        </div>

        {/* Visitor Reports */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Visitor Trends</h3>
            <Button
              onClick={() => exportReport('visitor_reports')}
              variant="outline-secondary"
              className="text-sm"
            >
              <Lucide icon="Download" className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="h-64">
            <StackedBarChart
              data={visitorReports}
              xKey="date"
              yKeys={['visitors', 'enquiries', 'conversions']}
            />
          </div>
        </div>
      </div>

      {/* Complaint SLA Reports */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Complaint SLA Performance</h3>
          <Button
            onClick={() => exportReport('complaint_sla')}
            variant="outline-secondary"
            className="text-sm"
          >
            <Lucide icon="Download" className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Category</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>On Time</Table.Th>
                <Table.Th>Overdue</Table.Th>
                <Table.Th>SLA %</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {complaintSLA.map((item, index) => (
                <Table.Tr key={index}>
                  <Table.Td className="font-medium">{item.category}</Table.Td>
                  <Table.Td>{item.total}</Table.Td>
                  <Table.Td className="text-green-600">{item.onTime}</Table.Td>
                  <Table.Td className="text-red-600">{item.overdue}</Table.Td>
                  <Table.Td>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.slaPercentage >= 90 ? 'bg-green-100 text-green-800' :
                      item.slaPercentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.slaPercentage}%
                    </span>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      </div>

      {/* Application Pipeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Application Pipeline</h3>
          <Button
            onClick={() => exportReport('application_pipeline')}
            variant="outline-secondary"
            className="text-sm"
          >
            <Lucide icon="Download" className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {applicationPipeline.map((stage, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{stage.stage}</h4>
                <Lucide 
                  icon={stage.trend === 'up' ? 'TrendingUp' : stage.trend === 'down' ? 'TrendingDown' : 'Minus'}
                  className={`w-4 h-4 ${
                    stage.trend === 'up' ? 'text-green-600' :
                    stage.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}
                />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stage.count}</div>
              <div className="text-sm text-gray-600">{stage.percentage}% of total</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={() => navigate('/home/enquiries')}
            variant="outline-secondary"
            className="flex items-center justify-center p-4 h-auto"
          >
            <Lucide icon="MessageSquare" className="w-5 h-5 mr-2" />
            Manage Enquiries
          </Button>
          <Button
            onClick={() => navigate('/home/visitors')}
            variant="outline-secondary"
            className="flex items-center justify-center p-4 h-auto"
          >
            <Lucide icon="Users" className="w-5 h-5 mr-2" />
            Manage Visitors
          </Button>
          <Button
            onClick={() => navigate('/home/complaints')}
            variant="outline-secondary"
            className="flex items-center justify-center p-4 h-auto"
          >
            <Lucide icon="AlertTriangle" className="w-5 h-5 mr-2" />
            Manage Complaints
          </Button>
          <Button
            onClick={() => navigate('/home/onlineapplications')}
            variant="outline-secondary"
            className="flex items-center justify-center p-4 h-auto"
          >
            <Lucide icon="FileText" className="w-5 h-5 mr-2" />
            Manage Applications
          </Button>
        </div>
      </div>

      <Notification
        options={{ duration: 3000 }}
        getRef={(el) => {
          notify.current = el;
        }}
        className="flex"
      >
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
          <div className="font-medium">Success</div>
          <div className="mt-1 text-slate-500">Report exported successfully</div>
        </div>
      </Notification>
    </div>
  );
}

export default FrontOfficeDashboard;
