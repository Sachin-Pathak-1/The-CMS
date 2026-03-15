import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Book,
    Award,
    CheckCircle,
    Clock,
    TrendingUp,
    Calendar,
    FileText,
    Zap,
    AlertCircle,
    ArrowRight,
    ChevronRight,
    Bookmark,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { useAuth } from "../../contexts/AuthContext";
import { apiRequest } from "../../lib/apiClient";

const cn = (...values) => values.filter(Boolean).join(" ");

// Card Component
function Card({ children, className = "", gradient = false }) {
    return (
        <div className={cn(
            "rounded-2xl border transition-all duration-300 hover:shadow-lg",
            gradient
                ? "bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border-white/30 shadow-2xl"
                : "bg-white border-slate-200 shadow-sm",
            className
        )}>
            {children}
        </div>
    );
}

// Stats Card
function StatsCard({ icon: Icon, label, value, subtitle, color = "blue" }) {
    const colorClasses = {
        blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
        emerald: { bg: "from-emerald-600 to-emerald-400", accent: "bg-emerald-100 text-emerald-600" },
        amber: { bg: "from-amber-600 to-amber-400", accent: "bg-amber-100 text-amber-600" },
        purple: { bg: "from-purple-600 to-purple-400", accent: "bg-purple-100 text-purple-600" },
    };

    return (
        <Card gradient className="p-6 group relative overflow-hidden">
            <div className={cn("absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity", `bg-gradient-to-br ${colorClasses[color].bg}`)} />
            
            <div className="relative z-10">
                <div className={cn("w-12 h-12 p-3 rounded-xl mb-3", colorClasses[color].accent)}>
                    <Icon size={24} />
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
                {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
            </div>
        </Card>
    );
}

// Chart Card
function ChartCard({ title, subtitle, children, icon: Icon, action }) {
    return (
        <Card gradient className="p-6">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                        <Icon size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
                    </div>
                </div>
                {action && (
                    <Link to={action.href} className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                        {action.label}
                        <ChevronRight size={16} />
                    </Link>
                )}
            </div>
            {children}
        </Card>
    );
}

// Assignment Card
function AssignmentCard({ title, dueDate, status, subject }) {
    const statusClasses = {
        pending: "bg-amber-100 text-amber-700",
        submitted: "bg-emerald-100 text-emerald-700",
        graded: "bg-blue-100 text-blue-700",
    };

    return (
        <Card className="p-4">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500 mt-1">{subject}</p>
                </div>
                <span className={cn("text-xs px-3 py-1.5 rounded-full font-bold uppercase", statusClasses[status] || statusClasses.pending)}>
                    {status}
                </span>
            </div>
            <p className="text-xs text-slate-600 flex items-center gap-2">
                <Clock size={12} />
                Due: {dueDate}
            </p>
        </Card>
    );
}

export function StudentPage() {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [assignmentRes, announcementRes] = await Promise.all([
                    apiRequest("/public/lists/assignments?limit=5"),
                    apiRequest("/public/lists/announcements?limit=4"),
                ]);
                setAssignments(Array.isArray(assignmentRes?.data) ? assignmentRes.data : []);
                setAnnouncements(Array.isArray(announcementRes?.data) ? announcementRes.data : []);
            } catch (error) {
                console.error("Failed to load student data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Mock grade data
    const gradeData = [
        { subject: "Math", grade: 85 },
        { subject: "English", grade: 90 },
        { subject: "Science", grade: 78 },
        { subject: "History", grade: 88 },
    ];

    // Mock performance data
    const performanceData = [
        { week: "W1", score: 75 },
        { week: "W2", score: 80 },
        { week: "W3", score: 78 },
        { week: "W4", score: 85 },
        { week: "W5", score: 88 },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/20 p-4 md:p-8">
            {/* Header */}
            <div className="mb-10">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Student Portal</p>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">
                            Your Learning Journey
                        </h1>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-600">{user?.username || 'Student'}</p>
                    </div>
                </div>
                <p className="text-slate-600 text-lg mt-2">Track your progress, manage assignments, and stay on top of your coursework.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatsCard
                    icon={Book}
                    label="Active Assignments"
                    value={assignments.length}
                    subtitle="Upcoming deadlines"
                    color="blue"
                />
                <StatsCard
                    icon={TrendingUp}
                    label="GPA"
                    value="3.8"
                    subtitle="Excellent standing"
                    color="emerald"
                />
                <StatsCard
                    icon={CheckCircle}
                    label="Attendance"
                    value="95%"
                    subtitle="On track"
                    color="amber"
                />
                <StatsCard
                    icon={Zap}
                    label="XP Earned"
                    value="2,450"
                    subtitle="This semester"
                    color="purple"
                />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Grade Overview */}
                    <ChartCard
                        title="Grade Overview"
                        subtitle="Current course performance"
                        icon={Award}
                    >
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={gradeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="subject" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                                    <Bar dataKey="grade" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* Performance Trend */}
                    <ChartCard
                        title="Performance Trend"
                        subtitle="Weekly score progression"
                        icon={TrendingUp}
                    >
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="week" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                                    <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#performanceGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Upcoming Assignments */}
                    <ChartCard
                        title="Upcoming"
                        subtitle={`${assignments.length} assignments`}
                        icon={FileText}
                        action={{ label: "View All", href: "/list/assignments" }}
                    >
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {assignments.slice(0, 4).length > 0 ? assignments.slice(0, 4).map((assignment) => (
                                <AssignmentCard
                                    key={assignment.id}
                                    title={assignment.title || "Assignment"}
                                    dueDate={new Date(assignment.deadline || Date.now()).toLocaleDateString()}
                                    status="pending"
                                    subject="Course"
                                />
                            )) : (
                                <p className="text-slate-500 text-sm text-center py-4">No upcoming assignments</p>
                            )}
                        </div>
                    </ChartCard>

                    {/* Quick Links */}
                    <Card gradient className="p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Access</h3>
                        <div className="space-y-2">
                            <Link to="/list/assignments" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50 rounded-lg transition">
                                <span className="text-sm font-medium text-slate-900">Assignments</span>
                                <ChevronRight size={16} className="text-slate-400" />
                            </Link>
                            <Link to="/list/results" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50 rounded-lg transition">
                                <span className="text-sm font-medium text-slate-900">Grades</span>
                                <ChevronRight size={16} className="text-slate-400" />
                            </Link>
                            <Link to="/list/exams" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-amber-50 rounded-lg transition">
                                <span className="text-sm font-medium text-slate-900">Exams</span>
                                <ChevronRight size={16} className="text-slate-400" />
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Announcements */}
            {announcements.length > 0 && (
                <ChartCard
                    title="Latest Announcements"
                    subtitle={`${announcements.length} new updates`}
                    icon={AlertCircle}
                    action={{ label: "View All", href: "/list/announcements" }}
                >
                    <div className="space-y-3">
                        {announcements.slice(0, 3).map((announcement, index) => (
                            <div
                                key={announcement.id}
                                className={cn(
                                    "p-4 rounded-xl border-2 transition-all",
                                    index === 0
                                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                                        : "bg-white border-slate-200",
                                )}
                            >
                                <p className="font-semibold text-slate-900">{announcement.title}</p>
                                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{announcement.description || "No description"}</p>
                                <p className="text-xs text-slate-400 mt-2">{new Date(announcement.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            )}
        </div>
    );
}

