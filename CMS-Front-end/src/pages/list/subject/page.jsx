import { useMemo, useState } from "react";
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

export function SubjectListPage() {
    const { data: subjects, loading, error, reload } = useBackendList("subjects");
    const { user } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");
    const [actionError, setActionError] = useState("");

    const canManageSubjects = user?.type === "admin" || user?.type === "teacher";

    const addSubjectFields = [
        { name: "name", placeholder: "Subject Name" },
        { name: "description", placeholder: "Description", fullWidth: true, required: false },
    ];

    const columns = [
        { header: "Subject Name", accessor: "name" },
        { header: "Teachers", accessor: "teachers", className: "hidden md:table-cell" },
        { header: "Actions", accessor: "action" },
    ];

    const handleAddSubject = async (formData) => {
        try {
            setActionError("");
            await apiRequest("/courses", {
                method: "POST",
                body: JSON.stringify({
                    name: formData.name.trim(),
                    description: formData.description?.trim() || undefined,
                }),
            });
            setIsAddModalOpen(false);
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to add subject");
        }
    };

    const handleDeleteSubject = async (subjectId) => {
        try {
            setActionError("");
            await apiRequest(`/courses/${subjectId}`, { method: "DELETE" });
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to delete subject");
        }
    };

    const renderSubjectRow = (row, rowIndex) => (
        <tr
            key={row.id}
            className={`border-t border-slate-100 transition hover:bg-slate-50/80 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
        >
            {columns.map((col) => {
                if (col.accessor === "action") {
                    return (
                        <td key={col.accessor} className={`px-4 py-4 ${col.className || ""}`}>
                            {canManageSubjects ? (
                                <div className="flex justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSubject(row.id)}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 transition hover:bg-rose-100"
                                    >
                                        <img src="/delete.png" width={14} height={14} />
                                    </button>
                                </div>
                            ) : null}
                        </td>
                    );
                }

                const value = row[col.accessor];
                return (
                    <td key={col.accessor} className={`px-4 py-4 ${col.className || ""}`}>
                        {Array.isArray(value) ? value.join(", ") : value}
                    </td>
                );
            })}
        </tr>
    );

    const visibleSubjects = useMemo(
        () => getVisibleRows(subjects, { query: filterQuery, sortAccessor: "name", sortDirection }),
        [subjects, filterQuery, sortDirection]
    );

    return (
        <Layout>
            <div className="glass-panel-strong m-4 mt-0 flex-1 p-5">
                <div className="mb-5 flex items-center justify-between">
                    <h1 className="hidden text-lg font-semibold md:block">All Subjects</h1>
                    <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button
                                type="button"
                                onClick={() => setIsFilterModalOpen(true)}
                                title="Filter subjects"
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
                            {canManageSubjects ? (
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
                {loading && <p className="mb-3 text-sm text-slate-500">Loading subjects...</p>}
                {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
                {actionError && <p className="mb-3 text-sm text-rose-600">{actionError}</p>}
                <Table columns={columns} data={visibleSubjects} renderRow={renderSubjectRow} />
                <Pagination />
            </div>
            {canManageSubjects ? (
                <FormModel
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddSubject}
                    title="Add Subject"
                    submitLabel="Add Subject"
                    fields={addSubjectFields}
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
                title="Filter Subjects"
            />
        </Layout>
    );
}
