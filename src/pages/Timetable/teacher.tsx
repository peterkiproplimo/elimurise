import React, { useState, useEffect, useRef } from "react";
import * as ApiService from "../../services/auth";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface TimeSlot {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  isFixed: boolean;
}

interface Stream {
  name: string;
  grade: string;
}

interface LearningArea {
  name: string;
}

interface SpecialPeriod {
  name: string;
}

interface Period {
  type: string;
  learning_area?: LearningArea;
  specialPeriod?: SpecialPeriod;
  stream?: Stream;
}

interface Session {
  timeSlot: TimeSlot;
  period: Period;
}

interface DayTimetable {
  [day: string]: Session[];
}

interface TeacherTimetableResponse {
  timetables: { timetable: DayTimetable }[];
  timeSlots: TimeSlot[];
  days: string[];
  teacher?: { name: string };
}

const TeacherTimetable = () => {
  const [timetables, setTimetables] = useState<{ timetable: DayTimetable }[]>(
    []
  );
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [teacherName, setTeacherName] = useState("");
  const [loading, setLoading] = useState(true);
  const tableRef = useRef<HTMLTableElement | null>(null);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response: TeacherTimetableResponse =
          await ApiService.getTimetableTeacher({});
        setTimetables(response.timetables || []);
        setTimeSlots(response.timeSlots || []);
        setDays(response.days || []);
        setTeacherName(response.teacher?.name || "Teacher");
      } catch (error) {
        console.error("Error fetching timetable:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  const exportToPDF = async () => {
    const table = tableRef.current;
    if (!table) return;
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

    pdf.save(`Timetable_${teacherName}.pdf`);
  };

  const getSpanInfo = (timeSlotId: string) => {
    const periodDetails = days.map((day: string) => {
      const periods = timetables
        .flatMap(({ timetable }) =>
          (timetable[day] || [])
            .filter((s: Session) => s.timeSlot._id === timeSlotId)
            .map((s) => s.period)
        )
        .filter((p) => p.type !== "Free");
      return periods.length ? periods[0] : null;
    });

    const firstPeriod = periodDetails[0];
    const isSameAcrossDays = periodDetails.every(
      (period) =>
        period &&
        firstPeriod &&
        period.type === firstPeriod.type &&
        period.learning_area?.name === firstPeriod.learning_area?.name &&
        period.specialPeriod?.name === firstPeriod.specialPeriod?.name &&
        period.stream?.name === firstPeriod.stream?.name &&
        period.stream?.grade === firstPeriod.stream?.grade
    );
    return { isSameAcrossDays, period: firstPeriod };
  };

  if (loading)
    return <div className="text-center text-gray-500 p-4">Loading...</div>;

  if (!timetables.length || !timeSlots.length || !days.length) {
    return (
      <div className="text-center text-red-500 p-4">
        No timetable data available
      </div>
    );
  }

  return (
    <div className="timetable-container p-4 max-w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold uppercase text-center flex-1">
          My Timetable
        </h2>
      </div>

      <div className="flex justify-end mb-2">
        <button
          onClick={exportToPDF}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
        >
          Export PDF
        </button>
      </div>

      <table
        ref={tableRef}
        className="w-full border border-gray-300 shadow-md rounded overflow-hidden text-sm"
      >
        <thead className="bg-gray-800 text-white uppercase text-xs tracking-wide">
          <tr>
            <th className="border border-gray-300 p-3 text-center">Day</th>
            {timeSlots.map((ts) => (
              <th
                key={ts._id}
                className="border border-gray-300 p-3 text-center whitespace-nowrap"
              >
                {ts.startTime.replace(/^0/, "")} -{" "}
                {ts.endTime.replace(/^0/, "")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, dayIndex) => (
            <tr key={day} className="bg-white even:bg-gray-50">
              <td className="border border-gray-300 p-3 font-semibold text-center text-gray-700">
                {day.slice(0, 3)}
              </td>
              {timeSlots.map((ts, slotIndex) => {
                if (ts.isFixed) {
                  if (dayIndex === 0) {
                    return (
                      <td
                        key={ts._id}
                        rowSpan={days.length}
                        className="border border-gray-300 w-[20px] bg-yellow-100 text-yellow-800 text-center font-semibold p-1"
                      >
                        <div
                          className="transform rotate-90 text-xl font-bold"
                          style={{ transformOrigin: "center" }}
                        >
                          {ts.name}
                        </div>
                      </td>
                    );
                  }
                  return null;
                }

                const { isSameAcrossDays, period } = getSpanInfo(ts._id);

                if (isSameAcrossDays) {
                  if (dayIndex === 0) {
                    return (
                      <td
                        key={ts._id}
                        rowSpan={days.length}
                        className="border border-gray-300 text-center p-2"
                      >
                        <span className="block font-medium text-blue-700">
                          {period?.type === "learning_area"
                            ? period.learning_area?.name?.split(" ")[0]
                            : period?.specialPeriod?.name?.split(" ")[0] ||
                              "Free"}
                        </span>
                      </td>
                    );
                  }
                  return null;
                }

                const periods = timetables
                  .flatMap(({ timetable }) =>
                    (timetable[day] || [])
                      .filter((s: Session) => s.timeSlot._id === ts._id)
                      .map((s) => s.period)
                  )
                  .filter((p) => p.type !== "Free");

                if (!periods.length) {
                  return (
                    <td
                      key={ts._id}
                      className="border border-gray-300 text-center text-gray-400 italic p-2"
                    >
                      Free
                    </td>
                  );
                }

                return (
                  <td
                    key={ts._id}
                    className="border border-gray-300 text-center text-gray-800 p-2"
                  >
                    {periods.map((period, index) => (
                      <div key={index} className="leading-tight">
                        <span className="block font-semibold text-indigo-600">
                          {period.type === "learning_area"
                            ? period.learning_area?.name?.split(" ")[0]
                            : period.specialPeriod?.name?.split(" ")[0] || "?"}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {period.stream?.grade} {period.stream?.name}
                        </span>
                      </div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTimetable;
