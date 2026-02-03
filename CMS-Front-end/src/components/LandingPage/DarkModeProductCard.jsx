import React from 'react';
import { MoonIcon, CoinIcon, LockIcon } from './LandingIcons';

const DarkModeProductCard = ({ isDarkMode, iconColor, specialEliteFont, DARK_MODE_PRICE, isDarkModeUnlocked, coins, purchaseDarkMode }) => {
    return (
        <div className={`row-span-2 p-5 rounded-2xl border flex flex-col justify-between relative overflow-hidden group
                ${isDarkMode ? 'bg-[#161316]/60 border-white/20' : 'bg-white/80 border-slate-200'}`}>
            <div className={`absolute top-0 right-0 p-3 opacity-10 ${iconColor}`}><MoonIcon /></div>

            <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl shadow-lg
                     ${isDarkMode ? 'bg-[#43256E] text-[#C1B2FF]' : 'bg-indigo-100 text-indigo-600'}`}>
                    🌙
                </div>
                <h3 className={`text-xl font-bold mb-1 ${iconColor}`} style={specialEliteFont}>Dark Mode</h3>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-white/70' : 'text-slate-500'}`}>
                    Unlock a premium dark theme for your entire experience.
                </p>
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-1 mb-3">
                    <span className={iconColor}><CoinIcon size={14} /></span>
                    <span className={`text-lg font-bold ${iconColor}`}>{DARK_MODE_PRICE}</span>
                </div>
                <button
                    onClick={purchaseDarkMode}
                    disabled={isDarkModeUnlocked || coins < DARK_MODE_PRICE}
                    className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all
                      ${isDarkModeUnlocked
                            ? 'bg-transparent border border-green-500 text-green-500 cursor-not-allowed'
                            : coins >= DARK_MODE_PRICE
                                ? 'bg-[#54A388] text-[#161316] hover:scale-[1.02] shadow-lg'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                    {isDarkModeUnlocked ? 'Already Bought' : 'Buy Now'}
                </button>
            </div>
        </div>
    );
};

export default DarkModeProductCard;
