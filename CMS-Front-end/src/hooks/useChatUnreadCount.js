import { useEffect, useState } from "react";
import { apiRequest } from "../lib/apiClient";

const STORAGE_KEY = "cms-chat-last-seen";

const readSeenMap = () => {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
        return {};
    }
};

export const markConversationSeen = (memberId, timestamp = new Date().toISOString()) => {
    const current = readSeenMap();
    current[memberId] = timestamp;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event("chat-seen-updated"));
};

export const useChatUnreadCount = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let active = true;

        const loadUnread = async () => {
            try {
                const response = await apiRequest("/chat/members");
                if (!active) return;
                const members = Array.isArray(response?.data) ? response.data : [];
                const seenMap = readSeenMap();

                const unread = members.filter((member) => {
                    if (!member.latestMessageAt || !member.latestSenderId) {
                        return false;
                    }

                    if (member.latestSenderId === member.id) {
                        const lastSeen = seenMap[member.id];
                        return !lastSeen || new Date(member.latestMessageAt).getTime() > new Date(lastSeen).getTime();
                    }

                    return false;
                }).length;

                setCount(unread);
            } catch {
                if (active) setCount(0);
            }
        };

        loadUnread();
        const interval = setInterval(loadUnread, 5000);
        const refresh = () => loadUnread();
        window.addEventListener("chat-seen-updated", refresh);
        return () => {
            active = false;
            clearInterval(interval);
            window.removeEventListener("chat-seen-updated", refresh);
        };
    }, []);

    return count;
};
