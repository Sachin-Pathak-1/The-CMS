import React from 'react';
import { ClockIcon } from './LandingIcons';

const UpcomingDeadline = ({ isDarkMode }) => {
    return (
        <div className={`col-span-2 p-3 rounded-xl border flex items-center justify-between
                 ${isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-100'}`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}>
                    <ClockIcon />
                </div>
                <div>
                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Physics Final</h4>
                    <p className={`text-[10px] ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>Due in 2 hours</p>
                </div>
            </div>
            <div className={`text-xs font-bold px-2 py-1 rounded border ${isDarkMode ? 'border-red-500/50 text-red-400' : 'border-red-200 text-red-600'}`}>
                High Priority
            </div>
        </div>
    );
};

export default UpcomingDeadline;
