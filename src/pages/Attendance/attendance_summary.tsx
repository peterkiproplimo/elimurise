import { useState, useEffect, ChangeEvent, useRef } from "react";
import { FormLabel, FormSelect } from "../../base-components/Form";
import * as ApiService from "../../services/auth";
import { CheckCircle, XCircle, Users, Calendar, Download, Printer, TrendingUp, BarChart3, FileText, Eye } from "lucide-react";
import LoadingIcon from "../../base-components/LoadingIcon";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import Notification, { NotificationElement } from "../../base-components/Notification";

// Constants
const CURRENT_DATE = new Date();
const DEFAULT_SUMMARY: AttendanceSummary = {
  learnersData: [],
  dailySummary: [],
};

// Interfaces
interface Grade {
  _id: string;
  name: string;
}

interface Stream {
  _id: string;
  name: string;
}

interface AttendanceData {
  date: string;
  morning: boolean;
  morning_reason: string | null;
  afternoon: boolean;
  afternoon_reason: string | null;
  day: string;
}

interface LearnerData {
  learnerName: string;
  gender: string;
  attendance: AttendanceData[];
}

interface DailySummary {
  day: string;
  presentMorning: number;
  presentAfternoon: number;
  absentMorning: number;
  absentAfternoon: number;
}

interface AttendanceSummary {
  learnersData: LearnerData[];
  dailySummary: DailySummary[];
}

interface GenderAnalysis {
  maleMorning: { [day: string]: number };
  femaleMorning: { [day: string]: number };
  maleAfternoon: { [day: string]: number };
  femaleAfternoon: { [day: string]: number };
}

// Utility to format attendance status
const getAttendanceStatus = (morning: boolean, afternoon: boolean): string => {
  return morning && afternoon
    ? "X"
    : !morning && !afternoon
    ? "oo"
    : morning
    ? "/o"
    : "o/";
};

function AttendanceSummaryPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    CURRENT_DATE.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    CURRENT_DATE.getFullYear()
  );
  const [attendanceSummary, setAttendanceSummary] =
    useState<AttendanceSummary>(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalPresent: 0,
    totalAbsent: 0,
    attendanceRate: 0,
    averageDailyAttendance: 0
  });

  const notify = useRef<NotificationElement>();

  useEffect(() => {
    getGrades();
  }, []);

  useEffect(() => {
    if (selectedStream) {
      fetchAttendanceSummary();
    }
  }, [selectedStream, selectedMonth, selectedYear]);

  useEffect(() => {
    calculateStats();
  }, [attendanceSummary]);

  const getGrades = async (): Promise<void> => {
    try {
      const response = await ApiService.getGrades({ page: 1 });
      setGrades(response.data as Grade[]);
    } catch (error) {
      console.error("Failed to fetch grades:", error);
      setSuccess(false);
      setMessage("Failed to fetch grades");
      notify.current?.showToast();
    }
  };

  const getStreams = async (gradeId: string): Promise<void> => {
    try {
      const response = await ApiService.getStream({ page: 1, grade: gradeId });
      setStreams(response.data as Stream[]);
    } catch (error) {
      console.error("Failed to fetch streams:", error);
      setSuccess(false);
      setMessage("Failed to fetch streams");
      notify.current?.showToast();
    }
  };

  const fetchAttendanceSummary = async (): Promise<void> => {
    if (!selectedGrade || !selectedStream) return;

    setLoading(true);
    try {
      const response = await ApiService.getAttendanceMonthlySummary({
        year: selectedYear.toString(),
        month: selectedMonth.toString().padStart(2, "0"),
        stream: selectedStream,
      });

      const learnersData: LearnerData[] =
        response?.data?.attendanceSummary.map((learnerData: any) => {
          const learnerName = `${learnerData.learner.first_name} ${learnerData.learner.last_name}`;
          const attendanceDates = Object.keys(learnerData.attendance);
          return {
            learnerName,
            gender: learnerData.learner.gender,
            attendance: attendanceDates.map((date) => ({
              date,
              morning: learnerData.attendance[date].morning,
              morning_reason: learnerData.attendance[date].morning_reason,
              afternoon_reason: learnerData.attendance[date].afternoon_reason,
              afternoon: learnerData.attendance[date].afternoon,
              day: date,
            })),
          };
        }) || [];

      const dailySummary: DailySummary[] = Object.keys(
        response?.data?.dailyAttendance || {}
      ).map((day) => {
        const dayData = response.data.dailyAttendance[day];
        return {
          day,
          presentMorning: dayData.presentMorning,
          presentAfternoon: dayData.presentAfternoon,
          absentMorning: dayData.absentMorning,
          absentAfternoon: dayData.absentAfternoon,
        };
      });

      setAttendanceSummary({ learnersData, dailySummary });
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

  const calculateStats = () => {
    if (!attendanceSummary.learnersData.length) {
      setStats({
        totalStudents: 0,
        totalPresent: 0,
        totalAbsent: 0,
        attendanceRate: 0,
        averageDailyAttendance: 0
      });
      return;
    }

    const totalStudents = attendanceSummary.learnersData.length;
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalSessions = 0;

    attendanceSummary.learnersData.forEach(learner => {
      learner.attendance.forEach(attend => {
        totalSessions += 2; // Morning and afternoon
        if (attend.morning) totalPresent++;
        else totalAbsent++;
        if (attend.afternoon) totalPresent++;
        else totalAbsent++;
      });
    });

    const attendanceRate = totalSessions > 0 ? (totalPresent / totalSessions) * 100 : 0;
    const averageDailyAttendance = attendanceSummary.dailySummary.length > 0 
      ? attendanceSummary.dailySummary.reduce((sum, day) => sum + day.presentMorning + day.presentAfternoon, 0) / attendanceSummary.dailySummary.length
      : 0;

    setStats({
      totalStudents,
      totalPresent,
      totalAbsent,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      averageDailyAttendance: Math.round(averageDailyAttendance * 100) / 100
    });
  };

  const getGenderAnalysis = (): GenderAnalysis => {
    const analysis: GenderAnalysis = {
      maleMorning: {},
      femaleMorning: {},
      maleAfternoon: {},
      femaleAfternoon: {},
    };

    attendanceSummary.learnersData.forEach((learner) => {
      learner.attendance.forEach((attend) => {
        const day = attend.day;
        if (learner.gender.toLowerCase() === "male") {
          analysis.maleMorning[day] =
            (analysis.maleMorning[day] || 0) + (attend.morning ? 1 : 0);
          analysis.maleAfternoon[day] =
            (analysis.maleAfternoon[day] || 0) + (attend.afternoon ? 1 : 0);
        } else if (learner.gender.toLowerCase() === "female") {
          analysis.femaleMorning[day] =
            (analysis.femaleMorning[day] || 0) + (attend.morning ? 1 : 0);
          analysis.femaleAfternoon[day] =
            (analysis.femaleAfternoon[day] || 0) + (attend.afternoon ? 1 : 0);
        }
      });
    });

    return analysis;
  };

  const exportToPDF = (): void => {
    try {
    const doc = new jsPDF({ orientation: "landscape" });
    const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString(
      "default",
      { month: "long" }
    );

      // Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
      doc.setTextColor(33, 37, 41);
    doc.text(`Attendance Summary - ${monthName} ${selectedYear}`, 14, 20);

    // Table Headers
    const headers: string[] = [
      "#",
      "Learner",
      "Gender",
      ...(attendanceSummary.learnersData[0]?.attendance.map((e) => e.day) ||
        []),
    ];
    const body: (string | number)[][] = attendanceSummary.learnersData.map(
      (entry, index) => [
        index + 1,
        entry.learnerName,
        entry.gender.charAt(0),
        ...entry.attendance.map((attend) =>
          getAttendanceStatus(attend.morning, attend.afternoon)
        ),
      ]
    );

    // Summary Rows
    const summaryRows: (string | number)[][] = [
      [
        "",
        "Total Learners Present Afternoon",
        "",
        ...attendanceSummary.dailySummary.map((s) => s.presentAfternoon),
      ],
      [
        "",
          "Total Learners Present Morning",
        "",
        ...attendanceSummary.dailySummary.map((s) => s.presentMorning),
      ],
      [
        "",
        "Total Attendance",
        "",
        ...attendanceSummary.dailySummary.map(
          (s) => s.presentMorning + s.presentAfternoon
        ),
      ],
    ];

    // Gender Analysis Rows
    const genderAnalysis = getGenderAnalysis();
    const genderRows: (string | number)[][] = [
      [
        "",
        "Boys present Morning",
        "",
        ...attendanceSummary.dailySummary.map(
          (s) => genderAnalysis.maleMorning[s.day] || 0
        ),
      ],
      [
        "",
        "Boys present Afternoon",
        "",
        ...attendanceSummary.dailySummary.map(
          (s) => genderAnalysis.maleAfternoon[s.day] || 0
        ),
      ],
      [
        "",
        "Girls present Morning",
        "",
        ...attendanceSummary.dailySummary.map(
          (s) => genderAnalysis.femaleMorning[s.day] || 0
        ),
      ],
      [
        "",
        "Girls present Afternoon",
        "",
        ...attendanceSummary.dailySummary.map(
          (s) => genderAnalysis.femaleAfternoon[s.day] || 0
        ),
      ],
    ];

      // Table Styling
    (doc as any).autoTable({
      head: [headers],
      body: [...body, ...genderRows, ...summaryRows],
      startY: 30,
      theme: "striped",
      headStyles: {
          fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontSize: 11,
        halign: "center",
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 10,
        halign: "center",
          textColor: [55, 65, 81],
      },
      alternateRowStyles: {
          fillColor: [243, 244, 246],
      },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, finalY + 10);

    doc.save(`attendance-summary-${monthName}-${selectedYear}.pdf`);
      
      setSuccess(true);
      setMessage("PDF exported successfully!");
      notify.current?.showToast();
    } catch (error) {
      setSuccess(false);
      setMessage("Failed to export PDF");
      notify.current?.showToast();
    }
  };

  const printReport = (): void => {
    try {
    window.print();
      setSuccess(true);
      setMessage("Print dialog opened successfully!");
      notify.current?.showToast();
    } catch (error) {
      setSuccess(false);
      setMessage("Failed to open print dialog");
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
              Attendance Summary Report
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Comprehensive monthly attendance analysis and reporting
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-500">
              {selectedGrade && selectedStream ? `${grades.find(g => g._id === selectedGrade)?.name} - ${streams.find(s => s._id === selectedStream)?.name}` : "Select Class"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {stats.totalStudents > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalPresent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalAbsent}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance Rate</p>
                <p className="text-2xl font-bold text-purple-600">{stats.attendanceRate}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Daily</p>
                <p className="text-2xl font-bold text-orange-600">{stats.averageDailyAttendance}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Panel - Filters */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Report Filters
            </h3>
            
            <div className="space-y-4">
            <div>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Grade
              </FormLabel>
              <FormSelect
                value={selectedGrade}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => handleGradeChange(e.target.value)}
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
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedStream(e.target.value)
                }
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
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedMonth(Number(e.target.value))
                }
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
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setSelectedYear(Number(e.target.value))
                  }
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

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <Button
                variant="primary"
                onClick={exportToPDF}
                disabled={loading || !selectedStream || !attendanceSummary.learnersData.length}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              
              <Button
                variant="outline-secondary"
                onClick={printReport}
                disabled={loading || !selectedStream || !attendanceSummary.learnersData.length}
                className="w-full"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Report
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Attendance Table */}
        <div className="xl:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Monthly Attendance Report
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedMonth && selectedYear ? `${new Date(selectedYear, selectedMonth - 1).toLocaleString("default", { month: "long" })} ${selectedYear}` : "Select filters to view report"}
                  </p>
          </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    Present
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <XCircle className="w-4 h-4 mr-1 text-red-500" />
                    Absent
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <LoadingIcon icon="spinning-circles" className="w-12 h-12 text-primary" />
                  <p className="text-gray-600 dark:text-gray-400 mt-4">
                    Loading attendance data...
                  </p>
                </div>
              ) : attendanceSummary.learnersData.length > 0 ? (
              <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-primary to-primary/80 text-white">
                      <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Learner
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">
                        Gender
                      </th>
                      {attendanceSummary.learnersData[0]?.attendance.map(
                        (entry) => (
                          <th
                            key={entry.date}
                            className="px-4 py-3 text-center text-sm font-semibold"
                          >
                            {entry.day}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {attendanceSummary.learnersData.map((entry, index) => (
                          <tr
                            key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {index + 1}
                          </td>
                            <td className="px-4 py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                <span className="text-xs font-semibold text-primary">
                                  {entry.learnerName.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {entry.learnerName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                            {entry.gender.charAt(0).toUpperCase()}
                            </td>
                            {entry.attendance.map((attend, idx) => (
                              <td
                                key={idx}
                                className="px-4 py-3 text-center relative group"
                              >
                                {attend.morning && attend.afternoon ? (
                                  <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                ) : !attend.morning && !attend.afternoon ? (
                                  <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                                ) : (
                                <span className="text-gray-500 text-sm">
                                    {getAttendanceStatus(
                                      attend.morning,
                                      attend.afternoon
                                    )}
                                  </span>
                                )}
                                {(!attend.morning || !attend.afternoon) && (
                                <div className="absolute z-10 left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-md whitespace-nowrap">
                                    {attend.morning_reason ||
                                      attend.afternoon_reason ||
                                      "No reason provided"}
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      
                      {/* Summary Rows */}
                        {(() => {
                          const genderAnalysis = getGenderAnalysis();
                          return (
                            <>
                            <tr className="bg-gray-100 dark:bg-gray-700 font-medium">
                                <td className="px-4 py-3" colSpan={3}>
                                  Boys present Morning
                                </td>
                                {attendanceSummary.dailySummary.map(
                                  (summary, index) => (
                                    <td
                                      key={index}
                                    className="px-4 py-3 text-center text-sm"
                                    >
                                      {genderAnalysis.maleMorning[
                                        summary.day
                                      ] || 0}
                                    </td>
                                  )
                                )}
                              </tr>
                            <tr className="font-medium">
                                <td className="px-4 py-3" colSpan={3}>
                                  Boys present Afternoon
                                </td>
                                {attendanceSummary.dailySummary.map(
                                  (summary, index) => (
                                    <td
                                      key={index}
                                    className="px-4 py-3 text-center text-sm"
                                    >
                                      {genderAnalysis.maleAfternoon[
                                        summary.day
                                      ] || 0}
                                    </td>
                                  )
                                )}
                              </tr>
                            <tr className="bg-gray-100 dark:bg-gray-700 font-medium">
                                <td className="px-4 py-3" colSpan={3}>
                                  Girls present Morning
                                </td>
                                {attendanceSummary.dailySummary.map(
                                  (summary, index) => (
                                    <td
                                      key={index}
                                    className="px-4 py-3 text-center text-sm"
                                    >
                                      {genderAnalysis.femaleMorning[
                                        summary.day
                                      ] || 0}
                                    </td>
                                  )
                                )}
                              </tr>
                            <tr className="font-medium">
                                <td className="px-4 py-3" colSpan={3}>
                                  Girls present Afternoon
                                </td>
                                {attendanceSummary.dailySummary.map(
                                  (summary, index) => (
                                    <td
                                      key={index}
                                    className="px-4 py-3 text-center text-sm"
                                    >
                                      {genderAnalysis.femaleAfternoon[
                                        summary.day
                                      ] || 0}
                                    </td>
                                  )
                                )}
                              </tr>
                            <tr className="bg-gray-100 dark:bg-gray-700 font-medium">
                          <td className="px-4 py-3" colSpan={3}>
                            Total Learners Present Afternoon
                          </td>
                          {attendanceSummary.dailySummary.map(
                            (summary, index) => (
                                  <td key={index} className="px-4 py-3 text-center text-sm">
                                {summary.presentAfternoon}
                              </td>
                            )
                          )}
                        </tr>
                        <tr className="font-medium">
                          <td className="px-4 py-3" colSpan={3}>
                            Total Learners Present Morning
                          </td>
                          {attendanceSummary.dailySummary.map(
                            (summary, index) => (
                                  <td key={index} className="px-4 py-3 text-center text-sm">
                                {summary.presentMorning}
                              </td>
                            )
                          )}
                        </tr>
                            <tr className="bg-primary/10 font-medium">
                          <td className="px-4 py-3" colSpan={3}>
                            Total Attendance
                          </td>
                          {attendanceSummary.dailySummary.map(
                            (summary, index) => (
                                  <td key={index} className="px-4 py-3 text-center text-sm font-bold">
                                {summary.presentMorning +
                                  summary.presentAfternoon}
                              </td>
                            )
                          )}
                        </tr>
                      </>
                        );
                      })()}
                  </tbody>
                </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Attendance Data
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                    {!selectedGrade || !selectedStream 
                      ? "Please select a grade and stream to view attendance data"
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

export default AttendanceSummaryPage;
