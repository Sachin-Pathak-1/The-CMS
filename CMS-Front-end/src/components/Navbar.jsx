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
        <div className=" p-4 flex items-center md:justify-between justify-end sticky top-0 z-10 bg-gray-100 h-11 border-b border-gray-100">
            <div className="sm:flex items-center justify-center w-full sm:text-xl text-md font-medium  ">Tilak Maharashtra Vidyapeeth</div>
            <div className="flex items-center min-w-fit max-w-full gap-4 justify-end">
                <button
                    type="button"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="w-8 h-8 flex items-center justify-center text-sm rounded-full border border-gray-100 hover:bg-blue-100 transition-colors"
                    aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                    title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                >
                    {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                </button>
                <Link to="/chat" className="flex items-center justify-center relative">
                    <img src="/message.png" alt="message" width={20}/>
                    {unreadCount > 0 ? (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs min-w-5 h-5 px-1 flex items-center justify-center">
                            {unreadCount}
                        </span>
                    ) : null}
                </Link>
                <div className="flex flex-col items-end">
                    <span className="text-xs text-nowrap">
                        {[user?.userDetails?.firstName, user?.userDetails?.lastName].filter(Boolean).join(" ").trim() || user?.username || "User"}
                    </span>
                    <span className="text-[10px] capitalize text-gray-500 ">{user?.type || "Guest"}</span>
                </div>
                <div className="flex items-center gap-3">
                    <img src={user?.userDetails?.avatar || "/avatar.png"} alt="profile" width={26} className="rounded-full" />
                    <button type="button" onClick={handleLogout} className="text-[10px] font-medium text-gray-500 hover:text-red-600">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
