import { useMemo, useState } from "react";
import { Search, Filter, Eye, TrendingUp, BarChart3, Download } from "lucide-react";
import { useBackendList } from "../../../hooks/useBackendList";
import { usePagination } from "../../../hooks/usePagination";
import { getVisibleRows } from "../../../lib/listUtils";
import { Card } from "../../../lib/designSystem";
import { exportToCsv } from "../../../lib/exportCsv";

const cn = (...values) => values.filter(Boolean).join(" ");

// Custom StatsCard for results page
function StatsCard({ icon, label, value, color = "blue" }) {
    const Icon = icon;
    const colorClasses = {
        blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
        green: { bg: "from-green-600 to-green-400", accent: "bg-green-100 text-green-600" },
        emerald: { bg: "from-emerald-600 to-emerald-400", accent: "bg-emerald-100 text-emerald-600" },
    };

    return (
        <Card gradient className="p-6 group relative overflow-hidden">
            <div className={cn("absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity", `bg-gradient-to-br ${colorClasses[color].bg}`)} />
            <div className="relative z-10">
                <div className={cn("w-12 h-12 p-3 rounded-xl mb-3", colorClasses[color].accent)}>
                    <Icon size={24} />
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
        </Card>
    );
}

function ResultCard({ result }) {
    const getGradeColor = (grade) => {
        if (grade >= 90) return "text-green-600 bg-green-50";
        if (grade >= 80) return "text-blue-600 bg-blue-50";
        if (grade >= 70) return "text-amber-600 bg-amber-50";
        if (grade >= 60) return "text-orange-600 bg-orange-50";
        return "text-rose-600 bg-rose-50";
    };

    return (
        <Card gradient className="p-5 group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate text-lg">{result.studentName}</h3>
                    <p className="text-sm text-slate-500 truncate mt-1">{result.subject}</p>
                    <div className="flex items-center gap-3 mt-4">
                        <div>
                            <p className="text-xs text-slate-600 font-medium">Score</p>
                            <p className="text-2xl font-bold text-slate-900">{result.score}</p>
                        </div>
                        <div>
                            <span className={cn("inline-block px-4 py-2 rounded-lg text-sm font-bold", getGradeColor(result.score))}>
                                {result.grade}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 ms-4">
                    <button className="p-2 hover:bg-green-50 rounded-lg transition" title="View details">
                        <Eye size={18} className="text-green-600" />
                    </button>
                </div>
            </div>
        </Card>
    );
}

export function ResultsListPage() {
    const { data: results, loading, error } = useBackendList("results");
    const [sortDirection, setSortDirection] = useState("none");
    const [searchInput, setSearchInput] = useState("");

    const visibleResults = useMemo(
        () => getVisibleRows(results, { query: searchInput, sortAccessor: "student", sortDirection }),
        [results, searchInput, sortDirection]
    );

    const { currentPage, paginatedData: paginatedResults, setCurrentPage, totalPages } = usePagination(
        visibleResults,
        { pageSize: 9 }
    );

    const averageScore = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + Number(r.score || 0), 0) / results.length) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-green-50/20 p-4 md:p-8">
            {/* Header */}
            <div className="mb-10">
                <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Performance Analytics</p>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">All Results</h1>
                <p className="text-slate-600 text-lg mt-2">Review and analyze student examination results.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                <StatsCard
                    icon={BarChart3}
                    label="Total Results"
                    value={results.length}
                    color="green"
                />
                <StatsCard
                    icon={TrendingUp}
                    label="Average Score"
                    value={averageScore}
                    color="emerald"
                />
            </div>

            {/* Search & Actions Bar */}
            <Card gradient className="p-6 mb-8">
                <div className="flex flex-col gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search results by student name, subject..."
                            value={searchInput}
                            onChange={(e) => {
                                setSearchInput(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition"
                        />
                    </div>
                    <div className="flex gap-3 flex-wrap justify-end">
                        <button
                            onClick={() => exportToCsv("results.csv", visibleResults)}
                            className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition flex items-center gap-2"
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                        <button
                            onClick={() => {
                                setCurrentPage(1);
                                setSortDirection((prev) => (prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"));
                            }}
                            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition flex items-center gap-2"
                        >
                            <Filter size={18} />
                            Sort: {sortDirection === "none" ? "Default" : sortDirection === "asc" ? "A-Z" : "Z-A"}
                        </button>
                    </div>
                </div>
            </Card>

            {error && (
                <Card gradient className="p-6 border-rose-200">
                    <p className="text-rose-700">Error: {error}</p>
                </Card>
            )}

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-slate-600">Loading results...</p>
                </div>
            ) : paginatedResults.length === 0 ? (
                <Card gradient className="p-12 text-center">
                    <BarChart3 size={48} className="mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-500 text-lg">No results found</p>
                </Card>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                        {paginatedResults.map((result) => (
                            <ResultCard key={result.id} result={result} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 flex-wrap">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg font-medium transition",
                                        currentPage === page
                                            ? "bg-green-600 text-white"
                                            : "bg-white border border-slate-200 text-slate-700 hover:border-green-300"
                                    )}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
