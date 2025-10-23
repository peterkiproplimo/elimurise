import React, { useState, useEffect } from 'react';
import Card from '../../../base-components/Card';
import Button from '../../../base-components/Button';
import { Tab } from '../../../base-components/Headless';
import { Calendar, Users, BookOpen, DollarSign, TrendingUp, AlertCircle, MessageSquare, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../../contexts/Auth';
import { dashboardService } from '../../../services/dashboardService';

interface DashboardData {
  overview: {
    totalStudents: number;
    totalTeachers: number;
    totalParents: number;
    currentAcademicYear: string;
    currentTerm: string;
    totalVisitors?: number;
    totalComplaints?: number;
    totalEnquiries?: number;
    totalOnlineApplicants?: number;
  };
  enrollment: any;
  attendance: any;
  performance: any;
  financial: any;
  recentActivities: any[];
  lastUpdated: string;
}

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, color }) => (
  <Card className="col-span-1">
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-xs px-2 py-1 rounded ${change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-muted-foreground ml-2">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedAcademicYear, selectedTerm, selectedGrade]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const schoolId = user?.school?._id;
      if (!schoolId) return;

      const data = await dashboardService.getOverview(schoolId, selectedAcademicYear, selectedTerm);
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No dashboard data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstname} {user?.lastname}
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
          <Button onClick={fetchDashboardData} variant="outline-primary">
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Students"
          value={dashboardData.overview.totalStudents}
          change={5.2}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <KPICard
          title="Total Teachers"
          value={dashboardData.overview.totalTeachers}
          change={2.1}
          icon={<BookOpen className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <KPICard
          title="Attendance Rate"
          value={`${dashboardData.attendance?.rate?.toFixed(1) || 0}%`}
          change={-1.5}
          icon={<Calendar className="h-6 w-6 text-white" />}
          color="bg-orange-500"
        />
        <KPICard
          title="Revenue"
          value={`KES ${dashboardData.financial?.revenue?.toLocaleString() || 0}`}
          change={8.7}
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Additional Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Visitors"
          value={(dashboardData.overview as any).totalVisitors || 0}
          change={12.5}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-cyan-500"
        />
        <KPICard
          title="Total Complaints"
          value={(dashboardData.overview as any).totalComplaints || 0}
          change={-8.3}
          icon={<AlertCircle className="h-6 w-6 text-white" />}
          color="bg-red-500"
        />
        <KPICard
          title="Total Enquiries"
          value={(dashboardData.overview as any).totalEnquiries || 0}
          change={15.2}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
        />
        <KPICard
          title="Online Applicants"
          value={(dashboardData.overview as any).totalOnlineApplicants || 0}
          change={22.1}
          icon={<Activity className="h-6 w-6 text-white" />}
          color="bg-emerald-500"
        />
      </div>

      {/* Main Content */}
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab
            className={({ selected }: { selected: boolean }) =>
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
            className={({ selected }: { selected: boolean }) =>
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
            className={({ selected }: { selected: boolean }) =>
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
            className={({ selected }: { selected: boolean }) =>
              `px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                selected
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              }`
            }
          >
            Attendance
          </Tab>
          <Tab
            className={({ selected }: { selected: boolean }) =>
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
            className={({ selected }: { selected: boolean }) =>
              `px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                selected
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
              }`
            }
          >
            Real-time
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-6">
          {/* Overview Tab */}
          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.performance?.performanceTrends || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="averageScore" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Attendance by Grade</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.attendance?.attendanceByGrade || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="gradeName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="attendanceRate" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Enrollment Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.enrollment?.enrollmentByGrade || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {dashboardData.enrollment?.enrollmentByGrade?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
                  <div className="space-y-4">
                    {dashboardData.recentActivities?.slice(0, 5).map((activity: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'enrollment' ? 'bg-green-100' :
                          activity.type === 'assessment' ? 'bg-blue-100' :
                          'bg-purple-100'
                        }`}>
                          {activity.type === 'enrollment' && <Users className="h-4 w-4 text-green-600" />}
                          {activity.type === 'assessment' && <BookOpen className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </Tab.Panel>

          {/* Enrollment Tab */}
          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Enrollment by Grade</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.attendance?.attendanceByGrade || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="gradeName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="attendanceRate" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Enrollment Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.enrollment?.enrollmentTrends || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </Tab.Panel>

          {/* Performance Tab */}
          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Performance by Subject</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.performance?.performanceBySubject || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subjectName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="averageScore" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Teacher Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.performance?.teacherPerformance || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="teacherName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="averageScore" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </Tab.Panel>

          {/* Attendance Tab */}
          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Attendance by Grade</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData.attendance?.attendanceByGrade || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="gradeName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="attendanceRate" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Attendance Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.attendance?.attendanceTrends || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="attendanceRate" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </Tab.Panel>

          {/* Financial Tab */}
          <Tab.Panel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData.financial?.paymentByMethod || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalAmount"
                      >
                        {dashboardData.financial?.paymentByMethod?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dashboardData.financial?.paymentTrends || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </Tab.Panel>

          {/* Real-time Tab */}
          <Tab.Panel>
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Real-time Activity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Active Students</p>
                      <p className="text-2xl font-bold">{dashboardData.overview.totalStudents}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Today's Attendance</p>
                      <p className="text-2xl font-bold">95%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Active Classes</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">New Messages</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Dashboard; 