import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Menu } from "../components/Menu";

export function Layout({ children }) {
    return(
        <div className="app-shell">
            <aside className="app-sidebar w-[16%] min-w-[88px] md:w-[9%] lg:w-[18%] xl:w-[15%]">
                <div className="sticky top-0 px-3 pb-6 pt-4 lg:px-4">
                    <Link to="/" className="glass-panel flex items-center justify-center gap-3 px-3 py-3 lg:justify-start">
                        <img src="/logo.png" alt="logo" width={32} height={34}/>
                        <div className="hidden lg:block">
                            <p className="text-sm font-semibold text-slate-800">Learnytics</p>
                            <p className="text-xs text-slate-500">Campus workspace</p>
                        </div>
                    </Link>
                    <Menu />
                </div>
            </aside>
            <main className="app-main w-[84%] md:w-[91%] lg:w-[82%] xl:w-[85%]">
                <div className="mx-auto max-w-[1680px] px-3 pb-6 pt-3 md:px-4">
                    <Navbar />
                    {children}
                </div>
            </main>
        </div>
    );
}
