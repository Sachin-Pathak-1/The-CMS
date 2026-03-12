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

export function EventsListPage () {
    const { data: events, setData: setEvents, loading, error } = useBackendList("events");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("none");
    const addEventFields = [
        { name: "title", placeholder: "Title" },
        { name: "class", placeholder: "Class" },
        { name: "date", type: "date", placeholder: "Date" },
        { name: "startTime", type: "time", placeholder: "Start Time" },
        { name: "endTime", type: "time", placeholder: "End Time" },
    ];


    const columns = [
        {
            header:"Title" ,
            accessor:"title",
        },
        {
            header:"Class" ,
            accessor:"class",
            className: "hidden sm:table-cell",
            
        },
        {
            header:"Date" ,
            accessor:"date",
            className: "hidden md:table-cell",
        },
        {
            header:"Start Time" ,
            accessor:"startTime",
            className: "hidden md:table-cell",
        },
        {
            header:"End Time" ,
            accessor:"endTime",
            className: "hidden md:table-cell",
        },
        {
            header:"Actions",
            accessor:"action",   
        },
    ]

    const handleDeleteEvent = (eventId) => {
        setEvents((prev) => prev.filter((event) => event.id !== eventId));
    };

    const handleAddEvent = (formData) => {
        const newEvent = {
            id: events.length ? Math.max(...events.map((e) => e.id)) + 1 : 1,
            title: formData.title.trim(),
            class: formData.class.trim(),
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
        };

        setEvents((prev) => [newEvent, ...prev]);
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

    const renderEventRow = (row, rowIndex) => (
        <tr
            key={row.id}
            className={`border-t border-slate-100 transition hover:bg-slate-50/80 ${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}
        >
            {columns.map((col) => {
                if (col.accessor === "action") {
                    return (
                        <td key={col.accessor} className={`px-4 py-4 ${col.className || ""}`}>
                            <div className="flex justify-center gap-3">
                                <Link to="/">
                                    <button className="icon-button h-9 w-9">
                                        <img src="/view.png" width={14} height={14} />
                                    </button>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteEvent(row.id)}
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

    const visibleEvents = useMemo(
        () => getVisibleRows(events, { query: filterQuery, sortAccessor: "title", sortDirection }),
        [events, filterQuery, sortDirection]
    );

    return(
        <Layout>
            <div className="glass-panel-strong flex-1 p-5 m-4 mt-0">
                {/* TOP */}
                <div className="flex items-center justify-between mb-5">
                    <h1 className="hidden md:block text-lg font-semibold">All Events</h1>
                    <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto ">
                        <TableSearch />
                        <div className="flex items-center gap-4 self-end">
                            <button
                                type="button"
                                onClick={handleFilterClick}
                                title="Filter events"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 border border-slate-200 shadow-sm "
                            >
                                <img src="/filter.png" alt="" width={14} height={14} />
                            </button>
                            <button
                                type="button"
                                onClick={handleSortClick}
                                title={`Sort by title (${sortDirection})`}
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
                {loading && <p className="mb-3 text-sm text-slate-500">Loading events...</p>}
                {error && <p className="mb-3 text-sm text-rose-600">{error}</p>}
                {/* LIST */}
                <Table columns={columns} data={visibleEvents} onDelete={handleDeleteEvent} renderRow={renderEventRow} />
                {/* PAGINATION */}
                <Pagination />
            </div>
            <FormModel
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddEvent}
                title="Add Event"
                submitLabel="Add Event"
                fields={addEventFields}
            />
            <FilterModal
                open={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleApplyFilter}
                initialValue={filterQuery}
                title="Filter Events"
            />
        </Layout>
    );
}



