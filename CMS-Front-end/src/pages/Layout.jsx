import { Link, Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Menu } from "../components/Menu";
import { useAuth } from "../contexts/AuthContext";
import { getHomeRoute } from "../lib/homeRoute";

export function Layout({ children }) {
    const { user } = useAuth();

    return(
        <div className="app-shell">
            <aside className="app-sidebar w-[16%] min-w-[88px] md:w-[9%] lg:w-[18%] xl:w-[15%] pointer-events-none">
                <div className="flex min-h-full flex-col overflow-y-auto px-3 pb-6 pt-4 lg:px-4 pointer-events-auto">
                    <Link to={getHomeRoute(user?.type)} className="glass-panel flex items-center justify-center gap-3 px-3 py-3 lg:justify-start">
                        <img src="/logo.png" alt="logo" width={32} height={34}/>
                        <div className="hidden lg:block">
                            <p className="text-sm font-semibold text-slate-800">Learnytics</p>
                            <p className="text-xs text-slate-500">Campus workspace</p>
                        </div>
                    </Link>
                    <div className="mt-2 flex-1">
                        <Menu />
                    </div>
                </div>
            </aside>
            <main className="app-main w-[84%] md:w-[91%] lg:w-[82%] xl:w-[85%]">
                <div className="mx-auto flex min-h-full max-w-[1680px] flex-col px-3 pb-6 md:px-4">
                    <Navbar />
                    <div className="flex min-h-0 flex-1 flex-col">
                        {children ?? <Outlet />}
                    </div>
                </div>
            </main>
        </div>
    );
}
