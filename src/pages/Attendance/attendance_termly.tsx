import { useState, useEffect, useRef } from "react";
import { FormLabel, FormSelect } from "../../base-components/Form";
import * as ApiService from "../../services/auth";
import LoadingIcon from "../../base-components/LoadingIcon";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import Notification, { NotificationElement } from "../../base-components/Notification";
import { TrendingUp, Users, Calendar, Download, BarChart3, Percent, Clock, Award } from "lucide-react";

// Constants for better maintainability
const CURRENT_DATE = new Date();
const DEFAULT_SUMMARY = {
  totalBoys: 0,
  totalGirls: 0,
  totalCumulativeBoys: 0,
  totalCumulativeGirls: 0,
  boysAttendancePercentage: "0.00",
  girlsAttendancePercentage: "0.00",
  totalSessions: 0,
  classAttendancePercentage: "0.00",
};

function AttendanceTermlySummaryPage() {
  const [grades, setGrades] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    CURRENT_DATE.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(CURRENT_DATE.getFullYear());
  const [attendanceSummary, setAttendanceSummary] = useState(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");

  const notify = useRef<NotificationElement>();

  useEffect(() => {
    getGrades();
  }, []);

  useEffect(() => {
    if (selectedStream) {
      fetchAttendanceSummary();
    }
  }, [selectedStream, selectedMonth, selectedYear]);

  const getGrades = async () => {
    try {
      const response = await ApiService.getGrades({ page: 1 });
      setGrades(response.data);
    } catch (error) {
      console.error("Failed to fetch grades:", error);
      setSuccess(false);
      setMessage("Failed to fetch grades");
      notify.current?.showToast();
    }
  };

  const getStreams = async (gradeId: string) => {
    try {
      const response = await ApiService.getStream({ page: 1, grade: gradeId });
      setStreams(response.data);
    } catch (error) {
      console.error("Failed to fetch streams:", error);
      setSuccess(false);
      setMessage("Failed to fetch streams");
      notify.current?.showToast();
    }
  };

  const fetchAttendanceSummary = async () => {
    if (!selectedGrade || !selectedStream) return;

    setLoading(true);
    try {
      const response = await ApiService.getAttendanceMonthlyAnalysis({
        year: selectedYear.toString(),
        month: selectedMonth.toString().padStart(2, "0"),
        stream: selectedStream,
      });
      setAttendanceSummary(response?.summary || DEFAULT_SUMMARY);
    } catch (error) {
      console.error("Failed to fetch attendance summary:", error);
      setAttendanceSummary(DEFAULT_SUMMARY);
      setSuccess(false);
      setMessage("Failed to fetch attendance summary");
      notify.current?.showToast();
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    try {
      const doc = new jsPDF({ orientation: "landscape" });
      const summary = attendanceSummary;

      // Header
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(33, 37, 41);
      doc.text("Attendance Summary Report", 14, 20);

      // Subtitle with month and year
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128);
      doc.text(
        `${new Date(selectedYear, selectedMonth - 1).toLocaleString("default", {
          month: "long",
        })} ${selectedYear}`,
        14,
        28
      );

      // Table data
      const tableColumn = ["Metric", "Value"];
      const tableRows = [
        ["Total Boys", summary.totalBoys],
        ["Total Girls", summary.totalGirls],
        ["Cumulative Boys", summary.totalCumulativeBoys],
        ["Cumulative Girls", summary.totalCumulativeGirls],
        ["Total Sessions", summary.totalSessions],
        ["Class Attendance", `${summary.classAttendancePercentage}%`],
      ];

      // Table styling
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: "striped",
        headStyles: {
          fillColor: [34, 197, 94],
          textColor: [255, 255, 255],
          fontSize: 12,
          halign: "center",
          fontStyle: "bold",
        },
        bodyStyles: {
          fontSize: 11,
          halign: "center",
          textColor: [55, 65, 81],
        },
        alternateRowStyles: {
          fillColor: [243, 244, 246],
        },
        margin: { top: 40 },
      });

      // Footer
      const finalY = (doc as any).lastAutoTable.finalY;
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, finalY + 10);

      doc.save(`attendance-summary-${selectedYear}-${selectedMonth}.pdf`);
      
      setSuccess(true);
      setMessage("Report generated successfully!");
      notify.current?.showToast();
    } catch (error) {
      setSuccess(false);
      setMessage("Failed to generate report");
      notify.current?.showToast();
    }
  };

  const handleGradeChange = (gradeId: string) => {
    setSelectedGrade(gradeId);
    setSelectedStream("");
    setAttendanceSummary(DEFAULT_SUMMARY);
    if (gradeId) {
      getStreams(gradeId);
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Termly Attendance Summary
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Comprehensive term-based attendance analysis and reporting
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-gray-500">
              {selectedGrade && selectedStream ? `${grades.find(g => g._id === selectedGrade)?.name} - ${streams.find(s => s._id === selectedStream)?.name}` : "Select Class"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {attendanceSummary.totalBoys > 0 || attendanceSummary.totalGirls > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {attendanceSummary.totalBoys + attendanceSummary.totalGirls}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Attendance</p>
                <p className="text-2xl font-bold text-green-600">
                  {attendanceSummary.totalCumulativeBoys + attendanceSummary.totalCumulativeGirls}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sessions</p>
                <p className="text-2xl font-bold text-orange-600">
                  {attendanceSummary.totalSessions}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <Percent className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {attendanceSummary.classAttendancePercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Panel - Filters */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Report Filters
            </h3>
            
            <div className="space-y-4">
              <div>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grade
                </FormLabel>
                <FormSelect
                  value={selectedGrade}
                  onChange={(e) => handleGradeChange(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select Grade</option>
                  {grades.map((grade) => (
                    <option key={grade._id} value={grade._id}>
                      {grade.name}
                    </option>
                  ))}
                </FormSelect>
              </div>

              <div>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stream
                </FormLabel>
                <FormSelect
                  value={selectedStream}
                  onChange={(e) => setSelectedStream(e.target.value)}
                  disabled={!selectedGrade}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50"
                >
                  <option value="">Select Stream</option>
                  {streams.map((stream) => (
                    <option key={stream._id} value={stream._id}>
                      {stream.name}
                    </option>
                  ))}
                </FormSelect>
              </div>

              <div>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Month
                </FormLabel>
                <FormSelect
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </FormSelect>
              </div>

              <div>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Year
                </FormLabel>
                <FormSelect
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = CURRENT_DATE.getFullYear() - 2 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </FormSelect>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={generateReport}
                disabled={loading || !selectedStream || (attendanceSummary.totalBoys === 0 && attendanceSummary.totalGirls === 0)}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Summary Display */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Termly Attendance Summary
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedMonth && selectedYear ? `${new Date(selectedYear, selectedMonth - 1).toLocaleString("default", { month: "long" })} ${selectedYear}` : "Select filters to view summary"}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <LoadingIcon icon="spinning-circles" className="w-12 h-12 text-primary" />
                  <p className="text-gray-600 dark:text-gray-400 mt-4">
                    Loading attendance summary...
                  </p>
                </div>
              ) : (attendanceSummary.totalBoys > 0 || attendanceSummary.totalGirls > 0) ? (
                <div className="space-y-6">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                            Boys Attendance
                          </h4>
                          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                            {attendanceSummary.totalCumulativeBoys}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            Total cumulative attendance
                          </p>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-lg">
                          <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-xl p-6 border border-pink-200 dark:border-pink-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-pink-900 dark:text-pink-100">
                            Girls Attendance
                          </h4>
                          <p className="text-3xl font-bold text-pink-600 dark:text-pink-400 mt-2">
                            {attendanceSummary.totalCumulativeGirls}
                          </p>
                          <p className="text-sm text-pink-600 dark:text-pink-400 mt-1">
                            Total cumulative attendance
                          </p>
                        </div>
                        <div className="bg-pink-100 dark:bg-pink-800 p-3 rounded-lg">
                          <Users className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Summary Table */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Detailed Summary
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                              Metric
                            </th>
                            <th className="px-6 py-3 text-right text-sm font-semibold">
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                              Total Boys
                            </td>
                            <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                              {attendanceSummary.totalBoys}
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                              Total Girls
                            </td>
                            <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                              {attendanceSummary.totalGirls}
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                              Total Attendance
                            </td>
                            <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                              {attendanceSummary.totalCumulativeBoys + attendanceSummary.totalCumulativeGirls}
                            </td>
                          </tr>
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                              Total Sessions
                            </td>
                            <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                              {attendanceSummary.totalSessions}
                            </td>
                          </tr>
                          <tr className="bg-primary/10 hover:bg-primary/20">
                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                              Class Attendance Rate
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-primary">
                              {attendanceSummary.classAttendancePercentage}%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Attendance Insights */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
                    <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Attendance Insights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 dark:text-green-300">Average Daily Attendance:</span>
                        <span className="font-semibold text-green-900 dark:text-green-100">
                          {attendanceSummary.totalSessions > 0 
                            ? Math.round((attendanceSummary.totalCumulativeBoys + attendanceSummary.totalCumulativeGirls) / attendanceSummary.totalSessions * 100) / 100
                            : 0} students
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 dark:text-green-300">Attendance Trend:</span>
                        <span className="font-semibold text-green-900 dark:text-green-100">
                          {parseFloat(attendanceSummary.classAttendancePercentage) > 80 ? "Excellent" : 
                           parseFloat(attendanceSummary.classAttendancePercentage) > 60 ? "Good" : 
                           parseFloat(attendanceSummary.classAttendancePercentage) > 40 ? "Fair" : "Needs Improvement"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Attendance Data
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {!selectedGrade || !selectedStream 
                      ? "Please select a grade and stream to view attendance summary"
                      : `No attendance data available for ${selectedMonth && selectedYear ? `${new Date(selectedYear, selectedMonth - 1).toLocaleString("default", { month: "long" })} ${selectedYear}` : "selected period"}`
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Notification
        options={{ duration: 3000 }}
        getRef={(el) => {
          notify.current = el;
        }}
        className="flex"
      >
        <Lucide
          icon={success ? "CheckCircle" : "XCircle"}
          className={success ? "text-success" : "text-danger"}
        />
        <div className="ml-4 mr-4">
          <div className="font-medium">{success ? "Success" : "Error"}</div>
          <div className="mt-1 text-slate-500">{message}</div>
        </div>
      </Notification>
    </>
  );
}

export default AttendanceTermlySummaryPage;
