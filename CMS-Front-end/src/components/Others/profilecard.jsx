import React from 'react';
import '@fontsource/inter'; // Ensure font is available

const FireIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177 7.547 7.547 0 01-1.705-1.715.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      clipRule="evenodd"
    />
  </svg>
);

const BadgeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export const ProfileCard = ({
  name = 'Sachin Pathak',
  className = '11th Grade',
  avatarUrl = 'https://res.cloudinary.com/dgh9uunif/image/upload/v1768719279/samples/smile.jpg',
  isOnline = true,
  leaderboardRank = "2nd",
  totalXP = "7946",
  level = 24,
  currentXP = 420,
  maxXP = 450,
  streak = 67,
  roles = ["Student", "President", "seller", "dark mode user", "touched Grass", "edited profile", "Student", "President", "class Rep"],
  badges = ["https://cdn.discordapp.com/badge-icons/8a88d63823d8a71cd5e390baa45efa02.png", "https://cdn.discordapp.com/badge-icons/7d9ae358c8c5e118768335dbe68b4fb8.png", "https://cdn.discordapp.com/badge-icons/0e4080d1d333bc7ad29ef6528b6f2fb7.png", "https://cdn.discordapp.com/badge-icons/6de6d34650760ba5551a79732e98ed60.png"],
  theme = 'light',
}) => {
  const isDark = theme === 'dark';

  // Theme-based colors
  const containerBg = isDark ? 'bg-[#1a1a1a]' : 'bg-slate-100';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-gray-400' : 'text-slate-500';
  const cardBorder = isDark ? 'border-gray-800' : 'border-slate-200';
  const roleBg = isDark ? 'bg-gray-800' : 'bg-white';
  const roleBorder = isDark ? 'border-gray-700' : 'border-slate-300';
  const roleText = isDark ? 'text-gray-200' : 'text-slate-700';

  // XP Progress
  const progressPercentage = Math.min(
    100,
    Math.max(0, (currentXP / maxXP) * 100)
  );

  return (
    <div
      className={`relative w-full max-w-full rounded-[2rem] p-6 shadow-xl border ${containerBg} ${cardBorder} ${textColor} font-sans overflow-hidden transition-colors duration-300 shrink-0 ${className}`}
    >
      {/* Edit Icon (Top Right) - strictly visual based on reference */}
      <button className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      </button>

      {/* Avatar Section */}
      <div className="flex flex-col items-center ">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${avatarUrl || 'https://via.placeholder.com/150'})` }}
            role="img"
            aria-label={`${name}'s avatar`}
          >
          </div>
          {/* Online Status Dot */}
          {isOnline && (
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-[#1a1a1a] rounded-full" />
          )}
        </div>
      </div>

      {/* Badges Section */}
      {badges && badges.length > 0 && (
        <div className="flex justify-center gap-2 mt-3 flex-wrap">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center justify-center relative group">
              {badge.startsWith('http') ? (
                <img
                  src={badge}
                  alt="badge"
                  className="w-6 h-6 object-contain hover:scale-110 transition-transform"
                  title={`Badge ${index + 1}`}
                />
              ) : (
                <span
                  className="px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-[10px] font-medium text-gray-600 dark:text-gray-300 pointer-events-none select-none"
                >
                  {badge}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Name and Class */}
      <div className="text-center mt-3">
        <h2 className="text-2xl font-bold tracking-tight truncate">
          {name} | {className}
        </h2>

        {/* Rank Line */}
        <div className={`text-sm ${subTextColor} mt-1 font-medium`}>
          Rank : {leaderboardRank} | {totalXP.toLocaleString()} XP
        </div>
      </div>

      {/* Roles Section */}
      <div className="mt-6">
        {roles && roles.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-2">
            {roles.map((role, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${roleBg} ${roleBorder} ${roleText} text-xs font-semibold shadow-sm`}
              >
                {/* Colored dot for role - random color for demo or passed in role object */}
                <span
                  className={`w-2.5 h-2.5 rounded-full`}
                  style={{ backgroundColor: role.color || '#3b82f6' }}
                />
                {role.name || role}
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center text-sm ${subTextColor}`}>No roles to display</div>
        )}
      </div>

      {/* Level and Streak Section */}
      <div className="flex items-center justify-between mt-8 px-1">
        <div className="text-xl font-bold">
          Level : {level}
        </div>
        <div className="flex items-center gap-1.5">
          <FireIcon className={`w-6 h-6 ${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-gray-400'}`} />
          <span className="text-lg font-bold">{streak}</span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mt-3 relative w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden border border-transparent dark:border-gray-600">
        {/* Background Text (centered) */}
        <div className={`absolute inset-0 flex items-center justify-center text-xs font-bold z-10 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {currentXP} / {maxXP} XP
        </div>

        {/* Progress Fill */}
        <div
          className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transition-all duration-500 ease-out rounded-lg shadow-lg"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Demo Component (For Verification)
// -----------------------------------------------------------------------------

export const ProfileCardDemo = () => {
  const [theme, setTheme] = React.useState('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const mockData = {
    name: "Harsh | Wizard",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harsh",
    isOnline: true,
    leaderboardRank: 5,
    totalXP: 12500,
    level: 42,
    currentXP: 4500,
    maxXP: 10000,
    streak: 15,
    roles: [
      { name: "Admin", color: "#ef4444" },
      { name: "Moderator", color: "#3b82f6" },
      { name: "Vip", color: "#f59e0b" },
      { name: "+9", color: "#6b7280" } // Mocking the overflow item as a static role for now
    ],
    badges: ["badge1", "badge2", "badge3"]
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-10 gap-8 ${theme === 'dark' ? 'bg-black' : 'bg-gray-200'}`}>
      <button
        onClick={toggleTheme}
        className="px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 transition"
      >
        Toggle Theme: {theme}
      </button>

      <ProfileCard
        {...mockData}
        theme={theme}
      />
      <div className="text-gray-500 text-sm mt-4">
        *Mock data used for display
      </div>
    </div>
  );
};

export default ProfileCard;
