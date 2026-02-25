import { useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "../../../components/Pagination";
import { Table } from "../../../components/Table";
import { TableSearch } from "../../../components/TableSearch";
import { FormModel } from "../../../components/FormModel";
import { assignmentsData } from "../../../lib/data";
import { Layout } from "../../Layout";

export function AssignmentsListPage () {
    const [assignments, setAssignments] = useState(assignmentsData);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
                                <Link to="/">
                                    <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                        <img src="/view.png" width={14} height={14} />
                                    </button>
                                </Link>
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

    return(
        <Layout>
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                {/* TOP */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="hidden md:block text-lg font-semibold">All Assignments</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto ">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200 ">
                                <img src="/filter.png" alt="" width={14} height={14} />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200 ">
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
                {/* LIST */}
                <Table columns={columns} data={assignments} onDelete={handleDeleteAssignment} renderRow={renderAssignmentRow} />
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
        </Layout>
    );
}
