import { useEffect, useState } from "react";
import { Calendar } from "react-calendar";
import { Link } from "react-router-dom";
import 'react-calendar/dist/Calendar.css';
import { apiRequest } from "../lib/apiClient";

export function EventCalender() {
    const [value, onChange] = useState(new Date());
    const [events, setEvents] = useState([]);

    useEffect(() => {
        let active = true;
        const loadEvents = async () => {
            try {
                const response = await apiRequest("/public/lists/events?limit=4");
                if (!active) return;
                const rows = (response?.data || []).map((event) => ({
                    id: event.id,
                    assignmentId: event.assignmentId || event.id,
                    title: event.title,
                    time: `${event.startTime || "--:--"} - ${event.endTime || "--:--"}`,
                    description: `Class: ${event.class} | Date: ${event.date}`,
                    isUrgent: Boolean(event.isUrgent),
                }));
                setEvents(rows);
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
        <div className="w-full shrink-0 rounded-xl bg-white p-4">            
            <Calendar onChange={onChange} value={value} />
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold my-3">Events</h1>
                <Link to="/list/assignments" className="text-xs text-blue-600 hover:underline">
                    View All
                </Link>
            </div>
            <div className="flex flex-col gap-4">
                {events.map((event)=>(
                    <Link
                        key={event.id}
                        to="/list/assignments"
                        className={`block overflow-hidden rounded-md border border-gray-100 border-t-4 p-3 transition hover:bg-gray-50 ${
                            event.isUrgent ? "border-t-red-300" : "odd:border-t-blue-200 even:border-t-purple-300"
                        }`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h1 className="min-w-0 break-words text-sm font-semibold text-gray-600">{event.title}</h1>
                                <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                    event.isUrgent ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                }`}>
                                    {event.isUrgent ? "Urgent" : "Latest"}
                                </span>
                            </div>
                            <span className="shrink-0 text-xs text-gray-400">{event.time}</span>
                        </div>
                        <p className="mt-2 break-words text-xs leading-5 text-gray-600">{event.description}</p>
                    </Link>
                ))}
                {events.length === 0 && <p className="text-xs text-gray-500">No events found.</p>}
            </div>
        </div>
    );
}
