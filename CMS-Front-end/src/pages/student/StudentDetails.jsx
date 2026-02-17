import { Layout } from "../Layout";
import { Link, useLocation, useParams } from "react-router-dom";
import { Announcements } from "../../components/Announcements"
import { BigCalendar } from "../../components/BigCalendar";
import { Performance } from "../../components/Performance";
import { studentsData } from "../../lib/data";

export function StudentDetails () {
    const { id } = useParams();
    const location = useLocation();

    const student =
        location.state?.student ||
        studentsData.find((item) => String(item.id) === String(id));

    if (!student) {
        return (
            <Layout>
                <div className="p-6">
                    <h1 className="text-xl font-semibold">Student not found</h1>
                    <Link to="/list/students" className="mt-3 inline-block text-blue-600">
                        Back to Students List
                    </Link>
                </div>
            </Layout>
        );
    }

    return(
        <Layout>
            <div className="flex flex-1 p-4 flex-col gap-4 md:flex-row">
            {/* LEFT */}
                <div className="w-full xl:w-2/3">
                    {/* TOP */}
                    <div className="flex flex-col xl:flex-row gap-4">
                        {/* USER INFO CARD */}
                        <div className="bg-sky-200 py-6 px-4 rounded-md flex-1 flex gap-4">
                            <div className="w-1/3">
                                <img src={student.photo || "/avatar.png"} alt={student.name} width={144} height={144} className="w-36 h-36 rounded-full object-cover" />
                            </div>
                            <div className="w-2/3 flex flex-col justify-between gap-4">
                                <h1 className="text-xl font-semibold">{student.name}</h1>
                                <p className="text-sm text-gray-500">{student.address}</p>
                                <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                    <div className="w-full md:w-1/3 2xl:w-1/3 flex lg:w-1/3 items-center gap-2">
                                        <img src="/blood.png" alt="" width={14} height={14}/>
                                        <span>ID: {student.studentId}</span>
                                    </div>
                                    <div className="w-full md:w-1/3 2xl:w-1/3 lg:w-1/3 flex items-center gap-2">
                                        <img src="/date.png" alt="" width={14} height={14}/>
                                        <span>Student</span>
                                    </div>
                                    <div className="w-full md:w-1/3 2xl:w-1/3 lg:w-1/3 flex items-center gap-2">
                                        <img src="/mail.png" alt="" width={14} height={14}/>
                                        <span>{student.email}</span>
                                    </div>
                                    <div className="w-full md:w-1/3 2xl:w-1/3 lg:w-1/3 flex items-center gap-2">
                                        <img src="/phone.png" alt="" width={14} height={14}/>
                                        <span>{student.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* SMALL CARD */}
                        <div className="flex-1 flex gap-4 justify-between flex-wrap">
                            {/* CARD */}
                            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] lg:w-[47%] 2xl:w-[48%]">
                                <img src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6"/>
                                <div className="">
                                    <h1 className="text-xl font-semibold">90%</h1>
                                    <span className="text-sm text-gray-400 ">Attendance</span>
                                </div>
                            </div>
                            {/* CARD */}
                            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] lg:w-[47%] 2xl:w-[48%]">
                                <img src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6"/>
                                <div className="">
                                    <h1 className="text-xl font-semibold">{student.grade}</h1>
                                    <span className="text-sm text-gray-400 ">Grade</span>
                                </div>
                            </div>
                            {/* CARD */}
                            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] lg:w-[47%] 2xl:w-[48%]">
                                <img src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6"/>
                                <div className="">
                                    <h1 className="text-xl font-semibold">18</h1>
                                    <span className="text-sm text-gray-400 ">Lessons</span>
                                </div>
                            </div>
                            {/* CARD */}
                            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] lg:w-[47%] 2xl:w-[48%]">
                                <img src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6"/>
                                <div className="">
                                    <h1 className="text-xl font-semibold">{student.class}</h1>
                                    <span className="text-sm text-gray-400 ">Class</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* BOTTOM */}
                    <div className="bg-white mt-4 rounded-md p-4 h-[800px]">
                        <h1>Student's Schedule</h1>
                        <BigCalendar/>
                    </div>
                </div>
                {/* RIGHT */}
                <div className="w-full xl:w-1/3 flex flex-col gap-4">
                    <div className="bg-white p-4 rounded-md">
                        <h1 className="text-xl font-semibold">Shortcuts</h1>
                        <div className="mt-2 flex gap-4 flex-wrap text-xs text-gray-500">
                            <Link className="p-3 rounded-md bg-sky-200" to={'/'}>Student's Lessons</Link>
                            <Link className="p-3 rounded-md bg-purple-200" to={'/'}>Student's Teachers</Link>
                            <Link className="p-3 rounded-md bg-yellow-200" to={'/'}>Teacher's Results</Link>
                            <Link className="p-3 rounded-md bg-pink-50" to={'/'}>Teacher's Exams</Link>
                            <Link className="p-3 rounded-md bg-sky-200" to={'/'}>Teacher's Assignments</Link>
                        </div>
                    </div>
                    <Performance /> 
                    <Announcements />
                </div>
            </div>
        </Layout>
        
    );
}
