import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CoinIcon, DashboardIcon, LockIcon, MenuIcon, MoonIcon, SunIcon, XIcon } from './LandingIcons';

const defaultSections = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
];

const LandingNavbar = ({
  isDarkMode,
  handleDarkModeToggle,
  isDarkModeUnlocked,
  coins,
  animatingCoins,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  sections = defaultSections,
}) => {
  const location = useLocation();

  const shellClass = isDarkMode
    ? 'border-white/10 bg-[#08131d]/70 text-white'
    : 'border-white/70 bg-white/75 text-slate-950';
  const mutedClass = isDarkMode ? 'text-white/70' : 'text-slate-600';
  const buttonClass = isDarkMode
    ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
    : 'border-slate-200 bg-white/80 text-slate-950 hover:bg-white';

  const renderNavLink = (item) => {
    const isHash = item.href.startsWith('#');
    const isActive = !isHash && location.pathname === item.href;

    if (isHash) {
      return (
        <a
          key={item.label}
          href={item.href}
          className={`text-sm font-medium transition ${mutedClass} hover:text-inherit`}
        >
          {item.label}
        </a>
      );
    }

    return (
      <Link
        key={item.label}
        to={item.href}
        className={`text-sm font-medium transition hover:text-inherit ${
          isActive ? 'text-inherit' : mutedClass
        }`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 px-5 pb-3 pt-5 sm:px-6 lg:px-8">
      <div className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border px-4 py-3 shadow-lg backdrop-blur-xl sm:px-5 ${shellClass}`}>
        <Link to="/" className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold ${isDarkMode ? 'bg-emerald-300 text-slate-950' : 'bg-slate-950 text-white'}`}>
            BB
          </div>
          <div>
            <div className="font-['Space_Grotesk'] text-lg font-bold tracking-tight">BBrains</div>
            <div className={`text-[11px] uppercase tracking-[0.24em] ${mutedClass}`}>Campus OS</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {sections.map(renderNavLink)}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${buttonClass}`}
            style={animatingCoins ? { transform: 'scale(1.04)' } : undefined}
          >
            <CoinIcon size={18} />
            <span className="font-semibold">{coins}</span>
          </div>

          <button
            onClick={handleDarkModeToggle}
            className={`relative inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${buttonClass} ${!isDarkModeUnlocked ? 'opacity-80' : ''}`}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
            {!isDarkModeUnlocked && (
              <span className="absolute -right-0.5 -top-0.5 rounded-full bg-rose-500 p-0.5 text-white">
                <LockIcon />
              </span>
            )}
          </button>

          <Link
            to="/login"
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              isDarkMode
                ? 'bg-emerald-300 text-slate-950 hover:bg-emerald-200'
                : 'bg-slate-950 text-white hover:bg-slate-800'
            }`}
          >
            <DashboardIcon size={18} />
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <div className={`flex items-center gap-1 rounded-full border px-3 py-2 text-xs ${buttonClass}`}>
            <CoinIcon size={14} />
            <span className="font-semibold">{coins}</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${buttonClass}`}
            aria-label="Open navigation"
          >
            {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={`mx-auto mt-3 flex w-full max-w-7xl flex-col gap-3 rounded-[28px] border p-4 shadow-lg backdrop-blur-xl sm:hidden ${shellClass}`}>
          <div className="flex flex-col gap-2">
            {sections.map((item) =>
              item.href.startsWith('#') ? (
                <a
                  key={item.label}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium ${buttonClass}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium ${buttonClass}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                handleDarkModeToggle();
                setIsMobileMenuOpen(false);
              }}
              className={`relative rounded-2xl border px-4 py-3 text-sm font-semibold transition ${buttonClass}`}
            >
              {isDarkMode ? 'Light mode' : 'Dark mode'}
              {!isDarkModeUnlocked && (
                <span className="absolute right-3 top-2 rounded-full bg-rose-500 p-0.5 text-white">
                  <LockIcon />
                </span>
              )}
            </button>
            <Link
              to="/login"
              className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                isDarkMode
                  ? 'bg-emerald-300 text-slate-950 hover:bg-emerald-200'
                  : 'bg-slate-950 text-white hover:bg-slate-800'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
