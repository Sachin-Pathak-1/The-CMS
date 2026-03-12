import { useEffect, useMemo, useState } from "react";
import { Pagination } from "../../../components/Pagination";
import { Table } from "../../../components/Table";
import { TableSearch } from "../../../components/TableSearch";
import { FormModel } from "../../../components/FormModel";
import { FilterModal } from "../../../components/FilterModal";
import { getVisibleRows } from "../../../lib/listUtils";
import { useBackendList } from "../../../hooks/useBackendList";
import { Layout } from "../../Layout";
import { apiRequest } from "../../../lib/apiClient";
import { useAuth } from "../../../contexts/AuthContext";

export function LessonsListPage() {
    const { data: lessons, loading, error, reload } = useBackendList("lessons");
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [actionError, setActionError] = useState("");

    const canManageLessons = user?.type === "admin" || user?.type === "teacher";

    const addLessonFields = [
        { name: "subject", placeholder: "Subject" },
        { name: "class", placeholder: "Class / Course Name" },
        { name: "description", placeholder: "Description", fullWidth: true, required: false },
        { name: "dueDate", type: "date", placeholder: "Due Date" },
    ];

    const columns = [
        { header: "Subject Name", accessor: "subject" },
        { header: "Class", accessor: "class", className: "hidden sm:table-cell" },
        { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
        { header: "Actions", accessor: "action" },
    ];

    useEffect(() => {
        apiRequest("/courses")
            .then((response) => setCourses(Array.isArray(response?.data) ? response.data : []))
            .catch(() => setCourses([]));
    }, []);

    const resolveCourseId = (courseName) => {
        const course = courses.find((item) => item.name.trim().toLowerCase() === courseName.trim().toLowerCase());
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
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to delete lesson");
        }
    };

    const handleUpdateLesson = async (event) => {
        event.preventDefault();
        if (!editingLesson) return;

        try {
            setActionError("");
            const courseId = resolveCourseId(editingLesson.class);
            if (!courseId) throw new Error("Matching class/course was not found");

            await apiRequest(`/academic/assignments/${editingLesson.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    title: editingLesson.subject.trim(),
                    courseId,
                }),
            });
            setIsEditOpen(false);
            setEditingLesson(null);
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to update lesson");
        }
    };

    const renderLessonRow = (row, rowIndex) => (
        <tr
            key={row.id}
            className={`border-t border-slate-100 transition hover:bg-slate-50/80 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
        >
            {columns.map((col) => {
                if (col.accessor === "action") {
                    return (
                        <td key={col.accessor} className={`px-4 py-4 ${col.className || ""}`}>
                            {canManageLessons ? (
                                <div className="flex justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingLesson({ id: row.id, subject: row.subject, class: row.class });
                                            setIsEditOpen(true);
                                        }}
                                        className="icon-button h-9 w-9"
                                    >
                                        <img src="/edit.png" width={14} height={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteLesson(row.id)}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 transition hover:bg-rose-100"
                                    >
                                        <img src="/delete.png" width={14} height={14} />
                                    </button>
                                </div>
                            ) : null}
                        </td>
                    );
                }

                return (
                    <td key={col.accessor} className={`px-4 py-4 ${col.className || ""}`}>
                        {row[col.accessor]}
                    </td>
                );
            })}
        </tr>
    );

    const visibleLessons = useMemo(
        () => getVisibleRows(lessons, { query: filterQuery, sortAccessor: "subject", sortDirection }),
        [lessons, filterQuery, sortDirection]
    );

    return (
        <Layout>
            <div className="glass-panel-strong m-4 mt-0 flex-1 p-5">
                <div className="mb-5 flex items-center justify-between">
                    <h1 className="hidden text-lg font-semibold md:block">All Lessons</h1>
                    <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button
                                type="button"
                                onClick={() => setIsFilterModalOpen(true)}
                                title="Filter lessons"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm "
                            >
                                <img src="/filter.png" alt="" width={14} height={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setSortDirection((prev) => (prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"))}
                                title={`Sort by subject (${sortDirection})`}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm "
                            >
                                <img src="/sort.png" alt="" width={14} height={14} />
                            </button>
                            {canManageLessons ? (
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm "
                                >
                                    <img src="/plus.png" alt="" width={14} height={14} />
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
                {loading && <p className="mb-3 text-sm text-slate-500">Loading lessons...</p>}
                {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
                {actionError && <p className="mb-3 text-sm text-rose-600">{actionError}</p>}
                <Table columns={columns} data={visibleLessons} renderRow={renderLessonRow} />
                <Pagination />
            </div>
            {canManageLessons ? (
                <FormModel
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddLesson}
                    title="Add Lesson"
                    submitLabel="Add Lesson"
                    fields={addLessonFields}
                />
            ) : null}
            <FilterModal
                open={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={(nextQuery) => {
                    setFilterQuery(nextQuery);
                    setIsFilterModalOpen(false);
                }}
                initialValue={filterQuery}
                title="Filter Lessons"
            />
            {isEditOpen && editingLesson ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="glass-panel w-full max-w-md p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Edit Lesson</h2>
                            <button type="button" onClick={() => setIsEditOpen(false)} className="text-sm text-slate-500 hover:text-slate-700">
                                Close
                            </button>
                        </div>
                        <form onSubmit={handleUpdateLesson} className="space-y-3">
                            <input
                                name="subject"
                                value={editingLesson.subject}
                                onChange={(event) => setEditingLesson((prev) => ({ ...prev, subject: event.target.value }))}
                                placeholder="Subject"
                                required
                                className="field-input"
                            />
                            <input
                                name="class"
                                value={editingLesson.class}
                                onChange={(event) => setEditingLesson((prev) => ({ ...prev, class: event.target.value }))}
                                placeholder="Class"
                                required
                                className="field-input"
                            />
                            <div className="mt-2 flex justify-end gap-2">
                                <button type="button" onClick={() => setIsEditOpen(false)} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}
        </Layout>
    );
}
