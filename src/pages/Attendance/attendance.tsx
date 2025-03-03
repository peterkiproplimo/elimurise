import { useState, useEffect } from "react";
import Calendar from "../../components/Calendar/index";
import { FormLabel, FormSelect, FormInput } from "../../base-components/Form";
import * as ApiService from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react"; // Import Lucide icons
import { stream } from "exceljs";
import LoadingIcon from "../../base-components/LoadingIcon";

function AttendanceForm() {
  const [grades, setGrades] = useState([]);
  const [streams, setStreams] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceList, setAttendanceList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [loadingSave, setLoadingSave] = useState(false);

  const [calendarEvents, setCalendarEvents] = useState<any>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getGrades();
    fetchAttendanceAnalysis();
  }, []);
  useEffect(() => {
    fetchAttendanceAnalysis();
  }, [selectedStream]);
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
    const response = await ApiService.getAttendanceSummary({
      year: "2025",
      month: "2",
      stream: selectedStream,
    });

    const events = Object.keys(response.data).flatMap((date: any) => {
      const attendance = response.data[date];
      return [
        {
          date,
          title: `Morning Present: ${attendance.presentMorning}`,
        },
        {
          date,
          title: `Morning Absent: ${attendance.absentMorning}`,
        },
        {
          date,
          title: `Afternoon Present: ${attendance.presentAfternoon}`,
        },
        {
          date,
          title: `Afternoon Absent: ${attendance.absentAfternoon}`,
        },
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
      attendanceDetails: {
        ...item.attendanceDetails,
        [type]: status,
      },
    }));
    setAttendanceList(updatedList);
  };

  const saveAttendance = async () => {
    // Check if attendanceDetails is null or undefined
    if (
      !attendanceList.attendanceDetails ||
      attendanceList.attendanceDetails.length === 0
    ) {
      // Set morning and afternoon to false for all entries if attendanceDetails is empty or null
      attendanceList.attendanceDetails = attendanceList?.map((item: any) => ({
        ...item,
        attendanceDetails: {
          morning: false,
          afternoon: false,
          stream: item.attendanceDetails?.stream || "", // Default stream if it exists
        },
      }));
    }

    setLoadingSave(true);
    try {
      // Proceed with saving the attendance if validation passes
      await ApiService.createAttendance(attendanceList);
      // Fetch updated data after saving
      fetchAttendance(selectedDate);
      fetchAttendanceAnalysis();
    } catch (error) {
      console.error("Error saving attendance:", error);
      // Optionally, show an error message to the user
      alert("An error occurred while saving attendance.");
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="flex flex-wrap items-start col-span-12 mt-2 xl:flex-nowrap bg-white rounded-lg">
      <div className="w-full xl:w-2/5 p-4">
        <div className="box">
          <h3 className="text-lg font-bold mb-4 text-gray-700">
            Attendance Overview
          </h3>
          <Calendar
            initialDate="2025-02-12"
            events={calendarEvents}
            onDateClick={fetchAttendance}
          />
          {selectedDate && (
            <p className="mt-2 text-sm text-gray-600">
              Selected Date: {selectedDate}
            </p>
          )}
        </div>
      </div>

      <div className="w-full xl:w-3/5 p-4">
        <h2 className="text-2xl font-bold text-gray-800">Record Attendance</h2>
        {/* <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchAttendance(selectedDate);
          }}
          className="space-y-6"
        > */}
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
              onChange={(e) => {
                setSelectedStream(e.target.value);
                setAttendanceList([]);
              }}
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
          <button
            className="bg-blue-500 text-white text-sm hover:bg-blue-600 transition duration-200 px-4 py-2 rounded-lg mb-4 flex items-center justify-center"
            onClick={saveAttendance}
            disabled={loadingSave} // Disable the button while loading
          >
            Save Attendance
            {loadingSave && (
              <LoadingIcon
                icon="spinning-circles"
                color="white"
                className="w-4 h-4 ml-2"
              />
            )}
          </button>
        </div>
        {/* </form> */}

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-700">Attendance List</h3>
          {loading ? (
            <div className="space-y-4">
              {[...Array(25)].map((_, index) => (
                <div
                  key={index}
                  className="h-16 bg-gray-200 rounded-lg opacity-75 animate-fade"
                ></div>
              ))}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-4 gap-4 bg-gray-100 p-4 rounded-lg shadow-sm mb-4">
                <div className="text-sm font-medium text-gray-700">
                  Learner's Name
                </div>
                <div className="text-sm font-medium text-gray-700">
                  Admission No.
                </div>
                <div className="text-sm font-medium text-gray-700 flex justify-center gap-2">
                  <button
                    className={`${
                      attendanceList.every(
                        (item: any) => item.attendanceDetails?.morning
                      )
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white text-xs hover:bg-opacity-75 transition duration-200 flex items-center justify-center px-2 py-1 rounded-lg`}
                    onClick={(event) => {
                      event.preventDefault();
                      const newStatus = !attendanceList.every(
                        (item: any) => item.attendanceDetails?.morning
                      );
                      markAll("morning", newStatus);
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="ml-1">
                      {attendanceList.every(
                        (item: any) => item.attendanceDetails?.morning
                      )
                        ? "All present Morning"
                        : "All absent Morning"}
                    </span>
                  </button>
                </div>
                <div className="text-sm font-medium text-gray-700 flex justify-center gap-2">
                  <button
                    className={`${
                      attendanceList.every(
                        (item: any) => item.attendanceDetails?.afternoon
                      )
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white text-xs hover:bg-opacity-75 transition duration-200 flex items-center justify-center px-2 py-1 rounded-lg`}
                    onClick={(event) => {
                      event.preventDefault();
                      const newStatus = !attendanceList.every(
                        (item: any) => item.attendanceDetails?.afternoon
                      );
                      markAll("afternoon", newStatus);
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="ml-1">
                      {attendanceList.every(
                        (item: any) => item.attendanceDetails?.afternoon
                      )
                        ? "All present Afternoon"
                        : "All absent Afternoon"}
                    </span>
                  </button>
                </div>
              </div>
              <ul className="space-y-2">
                {attendanceList.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {attendanceList.map((item: any, index: any) => (
                      <div
                        key={item.learner._id}
                        className="grid grid-cols-4 items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition duration-200"
                      >
                        <div className="text-gray-800 font-medium">
                          {`${item.learner.first_name} ${item.learner.last_name}`}
                        </div>
                        <div className="text-gray-600">
                          {item.learner.adm_no}
                        </div>
                        <div className="flex flex-col items-center">
                          {/* Morning Checkbox */}
                          <div>
                            <FormInput
                              type="checkbox"
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              checked={item.attendanceDetails?.morning || false}
                              onChange={(e) =>
                                updateAttendance(
                                  index,
                                  "morning",
                                  e.target.checked
                                )
                              }
                            />
                          </div>

                          {/* Show reason dropdown only when absent (checkbox unchecked) */}
                          {!item.attendanceDetails?.morning && (
                            <div className="mt-2">
                              <FormSelect
                                name="morning_reason"
                                className="w-100 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                defaultValue={
                                  item.attendanceDetails?.morning_reason || ""
                                }
                                onChange={(e) => {
                                  const reason = e.target.value;

                                  // Reset 'other reason' if reason is not 'Other'
                                  if (reason === "Other") {
                                    updateAttendance(
                                      index,
                                      "morning_other_reason",
                                      reason
                                    );
                                    updateAttendance(
                                      index,
                                      "morning_reason",
                                      ""
                                    );
                                  } else {
                                    updateAttendance(
                                      index,
                                      "morning_other_reason",
                                      ""
                                    );
                                    updateAttendance(
                                      index,
                                      "morning_reason",
                                      reason
                                    );
                                  }
                                }}
                              >
                                <option value="">Select Reason</option>
                                <option value="Sick">Sick</option>
                                <option value="Leave">Leave</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Family Emergency">
                                  Family Emergency
                                </option>
                                <option value="Personal Reasons">
                                  Personal Reasons
                                </option>
                                <option value="Medical Appointment">
                                  Medical Appointment
                                </option>
                                <option value="Transportation Issues">
                                  Transportation Issues
                                </option>
                                <option value="Other">Other</option>
                              </FormSelect>

                              {/* Show input field for 'Other' reason */}
                              {item.attendanceDetails?.morning_other_reason ===
                                "Other" && (
                                <div className="mt-2">
                                  <FormInput
                                    type="text"
                                    placeholder="Please specify"
                                    className="w-full text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-center">
                          {/* Afternoon Checkbox */}
                          <div>
                            <FormInput
                              type="checkbox"
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                          </div>
                          {/* {JSON.stringify(item.attendanceDetails)} */}

                          {/* Show reason dropdown only when absent (checkbox unchecked) */}
                          {!item.attendanceDetails?.afternoon && (
                            <div className="mt-2">
                              <FormSelect
                                name="afternoon_reason"
                                className="w-100 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                defaultValue={
                                  item.attendanceDetails?.afternoon_reason || ""
                                }
                                onChange={(e) => {
                                  const reason = e.target.value;

                                  if (reason === "Other") {
                                    updateAttendance(
                                      index,
                                      "afternoon_other_reason",
                                      reason
                                    );
                                    updateAttendance(
                                      index,
                                      "afternoon_reason",
                                      ""
                                    );
                                  } else {
                                    updateAttendance(
                                      index,
                                      "afternoon_other_reason",
                                      ""
                                    );
                                    updateAttendance(
                                      index,
                                      "afternoon_reason",
                                      reason
                                    );
                                  }
                                  // Reset 'other reason' if reason is not 'Other'
                                }}
                              >
                                <option value="">Select Reason</option>
                                <option value="Sick">Sick</option>
                                <option value="Leave">Leave</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Family Emergency">
                                  Family Emergency
                                </option>
                                <option value="Personal Reasons">
                                  Personal Reasons
                                </option>
                                <option value="Medical Appointment">
                                  Medical Appointment
                                </option>
                                <option value="Transportation Issues">
                                  Transportation Issues
                                </option>
                                <option value="Other">Other</option>
                              </FormSelect>
                              {/* Show input field for 'Other' reason */}
                              {item.attendanceDetails
                                ?.afternoon_other_reason === "Other" && (
                                <div className="mt-2">
                                  <FormInput
                                    type="text"
                                    placeholder="Please specify"
                                    className="w-full text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No attendance data for {selectedDate}
                  </p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceForm;
