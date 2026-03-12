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

export function StudentListPage () {
    const { data: students, setData: setStudents, loading, error } = useBackendList("students");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");
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


    const columns = [
        {
            header:"Info" ,
            accessor:"info",
        },
        {
            header:"Student ID" ,
            accessor:"studentId",
            className: "hidden md:table-cell",
        },
        {
            header:"Grade" ,
            accessor:"grade",
            className: "hidden md:table-cell",
        },
        {
            header:"Phone" ,
            accessor:"phone",
            className: "hidden lg:table-cell",
        },
        {
            header:"Address" ,
            accessor:"address",
            className: "hidden lg:table-cell",
        },
        {
            header:"Actions",
            accessor:"action",   
        },
    ]

    const handleDeleteStudent = (studentId) => {
        setStudents((prev) => prev.filter((student) => student.id !== studentId));
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

    const getInitials = (name) =>
        name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();

    const renderStudentRow = (row, rowIndex) => (
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
                                    <img src={row.photo} alt={row.name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
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
                                <Link to={`/student/details/${row.id}`} state={{ student: row }}>
                                    <button className="icon-button h-9 w-9">
                                        <img src="/view.png" width={14} height={14} />
                                    </button>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteStudent(row.id)}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-rose-200 bg-rose-50 transition hover:bg-rose-100"
                                >
                                    <img src="/delete.png" width={14} height={14} />
                                </button>
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

    const visibleStudents = useMemo(
        () => getVisibleRows(students, { query: filterQuery, sortAccessor: "name", sortDirection }),
        [students, filterQuery, sortDirection]
    );

    return(
        <Layout>
            <div className="glass-panel-strong flex-1 p-5 m-4 mt-0">
                {/* TOP */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto ">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button
                                type="button"
                                onClick={handleFilterClick}
                                title="Filter students"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm "
                            >
                                <img src="/filter.png" alt="" width={14} height={14} />
                            </button>
                            <button
                                type="button"
                                onClick={handleSortClick}
                                title={`Sort by name (${sortDirection})`}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm "
                            >
                                <img src="/sort.png" alt="" width={14} height={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(true)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm "
                            >
                                <img src="/plus.png" alt="" width={14} height={14} />
                            </button>
                        </div>
                    </div>
                </div>
                {loading && <p className="mb-3 text-sm text-slate-500">Loading students...</p>}
                {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
                {/* LIST */}
                <Table columns={columns} data={visibleStudents} onDelete={handleDeleteStudent} renderRow={renderStudentRow} />
                {/* PAGINATION */}
                <Pagination />
            </div>
            <FormModel
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddStudent}
                title="Add Student"
                submitLabel="Add Student"
                fields={addStudentFields}
            />
            <FilterModal
                open={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleApplyFilter}
                initialValue={filterQuery}
                title="Filter Students"
            />
        </Layout>
    );
}



