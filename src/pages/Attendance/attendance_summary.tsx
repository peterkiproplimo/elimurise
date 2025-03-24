import { useState, useEffect, ChangeEvent } from "react";
import { FormLabel, FormSelect } from "../../base-components/Form";
import * as ApiService from "../../services/auth"; // Adjust import based on your service file
import { CheckCircle, XCircle } from "lucide-react";
import LoadingIcon from "../../base-components/LoadingIcon";
import jsPDF from "jspdf";
import "jspdf-autotable"; // For table support in jsPDF
import Button from "../../base-components/Button"; // Assuming a premium Button component

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

function AttendanceForm() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    CURRENT_DATE.getMonth() + 1
  ); // 1-based
  const [selectedYear, setSelectedYear] = useState<number>(
    CURRENT_DATE.getFullYear()
  );
  const [attendanceSummary, setAttendanceSummary] =
    useState<AttendanceSummary>(DEFAULT_SUMMARY);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getGrades();
  }, []);

  useEffect(() => {
    if (selectedStream) {
      fetchAttendanceSummary();
    }
  }, [selectedStream, selectedMonth, selectedYear]);

  const getGrades = async (): Promise<void> => {
    try {
      const response = await ApiService.getGrades({ page: 1 });
      setGrades(response.data as Grade[]);
    } catch (error) {
      console.error("Failed to fetch grades:", error);
    }
  };

  const getStreams = async (gradeId: string): Promise<void> => {
    try {
      const response = await ApiService.getStream({ page: 1, grade: gradeId });
      setStreams(response.data as Stream[]);
    } catch (error) {
      console.error("Failed to fetch streams:", error);
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
    } finally {
      setLoading(false);
    }
  };

  // Gender-based analysis function
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
    const doc = new jsPDF({ orientation: "landscape" });
    const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString(
      "default",
      { month: "long" }
    );

    // Premium Header
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(33, 37, 41); // Gray-800
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
        "Present: Afternoon",
        "",
        ...attendanceSummary.dailySummary.map((s) => s.presentAfternoon),
      ],
      [
        "",
        "Present: Morning",
        "",
        ...attendanceSummary.dailySummary.map((s) => s.presentMorning),
      ],
      [
        "",
        "Total",
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
        "Male: Morning",
        "",
        ...attendanceSummary.dailySummary.map(
          (s) => genderAnalysis.maleMorning[s.day] || 0
        ),
      ],
      [
        "",
        "Male: Afternoon",
        "",
        ...attendanceSummary.dailySummary.map(
          (s) => genderAnalysis.maleAfternoon[s.day] || 0
        ),
      ],
      [
        "",
        "Female: Morning",
        "",
        ...attendanceSummary.dailySummary.map(
          (s) => genderAnalysis.femaleMorning[s.day] || 0
        ),
      ],
      [
        "",
        "Female: Afternoon",
        "",
        ...attendanceSummary.dailySummary.map(
          (s) => genderAnalysis.femaleAfternoon[s.day] || 0
        ),
      ],
    ];

    // Premium Table Styling
    (doc as any).autoTable({
      head: [headers],
      body: [...body, ...summaryRows, ...genderRows],
      startY: 30,
      theme: "striped",
      headStyles: {
        fillColor: [34, 197, 94], // Green-500
        textColor: [255, 255, 255],
        fontSize: 11,
        halign: "center",
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 10,
        halign: "center",
        textColor: [55, 65, 81], // Gray-700
      },
      alternateRowStyles: {
        fillColor: [243, 244, 246], // Gray-100
      },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128); // Gray-500
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, finalY + 10);

    doc.save(`attendance-summary-${monthName}-${selectedYear}.pdf`);
  };

  const printReport = (): void => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-darkmode-900 dark:to-darkmode-800 p-6 xl:p-8">
      <div className="max-w-7xl mx-auto bg-white dark:bg-darkmode-700 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
            Attendance Summary
            <CheckCircle className="ml-2 w-6 h-6 text-green-500" />
          </h2>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div>
              <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Grade
              </FormLabel>
              <FormSelect
                value={selectedGrade}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  setSelectedGrade(e.target.value);
                  getStreams(e.target.value);
                  setSelectedStream("");
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
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedStream(e.target.value)
                }
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
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedMonth(Number(e.target.value))
                }
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

          {/* Attendance Table */}
          <div className="bg-gray-50 dark:bg-darkmode-600 rounded-xl p-6 shadow-inner">
            {loading ? (
              <div className="flex justify-center">
                <LoadingIcon
                  icon="spinning-circles"
                  className="w-8 h-8 text-gray-500"
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
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
                  <tbody className="text-gray-700 dark:text-gray-300">
                    {attendanceSummary.learnersData.length > 0 ? (
                      <>
                        {attendanceSummary.learnersData.map((entry, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-100 dark:hover:bg-darkmode-500"
                          >
                            <td className="px-4 py-3">{index + 1}</td>
                            <td className="px-4 py-3">{entry.learnerName}</td>
                            <td className="px-4 py-3">
                              {entry.gender.charAt(0)}
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
                                  <span className="text-gray-500">
                                    {getAttendanceStatus(
                                      attend.morning,
                                      attend.afternoon
                                    )}
                                  </span>
                                )}
                                {(!attend.morning || !attend.afternoon) && (
                                  <div className="absolute z-10 left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-md">
                                    {attend.morning_reason ||
                                      attend.afternoon_reason ||
                                      "No reason provided"}
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                        {(() => {
                          const genderAnalysis = getGenderAnalysis();
                          return (
                            <>
                              <tr className="font-medium">
                                <td className="px-4 py-3" colSpan={3}>
                                  Boys: Morning
                                </td>
                                {attendanceSummary.dailySummary.map(
                                  (summary, index) => (
                                    <td
                                      key={index}
                                      className="px-4 py-3 text-center"
                                    >
                                      {genderAnalysis.maleMorning[
                                        summary.day
                                      ] || 0}
                                    </td>
                                  )
                                )}
                              </tr>
                              <tr className="bg-gray-100 dark:bg-darkmode-500 font-medium">
                                <td className="px-4 py-3" colSpan={3}>
                                  Boys: Afternoon
                                </td>
                                {attendanceSummary.dailySummary.map(
                                  (summary, index) => (
                                    <td
                                      key={index}
                                      className="px-4 py-3 text-center"
                                    >
                                      {genderAnalysis.maleAfternoon[
                                        summary.day
                                      ] || 0}
                                    </td>
                                  )
                                )}
                              </tr>
                              <tr className="font-medium">
                                <td className="px-4 py-3" colSpan={3}>
                                  Girls: Morning
                                </td>
                                {attendanceSummary.dailySummary.map(
                                  (summary, index) => (
                                    <td
                                      key={index}
                                      className="px-4 py-3 text-center"
                                    >
                                      {genderAnalysis.femaleMorning[
                                        summary.day
                                      ] || 0}
                                    </td>
                                  )
                                )}
                              </tr>
                              <tr className="bg-gray-100 dark:bg-darkmode-500 font-medium">
                                <td className="px-4 py-3" colSpan={3}>
                                  Girls: Afternoon
                                </td>
                                {attendanceSummary.dailySummary.map(
                                  (summary, index) => (
                                    <td
                                      key={index}
                                      className="px-4 py-3 text-center"
                                    >
                                      {genderAnalysis.femaleAfternoon[
                                        summary.day
                                      ] || 0}
                                    </td>
                                  )
                                )}
                              </tr>
                            </>
                          );
                        })()}
                        <tr className="bg-gray-100 dark:bg-darkmode-500 font-medium">
                          <td className="px-4 py-3" colSpan={3}>
                            Present Total: Afternoon
                          </td>
                          {attendanceSummary.dailySummary.map(
                            (summary, index) => (
                              <td key={index} className="px-4 py-3 text-center">
                                {summary.presentAfternoon}
                              </td>
                            )
                          )}
                        </tr>
                        <tr className="font-medium">
                          <td className="px-4 py-3" colSpan={3}>
                            Present Total: Morning
                          </td>
                          {attendanceSummary.dailySummary.map(
                            (summary, index) => (
                              <td key={index} className="px-4 py-3 text-center">
                                {summary.presentMorning}
                              </td>
                            )
                          )}
                        </tr>
                        <tr className="bg-gray-100 dark:bg-darkmode-500 font-medium">
                          <td className="px-4 py-3" colSpan={3}>
                            Total
                          </td>
                          {attendanceSummary.dailySummary.map(
                            (summary, index) => (
                              <td key={index} className="px-4 py-3 text-center">
                                {summary.presentMorning +
                                  summary.presentAfternoon}
                              </td>
                            )
                          )}
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td
                          colSpan={
                            (attendanceSummary.learnersData[0]?.attendance
                              ?.length || 0) + 3
                          }
                          className="py-4 text-center text-gray-500 dark:text-gray-400"
                        >
                          No attendance data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-4">
                  <Button
                    variant="primary"
                    onClick={exportToPDF}
                    disabled={loading || !selectedStream}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200"
                  >
                    Export to PDF
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={printReport}
                    disabled={loading || !selectedStream}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200"
                  >
                    Print
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
