import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { apiRequest } from "../lib/apiClient";

export function AttendanceChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        let active = true;
        const loadSummary = async () => {
            try {
                const response = await apiRequest("/public/summary");
                if (!active) return;
                setData(Array.isArray(response?.data?.attendance) ? response.data.attendance : []);
            } catch {
                if (active) {
                    setData([]);
                }
            }
        };
        loadSummary();
        return () => {
            active = false;
        };
    }, []);

    return (

        <div className="glass-panel h-full p-5">
            {/* TITLE */}
            <div className="flex justify-between items-center">
                <h1 className='text-lg font-semibold text-slate-800'>Attendance</h1>
                <img src="/moreDark.png" alt="" width={20} height={20} className="opacity-60" />
            </div>
            {/* CHART */}
            <div className="w-full h-[90%] flex ">
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    barSize={18}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd'/>
                    <XAxis dataKey="name" axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false} />
                    <YAxis width="auto" axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false} />
                    <Tooltip />
                    <Legend align='left' verticalAlign='top' wrapperStyle={{paddingTop:'20px', paddingBottom:'40px'}} />
                    <Bar dataKey="absent" fill="#8884d8" radius={[10, 10, 0, 0]} legendType='circle' />
                    <Bar dataKey="present" fill="#82ca9d"  radius={[10, 10, 0, 0]} legendType='circle' />
                </BarChart>
            </div>
        </div>
    );
}
