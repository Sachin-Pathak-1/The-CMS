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

export function TeacherListPage() {
    const { data: teachers, loading, error, reload } = useBackendList("teachers");
    const { user } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");
    const [actionError, setActionError] = useState("");

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

    const columns = [
        { header: "Info", accessor: "info" },
        { header: "Teacher ID", accessor: "teacherId", className: "hidden md:table-cell" },
        { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
        { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
        { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
        { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
        { header: "Actions", accessor: "action" },
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
        try {
            setActionError("");
            await apiRequest(`/user/teachers/${teacherId}`, { method: "DELETE" });
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to delete teacher");
        }
    };

    const getInitials = (name) =>
        name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();

    const renderTeacherRow = (row, rowIndex) => (
        <tr
            key={row.id}
            className={`border-t border-slate-100 transition hover:bg-slate-50/80 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
        >
            {columns.map((col) => {
                if (col.accessor === "info") {
                    return (
                        <td key={col.accessor} className={`px-4 py-4 ${col.className || ""}`}>
                            <div className="flex items-center gap-3">
                                {row.photo ? (
                                    <img src={row.photo} alt={row.name} className="h-10 w-10 rounded-full object-cover" />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
                                        {getInitials(row.name)}
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium">{row.name}</p>
                                    <p className="text-xs text-slate-500">{row.email}</p>
                                </div>
                            </div>
                        </td>
                    );
                }

                if (col.accessor === "action") {
                    return (
                        <td key={col.accessor} className={`px-4 py-4 ${col.className || ""}`}>
                            <div className="flex justify-center gap-3">
                                <Link to={`/teacher/details/${row.id}`} state={{ teacher: row }}>
                                    <button className="icon-button h-9 w-9">
                                        <img src="/view.png" width={14} height={14} />
                                    </button>
                                </Link>
                                {canManageTeachers ? (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteTeacher(row.id)}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 transition hover:bg-rose-100"
                                    >
                                        <img src="/delete.png" width={14} height={14} />
                                    </button>
                                ) : null}
                            </div>
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

    const visibleTeachers = useMemo(
        () => getVisibleRows(teachers, { query: filterQuery, sortAccessor: "name", sortDirection }),
        [teachers, filterQuery, sortDirection]
    );
    const {
        currentPage,
        pageSize,
        paginatedData: paginatedTeachers,
        setCurrentPage,
        totalItems,
        totalPages,
    } = usePagination(visibleTeachers, { pageSize: 10 });

    return (
        <>
            <div className="glass-panel-strong m-4 mt-0 flex-1 p-5">
                <div className="mb-5 flex items-center justify-between">
                    <h1 className="hidden text-lg font-semibold md:block">All Teachers</h1>
                    <div className="flex w-full flex-col items-center gap-4 md:w-auto md:flex-row">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button
                                type="button"
                                onClick={() => setIsFilterModalOpen(true)}
                                title="Filter teachers"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm "
                            >
                                <img src="/filter.png" alt="" width={14} height={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentPage(1);
                                    setSortDirection((prev) => (prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"));
                                }}
                                title={`Sort by name (${sortDirection})`}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm "
                            >
                                <img src="/sort.png" alt="" width={14} height={14} />
                            </button>
                            {canManageTeachers ? (
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
                {loading && <p className="mb-3 text-sm text-slate-500">Loading teachers...</p>}
                {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
                {actionError && <p className="mb-3 text-sm text-rose-600">{actionError}</p>}
                <Table columns={columns} data={paginatedTeachers} renderRow={renderTeacherRow} />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                />
            </div>
            {canManageTeachers ? (
                <FormModel
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddTeacher}
                    title="Add Teacher"
                    submitLabel="Add Teacher"
                    fields={addTeacherFields}
                />
            ) : null}
            <FilterModal
                open={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={(nextQuery) => {
                    setCurrentPage(1);
                    setFilterQuery(nextQuery);
                    setIsFilterModalOpen(false);
                }}
                initialValue={filterQuery}
                title="Filter Teachers"
            />
        </>
    );
}
