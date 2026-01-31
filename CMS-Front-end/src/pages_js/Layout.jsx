import { Link } from "react-router-dom";
import { Menu } from "../Components/Menu";
import { Navbar } from "../Components/Navbar";

export function Layout({ children }) {
    return(
        <>
            <div className="flex h-screen">
                <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] ">
                    <Link to="/" className="flex items-center justify-center lg:justify-start gap-2 lg:pl-4 pt-2 mb-3">
                        <img src="/logo.png" alt="logo" width={32} height={34}/>
                        <span className="hidden lg:block font-bold font-mono">Bbrains</span>
                    </Link>
                    <Menu />
                </div>
                <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] overflow-scroll bg-gray-100">                        
                    <Navbar />
                    {children}
                </div>
            </div>
        </>
    );
}