import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Announcements } from "../../../components/Announcements"
import { BigCalendar } from "../../../components/BigCalendar";
import { Performance } from "../../../components/Performance";
import { apiRequest } from "../../../lib/apiClient";

export function TeacherDetails () {
    const { id } = useParams();
    const location = useLocation();
    const [teacher, setTeacher] = useState(location.state?.teacher || null);
    const [loading, setLoading] = useState(!location.state?.teacher);

    useEffect(() => {
        if (location.state?.teacher) return;
        let active = true;
        const loadTeacher = async () => {
            try {
                const response = await apiRequest(`/public/details/teachers/${id}`);
                if (active) {
                    setTeacher(response?.data || null);
                }
            } catch {
                if (active) {
                    setTeacher(null);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };
        loadTeacher();
        return () => {
            active = false;
        };
    }, [id, location.state?.teacher]);

    if (loading) {
        return (
            <>
                <div className="p-6 text-sm text-slate-500">Loading teacher details...</div>
            </>
        );
    }

    if (!teacher) {
        return (
            <>
                <div className="p-6">
                    <h1 className="text-xl font-semibold">Teacher not found</h1>
                    <Link to="/list/teachers" className="mt-3 inline-block text-blue-600">
                        Back to Teachers List
                    </Link>
                </div>
            </>
        );
    }

    return(
        <>
            <div className="flex flex-1 p-4 flex-col gap-4 md:flex-row">
            {/* LEFT */}
                <div className="w-full xl:w-2/3">
                    {/* TOP */}
                    <div className="flex flex-col xl:flex-row gap-4">
                        {/* USER INFO CARD */}
                        <div className="bg-sky-200 py-6 px-4 rounded-md flex-1 flex gap-4">
                            <div className="w-1/3">
                                <img src={teacher.photo || "/avatar.png"} alt={teacher.name} width={144} height={144} className="w-36 h-36 rounded-full object-cover" />
                            </div>
                            <div className="w-2/3 flex flex-col justify-between gap-4">
                                <h1 className="text-xl font-semibold">{teacher.name}</h1>
                                <p className="text-sm text-slate-500">{teacher.address}</p>
                                <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                    <div className="w-full md:w-1/3 2xl:w-1/3 flex lg:w-1/3 items-center gap-2">
                                        <img src="/blood.png" alt="" width={14} height={14}/>
                                        <span>ID: {teacher.teacherId}</span>
                                    </div>
                                    <div className="w-full md:w-1/3 2xl:w-1/3 lg:w-1/3 flex items-center gap-2">
                                        <img src="/date.png" alt="" width={14} height={14}/>
                                        <span>Teacher</span>
                                    </div>
                                    <div className="w-full md:w-1/3 2xl:w-1/3 lg:w-1/3 flex items-center gap-2">
                                        <img src="/mail.png" alt="" width={14} height={14}/>
                                        <span>{teacher.email}</span>
                                    </div>
                                    <div className="w-full md:w-1/3 2xl:w-1/3 lg:w-1/3 flex items-center gap-2">
                                        <img src="/phone.png" alt="" width={14} height={14}/>
                                        <span>{teacher.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* SMALL CARD */}
                        <div className="flex-1 flex gap-4 justify-between flex-wrap">
                            {/* CARD */}
                            <div className="glass-panel flex gap-4 p-5 w-full md:w-[47%] lg:w-[47%] 2xl:w-[48%]">
                                <img src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6"/>
                                <div className="">
                                    <h1 className="text-xl font-semibold">90%</h1>
                                    <span className="text-sm text-gray-400 ">Attendance</span>
                                </div>
                            </div>
                            {/* CARD */}
                            <div className="glass-panel flex gap-4 p-5 w-full md:w-[47%] lg:w-[47%] 2xl:w-[48%]">
                                <img src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6"/>
                                <div className="">
                                    <h1 className="text-xl font-semibold">{teacher.subjects?.length || 0}</h1>
                                    <span className="text-sm text-gray-400 ">Subjects</span>
                                </div>
                            </div>
                            {/* CARD */}
                            <div className="glass-panel flex gap-4 p-5 w-full md:w-[47%] lg:w-[47%] 2xl:w-[48%]">
                                <img src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6"/>
                                <div className="">
                                    <h1 className="text-xl font-semibold">6%</h1>
                                    <span className="text-sm text-gray-400 ">Lessons</span>
                                </div>
                            </div>
                            {/* CARD */}
                            <div className="glass-panel flex gap-4 p-5 w-full md:w-[47%] lg:w-[47%] 2xl:w-[48%]">
                                <img src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6"/>
                                <div className="">
                                    <h1 className="text-xl font-semibold">{teacher.classes?.length || 0}</h1>
                                    <span className="text-sm text-gray-400 ">Classes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* BOTTOM */}
                    <div className="bg-white mt-4 rounded-md p-4 h-[800px]">
                        <h1>Teacher's Schedule</h1>
                        <BigCalendar/>
                    </div>
                </div>
                {/* RIGHT */}
                <div className="w-full xl:w-1/3 flex flex-col gap-4">
                    <div className="glass-panel p-5">
                        <h1 className="text-xl font-semibold">Shortcuts</h1>
                        <div className="mt-2 flex gap-4 flex-wrap text-xs text-slate-500">
                            <Link className="p-3 rounded-md bg-sky-200" to={'/'}>Teacher's Classes</Link>
                            <Link className="p-3 rounded-md bg-purple-200" to={'/'}>Teacher's Students</Link>
                            <Link className="p-3 rounded-md bg-yellow-200" to={'/'}>Teacher's Lessons</Link>
                            <Link className="p-3 rounded-md bg-pink-50" to={'/'}>Teacher's Exams</Link>
                            <Link className="p-3 rounded-md bg-sky-200" to={'/'}>Teacher's Assignments</Link>
                        </div>
                    </div>
                    <Performance /> 
                    <Announcements />
                </div>
            </div>
        </>
        
    );
}


