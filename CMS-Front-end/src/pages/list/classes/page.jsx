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

export function ClassesListPage() {
    const { data: classes, loading, error, reload } = useBackendList("classes");
    const { user } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");
    const [actionError, setActionError] = useState("");

    const canManageClasses = user?.type === "admin" || user?.type === "teacher";

    const addClassFields = [
        { name: "name", placeholder: "Class Name" },
        { name: "description", placeholder: "Description", fullWidth: true, required: false },
    ];

    const columns = [
        { header: "Class Name", accessor: "name" },
        { header: "Capacity", accessor: "capacity", className: "hidden sm:table-cell" },
        { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
        { header: "Supervisor", accessor: "supervisor", className: "hidden md:table-cell" },
        { header: "Actions", accessor: "action" },
    ];

    const handleAddClass = async (formData) => {
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
            setActionError(err.message || "Failed to add class");
        }
    };

    const handleDeleteClass = async (classId) => {
        try {
            setActionError("");
            await apiRequest(`/courses/${classId}`, { method: "DELETE" });
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to delete class");
        }
    };

    const renderClassRow = (row, rowIndex) => (
        <tr
            key={row.id}
            className={`border-t border-slate-100 transition hover:bg-slate-50/80 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
        >
            {columns.map((col) => {
                if (col.accessor === "action") {
                    return (
                        <td key={col.accessor} className={`px-4 py-4 ${col.className || ""}`}>
                            {canManageClasses ? (
                                <div className="flex justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteClass(row.id)}
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

    const visibleClasses = useMemo(
        () => getVisibleRows(classes, { query: filterQuery, sortAccessor: "name", sortDirection }),
        [classes, filterQuery, sortDirection]
    );

    return (
        <Layout>
            <div className="glass-panel-strong m-4 mt-0 flex-1 p-5">
                <div className="mb-5 flex items-center justify-between">
                    <h1 className="hidden text-lg font-semibold md:block">All Classes</h1>
                    <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button
                                type="button"
                                onClick={() => setIsFilterModalOpen(true)}
                                title="Filter classes"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm "
                            >
                                <img src="/filter.png" alt="" width={14} height={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setSortDirection((prev) => (prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"))}
                                title={`Sort by class name (${sortDirection})`}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm "
                            >
                                <img src="/sort.png" alt="" width={14} height={14} />
                            </button>
                            {canManageClasses ? (
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
                {loading && <p className="mb-3 text-sm text-slate-500">Loading classes...</p>}
                {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
                {actionError && <p className="mb-3 text-sm text-rose-600">{actionError}</p>}
                <Table columns={columns} data={visibleClasses} renderRow={renderClassRow} />
                <Pagination />
            </div>
            {canManageClasses ? (
                <FormModel
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddClass}
                    title="Add Class"
                    submitLabel="Add Class"
                    fields={addClassFields}
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
                title="Filter Classes"
            />
        </Layout>
    );
}
