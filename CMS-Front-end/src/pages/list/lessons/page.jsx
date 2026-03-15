import { useEffect, useMemo, useState } from "react";
import { useBackendList } from "../../../hooks/useBackendList";
import { usePagination } from "../../../hooks/usePagination";
import { getVisibleRows } from "../../../lib/listUtils";
import { apiRequest } from "../../../lib/apiClient";
import { useAuth } from "../../../contexts/AuthContext";
import { FormModel } from "../../../components/FormModel";
import { Search, Plus, Trash2, Users, BookOpen } from "lucide-react";

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
        cyan: { bg: "from-cyan-600 to-cyan-400", accent: "bg-cyan-100 text-cyan-600" },
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

function LessonCard({ lesson, onDelete, canManage }) {
    return (
        <Card gradient className="p-5 group">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg">
                        <BookOpen size={20} className="text-cyan-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-lg">{lesson.subject}</h3>
                        <p className="text-sm text-slate-500 mt-1">{lesson.class || "N/A"}</p>
                        {lesson.description && <p className="text-xs text-slate-500 mt-2">{lesson.description}</p>}
                        <div className="mt-3 pt-3 border-t border-slate-200">
                            <p className="text-xs text-slate-500">
                                Teacher:{" "}
                                <span className="font-medium text-slate-900">{lesson.teacher || "—"}</span>
                            </p>
                        </div>
                    </div>
                </div>
                {canManage && (
                    <button
                        onClick={() => onDelete(lesson.id)}
                        className="p-2 hover:bg-rose-50 rounded-lg transition"
                        title="Delete lesson"
                    >
                        <Trash2 size={18} className="text-rose-600" />
                    </button>
                )}
            </div>
        </Card>
    );
}

export function LessonsListPage() {
    const { data: lessons, loading, error, reload } = useBackendList("lessons");
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");
    const [actionError, setActionError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const canManageLessons = user?.type === "admin" || user?.type === "teacher";

    const addLessonFields = [
        { name: "subject", placeholder: "Subject" },
        { name: "class", placeholder: "Class / Course Name" },
        { name: "description", placeholder: "Description", fullWidth: true, required: false },
        { name: "dueDate", type: "date", placeholder: "Due Date" },
    ];

    useEffect(() => {
        apiRequest("/courses")
            .then((response) => setCourses(Array.isArray(response?.data) ? response.data : []))
            .catch(() => setCourses([]));
    }, []);

    const resolveCourseId = (courseName) => {
        const course = courses.find(
            (item) => item.name.trim().toLowerCase() === courseName.trim().toLowerCase()
        );
        return course?.id || null;
    };

    const handleAddLesson = async (formData) => {
        try {
            setActionError("");
            const courseId = resolveCourseId(formData.class);
            if (!courseId) throw new Error("Matching class/course was not found");

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
            setActionError(err.message || "Failed to add lesson");
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        try {
            setActionError("");
            await apiRequest(`/academic/assignments/${lessonId}`, { method: "DELETE" });
            setDeleteConfirm(null);
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to delete lesson");
        }
    };

    const visibleLessons = useMemo(
        () => getVisibleRows(lessons, { query: filterQuery, sortAccessor: "subject", sortDirection }),
        [lessons, filterQuery, sortDirection]
    );

    const { currentPage, paginatedData: paginatedLessons, setCurrentPage, totalPages } = usePagination(
        visibleLessons,
        { pageSize: 9 }
    );

    return (
        <div className="space-y-8 px-4 py-8 md:px-8">
            <div className="flex flex-col gap-2 mb-6">
                <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest">
                    Lessons Management
                </span>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Lessons
                </h1>
                <p className="text-slate-600">Manage and organize all lessons and assignments</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <StatsCard label="Total Lessons" value={lessons.length} icon={BookOpen} color="cyan" />
                <StatsCard label="Active Lessons" value={visibleLessons.length} icon={Users} color="blue" />
            </div>

            {actionError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    {actionError}
                </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search lessons by subject..."
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                        />
                    </div>
                </div>
                <button
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition"
                >
                    Sort
                </button>
                {canManageLessons && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:shadow-lg transition flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={18} /> Add Lesson
                    </button>
                )}
            </div>

            {loading && (
                <div className="text-center py-12">
                    <p className="text-slate-600">Loading lessons...</p>
                </div>
            )}

            {error && (
                <Card gradient className="p-6 border-rose-200">
                    <p className="text-rose-700">Error: {error}</p>
                </Card>
            )}

            {!loading && paginatedLessons.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {paginatedLessons.map((lesson) => (
                            <LessonCard
                                key={lesson.id}
                                lesson={lesson}
                                onDelete={(id) => setDeleteConfirm(id)}
                                canManage={canManageLessons}
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
                                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white"
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

            {!loading && lessons.length === 0 && (
                <Card gradient className="p-12 text-center">
                    <BookOpen size={40} className="mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 font-medium">No lessons yet</p>
                    <p className="text-sm text-slate-500 mt-1">Create your first lesson to get started</p>
                </Card>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Card gradient className="p-6 max-w-sm">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Lesson?</h3>
                        <p className="text-slate-600 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteLesson(deleteConfirm)}
                                className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {isAddModalOpen && (
                <FormModel
                    title="Add New Lesson"
                    fields={addLessonFields}
                    onSubmit={handleAddLesson}
                    onClose={() => setIsAddModalOpen(false)}
                />
            )}
        </div>
    );
}
