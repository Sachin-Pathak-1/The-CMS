import { useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "../../../components/Pagination";
import { Table } from "../../../components/Table";
import { TableSearch } from "../../../components/TableSearch";
import { FormModel } from "../../../components/FormModel";
import { teachersData } from "../../../lib/data";
import { Layout } from "../../Layout";

export function TeacherListPage () {
    const [teachers, setTeachers] = useState(teachersData);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);


    const columns = [
        {
            header:"Info" ,
            accessor:"info",
        },
        {
            header:"Teacher ID" ,
            accessor:"teacherId",
            className: "hidden md:table-cell",
        },
        {
            header:"Subjects" ,
            accessor:"subjects",
            className: "hidden md:table-cell",
        },
        {
            header:"Classes" ,
            accessor:"classes",
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

    const handleAddTeacher = (formData) => {
        const toList = (value) =>
            value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

        const newTeacher = {
            id: teachers.length ? Math.max(...teachers.map((t) => t.id)) + 1 : 1,
            name: formData.name.trim(),
            email: formData.email.trim(),
            teacherId: formData.teacherId.trim(),
            subjects: toList(formData.subjects),
            classes: toList(formData.classes),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            photo: formData.photo.trim(),
        };

        setTeachers((prev) => [newTeacher, ...prev]);
        setIsAddModalOpen(false);
    };

    const handleDeleteTeacher = (teacherId) => {
        setTeachers((prev) => prev.filter((teacher) => teacher.id !== teacherId));
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
            className={`border-t hover:bg-gray-50 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
        >
            {columns.map((col) => {
                if (col.accessor === "info") {
                    return (
                        <td key={col.accessor} className={`p-2 ${col.className || ""}`}>
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
                                    <p className="text-xs text-gray-500">{row.email}</p>
                                </div>
                            </div>
                        </td>
                    );
                }

                if (col.accessor === "action") {
                    return (
                        <td key={col.accessor} className={`p-2 ${col.className || ""}`}>
                            <div className="flex justify-center gap-3">
                                <Link to="/teacher/details">
                                    <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                        <img src="/view.png" width={14} height={14} />
                                    </button>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteTeacher(row.id)}
                                    className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
                                >
                                    <img src="/delete.png" width={14} height={14} />
                                </button>
                            </div>
                        </td>
                    );
                }

                const value = row[col.accessor];
                return (
                    <td key={col.accessor} className={`p-2 ${col.className || ""}`}>
                        {Array.isArray(value) ? value.join(", ") : value}
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
                    <h1 className="hidden md:block text-lg font-semibold">All Teachers</h1>
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
                <Table
                    columns={columns}
                    data={teachers}
                    onDelete={handleDeleteTeacher}
                    renderRow={renderTeacherRow}
                />
                {/* PAGINATION */}
                <Pagination />
            </div>
            <FormModel
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddTeacher}
            />
        </Layout>
    );
}
