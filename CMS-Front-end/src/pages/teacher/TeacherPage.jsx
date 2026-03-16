import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    BookOpen,
    CheckCircle,
    Clock,
    TrendingUp,
    Calendar,
    FileText,
    BarChart3,
    AlertCircle,
    ChevronRight,
    Award,
    Zap,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from "recharts";
import { useAuth } from "../../contexts/AuthContext";
import { apiRequest } from "../../lib/apiClient";
import { Card } from "../../lib/designSystem";

const cn = (...values) => values.filter(Boolean).join(" ");

// Custom StatsCard with color variants
function CustomStatsCard({ icon, label, value, subtitle, color = "blue" }) {
    const colorClasses = {
        blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
        emerald: { bg: "from-emerald-600 to-emerald-400", accent: "bg-emerald-100 text-emerald-600" },
        amber: { bg: "from-amber-600 to-amber-400", accent: "bg-amber-100 text-amber-600" },
        purple: { bg: "from-purple-600 to-purple-400", accent: "bg-purple-100 text-purple-600" },
    };
    const Icon = icon;

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
function ChartCard({ title, subtitle, children, icon, action }) {
    const Icon = icon;
    return (
        <Card gradient className="p-6 min-w-0">
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

// Class Card
function ClassCard({ name, students, status }) {
    const statusClasses = {
        active: "bg-emerald-100 text-emerald-700",
        pending: "bg-amber-100 text-amber-700",
        archived: "bg-slate-100 text-slate-700",
    };

    return (
        <Card className="p-4">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <p className="font-semibold text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500 mt-1">{students} students</p>
                </div>
                <span className={cn("text-xs px-3 py-1.5 rounded-full font-bold uppercase", statusClasses[status] || statusClasses.active)}>
                    {status}
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: "65%" }} />
            </div>
        </Card>
    );
}

export function TeacherPage() {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const announcementRes = await apiRequest("/public/lists/announcements?limit=4");
                setAnnouncements(Array.isArray(announcementRes?.data) ? announcementRes.data : []);
            } catch (error) {
                console.error("Failed to load teacher data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-slate-600">
                Loading teacher dashboard...
            </div>
        );
    }

    // Mock student performance data
    const classPerformanceData = [
        { class: "Class A", avgGrade: 85 },
        { class: "Class B", avgGrade: 78 },
        { class: "Class C", avgGrade: 92 },
        { class: "Class D", avgGrade: 88 },
    ];

    // Mock grading workload
    const gradingData = [
        { week: "W1", submitted: 32, graded: 28 },
        { week: "W2", submitted: 35, graded: 32 },
        { week: "W3", submitted: 38, graded: 35 },
        { week: "W4", submitted: 40, graded: 38 },
    ];

    // Mock class distribution
    const classDistribution = [
        { name: "Period 1", value: 28 },
        { name: "Period 2", value: 32 },
        { name: "Period 3", value: 25 },
        { name: "Period 4", value: 35 },
    ];

    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50/20 p-4 md:p-8">
            {/* Header */}
            <div className="mb-10">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Educator Portal</p>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">
                            Teaching Dashboard
                        </h1>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-600">{user?.username || 'Instructor'}</p>
                    </div>
                </div>
                <p className="text-slate-600 text-lg mt-2">Manage your classes, track student progress, and streamline your grading workflow.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <CustomStatsCard
                    icon={Users}
                    label="Total Students"
                    value="120"
                    subtitle="Across 4 classes"
                    color="blue"
                />
                <CustomStatsCard
                    icon={BookOpen}
                    label="Active Classes"
                    value="4"
                    subtitle="This semester"
                    color="emerald"
                />
                <CustomStatsCard
                    icon={FileText}
                    label="Pending Grades"
                    value="18"
                    subtitle="To be reviewed"
                    color="amber"
                />
                <CustomStatsCard
                    icon={TrendingUp}
                    label="Class Average"
                    value="86%"
                    subtitle="Overall performance"
                    color="purple"
                />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Class Performance */}
                    <ChartCard
                        title="Class Performance Overview"
                        subtitle="Average grades by class"
                        icon={BarChart3}
                    >
                        <div className="h-80 min-h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
                                <BarChart data={classPerformanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="class" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                                    <Bar dataKey="avgGrade" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* Grading Workload */}
                    <ChartCard
                        title="Grading Progress"
                        subtitle="Assignments submitted vs graded"
                        icon={CheckCircle}
                    >
                        <div className="h-80 min-h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
                                <BarChart data={gradingData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="week" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                                    <Bar dataKey="submitted" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="graded" fill="#10b981" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Class Distribution */}
                    <ChartCard
                        title="Student Distribution"
                        subtitle="By period"
                        icon={Users}
                    >
                        <div className="h-72 min-h-[280px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={280}>
                                <PieChart>
                                    <Pie
                                        data={classDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {classDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* Quick Actions */}
                    <Card gradient className="p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Access</h3>
                        <div className="space-y-2">
                            <Link to="/list/enrollments" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-blue-50 rounded-lg transition">
                                <span className="text-sm font-medium text-slate-900">My Classes</span>
                                <ChevronRight size={16} className="text-slate-400" />
                            </Link>
                            <Link to="/list/grades" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50 rounded-lg transition">
                                <span className="text-sm font-medium text-slate-900">Grade Management</span>
                                <ChevronRight size={16} className="text-slate-400" />
                            </Link>
                            <Link to="/list/assignments" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-amber-50 rounded-lg transition">
                                <span className="text-sm font-medium text-slate-900">Assignments</span>
                                <ChevronRight size={16} className="text-slate-400" />
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Active Classes */}
            <div className="mb-8">
                <ChartCard
                    title="Your Classes"
                    subtitle="4 active classes this semester"
                    icon={BookOpen}
                    action={{ label: "Manage Classes", href: "/list/enrollments" }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ClassCard name="Mathematics 101" students={28} status="active" />
                        <ClassCard name="Physics Lab" students={32} status="active" />
                        <ClassCard name="Chemistry Theory" students={25} status="active" />
                        <ClassCard name="Advanced Stats" students={35} status="active" />
                    </div>
                </ChartCard>
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
