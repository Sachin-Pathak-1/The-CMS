import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUpIcon, ShoppingBagIcon, WalletIcon, CalendarIcon, BookIcon, UsersIcon, ChartIcon, BellIcon, ShieldIcon, ArrowRightIcon } from '../../components/LandingPage/LandingIcons';
import LandingNavbar from '../../components/LandingPage/LandingNavbar';
import LandingFooter from '../../components/LandingPage/LandingFooter';
import FeatureDetailModal from '../../components/LandingPage/FeatureDetailModal';
import ToastNotification from '../../components/LandingPage/ToastNotification';
import AmbientGlow from '../../components/LandingPage/AmbientGlow';
import { useTheme } from '../../contexts/ThemeContext';

// Special Elite font style constant
const specialEliteFont = { fontFamily: '"Special Elite", cursive' };

// Constants for economy
const DARK_MODE_PRICE = 100;
const DAILY_POINTS = 50;

const FeaturesPage = () => {
    // Use ThemeContext for shared state
    const {
        isDarkMode,
        setIsDarkMode,
        isDarkModeUnlocked,
        coins,
        setCoins,
        dailyClaimed,
        setDailyClaimed
    } = useTheme();

    // Local state for this page only
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // All Features Data
    const allFeatures = [
        {
            id: 1,
            title: "Leveling System",
            icon: <TrendingUpIcon />,
            shortDesc: "Earn XP via academics.",
            fullDesc: "Students earn Experience Points (XP) for every assignment submitted, grade achieved, and attendance milestone. Level up to unlock campus privileges."
        },
        {
            id: 2,
            title: "Marketplace",
            icon: <ShoppingBagIcon />,
            shortDesc: "Spend currency on perks.",
            fullDesc: "A fully simulated economy. Use your earned 'LearnCoins' to buy hall passes, library overdue waivers, or custom profile cosmetics."
        },
        {
            id: 3,
            title: "Digital Wallet",
            icon: <WalletIcon />,
            shortDesc: "Secure transaction tracking.",
            fullDesc: "Real-time ledger tracking. Experience the flow of money, understand savings, and learn financial responsibility in a safe environment."
        },
        {
            id: 4,
            title: "Course Scheduling",
            icon: <CalendarIcon />,
            shortDesc: "Easily create and manage academic schedules for all departments.",
            fullDesc: "Streamline course planning with an intuitive scheduling system. Manage class times, room assignments, and instructor availability all in one place."
        },
        {
            id: 5,
            title: "Gradebook",
            icon: <BookIcon />,
            shortDesc: "A centralized and transparent system for tracking student performance.",
            fullDesc: "Comprehensive grade tracking with detailed analytics. Monitor student progress, identify trends, and provide timely feedback to support academic success."
        },
        {
            id: 6,
            title: "Attendance Tracking",
            icon: <UsersIcon />,
            shortDesc: "Simplify attendance monitoring with real-time updates and alerts.",
            fullDesc: "Automated attendance system with instant notifications. Track patterns, generate reports, and ensure accountability across all classes."
        },
        {
            id: 7,
            title: "Parent Communication",
            icon: <BellIcon />,
            shortDesc: "Foster a strong school-home connection with seamless communication tools.",
            fullDesc: "Bridge the gap between school and home with instant messaging, progress reports, and event notifications to keep parents engaged."
        },
        {
            id: 8,
            title: "Financials Management",
            icon: <WalletIcon />,
            shortDesc: "Handle tuition, fees, and financial aid with our secure platform.",
            fullDesc: "Complete financial oversight with payment processing, scholarship management, and detailed financial reporting for transparency."
        },
        {
            id: 9,
            title: "Reporting & Analytics",
            icon: <ChartIcon />,
            shortDesc: "Gain valuable insights with comprehensive and customizable reports.",
            fullDesc: "Data-driven decision making with powerful analytics. Generate custom reports, visualize trends, and track key performance indicators."
        }
    ];

    const iconColor = isDarkMode ? 'text-white' : 'text-black';

    // --- Logic Handlers ---

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleDarkModeToggle = () => {
        if (!isDarkModeUnlocked) {
            showToast("You have to purchase it from the market.");
            return;
        }
        setIsDarkMode(!isDarkMode);
    };

    return (
        <>
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
          
          @keyframes floatUpDown {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
           
          @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
          }
          
          @keyframes slideIn {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes coinPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }

          /* General Slow Float for UI Elements */
          .float-slow {
             animation: floatUpDown 6s ease-in-out infinite;
          }
        `}
            </style>

            <div
                className={`relative min-h-screen w-full overflow-y-auto font-sans transition-colors duration-500 flex flex-col ${isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-slate-50 text-black'}`}
            >
                <ToastNotification message={toast} isDarkMode={isDarkMode} />

                {/* <AmbientGlow isDarkMode={isDarkMode} /> */}

                <LandingNavbar
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    handleDarkModeToggle={handleDarkModeToggle}
                    isDarkModeUnlocked={isDarkModeUnlocked}
                    coins={coins}
                    animatingCoins={false}
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                    specialEliteFont={specialEliteFont}
                    iconColor={iconColor}
                />

                <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 relative z-10">
                    {/* Back Button */}
                    <Link
                        to="/"
                        className={`inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg border transition-all hover:scale-105
                            ${isDarkMode
                                ? 'bg-[#161316]/60 border-white/20 text-white hover:bg-white/10'
                                : 'bg-white border-slate-200 text-black hover:border-indigo-500 hover:shadow-md'
                            }`}
                    >
                        <div className="rotate-180">
                            <ArrowRightIcon />
                        </div>
                        <span className="font-semibold">Back to Home</span>
                    </Link>

                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${iconColor}`} style={specialEliteFont}>
                            All Features
                        </h1>
                        <p className={`text-lg ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
                            Discover all the powerful features that make Bbrains the ultimate educational platform
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allFeatures.map((feature) => (
                            <div
                                key={feature.id}
                                onClick={() => setSelectedFeature(feature)}
                                className={`group p-6 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-md relative overflow-hidden min-h-[200px] flex flex-col justify-between hover:scale-105
                ${isDarkMode
                                        ? 'bg-[#161316]/60 border-white/20 hover:border-[#54A388] hover:shadow-lg hover:shadow-[#54A388]/20'
                                        : 'bg-white/80 border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-xl hover:shadow-indigo-500/20'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors mb-4
                  ${isDarkMode ? 'bg-[#43256E] text-white' : 'bg-indigo-50 text-black'}`}>
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className={`text-xl font-bold mb-2 ${iconColor}`} style={specialEliteFont}>{feature.title}</h3>
                                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/70' : 'text-slate-500'}`}>{feature.shortDesc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                <FeatureDetailModal
                    feature={selectedFeature}
                    onClose={() => setSelectedFeature(null)}
                    isDarkMode={isDarkMode}
                    iconColor={iconColor}
                    specialEliteFont={specialEliteFont}
                />

                <LandingFooter isDarkMode={isDarkMode} iconColor={iconColor} />

            </div>
        </>
    );
};

export default FeaturesPage;
