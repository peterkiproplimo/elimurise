import { useState, useEffect } from "react";
import { FormLabel, FormSelect } from "../../base-components/Form";
import * as ApiService from "../../services/auth";
import LoadingIcon from "../../base-components/LoadingIcon";
import jsPDF from "jspdf"; // Import jsPDF for PDF generation

function AttendanceForm() {
  const [grades, setGrades] = useState([]);
  const [streams, setStreams] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [attendanceSummary, setAttendanceSummary] = useState<any>({
    totalBoys: 0,
    totalGirls: 0,
    totalCumulativeBoys: 0,
    totalCumulativeGirls: 0,
    boysAttendancePercentage: "0.00",
    girlsAttendancePercentage: "0.00",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getGrades();
  }, []);

  useEffect(() => {
    if (selectedStream) {
      fetchAttendanceSummary();
    }
  }, [selectedStream]);

  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });
    setGrades(response.data);
  };

  const getStreams = async (gradeId: any) => {
    const response = await ApiService.getStream({ page: 1, grade: gradeId });
    setStreams(response.data);
  };

  const fetchAttendanceSummary = async () => {
    if (!selectedGrade || !selectedStream) return;

    setLoading(true);
    const response = await ApiService.getAttendanceMonthlyAnalysis({
      year: "2025",
      month: "2", // Adjust dynamically
      stream: selectedStream,
    });
    console.log(response);
    setAttendanceSummary(response?.summary); // Update with the summary data
    setLoading(false);
  };

  // Function to handle PDF export for printing and filing
  const generateReport = () => {
    const doc = new jsPDF() as any;
    const summary = attendanceSummary;

    doc.setFontSize(18);
    doc.text("Attendance Summary Report", 14, 16);

    // Add summary details with table
    doc.setFontSize(12);

    // Create table header
    const tableColumn = ["Metric", "Value"];
    const tableRows = [
      ["Total Boys", summary.totalBoys],
      ["Total Girls", summary.totalGirls],
      ["Cumulative Boys", summary.totalCumulativeBoys],
      ["Cumulative Girls", summary.totalCumulativeGirls],
      ["Boys Attendance", `${summary.boysAttendancePercentage}%`],
      ["Girls Attendance", `${summary.girlsAttendancePercentage}%`],
    ];
    // Table styles
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontSize: 12,
        halign: "center",
      },
      bodyStyles: {
        fontSize: 12,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });
    const autoTableOutput = (doc as any).lastAutoTable;

    // Footer with date and time
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Generated on: ${currentDate}`, 14, autoTableOutput.finalY + 10);

    // Save the PDF file
    doc.save("attendance-summary-report.pdf");
  };

  return (
    <div className="w-full">
      <div className="w-full p-4">
        <h2 className="text-2xl font-bold text-gray-800">Attendance Summary</h2>

        {/* Grade and Stream Selection */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <FormLabel className="block text-sm font-medium text-gray-700">
              Grade
            </FormLabel>
            <FormSelect
              value={selectedGrade}
              onChange={(e) => {
                setSelectedGrade(e.target.value);
                getStreams(e.target.value);
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Grade</option>
              {grades.map((grade: any) => (
                <option key={grade._id} value={grade._id}>
                  {grade.name}
                </option>
              ))}
            </FormSelect>
          </div>

          <div>
            <FormLabel className="block text-sm font-medium text-gray-700">
              Stream
            </FormLabel>
            <FormSelect
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Stream</option>
              {streams.map((stream: any) => (
                <option key={stream._id} value={stream._id}>
                  {stream.name}
                </option>
              ))}
            </FormSelect>
          </div>
        </div>

        {/* Attendance Summary Table Display */}
        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center">
              <LoadingIcon
                icon="spinning-circles"
                color="gray"
                className="w-6 h-6"
              />
            </div>
          ) : (
            <div>
              {/* Table displaying attendance summary */}
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-teal-600 text-white">
                      <th className="px-4 py-2 border" colSpan={2}>
                        Termly Summary
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-100">
                      <th className="px-4 py-2 border" colSpan={2}>
                        Attendance
                      </th>
                    </tr>
                    <tr className="hover:bg-gray-100">
                      <td className="px-4 py-2 border"> Boys</td>
                      <td className="px-4 py-2 border">
                        {attendanceSummary.totalCumulativeBoys}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100">
                      <td className="px-4 py-2 border"> Girls</td>
                      <td className="px-4 py-2 border">
                        {attendanceSummary.totalCumulativeGirls}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">
                        {" "}
                        <b>Total</b>
                      </td>
                      <td className="px-4 py-2 border">
                        {attendanceSummary.totalCumulativeGirls +
                          attendanceSummary.totalCumulativeBoys}
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">Total Sessions</td>
                      <td className="px-4 py-2 border">
                        {attendanceSummary?.totalSessions}
                      </td>
                    </tr>

                    <tr className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">Boys Attendance</td>
                      <td className="px-4 py-2 border">
                        {attendanceSummary.boysAttendancePercentage}%
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">
                        Percentage of Averange Attendance
                      </td>
                      <td className="px-4 py-2 border">
                        {attendanceSummary?.classAttendancePercentage}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Report Generation Button */}
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={generateReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Generate Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceForm;
