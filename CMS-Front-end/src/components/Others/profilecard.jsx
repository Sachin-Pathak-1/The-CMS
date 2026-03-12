import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../lib/apiClient";
import { useTheme } from "../../contexts/ThemeContext";

const FireIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path
            fillRule="evenodd"
            d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            clipRule="evenodd"
        />
    </svg>
);

export const ProfileCard = () => {
    const { isDarkMode } = useTheme();
    const [profile, setProfile] = useState(null);
    const [position, setPosition] = useState(null);
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        let active = true;

        const load = async () => {
            const [dashboardResult, leaderboardResult, achievementResult] = await Promise.allSettled([
                apiRequest("/dashboard"),
                apiRequest("/leaderboard/me"),
                apiRequest("/achievement/me"),
            ]);

            if (!active) return;

            setProfile(dashboardResult.status === "fulfilled" ? dashboardResult.value?.data : null);
            setPosition(leaderboardResult.status === "fulfilled" ? leaderboardResult.value?.data : null);
            setAchievements(achievementResult.status === "fulfilled" && Array.isArray(achievementResult.value?.data) ? achievementResult.value.data : []);
        };

        load();
        return () => {
            active = false;
        };
    }, []);

    const user = profile?.user;
    const stats = profile?.stats || {};
    const name = [user?.userDetails?.firstName, user?.userDetails?.lastName].filter(Boolean).join(" ").trim() || user?.username || "Student";
    const className = profile?.enrollments?.[0]?.course?.name || "No class assigned";
    const avatarUrl = user?.userDetails?.avatar || "/avatar.png";
    const roles = [user?.type, ...(user?.roles || []).map((entry) => entry.role?.name)].filter(Boolean);
    const totalXP = Number(stats.xp || user?.xp?.xp || 0);
    const level = Number(stats.level || user?.xp?.level || 1);
    const currentXP = totalXP % 100 || totalXP;
    const maxXP = 100;
    const progressPercentage = Math.min(100, Math.max(0, (currentXP / maxXP) * 100));
    const rank = position?.rank || stats.leaderboardRank || "N/A";
    const badges = achievements.slice(0, 4);
    const streak = Math.max(0, Math.min(achievements.length * 3, 99));

    const themeClasses = useMemo(() => ({
        containerBg: isDarkMode ? "bg-[#0f172a]/90" : "bg-slate-100/90",
        textColor: isDarkMode ? "text-white" : "text-slate-900",
        subTextColor: isDarkMode ? "text-slate-300" : "text-slate-500",
        cardBorder: isDarkMode ? "border-slate-700" : "border-slate-200",
        roleBg: isDarkMode ? "bg-slate-800" : "bg-white",
        roleBorder: isDarkMode ? "border-slate-700" : "border-slate-300",
        roleText: isDarkMode ? "text-slate-100" : "text-slate-700",
    }), [isDarkMode]);

    return (
        <div
            className={`relative w-full max-w-full overflow-hidden rounded-[2rem] border p-6 shadow-xl transition-colors duration-300 shrink-0 ${themeClasses.containerBg} ${themeClasses.cardBorder} ${themeClasses.textColor}`}
        >
            <div className="flex flex-col items-center">
                <div className="relative">
                    <div
                        className="h-24 w-24 rounded-full border-4 border-white shadow-lg bg-center bg-cover bg-no-repeat"
                        style={{ backgroundImage: `url(${avatarUrl})` }}
                        role="img"
                        aria-label={`${name}'s avatar`}
                    />
                    <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-4 border-white bg-green-500" />
                </div>
            </div>

            {badges.length > 0 ? (
                <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {badges.map((badge) => (
                        <span key={badge.id} className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-slate-700">
                            {badge.achievement?.name || "Badge"}
                        </span>
                    ))}
                </div>
            ) : null}

            <div className="mt-3 text-center">
                <h2 className="truncate text-2xl font-bold tracking-tight">
                    {name} | {className}
                </h2>
                <div className={`mt-1 text-sm font-medium ${themeClasses.subTextColor}`}>
                    Rank: {rank} | {totalXP.toLocaleString()} XP
                </div>
            </div>

            <div className="mt-6">
                <div className="flex flex-wrap justify-center gap-2">
                    {roles.length > 0 ? roles.map((role) => (
                        <div
                            key={role}
                            className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-sm ${themeClasses.roleBg} ${themeClasses.roleBorder} ${themeClasses.roleText}`}
                        >
                            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                            {role}
                        </div>
                    )) : (
                        <div className={`text-center text-sm ${themeClasses.subTextColor}`}>No roles to display</div>
                    )}
                </div>
            </div>

            <div className="mt-8 flex items-center justify-between px-1">
                <div className="text-xl font-bold">Level: {level}</div>
                <div className="flex items-center gap-1.5">
                    <FireIcon className={`h-6 w-6 ${streak > 0 ? "animate-pulse text-orange-500" : "text-gray-400"}`} />
                    <span className="text-lg font-bold">{streak}</span>
                </div>
            </div>

            <div className="relative mt-3 h-8 w-full overflow-hidden rounded-lg border border-transparent bg-gray-200">
                <div className={`absolute inset-0 z-10 flex items-center justify-center text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                    {currentXP} / {maxXP} XP
                </div>
                <div
                    className="h-full rounded-lg bg-gradient-to-r from-blue-400 via-sky-500 to-emerald-400 transition-all duration-500 ease-out shadow-lg"
                    style={{ width: `${progressPercentage}%` }}
                />
            </div>
        </div>
    );
};

export default ProfileCard;
