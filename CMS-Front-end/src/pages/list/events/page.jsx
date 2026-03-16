import { useMemo, useState } from "react";
import { usePagination } from "../../../hooks/usePagination";
import { getVisibleRows } from "../../../lib/listUtils";
import { useBackendList } from "../../../hooks/useBackendList";
import { FormModel } from "../../../components/FormModel";
import { Search, Plus, Trash2, Calendar, Clock, Edit2 } from "lucide-react";

const cn = (...values) => values.filter(Boolean).join(" ");

function Card({ children, className = "", gradient = false }) {
    return (
        <div
            className={cn(
                "rounded-2xl border transition-all duration-300",
                gradient
                    ? "bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border-white/30 shadow-2xl hover:shadow-lg"
                    : "bg-white border-slate-200 shadow-sm hover:shadow-md",
                className
            )}
        >
            {children}
        </div>
    );
}

function StatsCard({ label, value, icon: Icon, color = "blue" }) {
    const colorClasses = {
        blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
        purple: { bg: "from-purple-600 to-purple-400", accent: "bg-purple-100 text-purple-600" },
    };

    return (
        <Card gradient className="p-6 group relative overflow-hidden">
            <div
                className={cn(
                    "absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity",
                    `bg-gradient-to-br ${colorClasses[color].bg}`
                )}
            />
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

function EventCard({ event, onEdit, onDelete, canManage }) {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const isUpcoming = eventDate > new Date();
    const statusColor = isUpcoming ? "from-emerald-100 to-emerald-50" : "from-slate-100 to-slate-50";
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
                {canManage && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(event)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition"
                            title="Edit event"
                        >
                            <Edit2 size={18} className="text-blue-600" />
                        </button>
                        <button
                            onClick={() => onDelete(event.id)}
                            className="p-2 hover:bg-rose-50 rounded-lg transition"
                            title="Delete event"
                        >
                            <Trash2 size={18} className="text-rose-600" />
                        </button>
                    </div>
                )}
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
    const { data: events, setData: setEvents, loading, error, reload } = useBackendList("events");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("desc");
    const [actionError, setActionError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const addEventFields = [
        { name: "title", placeholder: "Event Title", required: true },
        { name: "class", placeholder: "Class / Department", required: true },
        { name: "date", type: "date", placeholder: "Date", required: true },
        { name: "startTime", type: "time", placeholder: "Start Time", required: true },
        { name: "endTime", type: "time", placeholder: "End Time", required: true },
    ];

    const upcomingEventCount = events.filter((e) => new Date(e.date) > new Date()).length;

    const handleAddEvent = (formData) => {
        try {
            setActionError("");

            // Validate times
            if (formData.startTime >= formData.endTime) {
                setActionError("End time must be after start time");
                return;
            }

            const newEvent = {
                id: events.length ? Math.max(...events.map((e) => e.id)) + 1 : 1,
                title: formData.title.trim(),
                class: formData.class.trim(),
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
            };

            if (editingEvent) {
                setEvents((prev) =>
                    prev.map((event) => (event.id === editingEvent.id ? { ...newEvent, id: editingEvent.id } : event))
                );
                setEditingEvent(null);
            } else {
                setEvents((prev) => [newEvent, ...prev]);
            }

            setIsAddModalOpen(false);
        } catch (err) {
            setActionError(err.message || "Failed to save event");
        }
    };

    const handleDeleteEvent = (eventId) => {
        try {
            setActionError("");
            setEvents((prev) => prev.filter((event) => event.id !== eventId));
            setDeleteConfirm(null);
        } catch (err) {
            setActionError(err.message || "Failed to delete event");
        }
    };

    const handleEditEvent = (event) => {
        setEditingEvent(event);
        setIsAddModalOpen(true);
    };

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

            {actionError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    {actionError}
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="p-6 max-w-sm">
                        <h2 className="text-lg font-semibold text-slate-900 mb-2">Delete Event?</h2>
                        <p className="text-sm text-slate-600 mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteEvent(deleteConfirm)}
                                className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </Card>
                </div>
            )}

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
                <button
                    onClick={() => {
                        setEditingEvent(null);
                        setIsAddModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg transition flex items-center gap-2 whitespace-nowrap"
                >
                    <Plus size={18} /> Add Event
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
                            <EventCard
                                key={event.id}
                                event={event}
                                onEdit={handleEditEvent}
                                onDelete={(id) => setDeleteConfirm(id)}
                                canManage={true}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i)}
                                    className={cn(
                                        "w-10 h-10 rounded-lg font-medium transition",
                                        currentPage === i
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

            <FormModel
                open={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingEvent(null);
                }}
                onSubmit={handleAddEvent}
                title={editingEvent ? "Edit Event" : "Add Event"}
                submitLabel={editingEvent ? "Update Event" : "Add Event"}
                fields={addEventFields}
                initialValues={editingEvent}
            />
        </div>
    );
}



