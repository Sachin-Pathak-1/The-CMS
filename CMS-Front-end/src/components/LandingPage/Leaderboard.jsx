import React from 'react';
import { TrophyIcon } from './LandingIcons';

const Leaderboard = ({ isDarkMode, iconColor }) => {
    return (
        <div className={`p-4 rounded-2xl border flex flex-col
                 ${isDarkMode ? 'bg-[#161316]/40 border-white/10' : 'bg-white/60 border-slate-100'}`}>
            <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-500"><TrophyIcon /></span>
                <span className={`text-xs font-bold uppercase ${iconColor}`}>Top Learners</span>
            </div>
            <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center text-xs">
                        <span className={isDarkMode ? 'text-white/80' : 'text-slate-600'}>{i}. Student {String.fromCharCode(64 + i)}</span>
                        <span className={`font-mono ${isDarkMode ? 'text-[#54A388]' : 'text-indigo-600'}`}>{1000 - (i * 50)} XP</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
