import { useMemo, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Search, ArrowUpDown } from "lucide-react";
import { useBackendList } from "../../../hooks/useBackendList";
import { usePagination } from "../../../hooks/usePagination";
import { getVisibleRows } from "../../../lib/listUtils";
import { Card } from "../../../lib/designSystem";

const cn = (...classes) => classes.filter(Boolean).join(" ");

// Custom StatsCard for exams page
function StatsCard({ icon, label, value, color = "blue" }) {
  const Icon = icon;
  const colorClasses = {
    blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
    rose: { bg: "from-rose-600 to-rose-400", accent: "bg-rose-100 text-rose-600" },
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

const ExamCard = ({ exam }) => (
  <Card className="p-5 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-red-600">
    <div className="flex items-start gap-3 mb-3">
      <div className="p-2 bg-red-100 rounded-lg mt-1">
        <BookOpen size={20} className="text-red-600" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800 text-lg">{exam.subject || exam.title}</h3>
        <p className="text-sm text-gray-600 mt-1">{exam.class || "No class"}</p>
        {exam.teacher && <p className="text-xs text-gray-500 mt-1">Teacher: {exam.teacher}</p>}
        {exam.date && <p className="text-xs text-gray-500 mt-1">Date: {exam.date}</p>}
      </div>
    </div>
  </Card>
);

export function ExamsListPage() {
  const { data: exams, loading, error } = useBackendList("exams");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");

  const visibleExams = useMemo(() => {
    const sortAccessor = sortBy === "title" ? "subject" : "date";
    const sortDirection = sortBy === "title" ? "asc" : "desc";
    return getVisibleRows(exams, { query: searchTerm, sortAccessor, sortDirection });
  }, [exams, searchTerm, sortBy]);

  const { currentPage, paginatedData: paginatedExams, setCurrentPage, totalPages } = usePagination(
    visibleExams,
    { pageSize: 6 }
  );

  const totalExams = exams.length;
  const activeExams = exams.filter((exam) => (exam.date ? new Date(exam.date) >= new Date() : true)).length;

  return (
    <div className="space-y-8 px-4 py-8 md:px-8">
      <div className="flex flex-col gap-2 mb-6">
        <span className="text-xs font-semibold text-rose-600 uppercase tracking-widest">Exams Management</span>
        <h1 className="text-4xl font-bold text-gray-800">Exams</h1>
        <p className="text-gray-600">Plan, track, and review exams</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCard icon={BookOpen} label="Total Exams" value={totalExams} />
        <StatsCard icon={BookOpen} label="Active" value={activeExams} />
      </div>

      <Card className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition"
          />
        </div>
        <button
          onClick={() => setSortBy(sortBy === "title" ? "date" : "title")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition"
        >
          <ArrowUpDown size={16} /> Sort by {sortBy === "title" ? "date" : "title"}
        </button>
      </Card>

      {error && (
        <Card className="p-4 border border-rose-200 bg-rose-50 text-rose-700">Failed to load exams: {error}</Card>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading exams...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedExams.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedExams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} />
                ))}
              </div>

              {totalPages > 1 && (
                <Card className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      )}
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "w-9 h-9 rounded-lg font-medium transition-colors",
                            page === currentPage
                              ? "bg-red-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-rose-200"
                          )}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      )}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card className="p-12 text-center">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Exams Found</h3>
              <p className="text-gray-600">Try adjusting your search filters</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default ExamsListPage;
