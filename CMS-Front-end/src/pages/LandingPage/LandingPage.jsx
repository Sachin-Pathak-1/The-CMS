import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  ChartIcon,
  CoinIcon,
  GlobeIcon,
  GraduationIcon,
  ShieldIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from '../../components/LandingPage/LandingIcons';
import LandingNavbar from '../../components/LandingPage/LandingNavbar';
import ContactModal from '../../components/LandingPage/ContactModal';
import FeatureDetailModal from '../../components/LandingPage/FeatureDetailModal';
import ToastNotification from '../../components/LandingPage/ToastNotification';
import LandingFooter from '../../components/LandingPage/LandingFooter';
import { useTheme } from '../../contexts/ThemeContext';

const DARK_MODE_PRICE = 100;
const DAILY_POINTS = 50;

const LandingPage = () => {
  const {
    isDarkMode,
    setIsDarkMode,
    isDarkModeUnlocked,
    setIsDarkModeUnlocked,
    coins,
    setCoins,
    dailyClaimed,
    setDailyClaimed,
  } = useTheme();

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [animatingCoins, setAnimatingCoins] = useState(false);

  const features = [
    {
      id: 1,
      title: 'Academic XP Engine',
      icon: <TrendingUpIcon />,
      shortDesc: 'Turn attendance, grades, and submissions into visible momentum.',
      fullDesc:
        'Every academic action contributes to measurable progress. Students earn XP from the work they already do, which keeps motivation high without adding administrative overhead.',
    },
    {
      id: 2,
      title: 'Student Wallet & Rewards',
      icon: <WalletIcon />,
      shortDesc: 'Give learners a safe way to understand value, saving, and incentives.',
      fullDesc:
        'Track balance, spending, and rewards in one place. The wallet gives institutions a controlled sandbox for digital-economy concepts and behavioral reinforcement.',
    },
    {
      id: 3,
      title: 'Campus Marketplace',
      icon: <ShoppingBagIcon />,
      shortDesc: 'Redeem earned value for perks, recognition, and custom rewards.',
      fullDesc:
        'Create a marketplace that makes progress tangible. Offer institution-specific rewards, access perks, or cosmetic unlocks that encourage participation.',
    },
    {
      id: 4,
      title: 'Live Performance Insights',
      icon: <ChartIcon />,
      shortDesc: 'See trends early with a cleaner view of engagement and outcomes.',
      fullDesc:
        'Administrators and educators get a shared, live layer of visibility across attendance, coursework, progress, and participation patterns.',
    },
    {
      id: 5,
      title: 'Connected Communication',
      icon: <BellIcon />,
      shortDesc: 'Keep students, faculty, and families aligned without message sprawl.',
      fullDesc:
        'Announcements, updates, and actionable reminders are surfaced in context, reducing missed deadlines and fragmented communication.',
    },
    {
      id: 6,
      title: 'Institution-Grade Controls',
      icon: <ShieldIcon />,
      shortDesc: 'Run the experience with clearer roles, permissions, and auditability.',
      fullDesc:
        'Built for real academic operations, with permissioned access patterns, role separation, and a structure that scales across departments.',
    },
  ];

  const workflow = [
    {
      title: 'Capture',
      copy: 'Attendance, assignments, grades, and classroom actions flow into one operational layer.',
      icon: <CalendarIcon />,
    },
    {
      title: 'Motivate',
      copy: 'Students see progress instantly through XP, rewards, and clear accountability loops.',
      icon: <CoinIcon size={28} />,
    },
    {
      title: 'Improve',
      copy: 'Faculty and admins act on live insight instead of waiting for end-of-term surprises.',
      icon: <ChartIcon />,
    },
  ];

  const outcomes = [
    { value: '92%', label: 'weekly student activity visibility' },
    { value: '3x', label: 'stronger engagement loops across courses' },
    { value: '1 hub', label: 'for academic ops, communication, and rewards' },
  ];

  const sections = [
    { label: 'Overview', href: '#overview' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'Outcomes', href: '#outcomes' },
    { label: 'Features', href: '/features' },
  ];

  const surface = isDarkMode
    ? 'bg-white/[0.06] border-white/10 text-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]'
    : 'bg-white/85 border-slate-200/80 text-slate-950 shadow-[0_30px_80px_rgba(15,23,42,0.10)]';
  const muted = isDarkMode ? 'text-white/68' : 'text-slate-600';
  const accentText = isDarkMode ? 'text-emerald-300' : 'text-cyan-700';
  const accentBg = isDarkMode ? 'bg-emerald-400/15 border-emerald-300/20' : 'bg-cyan-50 border-cyan-200';

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const animateCoins = (targetCoins) => {
    setAnimatingCoins(true);
    const startCoins = coins;
    const diff = targetCoins - startCoins;
    const duration = 900;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCoins(Math.round(startCoins + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatingCoins(false);
      }
    };

    requestAnimationFrame(animate);
  };

  const claimDailyPoints = () => {
    if (dailyClaimed) {
      showToast('Daily reward already claimed today.');
      return;
    }

    animateCoins(coins + DAILY_POINTS);
    setDailyClaimed(true);
    showToast('Daily reward claimed. +50 coins');
  };

  const handleDarkModeToggle = () => {
    if (!isDarkModeUnlocked) {
      showToast('Unlock premium mode from the reward panel first.');
      return;
    }

    setIsDarkMode(!isDarkMode);
  };

  const purchaseDarkMode = () => {
    if (isDarkModeUnlocked) {
      showToast('Premium mode is already unlocked.');
      return;
    }

    if (coins < DARK_MODE_PRICE) {
      showToast('Not enough coins yet. Claim your daily reward first.');
      return;
    }

    animateCoins(coins - DARK_MODE_PRICE);
    setTimeout(() => {
      setIsDarkModeUnlocked(true);
      setIsDarkMode(true);
      showToast('Premium mode unlocked.');
    }, 450);
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap');

          @keyframes slideIn {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }

          @keyframes heroFloat {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(0, -10px, 0); }
          }

          .landing-display {
            font-family: "Space Grotesk", sans-serif;
          }

          .landing-copy {
            font-family: "Manrope", sans-serif;
          }
        `}
      </style>

      <div
        className={`landing-copy min-h-screen transition-colors duration-500 ${
          isDarkMode ? 'bg-[#07111a] text-white' : 'bg-[#f6f8fb] text-slate-950'
        }`}
      >
        <ToastNotification message={toast} isDarkMode={isDarkMode} />

        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div
            className={`absolute inset-0 ${
              isDarkMode
                ? 'bg-[radial-gradient(circle_at_top_left,_rgba(24,211,167,0.16),_transparent_28%),radial-gradient(circle_at_85%_18%,_rgba(76,122,255,0.18),_transparent_24%),linear-gradient(180deg,_#07111a_0%,_#081723_45%,_#0b1420_100%)]'
                : 'bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_26%),radial-gradient(circle_at_82%_14%,_rgba(12,74,110,0.10),_transparent_20%),linear-gradient(180deg,_#fcfdff_0%,_#f2f6fb_52%,_#edf3f8_100%)]'
            }`}
          />
          <div
            className={`absolute left-[8%] top-40 h-56 w-56 rounded-full blur-3xl ${
              isDarkMode ? 'bg-emerald-400/10' : 'bg-cyan-200/45'
            }`}
          />
          <div
            className={`absolute bottom-16 right-[10%] h-64 w-64 rounded-full blur-3xl ${
              isDarkMode ? 'bg-blue-500/10' : 'bg-sky-200/50'
            }`}
          />
        </div>

        <LandingNavbar
          isDarkMode={isDarkMode}
          handleDarkModeToggle={handleDarkModeToggle}
          isDarkModeUnlocked={isDarkModeUnlocked}
          coins={coins}
          animatingCoins={animatingCoins}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          sections={sections}
        />

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 pb-16 pt-4 sm:px-6 lg:px-8">
          <section
            id="overview"
            className="grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <div className={`relative overflow-hidden rounded-[36px] border p-8 sm:p-10 ${surface}`}>
              <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.04))]" />
              <div className="relative z-10 max-w-2xl">
                <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] ${accentBg} ${accentText}`}>
                  <GlobeIcon />
                  Modern campus operations
                </div>

                <h1 className="landing-display max-w-3xl text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl">
                  A campus system that feels built for this decade.
                </h1>

                <p className={`mt-6 max-w-xl text-base leading-8 sm:text-lg ${muted}`}>
                  BBrains combines academic operations, student engagement, communication, and reward mechanics into one product. It looks sharper, reads faster, and gives institutions a more convincing digital experience.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/login"
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                      isDarkMode
                        ? 'bg-emerald-300 text-slate-950 hover:bg-emerald-200'
                        : 'bg-slate-950 text-white hover:bg-slate-800'
                    }`}
                  >
                    Enter dashboard
                    <ArrowRightIcon />
                  </Link>
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition ${
                      isDarkMode
                        ? 'border-white/15 bg-white/5 text-white hover:bg-white/10'
                        : 'border-slate-200 bg-white/80 text-slate-900 hover:bg-white'
                    }`}
                  >
                    Book a walkthrough
                  </button>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {outcomes.map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-3xl border p-4 ${
                        isDarkMode ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white/72'
                      }`}
                    >
                      <div className="landing-display text-2xl font-bold">{item.value}</div>
                      <div className={`mt-1 text-sm leading-6 ${muted}`}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div
                className={`relative overflow-hidden rounded-[36px] border p-6 sm:p-7 ${surface}`}
                style={{ animation: 'heroFloat 8s ease-in-out infinite' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentText}`}>Live command layer</p>
                    <h2 className="landing-display mt-2 text-2xl font-bold">Institution snapshot</h2>
                  </div>
                  <div className={`rounded-full border px-3 py-1 text-xs font-semibold ${accentBg} ${accentText}`}>
                    Real-time
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className={`rounded-[28px] border p-5 ${isDarkMode ? 'border-white/10 bg-[#0d1c27]' : 'border-slate-200 bg-slate-950 text-white'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/65">Engagement score</p>
                        <p className="landing-display mt-2 text-4xl font-bold">84.6</p>
                      </div>
                      <div className="rounded-2xl bg-emerald-400/15 p-3 text-emerald-300">
                        <TrendingUpIcon />
                      </div>
                    </div>
                    <div className="mt-5 h-2 rounded-full bg-white/10">
                      <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-emerald-300 to-cyan-300" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className={`rounded-[28px] border p-5 ${isDarkMode ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white/82'}`}>
                      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${accentBg} ${accentText}`}>
                        <GraduationIcon />
                      </div>
                      <p className="landing-display text-3xl font-bold">12.4k</p>
                      <p className={`mt-1 text-sm ${muted}`}>active learners tracked across courses</p>
                    </div>
                    <div className={`rounded-[28px] border p-5 ${isDarkMode ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white/82'}`}>
                      <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${accentBg} ${accentText}`}>
                        <UsersIcon />
                      </div>
                      <p className="landing-display text-3xl font-bold">47</p>
                      <p className={`mt-1 text-sm ${muted}`}>departments aligned in one workflow</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-[36px] border p-6 sm:p-7 ${surface}`}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentText}`}>Why it lands better</p>
                    <h3 className="landing-display mt-2 text-2xl font-bold">A clearer experience for every role</h3>
                  </div>
                  <Link
                    to="/features"
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      isDarkMode
                        ? 'border-white/15 bg-white/5 hover:bg-white/10'
                        : 'border-slate-200 bg-white/80 hover:bg-white'
                    }`}
                  >
                    Explore all features
                    <ArrowRightIcon />
                  </Link>
                </div>
                <div className="mt-5 grid gap-3">
                  {[
                    'Sharper information hierarchy with less visual clutter',
                    'Reward mechanics that reinforce participation instead of distracting from learning',
                    'A more credible brand presentation for institutions and partners',
                  ].map((item) => (
                    <div
                      key={item}
                      className={`rounded-2xl border px-4 py-3 text-sm ${isDarkMode ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white/72'}`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            className={`rounded-[36px] border p-6 sm:p-8 ${surface}`}
          >
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="max-w-lg">
                <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentText}`}>Product pillars</p>
                <h2 className="landing-display mt-3 text-3xl font-bold sm:text-4xl">
                  Built around operation, engagement, and trust.
                </h2>
                <p className={`mt-4 text-base leading-8 ${muted}`}>
                  The redesign centers the product around what decision-makers care about first: operational clarity, measurable outcomes, and a differentiated student experience.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setSelectedFeature(feature)}
                    className={`rounded-[28px] border p-5 text-left transition duration-200 hover:-translate-y-1 ${
                      isDarkMode
                        ? 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
                        : 'border-slate-200 bg-white/82 hover:bg-white'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentBg} ${accentText}`}>
                      {feature.icon}
                    </div>
                    <h3 className="landing-display mt-5 text-xl font-bold">{feature.title}</h3>
                    <p className={`mt-3 text-sm leading-7 ${muted}`}>{feature.shortDesc}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section
            id="workflow"
            className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"
          >
            <div className={`rounded-[36px] border p-6 sm:p-8 ${surface}`}>
              <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentText}`}>Interactive layer</p>
              <h2 className="landing-display mt-3 text-3xl font-bold">A reward system that actually demonstrates the concept.</h2>
              <p className={`mt-4 max-w-lg text-base leading-8 ${muted}`}>
                The gamified economy is more useful when it is presented as part of the product story, not as scattered cards. These controls keep the idea visible and intentional.
              </p>

              <div className="mt-6 grid gap-4">
                <div className={`rounded-[28px] border p-5 ${isDarkMode ? 'border-white/10 bg-[#0d1c27]' : 'border-slate-200 bg-white/85'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${muted}`}>Student wallet balance</p>
                      <p className="landing-display mt-2 text-4xl font-bold">{coins}</p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentBg} ${accentText}`}>
                      <CoinIcon size={26} />
                    </div>
                  </div>
                  <div className={`mt-4 text-sm ${muted}`}>
                    Claim rewards and unlock premium presentation states to simulate marketplace incentives.
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <button
                    onClick={claimDailyPoints}
                    className={`rounded-[28px] border p-5 text-left transition ${
                      dailyClaimed
                        ? isDarkMode
                          ? 'border-white/10 bg-white/[0.03] text-white/60'
                          : 'border-slate-200 bg-slate-100 text-slate-500'
                        : isDarkMode
                          ? 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
                          : 'border-slate-200 bg-white/82 hover:bg-white'
                    }`}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.22em]">Daily reward</p>
                    <p className="landing-display mt-3 text-2xl font-bold">+{DAILY_POINTS}</p>
                    <p className="mt-2 text-sm leading-6">
                      {dailyClaimed ? 'Already claimed for today.' : 'Tap once to simulate a recurring incentive.'}
                    </p>
                  </button>

                  <button
                    onClick={purchaseDarkMode}
                    className={`rounded-[28px] border p-5 text-left transition ${
                      isDarkModeUnlocked
                        ? isDarkMode
                          ? 'border-emerald-300/30 bg-emerald-400/10'
                          : 'border-cyan-200 bg-cyan-50'
                        : isDarkMode
                          ? 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
                          : 'border-slate-200 bg-white/82 hover:bg-white'
                    }`}
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.22em]">Premium mode</p>
                    <p className="landing-display mt-3 text-2xl font-bold">
                      {isDarkModeUnlocked ? 'Unlocked' : `${DARK_MODE_PRICE} coins`}
                    </p>
                    <p className="mt-2 text-sm leading-6">
                      {isDarkModeUnlocked ? 'Dark presentation is now available in the navbar toggle.' : 'Purchase the premium visual mode to unlock the full theme switch.'}
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <div className={`rounded-[36px] border p-6 sm:p-8 ${surface}`}>
              <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentText}`}>Workflow</p>
              <h2 className="landing-display mt-3 text-3xl font-bold sm:text-4xl">
                One flow from academic data to student action.
              </h2>
              <div className="mt-8 grid gap-4">
                {workflow.map((item, index) => (
                  <div
                    key={item.title}
                    className={`grid gap-4 rounded-[30px] border p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center ${
                      isDarkMode ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white/80'
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentBg} ${accentText}`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className={`text-xs font-semibold uppercase tracking-[0.24em] ${muted}`}>
                        Step {index + 1}
                      </div>
                      <h3 className="landing-display mt-1 text-xl font-bold">{item.title}</h3>
                      <p className={`mt-2 text-sm leading-7 ${muted}`}>{item.copy}</p>
                    </div>
                    <div className={`hidden text-sm font-semibold sm:block ${accentText}`}>
                      0{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            id="outcomes"
            className={`rounded-[36px] border p-6 sm:p-8 ${surface}`}
          >
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentText}`}>Why institutions care</p>
                <h2 className="landing-display mt-3 text-3xl font-bold sm:text-4xl">
                  Professional enough for leadership, intuitive enough for students.
                </h2>
                <p className={`mt-4 max-w-xl text-base leading-8 ${muted}`}>
                  The page now communicates the product more like a serious education platform and less like a collection of demo widgets. That improves credibility before a visitor ever reaches the dashboard.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: 'For admins',
                    copy: 'See operations, performance, and engagement without hopping across fragmented tools.',
                  },
                  {
                    title: 'For faculty',
                    copy: 'Reduce friction in daily course management and give learners more visible feedback loops.',
                  },
                  {
                    title: 'For students',
                    copy: 'Understand progress faster, stay motivated, and interact with a product that feels current.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className={`rounded-[28px] border p-5 ${isDarkMode ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-white/80'}`}
                  >
                    <h3 className="landing-display text-xl font-bold">{item.title}</h3>
                    <p className={`mt-3 text-sm leading-7 ${muted}`}>{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            className={`overflow-hidden rounded-[36px] border p-8 sm:p-10 ${surface}`}
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className={`text-sm font-semibold uppercase tracking-[0.24em] ${accentText}`}>Next step</p>
                <h2 className="landing-display mt-3 max-w-3xl text-3xl font-bold sm:text-5xl">
                  If the dashboard is the product, the landing page should sell it with the same level of polish.
                </h2>
                <p className={`mt-4 max-w-2xl text-base leading-8 ${muted}`}>
                  This redesign gives the platform a more intentional first impression while staying inside your current React and Tailwind setup.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  to="/login"
                  className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                    isDarkMode
                      ? 'bg-emerald-300 text-slate-950 hover:bg-emerald-200'
                      : 'bg-slate-950 text-white hover:bg-slate-800'
                  }`}
                >
                  Launch dashboard
                </Link>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className={`inline-flex items-center justify-center rounded-full border px-6 py-3 text-sm font-semibold transition ${
                    isDarkMode
                      ? 'border-white/15 bg-white/5 text-white hover:bg-white/10'
                      : 'border-slate-200 bg-white/80 text-slate-900 hover:bg-white'
                  }`}
                >
                  Contact team
                </button>
              </div>
            </div>
          </section>
        </main>

        <FeatureDetailModal
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
          isDarkMode={isDarkMode}
          iconColor={isDarkMode ? 'text-white' : 'text-slate-950'}
          specialEliteFont={{ fontFamily: '"Space Grotesk", sans-serif' }}
        />

        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          isDarkMode={isDarkMode}
          iconColor={isDarkMode ? 'text-white' : 'text-slate-950'}
        />

        <LandingFooter isDarkMode={isDarkMode} />
      </div>
    </>
  );
};

export default LandingPage;
