import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "../../../components/Pagination";
import { Table } from "../../../components/Table";
import { TableSearch } from "../../../components/TableSearch";
import { FormModel } from "../../../components/FormModel";
import { FilterModal } from "../../../components/FilterModal";
import { getVisibleRows } from "../../../lib/listUtils";
import { useBackendList } from "../../../hooks/useBackendList";
import { Layout } from "../../Layout";
import { uploadFileToCloudinary } from "../../../lib/uploadClient";
import { apiRequest } from "../../../lib/apiClient";
import { useAuth } from "../../../contexts/AuthContext";

export function AssignmentsListPage() {
    const { data: assignments, loading, error, reload } = useBackendList("assignments");
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");
    const [uploadTarget, setUploadTarget] = useState(null);
    const [submissionFile, setSubmissionFile] = useState(null);
    const [submitMessage, setSubmitMessage] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionError, setActionError] = useState("");

    const canManageAssignments = user?.type === "admin" || user?.type === "teacher";

    const addAssignmentFields = [
        { name: "subject", placeholder: "Subject" },
        { name: "class", placeholder: "Class / Course Name" },
        { name: "description", placeholder: "Description", fullWidth: true, required: false },
        { name: "dueDate", type: "date", placeholder: "Due Date" },
    ];

    const columns = [
        { header: "Subject Name", accessor: "subject" },
        { header: "Class", accessor: "class", className: "hidden sm:table-cell" },
        { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
        { header: "Due Date", accessor: "dueDate", className: "hidden md:table-cell" },
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

    const handleDeleteAssignment = async (assignmentId) => {
        try {
            setActionError("");
            await apiRequest(`/academic/assignments/${assignmentId}`, { method: "DELETE" });
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to delete assignment");
        }
    };

    const handleAddAssignment = async (formData) => {
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
            setActionError(err.message || "Failed to add assignment");
        }
    };

    const renderAssignmentRow = (row, rowIndex) => (
        <tr
            key={row.id}
            className={`border-t border-slate-100 transition hover:bg-slate-50/80 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
        >
            {columns.map((col) => {
                if (col.accessor === "action") {
                    return (
                        <td key={col.accessor} className={`px-4 py-4 ${col.className || ""}`}>
                            <div className="flex justify-center gap-3">
                                <Link to={`/assignments/${row.id}`}>
                                    <button className="icon-button h-9 w-9">
                                        <img src="/view.png" width={14} height={14} />
                                    </button>
                                </Link>
                                {user?.type === "student" ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUploadTarget(row);
                                            setSubmissionFile(null);
                                            setSubmitError("");
                                            setSubmitMessage("");
                                        }}
                                        className="rounded-full bg-green-100 p-2 text-green-600 transition hover:bg-green-200"
                                    >
                                        <img src="/upload.png" width={14} height={14} />
                                    </button>
                                ) : null}
                                {canManageAssignments ? (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteAssignment(row.id)}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 transition hover:bg-rose-100"
                                    >
                                        <img src="/delete.png" width={14} height={14} />
                                    </button>
                                ) : null}
                            </div>
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

    const visibleAssignments = useMemo(
        () => getVisibleRows(assignments, { query: filterQuery, sortAccessor: "subject", sortDirection }),
        [assignments, filterQuery, sortDirection]
    );

    const handleSubmitAssignment = async () => {
        if (!uploadTarget || !submissionFile) return;

        try {
            setIsSubmitting(true);
            setSubmitError("");
            const upload = await uploadFileToCloudinary(submissionFile, "learnytics/assignment-submissions");

            await apiRequest("/academic/submissions", {
                method: "POST",
                body: JSON.stringify({
                    assignmentId: uploadTarget.id,
                    content: submissionFile.name,
                    fileUrl: upload?.url,
                }),
            });

            setSubmitMessage("Assignment uploaded successfully.");
            setSubmissionFile(null);
            setTimeout(() => {
                setUploadTarget(null);
                setSubmitMessage("");
            }, 1400);
        } catch (err) {
            setSubmitError(err.message || "Failed to submit assignment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="glass-panel-strong m-4 mt-0 flex-1 p-5">
                <div className="mb-5 flex items-center justify-between">
                    <h1 className="hidden text-lg font-semibold md:block">All Assignments</h1>
                    <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button
                                type="button"
                                onClick={() => setIsFilterModalOpen(true)}
                                title="Filter assignments"
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
                            {canManageAssignments ? (
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
                {loading && <p className="mb-3 text-sm text-slate-500">Loading assignments...</p>}
                {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
                {actionError && <p className="mb-3 text-sm text-rose-600">{actionError}</p>}
                <Table columns={columns} data={visibleAssignments} renderRow={renderAssignmentRow} />
                <Pagination />
            </div>
            {canManageAssignments ? (
                <FormModel
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddAssignment}
                    title="Add Assignment"
                    submitLabel="Add Assignment"
                    fields={addAssignmentFields}
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
                title="Filter Assignments"
            />
            {uploadTarget ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="glass-panel w-full max-w-lg p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Submit Assignment</h2>
                                <p className="mt-1 text-sm text-slate-500">{uploadTarget.subject}</p>
                            </div>
                            <button type="button" onClick={() => setUploadTarget(null)} className="text-sm text-slate-500 hover:text-slate-700">
                                Close
                            </button>
                        </div>
                        <label className="block text-sm">
                            <span className="mb-2 block text-slate-600">Choose file</span>
                            <input
                                type="file"
                                onChange={(event) => setSubmissionFile(event.target.files?.[0] || null)}
                                className="field-input"
                            />
                        </label>
                        {submitError ? <p className="mt-3 text-sm text-rose-600">{submitError}</p> : null}
                        {submitMessage ? <p className="mt-3 text-sm text-green-600">{submitMessage}</p> : null}
                        <div className="mt-4 flex justify-end gap-2">
                            <button type="button" onClick={() => setUploadTarget(null)} className="btn-secondary">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitAssignment}
                                disabled={!submissionFile || isSubmitting}
                                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isSubmitting ? "Uploading..." : "Upload Assignment"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </Layout>
    );
}
