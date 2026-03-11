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
        <div className="rounded-2xl odd:bg-purple-300 even:bg-yellow-200 p-4 flex-1 min-w-[130px]">
            <div className="flex justify-between items-center">
                <span className="text-[10px] bg-white text-green-500 px-2 py-1 rounded-full ">2026/27</span>
                <img src="/more.png" alt="more" width={20} height={20} />
            </div>
            <h1 className="text-2xl font-semibold my-2">{count.toLocaleString()}</h1>
            <h2 className="capitalize text-sm font-medium text-gray-500">{`${type}s`}</h2>
        </div>
    );
}
