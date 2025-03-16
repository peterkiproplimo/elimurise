import { useState, useEffect } from "react";
import { FormLabel, FormSelect } from "../../base-components/Form";
import * as ApiService from "../../services/auth";
import LoadingIcon from "../../base-components/LoadingIcon";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table support in jsPDF
import Button from "../../base-components/Button"; // Assuming a premium Button component

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

function AttendanceForm() {
  const [grades, setGrades] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    CURRENT_DATE.getMonth() + 1
  ); // 1-based month
  const [selectedYear, setSelectedYear] = useState(CURRENT_DATE.getFullYear());
  const [attendanceSummary, setAttendanceSummary] = useState(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState(false);

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
    }
  };

  const getStreams = async (gradeId: string) => {
    try {
      const response = await ApiService.getStream({ page: 1, grade: gradeId });
      setStreams(response.data);
    } catch (error) {
      console.error("Failed to fetch streams:", error);
    }
  };

  const fetchAttendanceSummary = async () => {
    if (!selectedGrade || !selectedStream) return;

    setLoading(true);
    try {
      const response = await ApiService.getAttendanceMonthlyAnalysis({
        year: selectedYear.toString(),
        month: selectedMonth.toString().padStart(2, "0"), // Ensure 2 digits
        stream: selectedStream,
      });
      setAttendanceSummary(response?.summary || DEFAULT_SUMMARY);
    } catch (error) {
      console.error("Failed to fetch attendance summary:", error);
      setAttendanceSummary(DEFAULT_SUMMARY);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const summary = attendanceSummary;

    // Premium header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41); // Gray-800
    doc.text("Attendance Summary Report", 14, 20);

    // Subtitle with month and year
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128); // Gray-500
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
      // ["Boys Attendance", `${summary.boysAttendancePercentage}%`],
      // ["Girls Attendance", `${summary.girlsAttendancePercentage}%`],
      ["Total Sessions", summary.totalSessions],
      ["Class Attendance", `${summary.classAttendancePercentage}%`],
    ];

    // Premium table styling
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "striped",
      headStyles: {
        fillColor: [34, 197, 94], // Green-500
        textColor: [255, 255, 255],
        fontSize: 12,
        halign: "center",
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 11,
        halign: "center",
        textColor: [55, 65, 81], // Gray-700
      },
      alternateRowStyles: {
        fillColor: [243, 244, 246], // Gray-100
      },
      margin: { top: 40 },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, finalY + 10);

    doc.save(`attendance-summary-${selectedYear}-${selectedMonth}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-darkmode-900 dark:to-darkmode-800 p-6 xl:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-darkmode-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Attendance Summary
          </h2>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div>
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Grade
              </FormLabel>
              <FormSelect
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  getStreams(e.target.value);
                  setSelectedStream(""); // Reset stream when grade changes
                }}
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-darkmode-600 border border-gray-300 dark:border-darkmode-500 rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200"
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
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stream
              </FormLabel>
              <FormSelect
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-darkmode-600 border border-gray-300 dark:border-darkmode-500 rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200"
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
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Month
              </FormLabel>
              <FormSelect
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-darkmode-600 border border-gray-300 dark:border-darkmode-500 rounded-lg focus:ring-2 focus:ring-green-500 transition-all duration-200"
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
          </div>

          {/* Summary Display */}
          <div className="bg-gray-50 dark:bg-darkmode-600 rounded-xl p-6 shadow-inner">
            {loading ? (
              <div className="flex justify-center">
                <LoadingIcon
                  icon="spinning-circles"
                  className="w-8 h-8 text-gray-500"
                />
              </div>
            ) : (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                        <th
                          className="px-6 py-3 text-left text-sm font-semibold"
                          colSpan={2}
                        >
                          Termly Attendance Summary
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-300">
                      <tr className="bg-gray-100 dark:bg-darkmode-500">
                        <td className="px-6 py-4 font-medium">
                          Boys Attendance
                        </td>
                        <td className="px-6 py-4">
                          {attendanceSummary.totalCumulativeBoys}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">
                          Girls Attendance
                        </td>
                        <td className="px-6 py-4">
                          {attendanceSummary.totalCumulativeGirls}
                        </td>
                      </tr>
                      <tr className="bg-gray-100 dark:bg-darkmode-500">
                        <td className="px-6 py-4 font-medium">
                          Total Attendance
                        </td>
                        <td className="px-6 py-4">
                          {attendanceSummary.totalCumulativeBoys +
                            attendanceSummary.totalCumulativeGirls}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">
                          Total Sessions
                        </td>
                        <td className="px-6 py-4">
                          {attendanceSummary.totalSessions}
                        </td>
                      </tr>
                      {/* <tr className="bg-gray-100 dark:bg-darkmode-500">
                        <td className="px-6 py-4 font-medium">
                          Boys Attendance %
                        </td>
                        <td className="px-6 py-4">
                          {attendanceSummary.boysAttendancePercentage}%
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">
                          Girls Attendance %
                        </td>
                        <td className="px-6 py-4">
                          {attendanceSummary.girlsAttendancePercentage}%
                        </td>
                      </tr> */}
                      <tr className="bg-gray-100 dark:bg-darkmode-500">
                        <td className="px-6 py-4 font-medium">
                          Class Attendance %
                        </td>
                        <td className="px-6 py-4">
                          {attendanceSummary.classAttendancePercentage}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Generate Report Button */}
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={generateReport}
                    disabled={loading || !selectedStream}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200"
                  >
                    Generate Report
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceForm;
