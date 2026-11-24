import React from "react";

export function AnimatedHeaderWave() {
  // Wave 1: Arterial Hemodynamic Pulse Wave (Systolic peak + Dicrotic notch + Diastolic runoff)
  // Cycle period = 500px, 5 cycles = 2500px
  const wave1Path =
    "M 0,80 C 40,78 70,30 110,22 C 140,18 160,58 190,64 C 210,68 230,52 250,52 C 320,52 420,80 500,80 " +
    "C 540,78 570,30 610,22 C 640,18 660,58 690,64 C 710,68 730,52 750,52 C 820,52 920,80 1000,80 " +
    "C 1040,78 1070,30 1110,22 C 1140,18 1160,58 1190,64 C 1210,68 1230,52 1250,52 C 1320,52 1420,80 1500,80 " +
    "C 1540,78 1570,30 1610,22 C 1640,18 1660,58 1690,64 C 1710,68 1730,52 1750,52 C 1820,52 1920,80 2000,80 " +
    "C 2040,78 2070,30 2110,22 C 2140,18 2160,58 2190,64 C 2210,68 2230,52 2250,52 C 2320,52 2420,80 2500,80 " +
    "L 2500,150 L 0,150 Z";

  // Wave 2: Harmonic Secondary Wave
  // Cycle period = 600px, 4 cycles = 2400px
  const wave2Path =
    "M 0,65 C 120,20 180,20 300,65 C 420,110 480,110 600,65 " +
    "C 720,20 780,20 900,65 C 1020,110 1080,110 1200,65 " +
    "C 1320,20 1380,20 1500,65 C 1620,110 1680,110 1800,65 " +
    "C 1920,20 1980,20 2100,65 C 2220,110 2280,110 2400,65 " +
    "L 2400,150 L 0,150 Z";

  return (
    <div className="header-wave-bg" aria-hidden="true">
      {/* Background radial ambient lights */}
      <div className="wave-ambient-glow teal" />
      <div className="wave-ambient-glow blue" />

      {/* SVG Canvas with Animated Continuously Moving Waves */}
      <svg
        className="wave-svg-canvas"
        viewBox="0 0 1200 130"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Primary Wave Teal -> Cyan -> Blue */}
          <linearGradient id="waveGradPrimary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.8" />
          </linearGradient>

          {/* Primary Wave Area Fill */}
          <linearGradient id="waveFillPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>

          {/* Secondary Wave Indigo -> Purple -> Sky */}
          <linearGradient id="waveGradSecondary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.6" />
          </linearGradient>

          {/* Secondary Wave Area Fill */}
          <linearGradient id="waveFillSecondary" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.16" />
            <stop offset="60%" stopColor="#6366f1" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
          </linearGradient>

          {/* Telemetry Grid Pattern */}
          <pattern id="telemetryGrid" width="40" height="25" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 25"
              fill="none"
              stroke="rgba(20, 184, 166, 0.06)"
              strokeWidth="0.8"
            />
          </pattern>

          {/* Glow filter */}
          <filter id="waveGlowEffect" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Faint Telemetry Coordinate Grid */}
        <rect width="100%" height="100%" fill="url(#telemetryGrid)" />

        {/* Telemetry Threshold Reference Lines */}
        <line x1="0" y1="35" x2="1200" y2="35" stroke="rgba(239, 68, 68, 0.12)" strokeDasharray="6 6" />
        <line x1="0" y1="65" x2="1200" y2="65" stroke="rgba(20, 184, 166, 0.15)" strokeDasharray="4 4" />
        <line x1="0" y1="95" x2="1200" y2="95" stroke="rgba(59, 130, 246, 0.12)" strokeDasharray="6 6" />

        {/* Secondary Harmonic Wave Layer (Flows smoothly left to right) */}
        <g className="wave-track-secondary">
          <path
            d={wave2Path}
            fill="url(#waveFillSecondary)"
            stroke="url(#waveGradSecondary)"
            strokeWidth="1.8"
          />
        </g>

        {/* Primary Hemodynamic Pulse Wave Layer (Flows continuously) */}
        <g className="wave-track-primary">
          <path
            d={wave1Path}
            fill="url(#waveFillPrimary)"
            stroke="url(#waveGradPrimary)"
            strokeWidth="2.4"
            filter="url(#waveGlowEffect)"
          />
        </g>
      </svg>

      {/* Floating Telemetry Pulse Pill on Far Right */}
      <div className="wave-telemetry-badge">
        <span className="telemetry-radar-dot" />
        <div className="telemetry-labels">
          <span className="telemetry-title">HEMODYNAMIC WAVEFORM</span>
          <span className="telemetry-subtitle">991.346 Pasien · Fluktuasi Dinamis</span>
        </div>
      </div>
    </div>
  );
}
