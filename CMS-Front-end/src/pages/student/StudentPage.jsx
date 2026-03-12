import { Announcements } from "../../components/Announcements";
import { EventCalender } from "../../components/EventCalender";
import { BigCalendar } from "../../components/BigCalendar";
import { Layout } from "../Layout";
import { ProfileCard } from "../../components/Others/profilecard";

export function StudentPage() {
    return(
        <Layout>
            <div className="p-4">
                <section className="hero-panel mb-4">
                    <span className="page-tag">Student Dashboard</span>
                    <h1 className="mt-4 text-3xl font-semibold text-slate-800">Balance class flow, activity, and progress</h1>
                    <p className="section-copy max-w-2xl">The student view now matches the wallet styling and keeps the schedule, campus activity, and profile context in the same visual system.</p>
                </section>
            </div>
            <div className="flex flex-col gap-4 px-4 xl:flex-row">
                {/* LEFT SIDE */}
                <div className="w-full lg:w-2/3 flex flex-col gap-4 h-[95%] overflow-y-auto overscroll-contain">
                    <div className="glass-panel h-full p-5">
                        <h1 className="text-lg font-semibold text-slate-800">Schedule (4A)</h1>
                        <BigCalendar />
                    </div>
                </div>
                {/* RIGHT SIDE */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4 h-[95%] overflow-y-auto overscroll-contain">
                    {/* EVENT CALENDER  */}
                    <ProfileCard />
                    <EventCalender />
                    <Announcements />
                </div>

            </div>
        </Layout>
    );
}

