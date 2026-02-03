import React from 'react';
import { GiftIcon, CoinIcon } from './LandingIcons';

const DailyRewardCard = ({ isDarkMode, iconColor, specialEliteFont, DAILY_POINTS, dailyClaimed, claimDailyPoints }) => {
    if (!dailyClaimed) {
        return (
            <div
                onClick={claimDailyPoints}
                className={`p-4 rounded-2xl border cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden group
                  ${isDarkMode ? 'bg-gradient-to-br from-[#54A388]/20 to-[#43256E]/20 border-[#54A388]/40' : 'bg-white border-indigo-100'}`}>
                <div className="flex justify-between items-start mb-2">
                    <span className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#54A388]/20 text-[#54A388]' : 'bg-indigo-50 text-indigo-600'}`}>
                        <GiftIcon />
                    </span>
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-[#54A388]' : 'text-indigo-600'}`}>+{DAILY_POINTS}</span>
                </div>
                <h4 className={`font-bold text-sm ${iconColor}`}>Daily Reward</h4>
                <p className={`text-[10px] ${isDarkMode ? 'text-white/60' : 'text-slate-400'}`}>Click to claim points!</p>
            </div>
        );
    }

    return (
        <div className={`p-4 rounded-2xl border flex items-center justify-center
                  ${isDarkMode ? 'bg-[#161316]/40 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
            <span className={`text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Claimed ✓</span>
        </div>
    );
};

export default DailyRewardCard;
