const menuItems = [
    {
        title: "MENU",
        items: [
            {
                icon: "/home.png",
                label: "Home",
                href: "/",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/teacher.png",
                label: "Teachers",
                href: "/list/teachers",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/student.png",
                label: "Students",
                href: "/list/students",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/subject.png",
                label: "Subjects",
                href: "/list/subjects",
                visible: ["admin"],
            },
            {
                icon: "/class.png",
                label: "Classes",
                href: "/list/classes",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/lesson.png",
                label: "Lessons",
                href: "/list/lessons",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/exam.png",
                label: "Exams",
                href: "/list/exams",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/assignment.png",
                label: "Assignments",
                href: "/list/assignments",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/result.png",
                label: "Results",
                href: "/list/results",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/attendance.png",
                label: "Attendance",
                href: "/list/attendance",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/class.png",
                label: "Admissions",
                href: "/list/admissions",
                visible: ["admin", "teacher"],
            },
            {
                icon: "/finance.png",
                label: "Wallet",
                href: "/wallet",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/finance.png",
                label: "Store",
                href: "/store",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/result.png",
                label: "Orders",
                href: "/orders",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/calendar.png",
                label: "Events",
                href: "/list/events",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/calendar.png",
                label: "Timetable",
                href: "/timetable",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/message.png",
                label: "Chat",
                href: "/chat",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/announcement.png",
                label: "Announcements",
                href: "/list/announcements",
                visible: ["admin", "teacher", "student", "parent"],
            },
        ],
    },
    {
        title: "OTHER",
        items: [
            {
                icon: "/profile.png",
                label: "Profile",
                href: "/profile",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/setting.png",
                label: "Settings",
                href: "/settings",
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                icon: "/logout.png",
                label: "Logout",
                href: "/logout",
                visible: ["admin", "teacher", "student", "parent"],
            },
        ],
    },
];

import { memo, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useChatUnreadCount } from "../hooks/useChatUnreadCount";
import { useAuth } from "../contexts/AuthContext";
import { getHomeRoute } from "../lib/homeRoute";

function MenuComponent() {
    const unreadCount = useChatUnreadCount();
    const { user } = useAuth();
    const homeHref = getHomeRoute(user?.type);

    const visibleMenuItems = useMemo(() => {
        return menuItems.map((section) => ({
            ...section,
            items: section.items.filter((item) => !user || item.visible.includes(user.type)),
        })).filter((section) => section.items.length > 0);
    }, [user]);

    return (
        <div className="mt-4 space-y-5">
            {visibleMenuItems.map((i) => {
                return (
                    <div key={i.title} className="text-xs">
                        <span className="mb-2 flex w-full justify-center px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400 md:justify-start lg:px-4">
                            {i.title}
                        </span>
                        {i.items.map((item) => {
                            const isLogout = item.href === "/logout";
                            if (isLogout) return null;
                            const href = item.label === "Home" ? homeHref : item.href;
                            return (
                                <NavLink
                                    key={item.label}
                                    to={href}
                                    className={({ isActive }) =>
                                        `relative mx-1 flex items-center justify-center gap-3 rounded-2xl border px-2 py-3 transition lg:mx-0 lg:justify-start lg:px-4 ${
                                            isActive
                                                ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                                                : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-white/70"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <span className={`flex h-9 w-9 items-center justify-center rounded-2xl ${isActive ? "bg-white/10" : "bg-white/70"}`}>
                                                <img src={item.icon} alt={item.label} width={16} height={16} className={isActive ? "brightness-0 invert" : ""} />
                                            </span>
                                            <span className="hidden truncate text-sm font-medium lg:block">{item.label}</span>
                                            {item.label === "Chat" && unreadCount > 0 ? (
                                                <span className="absolute right-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                                    {unreadCount}
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </NavLink>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    );
}

export const Menu = memo(MenuComponent);
