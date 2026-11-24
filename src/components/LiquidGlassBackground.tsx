import React from "react";

export function LiquidGlassBackground() {
  // Wave 1: Arterial Hemodynamic Pulse Wave (Systolic peak + Dicrotic notch + Diastolic runoff)
  // Cycle period = 500px, 6 cycles = 3000px for seamless horizontal infinite loop
  const wave1Path =
    "M 0,110 C 40,108 70,45 110,32 C 140,26 160,82 190,90 C 210,95 230,72 250,72 C 320,72 420,110 500,110 " +
    "C 540,108 570,45 610,32 C 640,26 660,82 690,90 C 710,95 730,72 750,72 C 820,72 920,110 1000,110 " +
    "C 1040,108 1070,45 1110,32 C 1140,26 1160,82 1190,90 C 1210,95 1230,72 1250,72 C 1320,72 1420,110 1500,110 " +
    "C 1540,108 1570,45 1610,32 C 1640,26 1660,82 1690,90 C 1710,95 1730,72 1750,72 C 1820,72 1920,110 2000,110 " +
    "C 2040,108 2070,45 2110,32 C 2140,26 2160,82 2190,90 C 2210,95 2230,72 2250,72 C 2320,72 2420,110 2500,110 " +
    "C 2540,108 2570,45 2610,32 C 2640,26 2660,82 2690,90 C 2710,95 2730,72 2750,72 C 2820,72 2920,110 3000,110 " +
    "L 3000,240 L 0,240 Z";

  // Wave 2: Harmonic Undulating Wave
  // Cycle period = 600px, 5 cycles = 3000px
  const wave2Path =
    "M 0,90 C 120,30 180,30 300,90 C 420,150 480,150 600,90 " +
    "C 720,30 780,30 900,90 C 1020,150 1080,150 1200,90 " +
    "C 1320,30 1380,30 1500,90 C 1620,150 1680,150 1800,90 " +
    "C 1920,30 1980,30 2100,90 C 2220,150 2280,150 2400,90 " +
    "C 2520,30 2580,30 2700,90 C 2820,150 2880,150 3000,90 " +
    "L 3000,240 L 0,240 Z";

  return (
    <div className="liquid-bg-viewport" aria-hidden="true">
      {/* Liquid Organic Floating Glass Orbs */}
      <div className="liquid-orb orb-1" />
      <div className="liquid-orb orb-2" />
      <div className="liquid-orb orb-3" />
      <div className="liquid-orb orb-4" />

      {/* SVG Canvas for Continuous Moving Wave Chart */}
      <div className="liquid-wave-canvas-wrapper">
        <svg
          className="liquid-wave-svg"
          viewBox="0 0 1600 240"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Primary Wave Teal -> Cyan -> Blue */}
            <linearGradient id="liquidGradPrimary" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#06b6d4" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.85" />
              <stop offset="75%" stopColor="#8b5cf6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.85" />
            </linearGradient>

            {/* Primary Area Fill with Liquid Translucency */}
            <linearGradient id="liquidFillPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.28" />
              <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>

            {/* Secondary Wave Violet -> Magenta -> Sky */}
            <linearGradient id="liquidGradSecondary" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.7" />
            </linearGradient>

            {/* Secondary Area Fill */}
            <linearGradient id="liquidFillSecondary" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.2" />
              <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>

            {/* Subtle Telemetry Grid */}
            <pattern id="liquidTelemetryGrid" width="48" height="28" patternUnits="userSpaceOnUse">
              <path
                d="M 48 0 L 0 0 0 28"
                fill="none"
                stroke="rgba(20, 184, 166, 0.08)"
                strokeWidth="0.8"
              />
            </pattern>

            <filter id="liquidGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Faint Medical Grid in Background */}
          <rect width="100%" height="100%" fill="url(#liquidTelemetryGrid)" />

          {/* Reference Guideline Levels */}
          <line x1="0" y1="50" x2="1600" y2="50" stroke="rgba(244, 63, 94, 0.12)" strokeDasharray="8 6" />
          <line x1="0" y1="100" x2="1600" y2="100" stroke="rgba(20, 184, 166, 0.18)" strokeDasharray="6 4" />
          <line x1="0" y1="150" x2="1600" y2="150" stroke="rgba(59, 130, 246, 0.14)" strokeDasharray="8 6" />

          {/* Secondary Harmonic Wave */}
          <g className="liquid-wave-track-secondary">
            <path
              d={wave2Path}
              fill="url(#liquidFillSecondary)"
              stroke="url(#liquidGradSecondary)"
              strokeWidth="2.2"
            />
          </g>

          {/* Primary Arterial Wave */}
          <g className="liquid-wave-track-primary">
            <path
              d={wave1Path}
              fill="url(#liquidFillPrimary)"
              stroke="url(#liquidGradPrimary)"
              strokeWidth="2.8"
              filter="url(#liquidGlow)"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
