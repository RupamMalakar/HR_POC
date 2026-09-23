import React, { useState } from 'react';
import { VelocityData } from '../../types/hr';

interface VelocityChartProps {
  velocity: VelocityData;
  activeRange: '7D' | '30D' | '90D';
  onChangeRange: (range: '7D' | '30D' | '90D') => void;
}

export const VelocityChart: React.FC<VelocityChartProps> = ({
  velocity,
  activeRange,
  onChangeRange
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG coordinate calculations
  const width = 640;
  const height = 220;
  const paddingLeft = 46;
  const paddingRight = 24;
  const paddingTop = 28;
  const paddingBottom = 28;

  const safeIncoming = Array.isArray(velocity?.incoming) && velocity.incoming.length > 0 
    ? velocity.incoming 
    : [0, 0, 0, 0, 0, 0, 0];
  const safeResolved = Array.isArray(velocity?.resolved) && velocity.resolved.length > 0 
    ? velocity.resolved 
    : [0, 0, 0, 0, 0, 0, 0];
  const safeLabels = Array.isArray(velocity?.labels) && velocity.labels.length > 0 
    ? velocity.labels 
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Dynamic vertical scaling: adapt directly to real operational data peaks
  const peakVal = Math.max(...safeIncoming, ...safeResolved, 0);
  const maxVal = peakVal === 0 ? 4 : Math.max(peakVal + 1, Math.ceil(peakVal * 1.25));
  const minVal = 0;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const baselineY = height - paddingBottom;

  const getX = (index: number) => {
    const denom = Math.max(safeLabels.length - 1, 1);
    return paddingLeft + (index / denom) * chartWidth;
  };

  const getY = (val: number) => {
    const rawY = height - paddingBottom - (val / (maxVal || 1)) * chartHeight;
    return Math.min(baselineY, Math.max(paddingTop, rawY));
  };

  // Convert to coordinate pairs
  const incomingCoords: [number, number][] = safeIncoming.map((val, i) => [getX(i), getY(val)]);
  const resolvedCoords: [number, number][] = safeResolved.map((val, i) => [getX(i), getY(val)]);

  // Smooth cubic bezier spline generator for futuristic neon waves with baseline bounds
  const createSmoothPath = (pts: [number, number][], isClosed = false, baseline = baselineY) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0][0]},${pts[0][1]}`;

    let path = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 >= pts.length ? pts.length - 1 : i + 2];

      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      let cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      let cp2y = p2[1] - (p3[1] - p1[1]) / 6;

      // Ensure control points do not dip below the baseline
      cp1y = Math.min(baseline, Math.max(paddingTop, cp1y));
      cp2y = Math.min(baseline, Math.max(paddingTop, cp2y));

      path += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
    }

    if (isClosed) {
      const last = pts[pts.length - 1];
      const first = pts[0];
      path += ` L ${last[0]},${baseline} L ${first[0]},${baseline} Z`;
    }

    return path;
  };

  const incomingPath = createSmoothPath(incomingCoords);
  const resolvedPath = createSmoothPath(resolvedCoords);
  const areaPath = createSmoothPath(incomingCoords, true, baselineY);

  // Y-axis gridline steps
  const gridSteps = [
    { val: Math.round(maxVal), label: `${Math.round(maxVal)}` },
    { val: Math.round(maxVal * 0.66), label: `${Math.round(maxVal * 0.66)}` },
    { val: Math.round(maxVal * 0.33), label: `${Math.round(maxVal * 0.33)}` },
    { val: 0, label: '0' }
  ];

  return (
    <section className="lg:col-span-7 xl:col-span-8 rounded-3xl p-6 bg-white/[0.04] backdrop-blur-2xl border border-white/10 shadow-glass flex flex-col justify-between specular-border relative">
      <div>
        {/* Header with Title and Range Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="font-display text-lg font-bold text-white tracking-tight">
              Request Overview
            </h3>
            <p className="text-xs text-white/50">
              Velocity comparison: Incoming telemetry vs Autonomous resolutions
            </p>
          </div>

          {/* Frosted Time Range Switcher */}
          <div className="inline-flex p-1 bg-black/40 border border-white/10 rounded-xl backdrop-blur-xl text-xs font-mono">
            {(['7D', '30D', '90D'] as const).map((rng) => (
              <button
                key={rng}
                onClick={() => onChangeRange(rng)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeRange === rng
                    ? 'bg-white/15 text-white font-medium shadow-sm'
                    : 'text-white/50 hover:text-white'
                }`}
                type="button"
              >
                {rng}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Glass Legend with Live Tooltip Display */}
        <div className="flex items-center justify-between gap-4 mb-4 text-xs font-mono">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-neon-cyan rounded-full shadow-[0_0_8px_#00f0ff]" />
              <span className="text-white/90">Incoming Requests</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-neon-emerald rounded-full shadow-[0_0_8px_#10b981]" />
              <span className="text-white/60">Resolved Cases</span>
            </div>
          </div>

          {hoveredIndex !== null && (
            <div className="hidden sm:flex items-center gap-3 px-2.5 py-1 rounded-lg bg-black/60 border border-cyan-400/30 text-[11px] font-mono animate-fadeIn">
              <span className="text-white/60">{safeLabels[hoveredIndex] || 'Day'}:</span>
              <span className="text-neon-cyan font-bold">{safeIncoming[hoveredIndex] ?? 0} in</span>
              <span className="text-white/20">/</span>
              <span className="text-neon-emerald font-bold">{safeResolved[hoveredIndex] ?? 0} out</span>
            </div>
          )}
        </div>

        {/* Glowing Spatial SVG Chart Canvas */}
        <div className="w-full relative h-56 sm:h-64">
          <svg
            aria-label={`Request trend over ${activeRange}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
            viewBox={`0 0 ${width} ${height}`}
          >
            <defs>
              <linearGradient id="cyanGlow" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.32" />
                <stop offset="65%" stopColor="#3b82f6" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
              <filter height="150%" id="neonBlur" width="150%" x="-25%" y="-25%">
                <feGaussianBlur result="blur" stdDeviation="3.5" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Reference Values */}
            {gridSteps.map((step, idx) => {
              const y = getY(step.val);
              return (
                <g key={`grid-${idx}`}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={width - paddingRight}
                    y2={y}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    fill="rgba(255,255,255,0.35)"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {step.label}
                  </text>
                </g>
              );
            })}

            {/* Cyan Ambient Bounded Area Fill with Smooth Bezier Wave */}
            <path fill="url(#cyanGlow)" d={areaPath} />

            {/* Glow Underlying Path for bloom effect */}
            <path
              d={incomingPath}
              fill="none"
              filter="url(#neonBlur)"
              opacity="0.35"
              stroke="#00f0ff"
              strokeWidth="6"
            />

            {/* Incoming Line (Vivid Cyan Neon) */}
            <path
              d={incomingPath}
              fill="none"
              stroke="#00f0ff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
            />

            {/* Resolved Line (Emerald Dashed Spatial line) */}
            <path
              d={resolvedPath}
              fill="none"
              opacity="0.85"
              stroke="#10b981"
              strokeDasharray="6 5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />

            {/* Hover Crosshair Vertical Guide Line */}
            {hoveredIndex !== null && (
              <line
                x1={getX(hoveredIndex)}
                y1={paddingTop}
                x2={getX(hoveredIndex)}
                y2={baselineY}
                stroke="rgba(0, 240, 255, 0.4)"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />
            )}

            {/* Interactive Data Nodes */}
            {safeIncoming.map((val, idx) => {
              const cx = getX(idx);
              const cy = getY(val);
              const isLast = idx === safeIncoming.length - 1;
              const isHovered = hoveredIndex === idx;

              return (
                <g
                  key={`node-${idx}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="cursor-pointer"
                >
                  {/* Invisible enlarged hit target for effortless hover */}
                  <circle cx={cx} cy={cy} r="16" fill="transparent" />

                  {/* Pulsing halo if hovered or last */}
                  {(isLast || isHovered) && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r="9"
                      fill="none"
                      stroke="#00f0ff"
                      strokeWidth="1"
                      opacity="0.5"
                      className="animate-ping"
                    />
                  )}

                  {/* Visual Circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isLast || isHovered ? 5.5 : 3.5}
                    fill={isLast ? "#ffffff" : "#00f0ff"}
                    stroke="#00f0ff"
                    strokeWidth={isLast ? "2.5" : "1"}
                    className="transition-all duration-150"
                  />

                  {/* Floating Number Value on hover */}
                  {isHovered && (
                    <text
                      x={cx}
                      y={cy - 12}
                      textAnchor="middle"
                      fill="#00f0ff"
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {val}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dedicated X-Axis Day Labels Row */}
        <div className="relative w-full h-8 mt-2 pt-2 border-t border-white/10 font-mono text-[11px]">
          {safeLabels.map((lbl, idx) => {
            const percentX = (getX(idx) / width) * 100;
            const isLast = idx === safeLabels.length - 1;
            const isHovered = hoveredIndex === idx;

            return (
              <button
                key={`${lbl}-${idx}`}
                type="button"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ left: `${percentX}%` }}
                className={`absolute -translate-x-1/2 top-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isHovered
                    ? 'text-white font-bold scale-110'
                    : isLast
                    ? 'text-neon-cyan font-bold'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {lbl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Bottom Stat Capsule */}
      <div className="mt-6 p-3.5 bg-black/40 border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_#00f0ff]" />
          <span className="text-white font-bold">{velocity?.openTotal ?? 0}</span>
          <span className="text-white/50">open total</span>
        </div>
        <span className="text-white/20">|</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-white font-bold">{velocity?.receivedToday ?? 0}</span>
          <span className="text-white/50">received today</span>
        </div>
        <span className="text-white/20">|</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-emerald shadow-[0_0_8px_#10b981]" />
          <span className="text-white font-bold">{velocity?.resolvedToday ?? 0}</span>
          <span className="text-white/50">resolved today</span>
        </div>
      </div>
    </section>
  );
};
