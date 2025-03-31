// TimetableManager.jsx
import React, { useState, useEffect } from "react";
import Button from "../../base-components/Button";
import Table from "../../base-components/Table";
import * as ApiService from "../../services/auth";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function TimetableManager() {
  const [grades, setGrades] = useState([]);
  const [streams, setStreams] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [timetable, setTimetable] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [newTimeSlot, setNewTimeSlot] = useState({ start: "", end: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const response = await ApiService.getGrades({ page: 1 });
      setGrades(response.data);
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  };

  const fetchStreams = async (gradeId) => {
    try {
      setStreams([]);
      setSelectedStream("");
      const response = await ApiService.getStream({ page: 1, grade: gradeId });
      setStreams(response.data);
    } catch (error) {
      console.error("Error fetching streams:", error);
    }
  };

  const fetchLearningAreas = async () => {
    try {
      const response = await ApiService.getLearningAreas({
        limit: 100000,
        grade: selectedGrade,
      });
      setLearningAreas(response.data);
    } catch (error) {
      console.error("Error fetching learning areas:", error);
    }
  };

  const fetchTimetable = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getTimetable(
        selectedGrade,
        selectedStream
      );
      setTimetable(response.data);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSession = async (day, periodIndex, subject) => {
    try {
      const response = await ApiService.updateTimetablePeriod(
        selectedGrade,
        selectedStream,
        day,
        periodIndex,
        subject
      );
      setTimetable(response.data);
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const addNewTimeSlot = async () => {
    if (!newTimeSlot.start || !newTimeSlot.end) return;

    try {
      setIsLoading(true);
      const response = await ApiService.addTimeSlot(
        selectedGrade,
        selectedStream,
        newTimeSlot.start,
        newTimeSlot.end
      );
      setTimetable(response.data);
      setNewTimeSlot({ start: "", end: "" });
    } catch (error) {
      console.error("Error adding time slot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeTimeSlot = async (index) => {
    try {
      setIsLoading(true);
      const response = await ApiService.removeTimeSlot(
        selectedGrade,
        selectedStream,
        index
      );
      setTimetable(response.data);
    } catch (error) {
      console.error("Error removing time slot:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStream) {
      fetchLearningAreas();
      fetchTimetable();
    }
  }, [selectedStream]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-4">Timetable Manager</h2>

      {/* Grade and Stream Selection */}
      <div className="flex space-x-4 mb-6">
        <select
          className="border p-2 rounded"
          value={selectedGrade}
          onChange={(e) => {
            setSelectedGrade(e.target.value);
            fetchStreams(e.target.value);
          }}
        >
          <option value="">Select Grade</option>
          {grades.map((grade) => (
            <option key={grade._id} value={grade._id}>
              {grade.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={selectedStream}
          onChange={(e) => setSelectedStream(e.target.value)}
          disabled={!selectedGrade}
        >
          <option value="">Select Stream</option>
          {streams.map((stream) => (
            <option key={stream.id} value={stream.id}>
              {stream.name}
            </option>
          ))}
        </select>
      </div>

      {/* New Time Slot Form */}
      {selectedStream && (
        <div className="mb-6 p-4 border rounded">
          <h3 className="text-md font-medium mb-2">Add New Time Slot</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Start (e.g., 8:20 AM)"
              value={newTimeSlot.start}
              onChange={(e) =>
                setNewTimeSlot({ ...newTimeSlot, start: e.target.value })
              }
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="End (e.g., 8:55 AM)"
              value={newTimeSlot.end}
              onChange={(e) =>
                setNewTimeSlot({ ...newTimeSlot, end: e.target.value })
              }
              className="border p-2 rounded"
            />
            <Button onClick={addNewTimeSlot} disabled={isLoading}>
              Add Slot
            </Button>
          </div>
        </div>
      )}

      {/* Timetable Display */}
      {timetable && (
        <div className="overflow-x-auto">
          <Table className="border-separate border-spacing-0">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="sticky left-0 bg-white border-b border-r">
                  Day
                </Table.Th>
                {timetable.schedule[0]?.periods.map((period, index) => (
                  <Table.Th
                    key={index}
                    className="text-center border-b px-4 py-2 bg-gray-50 relative"
                  >
                    {period.timeSlot.startTime} - {period.timeSlot.endTime}
                    <button
                      onClick={() => removeTimeSlot(index)}
                      className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                      title="Remove time slot"
                    >
                      ×
                    </button>
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {DAYS.map((day) => {
                const daySchedule = timetable.schedule.find(
                  (s) => s.day === day
                );
                return (
                  <Table.Tr key={day}>
                    <Table.Td className="sticky left-0 bg-white border-b border-r px-4 py-2 font-semibold">
                      {day}
                    </Table.Td>
                    {daySchedule?.periods.map((period, index) => (
                      <Table.Td
                        key={index}
                        className="border-b text-center px-4 py-2"
                      >
                        {period.isSpecial ? (
                          <span className="font-semibold text-blue-600">
                            {period.subject}
                          </span>
                        ) : (
                          <select
                            className="border p-1 rounded w-full"
                            value={period.subject}
                            onChange={(e) =>
                              updateSession(day, index, e.target.value)
                            }
                            disabled={isLoading}
                          >
                            {learningAreas.map((area) => (
                              <option key={area._id} value={area.name}>
                                {area.name}
                              </option>
                            ))}
                            <option value="Free">Free</option>
                          </select>
                        )}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default TimetableManager;
