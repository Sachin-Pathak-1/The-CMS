import { useMemo, useState } from "react";
import { Pagination } from "../../../components/Pagination";
import { Table } from "../../../components/Table";
import { TableSearch } from "../../../components/TableSearch";
import { FormModel } from "../../../components/FormModel";
import { FilterModal } from "../../../components/FilterModal";
import { attendanceData } from "../../../lib/data";
import { getVisibleRows } from "../../../lib/listUtils";
import { Layout } from "../../Layout";

export function AttendanceListPage() {
    const [attendance, setAttendance] = useState(attendanceData);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");

    const addAttendanceFields = [
        { name: "student", placeholder: "Student Name" },
        { name: "class", placeholder: "Class (e.g. 5A)" },
        { name: "date", type: "date", placeholder: "Date" },
        { name: "status", placeholder: "Status (Present/Late/Absent)" },
        { name: "checkIn", type: "time", placeholder: "Check-in Time", required: false },
    ];

    const columns = [
        { header: "Student", accessor: "student" },
        { header: "Class", accessor: "class", className: "hidden sm:table-cell" },
        { header: "Date", accessor: "date", className: "hidden md:table-cell" },
        { header: "Status", accessor: "status", className: "hidden md:table-cell" },
        { header: "Check In", accessor: "checkIn", className: "hidden lg:table-cell" },
        { header: "Actions", accessor: "action" },
    ];

    const normalizeStatus = (value) => {
        const next = value.trim().toLowerCase();
        if (next === "late") return "Late";
        if (next === "absent") return "Absent";
        return "Present";
    };

    const handleDeleteAttendance = (attendanceId) => {
        setAttendance((prev) => prev.filter((entry) => entry.id !== attendanceId));
    };

    const handleAddAttendance = (formData) => {
        const status = normalizeStatus(formData.status);
        const newEntry = {
            id: attendance.length ? Math.max(...attendance.map((entry) => entry.id)) + 1 : 1,
            student: formData.student.trim(),
            class: formData.class.trim(),
            date: formData.date,
            status,
            checkIn: status === "Absent" ? "-" : (formData.checkIn || "08:00"),
        };

        setAttendance((prev) => [newEntry, ...prev]);
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

    const getStatusBadgeClass = (status) => {
        if (status === "Present") return "bg-green-100 text-green-700";
        if (status === "Late") return "bg-yellow-100 text-yellow-700";
        return "bg-red-100 text-red-700";
    };

    const renderAttendanceRow = (row, rowIndex) => (
        <tr
            key={row.id}
            className={`border-t hover:bg-gray-50 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
        >
            {columns.map((col) => {
                if (col.accessor === "action") {
                    return (
                        <td key={col.accessor} className={`p-2 ${col.className || ""}`}>
                            <div className="flex justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleDeleteAttendance(row.id)}
                                    className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
                                >
                                    <img src="/delete.png" width={14} height={14} />
                                </button>
                            </div>
                        </td>
                    );
                }

                if (col.accessor === "status") {
                    return (
                        <td key={col.accessor} className={`p-2 ${col.className || ""}`}>
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClass(row.status)}`}>
                                {row.status}
                            </span>
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

    const visibleAttendance = useMemo(
        () => getVisibleRows(attendance, { query: filterQuery, sortAccessor: "student", sortDirection }),
        [attendance, filterQuery, sortDirection]
    );

    return (
        <Layout>
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                <div className="flex items-center justify-between mb-5">
                    <h1 className="hidden md:block text-lg font-semibold">Attendance</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto ">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button
                                type="button"
                                onClick={handleFilterClick}
                                title="Filter attendance"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200 "
                            >
                                <img src="/filter.png" alt="" width={14} height={14} />
                            </button>
                            <button
                                type="button"
                                onClick={handleSortClick}
                                title={`Sort by student (${sortDirection})`}
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

                <Table
                    columns={columns}
                    data={visibleAttendance}
                    onDelete={handleDeleteAttendance}
                    renderRow={renderAttendanceRow}
                />
                <Pagination />
            </div>

            <FormModel
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddAttendance}
                title="Add Attendance"
                submitLabel="Add Attendance"
                fields={addAttendanceFields}
            />
            <FilterModal
                open={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleApplyFilter}
                initialValue={filterQuery}
                title="Filter Attendance"
            />
        </Layout>
    );
}
