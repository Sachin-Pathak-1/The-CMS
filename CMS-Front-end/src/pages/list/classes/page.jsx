import { useMemo, useState } from "react";
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
import { Search, Plus, Filter, Trash2, Users, Grid } from "lucide-react";
import { Card } from "../../../lib/designSystem";

const cn = (...values) => values.filter(Boolean).join(" ");

// Custom StatsCard for list pages
function StatsCard(props) {
    const { label, value, icon, color = "blue" } = props;
    const Icon = icon;
    const colorClasses = {
        blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
        purple: { bg: "from-purple-600 to-purple-400", accent: "bg-purple-100 text-purple-600" },
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

function ClassCard({ classData, onDelete, canManage }) {
    return (
        <Card gradient className="p-5 group">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
                        <Grid size={20} className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 text-lg">{classData.name}</h3>
                        {classData.description && <p className="text-sm text-slate-500 mt-1">{classData.description}</p>}
                        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200">
                            <div><p className="text-xs text-slate-500">Capacity</p><p className="font-semibold text-slate-900 text-sm">{classData.capacity || '—'}</p></div>
                            <div><p className="text-xs text-slate-500">Grade</p><p className="font-semibold text-slate-900 text-sm">{classData.grade || '—'}</p></div>
                        </div>
                    </div>
                </div>
                {canManage && (
                    <button onClick={() => onDelete(classData.id)} className="p-2 hover:bg-rose-50 rounded-lg transition" title="Delete class">
                        <Trash2 size={18} className="text-rose-600" />
                    </button>
                )}
            </div>
        </Card>
    );
}

export function ClassesListPage() {
    const { data: classes, loading, error, reload } = useBackendList("classes");
    const { user } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");
    const [actionError, setActionError] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const canManageClasses = user?.type === "admin" || user?.type === "teacher";

    const addClassFields = [
        { name: "name", placeholder: "Class Name" },
        { name: "description", placeholder: "Description", fullWidth: true, required: false },
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
            setDeleteConfirm(null);
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to delete class");
        }
    };

    const visibleClasses = useMemo(
        () => getVisibleRows(classes, { query: filterQuery, sortAccessor: "name", sortDirection }),
        [classes, filterQuery, sortDirection]
    );
    const {
        currentPage,
        paginatedData: paginatedClasses,
        setCurrentPage,
        totalPages,
    } = usePagination(visibleClasses, { pageSize: 9 });

    return (
        <div className="space-y-8 px-4 py-8 md:px-8">
            {/* Header */}
            <div>
                <div className="flex flex-col gap-2 mb-6">
                    <span className="text-xs font-semibold text-purple-600 uppercase tracking-widest">Classes Management</span>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Classes</h1>
                    <p className="text-slate-600">Manage and organize all classes</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <StatsCard label="Total Classes" value={classes.length} icon={Grid} color="purple" />
                    <StatsCard label="Active Classes" value={visibleClasses.length} icon={Users} color="blue" />
                </div>
            </div>

            {/* Error Messages */}
            {actionError && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    {actionError}
                </div>
            )}

            {/* Controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search classes by name..."
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition"
                        />
                    </div>
                </div>
                <button
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                    className="px-4 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition"
                >
                    Sort
                </button>
                {canManageClasses && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg transition flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus size={18} /> Add Class
                    </button>
                )}
            </div>

            {/* Content */}
            {loading && (
                <div className="text-center py-12">
                    <p className="text-slate-600">Loading classes...</p>
                </div>
            )}

            {error && (
                <Card gradient className="p-6 border-rose-200">
                    <p className="text-rose-700">Error: {error}</p>
                </Card>
            )}

            {!loading && paginatedClasses.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {paginatedClasses.map((classData) => (
                            <ClassCard
                                key={classData.id}
                                classData={classData}
                                onDelete={(id) => setDeleteConfirm(id)}
                                canManage={canManageClasses}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={cn(
                                        "w-10 h-10 rounded-lg font-medium transition",
                                        currentPage === i + 1
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
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

            {!loading && classes.length === 0 && (
                <Card gradient className="p-12 text-center">
                    <Grid size={40} className="mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 font-medium">No classes yet</p>
                    <p className="text-sm text-slate-500 mt-1">Create your first class to get started</p>
                </Card>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <Card gradient className="p-6 max-w-sm">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Class?</h3>
                        <p className="text-slate-600 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteClass(deleteConfirm)}
                                className="px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Add Class Modal */}
            {isAddModalOpen && (
                <FormModel
                    title="Add New Class"
                    fields={addClassFields}
                    onSubmit={handleAddClass}
                    onClose={() => setIsAddModalOpen(false)}
                />
            )}
        </div>
    );
}
