import { useState, useEffect } from "react";
import Button from "../../base-components/Button";
import Table from "../../base-components/Table";
import * as ApiService from "../../services/auth";
import { stream } from "exceljs";

const TIME_SLOTED = {
  BREAK1: ["9:30 AM", "9:50 AM"],
  BREAK2: ["11:00 AM", "11:30 AM"],
  LUNCH: ["12:40 PM", "2:00 PM"],
  COFFEE: ["2:35 PM", "3:10 PM"],
};

const SPECIAL_PERIODS = {
  FRIDAY: { PPI: ["8:20 AM", "8:55 AM"] },
  MONDAY: { ASSEMBLY: ["8:20 AM", "8:55 AM"] },
};

const TIME_SLOTS = [
  ["8:20 AM", "8:55 AM"],
  ["8:55 AM", "9:30 AM"],
  TIME_SLOTED.BREAK1,
  ["9:50 AM", "10:25 AM"],
  ["10:25 AM", "11:00 AM"],
  TIME_SLOTED.BREAK2,
  ["11:30 AM", "12:05 PM"],
  ["12:05 PM", "12:40 PM"],
  TIME_SLOTED.LUNCH,
  ["2:00 PM", "2:35 PM"],
  TIME_SLOTED.COFFEE,
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function Timetable() {
  const [grades, setGrades] = useState([]);
  const [streams, setStreams] = useState([]);
  const [learningAreas, setLearningAreas] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStream, setSelectedStream] = useState("");
  const [timetable, setTimetable] = useState(null);

  useEffect(() => {
    getGrades();
  }, []);

  const getGrades = async () => {
    const response = await ApiService.getGrades({ page: 1 });
    setGrades(response.data);
  };

  const getStreams = async (grade) => {
    setStreams([]);
    setSelectedStream("");
    const response = await ApiService.getStream({ page: 1, grade });
    setStreams(response.data);
  };

  const getLearningAreas = async () => {
    const response = await ApiService.getLearningAreas({
      limit: 100000,
      grade: selectedGrade,
    });
    setLearningAreas(response.data);
  };

  const generateRandomTimetable = () => {
    if (!learningAreas.length) return;

    const schedule = {};

    DAYS.forEach((day) => {
      schedule[day] = TIME_SLOTS.map(([start, end]) => {
        if (SPECIAL_PERIODS[day]) {
          const special = Object.entries(SPECIAL_PERIODS[day]).find(
            ([, [s, e]]) => s === start && e === end
          );
          if (special) return special[0];
        }

        const randomIndex = Math.floor(Math.random() * learningAreas.length);
        return learningAreas[randomIndex]?.name || "Free";
      });
    });

    setTimetable({ timeSlots: TIME_SLOTS, schedule });
  };

  const updateTimetableEntry = (day, periodIndex, newValue) => {
    setTimetable((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: prev.schedule[day].map((entry, i) =>
          i === periodIndex ? newValue : entry
        ),
      },
    }));
  };
  useEffect(() => {
    getLearningAreas();
  }, [selectedStream]);

  return (
    <div>
      <h2 className="text-lg font-medium">Weekly Timetable</h2>
      <div className="mt-4 flex space-x-4">
        <select
          className="border p-2 rounded"
          value={selectedGrade}
          onChange={(e) => {
            setSelectedGrade(e.target.value);
            getStreams(e.target.value);
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

        <Button
          onClick={generateRandomTimetable}
          disabled={!selectedGrade || !selectedStream}
        >
          Generate Timetable
        </Button>
      </div>

      {timetable && (
        <div className="mt-5 overflow-x-auto">
          <Table className="border-separate border-spacing-0">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="sticky left-0 bg-white border-b border-r">
                  Day
                </Table.Th>
                {TIME_SLOTS.map(([start, end], index) => (
                  <Table.Th
                    key={index}
                    className="text-center border-b px-4 py-2 bg-gray-50"
                  >
                    {start} - {end}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {DAYS.map((day) => (
                <Table.Tr key={day}>
                  <Table.Td className="sticky left-0 bg-white border-b border-r px-4 py-2 font-semibold">
                    {day}
                  </Table.Td>
                  {timetable.timeSlots.map(([start, end], periodIndex) => (
                    <Table.Td
                      key={periodIndex}
                      className="border-b text-center px-4 py-2"
                    >
                      {SPECIAL_PERIODS[day] &&
                      Object.values(SPECIAL_PERIODS[day]).some(
                        ([s, e]) => s === start && e === end
                      ) ? (
                        <span className="font-semibold text-blue-600">
                          {Object.keys(SPECIAL_PERIODS[day]).find(
                            (key) => SPECIAL_PERIODS[day][key][0] === start
                          )}
                        </span>
                      ) : (
                        <select
                          className="border p-1 rounded"
                          value={timetable.schedule[day][periodIndex]}
                          onChange={(e) =>
                            updateTimetableEntry(
                              day,
                              periodIndex,
                              e.target.value
                            )
                          }
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
              ))}
            </Table.Tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default Timetable;
