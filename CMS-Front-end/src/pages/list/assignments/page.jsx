import { useMemo, useState } from "react";
import { Search, Plus, Filter, Eye, Trash2, CheckCircle, AlertCircle } from "lucide-react";

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

function StatsCard({ label, value, icon: Icon, color = "blue" }) {
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

    const getStatusColor = (status) => {
        switch (status) {
            case "submitted":
                return "text-green-600 bg-green-50";
            case "pending":
                return "text-amber-600 bg-amber-50";
            case "overdue":
                return "text-rose-600 bg-rose-50";
            default:
                return "text-slate-600 bg-slate-50";
        }
    };

    return (
        <Card gradient className="p-5 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate text-lg">{assignment.title}</h3>
                    <p className="text-sm text-slate-500 truncate mt-1">{assignment.subject}</p>
                    <div className="flex items-center gap-2 mt-3">
                        <AlertCircle size={16} className="text-slate-400" />
                        <span className="text-xs text-slate-500">Due: {formatDate(assignment.dueDate)}</span>
                    </div>
                    <div className="mt-3">
                        <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize", getStatusColor(assignment.status))}>
                            {assignment.status}
                        </span>
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
    const [assignments, setAssignments] = useState([
        { id: 1, title: "Math Problem Set", subject: "Mathematics", dueDate: "2026-03-20", status: "pending" },
        { id: 2, title: "Physics Lab Report", subject: "Physics", dueDate: "2026-03-18", status: "submitted" },
        { id: 3, title: "Chemistry Equations", subject: "Chemistry", dueDate: "2026-03-15", status: "overdue" },
        { id: 4, title: "English Essay", subject: "English", dueDate: "2026-03-25", status: "pending" },
        { id: 5, title: "History Research", subject: "History", dueDate: "2026-03-22", status: "submitted" },
        { id: 6, title: "Biology Presentation", subject: "Biology", dueDate: "2026-03-19", status: "pending" },
        { id: 7, title: "Computer Science Code", subject: "Computer Science", dueDate: "2026-03-23", status: "submitted" },
        { id: 8, title: "Economics Analysis", subject: "Economics", dueDate: "2026-03-29", status: "pending" },
        { id: 9, title: "Art Portfolio", subject: "Art", dueDate: "2026-03-17", status: "overdue" },
        { id: 10, title: "Statistics Project", subject: "Statistics", dueDate: "2026-03-24", status: "submitted" },
        { id: 11, title: "Psychology Case Study", subject: "Psychology", dueDate: "2026-04-02", status: "pending" },
        { id: 12, title: "Sociology Survey", subject: "Sociology", dueDate: "2026-03-31", status: "pending" },
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [sortDirection, setSortDirection] = useState("none");
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 9;

    const handleDeleteAssignment = (assignmentId) => {
        if (window.confirm("Are you sure you want to delete this assignment?")) {
            setAssignments((prev) => prev.filter((assignment) => assignment.id !== assignmentId));
            if (currentPage > 0 && (assignments.length - 1) % pageSize === 0) {
                setCurrentPage(currentPage - 1);
            }
        }
    };

    const filteredAndSortedAssignments = useMemo(() => {
        let result = assignments.filter((assignment) =>
            assignment.title.toLowerCase().includes(searchInput.toLowerCase()) ||
            assignment.subject.toLowerCase().includes(searchInput.toLowerCase())
        );

        if (sortDirection === "asc") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortDirection === "desc") {
            result.sort((a, b) => b.title.localeCompare(a.title));
        }

        return result;
    }, [assignments, searchInput, sortDirection]);

    const totalPages = Math.ceil(filteredAndSortedAssignments.length / pageSize);
    const paginatedAssignments = filteredAndSortedAssignments.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const pendingCount = assignments.filter((a) => a.status === "pending").length;

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
                <StatsCard
                    icon={CheckCircle}
                    label="Total Assignments"
                    value={assignments.length}
                    color="blue"
                />
                <StatsCard
                    icon={AlertCircle}
                    label="Pending Submissions"
                    value={pendingCount}
                    color="cyan"
                />
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
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add Assignment
                        </button>
                    </div>
                </div>
            </Card>

            {/* Loading State */}
            {paginatedAssignments.length === 0 ? (
                <Card gradient className="p-12 text-center">
                    <CheckCircle size={48} className="mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-500 text-lg">No assignments found</p>
                </Card>
            ) : (
                <>
                    {/* Assignment Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                        {paginatedAssignments.map((assignment) => (
                            <AssignmentCard
                                key={assignment.id}
                                assignment={assignment}
                                onDelete={handleDeleteAssignment}
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
                                            ? "bg-blue-600 text-white"
                                            : "bg-white border border-slate-200 text-slate-700 hover:border-blue-300"
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
