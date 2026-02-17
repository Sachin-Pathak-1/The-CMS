import { useState } from "react";
import { Pagination } from "../../../components/Pagination";
import { Table } from "../../../components/Table";
import { TableSearch } from "../../../components/TableSearch";
import { lessonsData } from "../../../lib/data";
import { Layout } from "../../Layout";

export function LessonsListPage () {
    const [lessons, setLessons] = useState(lessonsData);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingLessonId, setEditingLessonId] = useState(null);
    const [editForm, setEditForm] = useState({ subject: "", class: "", teacher: "" });


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
            header:"Actions",
            accessor:"action",   
        },
    ]

    const handleDeleteLesson = (lessonId) => {
        setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId));
    };

    const openEditModal = (lesson) => {
        setEditingLessonId(lesson.id);
        setEditForm({
            subject: lesson.subject || "",
            class: lesson.class || "",
            teacher: lesson.teacher || "",
        });
        setIsEditOpen(true);
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setEditingLessonId(null);
        setEditForm({ subject: "", class: "", teacher: "" });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateLesson = (e) => {
        e.preventDefault();
        if (!editingLessonId) return;

        setLessons((prev) =>
            prev.map((lesson) =>
                lesson.id === editingLessonId
                    ? {
                        ...lesson,
                        subject: editForm.subject.trim(),
                        class: editForm.class.trim(),
                        teacher: editForm.teacher.trim(),
                    }
                    : lesson
            )
        );

        closeEditModal();
    };

    const renderLessonRow = (row, rowIndex) => (
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
                                    onClick={() => openEditModal(row)}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                                >
                                    <img src="/edit.png" width={14} height={14} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteLesson(row.id)}
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
                    <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto ">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200 ">
                                <img src="/filter.png" alt="" width={14} height={14} />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200 ">
                                <img src="/sort.png" alt="" width={14} height={14} />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200 ">
                                <img src="/plus.png" alt="" width={14} height={14} />
                            </button>
                        </div>
                    </div>
                </div>
                {/* LIST */}
                <Table columns={columns} data={lessons} onDelete={handleDeleteLesson} renderRow={renderLessonRow} />
                {/* PAGINATION */}
                <Pagination />
            </div>
            {isEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-xl bg-white p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Edit Lesson</h2>
                            <button type="button" onClick={closeEditModal} className="text-sm text-gray-500 hover:text-gray-700">
                                Close
                            </button>
                        </div>
                        <form onSubmit={handleUpdateLesson} className="space-y-3">
                            <input
                                name="subject"
                                value={editForm.subject}
                                onChange={handleEditChange}
                                placeholder="Subject"
                                required
                                className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                            />
                            <input
                                name="class"
                                value={editForm.class}
                                onChange={handleEditChange}
                                placeholder="Class"
                                required
                                className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                            />
                            <input
                                name="teacher"
                                value={editForm.teacher}
                                onChange={handleEditChange}
                                placeholder="Teacher"
                                required
                                className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                            />
                            <div className="mt-2 flex justify-end gap-2">
                                <button type="button" onClick={closeEditModal} className="rounded-md border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
}
