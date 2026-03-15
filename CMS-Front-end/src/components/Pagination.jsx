export function Pagination({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    pageSize = 10,
    onPageChange,
}) {
    if (totalItems <= pageSize) {
        return null;
    }

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);
    const adjustedStartPage = Math.max(1, endPage - 2);

    for (let page = adjustedStartPage; page <= endPage; page += 1) {
        pageNumbers.push(page);
    }

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        onPageChange?.(page);
    };

    return (
        <div className="mt-4 flex flex-col gap-3 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium">
                Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems}
            </p>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!canGoPrevious}
                    className="btn-secondary rounded-2xl px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Prev
                </button>
                <div className="flex items-center gap-2 text-xs">
                    {adjustedStartPage > 1 ? (
                        <>
                            <button
                                type="button"
                                onClick={() => handlePageChange(1)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70"
                            >
                                1
                            </button>
                            {adjustedStartPage > 2 ? <span className="px-1">...</span> : null}
                        </>
                    ) : null}
                    {pageNumbers.map((page) => (
                        <button
                            key={page}
                            type="button"
                            onClick={() => handlePageChange(page)}
                            className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${
                                page === currentPage ? "bg-slate-900 text-white" : "bg-white/70"
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    {endPage < totalPages ? (
                        <>
                            {endPage < totalPages - 1 ? <span className="px-1">...</span> : null}
                            <button
                                type="button"
                                onClick={() => handlePageChange(totalPages)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/70"
                            >
                                {totalPages}
                            </button>
                        </>
                    ) : null}
                </div>
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!canGoNext}
                    className="btn-secondary rounded-2xl px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
