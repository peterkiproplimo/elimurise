import { useState, useEffect } from "react";
import { FormLabel, FormSelect } from "../../base-components/Form";
import * as ApiService from "../../services/auth";
import { CheckCircle, XCircle } from "lucide-react"; // Import Lucide icons
import LoadingIcon from "../../base-components/LoadingIcon";
import jsPDF from "jspdf"; // Import jsPDF for PDF generation

function AttendanceForm() {
  const [grades, setGrades] = useState([]);
  const [streams, setStreams] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [attendanceSummary, setAttendanceSummary] = useState({
    learnersData: [],
    dailySummary: [],
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

  const getStreams = async (gradeId) => {
    const response = await ApiService.getStream({ page: 1, grade: gradeId });
    setStreams(response.data);
  };

  const fetchAttendanceSummary = async () => {
    if (!selectedGrade || !selectedStream) return;

    setLoading(true);
    const response = await ApiService.getAttendanceMonthlySummary({
      year: "2025",
      month: "2", // Change this as needed for dynamic month/year
      stream: selectedStream,
    });

    // Process attendance data for learners
    const learnersData = response?.data?.attendanceSummary.map(
      (learnerData) => {
        const learnerName = `${learnerData.learner.first_name} ${learnerData.learner.last_name}`;
        const attendanceDates = Object.keys(learnerData.attendance);
        return {
          learnerName,
          gender: learnerData.learner.gender,
          attendance: attendanceDates.map((date) => ({
            date,
            morning: learnerData.attendance[date].morning,
            afternoon: learnerData.attendance[date].afternoon,
            day: date,
          })),
        };
      }
    );

    // Process daily attendance summary
    const dailySummary = Object.keys(response?.data?.dailyAttendance || {}).map(
      (day) => {
        const dayData = response.data.dailyAttendance[day];
        return {
          day,
          presentMorning: dayData.presentMorning,
          presentAfternoon: dayData.presentAfternoon,
          absentMorning: dayData.absentMorning,
          absentAfternoon: dayData.absentAfternoon,
        };
      }
    );

    setAttendanceSummary({ learnersData, dailySummary });
    setLoading(false);
  };

  // Function to handle PDF export
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Attendance Summary", 14, 16);

    // Add table headers
    let yOffset = 20;
    doc.setFontSize(12);
    doc.text("#", 14, yOffset);
    doc.text("Learner", 30, yOffset);
    attendanceSummary.learnersData[0]?.attendance.forEach((entry, idx) => {
      doc.text(entry.day, 50 + idx * 30, yOffset);
    });
    yOffset += 10;

    // Add table content
    attendanceSummary.learnersData.forEach((entry, index) => {
      doc.text((index + 1).toString(), 14, yOffset);
      doc.text(entry.learnerName, 30, yOffset);
      entry.attendance.forEach((attend, idx) => {
        const status =
          attend.morning && attend.afternoon
            ? "X"
            : !attend.morning && !attend.afternoon
            ? "oo"
            : attend.morning && !attend.afternoon
            ? "/o"
            : "o/";

        doc.text(status, 50 + idx * 30, yOffset);
      });
      yOffset += 10;
    });

    // Save the PDF
    doc.save("attendance-summary.pdf");
  };

  // Function to handle printing
  const printReport = () => {
    window.print();
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
              {grades.map((grade) => (
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
              {streams.map((stream) => (
                <option key={stream._id} value={stream._id}>
                  {stream.name}
                </option>
              ))}
            </FormSelect>
          </div>
        </div>

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
            <div className="">
              <table className="w-full table-auto border border-gray-300 bg-white">
                <thead>
                  <tr>
                    <th className="border border-gray-300 text-left p-2">#</th>
                    <th className="border border-gray-300 text-left p-2">
                      Learner
                    </th>
                    <th className="border border-gray-300 text-left p-2">
                      Gender
                    </th>

                    {attendanceSummary.learnersData.length > 0 &&
                      attendanceSummary.learnersData[0].attendance.map(
                        (entry) => (
                          <th
                            key={entry.date}
                            className="border border-gray-300 text-center p-2"
                          >
                            {entry.day}
                          </th>
                        )
                      )}
                  </tr>
                </thead>
                <tbody>
                  {attendanceSummary.learnersData.length > 0 ? (
                    <>
                      {attendanceSummary.learnersData.map((entry, index) => (
                        <>
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">
                              {index + 1}
                            </td>

                            <td className="border border-gray-300 p-2">
                              {entry.learnerName}
                            </td>
                            <td className="border border-gray-300 p-2">
                              {entry.gender.charAt(0)}
                            </td>

                            {entry.attendance.map((attend, idx) => (
                              <td
                                key={idx}
                                className="border border-gray-300 text-center p-2"
                              >
                                {attend.morning && attend.afternoon ? (
                                  <span className="text-black-500">X</span>
                                ) : !attend.morning && !attend.afternoon ? (
                                  <span className="text-black-500">oo</span>
                                ) : attend.morning && !attend.afternoon ? (
                                  <span className="text-black-500">/o</span>
                                ) : (
                                  <span className="text-black-500">o/</span>
                                )}
                              </td>
                            ))}
                          </tr>
                        </>
                      ))}
                      <tr>
                        <td className="border border-gray-300 p-2"></td>
                        <td className="border border-gray-300 p-2" colSpan="2">
                          <b>Present: Afternoon</b>
                        </td>
                        {attendanceSummary.dailySummary.map(
                          (summary, index) => (
                            <td
                              key={index}
                              className="border border-gray-300 text-center p-2"
                            >
                              <b> {summary.presentAfternoon}</b>
                            </td>
                          )
                        )}
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2"></td>
                        <td className="border border-gray-300 p-2" colSpan="2">
                          <b>Present: Morning</b>
                        </td>
                        {attendanceSummary.dailySummary.map(
                          (summary, index) => (
                            <td
                              key={index}
                              className="border border-gray-300 text-center p-2"
                            >
                              <b> {summary.presentMorning}</b>
                            </td>
                          )
                        )}
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2"></td>
                        <td className="border border-gray-300 p-2" colSpan="2">
                          <b>Total</b>
                        </td>
                        {attendanceSummary.dailySummary.map(
                          (summary, index) => (
                            <td
                              key={index}
                              className="border border-gray-300 text-center p-2"
                            >
                              <b>
                                {summary.presentMorning +
                                  summary.presentAfternoon}
                              </b>
                            </td>
                          )
                        )}
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td
                        colSpan={attendanceSummary.learnersData.length + 1} // Adjust the colspan based on the number of attendance entries
                        className="py-4 text-center text-gray-500"
                      >
                        No attendance data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Export Buttons */}
              <div className="mt-4 flex justify-end gap-4">
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Export to PDF
                </button>
                <button
                  onClick={printReport}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Print
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
