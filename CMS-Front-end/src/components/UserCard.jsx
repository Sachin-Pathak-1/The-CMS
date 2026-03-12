import { useEffect, useState } from "react";
import { apiRequest } from "../lib/apiClient";

export function UserCard({ type }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let active = true;
        const loadSummary = async () => {
            try {
                const response = await apiRequest("/public/summary");
                if (!active) return;
                const counts = response?.data?.userCounts || {};
                setCount(counts[type] || 0);
            } catch {
                if (active) {
                    setCount(0);
                }
            }
        };
        loadSummary();
        return () => {
            active = false;
        };
    }, [type]);

    return(
        <div className="hero-panel flex-1 min-w-[130px] p-4 odd:from-[#e8ecff] odd:via-white odd:to-[#efe8ff] even:from-[#fff3cf] even:via-white even:to-[#e6f5ff]">
            <div className="flex justify-between items-center">
                <span className="page-tag">2026/27</span>
                <img src="/more.png" alt="more" width={20} height={20} className="opacity-60" />
            </div>
            <h1 className="my-3 text-3xl font-semibold text-slate-800">{count.toLocaleString()}</h1>
            <h2 className="capitalize text-sm font-medium text-slate-500">{`${type}s onboard`}</h2>
        </div>
    );
}
