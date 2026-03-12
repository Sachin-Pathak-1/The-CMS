import { useEffect, useState } from "react";
import { apiRequest } from "../lib/apiClient";

export function Announcements() {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        let active = true;
        const loadAnnouncements = async () => {
            try {
                const response = await apiRequest("/public/lists/announcements?limit=3");
                if (active) {
                    setAnnouncements(Array.isArray(response?.data) ? response.data : []);
                }
            } catch {
                if (active) {
                    setAnnouncements([]);
                }
            }
        };
        loadAnnouncements();
        return () => {
            active = false;
        };
    }, []);

    return (
        <div className="glass-panel w-full shrink-0 p-5">
            <div className="flex items-center justify-between">
                <h1 className="mb-3 text-lg font-semibold text-slate-800">Announcements</h1>
                <span className="text-xs uppercase tracking-[0.16em] text-slate-400">View All</span>
            </div>
            <div className="flex flex-col gap-4">
                {announcements.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/90 p-4">
                        <h1 className="break-words text-sm font-semibold text-slate-700">{item.title}</h1>
                        <p className="my-2 break-words text-xs leading-6 text-slate-500">{item.description || "No description provided."}</p>
                        <span className="block break-words text-xs uppercase tracking-[0.14em] text-slate-400">Posted on {item.date}</span>
                    </div>
                ))}
                {announcements.length === 0 && (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">No announcements found.</div>
                )}
            </div>
        </div >
    );
} 
