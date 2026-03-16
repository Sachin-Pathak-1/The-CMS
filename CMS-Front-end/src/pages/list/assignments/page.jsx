import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Filter, Eye, Trash2, CheckCircle, AlertCircle, Download } from "lucide-react";
import { useBackendList } from "../../../hooks/useBackendList";
import { usePagination } from "../../../hooks/usePagination";
import { getVisibleRows } from "../../../lib/listUtils";
import { apiRequest } from "../../../lib/apiClient";
import { FormModel } from "../../../components/FormModel";
import { useAuth } from "../../../contexts/AuthContext";
import { Card } from "../../../lib/designSystem";
import { exportToCsv } from "../../../lib/exportCsv";

const cn = (...values) => values.filter(Boolean).join(" ");

// Custom StatsCard for assignments page
function StatsCard({ icon, label, value, color = "blue" }) {
    const Icon = icon;
    const colorClasses = {
        blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
        cyan: { bg: "from-cyan-600 to-cyan-400", accent: "bg-cyan-100 text-cyan-600" },
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

function AssignmentCard({ assignment, onDelete }) {
    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <Card gradient className="p-5 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate text-lg">{assignment.subject || assignment.title}</h3>
                    <p className="text-sm text-slate-500 truncate mt-1">{assignment.class || assignment.course?.name || "No class"}</p>
                    <div className="flex items-center gap-2 mt-3">
                        <AlertCircle size={16} className="text-slate-400" />
                        <span className="text-xs text-slate-500">Due: {formatDate(assignment.dueDate)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 ms-4">
                    <button
                        className="p-2 hover:bg-blue-50 rounded-lg transition"
                        title="View details"
                    >
                        <Eye size={18} className="text-blue-600" />
                    </button>
                    <button
                        onClick={() => onDelete(assignment.id)}
                        className="p-2 hover:bg-rose-50 rounded-lg transition"
                        title="Delete assignment"
                    >
                        <Trash2 size={18} className="text-rose-600" />
                    </button>
                </div>
            </div>
        </Card>
    );
}

export function AssignmentsListPage() {
    const { data: assignments, loading, error, reload } = useBackendList("assignments");
    const { user } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [sortDirection, setSortDirection] = useState("none");
    const [searchInput, setSearchInput] = useState("");
    const [courses, setCourses] = useState([]);
    const [actionError, setActionError] = useState("");

    const canManageAssignments = user?.type === "admin" || user?.type === "teacher";

    useEffect(() => {
        apiRequest("/courses")
            .then((response) => setCourses(Array.isArray(response?.data) ? response.data : []))
            .catch(() => setCourses([]));
    }, []);

    const addAssignmentFields = useMemo(() => ([
        { name: "subject", placeholder: "Title" },
        {
            name: "courseId",
            type: "select",
            label: "Class / Course",
            options: courses.map((course) => ({ value: course.id, label: course.name })),
        },
        { name: "description", placeholder: "Description", fullWidth: true, required: false },
        { name: "dueDate", type: "date", placeholder: "Due Date" },
    ]), [courses]);

    const handleAddAssignment = async (formData) => {
        try {
            setActionError("");
            const courseId = Number(formData.courseId);
            if (!courseId) throw new Error("Select a valid course");

            await apiRequest("/academic/assignments", {
                method: "POST",
                body: JSON.stringify({
                    title: formData.subject.trim(),
                    description: formData.description?.trim() || undefined,
                    courseId,
                    dueDate: formData.dueDate,
                }),
            });
            setIsAddModalOpen(false);
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to add assignment");
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (!canManageAssignments) return;
        if (!window.confirm("Are you sure you want to delete this assignment?")) return;
        try {
            setActionError("");
            await apiRequest(`/academic/assignments/${assignmentId}`, { method: "DELETE" });
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to delete assignment");
        }
    };

    const visibleAssignments = useMemo(
        () => getVisibleRows(assignments, { query: searchInput, sortAccessor: "subject", sortDirection }),
        [assignments, searchInput, sortDirection]
    );

    const { currentPage, paginatedData: paginatedAssignments, setCurrentPage, totalPages } = usePagination(
        visibleAssignments,
        { pageSize: 9 }
    );

    const upcomingCount = assignments.filter((a) => (a.dueDate ? new Date(a.dueDate) > new Date() : false)).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/20 p-4 md:p-8">
            {/* Header */}
            <div className="mb-10">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Academic Tasks</p>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">All Assignments</h1>
                <p className="text-slate-600 text-lg mt-2">Track and manage student assignments and submissions.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <StatsCard icon={CheckCircle} label="Total Assignments" value={assignments.length} color="blue" />
                <StatsCard icon={AlertCircle} label="Upcoming Due" value={upcomingCount} color="cyan" />
            </div>

            {/* Search & Actions Bar */}
            <Card gradient className="p-6 mb-8">
                <div className="flex flex-col gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search assignments by title, subject..."
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                setCurrentPage(0);
                            }}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
                        />
                    </div>
                    <div className="flex gap-3 flex-wrap justify-end">
                        <button
                            onClick={() => exportToCsv("assignments.csv", visibleAssignments)}
                            className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition flex items-center gap-2"
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                        <button
                            onClick={() => {
                                setCurrentPage(1);
                                setSortDirection((prev) => (prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"));
                            }}
                            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition flex items-center gap-2"
                        >
                            <Filter size={18} />
                            Sort: {sortDirection === "none" ? "Default" : sortDirection === "asc" ? "A-Z" : "Z-A"}
                        </button>
                        {canManageAssignments && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add Assignment
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {actionError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 mb-6">
                    {actionError}
                </div>
            )}

            {error && (
                <Card gradient className="p-6 border-rose-200">
                    <p className="text-rose-700">Error: {error}</p>
                </Card>
            )}

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-slate-600">Loading assignments...</p>
                </div>
            ) : paginatedAssignments.length === 0 ? (
                <Card gradient className="p-12 text-center">
                    <CheckCircle size={48} className="mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-500 text-lg">No assignments found</p>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                        {paginatedAssignments.map((assignment) => (
                            <AssignmentCard
                                key={assignment.id}
                                assignment={assignment}
                                onDelete={handleDeleteAssignment}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 flex-wrap">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg font-medium transition",
                                        currentPage === page
                                            ? "bg-blue-600 text-white"
                                            : "bg-white border border-slate-200 text-slate-700 hover:border-blue-300"
                                    )}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {canManageAssignments && (
                <FormModel
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddAssignment}
                    title="Add New Assignment"
                    submitLabel="Add Assignment"
                    fields={addAssignmentFields}
                />
            )}
        </div>
    );
}
