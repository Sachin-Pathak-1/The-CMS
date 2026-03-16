import { useEffect, useMemo, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import { apiRequest } from "../../lib/apiClient";
import { Card } from "../../lib/designSystem";
import { Search } from "lucide-react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

export function TimetablePage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");

    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await apiRequest("/public/calendar-events");
                if (!active) return;
                const rows = Array.isArray(res?.data) ? res.data : [];
                setEvents(rows.map((row) => ({
                    id: row.id,
                    title: row.title,
                    start: new Date(row.start),
                    end: new Date(row.end),
                    allDay: false,
                })));
            } catch (err) {
                if (active) setError(err.message || "Failed to load timetable");
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, []);

    const filtered = useMemo(() => {
        const q = query.toLowerCase();
        return events.filter((ev) => ev.title.toLowerCase().includes(q));
    }, [events, query]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/20 p-4 md:p-8">
            <div className="mb-8 flex flex-col gap-2">
                <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Schedules</p>
                <h1 className="text-4xl font-bold text-slate-900">Timetable</h1>
                <p className="text-slate-600">View all due dates and events from the backend calendar feed.</p>
            </div>

            <Card gradient className="p-5 mb-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search timetable..."
                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                    <div className="text-sm text-slate-500">
                        {loading ? "Loading events..." : `${filtered.length} events`}
                    </div>
                </div>
            </Card>

            {error && (
                <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>
            )}

            <Card gradient className="p-3 min-h-[520px]">
                {!loading && filtered.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No events in the timetable.</div>
                ) : (
                    <BigCalendar
                        localizer={localizer}
                        events={filtered}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 480 }}
                        popup
                    />
                )}
            </Card>
        </div>
    );
}
