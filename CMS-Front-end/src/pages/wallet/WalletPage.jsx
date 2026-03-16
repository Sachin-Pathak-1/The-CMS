import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, RefreshCcw, Send, ShieldCheck, KeyRound, Lock } from "lucide-react";
import { apiRequest } from "../../lib/apiClient";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import {
    Card,
    CardHeader,
    StatCard,
    SectionHeader,
    ProgressBar,
    buttonStyles,
    ActivityItem,
    InfoBox,
} from "../../lib/designSystem";

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
    const { user } = useAuth();
    const [walletBalance, setWalletBalance] = useState(coins);
    const [walletMeta, setWalletMeta] = useState(null);
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [levels, setLevels] = useState([]);
    const [history, setHistory] = useState([]);
    const [loadError, setLoadError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [submitting, setSubmitting] = useState("");
    const [pinForm, setPinForm] = useState({ pin: "", oldPin: "", newPin: "" });
    const [transferForm, setTransferForm] = useState({ recipientWalletId: "", amount: "", note: "", pin: "" });
    const [topupForm, setTopupForm] = useState({ username: "", amount: "", note: "" });
    const [actionMessage, setActionMessage] = useState("");
    const [actionError, setActionError] = useState("");

    useEffect(() => {
        let active = true;

        const loadWalletData = async () => {
            setIsLoading(true);

            const [walletResult, balanceResult, xpResult, levelsResult, historyResult] = await Promise.allSettled([
                apiRequest("/wallet/me"),
                apiRequest("/wallet/balance"),
                apiRequest("/xp/me"),
                apiRequest("/xp/levels"),
                apiRequest("/wallet/history"),
            ]);

            if (!active) return;

            if (walletResult.status === "fulfilled") {
                setWalletMeta(walletResult.value?.data || null);
                if (walletResult.value?.data?.balance !== undefined) {
                    setWalletBalance(Number(walletResult.value.data.balance || 0));
                }
            }

            if (balanceResult.status === "fulfilled") setWalletBalance(Number(balanceResult.value?.data?.balance || 0));
            else setWalletBalance(coins);

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

    const refreshWallet = async () => {
        const [walletResult, balanceResult, historyResult] = await Promise.allSettled([
            apiRequest("/wallet/me"),
            apiRequest("/wallet/balance"),
            apiRequest("/wallet/history"),
        ]);

        if (walletResult.status === "fulfilled") setWalletMeta(walletResult.value?.data || null);
        if (balanceResult.status === "fulfilled") setWalletBalance(Number(balanceResult.value?.data?.balance || walletBalance));
        if (historyResult.status === "fulfilled") setHistory(Array.isArray(historyResult.value?.data) ? historyResult.value.data : []);
    };

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

    const showMessage = (msg, isError = false) => {
        setActionMessage(isError ? "" : msg);
        setActionError(isError ? msg : "");
        setTimeout(() => {
            setActionMessage("");
            setActionError("");
        }, 2200);
    };

    const handleSetupPin = async (event) => {
        event.preventDefault();
        setSubmitting("setup");
        try {
            await apiRequest("/wallet/setup", {
                method: "POST",
                body: JSON.stringify({ pin: pinForm.pin }),
            });
            showMessage("PIN set successfully");
            setPinForm((prev) => ({ ...prev, pin: "" }));
            await refreshWallet();
        } catch (err) {
            showMessage(err.message || "Failed to set PIN", true);
        } finally {
            setSubmitting("");
        }
    };

    const handleChangePin = async (event) => {
        event.preventDefault();
        setSubmitting("change");
        try {
            await apiRequest("/wallet/pin", {
                method: "PUT",
                body: JSON.stringify({ oldPin: pinForm.oldPin, newPin: pinForm.newPin }),
            });
            showMessage("PIN changed");
            setPinForm({ pin: "", oldPin: "", newPin: "" });
            await refreshWallet();
        } catch (err) {
            showMessage(err.message || "Failed to change PIN", true);
        } finally {
            setSubmitting("");
        }
    };

    const handleTransfer = async (event) => {
        event.preventDefault();
        setSubmitting("transfer");
        try {
            await apiRequest("/wallet/transfer", {
                method: "POST",
                body: JSON.stringify({
                    recipientWalletId: Number(transferForm.recipientWalletId),
                    amount: Number(transferForm.amount),
                    note: transferForm.note || undefined,
                    pin: transferForm.pin,
                }),
            });
            showMessage("Transfer sent");
            setTransferForm({ recipientWalletId: "", amount: "", note: "", pin: "" });
            await refreshWallet();
        } catch (err) {
            showMessage(err.message || "Transfer failed", true);
        } finally {
            setSubmitting("");
        }
    };

    const handleTopup = async (event) => {
        event.preventDefault();
        setSubmitting("topup");
        try {
            await apiRequest("/wallet/topup", {
                method: "POST",
                body: JSON.stringify({
                    username: topupForm.username.trim() || undefined,
                    amount: Number(topupForm.amount),
                    note: topupForm.note || undefined,
                }),
            });
            showMessage("Wallet topped up");
            setTopupForm({ username: "", amount: "", note: "" });
            await refreshWallet();
        } catch (err) {
            showMessage(err.message || "Top-up failed", true);
        } finally {
            setSubmitting("");
        }
    };

    const walletIdLabel = walletMeta?.id ? `#${walletMeta.id}` : "Not issued yet";

    const copyWalletId = () => {
        if (!walletMeta?.id || !navigator?.clipboard) return;
        navigator.clipboard.writeText(String(walletMeta.id)).then(() => showMessage("Wallet ID copied"));
    };

    return (
        <>
            <div className="p-4 md:p-8 space-y-6">
                <Card gradient className="p-6 relative overflow-hidden">
                    <div className="pointer-events-none absolute right-8 top-6 hidden opacity-10 md:block">
                        <img src="/finance.png" alt="Wallet" width={72} height={72} />
                    </div>
                    <CardHeader
                        label="Student Wallet"
                        title="Your campus points, XP, and reward progress"
                        description="Track what you earn from assignments, attendance, streaks, and performance — then use it in the store or to unlock milestones."
                        titleSize="text-3xl"
                    />

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <StatCard
                            variant="dark"
                            label="Spendable balance"
                            value={`${formatPoints(walletBalance)} pts`}
                            description="Ready to redeem in the store"
                        />
                        <StatCard
                            variant="sky"
                            label="XP collected"
                            value={formatPoints(xp)}
                            description="Academic growth across tasks and milestones"
                        />
                        <Card className="p-5">
                            <SectionHeader
                                title="Level progress"
                                description="Stay consistent to level up faster"
                                badge={`${progressPercent}%`}
                            />
                            <div className="mt-4">
                                <ProgressBar percent={progressPercent} />
                                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                                    <span>Level {level}</span>
                                    <span>{nextLevel ? `Next: ${nextLevel.levelNumber}` : "Max"}</span>
                                </div>
                                <p className="mt-2 text-sm text-slate-600">
                                    {nextLevel ? `${Math.max(Number(nextLevel.requiredXp) - Number(xp), 0)} XP to next level` : "Top tier reached"}
                                </p>
                            </div>
                        </Card>
                    </div>
                </Card>

                {actionMessage && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {actionMessage}
                    </div>
                )}
                {actionError && (
                    <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {actionError}
                    </div>
                )}
                {loadError ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        {loadError}
                    </div>
                ) : null}

                <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                    <Card className="p-5 space-y-5">
                        <SectionHeader
                            title="Send points"
                            description="Transfer points to another wallet ID with a 6-digit PIN."
                            rightContent={
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <ShieldCheck size={16} className="text-emerald-600" />
                                    Secure PIN required
                                </div>
                            }
                        />
                        <form onSubmit={handleTransfer} className="grid gap-4 md:grid-cols-2">
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-slate-800">Recipient wallet ID</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={transferForm.recipientWalletId}
                                    onChange={(e) => setTransferForm((prev) => ({ ...prev, recipientWalletId: e.target.value }))}
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="e.g. 102 or 204"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-800">Amount</label>
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={transferForm.amount}
                                    onChange={(e) => setTransferForm((prev) => ({ ...prev, amount: e.target.value }))}
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="Enter points to send"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-800">PIN</label>
                                <input
                                    type="password"
                                    required
                                    pattern="\d{6}"
                                    value={transferForm.pin}
                                    onChange={(e) => setTransferForm((prev) => ({ ...prev, pin: e.target.value }))}
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="6-digit PIN"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-semibold text-slate-800">Note (optional)</label>
                                <input
                                    type="text"
                                    value={transferForm.note}
                                    onChange={(e) => setTransferForm((prev) => ({ ...prev, note: e.target.value }))}
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="What is this transfer for?"
                                />
                            </div>
                            <div className="md:col-span-2 flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting === "transfer"}
                                    className={`${buttonStyles.primary} inline-flex items-center justify-center gap-2 px-5`}
                                >
                                    <Send size={16} />
                                    {submitting === "transfer" ? "Sending..." : "Send points"}
                                </button>
                                <button
                                    type="button"
                                    onClick={refreshWallet}
                                    className={`${buttonStyles.secondary} inline-flex items-center justify-center gap-2 px-5`}
                                >
                                    <RefreshCcw size={16} />
                                    Refresh balance
                                </button>
                            </div>
                        </form>
                    </Card>

                    <Card className="p-5 space-y-5">
                        <SectionHeader
                            title="Secure your wallet"
                            description="Set or change your 6-digit PIN before transferring points."
                            badge={walletIdLabel}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <form onSubmit={handleSetupPin} className="space-y-3">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Lock size={14} className="text-slate-600" />
                                    First-time setup
                                </div>
                                <input
                                    type="password"
                                    required
                                    pattern="\d{6}"
                                    value={pinForm.pin}
                                    onChange={(e) => setPinForm((prev) => ({ ...prev, pin: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none"
                                    placeholder="Set 6-digit PIN"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting === "setup"}
                                    className={`${buttonStyles.success} w-full inline-flex items-center justify-center gap-2`}
                                >
                                    <ShieldCheck size={16} />
                                    {submitting === "setup" ? "Saving..." : "Save PIN"}
                                </button>
                            </form>

                            <form onSubmit={handleChangePin} className="space-y-3">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <KeyRound size={14} className="text-slate-600" />
                                    Change existing PIN
                                </div>
                                <input
                                    type="password"
                                    required
                                    pattern="\d{6}"
                                    value={pinForm.oldPin}
                                    onChange={(e) => setPinForm((prev) => ({ ...prev, oldPin: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="Current PIN"
                                />
                                <input
                                    type="password"
                                    required
                                    pattern="\d{6}"
                                    value={pinForm.newPin}
                                    onChange={(e) => setPinForm((prev) => ({ ...prev, newPin: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="New 6-digit PIN"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting === "change"}
                                    className={`${buttonStyles.primary} w-full inline-flex items-center justify-center gap-2`}
                                >
                                    <RefreshCcw size={16} />
                                    {submitting === "change" ? "Updating..." : "Change PIN"}
                                </button>
                            </form>
                        </div>

                        <InfoBox
                            title="Wallet ID"
                            text={walletMeta?.id ? `Share Wallet ${walletIdLabel} when receiving points. Your username: ${user?.username || "student"}.` : "A wallet ID will be created the first time you set a PIN or receive points."}
                            variant="amber"
                            className="flex items-center justify-between gap-3"
                        />
                        {(user?.type === "admin" || user?.type === "teacher") && (
                            <form onSubmit={handleTopup} className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-emerald-600" />
                                    Admin/Teacher top-up
                                </p>
                                <input
                                    type="text"
                                    required
                                    value={topupForm.username}
                                    onChange={(e) => setTopupForm((prev) => ({ ...prev, username: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="Student username to credit"
                                />
                                <input
                                    type="number"
                                    min="1"
                                    required
                                    value={topupForm.amount}
                                    onChange={(e) => setTopupForm((prev) => ({ ...prev, amount: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="Amount"
                                />
                                <input
                                    type="text"
                                    value={topupForm.note}
                                    onChange={(e) => setTopupForm((prev) => ({ ...prev, note: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="Note (optional)"
                                />
                                <button
                                    type="submit"
                                    disabled={submitting === "topup"}
                                    className={`${buttonStyles.success} w-full inline-flex items-center justify-center gap-2`}
                                >
                                    <RefreshCcw size={16} />
                                    {submitting === "topup" ? "Crediting..." : "Top up wallet"}
                                </button>
                            </form>
                        )}
                        <div className="flex flex-wrap gap-3">
                            {walletMeta?.id && (
                                <button
                                    type="button"
                                    onClick={copyWalletId}
                                    className={`${buttonStyles.outline} inline-flex items-center gap-2 px-4`}
                                >
                                    <Copy size={16} />
                                    Copy Wallet ID
                                </button>
                            )}
                            <Link to="/store" className={`${buttonStyles.secondary} inline-flex items-center gap-2 px-4`}>
                                Open Store
                            </Link>
                            <Link to="/list/assignments" className={`${buttonStyles.primary} inline-flex items-center gap-2 px-4`}>
                                Earn Points
                            </Link>
                        </div>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <Card className="p-5 space-y-4">
                        <SectionHeader
                            title="Recent point activity"
                            description="Ledger of how points are earned and spent"
                            badge={`${recentActivity.length} entries`}
                            rightContent={
                                <button
                                    type="button"
                                    onClick={refreshWallet}
                                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                >
                                    <RefreshCcw size={14} />
                                    Refresh
                                </button>
                            }
                        />

                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                                    Loading wallet activity...
                                </div>
                            ) : (
                                recentActivity.map((item) => (
                                    <ActivityItem
                                        key={item.id}
                                        icon={item.type === "credit" ? "/plus.png" : "/finance.png"}
                                        label={item.label}
                                        note={item.note}
                                        amount={formatPoints(item.amount)}
                                        date={item.date}
                                        type={item.type === "credit" ? "credit" : "rose"}
                                    />
                                ))
                            )}
                        </div>
                    </Card>

                    <Card className="p-5 space-y-4">
                        <SectionHeader
                            title="Point summary"
                            description="A quick view of what you earned and spent"
                        />
                        <div className="grid gap-3">
                            <StatCard
                                variant="emerald"
                                label="Earned recently"
                                value={formatPoints(earnedPoints)}
                                description="Assignments, attendance, quizzes"
                            />
                            <StatCard
                                variant="rose"
                                label="Spent recently"
                                value={formatPoints(spentPoints)}
                                description="Store redemptions and transfers"
                            />
                            <StatCard
                                variant="sky"
                                label="Spendable now"
                                value={formatPoints(walletBalance)}
                                description="Ready for your next reward"
                            />
                        </div>

                        <SectionHeader
                            title="How students grow points"
                            description="Stay consistent to move faster"
                        />
                        <div className="space-y-3">
                            {[
                                { title: "Assignments", text: "Submit work on time and complete pending tasks." },
                                { title: "Attendance", text: "Daily presence and streaks reinforce the reward loop." },
                                { title: "Results", text: "Better performance translates into bonus XP and points." },
                                { title: "Store goals", text: "Points are meaningful because you can use them in the store." },
                            ].map((item) => (
                                <InfoBox key={item.title} title={item.title} text={item.text} />
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
}

