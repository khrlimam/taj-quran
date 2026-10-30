import React from 'react';

export const MushafSpine: React.FC = () => {
  return (
    <div className="relative w-4 sm:w-6 flex-shrink-0 flex items-center justify-center pointer-events-none select-none z-20">
      {/* 3D Spine Crease / Binding Shadow */}
      <div 
        className="absolute inset-y-0 -left-6 w-6 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.35) 100%)'
        }}
      />
      <div 
        className="absolute inset-y-0 -right-6 w-6 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, transparent 0%, rgba(0,0,0,0.35) 100%)'
        }}
      />

      {/* Central Spine Groove */}
      <div className="h-full w-2 bg-gradient-to-r from-[#1a130b] via-[#3a2c1a] to-[#1a130b] shadow-[0_0_10px_rgba(0,0,0,0.8)] border-x border-[#d4af37]/40 flex flex-col items-center justify-between py-4">
        {/* Top Gold Finial */}
        <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] border border-[#f59e0b] shadow-sm" />
        
        {/* Spine Stitched Golden Thread Accent */}
        <div className="w-0.5 h-full bg-gradient-to-b from-[#d4af37] via-[#f59e0b] to-[#d4af37] opacity-80" />
        
        {/* Bottom Gold Finial */}
        <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] border border-[#f59e0b] shadow-sm" />
      </div>
    </div>
  );
};
