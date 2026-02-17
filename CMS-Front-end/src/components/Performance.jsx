import { Pie, PieChart, ResponsiveContainer } from 'recharts';

// #region Sample data
const data = [
    { name: 'Group A', value: 92, fill: '#C3EBFA' },
    { name: 'Group B', value: 8, fill: '#FAE27C' },
];

export function Performance({ isAnimationActive = true }) {
    return (
        <div className='bg-white p-4 rounded-md h-80 relative'>
            <div className='flex items-center justify-between'>
                <h1 className='text-xl font-semibold'>Performance</h1>
                <img src="/moreDark.png" alt="" width={16} height={16} />
            </div>
            <ResponsiveContainer width="100%" height={"100%"}>
                <PieChart>
                    <Pie
                        dataKey="value"
                        // width={400}
                        // height={400}
                        startAngle={180}
                        endAngle={0}
                        data={data}
                        cx="50%"
                        cy="60%"
                        outerRadius="120%"
                        innerRadius={70}
                        fill="#8884d8"
                        isAnimationActive={isAnimationActive}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 tranform -translate-x-1/2 -translate-y-1/4 text-center">
                <h1 className='text-2xl font-bold'>9.2</h1>
                <p className='text-sm text-gray-300'>of 10 max LTS</p>
            </div>
            <h2 className="font-medium absolute bottom-5 left-0 right-0 m-auto text-center">1st Semester - 2nd Semester</h2>
        </div>
    );
}