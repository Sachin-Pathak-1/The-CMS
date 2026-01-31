import React from 'react';

const AmbientGlow = ({ isDarkMode }) => {
    return (
        <>
            <style>
                {`
          @keyframes ambientPulse {
            0%, 100% { 
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
            50% { 
              opacity: 0.7;
              transform: translate(-50%, -50%) scale(1.05);
            }
          }

          @keyframes ambientFloat {
            0%, 100% { 
              transform: translate(-50%, -50%) translateY(0px);
            }
            50% { 
              transform: translate(-50%, -50%) translateY(-20px);
            }
          }

          /* Single Top-Right Ambient Glow */
          .ambient-glow {
            position: fixed;
            top: 0;
            right: 0;
            width: 800px;
            height: 800px;
            transform: translate(-50%, 50%);
            background: radial-gradient(circle, rgba(113, 88, 214, 0.4), transparent 70%);
            filter: blur(120px);
            pointer-events: none;
            z-index: 0;
            animation: ambientPulse 8s ease-in-out infinite, ambientFloat 12s ease-in-out infinite;
          }

          .dark-ambient-glow {
            background: radial-gradient(circle, rgba(113, 88, 214, 0.6), rgba(84, 163, 136, 0.3) 40%, transparent 70%);
          }
        `}
            </style>

            {/* Single Top-Right Ambient Glow */}
            <div className={`ambient-glow ${isDarkMode ? 'dark-ambient-glow' : ''}`}></div>
        </>
    );
};

export default AmbientGlow;
