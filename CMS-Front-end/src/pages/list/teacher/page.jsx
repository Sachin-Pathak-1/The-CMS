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
import { apiRequest } from "../../../lib/apiClient";
import { useAuth } from "../../../contexts/AuthContext";
import { Search, Plus, Filter, Eye, Trash2, BookOpen, Users } from "lucide-react";

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

// Teacher Card
function TeacherCard({ teacher, onView, onDelete, canManage }) {
    const getInitials = (name) =>
        name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();

    const name = teacher.name || `${teacher.userDetails?.firstName || ''} ${teacher.userDetails?.lastName || ''}`.trim();
    const email = teacher.email || '';
    const phone = teacher.phone || teacher.userDetails?.phone || 'N/A';

    return (
        <Card gradient className="p-5 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                    {teacher.photo || teacher.userDetails?.avatar ? (
                        <img src={teacher.photo || teacher.userDetails?.avatar} alt={name} className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 font-semibold text-white text-sm">
                            {getInitials(name)}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">{name}</h3>
                        <p className="text-sm text-slate-500 truncate">{email}</p>
                        <p className="text-xs text-slate-400 mt-1">📱 {phone}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onView(teacher)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition"
                        title="View details"
                    >
                        <Eye size={18} className="text-blue-600" />
                    </button>
                    {canManage && (
                        <button
                            onClick={() => onDelete(teacher.id)}
                            className="p-2 hover:bg-rose-50 rounded-lg transition"
                            title="Delete teacher"
                        >
                            <Trash2 size={18} className="text-rose-600" />
                        </button>
                    )}
                </div>
            </div>
        </Card>
    );
}

export function TeacherListPage() {
    const { data: teachers, loading, error, reload } = useBackendList("teachers");
    const { user } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");
    const [actionError, setActionError] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const canManageTeachers = user?.type === "admin";

    const addTeacherFields = [
        { name: "username", placeholder: "Username" },
        { name: "email", type: "email", placeholder: "Email" },
        { name: "password", type: "password", placeholder: "Password" },
        { name: "collegeId", type: "number", placeholder: "College ID" },
        { name: "firstName", placeholder: "First Name" },
        { name: "lastName", placeholder: "Last Name" },
        { name: "sex", placeholder: "Sex (male/female/other)" },
        { name: "dob", type: "date", placeholder: "Date of Birth" },
        { name: "phone", placeholder: "Phone", required: false },
    ];

    const handleAddTeacher = async (formData) => {
        try {
            setActionError("");
            await apiRequest("/user/teachers", {
                method: "POST",
                body: JSON.stringify({
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                    collegeId: Number(formData.collegeId || 45),
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    sex: formData.sex.trim().toLowerCase(),
                    dob: formData.dob,
                    phone: formData.phone?.trim() || undefined,
                }),
            });
            setIsAddModalOpen(false);
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to add teacher");
        }
    };

    const handleDeleteTeacher = async (teacherId) => {
        if (window.confirm("Are you sure you want to delete this teacher?")) {
            try {
                setActionError("");
                await apiRequest(`/user/teachers/${teacherId}`, { method: "DELETE" });
                reload();
            } catch (err) {
                setActionError(err.message || "Failed to delete teacher");
            }
        }
    };

    const visibleTeachers = useMemo(
        () => getVisibleRows(teachers, { query: searchInput, sortAccessor: "name", sortDirection }),
        [teachers, searchInput, sortDirection]
    );

    const {
        currentPage,
        pageSize,
        paginatedData: paginatedTeachers,
        setCurrentPage,
        totalItems,
        totalPages,
    } = usePagination(visibleTeachers, { pageSize: 9 });


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/20 p-4 md:p-8">
            {/* Header */}
            <div className="mb-10">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Manage Staff</p>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">All Teachers</h1>
                <p className="text-slate-600 text-lg mt-2">View and manage your teaching staff members.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <StatsCard
                    icon={Users}
                    label="Total Teachers"
                    value={teachers?.length || 0}
                    color="blue"
                />
                <StatsCard
                    icon={BookOpen}
                    label="Active Staff"
                    value={teachers?.filter(t => t.status !== 'inactive')?.length || 0}
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
                            placeholder="Search teachers by name, email..."
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition"
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
                        {canManageTeachers && (
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add Teacher
                            </button>
                        )}
                    </div>
                </div>
            </Card>

            {/* Error Messages */}
            {error && (
                <Card className="p-4 mb-6 border-rose-200 bg-rose-50">
                    <p className="text-rose-700 font-medium">{error}</p>
                </Card>
            )}
            {actionError && (
                <Card className="p-4 mb-6 border-rose-200 bg-rose-50">
                    <p className="text-rose-700 font-medium">{actionError}</p>
                </Card>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-slate-500">Loading teachers...</p>
                </div>
            ) : paginatedTeachers.length === 0 ? (
                <Card gradient className="p-12 text-center">
                    <BookOpen size={48} className="mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-500 text-lg">No teachers found</p>
                </Card>
            ) : (
                <>
                    {/* Teacher Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                        {paginatedTeachers.map((teacher) => (
                            <Link
                                key={teacher.id}
                                to={`/teacher/details/${teacher.id}`}
                                state={{ teacher }}
                                className="no-underline"
                            >
                                <TeacherCard
                                    teacher={teacher}
                                    onView={() => { }}
                                    onDelete={handleDeleteTeacher}
                                    canManage={canManageTeachers}
                                />
                            </Link>
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

            {/* Add Teacher Modal */}
            {canManageTeachers && (
                <FormModel
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddTeacher}
                    title="Add New Teacher"
                    submitLabel="Add Teacher"
                    fields={addTeacherFields}
                />
            )}
        </div>
    );
}
