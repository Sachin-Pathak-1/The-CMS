import { useMemo, useState } from "react";

export function usePagination(items, { pageSize = 10 } = {}) {
    const [requestedPage, setRequestedPage] = useState(1);

    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const currentPage = Math.min(requestedPage, totalPages);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return items.slice(startIndex, startIndex + pageSize);
    }, [currentPage, items, pageSize]);

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = totalItems === 0 ? 0 : Math.min(currentPage * pageSize, totalItems);

    return {
        currentPage,
        endItem,
        pageSize,
        paginatedData,
        setCurrentPage: (nextPage) => {
            setRequestedPage((prevPage) => {
                const resolvedPage = typeof nextPage === "function" ? nextPage(prevPage) : nextPage;
                return Math.max(1, resolvedPage);
            });
        },
        startItem,
        totalItems,
        totalPages,
    };
}
