import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { apiRequest } from "../lib/apiClient";

export function FinanceChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        let active = true;
        const loadSummary = async () => {
            try {
                const response = await apiRequest("/public/summary");
                if (!active) return;
                setData(Array.isArray(response?.data?.finance) ? response.data.finance : []);
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
        <div className="bg-white rounded-xl h-full p-4">
            {/* TITLE */}
            <div className="flex justify-between items-center">
                <h1 className='font-semibold text-lg'>Finance</h1>
                <img src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            {/* FINANCE CHART */}
            <div className="w-full h-[90%] flex justify-center items-center text-gray-400">
                <LineChart
                style={{ width: '100%', height: '100%', maxHeight: '80vh', aspectRatio: 1.618 }}
                responsive
                data={data}
                >
                <CartesianGrid strokeDasharray="3 3" stroke='#ddd'/>
                <XAxis dataKey="name" axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
                <YAxis width="auto" axisLine={false} tick={{fill:"#d1d5db"}} tickLine={false}/>
                <Tooltip />
                <Legend align='center' verticalAlign='top' wrapperStyle={{paddingTop:'0px', paddingBottom:'30px'}} />
                <Line type="monotone" dataKey="income" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="expence" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
            </div>
        </div>
    );
}
