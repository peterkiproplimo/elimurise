import React, { useState, useEffect } from 'react';
import Card from '../../../base-components/Card';
import Button from '../../../base-components/Button';
import { Tab } from '../../../base-components/Headless';
import { 
  TrendingUp, 
  Users, 
  BookOpen, 
  DollarSign, 
  Calendar, 
  Target,
  BarChart3,
  PieChart,
  Download,
  Filter
} from 'lucide-react';
import { ChartWidget, MetricCard, ActivityFeed, AlertWidget, ProgressWidget } from '../../../components/Dashboard/DashboardWidgets';
import { useAuth } from '../../../contexts/Auth';

interface AuthContextData {
  user: any;
  // Add other properties as needed
}

interface TabProps {
  selected: boolean;
}

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string } | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const mockData = {
    enrollmentTrends: [
      { name: 'Jan', value: 120 },
      { name: 'Feb', value: 135 },
      { name: 'Mar', value: 150 },
      { name: 'Apr', value: 165 },
      { name: 'May', value: 180 },
      { name: 'Jun', value: 195 }
    ],
    performanceBySubject: [
      { name: 'Mathematics', value: 85 },
      { name: 'English', value: 78 },
      { name: 'Science', value: 82 },
      { name: 'Social Studies', value: 75 },
      { name: 'Kiswahili', value: 80 }
    ],
    attendanceByGrade: [
      { name: 'Grade 1', value: 95 },
      { name: 'Grade 2', value: 92 },
      { name: 'Grade 3', value: 88 },
      { name: 'Grade 4', value: 90 },
      { name: 'Grade 5', value: 87 },
      { name: 'Grade 6', value: 93 }
    ],
    paymentMethods: [
      { name: 'MPESA', value: 45 },
      { name: 'Bank Transfer', value: 25 },
      { name: 'Cash', value: 20 },
      { name: 'Card', value: 10 }
    ],
    recentActivities: [
      {
        id: '1',
        type: 'enrollment',
        description: 'New student enrolled: John Doe',
        date: '2024-01-15T10:30:00Z',
        user: 'Admin'
      },
      {
        id: '2',
        type: 'assessment',
        description: 'Mathematics test completed',
        date: '2024-01-15T09:15:00Z',
        user: 'Teacher Smith'
      },
      {
        id: '3',
        type: 'payment',
        description: 'Payment received: KES 15,000',
        date: '2024-01-15T08:45:00Z',
        user: 'Parent'
      }
    ],
    alerts: [
      {
        id: "1",
        type: "warning" as const,
        title: "System Update",
        message: "Scheduled maintenance in 2 hours",
        timestamp: "2024-01-15T10:30:00Z"
      },
      {
        id: "2", 
        type: "info" as const,
        title: "New Feature",
        message: "Analytics dashboard is now available",
        timestamp: "2024-01-15T09:15:00Z"
      }
    ],
    progressItems: [
      {
        label: 'Enrollment Target',
        value: 180,
        target: 200,
        color: 'bg-blue-500'
      },
      {
        label: 'Attendance Rate',
        value: 92,
        target: 95,
        color: 'bg-green-500'
      },
      {
        label: 'Payment Collection',
        value: 85,
        target: 90,
        color: 'bg-purple-500'
      }
    ]
  };

  useEffect(() => {
    // Initialize with current academic year
    setSelectedAcademicYear(new Date().getFullYear().toString());
    setSelectedTerm('Term 1');
    setLoading(false);
  }, []);

  const handleExport = (type: string) => {
    // Implementation for data export
    console.log(`Exporting ${type} data...`);
  };

  const quickActions = [
    {
      id: '1',
      title: 'Generate Report',
      description: 'Create comprehensive school report',
      icon: <BarChart3 className="h-5 w-5" />,
      onClick: () => handleExport('report')
    },
    {
      id: '2',
      title: 'Export Data',
      description: 'Download analytics data',
      icon: <Download className="h-5 w-5" />,
      onClick: () => handleExport('data')
    },
    {
      id: '3',
      title: 'Set Targets',
      description: 'Configure performance targets',
      icon: <Target className="h-5 w-5" />,
      onClick: () => console.log('Set targets')
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Advanced business intelligence for school directors
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedAcademicYear} 
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
            className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Academic Year</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
          </select>
          <select 
            value={selectedTerm} 
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Term</option>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
          </select>
          <Button variant="outline-primary" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Students"
          value="1,250"
          change={5.2}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <MetricCard
          title="Average Performance"
          value="82.5%"
          change={2.1}
          icon={<BookOpen className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <MetricCard
          title="Attendance Rate"
          value="92.3%"
          change={-1.5}
          icon={<Calendar className="h-6 w-6 text-white" />}
          color="bg-orange-500"
        />
        <MetricCard
          title="Revenue"
          value="KES 2.5M"
          change={8.7}
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Main Content */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab
            className={({ selected }: TabProps) =>
              `px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                selected
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              }`
            }
          >
            Overview
          </Tab>
          <Tab
            className={({ selected }: TabProps) =>
              `px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                selected
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              }`
            }
          >
            Enrollment
          </Tab>
          <Tab
            className={({ selected }: TabProps) =>
              `px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                selected
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              }`
            }
          >
            Performance
          </Tab>
          <Tab
            className={({ selected }: TabProps) =>
              `px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                selected
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              }`
            }
          >
            Financial
          </Tab>
          <Tab
            className={({ selected }: TabProps) =>
              `px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                selected
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              }`
            }
          >
            Predictive
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-6">
          {/* Overview Tab */}
          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartWidget
                title="Enrollment Trends"
                data={mockData.enrollmentTrends}
                type="line"
                dataKey="value"
                color="#8884d8"
              />
              <ChartWidget
                title="Performance by Subject"
                data={mockData.performanceBySubject}
                type="bar"
                dataKey="value"
                color="#82ca9d"
              />
              <ChartWidget
                title="Attendance by Grade"
                data={mockData.attendanceByGrade}
                type="bar"
                dataKey="value"
                color="#ffc658"
              />
              <ChartWidget
                title="Payment Methods"
                data={mockData.paymentMethods}
                type="pie"
                dataKey="value"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <ProgressWidget
                title="Progress Tracking"
                items={mockData.progressItems}
              />
              <ActivityFeed activities={mockData.recentActivities} />
              <AlertWidget alerts={mockData.alerts} />
            </div>
          </Tab.Panel>

          {/* Enrollment Tab */}
          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartWidget
                title="Enrollment by Grade"
                data={mockData.attendanceByGrade}
                type="bar"
                dataKey="value"
                color="#8884d8"
              />
              <ChartWidget
                title="Enrollment Trends"
                data={mockData.enrollmentTrends}
                type="line"
                dataKey="value"
                color="#82ca9d"
              />
            </div>
          </Tab.Panel>

          {/* Performance Tab */}
          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartWidget
                title="Performance by Subject"
                data={mockData.performanceBySubject}
                type="bar"
                dataKey="value"
                color="#8884d8"
              />
              <ChartWidget
                title="Performance Trends"
                data={mockData.enrollmentTrends}
                type="line"
                dataKey="value"
                color="#82ca9d"
              />
            </div>
          </Tab.Panel>

          {/* Financial Tab */}
          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartWidget
                title="Payment Methods"
                data={mockData.paymentMethods}
                type="pie"
                dataKey="value"
              />
              <ChartWidget
                title="Revenue Trends"
                data={mockData.enrollmentTrends}
                type="line"
                dataKey="value"
                color="#8884d8"
              />
            </div>
          </Tab.Panel>

          {/* Predictive Tab */}
          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Enrollment Prediction</h3>
                  <p className="text-muted-foreground">
                    Based on current trends, expected enrollment for next term: 1,350 students
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Confidence Level</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Performance Forecast</h3>
                  <p className="text-muted-foreground">
                    Predicted average performance for next assessment: 84.2%
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Confidence Level</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      {/* Quick Actions */}
      <div className="mt-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-medium">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 