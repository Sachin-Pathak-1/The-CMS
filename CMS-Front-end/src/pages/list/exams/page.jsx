import { useMemo, useState } from "react";
import { BookOpen, Trash2, ChevronLeft, ChevronRight, Search, ArrowUpDown } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const Card = ({ children, className = "" }) => (
  <div className={cn("bg-white rounded-lg shadow-md border border-rose-200", className)}>{children}</div>
);

const StatsCard = ({ icon: Icon, label, value }) => (
  <Card className="p-4">
    <div className="flex items-center gap-4">
      <div className="p-3 rounded-lg bg-red-100 text-red-600">
        <Icon size={24} />
      </div>
      <div>
        <p className="text-gray-600 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </Card>
);

const ExamCard = ({ exam, onDelete }) => (
  <Card className="p-5 hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-red-600">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 bg-red-100 rounded-lg mt-1">
          <BookOpen size={20} className="text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg">{exam.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{exam.subject}</p>
        </div>
      </div>
      <button
        onClick={() => {
          if (window.confirm("Delete this exam?")) onDelete(exam.id);
        }}
        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 hover:text-red-700"
      >
        <Trash2 size={18} />
      </button>
    </div>

    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-rose-200">
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Questions</p>
        <p className="text-lg font-semibold text-gray-800">{exam.questions}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
        <p className="text-lg font-semibold text-gray-800">{exam.duration} mins</p>
      </div>
    </div>

    <div className="mt-4 pt-4 border-t border-rose-200">
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "px-3 py-1 rounded-full text-sm font-medium capitalize",
            exam.status === "active" && "bg-green-100 text-green-700",
            exam.status === "draft" && "bg-gray-100 text-gray-700",
            exam.status === "archived" && "bg-red-100 text-red-700"
          )}
        >
          {exam.status}
        </span>
        <span className="text-xs text-gray-500">{exam.level}</span>
      </div>
    </div>
  </Card>
);

export function ExamsListPage() {
  const [exams, setExams] = useState([
    { id: 1, title: "Midterm Math", subject: "Algebra", questions: 50, duration: 90, status: "active", level: "Grade 10" },
    { id: 2, title: "Physics Practical", subject: "Mechanics", questions: 25, duration: 60, status: "draft", level: "Grade 11" },
    { id: 3, title: "History Final", subject: "World History", questions: 40, duration: 120, status: "archived", level: "Grade 12" },
    { id: 4, title: "Chemistry Quiz", subject: "Organic", questions: 20, duration: 45, status: "active", level: "Grade 11" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredExams = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return exams;
    return exams.filter(
      (exam) =>
        exam.title.toLowerCase().includes(query) ||
        exam.subject.toLowerCase().includes(query) ||
        exam.level.toLowerCase().includes(query)
    );
  }, [exams, searchTerm]);

  const sortedExams = useMemo(() => {
    const sorted = [...filteredExams];
    sorted.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return 0;
    });
    return sorted;
  }, [filteredExams, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedExams.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExams = sortedExams.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    const next = exams.filter((exam) => exam.id !== id);
    setExams(next);
    const nextTotalPages = Math.max(1, Math.ceil(next.length / itemsPerPage));
    if (currentPage > nextTotalPages) setCurrentPage(nextTotalPages);
  };

  const totalExams = exams.length;
  const activeExams = exams.filter((e) => e.status === "active").length;

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
          onClick={() => setSortBy(sortBy === "title" ? "status" : "title")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition"
        >
          <ArrowUpDown size={16} /> Sort by {sortBy === "title" ? "status" : "title"}
        </button>
      </Card>

      <div className="space-y-4">
        {paginatedExams.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} onDelete={handleDelete} />
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
    </div>
  );
}

export default ExamsListPage;
