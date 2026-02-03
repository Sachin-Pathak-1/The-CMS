import { Layout } from "../../Layout"

export function TeacherDetails () {
    return(
        <Layout>
            <div className="flex flex-1 p-4 flex-col gap-4 md:flex-row">
            {/* LEFT */}
                <div className="w-full xl:w-2/3">
                    {/* TOP */}
                    <div className="flex flex-col xl:flex-row gap-4">
                        {/* USER INFO CARD */}
                        <div className="bg-sky-300 py-6 px-4 rounded-md flex-1 flex gap-4">
                            <div className="w-1/3">
                                <img src="https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="" width={144} height={144} className="w-36 h-36 rounded-full object-cover" />
                            </div>
                            <div className="w-2/3 flex flex-col justify-between gap-4">
                                <h1 className="text-xl font-semibold">John Doe</h1>
                                <p className="text-sm text-gray-500">Blah blah blah blha lbhalljldffldj</p>
                                <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                    <div className="w-full md:w-1/3 flex lg:w-full items-center gap-2">
                                        <img src="/blood.png" alt="" width={14} height={14}/>
                                        <span>A+</span>
                                    </div>
                                    <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                                        <img src="/date.png" alt="" width={14} height={14}/>
                                        <span>January 2025</span>
                                    </div>
                                    <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                                        <img src="/mail.png" alt="" width={14} height={14}/>
                                        <span>john@gmail.com</span>
                                    </div>
                                    <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                                        <img src="/phone.png" alt="" width={14} height={14}/>
                                        <span>126565651</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* SMALL CARD */}
                        <div className="flex-1"></div>
                    </div>
                    {/* BOTTOM */}
                    <div className="w-full md:w-1/3 flex items-center gap-2">Schedule</div>
                </div>
                {/* RIGHT */}
                <div className="w-full xl:w-1/3">
                    calender
                </div>
            </div>
        </Layout>
        
    );
}