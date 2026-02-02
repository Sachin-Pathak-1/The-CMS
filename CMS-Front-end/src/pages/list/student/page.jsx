import { Link } from "react-router-dom";
import { Pagination } from "../../../components/Pagination";
import { Table } from "../../../components/Table";
import { TableSearch } from "../../../components/TableSearch";
import { studentsData } from "../../../lib/data";
import { Layout } from "../../Layout";

export function StudentListPage () {


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

    return(
        <Layout>
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                {/* TOP */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
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
                <Table columns={columns} data={studentsData} />
                {/* PAGINATION */}
                <Pagination />
            </div>
        </Layout>
    );
}