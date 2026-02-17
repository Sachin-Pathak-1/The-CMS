import { useState } from "react";
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
                <Table columns={columns} data={teachers} onDelete={handleDeleteTeacher} />
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
