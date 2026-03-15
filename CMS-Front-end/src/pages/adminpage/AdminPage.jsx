import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Bell,
    BookOpen,
    Building2,
    Calendar,
    DollarSign,
    GraduationCap,
    TrendingUp,
    Users,
    BarChart3,
    PieChart as PieChartIcon,
    AlertCircle,
    Activity,
    Target,
    Award,
    Zap,
    ChevronRight,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area, RadialBarChart, RadialBar } from "recharts";
import { apiRequest } from "../../lib/apiClient";
import { useAuth } from "../../contexts/AuthContext";

const emptySummary = {
    userCounts: { student: 0, teacher: 0, parent: 0, staff: 0, admin: 0 },
    sexCounts: { boys: 0, girls: 0 },
    attendance: [],
    finance: [],
};

const cn = (...values) => values.filter(Boolean).join(" ");

const formatDate = (value) => {
    if (!value) return "No date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};

const formatCompact = (value) => {
    return new Intl.NumberFormat("en-IN", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(Number(value || 0));
};

// Modern Card Component with Glassmorphism
function Card({ children, className = "", gradient = false, glass = false }) {
    return (
        <div className={cn(
            "rounded-2xl border transition-all duration-300 hover:shadow-lg",
            gradient
                ? "bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl border-white/30 shadow-2xl"
                : "bg-white border-slate-200 shadow-sm",
            glass && "backdrop-blur-xl bg-white/10 border-white/20",
            className
        )}>
            {children}
        </div>
    );
}

// Progress Bar Component
function ProgressBar({ value, max = 100, color = "blue" }) {
    const percentage = (value / max) * 100;
    const colorClasses = {
        blue: "bg-gradient-to-r from-blue-400 to-blue-600",
        emerald: "bg-gradient-to-r from-emerald-400 to-emerald-600",
        amber: "bg-gradient-to-r from-amber-400 to-amber-600",
        purple: "bg-gradient-to-r from-purple-400 to-purple-600",
    };
    return (
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
                className={cn("h-full transition-all duration-500", colorClasses[color])}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}

// Enhanced Stats Card with Trend
function StatsCard({ icon: Icon, label, value, trend, trendValue, color = "blue", target = null }) {
    const colorClasses = {
        blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
        emerald: { bg: "from-emerald-600 to-emerald-400", accent: "bg-emerald-100 text-emerald-600" },
        amber: { bg: "from-amber-600 to-amber-400", accent: "bg-amber-100 text-amber-600" },
        purple: { bg: "from-purple-600 to-purple-400", accent: "bg-purple-100 text-purple-600" },
        rose: { bg: "from-rose-600 to-rose-400", accent: "bg-rose-100 text-rose-600" },
    };

    return (
        <Card gradient className="p-6 group relative overflow-hidden">
            {/* Background gradient element */}
            <div className={cn("absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity", `bg-gradient-to-br ${colorClasses[color].bg}`)} />
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={cn("p-3 rounded-xl", colorClasses[color].accent)}>
                        <Icon size={24} />
                    </div>
                    {trendValue && (
                        <div className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg text-xs font-semibold">
                            <TrendingUp size={14} />
                            {trendValue}
                        </div>
                    )}
                </div>
                
                <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
                <p className="text-4xl font-bold text-slate-900 mb-3">{value}</p>
                
                {target && (
                    <>
                        <p className="text-xs text-slate-500 mb-2">Progress to target: {target}%</p>
                        <ProgressBar value={parseInt(value)} max={parseInt(target)} color={color} />
                    </>
                )}
                
                {trend && (
                    <p className="text-xs text-slate-500 mt-3">{trend}</p>
                )}
            </div>
        </Card>
    );
}

// Enhanced Chart Card
function ChartCard({ title, subtitle, children, icon: Icon, action }) {
    return (
        <Card gradient className="p-6">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                        <Icon size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
                    </div>
                </div>
                {action && (
                    <Link to={action.href} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
                        {action.label}
                        <ChevronRight size={16} />
                    </Link>
                )}
            </div>
            {children}
        </Card>
    );
}

// Metric Badge
function MetricBadge({ label, value, icon: Icon, color = "blue" }) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
        amber: "bg-amber-50 text-amber-700 border-amber-200",
        purple: "bg-purple-50 text-purple-700 border-purple-200",
    };
    return (
        <div className={cn("p-3 rounded-lg border flex items-center gap-3", colorClasses[color])}>
            <Icon size={18} />
            <div>
                <p className="text-xs font-medium opacity-75">{label}</p>
                <p className="text-lg font-bold">{value}</p>
            </div>
        </div>
    );
}

// Navigation Card
function NavCard({ to, label, description, icon: Icon, color = "blue" }) {
    const colorClasses = {
        blue: "hover:from-blue-50 hover:to-blue-50/30 hover:border-blue-300",
        emerald: "hover:from-emerald-50 hover:to-emerald-50/30 hover:border-emerald-300",
        amber: "hover:from-amber-50 hover:to-amber-50/30 hover:border-amber-300",
        purple: "hover:from-purple-50 hover:to-purple-50/30 hover:border-purple-300",
        rose: "hover:from-rose-50 hover:to-rose-50/30 hover:border-rose-300",
    };

    const iconColors = {
        blue: "from-blue-500 to-blue-600",
        emerald: "from-emerald-500 to-emerald-600",
        amber: "from-amber-500 to-amber-600",
        purple: "from-purple-500 to-purple-600",
        rose: "from-rose-500 to-rose-600",
    };

    return (
        <Link to={to}>
            <Card gradient className={cn("p-5 cursor-pointer group bg-gradient-to-br", colorClasses[color])}>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <p className="font-semibold text-slate-900 group-hover:text-slate-950">{label}</p>
                        <p className="text-sm text-slate-500 mt-1">{description}</p>
                    </div>
                    <div className={cn("p-2.5 rounded-xl bg-gradient-to-br text-white group-hover:scale-110 transition-transform", iconColors[color])}>
                        <Icon size={18} />
                    </div>
                </div>
            </Card>
        </Link>
    );
}

export function AdminPage() {
    const { user } = useAuth();
    const [summary, setSummary] = useState(emptySummary);
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);

        const loadDashboard = async () => {
            try {
                const [summaryResponse, eventsResponse, announcementsResponse] = await Promise.all([
                    apiRequest("/public/summary"),
                    apiRequest("/public/lists/events?limit=6"),
                    apiRequest("/public/lists/announcements?limit=4"),
                ]);

                if (!active) return;

                setSummary(summaryResponse?.data || emptySummary);
                setEvents(Array.isArray(eventsResponse?.data) ? eventsResponse.data : []);
                setAnnouncements(Array.isArray(announcementsResponse?.data) ? announcementsResponse.data : []);
            } catch {
                if (!active) return;
                setError("Failed to load dashboard data. Please try refreshing the page.");
                setSummary(emptySummary);
                setEvents([]);
                setAnnouncements([]);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadDashboard();
        return () => {
            active = false;
        };
    }, []);

    const totalUsers = useMemo(
        () => Object.values(summary.userCounts || {}).reduce((acc, value) => acc + Number(value || 0), 0),
        [summary.userCounts],
    );

    const financeTotals = useMemo(
        () => (summary.finance || []).reduce((acc, row) => {
            acc.income += Number(row.income || 0);
            acc.expense += Number(row.expence || 0);
            return acc;
        }, { income: 0, expense: 0 }),
        [summary.finance],
    );

    const institutionName = user?.college?.name || "Institution Workspace";

    const attendanceData = (summary.attendance || []).map(row => ({
        day: row.name,
        present: Number(row.present || 0),
    }));

    const financeData = (summary.finance || []).slice(-6).map(row => ({
        month: row.name.substring(0, 3),
        income: Number(row.income || 0),
        expense: Number(row.expence || 0),
    }));

    const enrollmentTotal = (summary.sexCounts?.boys || 0) + (summary.sexCounts?.girls || 0);
    const boysPercentage = enrollmentTotal ? Math.round((summary.sexCounts?.boys || 0) / enrollmentTotal * 100) : 0;
    const girlsPercentage = enrollmentTotal ? Math.round((summary.sexCounts?.girls || 0) / enrollmentTotal * 100) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/20 p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-10">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Dashboard</p>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-2">
                            {institutionName}
                        </h1>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-600">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
                <p className="text-slate-600 text-lg mt-2">Welcome back, {user?.username || 'Admin'}. Here's what's happening with your institution today.</p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-pulse">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 font-medium">{error}</p>
                </div>
            )}

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <StatsCard
                    icon={Users}
                    label="Total Students"
                    value={formatCompact(summary.userCounts?.student || 0)}
                    trendValue="+12%"
                    trend="From last semester"
                    color="blue"
                />
                <StatsCard
                    icon={GraduationCap}
                    label="Faculty & Staff"
                    value={formatCompact((summary.userCounts?.teacher || 0) + (summary.userCounts?.staff || 0))}
                    trendValue="+5%"
                    trend={`${summary.userCounts?.admin || 0} admins managing`}
                    color="emerald"
                />
                <StatsCard
                    icon={Building2}
                    label="Parents/Guardians"
                    value={formatCompact(summary.userCounts?.parent || 0)}
                    trendValue="+8%"
                    trend="Parent engagement high"
                    color="amber"
                />
                <StatsCard
                    icon={DollarSign}
                    label="Net Annual Value"
                    value={`$${formatCompact(financeTotals.income - financeTotals.expense)}`}
                    trendValue="+22%"
                    trend="Revenue growth YoY"
                    color="purple"
                />
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Charts Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Attendance Analytics */}
                    <ChartCard 
                        title="Attendance Analytics" 
                        subtitle="7-day attendance performance" 
                        icon={Activity}
                        action={{ label: "View Report", href: "/list/attendance" }}
                    >
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={attendanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            padding: '12px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <Area type="monotone" dataKey="present" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#attendanceGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* Financial Performance */}
                    <ChartCard 
                        title="Financial Performance" 
                        subtitle="6-month income vs expense analysis" 
                        icon={DollarSign}
                        action={{ label: "Financial Reports", href: "/wallet" }}
                    >
                        <div className="h-80">
                            <svg width="0" height="0">
                                <defs>
                                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#059669" />
                                    </linearGradient>
                                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ef4444" />
                                        <stop offset="100%" stopColor="#dc2626" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={financeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="expense" fill="#ef4444" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Student Distribution */}
                    <ChartCard 
                        title="Student Distribution" 
                        subtitle={`Total: ${enrollmentTotal.toLocaleString()}`}
                        icon={PieChartIcon}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-center h-40">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Boys', value: summary.sexCounts?.boys || 0, fill: '#3b82f6' },
                                                { name: 'Girls', value: summary.sexCounts?.girls || 0, fill: '#ec4899' },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={70}
                                            dataKey="value"
                                            paddingAngle={3}
                                        >
                                            <Cell fill="#3b82f6" />
                                            <Cell fill="#ec4899" />
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <MetricBadge label="Boys" value={summary.sexCounts?.boys || 0} icon={Users} color="blue" />
                                <MetricBadge label="Girls" value={summary.sexCounts?.girls || 0} icon={Users} color="rose" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span>Boys</span>
                                    <span className="font-bold">{boysPercentage}%</span>
                                </div>
                                <ProgressBar value={boysPercentage} max={100} color="blue" />
                                <div className="flex justify-between text-xs mt-3">
                                    <span>Girls</span>
                                    <span className="font-bold">{girlsPercentage}%</span>
                                </div>
                                <ProgressBar value={girlsPercentage} max={100} color="purple" />
                            </div>
                        </div>
                    </ChartCard>

                    {/* Key Metrics */}
                    <Card gradient className="p-5 border-indigo-200/50">
                        <p className="text-xs font-semibold text-indigo-600 uppercase mb-4">Key Metrics</p>
                        <div className="space-y-3">
                            <MetricBadge label="Total Users" value={formatCompact(totalUsers)} icon={Users} color="blue" />
                            <MetricBadge label="Events" value={events.length} icon={Calendar} color="amber" />
                        </div>
                    </Card>
                </div>
            </div>

            {/* Bottom Section - Events and Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Upcoming Events */}
                <ChartCard 
                    title="Upcoming Events" 
                    subtitle={`${events.length} scheduled`}
                    icon={Calendar}
                    action={{ label: "View All", href: "/list/events" }}
                >
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {events.slice(0, 5).length > 0 ? events.slice(0, 5).map((event, idx) => (
                            <div 
                                key={event.id} 
                                className={cn(
                                    "p-4 rounded-xl border-2 transition-all hover:shadow-lg",
                                    idx === 0 
                                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" 
                                        : "bg-white border-slate-200 hover:border-slate-300"
                                )}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{event.title}</p>
                                        <p className="text-xs text-slate-500 mt-1">{event.class || 'General Event'}</p>
                                    </div>
                                    <span className={cn(
                                        "text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide",
                                        event.isUrgent
                                            ? "bg-red-100 text-red-700"
                                            : "bg-emerald-100 text-emerald-700",
                                    )}>
                                        {event.isUrgent ? "🔴 Urgent" : "✓ Scheduled"}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 mt-2">📅 {formatDate(event.date)}</p>
                            </div>
                        )) : (
                            <div className="p-6 rounded-xl bg-slate-50 text-center">
                                <Calendar size={32} className="mx-auto text-slate-300 mb-2" />
                                <p className="text-slate-500 text-sm">No upcoming events</p>
                            </div>
                        )}
                    </div>
                </ChartCard>

                {/* Quick Navigation */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Access</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <NavCard to="/list/students" label="Students" description="Manage records" icon={Users} color="blue" />
                            <NavCard to="/list/teachers" label="Teachers" description="Faculty team" icon={GraduationCap} color="emerald" />
                            <NavCard to="/list/announcements" label="Announcements" description="Send notices" icon={Bell} color="rose" />
                            <NavCard to="/wallet" label="Finances" description="Wallet & income" icon={DollarSign} color="amber" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Announcements Section */}
            {announcements.length > 0 && (
                <ChartCard 
                    title="Latest Announcements" 
                    subtitle={`${announcements.length} new updates`}
                    icon={Bell}
                    action={{ label: "View All", href: "/list/announcements" }}
                >
                    <div className="space-y-3">
                        {announcements.slice(0, 4).map((announcement, index) => (
                            <div
                                key={announcement.id}
                                className={cn(
                                    "p-4 rounded-xl border-2 transition-all hover:shadow-lg",
                                    index === 0
                                        ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"
                                        : "bg-white border-slate-200",
                                )}
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1">
                                        <p className="font-semibold text-slate-900">{announcement.title}</p>
                                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">{announcement.description || "No description"}</p>
                                        <p className="text-xs text-slate-400 mt-2">📅 {formatDate(announcement.date)} • Posted by {announcement.postedBy || 'System'}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {index === 0 && <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">NEW</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ChartCard>
            )}
        </div>
    );
}
