import { UserCard } from "../../components/UserCard";
import { CountChart } from "../../components/CountChart";
import { AttendanceChart } from "../../components/AttendanceChart";
import { FinanceChart } from "../../components/FinanceChart";
import { EventCalender } from "../../components/EventCalender";
import { Announcements } from "../../components/Announcements";
import { Layout } from "../Layout";


export function AdminPage() {
    return(
        <Layout>
            <div className="p-4">
                <section className="hero-panel mb-4">
                    <span className="page-tag">Admin Dashboard</span>
                    <h1 className="mt-4 text-3xl font-semibold text-slate-800">Institution activity at a glance</h1>
                    <p className="section-copy max-w-2xl">Review student counts, attendance trends, finance snapshots, and live campus updates from a single surface.</p>
                </section>
            </div>
            <div className="flex flex-col gap-4 px-4 md:flex-row">
                {/* LEFT SIDE */}
                <div className="w-full lg:w-2/3 flex flex-col gap-4 h-[95%] overflow-y-auto overscroll-contain">
                    {/* CARDS */}
                    <div className="flex gap-4 justify-between flex-wrap">
                        <UserCard type="student"/>
                        <UserCard type="teacher"/>
                        <UserCard type="parent"/>
                        <UserCard type="staff"/>
                    </div>
                    {/*  MIDDLE CHARTS */}
                    <div className="flex gap-4 flex-col lg:flex-row">
                        {/* COUNT CHART  */}
                        <div className="w-full lg:w-1/3 h-[350px]">
                            <CountChart />
                        </div>
                        {/* ATTENDANCE CHART  */}
                        <div className="w-full lg:w-2/3 h-[350px]">
                            <AttendanceChart />
                        </div>
                    </div>
                    {/* BOTTOM CHART  */}
                    <div className="w-full h-[500px]">
                        <FinanceChart />
                    </div>
                </div>
                {/* RIGHT SIDE */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4 h-[95%] overflow-y-auto overscroll-contain">
                    {/* EVENT CALENDER  */}
                    <EventCalender />
                    <Announcements />
                </div>

            </div>
        </Layout>
    );
}
