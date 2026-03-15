import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "../../../components/Pagination";
import { Table } from "../../../components/Table";
import { TableSearch } from "../../../components/TableSearch";
import { FormModel } from "../../../components/FormModel";
import { FilterModal } from "../../../components/FilterModal";
import { getVisibleRows } from "../../../lib/listUtils";
import { useBackendList } from "../../../hooks/useBackendList";
import { usePagination } from "../../../hooks/usePagination";
import { Search, Plus, Filter, Eye, Trash2, Users, BookOpen } from "lucide-react";

const cn = (...values) => values.filter(Boolean).join(" ");

// Card Component
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

// Stats Card
function StatsCard({ label, value, icon: Icon, color = "blue" }) {
    const colorClasses = {
        blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
        emerald: { bg: "from-emerald-600 to-emerald-400", accent: "bg-emerald-100 text-emerald-600" },
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

// Student Card
function StudentCard({ student, onDelete }) {
    const getInitials = (name) =>
        name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();

    const name = student.name || '';
    const email = student.email || '';
    const grade = student.grade || 'N/A';
    const studentId = student.studentId || student.id || 'N/A';

    return (
        <Card gradient className="p-5 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                    {student.photo ? (
                        <img src={student.photo} alt={name} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 font-semibold text-white text-sm">
                            {getInitials(name)}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">{name}</h3>
                        <p className="text-sm text-slate-500 truncate">{email}</p>
                        <p className="text-xs text-slate-400 mt-1">Grade: <span className="font-semibold">{grade}</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link to={`/student/details/${student.id}`} state={{ student }}>
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition">
                            <Eye size={18} className="text-blue-600" />
                        </button>
                    </Link>
                    <button
                        onClick={() => onDelete(student.id)}
                        className="p-2 hover:bg-rose-50 rounded-lg transition"
                        title="Delete student"
                    >
                        <Trash2 size={18} className="text-rose-600" />
                    </button>
                </div>
            </div>
            <div className="text-xs text-slate-500 flex justify-between">
                <span>ID: {studentId}</span>
                <span>Phone: {student.phone || 'N/A'}</span>
            </div>
        </Card>
    );
}

export function StudentListPage() {
    const { data: students, setData: setStudents, loading, error } = useBackendList("students");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");
    const [searchInput, setSearchInput] = useState("");

    const addStudentFields = [
        { name: "name", placeholder: "Name" },
        { name: "email", type: "email", placeholder: "Email" },
        { name: "studentId", placeholder: "Student ID" },
        { name: "grade", type: "number", placeholder: "Grade" },
        { name: "class", placeholder: "Class" },
        { name: "phone", placeholder: "Phone" },
        { name: "photo", placeholder: "Photo URL (optional)", required: false, fullWidth: true },
        { name: "address", placeholder: "Address", fullWidth: true },
    ];

    const handleDeleteStudent = (studentId) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            setStudents((prev) => prev.filter((student) => student.id !== studentId));
        }
    };

    const handleAddStudent = (formData) => {
        const newStudent = {
            id: students.length ? Math.max(...students.map((s) => s.id)) + 1 : 1,
            name: formData.name.trim(),
            email: formData.email.trim(),
            studentId: formData.studentId.trim(),
            grade: Number(formData.grade),
            class: formData.class.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            photo: formData.photo.trim(),
        };

        setStudents((prev) => [newStudent, ...prev]);
        setIsAddModalOpen(false);
    };

    const visibleStudents = useMemo(
        () => getVisibleRows(students, { query: searchInput, sortAccessor: "name", sortDirection }),
        [students, searchInput, sortDirection]
    );

    const {
        currentPage,
        pageSize,
        paginatedData: paginatedStudents,
        setCurrentPage,
        totalItems,
        totalPages,
    } = usePagination(visibleStudents, { pageSize: 9 });


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/20 p-4 md:p-8">
            {/* Header */}
            <div className="mb-10">
                <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">Student Management</p>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">All Students</h1>
                <p className="text-slate-600 text-lg mt-2">View and manage your student community.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <StatsCard
                    icon={Users}
                    label="Total Students"
                    value={students?.length || 0}
                    color="blue"
                />
                <StatsCard
                    icon={BookOpen}
                    label="Active Enrollment"
                    value={students?.filter(s => s.status !== 'inactive')?.length || 0}
                    color="emerald"
                />
            </div>

            {/* Search & Actions Bar */}
            <Card gradient className="p-6 mb-8">
                <div className="flex flex-col gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search students by name, email..."
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
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
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add Student
                        </button>
                    </div>
                </div>
            </Card>

            {/* Error Messages */}
            {error && (
                <Card className="p-4 mb-6 border-rose-200 bg-rose-50">
                    <p className="text-rose-700 font-medium">{error}</p>
                </Card>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-slate-500">Loading students...</p>
                </div>
            ) : paginatedStudents.length === 0 ? (
                <Card gradient className="p-12 text-center">
                    <Users size={48} className="mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-500 text-lg">No students found</p>
                </Card>
            ) : (
                <>
                    {/* Student Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                        {paginatedStudents.map((student) => (
                            <StudentCard
                                key={student.id}
                                student={student}
                                onDelete={handleDeleteStudent}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 flex-wrap">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg font-medium transition",
                                        currentPage === page
                                            ? "bg-emerald-600 text-white"
                                            : "bg-white border border-slate-200 text-slate-700 hover:border-emerald-300"
                                    )}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Add Student Modal */}
            <FormModel
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddStudent}
                title="Add New Student"
                submitLabel="Add Student"
                fields={addStudentFields}
            />
        </div>
    );
}



