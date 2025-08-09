import { useState, useEffect, useCallback, useRef } from "react";
import Calendar from "../../components/Calendar/index";
import { FormLabel, FormSelect, FormInput } from "../../base-components/Form";
import * as ApiService from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Users, Calendar as CalendarIcon, Save, RefreshCw, AlertCircle, Clock, UserCheck } from "lucide-react";
import LoadingIcon from "../../base-components/LoadingIcon";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import Notification, { NotificationElement } from "../../base-components/Notification";

function AttendanceForm() {
  const [grades, setGrades] = useState<Array<{_id: string; name: string}>>([]);
  const [streams, setStreams] = useState<Array<{_id: string; name: string}>>([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceList, setAttendanceList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<any>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    presentMorning: 0,
    presentAfternoon: 0,
    absentMorning: 0,
    absentAfternoon: 0
  });
  
  const navigate = useNavigate();
  const notify = useRef<NotificationElement>();

  useEffect(() => {
    getGrades();
    fetchAttendanceAnalysis();
  }, []);

  useEffect(() => {
    if (selectedStream && selectedDate) {
    fetchAttendanceAnalysis();
    }
  }, [selectedStream, selectedDate]);

  useEffect(() => {
    calculateStats();
  }, [attendanceList]);

  const getGrades = async () => {
    try {
    const response = await ApiService.getGrades({ page: 1, attendance: true });
    setGrades(response.data);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const getStreams = async (gradeId: any) => {
    try {
    const response = await ApiService.getStream({ page: 1, grade: gradeId });
    setStreams(response.data);
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  };

  const fetchAttendance = useCallback(async (date: any) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);
    
    if (selected > today) {
      setSuccess(false);
      setMessage("Cannot mark attendance for future dates");
      notify.current?.showToast();
      return;
    }
    
    if (!selectedGrade || !selectedStream || !date) {
      setSuccess(false);
      setMessage("Please select grade, stream, and date");
      notify.current?.showToast();
      return;
    }
    
    setLoading(true);
    try {
    const response = await ApiService.getAttendance({
      grade: selectedGrade,
      stream: selectedStream,
      date,
    });
    setAttendanceList(response.data);
    setSelectedDate(date);
      setHasChanges(false);
    } catch (error) {
      setSuccess(false);
      setMessage("Error fetching attendance data");
      notify.current?.showToast();
    } finally {
    setLoading(false);
    }
  }, [selectedGrade, selectedStream]);

  const fetchAttendanceAnalysis = async () => {
    try {
    const dateToUse = selectedDate ? new Date(selectedDate) : new Date();
    const year = dateToUse.getFullYear().toString();
      const month = (dateToUse.getMonth() + 1).toString().padStart(2, "0");

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
    } catch (error) {
      console.error("Error fetching attendance analysis:", error);
    }
  };

  const updateAttendance = (index: any, type: any, value: any) => {
    const updatedList = [...attendanceList];
    updatedList[index].attendanceDetails[type] = value;
    setAttendanceList(updatedList);
    setHasChanges(true);
  };

  const markAll = (type: any, status: any) => {
    const updatedList = attendanceList.map((item: any) => ({
      ...item,
      attendanceDetails: { 
        ...item.attendanceDetails, 
        [type]: status,
        [`${type}_reason`]: status ? "" : item.attendanceDetails?.[`${type}_reason`] || "",
        [`${type}_other_reason`]: status ? "" : item.attendanceDetails?.[`${type}_other_reason`] || ""
      },
    }));
    setAttendanceList(updatedList);
    setHasChanges(true);
  };

  const calculateStats = () => {
    if (!attendanceList.length) {
      setStats({
        totalStudents: 0,
        presentMorning: 0,
        presentAfternoon: 0,
        absentMorning: 0,
        absentAfternoon: 0
      });
      return;
    }

    const stats = attendanceList.reduce((acc: any, item: any) => {
      const morning = item.attendanceDetails?.morning || false;
      const afternoon = item.attendanceDetails?.afternoon || false;
      
      return {
        totalStudents: acc.totalStudents + 1,
        presentMorning: acc.presentMorning + (morning ? 1 : 0),
        presentAfternoon: acc.presentAfternoon + (afternoon ? 1 : 0),
        absentMorning: acc.absentMorning + (morning ? 0 : 1),
        absentAfternoon: acc.absentAfternoon + (afternoon ? 0 : 1)
      };
    }, {
      totalStudents: 0,
      presentMorning: 0,
      presentAfternoon: 0,
      absentMorning: 0,
      absentAfternoon: 0
    });

    setStats(stats);
  };

  const saveAttendance = async () => {
    if (!attendanceList.length) {
      setSuccess(false);
      setMessage("No attendance data to save");
      notify.current?.showToast();
      return;
    }

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
      await fetchAttendance(selectedDate);
      await fetchAttendanceAnalysis();
      
      setSuccess(true);
      setMessage("Attendance saved successfully!");
      setHasChanges(false);
      notify.current?.showToast();
    } catch (error) {
      console.error("Error saving attendance:", error);
      setSuccess(false);
      setMessage("Failed to save attendance. Please try again.");
      notify.current?.showToast();
    } finally {
      setLoadingSave(false);
    }
  };

  const handleGradeChange = (gradeId: string) => {
    setSelectedGrade(gradeId);
    setSelectedStream("");
    setAttendanceList([]);
    setHasChanges(false);
    if (gradeId) {
      getStreams(gradeId);
    }
  };

  const handleStreamChange = (streamId: string) => {
    setSelectedStream(streamId);
    setAttendanceList([]);
    setHasChanges(false);
  };

  const handleDateSelect = (date: string) => {
    fetchAttendance(date);
  };

  return (
    <>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Attendance Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Record and manage daily student attendance
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Morning Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.presentMorning}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Morning Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absentMorning}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Afternoon Present</p>
                <p className="text-2xl font-bold text-green-600">{stats.presentAfternoon}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-red-100 dark:bg-red-900 p-3 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Afternoon Absent</p>
                <p className="text-2xl font-bold text-red-600">{stats.absentAfternoon}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Panel - Calendar & Filters */}
        <div className="xl:col-span-1 space-y-6">
          {/* Calendar Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                Attendance Calendar
            </h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => fetchAttendanceAnalysis()}
                  className="px-3 py-1"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <Calendar
              initialDate={selectedDate}
              events={calendarEvents}
              onDateClick={handleDateSelect}
              className="rounded-xl shadow-inner bg-gray-50 dark:bg-gray-700 p-4"
            />
            
            {selectedDate && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Selected Date:</strong> {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Filters Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-primary" />
              Class Selection
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
                  onChange={(e) => handleStreamChange(e.target.value)}
                  disabled={!selectedGrade}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 disabled:opacity-50"
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

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                How to Use
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Select grade and stream</li>
                <li>• Choose a date from the calendar</li>
                <li>• Mark attendance for each student</li>
                <li>• Add absence reasons if needed</li>
                <li>• Click "Save Attendance" when done</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Panel - Attendance List */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
            <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Attendance Record
              </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {selectedDate ? `Recording attendance for ${new Date(selectedDate).toLocaleDateString()}` : "Select a date to record attendance"}
                  </p>
                    </div>
                
                <div className="flex items-center space-x-3">
                  {hasChanges && (
                    <div className="flex items-center text-orange-600 dark:text-orange-400 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Unsaved changes
                    </div>
                  )}
                  
                      <Button
                    variant="primary"
                    onClick={saveAttendance}
                    disabled={loadingSave || !attendanceList.length || !hasChanges}
                    className="px-6 py-2"
                  >
                    {loadingSave ? (
                      <>
                        <LoadingIcon icon="spinning-circles" className="w-4 h-4 mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Attendance
                      </>
                    )}
                      </Button>
                </div>
                    </div>
                    </div>

            <div className="p-6">
              {/* Bulk Actions */}
              {attendanceList.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Bulk Actions</h4>
                  <div className="flex flex-wrap gap-3">
                      <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => markAll("morning", true)}
                      className="text-xs"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                      Mark All Present (AM)
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => markAll("morning", false)}
                      className="text-xs"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Mark All Absent (AM)
                      </Button>
                      <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => markAll("afternoon", true)}
                      className="text-xs"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                      Mark All Present (PM)
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => markAll("afternoon", false)}
                      className="text-xs"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Mark All Absent (PM)
                      </Button>
                    </div>
                </div>
              )}

              {/* Attendance List */}
              <div>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <LoadingIcon icon="spinning-circles" className="w-12 h-12 text-primary" />
                    <p className="text-gray-600 dark:text-gray-400 mt-4">
                      Loading students...
                    </p>
                  </div>
                ) : attendanceList.length > 0 ? (
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                    {attendanceList
                        .filter((item: any) => item.stream == selectedStream)
                        .map((item: any, index: any) => (
                          <div
                            key={item.learner._id}
                          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                            {/* Student Info */}
                            <div className="md:col-span-2">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-semibold text-primary">
                                    {item.learner.first_name.charAt(0)}{item.learner.last_name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">
                                    {`${item.learner.first_name} ${item.learner.last_name}`}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                              {item.learner.adm_no}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Morning Attendance */}
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  Morning
                                </span>
                              <FormInput
                                type="checkbox"
                                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
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
                              
                              {!item.attendanceDetails?.morning && (
                                <div className="space-y-2">
                                  <FormSelect
                                    className="w-full text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded-lg focus:ring-primary"
                                    value={item.attendanceDetails?.morning_reason || ""}
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
                                    <option value="">Select reason</option>
                                    {[
                                      "Sick",
                                      "Leave",
                                      "Family Emergency",
                                      "Medical Appointment",
                                      "Transportation Issues",
                                      "Other",
                                    ].map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </FormSelect>
                                  
                                  {item.attendanceDetails?.morning_other_reason === "Other" && (
                                    <FormInput
                                      type="text"
                                      placeholder="Specify reason"
                                      className="w-full text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded-lg focus:ring-primary"
                                      value={item.attendanceDetails?.morning_reason || ""}
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
                            <div className="flex flex-col space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  Afternoon
                                </span>
                              <FormInput
                                type="checkbox"
                                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                  checked={item.attendanceDetails?.afternoon || false}
                                onChange={(e) =>
                                  updateAttendance(
                                    index,
                                    "afternoon",
                                    e.target.checked
                                  )
                                }
                              />
                              </div>
                              
                              {!item.attendanceDetails?.afternoon && (
                                <div className="space-y-2">
                                  <FormSelect
                                    className="w-full text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded-lg focus:ring-primary"
                                    value={item.attendanceDetails?.afternoon_reason || ""}
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
                                    <option value="">Select reason</option>
                                    {[
                                      "Sick",
                                      "Leave",
                                      "Family Emergency",
                                      "Medical Appointment",
                                      "Transportation Issues",
                                      "Other",
                                    ].map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </FormSelect>
                                  
                                  {item.attendanceDetails?.afternoon_other_reason === "Other" && (
                                    <FormInput
                                      type="text"
                                      placeholder="Specify reason"
                                      className="w-full text-sm bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded-lg focus:ring-primary"
                                      value={item.attendanceDetails?.afternoon_reason || ""}
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
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Students Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      {!selectedGrade || !selectedStream 
                        ? "Please select a grade and stream to view students"
                        : `No students found for ${selectedDate || "selected date"}`
                      }
                    </p>
                  </div>
                )}
                </div>
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

export default AttendanceForm;
