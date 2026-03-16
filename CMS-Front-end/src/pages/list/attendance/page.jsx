import { useMemo, useState } from "react";
import { Search, Plus, Filter, Eye, Trash2, Calendar, Clock } from "lucide-react";
import { exportToCsv } from "../../../lib/exportCsv";
import { Card } from "../../../lib/designSystem";
import { useBackendList } from "../../../hooks/useBackendList";
import { useAuth } from "../../../contexts/AuthContext";
import { FormModel } from "../../../components/FormModel";
import { apiRequest } from "../../../lib/apiClient";

const cn = (...values) => values.filter(Boolean).join(" ");

// Custom StatsCard for attendance page
function StatsCard({ icon, label, value, color = "blue" }) {
    const Icon = icon;
    const colorClasses = {
        blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
        emerald: { bg: "from-emerald-600 to-emerald-400", accent: "bg-emerald-100 text-emerald-600" },
        amber: { bg: "from-amber-600 to-amber-400", accent: "bg-amber-100 text-amber-600" },
        yellow: { bg: "from-yellow-500 to-amber-400", accent: "bg-yellow-100 text-amber-600" },
    };
    const palette = colorClasses[color] || colorClasses.blue;

    return (
        <Card gradient className="p-6 group relative overflow-hidden">
            <div className={cn("absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity", `bg-gradient-to-br ${palette.bg}`)} />
            <div className="relative z-10">
                <div className={cn("w-12 h-12 p-3 rounded-xl mb-3", palette.accent)}>
                    <Icon size={24} />
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
    const { data: attendance, setData: setAttendance, loading } = useBackendList("attendance");
    const { user } = useAuth();

    const [sortDirection, setSortDirection] = useState("none");
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 9;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleDeleteAttendance = async (recordId) => {
        if (user?.type !== "admin" && user?.type !== "teacher") return;
        if (!window.confirm("Are you sure you want to delete this attendance record?")) return;
        try {
            await apiRequest(`/attendance/${recordId}`, { method: "DELETE" });
            setAttendance((prev) => prev.filter((record) => record.id !== recordId));
            if (currentPage > 0 && (attendance.length - 1) % pageSize === 0) {
                setCurrentPage(currentPage - 1);
            }
        } catch (err) {
            alert(err.message || "Failed to delete attendance");
        }
    };

    const addAttendanceFields = [
        { name: "student", placeholder: "Student name" },
        { name: "class", placeholder: "Class" },
        { name: "date", type: "date", placeholder: "Date" },
        { name: "status", placeholder: "Status (Present/Late/Absent)" },
    ];

    const handleAddAttendance = async (formData) => {
        try {
            const payload = {
                username: formData.student.trim(),
                courseId: formData.class ? Number(formData.class) : undefined,
                date: formData.date,
                status: (formData.status || "Present").trim(),
            };
            const response = await apiRequest("/attendance", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            const record = response?.data
                ? {
                    id: response.data.id,
                    studentName: formData.student.trim(),
                    class: formData.class || "N/A",
                    date: formData.date,
                    status: payload.status,
                }
                : null;
            setAttendance((prev) => (record ? [record, ...prev] : prev));
            setIsAddModalOpen(false);
            setCurrentPage(0);
        } catch (err) {
            alert(err.message || "Failed to add attendance");
        }
    };

    const filteredAndSortedRecords = useMemo(() => {
        const query = (searchInput || "").toLowerCase();
        let result = attendance.filter((record) => {
            const name = record.studentName || record.student || "";
            const className = record.class || record.course || "";
            return name.toLowerCase().includes(query) || className.toLowerCase().includes(query);
        });

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
                    <div className="flex gap-3 flex-wrap justify-end">
                        <button
                            onClick={() => exportToCsv("attendance.csv", filteredAndSortedRecords)}
                            className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition"
                        >
                            Export CSV
                        </button>
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
                        {(user?.type === "teacher" || user?.type === "admin") && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium transition flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add Record
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Loading State */}
            {loading ? (
                <Card gradient className="p-12 text-center">
                    <Calendar size={48} className="mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-500 text-lg">Loading attendance...</p>
                </Card>
            ) : paginatedRecords.length === 0 ? (
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

            {(user?.type === "teacher" || user?.type === "admin") && isAddModalOpen && (
                <FormModel
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddAttendance}
                    title="Add Attendance"
                    submitLabel="Save"
                    fields={addAttendanceFields}
                />
            )}
        </div>
    );
}
