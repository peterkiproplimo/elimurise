import "@fullcalendar/react/dist/vdom";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { DateClickArg } from "@fullcalendar/interaction";
// import DatesSetArg from "@fullcalendar/interaction/DatesSetArg";
interface CalendarProps {
  initialDate?: string;
  events?: Array<{ title: string; date: string; end?: string }>; // Adjusted 'start' to 'date' for consistency
  onDateClick?: (dateStr: string) => void;
  onMonthChange?: (newDate: Date) => void; // Added for month navigation
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  initialDate = new Date().toISOString().split("T")[0],
  events = [],
  onDateClick,
  onMonthChange,
  className,
}) => {
  const handleDateClick = (info: DateClickArg) => {
    if (onDateClick) {
      onDateClick(info.dateStr);
    }
  };

  const handleDatesSet = (dateInfo: any) => {
    const newMonthStart = new Date(
      dateInfo.view.currentStart.getFullYear(),
      dateInfo.view.currentStart.getMonth(),
      1
    );

    console.log("month chnaged", dateInfo.view);

    if (onMonthChange) {
      const newMonthStart = new Date(
        dateInfo.view.currentStart.getFullYear(),
        dateInfo.view.currentStart.getMonth(),
        1
      );
      onMonthChange(newMonthStart); // Trigger month change callback
    }
  };

  return (
    <div
      className={`bg-white dark:bg-darkmode-600 rounded-xl shadow-lg p-4 ${className}`}
    >
      <FullCalendar
        plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth" // Default to month view
        initialDate={initialDate}
        events={events}
        dateClick={handleDateClick}
        datesSet={handleDatesSet} // Detect month navigation
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "", // Simplified; customize as needed
        }}
        droppable={true}
        editable={true}
        dayMaxEvents={3} // Limit events per day for cleaner look
        eventBackgroundColor="#6366f1" // Indigo base color
        eventBorderColor="#4f46e5"
        eventTextColor="#ffffff"
        height="auto" // Responsive height
        drop={(info) => {
          const checkbox = document.querySelector(
            "#checkbox-events"
          ) as HTMLInputElement;
          if (checkbox?.checked) {
            info.draggedEl.parentNode?.removeChild(info.draggedEl);
            const eventContainer = document.querySelector(
              "#calendar-events"
            ) as HTMLElement;
            if (eventContainer && eventContainer.children.length === 1) {
              document
                .querySelector("#calendar-no-events")
                ?.classNameList.remove("hidden");
            }
          }
        }}
      />
      <style>{`
        /* Premium FullCalendar Customizations */
       
      `}</style>
    </div>
  );
};

export default Calendar;
