import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../../lib/apiClient";
import { useAuth } from "../../contexts/AuthContext";

const formatDate = (value) => {
    if (!value) return "No date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
};

export function AssignmentDetailsPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [assignment, setAssignment] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");
    const [submissionForm, setSubmissionForm] = useState({ content: "", fileUrl: "" });
    const [gradeMessage, setGradeMessage] = useState("");
    const [gradeBusyId, setGradeBusyId] = useState(null);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitMessage("");
        setSubmitLoading(true);
        try {
            await apiRequest("/academic/submissions", {
                method: "POST",
                body: JSON.stringify({
                    assignmentId: Number(id),
                    content: submissionForm.content.trim(),
                    fileUrl: submissionForm.fileUrl?.trim() || undefined,
                }),
            });
            setSubmissionForm({ content: "", fileUrl: "" });
            setSubmitMessage("Submission uploaded successfully.");
            // refresh assignment to show the new submission
            const refreshed = await apiRequest(`/academic/assignments/${id}`);
            setAssignment(refreshed?.data || assignment);
        } catch (err) {
            setSubmitMessage(err.message || "Failed to submit.");
        } finally {
            setSubmitLoading(false);
            setTimeout(() => setSubmitMessage(""), 2500);
        }
    };

    const handleGrade = async (submissionId, studentId, gradeValue) => {
        setGradeBusyId(submissionId);
        setGradeMessage("");
        try {
            await apiRequest("/grades", {
                method: "POST",
                body: JSON.stringify({
                    assignmentId: Number(id),
                    userId: studentId,
                    grade: gradeValue,
                }),
            });
            setGradeMessage("Grade saved.");
            const refreshed = await apiRequest(`/academic/assignments/${id}`);
            setAssignment(refreshed?.data || assignment);
        } catch (err) {
            setGradeMessage(err.message || "Failed to grade.");
        } finally {
            setGradeBusyId(null);
            setTimeout(() => setGradeMessage(""), 2000);
        }
    };

    return (
        <>
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

                        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <h3 className="text-lg font-semibold text-slate-800">Submission history</h3>
                                {user?.type === "student" && (
                                    <span className="text-xs text-slate-500">
                                        You are signed in as <strong>{user.username}</strong>
                                    </span>
                                )}
                            </div>
                            {user?.type === "student" && (
                                <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <label className="block text-sm font-semibold text-slate-700">Submission text</label>
                                    <textarea
                                        value={submissionForm.content}
                                        onChange={(e) => setSubmissionForm((prev) => ({ ...prev, content: e.target.value }))}
                                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        rows={3}
                                        required
                                        placeholder="Paste your answer or notes..."
                                    />
                                    <label className="block text-sm font-semibold text-slate-700">File URL (optional)</label>
                                    <input
                                        type="url"
                                        value={submissionForm.fileUrl}
                                        onChange={(e) => setSubmissionForm((prev) => ({ ...prev, fileUrl: e.target.value }))}
                                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        placeholder="https://drive.google.com/file/..."
                                    />
                                    {submitMessage && (
                                        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                            {submitMessage}
                                        </div>
                                    )}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={submitLoading}
                                            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            {submitLoading ? "Submitting..." : "Submit assignment"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-4">
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
                                                {submission.filePath || submission.fileUrl ? (
                                                    <a
                                                        href={submission.filePath || submission.fileUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white"
                                                    >
                                                        Open File
                                                    </a>
                                                ) : null}
                                            </div>
                                            {user?.type === "teacher" || user?.type === "admin" ? (
                                                <div className="mt-3 flex items-center gap-3">
                                                    <input
                                                        type="text"
                                                        maxLength={5}
                                                        placeholder="Grade"
                                                        defaultValue={submission.grade || ""}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                handleGrade(
                                                                    submission.id,
                                                                    submission.user?.id,
                                                                    e.currentTarget.value.trim()
                                                                );
                                                            }
                                                        }}
                                                        className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                                                    />
                                                    <button
                                                        onClick={(e) => {
                                                            const container = e.currentTarget.closest("article");
                                                            const input = container?.querySelector("input[type='text']");
                                                            const gradeVal = input?.value.trim();
                                                            handleGrade(submission.id, submission.user?.id, gradeVal || "");
                                                        }}
                                                        disabled={gradeBusyId === submission.id}
                                                        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                                                    >
                                                        {gradeBusyId === submission.id ? "Saving..." : "Save grade"}
                                                    </button>
                                                    {submission.grade && (
                                                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                                                            Current: {submission.grade}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : null}
                                            {submission.content && (
                                                <p className="mt-2 text-sm text-slate-600 whitespace-pre-wrap">
                                                    {submission.content}
                                                </p>
                                            )}
                                        </article>
                                    ))
                                ) : (
                                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                                        No submissions available yet.
                                    </div>
                                )}
                                {gradeMessage && (
                                    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                        {gradeMessage}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                ) : null}
            </div>
        </>
    );
}

