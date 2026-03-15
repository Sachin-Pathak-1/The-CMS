import { useMemo, useState } from "react";
import { Search, Plus, Filter, Eye, Trash2, TrendingUp, BarChart3 } from "lucide-react";

const cn = (...values) => values.filter(Boolean).join(" ");

function Card({ children, className = "", gradient = false }) {
    return (
        <div className={cn(
            "rounded-2xl border transition-all duration-300",
            gradient
                ? "bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border-white/30 shadow-2xl hover:shadow-lg"
                : "bg-white border-slate-200 shadow-sm hover:shadow-md",
            className
        )}>
            {children}
        </div>
    );
}

function StatsCard({ label, value, icon: Icon, color = "green" }) {
    const colorClasses = {
        green: { bg: "from-green-600 to-emerald-500", accent: "bg-green-100 text-green-600" },
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

function ResultCard({ result, onDelete }) {
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
                    <button
                        className="p-2 hover:bg-green-50 rounded-lg transition"
                        title="View details"
                    >
                        <Eye size={18} className="text-green-600" />
                    </button>
                    <button
                        onClick={() => onDelete(result.id)}
                        className="p-2 hover:bg-rose-50 rounded-lg transition"
                        title="Delete result"
                    >
                        <Trash2 size={18} className="text-rose-600" />
                    </button>
                </div>
            </div>
        </Card>
    );
}

export function ResultsListPage() {
    const [results, setResults] = useState([
        { id: 1, studentName: "Alice Johnson", subject: "Mathematics", score: 95, grade: "A+" },
        { id: 2, studentName: "Bob Smith", subject: "Physics", score: 87, grade: "B+" },
        { id: 3, studentName: "Carol White", subject: "Chemistry", score: 92, grade: "A" },
        { id: 4, studentName: "David Brown", subject: "English", score: 78, grade: "C+" },
        { id: 5, studentName: "Emma Davis", subject: "History", score: 88, grade: "B+" },
        { id: 6, studentName: "Frank Miller", subject: "Biology", score: 91, grade: "A" },
        { id: 7, studentName: "Grace Wilson", subject: "Computer Science", score: 96, grade: "A+" },
        { id: 8, studentName: "Henry Moore", subject: "Economics", score: 82, grade: "B" },
        { id: 9, studentName: "Ivy Taylor", subject: "Art", score: 85, grade: "B" },
        { id: 10, studentName: "Jack Anderson", subject: "Statistics", score: 89, grade: "B+" },
        { id: 11, studentName: "Kate Thomas", subject: "Psychology", score: 93, grade: "A" },
        { id: 12, studentName: "Liam Jackson", subject: "Sociology", score: 76, grade: "C" },
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [sortDirection, setSortDirection] = useState("none");
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 9;

    const handleDeleteResult = (resultId) => {
        if (window.confirm("Are you sure you want to delete this result?")) {
            setResults((prev) => prev.filter((result) => result.id !== resultId));
            if (currentPage > 0 && (results.length - 1) % pageSize === 0) {
                setCurrentPage(currentPage - 1);
            }
        }
    };

    const filteredAndSortedResults = useMemo(() => {
        let result = results.filter((result) =>
            result.studentName.toLowerCase().includes(searchInput.toLowerCase()) ||
            result.subject.toLowerCase().includes(searchInput.toLowerCase())
        );

        if (sortDirection === "asc") {
            result.sort((a, b) => a.studentName.localeCompare(b.studentName));
        } else if (sortDirection === "desc") {
            result.sort((a, b) => b.studentName.localeCompare(a.studentName));
        }

        return result;
    }, [results, searchInput, sortDirection]);

    const totalPages = Math.ceil(filteredAndSortedResults.length / pageSize);
    const paginatedResults = filteredAndSortedResults.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const averageScore = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0;

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
                                setCurrentPage(0);
                            }}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition"
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => {
                                setCurrentPage(0);
                                setSortDirection((prev) => (prev === "none" ? "asc" : prev === "asc" ? "desc" : "none"));
                            }}
                            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition flex items-center gap-2"
                        >
                            <Filter size={18} />
                            Sort: {sortDirection === "none" ? "Default" : sortDirection === "asc" ? "A-Z" : "Z-A"}
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Add Result
                        </button>
                    </div>
                </div>
            </Card>

            {/* Loading State */}
            {paginatedResults.length === 0 ? (
                <Card gradient className="p-12 text-center">
                    <BarChart3 size={48} className="mx-auto mb-3 text-slate-400" />
                    <p className="text-slate-500 text-lg">No results found</p>
                </Card>
            ) : (
                <>
                    {/* Result Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                        {paginatedResults.map((result) => (
                            <ResultCard
                                key={result.id}
                                result={result}
                                onDelete={handleDeleteResult}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 flex-wrap">
                            {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
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
                                    {page + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}



