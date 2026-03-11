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
        <div className="w-full shrink-0 rounded-md bg-white p-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold mb-3">Announcements</h1>
                <span className="text-xs text-gray-400">Veiw All</span>
            </div>
            <div className="flex flex-col gap-4">
                {announcements.map((item) => (
                    <div key={item.id} className="overflow-hidden rounded-md border border-gray-100 border-l-4 border-l-blue-200 bg-blue-50 p-3">
                        <h1 className="break-words text-sm font-semibold text-gray-600">{item.title}</h1>
                        <p className="my-2 break-words text-xs leading-5 text-gray-600">{item.description || "No description provided."}</p>
                        <span className="block break-words text-xs text-gray-400">Posted on: {item.date}</span>
                    </div>
                ))}
                {announcements.length === 0 && (
                    <div className="text-sm text-gray-500">No announcements found.</div>
                )}
            </div>
        </div >
    );
} 
