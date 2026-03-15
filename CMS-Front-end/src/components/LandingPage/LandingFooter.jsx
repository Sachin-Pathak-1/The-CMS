import React from 'react';
import { Link } from 'react-router-dom';

const LandingFooter = ({ isDarkMode }) => {
  const shellClass = isDarkMode
    ? 'border-white/10 bg-white/[0.04] text-white'
    : 'border-slate-200 bg-white/78 text-slate-950';
  const mutedClass = isDarkMode ? 'text-white/65' : 'text-slate-600';

  return (
    <footer className="px-5 pb-8 pt-2 sm:px-6 lg:px-8">
      <div className={`mx-auto grid w-full max-w-7xl gap-8 rounded-[32px] border p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr] ${shellClass}`}>
        <div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight">BBrains</div>
          <p className={`mt-3 max-w-md text-sm leading-7 ${mutedClass}`}>
            A sharper campus management experience for academic operations, student engagement, and institutional credibility.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.24em]">Navigate</div>
          <div className={`mt-4 flex flex-col gap-3 text-sm ${mutedClass}`}>
            <Link to="/">Home</Link>
            <Link to="/features">Features</Link>
            <Link to="/login">Dashboard</Link>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.24em]">Sections</div>
          <div className={`mt-4 flex flex-col gap-3 text-sm ${mutedClass}`}>
            <a href="#overview">Overview</a>
            <a href="#workflow">Workflow</a>
            <a href="#outcomes">Outcomes</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
