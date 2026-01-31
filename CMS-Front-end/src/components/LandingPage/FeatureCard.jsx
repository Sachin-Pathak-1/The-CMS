import React from 'react';
import { ArrowRightIcon } from './LandingIcons';

const FeatureCard = ({ feature, isDarkMode, iconColor, specialEliteFont, onClick }) => {
    // Render "Many More" card if feature is null or special type
    if (!feature) {
        return (
            <a href="/features" className={`group p-3 sm:p-4 rounded-xl border border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer
                 ${isDarkMode
                    ? 'border-white/30 hover:bg-[#43256E]/20 hover:border-white'
                    : 'border-slate-300 hover:bg-indigo-50/50 hover:border-indigo-500'}`}>
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 transition-colors
                   ${isDarkMode ? 'bg-[#43256E] text-white' : 'bg-slate-100 text-black'}`}>
                    <ArrowRightIcon />
                </div>
                <span className={`font-bold text-xs sm:text-sm ${iconColor}`} style={specialEliteFont}>And Many More...</span>
            </a>
        )
    }

    return (
        <div
            onClick={onClick}
            className={`group p-5 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-md relative overflow-hidden min-h-[160px] flex flex-col justify-between
            ${isDarkMode
                    ? 'bg-[#161316]/60 border-white/20 hover:border-[#54A388]'
                    : 'bg-white/80 border-slate-200 hover:border-indigo-500 shadow-sm'
                }`}
        >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                ${isDarkMode ? 'bg-[#43256E] text-white' : 'bg-indigo-50 text-black'}`}>
                {feature.icon}
            </div>
            <div>
                <h3 className={`text-lg font-bold mb-1 ${iconColor}`} style={specialEliteFont}>{feature.title}</h3>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-white/70' : 'text-slate-500'}`}>{feature.shortDesc}</p>
            </div>
        </div>
    );
};

export default FeatureCard;
