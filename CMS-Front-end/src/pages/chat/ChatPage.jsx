import { useEffect, useMemo, useRef, useState } from "react";
import { apiRequest } from "../../lib/apiClient";
import { useAuth } from "../../contexts/AuthContext";
import { markConversationSeen } from "../../hooks/useChatUnreadCount";
import { Send, Plus, Search, FileText, Image as ImageIcon, X, MessageCircle, Users } from "lucide-react";

const cn = (...values) => values.filter(Boolean).join(" ");

const formatTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

function Card({ children, className = "", gradient = false }) {
    return (
        <div
            className={cn(
                "rounded-2xl border transition-all duration-300",
                gradient
                    ? "bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border-white/30 shadow-2xl hover:shadow-lg"
                    : "bg-white border-slate-200 shadow-sm hover:shadow-md",
                className
            )}
        >
            {children}
        </div>
    );
}

function StatsCard({ label, value, icon, color = "blue" }) {
    const colorClasses = {
        blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
        cyan: { bg: "from-cyan-600 to-cyan-400", accent: "bg-cyan-100 text-cyan-600" },
    };
    const Icon = icon;

    return (
        <Card gradient className="p-6 group relative overflow-hidden">
            <div
                className={cn(
                    "absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity",
                    `bg-gradient-to-br ${colorClasses[color].bg}`
                )}
            />
            <div className="relative z-10">
                <div className={cn("w-12 h-12 p-3 rounded-xl mb-3", colorClasses[color].accent)}>
                    <Icon size={24} />
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
        </Card>
    );
}

function ConversationCard({ member, isSelected, onClick, isActive }) {
    const textColor = isSelected ? "text-white" : "group-hover:text-blue-600 text-slate-900";
    
    return (
        <button
            type="button"
            onClick={onClick}  
            className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition duration-200 group",
                isSelected
                    ? "border-blue-500 bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg"
                    : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
            )}
        >
            <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                    <img
                        src={member.avatar || "/avatar.png"}
                        alt={member.name}
                        className={cn(
                            "h-12 w-12 rounded-full object-cover",
                            isSelected ? "ring-2 ring-white" : ""
                        )}
                        onError={(e) => (e.target.src = "/avatar.png")}
                    />
                    {isActive && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold truncate", textColor)}>
                        {member.name}
                    </p>
                    <p className={cn("text-xs truncate mt-0.5", isSelected ? "text-blue-100" : "text-slate-500")}>
                        {member.latestMessage || "No messages"}
                    </p>
                </div>
            </div>
        </button>
    );
}

function MessageBubble({ message, isSent, member }) {
    const isImage = message.mediaType?.startsWith("image");
    const isPdf = message.mediaType === "application/pdf";

    return (
        <div className={cn("flex gap-3 mb-4", isSent ? "justify-end" : "justify-start")}>
            {!isSent && (
                <img
                    src={member?.avatar || "/avatar.png"}
                    alt={member?.name}
                    className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                    onError={(e) => (e.target.src = "/avatar.png")}
                />
            )}
            <div className={cn("flex flex-col max-w-sm", isSent ? "items-end" : "items-start")}>
                {message.body && (
                    <div
                        className={cn(
                            "px-4 py-2.5 rounded-2xl",
                            isSent
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none"
                                : "bg-slate-100 text-slate-900 rounded-bl-none"
                        )}
                    >
                        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.body}</p>
                    </div>
                )}
                {message.mediaUrl && isImage && (
                    <div className="mt-2 rounded-xl overflow-hidden border-2 border-slate-200 max-w-xs">
                        <img
                            src={message.mediaUrl}
                            alt="Shared"
                            className="max-h-72 object-cover"
                            onError={(e) => (e.target.src = "/placeholder.png")}
                        />
                    </div>
                )}
                {message.mediaUrl && (isPdf || !isImage) && (
                    <a
                        href={message.mediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "mt-2 px-4 py-2 rounded-lg flex items-center gap-2 transition hover:opacity-90",
                            isSent
                                ? "bg-blue-700 text-white"
                                : "bg-slate-200 text-slate-900"
                        )}
                    >
                        <FileText size={16} />
                        <span className="text-sm font-medium">{message.fileName || "File"}</span>
                    </a>
                )}
                <p className={cn("text-[11px] mt-1", isSent ? "text-blue-100" : "text-slate-400")}>
                    {formatTime(message.createdAt)}
                </p>
            </div>
        </div>
    );
}

export function ChatPage() {
    const { user: currentUser } = useAuth();
    const currentUserId = currentUser?.id;
    const [members, setMembers] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState("");
    const [messages, setMessages] = useState([]);
    const [draft, setDraft] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [lastMessageCount, setLastMessageCount] = useState(0);
    
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
                    setError(err.message || "Failed to load contacts");
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
                const newMessages = Array.isArray(response?.data) ? response.data : [];
                setMessages(newMessages);
                setLastMessageCount(newMessages.length);
                markConversationSeen(selectedMemberId);
            } catch (err) {
                if (active) {
                    setError(err.message || "Failed to load messages");
                }
            } finally {
                if (active) setIsLoadingMessages(false);
            }
        };

        loadMessages();
        return () => {
            active = false;
        };
    }, [selectedMemberId]);

    useEffect(() => {
        if (!selectedMemberId) return;
        let active = true;

        const smartPoll = async () => {
            try {
                const response = await apiRequest(`/chat/conversations/${selectedMemberId}`);
                if (!active) return;
                const newMessages = Array.isArray(response?.data) ? response.data : [];
                
                if (newMessages.length !== lastMessageCount) {
                    setMessages(newMessages);
                    setLastMessageCount(newMessages.length);
                    markConversationSeen(selectedMemberId);
                }
            } catch {
                // Silent fail
            }
        };

        const timer = setInterval(smartPoll, 5000);
        return () => clearInterval(timer);
    }, [selectedMemberId, lastMessageCount]);

    const selectedMember = useMemo(
        () => members.find((m) => m.id === selectedMemberId) || null,
        [members, selectedMemberId]
    );

    const filteredMembers = useMemo(
        () => searchQuery
            ? members.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : members,
        [members, searchQuery]
    );

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || []);
        const maxSize = 10 * 1024 * 1024;

        const validFiles = files.filter((file) => {
            if (file.size > maxSize) {
                setError(`File too large: ${file.name}`);
                return false;
            }
            return true;
        });

        setSelectedFiles([...selectedFiles, ...validFiles]);
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const uploadFileToCloudinary = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const response = await apiRequest("/uploads/cloudinary", {
                        method: "POST",
                        body: JSON.stringify({
                            fileName: file.name,
                            dataUrl: e.target.result,
                            folder: "cms-chat",
                        }),
                    });
                    resolve({
                        url: response.data?.url,
                        fileName: file.name,
                        mediaType: file.type,
                    });
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(new Error("File read failed"));
            reader.readAsDataURL(file);
        });
    };

    const handleSend = async () => {
        const body = draft.trim();
        if ((!body && selectedFiles.length === 0) || !selectedMemberId) return;

        try {
            setError("");
            setIsSending(true);
            let mediaUrl = "";
            let mediaType = "";
            let fileName = "";

            if (selectedFiles.length > 0) {
                const file = selectedFiles[0];
                const uploaded = await uploadFileToCloudinary(file);
                mediaUrl = uploaded.url;
                mediaType = uploaded.mediaType;
                fileName = uploaded.fileName;
            }

            const response = await apiRequest("/chat/messages", {
                method: "POST",
                body: JSON.stringify({
                    receiverId: selectedMemberId,
                    body: body || (fileName ? `Shared: ${fileName}` : ""),
                    mediaUrl,
                    mediaType,
                    fileName,
                }),
            });

            if (response?.data) {
                setMessages((prev) => [...prev, response.data]);
                setLastMessageCount(prev => prev + 1);
            }
            setDraft("");
            setSelectedFiles([]);
            scrollToBottom();
        } catch (err) {
            setError(err.message || "Failed to send");
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            handleSend();
        }
    };

    return (
        <div className="space-y-8 px-4 py-8 md:px-8">
            {/* Header */}
            <div className="flex flex-col gap-2 mb-6">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                    Direct Messaging
                </span>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Chat
                </h1>
                <p className="text-slate-600">Connect instantly with teachers, students, and colleagues</p>
            </div>

            {error && (
                <Card className="p-4 border-rose-200 bg-rose-50">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-rose-700">{error}</p>
                        <button onClick={() => setError("")} className="text-rose-600 hover:text-rose-800">
                            <X size={18} />
                        </button>
                    </div>
                </Card>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatsCard label="Total Contacts" value={members.length} icon={Users} color="blue" />
                <StatsCard label="Active Chats" value={selectedMemberId ? 1 : 0} icon={MessageCircle} color="cyan" />
            </div>

            {/* Chat Area */}
            <div className="grid gap-4 lg:grid-cols-4 min-h-screen">
                {/* Sidebar */}
                <Card gradient className="lg:col-span-1 p-5 overflow-hidden flex flex-col h-fit lg:h-screen lg:sticky lg:top-20">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Contacts</h2>
                    <div className="relative mb-4">
                        <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {isLoadingMembers ? (
                            <p className="text-sm text-slate-500 text-center py-8">Loading...</p>
                        ) : filteredMembers.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-8">No contacts</p>
                        ) : (
                            filteredMembers.map((member) => (
                                <ConversationCard
                                    key={member.id}
                                    member={member}
                                    isSelected={selectedMemberId === member.id}
                                    onClick={() => setSelectedMemberId(member.id)}
                                    isActive={true}
                                />
                            ))
                        )}
                    </div>
                </Card>

                {/* Chat */}
                <Card gradient className="lg:col-span-3 p-6 overflow-hidden flex flex-col h-screen">
                    {selectedMember ? (
                        <>
                            {/* Header */}
                            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 mb-4 flex-shrink-0">
                                <img
                                    src={selectedMember.avatar || "/avatar.png"}
                                    alt={selectedMember.name}
                                    className="h-12 w-12 rounded-full object-cover"
                                    onError={(e) => (e.target.src = "/avatar.png")}
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-900">{selectedMember.name}</p>
                                    <p className="text-xs text-emerald-600 font-medium">Online</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-3">
                                {isLoadingMessages ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin">
                                            <MessageCircle size={32} className="text-blue-600" />
                                        </div>
                                        <p className="text-sm text-slate-500 mt-3">Loading messages...</p>
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-20">
                                        <MessageCircle size={48} className="mx-auto text-slate-300 mb-3" />
                                        <p className="text-slate-600 font-medium">No messages yet</p>
                                        <p className="text-sm text-slate-500">Start chatting!</p>
                                    </div>
                                ) : (
                                    messages.map((message) => (
                                        <MessageBubble
                                            key={message.id}
                                            message={message}
                                            isSent={message.senderId === currentUserId}
                                            member={selectedMember}
                                        />
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="flex-shrink-0 space-y-3 border-t border-slate-200 pt-4">
                                {selectedFiles.length > 0 && (
                                    <div className="space-y-2">
                                        {selectedFiles.map((file, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg">
                                                {file.type.startsWith("image") ? (
                                                    <ImageIcon size={16} className="text-blue-600" />
                                                ) : (
                                                    <FileText size={16} className="text-amber-600" />
                                                )}
                                                <span className="text-sm text-slate-700 truncate flex-1">{file.name}</span>
                                                <button
                                                    onClick={() => removeFile(idx)}
                                                    className="text-slate-400 hover:text-rose-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        accept="image/*,.pdf,.doc,.docx,.txt"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex-shrink-0 p-2 rounded-lg border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition"
                                        title="Attach file"
                                    >
                                        <Plus size={20} className="text-amber-600" />
                                    </button>
                                    <textarea
                                        value={draft}
                                        onChange={(e) => setDraft(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type message..."
                                        className="flex-1 p-2.5 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none outline-none transition bg-white"
                                        rows={2}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={(!draft.trim() && selectedFiles.length === 0) || isSending}
                                        className={cn(
                                            "flex-shrink-0 p-2 rounded-lg transition font-medium flex items-center gap-2",
                                            draft.trim() || selectedFiles.length > 0
                                                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-lg"
                                                : "bg-slate-200 text-slate-400"
                                        )}
                                    >
                                        {isSending ? "..." : <Send size={20} />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-400">Ctrl+Enter to send</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <MessageCircle size={48} className="mx-auto text-slate-300 mb-3" />
                                <p className="text-lg font-semibold text-slate-900">Select a contact</p>
                                <p className="text-slate-500 mt-2">Choose someone to start messaging</p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
