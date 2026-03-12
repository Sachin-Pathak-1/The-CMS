import { useEffect, useMemo, useState } from "react";
import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';
import { apiRequest } from "../lib/apiClient";

export function CountChart() {
    const [boys, setBoys] = useState(0);
    const [girls, setGirls] = useState(0);

    useEffect(() => {
        let active = true;
        const loadSummary = async () => {
            try {
                const response = await apiRequest("/public/summary");
                if (!active) return;
                const nextBoys = response?.data?.sexCounts?.boys || 0;
                const nextGirls = response?.data?.sexCounts?.girls || 0;
                setBoys(nextBoys);
                setGirls(nextGirls);
            } catch {
                if (active) {
                    setBoys(0);
                    setGirls(0);
                }
            }
        };
        loadSummary();
        return () => {
            active = false;
        };
    }, []);

    const total = boys + girls;
    const data = useMemo(() => ([
        {
            name: 'Total',
            Count: total,
            fill: 'white',
        },
        {
            name: 'Girls',
            Count: girls,
            fill: '#8884d8',
        },
        {
            name: 'Boys',
            Count: boys,
            fill: '#83a6ed',
        },
    ]), [boys, girls, total]);

    const boysPct = total ? Math.round((boys / total) * 100) : 0;
    const girlsPct = total ? 100 - boysPct : 0;

    return (
        <div className="glass-panel w-full h-full p-5">
            {/* TITLE */}
            <div className="flex justify-between items-center">
                <h1 className='text-lg font-semibold text-slate-800'>Students</h1>
                <img src="/moreDark.png" alt="" width={20} height={20} className="opacity-60" />
            </div>
            {/* CHART */}
            <div className="relative w-full h-[72%] flex ">
                <RadialBarChart
                    style={{  aspectRatio: 1.618 }}
                    responsive
                    cx="33%"
                    innerRadius="25%"
                    outerRadius="100% "
                    barSize={36}
                    data={data}
                >
                    <RadialBar background dataKey="Count" />
                    <Tooltip />
                </RadialBarChart>
                <img src="maleFemale.png" alt="malefemale" width={40} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            {/* BOTTOM */}
            <div className="flex gap-16 justify-center">
                <div className="flex flex-col gap-1">
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                    <h1 className='font-bold'>{boys.toLocaleString()}</h1>
                    <h2 className='text-xs text-slate-500'>Boys ({boysPct}%)</h2>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="w-4 h-4 bg-purple-500 rounded-full" />
                    <h1 className='font-bold'>{girls.toLocaleString()}</h1>
                    <h2 className='text-xs text-slate-500'>Girls ({girlsPct}%)</h2>
                </div>
            </div>
        </div>
    );
};
