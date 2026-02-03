import { Link } from "react-router-dom";
import { Pagination } from "../../../components/Pagination";
import { Table } from "../../../components/Table";
import { TableSearch } from "../../../components/TableSearch";
import { assignmentsData } from "../../../lib/data";
import { Layout } from "../../Layout";

export function AssignmentsListPage () {


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
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-200 ">
                                <img src="/plus.png" alt="" width={14} height={14} />
                            </button>
                        </div>
                    </div>
                </div>
                {/* LIST */}
                <Table columns={columns} data={assignmentsData} />
                {/* PAGINATION */}
                <Pagination />
            </div>
        </Layout>
    );
}