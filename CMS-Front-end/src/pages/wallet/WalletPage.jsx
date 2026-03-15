import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../lib/apiClient";
import { useTheme } from "../../contexts/ThemeContext";

const fallbackActivity = [
    { id: "daily", type: "credit", amount: 50, label: "Daily learning streak", note: "Claim points for showing up consistently.", date: "Today" },
    { id: "assignment", type: "credit", amount: 120, label: "Assignment submitted", note: "Points earned from academic participation.", date: "Yesterday" },
    { id: "quiz", type: "credit", amount: 80, label: "Quiz performance bonus", note: "Bonus points for strong assessment results.", date: "2 days ago" },
    { id: "store", type: "debit", amount: 40, label: "Store redemption", note: "Spent on campus perks or digital rewards.", date: "3 days ago" },
];

const formatPoints = (value) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Number(value || 0));

export function WalletPage() {
    const { coins } = useTheme();
    const [walletBalance, setWalletBalance] = useState(coins);
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [levels, setLevels] = useState([]);
    const [history, setHistory] = useState([]);
    const [loadError, setLoadError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadWalletData = async () => {
            setIsLoading(true);

            const [balanceResult, xpResult, levelsResult, historyResult] = await Promise.allSettled([
                apiRequest("/wallet/balance"),
                apiRequest("/xp/me"),
                apiRequest("/xp/levels"),
                apiRequest("/wallet/history"),
            ]);

            if (!active) return;

            if (balanceResult.status === "fulfilled") {
                setWalletBalance(Number(balanceResult.value?.data?.balance || 0));
            } else {
                setWalletBalance(coins);
            }

            if (xpResult.status === "fulfilled") {
                setXp(Number(xpResult.value?.data?.xp || 0));
                setLevel(Number(xpResult.value?.data?.level || 1));
            }

            if (levelsResult.status === "fulfilled") {
                setLevels(Array.isArray(levelsResult.value?.data) ? levelsResult.value.data : []);
            }

            if (historyResult.status === "fulfilled") {
                setHistory(Array.isArray(historyResult.value?.data) ? historyResult.value.data : []);
            } else {
                setHistory([]);
            }

            if (balanceResult.status === "rejected" && xpResult.status === "rejected") {
                setLoadError("Showing local point data because wallet services are not available in this session.");
            } else {
                setLoadError("");
            }

            setIsLoading(false);
        };

        loadWalletData();
        return () => {
            active = false;
        };
    }, [coins]);

    const nextLevel = useMemo(
        () => levels.find((item) => Number(item.levelNumber) === Number(level) + 1) || null,
        [levels, level]
    );

    const currentLevelFloor = useMemo(() => {
        const current = levels.find((item) => Number(item.levelNumber) === Number(level));
        return Number(current?.requiredXp || 0);
    }, [levels, level]);

    const progressPercent = useMemo(() => {
        if (!nextLevel) return 100;
        const nextRequired = Number(nextLevel.requiredXp || 0);
        const span = Math.max(nextRequired - currentLevelFloor, 1);
        const progressed = Math.max(Number(xp) - currentLevelFloor, 0);
        return Math.min(100, Math.round((progressed / span) * 100));
    }, [nextLevel, currentLevelFloor, xp]);

    const recentActivity = useMemo(() => {
        if (history.length > 0) {
            return history.slice(0, 6).map((item) => ({
                id: item.id,
                type: item.type,
                amount: Number(item.amount || 0),
                label: item.type === "credit" ? "Points received" : "Points spent",
                note: item.note || "Wallet activity",
                date: item.transactionDate ? new Date(item.transactionDate).toLocaleDateString("en-US", { day: "numeric", month: "short" }) : "Recent",
            }));
        }

        return fallbackActivity;
    }, [history]);

    const earnedPoints = recentActivity
        .filter((item) => item.type === "credit")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const spentPoints = recentActivity
        .filter((item) => item.type === "debit")
        .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return (
        <>
            <div className="p-4">
                <section className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-gradient-to-br from-[#fff7dd] via-white to-[#def2ff] p-6 shadow-sm">
                    <div className="pointer-events-none absolute right-6 top-6 hidden opacity-10 md:block">
                        <img src="/finance.png" alt="" width={56} height={56} />
                    </div>
                    <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                        <div>
                            <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                Student Wallet
                            </span>
                            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-800">
                                Your campus points, XP, and reward progress
                            </h1>
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                                This wallet tracks what a student earns through assignments, attendance, streaks, and performance, then turns those points into store access and progress milestones.
                            </p>

                            <div className="mt-6 grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm">
                                    <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Available Points</p>
                                    <p className="mt-3 text-4xl font-semibold">{formatPoints(walletBalance)}</p>
                                    <p className="mt-2 text-sm text-slate-300">Ready to spend in the reward store.</p>
                                </div>
                                <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm">
                                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">XP Collected</p>
                                    <p className="mt-3 text-3xl font-semibold text-slate-800">{formatPoints(xp)}</p>
                                    <p className="mt-2 text-sm text-slate-500">Academic growth across tasks and milestones.</p>
                                </div>
                                <div className="rounded-2xl border border-white/70 bg-white/80 p-5 shadow-sm">
                                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Current Level</p>
                                    <p className="mt-3 text-3xl font-semibold text-slate-800">Level {level}</p>
                                    <p className="mt-2 text-sm text-slate-500">
                                        {nextLevel ? `${Math.max(Number(nextLevel.requiredXp) - Number(xp), 0)} XP to next level` : "Top tier reached"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-800">Level progress</h2>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                    {progressPercent}%
                                </span>
                            </div>
                            <div className="mt-5 rounded-2xl bg-slate-100 p-2">
                                <div className="h-3 rounded-full bg-slate-200">
                                    <div className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400" style={{ width: `${progressPercent}%` }} />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                                <span>Level {level}</span>
                                <span>{nextLevel ? `Level ${nextLevel.levelNumber}` : "Max"}</span>
                            </div>

                            <div className="mt-6 grid gap-3">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Earn</p>
                                    <p className="mt-2 text-sm font-medium text-slate-700">Assignments, attendance, quiz performance, and streak bonuses.</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Spend</p>
                                    <p className="mt-2 text-sm font-medium text-slate-700">Use points in the store for perks, unlocks, and student rewards.</p>
                                </div>
                                <div className="flex gap-3">
                                    <Link to="/store" className="flex-1 rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-700">
                                        Open Store
                                    </Link>
                                    <Link to="/list/assignments" className="flex-1 rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                                        Earn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {loadError ? (
                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        {loadError}
                    </div>
                ) : null}

                <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800">Recent point activity</h2>
                                <p className="mt-1 text-sm text-slate-500">A simple ledger of how student points are earned and spent.</p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {recentActivity.length} entries
                            </span>
                        </div>

                        <div className="mt-5 space-y-4">
                            {isLoading ? (
                                <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                                    Loading wallet activity...
                                </div>
                            ) : (
                                recentActivity.map((item) => (
                                    <article key={item.id} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <div className={`mt-1 h-10 w-10 shrink-0 rounded-2xl ${item.type === "credit" ? "bg-emerald-100" : "bg-rose-100"} flex items-center justify-center`}>
                                            <img
                                                src={item.type === "credit" ? "/plus.png" : "/finance.png"}
                                                alt=""
                                                width={16}
                                                height={16}
                                                className={item.type === "credit" ? "" : "opacity-80"}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-slate-800">{item.label}</h3>
                                                    <p className="mt-1 text-sm leading-6 text-slate-500">{item.note}</p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <p className={`text-lg font-semibold ${item.type === "credit" ? "text-emerald-600" : "text-rose-600"}`}>
                                                        {item.type === "credit" ? "+" : "-"}{formatPoints(item.amount)}
                                                    </p>
                                                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{item.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="grid gap-4">
                        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-800">Point summary</h2>
                            <div className="mt-5 grid gap-3">
                                <div className="rounded-2xl bg-emerald-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.16em] text-emerald-600">Earned recently</p>
                                    <p className="mt-2 text-3xl font-semibold text-slate-800">{formatPoints(earnedPoints)}</p>
                                </div>
                                <div className="rounded-2xl bg-rose-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.16em] text-rose-600">Spent recently</p>
                                    <p className="mt-2 text-3xl font-semibold text-slate-800">{formatPoints(spentPoints)}</p>
                                </div>
                                <div className="rounded-2xl bg-sky-50 p-4">
                                    <p className="text-xs uppercase tracking-[0.16em] text-sky-600">Spendable now</p>
                                    <p className="mt-2 text-3xl font-semibold text-slate-800">{formatPoints(walletBalance)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-800">How students grow points</h2>
                            <div className="mt-5 space-y-3">
                                {[
                                    { title: "Assignments", text: "Submitting work on time and staying consistent grows points faster." },
                                    { title: "Attendance", text: "Daily presence and streaks reinforce the reward loop." },
                                    { title: "Results", text: "Better performance can translate into bonus XP and wallet rewards." },
                                    { title: "Store goals", text: "Points are meaningful because students can use them in the store." },
                                ].map((item) => (
                                    <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                                        <p className="mt-1 text-sm leading-6 text-slate-500">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
