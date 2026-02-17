import { Announcements } from "../../components/Announcements";
import { EventCalender } from "../../components/EventCalender";
import { BigCalendar } from "../../components/BigCalendar";
import { Layout } from "../Layout";
import { ProfileCard } from "../../components/Others/profilecard";

export function StudentPage() {
    return(
        <Layout>
            <div className=" flex flex-col xl:flex-row gap-4 p-4 h-full overflow-hidden scroll-none m-0">
                {/* LEFT SIDE */}
                <div className="w-full lg:w-2/3 flex flex-col gap-4 h-[95%] overflow-y-auto overscroll-contain">
                    <div className="h-full bg-white p-4 rounded-md">
                        <h1 className="text-lg font-semibold">Schedule (4A)</h1>
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