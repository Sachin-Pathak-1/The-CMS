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
                icon: "/parent.png",
                label: "Parents",
                href: "/list/parents",
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


import { Link } from "react-router-dom";
import { useChatUnreadCount } from "../hooks/useChatUnreadCount";
import { useAuth } from "../contexts/AuthContext";

export function Menu() {
    const unreadCount = useChatUnreadCount();
    const { user } = useAuth();

    return (
        <div className="">
            {menuItems.map((i) => {
                const visibleItems = i.items.filter((item) => !user || item.visible.includes(user.type));
                if (visibleItems.length === 0) return null;
                return (
                    <div key={i.title} className="text-xs">
                        <span className="flex text-gray-400  md:pl-5 w-full md:justify-start justify-center">{i.title}</span>
                        {visibleItems.map((item) => {
                            return (
                                <Link key={item.label} to={item.href} className="relative flex items-center justify-center lg:justify-start gap-2 p-1  lg:pl-8  ml-2 m-3 hover:bg-gray-200 rounded-md hover:bg-blue-100">
                                    <img src={item.icon} alt={item.label} width={16} height={16} />
                                    <span className="hidden lg:block">{item.label}</span>
                                    {item.label === "Chat" && unreadCount > 0 ? (
                                        <span className="absolute right-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                                            {unreadCount}
                                        </span>
                                    ) : null}
                                </Link>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    );
}
