import {
    ArrowRight,
    BarChart3,
    Bell,
    BookOpen,
    Calculator,
    Calendar,
    CircleDollarSign,
    Clock3,
    Gift,
    Globe,
    GraduationCap,
    LayoutDashboard,
    Lightbulb,
    Lock,
    Menu,
    Moon,
    PanelTop,
    Pencil,
    Ruler,
    Shield,
    ShoppingBag,
    Sun,
    Trophy,
    TrendingUp,
    Users,
    Wallet,
    X,
} from "lucide-react";

export const DashboardIcon = (props) => <LayoutDashboard size={24} {...props} />;
export const TrendingUpIcon = (props) => <TrendingUp size={28} {...props} />;
export const ShoppingBagIcon = (props) => <ShoppingBag size={28} {...props} />;
export const WalletIcon = (props) => <Wallet size={28} {...props} />;
export const ArrowRightIcon = (props) => <ArrowRight size={20} {...props} />;
export const XIcon = (props) => <X size={24} {...props} />;
export const SunIcon = (props) => <Sun size={20} {...props} />;
export const MoonIcon = (props) => <Moon size={20} {...props} />;
export const MenuIcon = (props) => <Menu size={24} {...props} />;
export const CoinIcon = ({ size = 20, ...props }) => <CircleDollarSign size={size} {...props} />;
export const LockIcon = (props) => <Lock size={14} {...props} />;
export const GiftIcon = (props) => <Gift size={24} {...props} />;
export const BellIcon = (props) => <Bell size={20} {...props} />;
export const TrophyIcon = (props) => <Trophy size={20} {...props} />;
export const ClockIcon = (props) => <Clock3 size={16} {...props} />;

export const PencilIcon = (props) => <Pencil size={24} strokeWidth={1.5} {...props} />;
export const BookIcon = (props) => <BookOpen size={24} strokeWidth={1.5} {...props} />;
export const BoardIcon = (props) => <PanelTop size={24} strokeWidth={1.5} {...props} />;
export const CalculatorIcon = (props) => <Calculator size={24} strokeWidth={1.5} {...props} />;
export const GlobeIcon = (props) => <Globe size={24} strokeWidth={1.5} {...props} />;
export const LightbulbIcon = (props) => <Lightbulb size={24} strokeWidth={1.5} {...props} />;
export const RulerIcon = (props) => <Ruler size={24} strokeWidth={1.5} {...props} />;
export const GraduationIcon = (props) => <GraduationCap size={24} strokeWidth={1.5} {...props} />;
export const CalendarIcon = (props) => <Calendar size={28} {...props} />;
export const UsersIcon = (props) => <Users size={28} {...props} />;
export const ChartIcon = (props) => <BarChart3 size={28} {...props} />;
export const ShieldIcon = (props) => <Shield size={28} {...props} />;
