/* eslint-disable react-refresh/only-export-components */
// Reusable Design System Components based on Wallet Page
// This file provides consistent styling and components for all pages

const cn = (...values) => values.filter(Boolean).join(" ");

/**
 * Card - Base card component with optional gradient background
 */
export function Card({ children, className = "", gradient = false, highlightBg = "from-[#fff7dd] via-white to-[#def2ff]" }) {
    return (
        <div
            className={cn(
                "rounded-[28px] border border-slate-200 bg-white shadow-sm",
                gradient && `bg-gradient-to-br ${highlightBg} border-slate-200`,
                className
            )}
        >
            {children}
        </div>
    );
}

/**
 * CardHeader - Header section with title and description
 */
export function CardHeader({ 
    title, 
    description, 
    badge, 
    label, 
    labelBg = "bg-white/80",
    titleSize = "text-xl" 
}) {
    return (
        <div>
            {label && (
                <span className={`inline-flex rounded-full ${labelBg} px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500`}>
                    {label}
                </span>
            )}
            <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                    <h1 className={`${titleSize} font-semibold tracking-tight text-slate-800`}>
                        {title}
                    </h1>
                    {description && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                            {description}
                        </p>
                    )}
                </div>
                {badge && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 whitespace-nowrap">
                        {badge}
                    </span>
                )}
            </div>
        </div>
    );
}

/**
 * StatCard - Displays a metric with label and description
 */
export function StatCard({ 
    label, 
    value, 
    description, 
    variant = "default",
    className = "" 
}) {
    const variantStyles = {
        default: "border border-white/70 bg-white/80",
        dark: "bg-slate-900 text-white",
        emerald: "bg-emerald-50",
        rose: "bg-rose-50",
        sky: "bg-sky-50",
        light: "bg-slate-50",
    };

    const labelColorMap = {
        dark: "text-slate-300",
        emerald: "text-emerald-600",
        rose: "text-rose-600",
        sky: "text-sky-600",
        default: "text-slate-400",
        light: "text-slate-400",
    };

    const valueColorMap = {
        dark: "text-white",
        emerald: "text-slate-800",
        rose: "text-slate-800",
        sky: "text-slate-800",
        default: "text-slate-800",
        light: "text-slate-800",
    };

    const descColorMap = {
        dark: "text-slate-300",
        emerald: "text-slate-600",
        rose: "text-slate-600",
        sky: "text-slate-600",
        default: "text-slate-500",
        light: "text-slate-500",
    };

    return (
        <div className={cn("rounded-2xl p-5 shadow-sm", variantStyles[variant], className)}>
            <p className={cn("text-xs uppercase tracking-[0.16em] font-semibold", labelColorMap[variant])}>
                {label}
            </p>
            <p className={cn("mt-3 text-3xl font-semibold", valueColorMap[variant])}>
                {value}
            </p>
            {description && (
                <p className={cn("mt-2 text-sm", descColorMap[variant])}>
                    {description}
                </p>
            )}
        </div>
    );
}

/**
 * ActivityItem - Single activity/transaction item
 */
export function ActivityItem({ 
    icon, 
    label, 
    note, 
    amount, 
    date, 
    type = "credit" 
}) {
    const bgColor = type === "credit" ? "bg-emerald-100" : type === "rose" ? "bg-rose-100" : "bg-sky-100";
    const amountColor = type === "credit" ? "text-emerald-600" : type === "rose" ? "text-rose-600" : "text-sky-600";

    return (
        <article className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className={cn(`h-10 w-10 shrink-0 rounded-2xl ${bgColor} flex items-center justify-center`)}>
                <img src={icon} alt="" width={16} height={16} />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
                        {note && <p className="mt-1 text-sm leading-6 text-slate-500">{note}</p>}
                    </div>
                    <div className="text-left sm:text-right">
                        <p className={cn("text-lg font-semibold", amountColor)}>
                            {type === "credit" ? "+" : "-"}{amount}
                        </p>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{date}</p>
                    </div>
                </div>
            </div>
        </article>
    );
}

/**
 * SectionHeader - Section title with optional description and badge
 */
export function SectionHeader({ 
    title, 
    description, 
    badge,
    rightContent 
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
                {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            </div>
            {badge && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 whitespace-nowrap">
                    {badge}
                </span>
            )}
            {rightContent && rightContent}
        </div>
    );
}

/**
 * InfoBox - Simple information box with title and text
 */
export function InfoBox({ 
    title, 
    text, 
    variant = "light",
    className = "" 
}) {
    const variantStyles = {
        light: "bg-slate-50 border border-slate-100",
        emerald: "bg-emerald-50 border border-emerald-100",
        rose: "bg-rose-50 border border-rose-100",
        sky: "bg-sky-50 border border-sky-100",
        amber: "bg-amber-50 border border-amber-200",
    };

    return (
        <div className={cn("rounded-2xl p-4", variantStyles[variant], className)}>
            <p className="text-sm font-semibold text-slate-800">{title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
        </div>
    );
}

/**
 * Button styles - Use with regular button elements
 */
export const buttonStyles = {
    primary: "rounded-full bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-700",
    secondary: "rounded-full border border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50",
    success: "rounded-full bg-emerald-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-emerald-700",
    danger: "rounded-full bg-rose-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-rose-700",
    outline: "rounded-full border border-slate-300 px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50",
};

/**
 * ProgressBar - Progress indicator component
 */
export function ProgressBar({ percent, showLabel = true }) {
    return (
        <>
            <div className="rounded-2xl bg-slate-100 p-2">
                <div className="h-3 rounded-full bg-slate-200">
                    <div
                        className="h-3 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>
            {showLabel && (
                <p className="mt-2 text-sm text-slate-600 font-medium">{percent}% Complete</p>
            )}
        </>
    );
}

/**
 * Grid layout utilities
 */
export const gridLayouts = {
    twoCol: "grid gap-4 md:grid-cols-2",
    threeCol: "grid gap-4 md:grid-cols-3",
    fourCol: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
    responsive: (cols = "3") => `grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols}`,
};
