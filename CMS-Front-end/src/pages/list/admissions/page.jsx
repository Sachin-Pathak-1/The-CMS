import { useEffect, useMemo, useState } from "react";
import { Card } from "../../../lib/designSystem";
import { Search, Check, XCircle, FileText, Clock, Download } from "lucide-react";
import { apiRequest } from "../../../lib/apiClient";
import { useAuth } from "../../../contexts/AuthContext";
import { exportToCsv } from "../../../lib/exportCsv";

const cn = (...values) => values.filter(Boolean).join(" ");

const statusChip = (status) => {
    const map = {
        pending: "bg-amber-50 text-amber-700 border border-amber-200",
        approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        rejected: "bg-rose-50 text-rose-700 border border-rose-200",
    };
    return map[status] || map.pending;
};

export function AdmissionsListPage() {
    const { user } = useAuth();
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    const canManage = user?.type === "admin" || user?.type === "teacher";
    const isAdmin = user?.type === "admin";

    const load = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await apiRequest("/admissions");
            setAdmissions(Array.isArray(response?.data) ? response.data : []);
        } catch (err) {
            setError(err.message || "Failed to load admissions");
            setAdmissions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return admissions.filter((item) =>
            [item.name, item.email, item.phone, item.status, item.course?.name]
                .filter(Boolean)
                .some((v) => v.toString().toLowerCase().includes(q))
        );
    }, [search, admissions]);

    const updateStatus = async (id, status) => {
        try {
            await apiRequest(`/admissions/${id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });
            setAdmissions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
        } catch (err) {
            alert(err.message || "Failed to update status");
        }
    };

    const deleteAdmission = async (id) => {
        if (!isAdmin) return;
        if (!window.confirm("Delete this application?")) return;
        try {
            await apiRequest(`/admissions/${id}`, { method: "DELETE" });
            setAdmissions((prev) => prev.filter((a) => a.id !== id));
        } catch (err) {
            alert(err.message || "Failed to delete");
        }
    };

    const exportCsv = () => exportToCsv("admissions.csv", admissions);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-sky-50/20 p-4 md:p-8">
            <div className="mb-10">
                <p className="text-sm font-semibold text-sky-600 uppercase tracking-wide">Admissions</p>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">Applications</h1>
                <p className="text-slate-600 text-lg mt-2">Review, approve, or reject incoming applications.</p>
            </div>

            <Card gradient className="p-6 mb-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:w-1/2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, course, status..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none transition"
                        />
                    </div>
                    <div className="flex gap-3 flex-wrap justify-end">
                        <button
                            onClick={exportCsv}
                            className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition flex items-center gap-2"
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                    </div>
                </div>
            </Card>

            {error && (
                <Card className="p-4 border-rose-200 bg-rose-50 text-rose-700 mb-4">
                    {error}
                </Card>
            )}

            {loading ? (
                <Card className="p-6 text-sm text-slate-500">Loading applications...</Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filtered.map((item) => (
                        <Card key={item.id} gradient className="p-5 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Applicant</p>
                                    <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                                    <p className="text-sm text-slate-500">{item.email}</p>
                                    {item.phone && <p className="text-sm text-slate-500">{item.phone}</p>}
                                </div>
                                <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", statusChip(item.status))}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm text-slate-600">
                                <p className="flex items-center gap-2">
                                    <Clock size={16} className="text-slate-400" />
                                    {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </p>
                                <p className="flex items-center gap-2">
                                    <FileText size={16} className="text-slate-400" />
                                    {item.course?.name || "No course selected"}
                                </p>
                                {item.notes && <p className="text-slate-500 leading-6">{item.notes}</p>}
                            </div>
                            {canManage && (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => updateStatus(item.id, "approved")}
                                        className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold flex items-center gap-1 hover:bg-emerald-700"
                                    >
                                        <Check size={16} /> Approve
                                    </button>
                                    <button
                                        onClick={() => updateStatus(item.id, "rejected")}
                                        className="px-3 py-2 rounded-lg bg-rose-600 text-white text-sm font-semibold flex items-center gap-1 hover:bg-rose-700"
                                    >
                                        <XCircle size={16} /> Reject
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => deleteAdmission(item.id)}
                                            className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </Card>
                    ))}
                    {filtered.length === 0 && (
                        <Card className="p-6 text-sm text-slate-500">
                            No applications match your filters yet.
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdmissionsListPage;
