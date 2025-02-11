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
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [calendarEvents, setCalendarEvents] = useState([]);
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

  const getStreams = async (gradeId) => {
    const response = await ApiService.getStream({ page: 1, grade: gradeId });
    setStreams(response.data);
  };

  const fetchAttendance = async (date) => {
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

    const events = Object.keys(response.data).flatMap((date) => {
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

  const updateAttendance = (index, type, value) => {
    const updatedList = [...attendanceList];
    updatedList[index].attendanceDetails[type] = value;
    setAttendanceList(updatedList);
  };

  const markAll = (type, status) => {
    const updatedList = attendanceList.map((item) => ({
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
      attendanceList.attendanceDetails = attendanceList?.map((item) => ({
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
      fetchAttendance();
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
      <div className="w-full xl:w-1/2 p-4">
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

      <div className="w-full xl:w-1/2 p-4">
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
              onChange={(e) => {
                setSelectedStream(e.target.value);
                setAttendanceList([]);
              }}
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
                        (item) => item.attendanceDetails?.morning
                      )
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white text-xs hover:bg-opacity-75 transition duration-200 flex items-center justify-center px-2 py-1 rounded-lg`}
                    onClick={(event) => {
                      event.preventDefault();
                      const newStatus = !attendanceList.every(
                        (item) => item.attendanceDetails?.morning
                      );
                      markAll("morning", newStatus);
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="ml-1">
                      {attendanceList.every(
                        (item) => item.attendanceDetails?.morning
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
                        (item) => item.attendanceDetails?.afternoon
                      )
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white text-xs hover:bg-opacity-75 transition duration-200 flex items-center justify-center px-2 py-1 rounded-lg`}
                    onClick={(event) => {
                      event.preventDefault();
                      const newStatus = !attendanceList.every(
                        (item) => item.attendanceDetails?.afternoon
                      );
                      markAll("afternoon", newStatus);
                    }}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="ml-1">
                      {attendanceList.every(
                        (item) => item.attendanceDetails?.afternoon
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
                    {attendanceList.map((item, index) => (
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
                        <div className="flex justify-center">
                          <FormInput
                            type="checkbox"
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={item.attendanceDetails?.morning}
                            onChange={(e) =>
                              updateAttendance(
                                index,
                                "morning",
                                e.target.checked
                              )
                            }
                          />
                        </div>
                        <div className="flex justify-center">
                          <FormInput
                            type="checkbox"
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={item.attendanceDetails?.afternoon}
                            onChange={(e) =>
                              updateAttendance(
                                index,
                                "afternoon",
                                e.target.checked
                              )
                            }
                          />
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
