import { useMemo, useState } from "react";
import { FormModel } from "../../../components/FormModel";
import { FilterModal } from "../../../components/FilterModal";
import { getVisibleRows } from "../../../lib/listUtils";
import { useBackendList } from "../../../hooks/useBackendList";
import { Layout } from "../../Layout";

const accentStyles = [
    "from-sky-100 via-white to-cyan-50 border-sky-200",
    "from-amber-100 via-white to-orange-50 border-amber-200",
    "from-rose-100 via-white to-pink-50 border-rose-200",
    "from-violet-100 via-white to-fuchsia-50 border-violet-200",
];

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

const getRelativeDayLabel = (value) => {
    if (!value) return "Undated";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Undated";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffDays = Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === -1) return "Yesterday";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
};

export function AnnouncemetnsListPage () {
    const { data: announcements, setData: setAnnouncements, loading, error } = useBackendList("announcements");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterQuery, setFilterQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("desc");

    const addAnnouncementFields = [
        { name: "title", placeholder: "Announcement title" },
        { name: "class", placeholder: "Audience / Class" },
        { name: "date", type: "date", placeholder: "Publish date" },
        { name: "description", placeholder: "Short description", fullWidth: true, required: false },
    ];

    const handleDeleteAnnouncement = (announcementId) => {
        setAnnouncements((prev) => prev.filter((announcement) => announcement.id !== announcementId));
    };

    const handleAddAnnouncement = (formData) => {
        const newAnnouncement = {
            id: announcements.length ? Math.max(...announcements.map((a) => a.id)) + 1 : 1,
            title: formData.title.trim(),
            class: formData.class.trim() || "General",
            date: formData.date,
            description: formData.description?.trim() || "No description provided.",
            postedBy: "You",
        };

        setAnnouncements((prev) => [newAnnouncement, ...prev]);
        setIsAddModalOpen(false);
    };

    const handleApplyFilter = (nextQuery) => {
        setFilterQuery(nextQuery);
        setIsFilterModalOpen(false);
    };

    const combinedQuery = [searchQuery.trim(), filterQuery.trim()].filter(Boolean).join(" ");

    const visibleAnnouncements = useMemo(
        () => getVisibleRows(announcements, { query: combinedQuery, sortAccessor: "title", sortDirection }),
        [announcements, combinedQuery, sortDirection]
    );

    const featuredAnnouncement = visibleAnnouncements[0] || null;
    const remainingAnnouncements = featuredAnnouncement ? visibleAnnouncements.slice(1) : [];
    const uniqueClasses = new Set(announcements.map((item) => item.class).filter(Boolean)).size;
    const latestAnnouncementDate = announcements.length
        ? [...announcements]
            .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())[0]?.date
        : null;
    const audienceBreakdown = Object.entries(
        announcements.reduce((acc, item) => {
            const key = item.class || "General";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {})
    )
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 5);
    const flowAnnouncements = visibleAnnouncements.slice(0, 5);

    return(
        <Layout>
            <div className="m-4 mt-0 flex flex-col gap-6">
                <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-gradient-to-br from-[#fff3d6] via-white to-[#dff4ff] p-6 shadow-sm">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/40 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-sky-100/60 blur-2xl" />
                    <div className="pointer-events-none absolute right-6 top-6 hidden opacity-10 lg:block">
                        <img src="/announcement.png" alt="" width={40} height={40} />
                    </div>
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Announcement Center
                            </span>
                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-800">
                                Important updates, without the clutter
                            </h1>
                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
                                This view highlights the latest notices first, keeps the key context visible, and makes each update easier to scan.
                            </p>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {audienceBreakdown.map(([audience, count]) => (
                                    <span key={audience} className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600">
                                        {audience} | {count}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Total</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-800">{announcements.length}</p>
                                <p className="mt-1 text-xs text-slate-500">Announcements available</p>
                            </div>
                            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Audience</p>
                                <p className="mt-2 text-2xl font-semibold text-slate-800">{uniqueClasses || 0}</p>
                                <p className="mt-1 text-xs text-slate-500">Classes or groups covered</p>
                            </div>
                            <div className="rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur">
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Latest</p>
                                <p className="mt-2 text-lg font-semibold text-slate-800">{formatDisplayDate(latestAnnouncementDate)}</p>
                                <p className="mt-1 text-xs text-slate-500">Most recent publish date</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">Browse announcements</h2>
                            <p className="mt-1 text-sm text-slate-500">Search by title, class, author, or any keyword from the announcement content.</p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm">
                                <img src="/search.png" alt="" width={14} height={14} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search announcements..."
                                    className="w-full bg-transparent outline-none sm:w-64"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsFilterModalOpen(true)}
                                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                >
                                    Filter
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
                                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                >
                                    {sortDirection === "asc" ? "A-Z" : "Z-A"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                                >
                                    New Announcement
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {loading && <p className="text-sm text-slate-500">Loading announcements...</p>}
                {error && <p className="text-sm text-red-500">{error}</p>}

                {!loading && !error && visibleAnnouncements.length === 0 && (
                    <section className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-800">No announcements found</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Try a different keyword or add a fresh announcement to get this board moving.
                        </p>
                    </section>
                )}

                {!loading && !error && featuredAnnouncement && (
                    <section className="grid items-start gap-6 xl:grid-cols-[0.9fr_1.3fr_0.8fr]">
                        <aside className="h-fit rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-800">Announcement flow</h3>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                    Timeline
                                </span>
                            </div>
                            <div className="mt-6 space-y-5">
                                {flowAnnouncements.map((announcement, index) => (
                                    <div key={announcement.id} className="relative pl-9">
                                        {index !== flowAnnouncements.length - 1 && (
                                            <span className="absolute left-[11px] top-8 h-[calc(100%+16px)] w-px bg-slate-200" />
                                        )}
                                        <span className="absolute left-0 top-1 h-6 w-6 rounded-full border-[5px] border-white bg-slate-800 shadow-sm" />
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            {getRelativeDayLabel(announcement.date)}
                                        </p>
                                        <h4 className="mt-1 text-sm font-semibold text-slate-800">{announcement.title}</h4>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            {announcement.class || "General"} | {announcement.postedBy || "School Admin"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </aside>

                        <article className="h-fit overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white">
                                <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-slate-300">
                                    <span className="rounded-full bg-white/10 px-3 py-1">Featured</span>
                                    <span>{featuredAnnouncement.class || "General"}</span>
                                    <span>{formatDisplayDate(featuredAnnouncement.date)}</span>
                                    <span>{getRelativeDayLabel(featuredAnnouncement.date)}</span>
                                </div>
                                <h2 className="mt-4 text-3xl font-semibold leading-tight">
                                    {featuredAnnouncement.title}
                                </h2>
                                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
                                    {featuredAnnouncement.description || "No description provided."}
                                </p>
                                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                    <div className="rounded-2xl bg-white/10 p-4">
                                        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300">Audience</p>
                                        <p className="mt-2 text-base font-semibold text-white">{featuredAnnouncement.class || "General"}</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/10 p-4">
                                        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300">Author</p>
                                        <p className="mt-2 text-base font-semibold text-white">{featuredAnnouncement.postedBy || "School Admin"}</p>
                                    </div>
                                    <div className="rounded-2xl bg-white/10 p-4">
                                        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300">Status</p>
                                        <p className="mt-2 text-base font-semibold text-white">Active Notice</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Posted by</p>
                                    <p className="mt-1 text-base font-semibold text-slate-800">{featuredAnnouncement.postedBy || "School Admin"}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteAnnouncement(featuredAnnouncement.id)}
                                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                >
                                    Delete Announcement
                                </button>
                            </div>
                        </article>

                        <aside className="h-fit rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-800">Quick summary</h3>
                            <div className="mt-5 space-y-4">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Top audience</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-800">{featuredAnnouncement.class || "General"}</p>
                                    <p className="mt-1 text-sm text-slate-500">Current lead announcement target group.</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Publisher</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-800">{featuredAnnouncement.postedBy || "School Admin"}</p>
                                    <p className="mt-1 text-sm text-slate-500">Use this to see where the latest notice came from.</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Visible now</p>
                                    <p className="mt-2 text-lg font-semibold text-slate-800">{visibleAnnouncements.length}</p>
                                    <p className="mt-1 text-sm text-slate-500">Announcements matching the current search and filter.</p>
                                </div>
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Audience mix</p>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {audienceBreakdown.length === 0 && (
                                            <span className="text-sm text-slate-500">No audience data</span>
                                        )}
                                        {audienceBreakdown.map(([audience, count]) => (
                                            <span key={audience} className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
                                                {audience} ({count})
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-amber-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Notice board</p>
                                    <div className="mt-4 grid grid-cols-[1.2fr_0.8fr] gap-3">
                                        <div className="rounded-2xl bg-slate-900 p-4 text-white">
                                            <img src="/announcement.png" alt="" width={22} height={22} />
                                            <p className="mt-4 text-base font-semibold">Keep updates visible</p>
                                            <p className="mt-1 text-sm leading-6 text-slate-300">
                                                Important notices now have clearer context and a stronger visual anchor.
                                            </p>
                                        </div>
                                        <div className="grid gap-3">
                                            <div className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm">
                                                <div>
                                                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Latest</p>
                                                    <p className="mt-1 text-sm font-semibold text-slate-800">{formatDisplayDate(latestAnnouncementDate)}</p>
                                                </div>
                                                <img src="/calendar.png" alt="" width={22} height={22} />
                                            </div>
                                            <div className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm">
                                                <div>
                                                    <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Publisher</p>
                                                    <p className="mt-1 text-sm font-semibold text-slate-800">{featuredAnnouncement.postedBy || "School Admin"}</p>
                                                </div>
                                                <img src="/profile.png" alt="" width={22} height={22} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </section>
                )}

                {!loading && !error && remainingAnnouncements.length > 0 && (
                    <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                        {remainingAnnouncements.map((announcement, index) => (
                            <article
                                key={announcement.id}
                                className={`rounded-[24px] border bg-gradient-to-br p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${accentStyles[index % accentStyles.length]}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                            {announcement.class || "General"}
                                        </span>
                                        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            {getRelativeDayLabel(announcement.date)}
                                        </p>
                                        <h3 className="mt-3 text-lg font-semibold leading-snug text-slate-800">
                                            {announcement.title}
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                                        className="rounded-full bg-white/80 p-2 transition hover:bg-white"
                                        aria-label={`Delete ${announcement.title}`}
                                    >
                                        <img src="/delete.png" alt="" width={14} height={14} />
                                    </button>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-slate-600">
                                    {announcement.description || "No description provided."}
                                </p>
                                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/80 pt-4 text-sm text-slate-500">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Posted by</p>
                                        <p className="mt-1 font-medium text-slate-700">{announcement.postedBy || "School Admin"}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Date</p>
                                        <p className="mt-1 font-medium text-slate-700">{formatDisplayDate(announcement.date)}</p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>

            <FormModel
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddAnnouncement}
                title="Add Announcement"
                submitLabel="Add Announcement"
                fields={addAnnouncementFields}
            />
            <FilterModal
                open={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApply={handleApplyFilter}
                initialValue={filterQuery}
                title="Filter Announcements"
            />
        </Layout>
    );
}
