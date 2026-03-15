import { useMemo, useState } from "react";
import { FormModel } from "../../../components/FormModel";
import { FilterModal } from "../../../components/FilterModal";
import { getVisibleRows } from "../../../lib/listUtils";
import { useBackendList } from "../../../hooks/useBackendList";
import { usePagination } from "../../../hooks/usePagination";
import { apiRequest } from "../../../lib/apiClient";
import { useAuth } from "../../../contexts/AuthContext";
import { Pagination } from "../../../components/Pagination";

const formatDisplayDate = (value) => {
    if (!value) return "No date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
};

export function AnnouncemetnsListPage() {
    const { data: announcements, loading, error, reload } = useBackendList("announcements");
    const { user } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("desc");
    const [actionError, setActionError] = useState("");

    const canManageAnnouncements = user?.type === "admin" || user?.type === "teacher";

    const addAnnouncementFields = [
        { name: "title", placeholder: "Announcement title" },
        { name: "description", placeholder: "Description", fullWidth: true },
    ];

    const handleDeleteAnnouncement = async (announcementId) => {
        try {
            setActionError("");
            await apiRequest(`/academic/announcements/${announcementId}`, { method: "DELETE" });
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to delete announcement");
        }
    };

    const handleAddAnnouncement = async (formData) => {
        try {
            setActionError("");
            await apiRequest("/academic/announcements", {
                method: "POST",
                body: JSON.stringify({
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                }),
            });
            setIsAddModalOpen(false);
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to create announcement");
        }
    };

    const combinedQuery = [searchQuery.trim(), filterQuery.trim()].filter(Boolean).join(" ");
    const visibleAnnouncements = useMemo(
        () => getVisibleRows(announcements, { query: combinedQuery, sortAccessor: "title", sortDirection }),
        [announcements, combinedQuery, sortDirection]
    );
    const {
        currentPage,
        pageSize,
        paginatedData: paginatedAnnouncements,
        setCurrentPage,
        totalItems,
        totalPages,
    } = usePagination(visibleAnnouncements, { pageSize: 10 });
    const featuredAnnouncement = visibleAnnouncements[0] || null;

    return (
        <>
            <div className="m-4 mt-0 flex flex-col gap-6">
                <section className="hero-panel">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <span className="page-tag">Announcement Center</span>
                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-800">
                                Important updates, directly from the backend
                            </h1>
                            <p className="section-copy max-w-xl">
                                This board now reads and writes real announcement records instead of temporary client-side items.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="soft-panel p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Total</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-800">{announcements.length}</p>
                            </div>
                            <div className="soft-panel p-4">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Latest</p>
                                <p className="mt-2 text-lg font-semibold text-slate-800">
                                    {formatDisplayDate(featuredAnnouncement?.date)}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="glass-panel p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">Browse announcements</h2>
                            <p className="mt-1 text-sm text-slate-500">Search by title, class, author, or description.</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(event) => {
                                    setCurrentPage(1);
                                    setSearchQuery(event.target.value);
                                }}
                                placeholder="Search announcements..."
                                className="field-input sm:w-72"
                            />
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={() => setIsFilterModalOpen(true)} className="btn-secondary">
                                    Filter
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCurrentPage(1);
                                        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                                    }}
                                    className="btn-secondary"
                                >
                                    {sortDirection === "asc" ? "A-Z" : "Z-A"}
                                </button>
                                {canManageAnnouncements ? (
                                    <button type="button" onClick={() => setIsAddModalOpen(true)} className="btn-primary">
                                        New Announcement
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>

                {loading && <p className="text-sm text-slate-500">Loading announcements...</p>}
                {error && <p className="text-sm text-rose-600">{error}</p>}
                {actionError && <p className="text-sm text-rose-600">{actionError}</p>}

                {!loading && !error && visibleAnnouncements.length === 0 ? (
                    <section className="glass-panel p-10 text-center">
                        <h3 className="text-xl font-semibold text-slate-800">No announcements found</h3>
                        <p className="mt-2 text-sm text-slate-500">Try a different keyword or create a new announcement.</p>
                    </section>
                ) : null}

                {featuredAnnouncement ? (
                    <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                        <article className="glass-panel overflow-hidden p-0">
                            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white">
                                <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-300">
                                    Featured
                                </span>
                                <h2 className="mt-4 text-3xl font-semibold">{featuredAnnouncement.title}</h2>
                                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
                                    {featuredAnnouncement.description || "No description provided."}
                                </p>
                            </div>
                            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Posted by</p>
                                    <p className="mt-1 text-base font-semibold text-slate-800">{featuredAnnouncement.postedBy || "School Admin"}</p>
                                </div>
                                {canManageAnnouncements ? (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteAnnouncement(featuredAnnouncement.id)}
                                        className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                    >
                                        Delete Announcement
                                    </button>
                                ) : null}
                            </div>
                        </article>

                        <aside className="glass-panel p-6">
                            <h3 className="text-lg font-semibold text-slate-800">All current announcements</h3>
                            <div className="mt-5 space-y-3">
                                {paginatedAnnouncements.map((announcement) => (
                                    <div key={announcement.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{announcement.title}</p>
                                                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                                                    {announcement.class || "General"} | {formatDisplayDate(announcement.date)}
                                                </p>
                                            </div>
                                            {canManageAnnouncements ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteAnnouncement(announcement.id)}
                                                    className="rounded-full bg-white p-2 shadow-sm transition hover:bg-slate-100"
                                                >
                                                    <img src="/delete.png" alt="" width={14} height={14} />
                                                </button>
                                            ) : null}
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-slate-600">
                                            {announcement.description || "No description provided."}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                pageSize={pageSize}
                                onPageChange={setCurrentPage}
                            />
                        </aside>
                    </section>
                ) : null}
            </div>

            {canManageAnnouncements ? (
                <FormModel
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddAnnouncement}
                    title="Add Announcement"
                    submitLabel="Add Announcement"
                    fields={addAnnouncementFields}
                />
            ) : null}
            <FilterModal
                open={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={(nextQuery) => {
                    setCurrentPage(1);
                    setFilterQuery(nextQuery);
                    setIsFilterModalOpen(false);
                }}
                initialValue={filterQuery}
                title="Filter Announcements"
            />
        </>
    );
}
