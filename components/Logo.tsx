import React from 'react';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10 flex items-center justify-center">
        {/* The "S" with circuit patterns - simplified SVG representation of the provided logo */}
        <svg viewBox="0 0 100 100" className="w-full h-full text-brand-blue" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M75 30 C 75 20, 25 20, 25 30 L 25 45 C 25 55, 75 55, 75 65 L 75 80 C 75 90, 25 90, 25 80" />
          {/* Circuit dots */}
          <circle cx="25" cy="30" r="5" fill="currentColor" stroke="none" />
          <circle cx="75" cy="45" r="5" fill="currentColor" stroke="none" />
          <circle cx="25" cy="65" r="5" fill="currentColor" stroke="none" />
          <circle cx="75" cy="80" r="5" fill="currentColor" stroke="none" />
          {/* Internal circuit lines */}
          <path d="M40 37 L 60 37" strokeWidth="4" />
          <path d="M40 73 L 60 73" strokeWidth="4" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display font-bold text-xl tracking-tight text-white">Sotic</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium">Sistemas e Telecom</span>
      </div>
    </div>
  );
}
