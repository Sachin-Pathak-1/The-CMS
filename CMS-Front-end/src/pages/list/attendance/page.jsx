import { useMemo, useState } from "react";
import { Search, Plus, Filter, Eye, Trash2, Calendar, Clock } from "lucide-react";

const cn = (...values) => values.filter(Boolean).join(" ");

function Card({ children, className = "", gradient = false }) {
    return (
        <div className={cn(
            "rounded-2xl border transition-all duration-300",
            gradient
                ? "bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border-white/30 shadow-2xl hover:shadow-lg"
                : "bg-white border-slate-200 shadow-sm hover:shadow-md",
            className
        )}>
            {children}
        </div>
    );
}

function StatsCard({ label, value, icon, color = "amber" }) {
    const Icon = icon;
    const colorClasses = {
        amber: { bg: "from-amber-600 to-yellow-500", accent: "bg-amber-100 text-amber-600" },
        yellow: { bg: "from-yellow-600 to-yellow-400", accent: "bg-yellow-100 text-yellow-600" },
    };

    return (
        <Card gradient className="p-6 group relative overflow-hidden">
            <div className={cn("absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity", `bg-gradient-to-br ${colorClasses[color].bg}`)} />
            <div className="relative z-10">
                <div className={cn("w-12 h-12 p-3 rounded-xl mb-3", colorClasses[color].accent)}>
                    {Icon && <Icon size={24} />}
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
        </Card>
    );
}

function AttendanceCard({ record, onDelete }) {
    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Present":
                return "text-green-600 bg-green-50";
            case "Late":
                return "text-yellow-600 bg-yellow-50";
            case "Absent":
                return "text-red-600 bg-red-50";
            default:
                return "text-slate-600 bg-slate-50";
        }
    };

    return (
        <Card gradient className="p-5 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate text-lg">{record.studentName}</h3>
                    <p className="text-sm text-slate-500 truncate mt-1">{record.class}</p>
                    <div className="flex items-center gap-2 mt-3">
                        <Calendar size={16} className="text-slate-400" />
                        <span className="text-xs text-slate-500">{formatDate(record.date)}</span>
                    </div>
                    <div className="mt-3">
                        <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize", getStatusColor(record.status))}>
                            {record.status}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 ms-4">
                    <button
                        className="p-2 hover:bg-amber-50 rounded-lg transition"
                        title="View details"
                    >
                        <Eye size={18} className="text-amber-600" />
                    </button>
                    <button
                        onClick={() => onDelete(record.id)}
                        className="p-2 hover:bg-rose-50 rounded-lg transition"
                        title="Delete record"
                    >
                        <Trash2 size={18} className="text-rose-600" />
                    </button>
                </div>
            </div>
        </Card>
    );
}

export function AttendanceListPage() {
    const [attendance, setAttendance] = useState([
        { id: 1, studentName: "Alice Johnson", class: "10A", date: "2026-03-15", status: "Present" },
        { id: 2, studentName: "Bob Smith", class: "10A", date: "2026-03-15", status: "Late" },
        { id: 3, studentName: "Carol White", class: "10B", date: "2026-03-15", status: "Present" },
        { id: 4, studentName: "David Brown", class: "10A", date: "2026-03-15", status: "Absent" },
        { id: 5, studentName: "Emma Davis", class: "10B", date: "2026-03-15", status: "Present" },
        { id: 6, studentName: "Frank Miller", class: "10A", date: "2026-03-15", status: "Present" },
        { id: 7, studentName: "Grace Wilson", class: "10C", date: "2026-03-15", status: "Late" },
        { id: 8, studentName: "Henry Moore", class: "10B", date: "2026-03-15", status: "Present" },
        { id: 9, studentName: "Ivy Taylor", class: "10A", date: "2026-03-15", status: "Present" },
        { id: 10, studentName: "Jack Anderson", class: "10C", date: "2026-03-15", status: "Absent" },
        { id: 11, studentName: "Kate Thomas", class: "10B", date: "2026-03-15", status: "Present" },
        { id: 12, studentName: "Liam Jackson", class: "10A", date: "2026-03-15", status: "Present" },
    ]);

    const [sortDirection, setSortDirection] = useState("none");
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 9;

    const handleDeleteAttendance = (recordId) => {
        if (window.confirm("Are you sure you want to delete this attendance record?")) {
            setAttendance((prev) => prev.filter((record) => record.id !== recordId));
            if (currentPage > 0 && (attendance.length - 1) % pageSize === 0) {
                setCurrentPage(currentPage - 1);
            }
        }
    };

    const filteredAndSortedRecords = useMemo(() => {
        let result = attendance.filter((record) =>
            record.studentName.toLowerCase().includes(searchInput.toLowerCase()) ||
            record.class.toLowerCase().includes(searchInput.toLowerCase())
        );

        if (sortDirection === "asc") {
            result.sort((a, b) => a.studentName.localeCompare(b.studentName));
        } else if (sortDirection === "desc") {
            result.sort((a, b) => b.studentName.localeCompare(a.studentName));
        }

        return result;
    }, [attendance, searchInput, sortDirection]);

    const totalPages = Math.ceil(filteredAndSortedRecords.length / pageSize);
    const paginatedRecords = filteredAndSortedRecords.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const presentCount = attendance.filter((r) => r.status === "Present").length;
    const presentRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-amber-50/20 p-4 md:p-8">
            {/* Header */}
            <div className="mb-10">
                <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Student Presence</p>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">Attendance Records</h1>
                <p className="text-slate-600 text-lg mt-2">Monitor and track daily student attendance.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <StatsCard
                    icon={Calendar}
                    label="Total Records"
                    value={attendance.length}
                    color="amber"
                />
                <StatsCard
                    icon={Clock}
                    label="Present Rate"
                    value={`${presentRate}%`}
                    color="yellow"
                />
            </div>

            {/* Search & Actions Bar */}
            <Card gradient className="p-6 mb-8">
                <div className="flex flex-col gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search attendance by student name, class..."
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition"
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => {
                                setCurrentPage(0);
                                setSortDirection((prev) => (prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"));
                            }}
                            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition flex items-center gap-2"
                        >
                            <Filter size={18} />
                            Sort: {sortDirection === "none" ? "Default" : sortDirection === "asc" ? "A-Z" : "Z-A"}
                        </button>
                        <button
                            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add Record
                        </button>
                    </div>
                </div>
            </Card>

            {/* Loading State */}
            {paginatedRecords.length === 0 ? (
                <Card gradient className="p-12 text-center">
                    <Calendar size={48} className="mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-500 text-lg">No attendance records found</p>
                </Card>
            ) : (
                <>
                    {/* Attendance Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                        {paginatedRecords.map((record) => (
                            <AttendanceCard
                                key={record.id}
                                record={record}
                                onDelete={handleDeleteAttendance}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 flex-wrap">
                            {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg font-medium transition",
                                        currentPage === page
                                            ? "bg-amber-600 text-white"
                                            : "bg-white border border-slate-200 text-slate-700 hover:border-amber-300"
                                    )}
                                >
                                    {page + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}



