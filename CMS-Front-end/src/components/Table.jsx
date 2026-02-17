import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Table({ data, columns, onDelete, renderRow }) {
    const [tableData, setTableData] = useState(data);
    const isControlledDelete = typeof onDelete === "function";
    const rows = isControlledDelete ? data : tableData;

    useEffect(() => {
        setTableData(data);
    }, [data]);

    const handleDelete = (rowId) => {
        if (isControlledDelete) {
            onDelete(rowId);
            return;
        }
        setTableData((prev) => prev.filter((item) => item.id !== rowId));
    };

    const renderTableHead = () => (
        <thead className="bg-gray-50 text-gray-600">
            <tr>
                {columns.map((col) => (
                    <th
                        key={col.accessor}
                        className={`p-2 ${col.accessor === "action" ? "text-center" : "text-left"} ${col.className || ""}`}
                    >
                        {col.header}
                    </th>
                ))}
            </tr>
        </thead>
    );

    const renderDefaultRow = (row, rowIndex) => (
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
                                    <img
                                        src={row.photo}
                                        alt={row.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
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
                                <Link to={`/student/details`}>
                                    <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                        <img src="/view.png" width={14} height={14} />
                                    </button>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(row.id)}
                                    className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
                                >
                                    <img src="/delete.png" width={14} height={14} />
                                </button>
                            </div>
                        </td>
                    );
                }

                if (Array.isArray(row[col.accessor])) {
                    return (
                        <td key={col.accessor} className={`p-2 ${col.className || ""}`}>
                            {row[col.accessor].join(", ")}
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

    // converts "John Doe" -> "JD"
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };


    return (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-sm table-auto">
                {renderTableHead()}

                {/* ================= BODY ================= */}
                <tbody>
                    {rows.map((row, rowIndex) =>
                        renderRow ? renderRow(row, rowIndex) : renderDefaultRow(row, rowIndex)
                    )}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="p-4 text-center text-sm text-gray-500">
                                No records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

