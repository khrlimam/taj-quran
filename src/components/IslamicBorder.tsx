import React from 'react';

interface IslamicBorderProps {
  children: React.ReactNode;
  theme?: 'emerald' | 'lapis' | 'night' | 'sepia';
  className?: string;
}

export const IslamicBorder: React.FC<IslamicBorderProps> = ({
  children,
  theme = 'emerald',
  className = ''
}) => {
  // Theme styling definitions
  const themeColors = {
    emerald: {
      outerBg: 'bg-[#03241b]',
      borderColor: '#d4af37',
      goldAccent: '#f59e0b',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.6)]',
      matting: 'bg-[#06382b]',
      patternFill: '#d4af37'
    },
    lapis: {
      outerBg: 'bg-[#0a1829]',
      borderColor: '#d4af37',
      goldAccent: '#38bdf8',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.6)]',
      matting: 'bg-[#0f243e]',
      patternFill: '#d4af37'
    },
    night: {
      outerBg: 'bg-[#0f172a]',
      borderColor: '#94a3b8',
      goldAccent: '#64748b',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.8)]',
      matting: 'bg-[#1e293b]',
      patternFill: '#cbd5e1'
    },
    sepia: {
      outerBg: 'bg-[#2c1810]',
      borderColor: '#c5a059',
      goldAccent: '#d97706',
      shadow: 'shadow-[0_20px_50px_rgba(0,0,0,0.5)]',
      matting: 'bg-[#3d2317]',
      patternFill: '#c5a059'
    }
  }[theme];

  return (
    <div className={`relative p-2 sm:p-4 rounded-xl ${themeColors.outerBg} ${themeColors.shadow} border-2 border-[#d4af37]/60 transition-colors duration-300 ${className}`}>
      {/* Background Islamic Geometric Tessellation Pattern */}
      <div 
        className="absolute inset-0 rounded-xl opacity-15 pointer-events-none overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(212,175,55,0.2) 0%, transparent 60%), url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0 L25 15 L40 20 L25 25 L20 40 L15 25 L0 20 L15 15 Z' fill='none' stroke='%23d4af37' stroke-width='0.75' stroke-opacity='0.4'/%3E%3Cpolygon points='20,6 23,17 34,20 23,23 20,34 17,23 6,20 17,17' fill='none' stroke='%23d4af37' stroke-width='0.5' stroke-opacity='0.25'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Outer Ornate Double-Gilded Frame Border */}
      <div className="absolute inset-1.5 sm:inset-2.5 rounded-lg border border-[#d4af37]/70 pointer-events-none" />
      <div className="absolute inset-2 sm:inset-3 rounded-lg border-2 border-[#d4af37] pointer-events-none" />
      <div className="absolute inset-3 sm:inset-4 rounded-lg border border-[#d4af37]/50 pointer-events-none" />

      {/* Four Corner Shamsah Medallions (8-Point Islamic Stars) */}
      {/* Top Left */}
      <CornerMedallion className="top-1 left-1 sm:top-2 sm:left-2" color={themeColors.borderColor} />
      {/* Top Right */}
      <CornerMedallion className="top-1 right-1 sm:top-2 sm:right-2" color={themeColors.borderColor} />
      {/* Bottom Left */}
      <CornerMedallion className="bottom-1 left-1 sm:bottom-2 sm:left-2" color={themeColors.borderColor} />
      {/* Bottom Right */}
      <CornerMedallion className="bottom-1 right-1 sm:bottom-2 sm:right-2" color={themeColors.borderColor} />

      {/* Top Center Illuminated Header Cartouche */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
        <svg width="120" height="18" viewBox="0 0 120 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#d4af37]">
          <path d="M0 9 C30 9 40 2 60 2 C80 2 90 9 120 9 C90 9 80 16 60 16 C40 16 30 9 0 9 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
          <circle cx="60" cy="9" r="4" fill="currentColor" />
          <circle cx="60" cy="9" r="2" fill="#03241b" />
          <circle cx="45" cy="9" r="1.5" fill="currentColor" />
          <circle cx="75" cy="9" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Bottom Center Illuminated Accent */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none">
        <svg width="120" height="18" viewBox="0 0 120 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#d4af37]">
          <path d="M0 9 C30 9 40 16 60 16 C80 16 90 9 120 9 C90 9 80 2 60 2 C40 2 30 9 0 9 Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" />
          <circle cx="60" cy="9" r="4" fill="currentColor" />
          <circle cx="60" cy="9" r="2" fill="#03241b" />
          <circle cx="45" cy="9" r="1.5" fill="currentColor" />
          <circle cx="75" cy="9" r="1.5" fill="currentColor" />
        </svg>
      </div>

      {/* Inner Matting and Content Container */}
      <div className="relative z-10 p-1 sm:p-2 rounded-md bg-[#021812]/40 backdrop-blur-[2px]">
        {children}
      </div>
    </div>
  );
};

interface CornerMedallionProps {
  className?: string;
  color?: string;
}

const CornerMedallion: React.FC<CornerMedallionProps> = ({ className = '', color = '#d4af37' }) => (
  <div className={`absolute z-20 pointer-events-none w-7 h-7 sm:w-10 sm:h-10 ${className}`}>
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
      {/* 8-Point Star Medallion */}
      <g transform="translate(20,20)">
        <polygon 
          points="0,-16 4.7,-4.7 16,0 4.7,4.7 0,16 -4.7,4.7 -16,0 -4.7,-4.7" 
          fill={color} 
          fillOpacity="0.4"
          stroke={color} 
          strokeWidth="1.2" 
        />
        <polygon 
          points="-11.3,-11.3 0,-6.6 11.3,-11.3 6.6,0 11.3,11.3 0,6.6 -11.3,11.3 -6.6,0" 
          fill={color} 
          fillOpacity="0.3"
          stroke={color} 
          strokeWidth="1" 
        />
        <circle cx="0" cy="0" r="4.5" fill={color} />
        <circle cx="0" cy="0" r="2" fill="#03241b" />
      </g>
    </svg>
  </div>
);
