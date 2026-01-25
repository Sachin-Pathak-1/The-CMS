import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// #region Sample data
const data = [
    {
        name: 'Mon',
        present: 90,
        absent: 40,
    },
    {
        name: 'Tue',
        present: 86,
        absent: 32,
    },
    {
        name: 'Wed',
        present: 56,
        absent: 82,
    },
    {
        name: 'Thu',
        present: 83,
        absent: 66,
    },
    {
        name: 'Fri',
        present: 80,
        absent: 43,
    },
];

export function AttendanceChart() {
    return (

        <div className="bg-white rounded-xl h-full p-4">
            {/* TITLE */}
            <div className="flex justify-between items-center">
                <h1 className='font-semibold text-lg'>Attendance</h1>
                <img src="/moreDark.png" alt="" width={20} height={20} />
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