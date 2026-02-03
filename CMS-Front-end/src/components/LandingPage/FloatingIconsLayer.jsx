import React from 'react';
import { PencilIcon, BookIcon, BoardIcon, CalculatorIcon, GlobeIcon, LightbulbIcon, RulerIcon, GraduationIcon } from './LandingIcons';

const floatingIcons = [
    { Icon: PencilIcon, top: '10%', left: '5%', delay: '0s', duration: '12s' },
    { Icon: BookIcon, top: '20%', right: '8%', delay: '2s', duration: '14s' },
    { Icon: BoardIcon, bottom: '30%', left: '3%', delay: '4s', duration: '11s' },
    { Icon: CalculatorIcon, top: '60%', right: '5%', delay: '1s', duration: '13s' },
    { Icon: GlobeIcon, bottom: '15%', left: '10%', delay: '3s', duration: '15s' },
    { Icon: LightbulbIcon, top: '35%', right: '3%', delay: '5s', duration: '10s' },
    { Icon: RulerIcon, bottom: '45%', right: '10%', delay: '2.5s', duration: '12.5s' },
    { Icon: GraduationIcon, top: '75%', left: '7%', delay: '1.5s', duration: '11.5s' },
];

const FloatingIconsLayer = ({ isDarkMode }) => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {floatingIcons.map((item, index) => (
                <div
                    key={index}
                    className={`absolute ${isDarkMode ? 'text-white/30' : 'text-black/10'}`}
                    style={{
                        top: item.top,
                        left: item.left,
                        right: item.right,
                        bottom: item.bottom,
                        animation: `floatUpDown ${item.duration} ease-in-out infinite`,
                        animationDelay: item.delay,
                    }}
                >
                    <item.Icon />
                </div>
            ))}
        </div>
    );
};

export default FloatingIconsLayer;
