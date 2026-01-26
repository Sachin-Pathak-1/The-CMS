import React, { useState } from 'react';
import { TrendingUpIcon, ShoppingBagIcon, WalletIcon } from '../../components/LandingPage/LandingIcons';
import LandingNavbar from '../../components/LandingPage/LandingNavbar';
import FloatingIconsLayer from '../../components/LandingPage/FloatingIconsLayer';
import HeroSection from '../../components/LandingPage/HeroSection';
import FeaturesGrid from '../../components/LandingPage/FeaturesGrid';
import ContactModal from '../../components/LandingPage/ContactModal';
import FeatureDetailModal from '../../components/LandingPage/FeatureDetailModal';
import ToastNotification from '../../components/LandingPage/ToastNotification';
import LandingFooter from '../../components/LandingPage/LandingFooter';

// Special Elite font style constant
const specialEliteFont = { fontFamily: '"Special Elite", cursive' };

// Constants for economy
const DARK_MODE_PRICE = 100;
const DAILY_POINTS = 50;
const INITIAL_COINS = 80;

const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDarkModeUnlocked, setIsDarkModeUnlocked] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [coins, setCoins] = useState(INITIAL_COINS);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [toast, setToast] = useState(null);
  const [animatingCoins, setAnimatingCoins] = useState(false);

  // Features Data (Defined here to pass down)
  const features = [
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
  ];

  const iconColor = isDarkMode ? 'text-white' : 'text-black';

  // --- Logic Handlers ---

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const animateCoins = (targetCoins) => {
    setAnimatingCoins(true);
    const startCoins = coins;
    const diff = targetCoins - startCoins;
    const duration = 1000;
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
    if (!dailyClaimed) {
      animateCoins(coins + DAILY_POINTS);
      setDailyClaimed(true);
      showToast("Daily points claimed! +50 🎉");
    }
  };

  const handleDarkModeToggle = () => {
    if (!isDarkModeUnlocked) {
      showToast("You have to purchase it from the market.");
      return;
    }
    setIsDarkMode(!isDarkMode);
  };

  const purchaseDarkMode = () => {
    if (coins >= DARK_MODE_PRICE && !isDarkModeUnlocked) {
      animateCoins(coins - DARK_MODE_PRICE);
      setTimeout(() => {
        setIsDarkModeUnlocked(true);
        setIsDarkMode(true);
        showToast("Dark Mode purchased successfully 🎉");
      }, 500);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
          
          @keyframes backgroundGradient {
            0% { background-position: 0% 23%; }
            50% { background-position: 100% 78%; }
            100% { background-position: 0% 23%; }
          }
          
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
        className={`relative min-h-screen lg:h-screen w-full overflow-y-auto lg:overflow-hidden font-sans transition-colors duration-500 flex flex-col ${isDarkMode ? 'text-white' : 'bg-slate-50 text-black'}`}
        style={isDarkMode ? {
          background: 'linear-gradient(309deg, #7158d6, #161316, #43256e, #54A388)',
          backgroundSize: '600% 600%',
          animation: 'backgroundGradient 30s ease infinite'
        } : {}}
      >
        <ToastNotification message={toast} isDarkMode={isDarkMode} />

        <FloatingIconsLayer isDarkMode={isDarkMode} />

        <LandingNavbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          handleDarkModeToggle={handleDarkModeToggle}
          isDarkModeUnlocked={isDarkModeUnlocked}
          coins={coins}
          animatingCoins={animatingCoins}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          specialEliteFont={specialEliteFont}
          iconColor={iconColor}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-100px)] py-4 overflow-visible lg:overflow-hidden">

          <HeroSection
            isDarkMode={isDarkMode}
            iconColor={iconColor}
            specialEliteFont={specialEliteFont}
            onContactClick={() => setIsContactModalOpen(true)}
          />

          <FeaturesGrid
            isDarkMode={isDarkMode}
            iconColor={iconColor}
            specialEliteFont={specialEliteFont}
            coins={coins}
            DARK_MODE_PRICE={DARK_MODE_PRICE}
            isDarkModeUnlocked={isDarkModeUnlocked}
            purchaseDarkMode={purchaseDarkMode}
            DAILY_POINTS={DAILY_POINTS}
            dailyClaimed={dailyClaimed}
            claimDailyPoints={claimDailyPoints}
            features={features}
            setSelectedFeature={setSelectedFeature}
          />

        </main>

        <FeatureDetailModal
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
          isDarkMode={isDarkMode}
          iconColor={iconColor}
          specialEliteFont={specialEliteFont}
        />

        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
          isDarkMode={isDarkMode}
          iconColor={iconColor}
        />

        <LandingFooter isDarkMode={isDarkMode} iconColor={iconColor} />


      </div>
    </>
  );
};

export default LandingPage;