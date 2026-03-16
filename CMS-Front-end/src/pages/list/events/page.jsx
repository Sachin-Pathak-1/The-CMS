import { useMemo, useState } from "react";
import { usePagination } from "../../../hooks/usePagination";
import { getVisibleRows } from "../../../lib/listUtils";
import { useBackendList } from "../../../hooks/useBackendList";
import { Search, Calendar, Clock } from "lucide-react";
import { Card } from "../../../lib/designSystem";

const cn = (...values) => values.filter(Boolean).join(" ");

// Custom StatsCard for list pages
function StatsCard(props) {
    const { label, value, icon, color = "blue" } = props;
    const Icon = icon;
    const colorClasses = {
        blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
        purple: { bg: "from-purple-600 to-purple-400", accent: "bg-purple-100 text-purple-600" },
    };

    return (
        <Card gradient className="p-6 group relative overflow-hidden">
            <div className={cn("absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity", `bg-gradient-to-br ${colorClasses[color].bg}`)} />
            <div className="relative z-10">
                <div className={cn("w-12 h-12 p-3 rounded-xl mb-3", colorClasses[color].accent)}>
                    <Icon size={24} />
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
        </Card>
    );
}

function EventCard({ event }) {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const isUpcoming = eventDate > new Date();
    const statusBadge = isUpcoming ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600";

    return (
        <Card gradient className="p-5 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 text-lg">{event.title}</h3>
                    <p className={cn("text-xs font-medium px-2.5 py-1 rounded-full mt-2 inline-block", statusBadge)}>
                        {isUpcoming ? "Upcoming" : "Past"}
                    </p>
                </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={16} className="text-purple-600 flex-shrink-0" />
                    <span>{event.class || "No class"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar size={16} className="text-blue-600 flex-shrink-0" />
                    <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>
                        {event.startTime} - {event.endTime}
                    </span>
                </div>
            </div>
        </Card>
    );
}

export function EventsListPage() {
    const { data: events, loading, error } = useBackendList("events");
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("desc");

    const upcomingEventCount = events.filter((e) => new Date(e.date) > new Date()).length;

    const visibleEvents = useMemo(
        () => getVisibleRows(events, { query: filterQuery, sortAccessor: "date", sortDirection }),
        [events, filterQuery, sortDirection]
    );

    const { currentPage, paginatedData: paginatedEvents, setCurrentPage, totalPages } = usePagination(
        visibleEvents,
        { pageSize: 9 }
    );

    return (
        <div className="space-y-8 px-4 py-8 md:px-8">
            <div className="flex flex-col gap-2 mb-6">
                <span className="text-xs font-semibold text-purple-600 uppercase tracking-widest">
                    Events Management
                </span>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Events
                </h1>
                <p className="text-slate-600">Manage and organize all upcoming events and schedules</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <StatsCard label="Total Events" value={events.length} icon={Calendar} color="blue" />
                <StatsCard label="Upcoming Events" value={upcomingEventCount} icon={Clock} color="purple" />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search events by title..."
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition"
                        />
                    </div>
                </div>
                <button
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition whitespace-nowrap"
                >
                    Sort {sortDirection === "asc" ? "↑" : "↓"}
                </button>
            </div>

            {loading && (
                <div className="text-center py-12">
                    <p className="text-slate-600">Loading events...</p>
                </div>
            )}

            {error && (
                <Card gradient className="p-6 border-rose-200">
                    <p className="text-rose-700">Error: {error}</p>
                </Card>
            )}

            {!loading && paginatedEvents.length === 0 && !filterQuery && (
                <Card gradient className="p-12 text-center border-dashed">
                    <Calendar size={48} className="mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 text-lg">No events yet</p>
                    <p className="text-slate-500 text-sm">Create your first event to get started</p>
                </Card>
            )}

            {!loading && paginatedEvents.length === 0 && filterQuery && (
                <Card gradient className="p-12 text-center border-dashed">
                    <Search size={48} className="mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 text-lg">No events found</p>
                    <p className="text-slate-500 text-sm">Try adjusting your search criteria</p>
                </Card>
            )}

            {!loading && paginatedEvents.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {paginatedEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={cn(
                                        "w-10 h-10 rounded-lg font-medium transition",
                                        currentPage === i + 1
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                                    )}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
