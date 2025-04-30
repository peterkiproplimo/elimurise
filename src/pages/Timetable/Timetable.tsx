import React, { useState, useEffect, useRef } from "react";
import * as ApiService from "../../services/auth";
import PopupDialog from "./PopupDialog";
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

interface LearningArea {
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

const Timetable: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStream, setSelectedStream] = useState<string>("");
  const [learningAreas, setLearningAreas] = useState<LearningArea[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [specialPeriods, setSpecialPrograms] = useState<SpecialProgram[]>([]);
  const [timetables, setTimetables] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    message: "",
    type: "info",
  });
  const [editingCell, setEditingCell] = useState<{
    day: string;
    slotId: string;
  } | null>(null);
  const [editPeriodType, setEditPeriodType] = useState<
    "learning_area" | "special" | ""
  >("");
  const [editLearningArea, setEditLearningArea] = useState<string>("");
  const [editSpecialProgram, setEditSpecialProgram] = useState<string>("");
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const tableRef = useRef<HTMLTableElement>(null);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Handle dialog visibility
  useEffect(() => {
    if (loading) {
      setDialogContent({
        title: "Loading...",
        message: "Please wait while data loads.",
        type: "info",
      });
      setShowDialog(true);
    } else if (error) {
      setDialogContent({ title: "Error", message: error, type: "error" });
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [loading, error]);

  // PDF Export
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
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Fetch learning areas based on selected grade
  const getLearningAreas = async () => {
    try {
      const response = await ApiService.getLearningAreas({
        limit: 100000,
        gradeId: selectedGrade,
      });
      setLearningAreas(response.data || []);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Fetch time slots on mount
  const fetchTimeSlots = async () => {
    try {
      const data = await ApiService.getTimeSlots({});
      // Mock fixed slots if not provided by API
      const updatedData = data.map((slot: TimeSlot) => ({
        ...slot,
        isFixed: slot.isFixed ?? false, // Default to false if undefined
        name: slot.name ?? (slot.isFixed ? "Break" : undefined), // Default name for fixed slots
      }));
      setTimeSlots(updatedData);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Fetch special programs on mount
  const fetchSpecialPrograms = async () => {
    try {
      const data = await ApiService.getSpecialPrograms();
      setSpecialPrograms(data || []);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Fetch initial data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          getGrades(),
          fetchTimeSlots(),
          fetchSpecialPrograms(),
        ]);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch streams and learning areas when grade changes
  useEffect(() => {
    if (selectedGrade) {
      const fetchGradeData = async () => {
        try {
          await Promise.all([getStreams(selectedGrade), getLearningAreas()]);
        } catch (err) {
          setError((err as Error).message);
        }
      };
      fetchGradeData();
    } else {
      setStreams([]);
      setLearningAreas([]);
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

  // Handle edit cell
  const handleEdit = (
    day: string,
    slotId: string,
    entryId: string | undefined,
    periodType: "learning_area" | "special" | undefined,
    currentLearningAreaId: string | undefined,
    currentSpecialProgramId: string | undefined
  ) => {
    setEditingCell({ day, slotId });
    setEditPeriodType(periodType || "");
    setEditLearningArea(currentLearningAreaId || "");
    setEditSpecialProgram(currentSpecialProgramId || "");
  };

  // Handle save cell
  const handleSave = async (day: string, slotId: string, entryId?: string) => {
    if (!editPeriodType) {
      setError("Please select a period type");
      return;
    }
    if (
      (editPeriodType === "learning_area" && !editLearningArea) ||
      (editPeriodType === "special" && !editSpecialProgram)
    ) {
      setError(
        editPeriodType === "learning_area"
          ? "Please select a learning area"
          : "Please select a special program"
      );
      return;
    }

    try {
      const payload = {
        stream: selectedStream,
        timeSlot: slotId,
        dayOfWeek: day,
        periodType: editPeriodType,
        ...(editPeriodType === "learning_area" && {
          learning_area: editLearningArea,
        }),
        ...(editPeriodType === "special" && {
          specialPeriod: editSpecialProgram,
        }),
      };

      const updatedTimetable = await ApiService.updateTimetablePeriod(payload);
      if (entryId) {
        setTimetables(
          timetables.map((tt) => (tt._id === entryId ? updatedTimetable : tt))
        );
      } else {
        setTimetables([...timetables, updatedTimetable]);
      }
      setEditingCell(null);
      setEditPeriodType("");
      setEditLearningArea("");
      setEditSpecialProgram("");
      setError(null);

      // Refresh timetables
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
    } catch (err) {
      setShowDialog(true);
      setError((err as Error).message);
    }
  };

  const {
    timeSlots: gridTimeSlots,
    grid,
    days,
  } = selectedStream && timeSlots.length > 0
    ? organizeTimetable(timetables, timeSlots)
    : { timeSlots: [], grid: [], days: [] };

  if (loading) {
    return <div className="text-center text-gray-500 p-4">Loading...</div>;
  }

  // if (!gridTimeSlots.length || !days.length) {
  //   return (
  //     <div className="text-center text-red-500 p-4">
  //       No timetable data available
  //     </div>
  //   );
  // }

  return (
    <div>
      <PopupDialog
        isOpen={showDialog}
        setIsOpen={setShowDialog}
        title={dialogContent.title}
        message={dialogContent.message}
        type={dialogContent.type}
      />

      <div
        className={`p-6 ${
          darkMode ? "dark bg-gray-900" : "bg-gray-100"
        } transition-colors duration-300 font-sans`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold uppercase text-gray-900 dark:text-white flex-1 text-center">
            Timetable Scheduler
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Grade
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">-- Select Grade --</option>
                  {grades.map((grade) => (
                    <option key={grade._id} value={grade._id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedGrade && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Stream
                  </label>
                  <select
                    value={selectedStream}
                    onChange={(e) => setSelectedStream(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">-- Select Stream --</option>
                    {streams.map((stream) => (
                      <option key={stream._id} value={stream._id}>
                        {stream.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              {selectedStream && (
                <button
                  onClick={exportToPDF}
                  className="px-3 py-1 bg-gray-500 text-white rounded text-sm"
                >
                  Export PDF
                </button>
              )}
            </div>
          </div>

          {selectedStream && (
            <div className="overflow-x-auto">
              <table
                ref={tableRef}
                className="w-full border border-gray-300 shadow-md rounded overflow-hidden text-sm"
              >
                <thead className="bg-gray-800 text-white uppercase text-xs tracking-wide">
                  <tr>
                    <th className="border border-gray-300 p-3 text-center sticky left-0 bg-gray-800 z-10">
                      Day
                    </th>
                    {gridTimeSlots.map((slot) => (
                      <th
                        key={slot._id}
                        className="border border-gray-300 p-3 text-center whitespace-nowrap"
                      >
                        {slot.startTime.replace(/^0/, "")} <br />
                        {slot.endTime.replace(/^0/, "")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800">
                  {grid.map((row, dayIndex) => (
                    <tr key={row.day} className="even:bg-gray-50">
                      <td className="border border-gray-300 p-3 font-semibold text-center text-gray-900 dark:text-gray-100 sticky left-0 bg-white dark:bg-gray-800 z-10">
                        {row.day}
                      </td>
                      {gridTimeSlots.map((slot) => {
                        if (slot.isFixed) {
                          if (dayIndex === 0) {
                            return (
                              <td
                                key={slot._id}
                                rowSpan={days.length}
                                className="border border-gray-300 max-w-[50px] bg-yellow-100 text-yellow-800 text-center font-semibold p-1"
                              >
                                <div
                                  className="transform rotate-90 text-xl font-bold tracking-wider"
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
                          <td
                            key={slot._id}
                            className="border border-gray-300 p-2 text-gray-900 dark:text-gray-100"
                          >
                            {editingCell?.day === row.day &&
                            editingCell?.slotId === slot._id ? (
                              <div className="flex flex-col space-y-2">
                                <select
                                  value={
                                    editPeriodType &&
                                    (editPeriodType === "learning_area"
                                      ? `learning_area:${editLearningArea}`
                                      : `special:${editSpecialProgram}`)
                                  }
                                  onChange={(e) => {
                                    const [type, id] =
                                      e.target.value.split(":");
                                    setEditPeriodType(
                                      type as "learning_area" | "special"
                                    );
                                    if (type === "learning_area") {
                                      setEditLearningArea(id);
                                      setEditSpecialProgram("");
                                    } else {
                                      setEditSpecialProgram(id);
                                      setEditLearningArea("");
                                    }
                                  }}
                                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                  <option value="">-- Select Period --</option>
                                  <optgroup label="Learning Areas">
                                    {learningAreas.map((la) => (
                                      <option
                                        key={la._id}
                                        value={`learning_area:${la._id}`}
                                      >
                                        {la.name}
                                      </option>
                                    ))}
                                  </optgroup>
                                  <optgroup label="Special Programs">
                                    {specialPeriods.map((sp) => (
                                      <option
                                        key={sp._id}
                                        value={`special:${sp._id}`}
                                      >
                                        {sp.name}
                                      </option>
                                    ))}
                                  </optgroup>
                                </select>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() =>
                                      handleSave(row.day, slot._id, cell?.id)
                                    }
                                    className="px-3 py-1 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingCell(null);
                                      setEditPeriodType("");
                                      setEditLearningArea("");
                                      setEditSpecialProgram("");
                                    }}
                                    className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md transition-colors relative group"
                                onClick={() =>
                                  handleEdit(
                                    row.day,
                                    slot._id,
                                    cell?.id,
                                    cell?.periodType as
                                      | "learning_area"
                                      | "special"
                                      | undefined,
                                    cell?.periodType === "learning_area"
                                      ? timetables.find(
                                          (tt) => tt._id === cell?.id
                                        )?.learning_area?._id
                                      : undefined,
                                    cell?.periodType === "special"
                                      ? timetables.find(
                                          (tt) => tt._id === cell?.id
                                        )?.specialPeriod?._id
                                      : undefined
                                  )
                                }
                              >
                                {cell ? (
                                  <p
                                    className={`text-sm ${
                                      cell.periodType === "special"
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-gray-900 dark:text-gray-100"
                                    }`}
                                  >
                                    {cell.name}
                                  </p>
                                ) : (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    No class
                                  </p>
                                )}
                                {cell?.teacherName &&
                                  cell.periodType === "learning_area" && (
                                    <span className="absolute z-10 invisible group-hover:visible bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 transition-opacity">
                                      {cell.teacherName}
                                    </span>
                                  )}
                              </div>
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
        </div>
      </div>
    </div>
  );
};

export default Timetable;
