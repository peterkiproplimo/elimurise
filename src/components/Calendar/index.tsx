import "@fullcalendar/react/dist/vdom";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { CalendarOptions } from "@fullcalendar/common";
// import "./Calendar.css"; // Import the CSS file

interface CalendarProps {
  initialDate?: string;
  events?: Array<{ title: string; start: string; end?: string }>;
  onDateClick?: (dateStr: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  initialDate = new Date().toISOString().split("T")[0], // Default to today
  events = [],
  onDateClick,
}) => {
  return (
    <div className="full-calendar">
      <FullCalendar
        plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin]}
        droppable={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
        }}
        initialDate={initialDate}
        navLinks={false}
        editable={true}
        dayMaxEvents={true}
        events={events}
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
                ?.classList.remove("hidden");
            }
          }
        }}
        dateClick={(info) => {
          if (onDateClick) {
            onDateClick(info.dateStr); // Call the API callback function
          }
        }}
      />
    </div>
  );
};

export default Calendar;
