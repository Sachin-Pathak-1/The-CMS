import { useEffect, useMemo, useState } from "react";
import { Layout } from "../Layout";
import { apiRequest } from "../../lib/apiClient";
import { markConversationSeen } from "../../hooks/useChatUnreadCount";

const formatTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

export function ChatPage() {
    const [members, setMembers] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState("");
    const [isLoadingMembers, setIsLoadingMembers] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadMembers = async () => {
            try {
                const response = await apiRequest("/chat/members");
                if (!active) return;
                const rows = Array.isArray(response?.data) ? response.data : [];
                setMembers(rows);
                if (!selectedMemberId && rows[0]?.id) {
                    setSelectedMemberId(rows[0].id);
                }
            } catch (err) {
                if (active) {
                    setError(err.message || "Failed to load chat members");
                }
            } finally {
                if (active) setIsLoadingMembers(false);
            }
        };

        loadMembers();
        return () => {
            active = false;
        };
    }, [selectedMemberId]);

    useEffect(() => {
        if (!selectedMemberId) return;
        let active = true;

        const loadMessages = async () => {
            try {
                setIsLoadingMessages(true);
                const response = await apiRequest(`/chat/conversations/${selectedMemberId}`);
                if (!active) return;
                setMessages(Array.isArray(response?.data) ? response.data : []);
                markConversationSeen(selectedMemberId);
            } catch (err) {
                if (active) {
                    setError(err.message || "Failed to load chat messages");
                }
            } finally {
                if (active) setIsLoadingMessages(false);
            }
        };

        loadMessages();
        const timer = setInterval(loadMessages, 5000);
        return () => {
            active = false;
            clearInterval(timer);
        };
    }, [selectedMemberId]);

    const selectedMember = useMemo(
        () => members.find((member) => member.id === selectedMemberId) || null,
        [members, selectedMemberId]
    );

    const handleSend = async () => {
        const body = draft.trim();
        if (!body || !selectedMemberId) return;

        try {
            const response = await apiRequest("/chat/messages", {
                method: "POST",
                body: JSON.stringify({
                    receiverId: selectedMemberId,
                    body,
                }),
            });

            setMessages((prev) => [...prev, response?.data].filter(Boolean));
            setDraft("");
        } catch (err) {
            setError(err.message || "Failed to send message");
        }
    };

    return (
        <Layout>
            <div className="p-4">
                <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-semibold text-slate-800">Chat</h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Start a conversation, browse members, and keep communication in one place.
                    </p>
                </section>

                {error ? (
                    <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                ) : null}

                <div className="mt-4 grid gap-4 xl:grid-cols-[0.36fr_0.64fr]">
                    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-800">Members</h2>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {members.length}
                            </span>
                        </div>
                        <div className="mt-5 space-y-3">
                            {isLoadingMembers ? (
                                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Loading members...</div>
                            ) : (
                                members.map((member) => (
                                    <button
                                        key={member.id}
                                        type="button"
                                        onClick={() => setSelectedMemberId(member.id)}
                                        className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                                            selectedMemberId === member.id
                                                ? "border-slate-900 bg-slate-900 text-white"
                                                : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                                        }`}
                                    >
                                        <img
                                            src={member.avatar || "/avatar.png"}
                                            alt={member.name}
                                            className="h-12 w-12 rounded-2xl object-cover"
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold">{member.name}</p>
                                            <p className={`mt-1 text-xs uppercase tracking-[0.16em] ${selectedMemberId === member.id ? "text-slate-300" : "text-slate-400"}`}>
                                                {member.type}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </section>

                    <section className="flex min-h-[640px] flex-col rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={selectedMember?.avatar || "/avatar.png"}
                                    alt={selectedMember?.name || "Chat member"}
                                    className="h-12 w-12 rounded-2xl object-cover"
                                />
                                <div>
                                    <p className="text-base font-semibold text-slate-800">{selectedMember?.name || "Select a member"}</p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">{selectedMember?.type || "Conversation"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 overflow-y-auto py-5">
                            {isLoadingMessages ? (
                                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Loading messages...</div>
                            ) : messages.length === 0 ? (
                                <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
                                    No messages yet. Start the conversation.
                                </div>
                            ) : (
                                messages.map((message) => {
                                    const isMine = message.senderId !== selectedMemberId;
                                    return (
                                        <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[75%] rounded-3xl px-4 py-3 ${
                                                isMine ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"
                                            }`}>
                                                <p className="text-sm leading-6">{message.body}</p>
                                                <p className={`mt-2 text-[11px] ${isMine ? "text-slate-300" : "text-slate-500"}`}>
                                                    {formatTime(message.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                            <div className="flex gap-3">
                                <textarea
                                    value={draft}
                                    onChange={(event) => setDraft(event.target.value)}
                                    placeholder={selectedMember ? `Message ${selectedMember.name}` : "Select a member to chat"}
                                    className="min-h-20 flex-1 rounded-2xl border border-slate-200 p-3 outline-none focus:border-blue-500"
                                    disabled={!selectedMember}
                                />
                                <button
                                    type="button"
                                    onClick={handleSend}
                                    disabled={!selectedMember || !draft.trim()}
                                    className="self-end rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Layout>
    );
}
