import { useEffect, useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { apiRequest } from "../lib/apiClient";

export function BigCalendar() {
  const localizer = momentLocalizer(moment);
  const [view, setView] = useState(Views.WORK_WEEK);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let active = true;
    const loadEvents = async () => {
      try {
        const response = await apiRequest("/public/calendar-events");
        if (!active) return;
        const calendarEvents = (response?.data || []).map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
        }));
        setEvents(calendarEvents);
      } catch {
        if (active) {
          setEvents([]);
        }
      }
    };
    loadEvents();
    return () => {
      active = false;
    };
  }, []);

  return (
    <Calendar
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      views={[Views.WORK_WEEK, Views.DAY]}
      view={view}
      onView={setView}
      defaultDate={new Date()}
      min={new Date(1970, 0, 1, 8, 0, 0)}
      max={new Date(1970, 0, 1, 17, 0, 0)}
      style={{ height: "98%" }}
    />
  );
}
