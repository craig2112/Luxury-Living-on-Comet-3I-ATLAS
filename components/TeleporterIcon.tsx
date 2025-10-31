import React from 'react';

export const TeleporterIcon: React.FC = () => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 100 100"
    className="transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(0,255,255,0.7)]"
  >
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    {/* Base circle */}
    <circle cx="50" cy="50" r="45" fill="none" stroke="#0e7490" strokeWidth="2" />
    {/* Inner rings */}
    <circle cx="50" cy="50" r="35" fill="none" stroke="#0891b2" strokeWidth="1" strokeDasharray="4 2" />
    <circle cx="50" cy="50" r="25" fill="#06b6d4" fillOpacity="0.1" />

    {/* Rotating arcs */}
    <g className="origin-center animate-spin" style={{ animationDuration: '8s' }}>
      <path
        d="M 50,5 A 45,45 0 0,1 95,50"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 50,95 A 45,45 0 0,1 5,50"
        fill="none"
        stroke="#67e8f9"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>

    {/* Center core */}
    <circle cx="50" cy="50" r="10" fill="#22d3ee" filter="url(#glow)" />
    <circle cx="50" cy="50" r="5" fill="#f0f9ff" />
  </svg>
);
