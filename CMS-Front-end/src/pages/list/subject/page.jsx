import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pagination } from "../../../components/Pagination";
import { Table } from "../../../components/Table";
import { TableSearch } from "../../../components/TableSearch";
import { FormModel } from "../../../components/FormModel";
import { FilterModal } from "../../../components/FilterModal";
import { subjectsData } from "../../../lib/data";
import { getVisibleRows } from "../../../lib/listUtils";
import { Layout } from "../../Layout";

export function SubjectListPage () {
    const [subjects, setSubjects] = useState(subjectsData);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");
    const addSubjectFields = [
        { name: "name", placeholder: "Subject Name" },
        { name: "teachers", placeholder: "Teachers (comma separated)", fullWidth: true },
    ];


    const columns = [
        {
            header:"Subject Name" ,
            accessor:"name",
        },
        {
            header:"Teachers" ,
            accessor:"teachers",
            className: "hidden md:table-cell",
        },
        {
            header:"Actions",
            accessor:"action",   
        },
    ]

    const handleDeleteSubject = (subjectId) => {
        setSubjects((prev) => prev.filter((subject) => subject.id !== subjectId));
    };

    const handleAddSubject = (formData) => {
        const newSubject = {
            id: subjects.length ? Math.max(...subjects.map((s) => s.id)) + 1 : 1,
            name: formData.name.trim(),
            teachers: formData.teachers.split(",").map((teacher) => teacher.trim()).filter(Boolean),
        };

        setSubjects((prev) => [newSubject, ...prev]);
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

    const renderSubjectRow = (row, rowIndex) => (
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
                                    onClick={() => handleDeleteSubject(row.id)}
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

    const visibleSubjects = useMemo(
        () => getVisibleRows(subjects, { query: filterQuery, sortAccessor: "name", sortDirection }),
        [subjects, filterQuery, sortDirection]
    );

    return(
        <Layout>
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                {/* TOP */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="hidden md:block text-lg font-semibold">All Subjects</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto ">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button
                                type="button"
                                onClick={handleFilterClick}
                                title="Filter subjects"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200 "
                            >
                                <img src="/filter.png" alt="" width={14} height={14} />
                            </button>
                            <button
                                type="button"
                                onClick={handleSortClick}
                                title={`Sort by subject (${sortDirection})`}
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
                {/* LIST */}
                <Table columns={columns} data={visibleSubjects} onDelete={handleDeleteSubject} renderRow={renderSubjectRow} />
                {/* PAGINATION */}
                <Pagination />
            </div>
            <FormModel
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddSubject}
                title="Add Subject"
                submitLabel="Add Subject"
                fields={addSubjectFields}
            />
            <FilterModal
                open={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleApplyFilter}
                initialValue={filterQuery}
                title="Filter Subjects"
            />
        </Layout>
    );
}
