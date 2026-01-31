import React from 'react';
import { CoinIcon } from './LandingIcons';

const HeroSection = ({ isDarkMode, iconColor, specialEliteFont, onContactClick }) => {
    return (
        <div className="lg:col-span-5 flex flex-col justify-center lg:pb-40 space-y-6">
            <div className="space-y-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
                 ${isDarkMode ? 'bg-[#43256E]/30 border-[#54A388] text-[#54A388]' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
                    Digital Economy for Education
                </div>

                <h1 className={`text-6xl lg:text-7xl leading-[1] ${iconColor}`} style={specialEliteFont}>
                    Learn. Earn.<br />
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r
                  ${isDarkMode ? 'from-[#C1B2FF] to-[#54A388]' : 'from-indigo-600 to-blue-500'}`}>
                        Evolve.
                    </span>
                </h1>

                <p className={`text-lg leading-relaxed max-w-md ${isDarkMode ? 'text-white/80' : 'text-slate-500'}`}>
                    The first LMS that simulates a real digital economy. Turn grades into currency, master financial literacy.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                    onClick={onContactClick}
                    className={`px-8 py-3 rounded-xl font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all
                  ${isDarkMode
                            ? 'bg-[#54A388] text-[#161316] shadow-[#54A388]/20 hover:bg-[#488e76]'
                            : 'bg-indigo-600 text-white shadow-indigo-500/30 hover:bg-indigo-700'}`}
                >
                    Contact Us
                </button>
                <button className={`px-8 py-3 border rounded-xl font-bold text-lg transition-all
                 ${isDarkMode
                        ? 'border-white/30 text-white hover:bg-white/10'
                        : 'bg-white border-slate-200 text-black hover:bg-slate-50'}`}>
                    View Demo
                </button>
            </div>

            {/* Stats Section */}
            <div className={`pt-6 flex items-center gap-8 border-t w-full ${isDarkMode ? 'border-white/20' : 'border-slate-200/60'}`}>
                <div className="flex flex-col">
                    <span className={`text-3xl font-black ${iconColor}`}>12k+</span>
                    <span className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-[#54A388]' : 'text-slate-500'}`}>Active Students</span>
                </div>
                <div className={`w-px h-10 ${isDarkMode ? 'bg-white/20' : 'bg-slate-200'}`}></div>
                <div className="flex flex-col">
                    <span className={`text-3xl font-black ${iconColor}`}>45+</span>
                    <span className={`text-xs font-bold uppercase tracking-wide ${isDarkMode ? 'text-[#54A388]' : 'text-slate-500'}`}>Partner Colleges</span>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
