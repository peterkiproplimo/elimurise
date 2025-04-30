import React, { useState, useEffect, useRef } from "react";
import * as ApiService from "../../services/auth";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// Define interfaces for type safety
interface Grade {
  _id: string;
  name: string;
}

interface Stream {
  _id: string;
  name: string;
}

interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
  isFixed?: boolean;
  name?: string;
}

interface SpecialProgram {
  _id: string;
  name: string;
  durationMinutes: number;
  description?: string;
  isMandatory: boolean;
  maxPerDay: number;
}

interface LearningArea {
  _id: string;
  name: string;
}

interface TimetableEntry {
  _id: string;
  stream: string;
  timeSlot: TimeSlot;
  dayOfWeek: string;
  periodType: "learning_area" | "special";
  learning_area?: LearningArea;
  specialPeriod?: SpecialProgram;
  teacher?: {
    _id: string;
    firstname: string;
    lastname: string;
    surname: string;
  };
}

const TimetableViewer: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [timetables, setTimetables] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const tableRef = useRef<HTMLTableElement>(null);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Fetch grades on mount
  const getGrades = async () => {
    try {
      const response = await ApiService.getGrades({ page: 1 });
      setGrades(response.data || []);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Fetch streams based on grade
  const getStreams = async (grade: string) => {
    setStreams([]);
    setSelectedStream("");
    try {
      const response = await ApiService.getStream({ page: 1, grade });
      setStreams(response.data || []);
      if (response.data?.length > 0) {
        setSelectedStream(response.data[0]._id); // Auto-select first stream
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Fetch time slots on mount
  const fetchTimeSlots = async () => {
    try {
      const data = await ApiService.getTimeSlots({});
      const updatedData = data.map((slot: TimeSlot) => ({
        ...slot,
        isFixed: slot.isFixed ?? false,
        name: slot.name ?? (slot.isFixed ? "Break" : undefined),
      }));
      setTimeSlots(updatedData);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Fetch initial data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([getGrades(), fetchTimeSlots()]);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch streams when grade changes
  useEffect(() => {
    if (selectedGrade) {
      getStreams(selectedGrade);
    } else {
      setStreams([]);
      setSelectedStream("");
    }
  }, [selectedGrade]);

  // Fetch timetables when stream changes
  useEffect(() => {
    if (selectedStream) {
      const fetchTimetables = async () => {
        try {
          const filter = { stream: selectedStream };
          const data = await ApiService.getTimetables(filter);
          setTimetables(data || []);
        } catch (err) {
          setError((err as Error).message);
        }
      };
      fetchTimetables();
    } else {
      setTimetables([]);
    }
  }, [selectedStream]);

  // Export to PDF
  const exportToPDF = async () => {
    const table = tableRef.current;
    if (!table) {
      setError("Table not found for PDF export");
      return;
    }
    try {
      const canvas = await html2canvas(table, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 280;
      const pageHeight = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Timetable_Grade_${selectedGrade}_Stream_${selectedStream}.pdf`);
    } catch (err) {
      setError("Failed to export PDF: " + (err as Error).message);
    }
  };

  // Organize timetable into grid
  const organizeTimetable = (
    timetables: TimetableEntry[],
    timeSlots: TimeSlot[]
  ) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const grid = days.map((day) => {
      const row: {
        day: string;
        [key: string]:
          | {
              id: string;
              periodType: string;
              name: string;
              teacherName?: string;
            }
          | null
          | string;
      } = { day };
      timeSlots.forEach((slot) => {
        const entry = timetables.find(
          (tt) => tt.dayOfWeek === day && tt.timeSlot._id === slot._id
        );
        row[slot._id] = entry
          ? {
              id: entry._id,
              periodType: entry.periodType,
              name:
                entry.periodType === "learning_area"
                  ? entry.learning_area?.name || "Unknown"
                  : entry.specialPeriod?.name || "Unknown",
              teacherName:
                entry.periodType === "learning_area" && entry.teacher
                  ? `${entry.teacher.firstname} ${entry.teacher.lastname}`
                  : undefined,
            }
          : null;
      });
      return row;
    });
    return { timeSlots, grid, days };
  };

  const {
    timeSlots: gridTimeSlots,
    grid,
    days,
  } = selectedStream && timeSlots.length > 0
    ? organizeTimetable(timetables, timeSlots)
    : { timeSlots: [], grid: [], days: [] };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-lg font-semibold text-gray-600 dark:text-gray-300">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      } transition-colors duration-300 font-sans`}
    >
      {/* Error Message */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {error}
          <button
            className="ml-2 text-white font-bold"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className="flex">
        {/* Sidebar for Grades */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen fixed">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Grades
            </h2>
          </div>
          <ul className="mt-2">
            {grades.map((grade) => (
              <li
                key={grade._id}
                className={`p-4 cursor-pointer hover:bg-teal-100 dark:hover:bg-teal-700 transition-colors ${
                  selectedGrade === grade._id
                    ? "bg-teal-50 dark:bg-teal-800 border-l-4 border-teal-500"
                    : ""
                }`}
                onClick={() => setSelectedGrade(grade._id)}
              >
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  {grade.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="ml-64 flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Timetable Viewer
            </h1>
            <div className="flex items-center space-x-4">
              {selectedStream && (
                <button
                  onClick={exportToPDF}
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Export to PDF
                </button>
              )}
            </div>
          </div>

          {selectedGrade && streams.length > 0 ? (
            <>
              {/* Stream Tabs */}
              <div className="mb-6">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  {streams.map((stream) => (
                    <button
                      key={stream._id}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        selectedStream === stream._id
                          ? "border-b-2 border-teal-500 text-teal-600 dark:text-teal-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                      onClick={() => setSelectedStream(stream._id)}
                    >
                      {stream.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timetable */}
              {selectedStream && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                  <table
                    ref={tableRef}
                    className="w-full text-sm text-left text-gray-900 dark:text-gray-100"
                  >
                    <thead className="bg-teal-600 text-white uppercase text-xs tracking-wider">
                      <tr>
                        <th className="p-3 text-center sticky left-0 bg-teal-600 z-10 w-24">
                          Day
                        </th>
                        {gridTimeSlots.map((slot) => (
                          <th
                            key={slot._id}
                            className="p-3 text-center whitespace-nowrap"
                          >
                            {slot.startTime.replace(/^0/, "")} <br />
                            {slot.endTime.replace(/^0/, "")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {grid.map((row, dayIndex) => (
                        <tr
                          key={row.day}
                          className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="p-3 font-semibold text-center sticky left-0 bg-white dark:bg-gray-800 z-10 w-24">
                            {row.day}
                          </td>
                          {gridTimeSlots.map((slot) => {
                            if (slot.isFixed) {
                              if (dayIndex === 0) {
                                return (
                                  <td
                                    key={slot._id}
                                    rowSpan={days.length}
                                    className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-center font-semibold p-2"
                                  >
                                    <div
                                      className="transform rotate-90 text-lg font-bold tracking-wider"
                                      style={{ transformOrigin: "center" }}
                                    >
                                      {slot.name || "Break"}
                                    </div>
                                  </td>
                                );
                              }
                              return null;
                            }

                            const cell = row[slot._id] as {
                              id: string;
                              periodType: string;
                              name: string;
                              teacherName?: string;
                            } | null;

                            return (
                              <td key={slot._id} className="p-3 relative group">
                                <div className="flex flex-col items-center">
                                  {cell ? (
                                    <p
                                      className={`text-sm font-medium ${
                                        cell.periodType === "special"
                                          ? "text-blue-600 dark:text-blue-400"
                                          : "text-gray-900 dark:text-gray-100"
                                      }`}
                                    >
                                      {cell.name}
                                    </p>
                                  ) : (
                                    <p className="text-sm text-gray-400 dark:text-gray-500">
                                      No class
                                    </p>
                                  )}
                                  {cell?.teacherName &&
                                    cell.periodType === "learning_area" && (
                                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {cell.teacherName}
                                      </span>
                                    )}
                                </div>
                                {/* Tooltip for additional info */}
                                {cell && (
                                  <span className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 transition-opacity">
                                    {cell.periodType === "special"
                                      ? "Special Program"
                                      : cell.teacherName || cell.name}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : selectedGrade ? (
            <div className="text-center text-gray-500 dark:text-gray-400 p-6">
              No streams available for this grade.
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 p-6">
              Please select a grade to view the timetable.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetableViewer;
