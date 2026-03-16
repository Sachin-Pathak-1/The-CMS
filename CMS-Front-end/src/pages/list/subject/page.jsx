import { useMemo, useState } from "react";
import { Search, Plus, Trash2, BookOpen, ArrowUpDown } from "lucide-react";
import { useBackendList } from "../../../hooks/useBackendList";
import { usePagination } from "../../../hooks/usePagination";
import { getVisibleRows } from "../../../lib/listUtils";
import { apiRequest } from "../../../lib/apiClient";
import { useAuth } from "../../../contexts/AuthContext";
import { FormModel } from "../../../components/FormModel";
import { Card } from "../../../lib/designSystem";

const cn = (...classes) => classes.filter(Boolean).join(" ");

// Custom StatsCard for subjects page
function StatsCard({ icon, label, value, color = "blue" }) {
  const Icon = icon;
  const colorClasses = {
    blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
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

function SubjectCard({ subject, onDelete, canManage }) {
  return (
    <Card gradient className="p-5 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate text-lg">{subject.name}</h3>
          {subject.description && <p className="text-sm text-slate-500 truncate mt-1">{subject.description}</p>}
          {subject.teachers && subject.teachers.length > 0 && (
            <p className="text-xs text-slate-500 mt-3">
              Teachers: {Array.isArray(subject.teachers) ? subject.teachers.join(", ") : subject.teachers}
            </p>
          )}
        </div>
        {canManage && (
          <button
            onClick={() => onDelete(subject.id)}
            className="p-2 hover:bg-rose-50 rounded-lg transition ms-4"
            title="Delete subject"
          >
            <Trash2 size={18} className="text-rose-600" />
          </button>
        )}
      </div>
    </Card>
  );
}

export function SubjectListPage() {
    const { data: subjects, loading, error, reload } = useBackendList("subjects");
    const { user } = useAuth();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [actionError, setActionError] = useState("");

    const canManageSubjects = user?.type === "admin" || user?.type === "teacher";

    const addSubjectFields = [
        { name: "name", placeholder: "Subject Name" },
        { name: "description", placeholder: "Description", fullWidth: true, required: false },
    ];

    const handleAddSubject = async (formData) => {
        try {
            setActionError("");
            await apiRequest("/courses", {
                method: "POST",
                body: JSON.stringify({
                    name: formData.name.trim(),
                    description: formData.description?.trim() || undefined,
                }),
            });
            setIsAddModalOpen(false);
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to add subject");
        }
    };

    const handleDeleteSubject = async (subjectId) => {
        try {
            setActionError("");
            await apiRequest(`/courses/${subjectId}`, { method: "DELETE" });
            reload();
        } catch (err) {
            setActionError(err.message || "Failed to delete subject");
        }
    };

    const visibleSubjects = useMemo(
        () => getVisibleRows(subjects, { query: searchTerm, sortAccessor: "name", sortDirection: "asc" }),
        [subjects, searchTerm]
    );

    const { currentPage, paginatedData: paginatedSubjects, setCurrentPage, totalPages } = usePagination(
        visibleSubjects,
        { pageSize: 6 }
    );

    const totalSubjects = subjects.length;

    return (
        <div className="space-y-8 px-4 py-8 md:px-8">
            <div className="flex flex-col gap-2 mb-6">
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Subjects Management</span>
                <h1 className="text-4xl font-bold text-gray-800">Subjects</h1>
                <p className="text-gray-600">Manage and organize all subjects</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatsCard icon={BookOpen} label="Total Subjects" value={totalSubjects} color="emerald" />
                <StatsCard icon={BookOpen} label="Managed by You" value={subjects.length} color="blue" />
            </div>

            <Card className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex-1 relative">
                    <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search subjects..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSortBy(sortBy === "name" ? "date" : "name")}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition"
                    >
                        <ArrowUpDown size={16} /> Sort
                    </button>
                    {canManageSubjects && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                        >
                            <Plus size={18} /> Add Subject
                        </button>
                    )}
                </div>
            </Card>

            {loading && <p className="text-center text-sm text-slate-500">Loading subjects...</p>}
            {error && <p className="text-center text-sm text-rose-600">{error}</p>}
            {actionError && <p className="text-center text-sm text-rose-600">{actionError}</p>}

            {paginatedSubjects.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {paginatedSubjects.map((subject) => (
                        <SubjectCard
                            key={subject.id}
                            subject={subject}
                            onDelete={handleDeleteSubject}
                            canManage={canManageSubjects}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-slate-500">No subjects found</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-slate-600">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}

            {canManageSubjects && (
                <FormModel
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddSubject}
                    title="Add Subject"
                    submitLabel="Add Subject"
                    fields={addSubjectFields}
                />
            )}
        </div>
    );
}
