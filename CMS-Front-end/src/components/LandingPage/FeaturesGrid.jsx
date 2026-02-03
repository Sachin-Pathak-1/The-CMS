import React from 'react';
import DarkModeProductCard from './DarkModeProductCard';
import DailyRewardCard from './DailyRewardCard';
import ActivityFeed from './ActivityFeed';
import UpcomingDeadline from './UpcomingDeadline';
import Leaderboard from './Leaderboard';
import FeatureCard from './FeatureCard';

const FeaturesGrid = ({
    isDarkMode,
    iconColor,
    specialEliteFont,
    coins,
    DARK_MODE_PRICE,
    isDarkModeUnlocked,
    purchaseDarkMode,
    DAILY_POINTS,
    dailyClaimed,
    claimDailyPoints,
    features,
    setSelectedFeature
}) => {
    return (
        <div className="lg:col-span-7 grid grid-cols-2 gap-4 auto-rows-min content-center">

            {/* Dark Mode Product Card */}
            <DarkModeProductCard
                isDarkMode={isDarkMode}
                iconColor={iconColor}
                specialEliteFont={specialEliteFont}
                DARK_MODE_PRICE={DARK_MODE_PRICE}
                isDarkModeUnlocked={isDarkModeUnlocked}
                coins={coins}
                purchaseDarkMode={purchaseDarkMode}
            />

            {/* Daily Reward Card */}
            <DailyRewardCard
                isDarkMode={isDarkMode}
                iconColor={iconColor}
                specialEliteFont={specialEliteFont}
                DAILY_POINTS={DAILY_POINTS}
                dailyClaimed={dailyClaimed}
                claimDailyPoints={claimDailyPoints}
            />

            {/* Activity Feed */}
            <ActivityFeed isDarkMode={isDarkMode} iconColor={iconColor} />

            {/* Upcoming Deadline */}
            <UpcomingDeadline isDarkMode={isDarkMode} />

            {/* Features Rows */}
            {features.map((feature) => (
                <FeatureCard
                    key={feature.id}
                    feature={feature}
                    isDarkMode={isDarkMode}
                    iconColor={iconColor}
                    specialEliteFont={specialEliteFont}
                    onClick={() => setSelectedFeature(feature)}
                />
            ))}

            {/* More Features Link (FeatureCard handles null feature as "More") */}
            <FeatureCard feature={null} isDarkMode={isDarkMode} iconColor={iconColor} specialEliteFont={specialEliteFont} />

            {/* Leaderboard */}
            <Leaderboard isDarkMode={isDarkMode} iconColor={iconColor} />

        </div>
    );
};

export default FeaturesGrid;
