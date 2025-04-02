import { useState, useEffect } from "react";
import Button from "../../base-components/Button";
import Table from "../../base-components/Table";
import * as ApiService from "../../services/auth";

// Backend-aligned time slots (7 periods, including break)
const TIME_SLOTS = [
  ["08:00", "08:40"], // Period 1
  ["08:40", "09:20"], // Period 2
  ["09:20", "10:00"], // Period 3
  ["10:00", "10:20"], // Break
  ["10:20", "11:00"], // Period 4
  ["11:00", "11:40"], // Period 5
  ["11:40", "12:20"], // Period 6
];

// Days of the week
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function Timetable() {
  const [gradeList, setGradeList] = useState([]);
  const [streamList, setStreamList] = useState([]);
  const [chosenGrade, setChosenGrade] = useState("");
  const [chosenStream, setChosenStream] = useState("");
  const [timetableData, setTimetableData] = useState(null);
  const [availableActivities, setAvailableActivities] = useState([]);

  // Fetch grades on mount
  useEffect(() => {
    fetchGrades();
  }, []);

  // Fetch timetable and activities when stream changes
  useEffect(() => {
    if (chosenStream) {
      fetchTimetable();
      fetchActivities();
    }
  }, [chosenStream]);

  const fetchGrades = async () => {
    try {
      const { data } = await ApiService.getGrades({ page: 1 });
      setGradeList(data);
    } catch (error) {
      console.error("Failed to load grades:", error);
    }
  };

  const fetchStreams = async (gradeId) => {
    setStreamList([]);
    setChosenStream("");
    try {
      const { data } = await ApiService.getStream({ page: 1, grade: gradeId });
      setStreamList(data);
    } catch (error) {
      console.error("Failed to load streams:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const { data } = await ApiService.getLearningAreas({
        limit: 100000,
        grade: chosenGrade,
      });
      setAvailableActivities(data);
    } catch (error) {
      console.error("Failed to load learning areas:", error);
    }
  };

  const fetchTimetable = async () => {
    try {
      const response = await ApiService.getTimetable({
        grade: chosenGrade,
        stream: chosenStream,
      });
      setTimetableData({
        timeSlots: TIME_SLOTS,
        periods: response.periods || {},
      });
    } catch (error) {
      console.error("Error loading timetable:", error);
      const defaultPeriods = {};
      WEEKDAYS.forEach((day) => {
        defaultPeriods[day] = TIME_SLOTS.map(([begin, end]) => ({
          begin,
          end,
          activity: "Free",
          fixed: false,
        }));
      });
      setTimetableData({ timeSlots: TIME_SLOTS, periods: defaultPeriods });
    }
  };

  const createTimetable = async () => {
    try {
      const response = await ApiService.generateTimetable({
        grade: chosenGrade,
        stream: chosenStream,
      });
      setTimetableData({
        timeSlots: TIME_SLOTS,
        periods: response.periods || {},
      });
    } catch (error) {
      console.error("Error creating timetable:", error);
      const defaultPeriods = {};
      WEEKDAYS.forEach((day) => {
        defaultPeriods[day] = TIME_SLOTS.map(([begin, end]) => ({
          begin,
          end,
          activity: "Free",
          fixed: false,
        }));
      });
      setTimetableData({ timeSlots: TIME_SLOTS, periods: defaultPeriods });
    }
  };

  const modifyPeriod = async (day, slotIndex, newActivity) => {
    try {
      await ApiService.updateTimetablePeriod({
        grade: chosenGrade,
        stream: chosenStream,
        day,
        periodIndex: slotIndex,
        activity: newActivity || "Free",
      });
      await fetchTimetable(); // Refresh timetable after update
    } catch (error) {
      console.error("Failed to update period:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Class Timetable</h2>
      <div className="flex gap-4 mb-6">
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={chosenGrade}
          onChange={(e) => {
            setChosenGrade(e.target.value);
            fetchStreams(e.target.value);
          }}
        >
          <option value="">Choose Grade</option>
          {gradeList.map((grade) => (
            <option key={grade._id} value={grade._id}>
              {grade.name}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={chosenStream}
          onChange={(e) => setChosenStream(e.target.value)}
          disabled={!chosenGrade}
        >
          <option value="">Choose Stream</option>
          {streamList.map((stream) => (
            <option key={stream._id} value={stream._id}>
              {stream.name}
            </option>
          ))}
        </select>

        <Button
          onClick={createTimetable}
          disabled={!chosenGrade || !chosenStream}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Timetable
        </Button>
      </div>

      {timetableData && (
        <div className="overflow-x-auto">
          <Table className="w-full border border-gray-200">
            <Table.Thead className="bg-gray-100">
              <Table.Tr>
                <Table.Th className="sticky left-0 z-10 bg-gray-100 border-b border-r border-gray-200 px-4 py-2">
                  Day
                </Table.Th>
                {timetableData.timeSlots.map(([start, end], idx) => (
                  <Table.Th
                    key={idx}
                    className="border-b border-gray-200 px-4 py-2 text-center"
                  >
                    {start}–{end}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {WEEKDAYS.map((day) => (
                <Table.Tr key={day} className="hover:bg-gray-50">
                  <Table.Td className="sticky left-0 z-10 bg-white border-b border-r border-gray-200 px-4 py-2 font-medium">
                    {day}
                  </Table.Td>
                  {timetableData.periods[day].map((period, index) => (
                    <Table.Td
                      key={index}
                      className="border-b border-gray-200 px-4 py-2 text-center"
                    >
                      {period.fixed ? (
                        <span className="text-green-600 font-semibold">
                          {period.activity}
                        </span>
                      ) : (
                        <select
                          className="w-full border border-gray-300 rounded px-2 py-1"
                          value={period.activity}
                          onChange={(e) =>
                            modifyPeriod(day, index, e.target.value)
                          }
                        >
                          <option value="Free">Free</option>
                          {availableActivities.map((activity) => (
                            <option key={activity._id} value={activity.name}>
                              {activity.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default Timetable;