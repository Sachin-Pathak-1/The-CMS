import { useMemo, useState } from "react";
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

export function AssignmentsListPage () {
    const { data: assignments, setData: setAssignments, loading, error } = useBackendList("assignments");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");
    const [uploadTarget, setUploadTarget] = useState(null);
    const [submissionFile, setSubmissionFile] = useState(null);
    const [submitMessage, setSubmitMessage] = useState("");
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const addAssignmentFields = [
        { name: "subject", placeholder: "Subject" },
        { name: "class", placeholder: "Class" },
        { name: "teacher", placeholder: "Teacher" },
        { name: "dueDate", type: "date", placeholder: "Due Date" },
    ];


    const columns = [
        {
            header:"Subject Name" ,
            accessor:"subject",
        },
        {
            header:"Class" ,
            accessor:"class",
            className: "hidden sm:table-cell",
            
        },
        {
            header:"Teacher" ,
            accessor:"teacher",
            className: "hidden md:table-cell",
        },
        {
            header:"Due Date" ,
            accessor:"dueDate",
            className: "hidden md:table-cell",
        },
        {
            header:"Actions",
            accessor:"action",   
        },
    ]

    const handleDeleteAssignment = (assignmentId) => {
        setAssignments((prev) => prev.filter((assignment) => assignment.id !== assignmentId));
    };

    const handleAddAssignment = (formData) => {
        const newAssignment = {
            id: assignments.length ? Math.max(...assignments.map((a) => a.id)) + 1 : 1,
            subject: formData.subject.trim(),
            class: formData.class.trim(),
            teacher: formData.teacher.trim(),
            dueDate: formData.dueDate,
        };

        setAssignments((prev) => [newAssignment, ...prev]);
        setIsAddModalOpen(false);
    };

    const handleFilterClick = () => {
        setIsFilterModalOpen(true);
    };

    const handleSortClick = () => {
        setSortDirection((prev) => (prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"));
    };

    const handleApplyFilter = (nextQuery) => {
        setFilterQuery(nextQuery);
        setIsFilterModalOpen(false);
    };

    const renderAssignmentRow = (row, rowIndex) => (
        <tr
            key={row.id}
            className={`border-t hover:bg-gray-50 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
        >
            {columns.map((col) => {
                if (col.accessor === "action") {
                    return (
                        <td key={col.accessor} className={`p-2 ${col.className || ""}`}>
                            <div className="flex justify-center gap-3">
                                <Link to={`/assignments/${row.id}`}>
                                    <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                        <img src="/view.png" width={14} height={14} />
                                    </button>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUploadTarget(row);
                                        setSubmissionFile(null);
                                        setSubmitError("");
                                        setSubmitMessage("");
                                    }}
                                    className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                                >
                                    <img src="/upload.png" width={14} height={14} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteAssignment(row.id)}
                                    className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
                                >
                                    <img src="/delete.png" width={14} height={14} />
                                </button>
                            </div>
                        </td>
                    );
                }

                return (
                    <td key={col.accessor} className={`p-2 ${col.className || ""}`}>
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

    return(
        <Layout>
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                {/* TOP */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto ">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button
                                type="button"
                                onClick={handleFilterClick}
                                title="Filter assignments"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200 "
                            >
                                <img src="/filter.png" alt="" width={14} height={14} />
                            </button>
                            <button
                                type="button"
                                onClick={handleSortClick}
                                title={`Sort by subject (${sortDirection})`}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200 "
                            >
                                <img src="/sort.png" alt="" width={14} height={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(true)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200 "
                            >
                                <img src="/plus.png" alt="" width={14} height={14} />
                            </button>
                        </div>
                    </div>
                </div>
                {loading && <p className="mb-3 text-sm text-gray-500">Loading assignments...</p>}
                {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
                {/* LIST */}
                <Table columns={columns} data={visibleAssignments} onDelete={handleDeleteAssignment} renderRow={renderAssignmentRow} />
                {/* PAGINATION */}
                <Pagination />
            </div>
            <FormModel
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddAssignment}
                title="Add Assignment"
                submitLabel="Add Assignment"
                fields={addAssignmentFields}
            />
            <FilterModal
                open={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleApplyFilter}
                initialValue={filterQuery}
                title="Filter Assignments"
            />
            {uploadTarget ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Submit Assignment</h2>
                                <p className="mt-1 text-sm text-gray-500">{uploadTarget.subject}</p>
                            </div>
                            <button type="button" onClick={() => setUploadTarget(null)} className="text-sm text-gray-500 hover:text-gray-700">
                                Close
                            </button>
                        </div>
                        <label className="block text-sm">
                            <span className="mb-2 block text-gray-600">Choose file</span>
                            <input
                                type="file"
                                onChange={(event) => setSubmissionFile(event.target.files?.[0] || null)}
                                className="w-full rounded-md border border-gray-200 p-2"
                            />
                        </label>
                        {submitError ? <p className="mt-3 text-sm text-red-500">{submitError}</p> : null}
                        {submitMessage ? <p className="mt-3 text-sm text-green-600">{submitMessage}</p> : null}
                        <div className="mt-4 flex justify-end gap-2">
                            <button type="button" onClick={() => setUploadTarget(null)} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmitAssignment}
                                disabled={!submissionFile || isSubmitting}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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
