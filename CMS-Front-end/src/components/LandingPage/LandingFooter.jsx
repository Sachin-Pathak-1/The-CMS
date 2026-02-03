import React from 'react';

const LandingFooter = ({ isDarkMode, iconColor }) => {
    return (
        <footer className={`flex-none w-full py-4 text-center text-xs backdrop-blur-sm z-10
            ${isDarkMode ? 'border-t border-white/10 text-white/40' : 'border-t border-slate-200 text-slate-400'}`}>
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p>&copy; {new Date().getFullYear()} Bbrains. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Terms of Service</a>
                    <a href="#" className="hover:underline">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default LandingFooter;
