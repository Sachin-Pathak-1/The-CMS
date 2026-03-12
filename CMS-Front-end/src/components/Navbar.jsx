import { useTheme } from "../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useChatUnreadCount } from "../hooks/useChatUnreadCount";
import { useAuth } from "../contexts/AuthContext";

export function Navbar() {
    const { isDarkMode, setIsDarkMode } = useTheme();
    const unreadCount = useChatUnreadCount();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return(
        <div className="glass-panel sticky top-3 z-20 mb-4 flex min-h-[76px] items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
                <p className="page-tag hidden sm:inline-flex">Institution Workspace</p>
                <div className="mt-2">
                    <h1 className="truncate text-lg font-semibold text-slate-800 sm:text-2xl">Tilak Maharashtra Vidyapeeth</h1>
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">Unified dashboards, rewards, messaging, and academic operations.</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="icon-button text-sm"
                    aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                    title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                >
                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <Link to="/chat" className="icon-button relative">
                    <img src="/message.png" alt="message" width={20}/>
                    {unreadCount > 0 ? (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs min-w-5 h-5 px-1 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    ) : null}
                </Link>
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs whitespace-nowrap font-medium text-slate-700">
                        {[user?.userDetails?.firstName, user?.userDetails?.lastName].filter(Boolean).join(" ").trim() || user?.username || "User"}
                    </span>
                    <span className="text-[10px] capitalize text-slate-500">{user?.type || "Guest"}</span>
                </div>
                <div className="soft-panel flex items-center gap-3 px-2 py-2">
                    <img src={user?.userDetails?.avatar || "/avatar.png"} alt="profile" width={34} className="h-[34px] w-[34px] rounded-full object-cover" />
                    <button type="button" onClick={handleLogout} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:text-red-600">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
