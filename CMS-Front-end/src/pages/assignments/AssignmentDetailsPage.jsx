import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "../Layout";
import { apiRequest } from "../../lib/apiClient";

const formatDate = (value) => {
    if (!value) return "No date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

export function AssignmentDetailsPage() {
    const { id } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadAssignment = async () => {
            try {
                const response = await apiRequest(`/academic/assignments/${id}`);
                if (!active) return;
                setAssignment(response?.data || null);
            } catch (err) {
                if (active) setError(err.message || "Failed to load assignment");
            } finally {
                if (active) setIsLoading(false);
            }
        };

        loadAssignment();
        return () => {
            active = false;
        };
    }, [id]);

    return (
        <Layout>
            <div className="p-4">
                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-slate-800">Assignment details</h1>
                            <p className="mt-2 text-sm text-slate-500">
                                Review assignment information and uploaded submission history.
                            </p>
                        </div>
                        <Link to="/list/assignments" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                            Back to Assignments
                        </Link>
                    </div>
                </section>

                {error ? (
                    <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                ) : null}

                {isLoading ? (
                    <div className="mt-4 rounded-[28px] border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
                        Loading assignment...
                    </div>
                ) : null}

                {assignment ? (
                    <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
                        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-slate-400">
                                <span>{assignment.course?.name || "Class"}</span>
                                <span>{formatDate(assignment.dueDate)}</span>
                                <span>{assignment._count?.submissions || 0} submissions</span>
                            </div>
                            <h2 className="mt-4 text-3xl font-semibold text-slate-800">{assignment.title}</h2>
                            <p className="mt-4 text-sm leading-7 text-slate-600">
                                {assignment.description || assignment.content || "No assignment description provided."}
                            </p>
                        </section>

                        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-semibold text-slate-800">Submission history</h3>
                            <div className="mt-5 space-y-4">
                                {assignment.submissions?.length ? (
                                    assignment.submissions.map((submission) => (
                                        <article key={submission.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{submission.user?.username || "Student"}</p>
                                                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                                                        {formatDate(submission.submittedAt)}
                                                    </p>
                                                </div>
                                                {submission.filePath ? (
                                                    <a
                                                        href={submission.filePath}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white"
                                                    >
                                                        Open File
                                                    </a>
                                                ) : null}
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                                        No submissions available yet.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                ) : null}
            </div>
        </Layout>
    );
}
