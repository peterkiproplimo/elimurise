import { useState, useEffect } from "react";
import Calendar from "../../components/Calendar/index";
import { FormLabel, FormSelect, FormInput } from "../../base-components/Form";
import * as ApiService from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import LoadingIcon from "../../base-components/LoadingIcon";
import Button from "../../base-components/Button";

function AttendanceForm() {
  const [grades, setGrades] = useState([]);
  const [streams, setStreams] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceList, setAttendanceList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<any>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getGrades();
    fetchAttendanceAnalysis();
  }, []);

  useEffect(() => {
    fetchAttendanceAnalysis();
  }, [selectedStream, selectedDate]); // Add selectedDate as a dependency

  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });
    setGrades(response.data);
  };

  const getStreams = async (gradeId: any) => {
    const response = await ApiService.getStream({ page: 1, grade: gradeId });
    setStreams(response.data);
  };

  const fetchAttendance = async (date: any) => {
    if (!selectedGrade || !selectedStream || !date) return;
    setLoading(true);
    const response = await ApiService.getAttendance({
      grade: selectedGrade,
      stream: selectedStream,
      date,
    });
    setAttendanceList(response.data);
    setSelectedDate(date);
    setLoading(false);
  };

  const fetchAttendanceAnalysis = async () => {
    // Use the selected date if available, otherwise default to current date
    const dateToUse = selectedDate ? new Date(selectedDate) : new Date();
    const year = dateToUse.getFullYear().toString();
    const month = (dateToUse.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based, so +1

    const response = await ApiService.getAttendanceSummary({
      year,
      month,
      stream: selectedStream,
    });

    const events = Object.keys(response.data).flatMap((date: any) => {
      const attendance = response.data[date];
      return [
        { date, title: `Morning Present: ${attendance.presentMorning}` },
        { date, title: `Morning Absent: ${attendance.absentMorning}` },
        { date, title: `Afternoon Present: ${attendance.presentAfternoon}` },
        { date, title: `Afternoon Absent: ${attendance.absentAfternoon}` },
      ];
    });

    setCalendarEvents(events);
  };

  const updateAttendance = (index: any, type: any, value: any) => {
    const updatedList = [...attendanceList];
    updatedList[index].attendanceDetails[type] = value;
    setAttendanceList(updatedList);
  };

  const markAll = (type: any, status: any) => {
    const updatedList = attendanceList.map((item: any) => ({
      ...item,
      attendanceDetails: { ...item.attendanceDetails, [type]: status },
    }));
    setAttendanceList(updatedList);
  };

  const saveAttendance = async () => {
    if (!attendanceList.length) return;

    setLoadingSave(true);
    try {
      const updatedList = attendanceList.map((item: any) => ({
        ...item,
        attendanceDetails: item.attendanceDetails || {
          morning: false,
          afternoon: false,
          stream: item.attendanceDetails?.stream || "",
        },
      }));
      await ApiService.createAttendance(updatedList);
      fetchAttendance(selectedDate);
      fetchAttendanceAnalysis();
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance. Please try again.");
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="p-6 xl:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-darkmode-900 dark:to-darkmode-800 min-h-screen">
      <div className=" mx-auto bg-white dark:bg-darkmode-700 rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col xl:flex-row">
          {/* Calendar Section */}
          <div className="w-full xl:w-2/5 p-6 bg-gradient-to-b from-indigo-50 to-white dark:from-darkmode-800 dark:to-darkmode-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Attendance Overview
            </h3>
            <Calendar
              initialDate={new Date().toISOString().split("T")[0]} // Default to current date
              events={calendarEvents}
              onDateClick={fetchAttendance}
              className="rounded-xl shadow-inner bg-white dark:bg-darkmode-600 p-4"
            />
            {selectedDate && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                Selected Date:{" "}
                <span className="font-medium">{selectedDate}</span>
              </p>
            )}
          </div>

          {/* Attendance Form Section */}
          <div className="w-full xl:w-3/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Record Attendance
              </h2>
              <Button
                variant="primary"
                onClick={saveAttendance}
                disabled={loadingSave || !attendanceList.length}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center transition-all duration-200"
              >
                {loadingSave ? (
                  <>
                    <LoadingIcon
                      icon="spinning-circles"
                      className="w-4 h-4 mr-2"
                    />
                    Saving...
                  </>
                ) : (
                  "Save Attendance"
                )}
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grade
                </FormLabel>
                <FormSelect
                  value={selectedGrade}
                  onChange={(e) => {
                    setSelectedGrade(e.target.value);
                    getStreams(e.target.value);
                  }}
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-darkmode-600 border border-gray-300 dark:border-darkmode-500 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
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
                <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stream
                </FormLabel>
                <FormSelect
                  value={selectedStream}
                  onChange={(e) => {
                    setSelectedStream(e.target.value);
                    setAttendanceList([]);
                  }}
                  required
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-darkmode-600 border border-gray-300 dark:border-darkmode-500 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
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

            {/* Attendance List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Attendance List
              </h3>
              {loading ? (
                <div className="bg-gray-50 dark:bg-darkmode-600 rounded-xl p-4 shadow-inner">
                  <div className="grid grid-cols-4 gap-4 bg-indigo-100 dark:bg-darkmode-500 p-3 rounded-lg mb-4">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Learner's Name
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Admission No.
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 flex justify-center">
                      <Button
                        onClick={() =>
                          markAll(
                            "morning",
                            !attendanceList.every(
                              (item: any) => item.attendanceDetails?.morning
                            )
                          )
                        }
                        className={`text-xs px-3 py-1 rounded-lg flex items-center transition-all duration-200 ${
                          attendanceList.every(
                            (item: any) => item.attendanceDetails?.morning
                          )
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {attendanceList.every(
                          (item: any) => item.attendanceDetails?.morning
                        )
                          ? "All Present"
                          : "All Absent"}{" "}
                        (AM)
                      </Button>
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 flex justify-center">
                      <Button
                        onClick={() =>
                          markAll(
                            "afternoon",
                            !attendanceList.every(
                              (item: any) => item.attendanceDetails?.afternoon
                            )
                          )
                        }
                        className={`text-xs px-3 py-1 rounded-lg flex items-center transition-all duration-200 ${
                          attendanceList.every(
                            (item: any) => item.attendanceDetails?.afternoon
                          )
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {attendanceList.every(
                          (item: any) => item.attendanceDetails?.afternoon
                        )
                          ? "All Present"
                          : "All Absent"}{" "}
                        (PM)
                      </Button>
                    </div>
                  </div>
                  {[...Array(50)].map((_, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-darkmode-600 rounded-xl p-4 shadow-inner"
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-darkmode-600 rounded-xl p-4 shadow-inner">
                  {/* Header */}
                  <div className="grid grid-cols-4 gap-4 bg-indigo-100 dark:bg-darkmode-500 p-3 rounded-lg mb-4">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Learner's Name
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Admission No.
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 flex justify-center">
                      <Button
                        onClick={() =>
                          markAll(
                            "morning",
                            !attendanceList.every(
                              (item: any) => item.attendanceDetails?.morning
                            )
                          )
                        }
                        className={`text-xs px-3 py-1 rounded-lg flex items-center transition-all duration-200 ${
                          attendanceList.every(
                            (item: any) => item.attendanceDetails?.morning
                          )
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {attendanceList.every(
                          (item: any) => item.attendanceDetails?.morning
                        )
                          ? "All Present"
                          : "All Absent"}{" "}
                        (AM)
                      </Button>
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200 flex justify-center">
                      <Button
                        onClick={() =>
                          markAll(
                            "afternoon",
                            !attendanceList.every(
                              (item: any) => item.attendanceDetails?.afternoon
                            )
                          )
                        }
                        className={`text-xs px-3 py-1 rounded-lg flex items-center transition-all duration-200 ${
                          attendanceList.every(
                            (item: any) => item.attendanceDetails?.afternoon
                          )
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {attendanceList.every(
                          (item: any) => item.attendanceDetails?.afternoon
                        )
                          ? "All Present"
                          : "All Absent"}{" "}
                        (PM)
                      </Button>
                    </div>
                  </div>

                  {/* List */}
                  <div className="max-h-[60vh] overflow-y-auto space-y-3">
                    {attendanceList.length > 0 ? (
                      attendanceList.map((item: any, index: any) => (
                        <div
                          key={item.learner._id}
                          className="grid grid-cols-4 gap-4 items-center p-4 bg-white dark:bg-darkmode-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <div className="text-gray-800 dark:text-white font-medium">{`${item.learner.first_name} ${item.learner.last_name}`}</div>
                          <div className="text-gray-600 dark:text-gray-300">
                            {item.learner.adm_no}
                          </div>

                          {/* Morning Attendance */}
                          <div className="flex flex-col items-center space-y-2">
                            <FormInput
                              type="checkbox"
                              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              checked={item.attendanceDetails?.morning || false}
                              onChange={(e) =>
                                updateAttendance(
                                  index,
                                  "morning",
                                  e.target.checked
                                )
                              }
                            />
                            {!item.attendanceDetails?.morning && (
                              <div className="w-full">
                                <FormSelect
                                  className="w-full text-sm bg-gray-50 dark:bg-darkmode-600 border-gray-300 dark:border-darkmode-500 rounded-lg focus:ring-indigo-500"
                                  value={
                                    item.attendanceDetails?.morning_reason || ""
                                  }
                                  onChange={(e) => {
                                    const reason = e.target.value;
                                    updateAttendance(
                                      index,
                                      "morning_other_reason",
                                      reason === "Other" ? reason : ""
                                    );
                                    updateAttendance(
                                      index,
                                      "morning_reason",
                                      reason === "Other" ? "" : reason
                                    );
                                  }}
                                >
                                  <option value="">Reason</option>
                                  {[
                                    "Sick",
                                    "Leave",
                                    "On Leave",
                                    "Family Emergency",
                                    "Personal Reasons",
                                    "Medical Appointment",
                                    "Transportation Issues",
                                    "Other",
                                  ].map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </FormSelect>
                                {item.attendanceDetails
                                  ?.morning_other_reason === "Other" && (
                                  <FormInput
                                    type="text"
                                    placeholder="Specify"
                                    className="mt-2 w-full text-sm bg-gray-50 dark:bg-darkmode-600 border-gray-300 dark:border-darkmode-500 rounded-lg focus:ring-indigo-500"
                                    value={
                                      item.attendanceDetails?.morning_reason ||
                                      ""
                                    }
                                    onChange={(e) =>
                                      updateAttendance(
                                        index,
                                        "morning_reason",
                                        e.target.value
                                      )
                                    }
                                  />
                                )}
                              </div>
                            )}
                          </div>

                          {/* Afternoon Attendance */}
                          <div className="flex flex-col items-center space-y-2">
                            <FormInput
                              type="checkbox"
                              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                              checked={
                                item.attendanceDetails?.afternoon || false
                              }
                              onChange={(e) =>
                                updateAttendance(
                                  index,
                                  "afternoon",
                                  e.target.checked
                                )
                              }
                            />
                            {!item.attendanceDetails?.afternoon && (
                              <div className="w-full">
                                <FormSelect
                                  className="w-full text-sm bg-gray-50 dark:bg-darkmode-600 border-gray-300 dark:border-darkmode-500 rounded-lg focus:ring-indigo-500"
                                  value={
                                    item.attendanceDetails?.afternoon_reason ||
                                    ""
                                  }
                                  onChange={(e) => {
                                    const reason = e.target.value;
                                    updateAttendance(
                                      index,
                                      "afternoon_other_reason",
                                      reason === "Other" ? reason : ""
                                    );
                                    updateAttendance(
                                      index,
                                      "afternoon_reason",
                                      reason === "Other" ? "" : reason
                                    );
                                  }}
                                >
                                  <option value="">Reason</option>
                                  {[
                                    "Sick",
                                    "Leave",
                                    "On Leave",
                                    "Family Emergency",
                                    "Personal Reasons",
                                    "Medical Appointment",
                                    "Transportation Issues",
                                    "Other",
                                  ].map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </FormSelect>
                                {item.attendanceDetails
                                  ?.afternoon_other_reason === "Other" && (
                                  <FormInput
                                    type="text"
                                    placeholder="Specify"
                                    className="mt-2 w-full text-sm bg-gray-50 dark:bg-darkmode-600 border-gray-300 dark:border-darkmode-500 rounded-lg focus:ring-indigo-500"
                                    value={
                                      item.attendanceDetails
                                        ?.afternoon_reason || ""
                                    }
                                    onChange={(e) =>
                                      updateAttendance(
                                        index,
                                        "afternoon_reason",
                                        e.target.value
                                      )
                                    }
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                        No attendance data for {selectedDate || "selected date"}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceForm;
