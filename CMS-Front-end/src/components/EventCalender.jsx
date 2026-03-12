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
        <div className="glass-panel w-full shrink-0 p-5">
            <Calendar onChange={onChange} value={value} />
            <div className="flex items-center justify-between">
                <h1 className="my-3 text-lg font-semibold text-slate-800">Events</h1>
                <Link to="/list/events" className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700 hover:underline">
                    View All
                </Link>
            </div>
            <div className="flex flex-col gap-4">
                {events.map((event)=>(
                    <Link
                        key={event.id}
                        to="/list/events"
                        className={`block overflow-hidden rounded-2xl border p-4 transition hover:bg-slate-50 ${
                            event.isUrgent ? "border-rose-200 bg-rose-50/60" : "border-slate-100 bg-slate-50/80"
                        }`}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h1 className="min-w-0 break-words text-sm font-semibold text-slate-700">{event.title}</h1>
                                <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                                    event.isUrgent ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-700"
                                }`}>
                                    {event.isUrgent ? "Urgent" : "Latest"}
                                </span>
                            </div>
                            <span className="shrink-0 text-xs uppercase tracking-[0.14em] text-slate-400">{event.time}</span>
                        </div>
                        <p className="mt-3 break-words text-xs leading-6 text-slate-500">{event.description}</p>
                    </Link>
                ))}
                {events.length === 0 && <p className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">No events found.</p>}
            </div>
        </div>
    );
}
