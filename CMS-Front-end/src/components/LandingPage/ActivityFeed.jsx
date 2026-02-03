import React from 'react';
import { BellIcon } from './LandingIcons';

const ActivityFeed = ({ isDarkMode, iconColor }) => {
    return (
        <div className={`p-4 rounded-2xl border flex flex-col justify-center space-y-2
                ${isDarkMode ? 'bg-[#161316]/40 border-white/10' : 'bg-white/60 border-slate-100'}`}>
            <div className="flex items-center gap-2 mb-1">
                <span className={`${iconColor} opacity-70`}><BellIcon /></span>
                <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-white/50' : 'text-slate-400'}`}>Activity</span>
            </div>
            <div className={`text-xs truncate ${isDarkMode ? 'text-white/80' : 'text-slate-600'}`}>
                <span className="font-bold">Sarah</span> submitted <span className="italic">Math Quiz</span>
            </div>
            <div className={`text-xs truncate ${isDarkMode ? 'text-white/60' : 'text-slate-400'}`}>
                <span className="font-bold">Alex</span> reached Lvl 5
            </div>
        </div>
    );
};

export default ActivityFeed;
