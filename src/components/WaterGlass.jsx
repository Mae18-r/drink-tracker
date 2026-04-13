import { useEffect, useRef } from 'react'

/**
 * Animated SVG water glass that fills based on pct (0–1).
 * Uses a clipPath to reveal the water fill area smoothly.
 */
export default function WaterGlass({ pct }) {
  const clampedPct = Math.min(1, Math.max(0, pct))

  // Glass dimensions (viewBox 0 0 100 160)
  // The glass body goes from y=20 (top rim) to y=150 (bottom)
  // Height of fillable area = 130px
  const fillableHeight = 130
  const fillY = 20 + fillableHeight * (1 - clampedPct)  // top of water
  const fillHeight = fillableHeight * clampedPct

  // Color interpolation: empty=sky-light → full=sky
  const r = Math.round(91 + (91 - 91) * clampedPct)
  const g = Math.round(188 + (188 - 188) * clampedPct)
  const b = Math.round(255 - (255 - 180) * clampedPct)
  const waterColor = `rgb(${r},${g},${b})`

  return (
    <div className="water-glass-wrapper">
      <svg
        className="water-glass-svg"
        viewBox="0 0 100 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Clip path = the glass interior shape */}
          <clipPath id="glass-clip">
            {/* Tapered glass: narrower at bottom */}
            <path d="M14,20 L86,20 L78,150 L22,150 Z" />
          </clipPath>

          {/* Wave gradient */}
          <linearGradient id="water-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5BBCFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#2E9FE8" stopOpacity="1" />
          </linearGradient>

          {/* Shine gradient */}
          <linearGradient id="glass-shine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#fff" stopOpacity="0.08" />
            <stop offset="30%"  stopColor="#fff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* ── Glass body background ── */}
        <path
          d="M14,20 L86,20 L78,150 L22,150 Z"
          fill="#EAF5FF"
          stroke="none"
        />

        {/* ── Water fill group (clipped to glass) ── */}
        <g clipPath="url(#glass-clip)">
          {/* Static water rectangle */}
          <rect
            x="0"
            y={fillY}
            width="100"
            height={fillHeight + 10}
            fill="url(#water-grad)"
            style={{ transition: 'y 0.9s cubic-bezier(0.34,1.56,0.64,1), height 0.9s cubic-bezier(0.34,1.56,0.64,1)' }}
          />

          {/* Animated wave on top of water */}
          {clampedPct > 0.02 && (
            <g style={{ transform: `translateY(${fillY - 8}px)`, transition: 'transform 0.9s cubic-bezier(0.34,1.56,0.64,1)' }}>
              <WavePath />
            </g>
          )}

          {/* Bubble particles */}
          {clampedPct > 0.05 && (
            <>
              <Bubble x={35} delay={0} fillY={fillY} />
              <Bubble x={62} delay={0.8} fillY={fillY} />
              <Bubble x={48} delay={1.4} fillY={fillY} />
            </>
          )}

          {/* Shine shimmer on water */}
          <rect
            x="0" y={fillY} width="100" height={fillHeight}
            fill="url(#glass-shine)"
            style={{ transition: 'y 0.9s cubic-bezier(0.34,1.56,0.64,1), height 0.9s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        </g>

        {/* ── Glass outline ── */}
        <path
          d="M14,20 L86,20 L78,150 L22,150 Z"
          fill="none"
          stroke="#B8D8F0"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* ── Rim ── */}
        <rect x="10" y="16" width="80" height="8" rx="4" fill="#D0E8F8" />

        {/* ── Glass shine overlay ── */}
        <path
          d="M18,24 L26,144"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M24,24 L30,100"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.3"
        />

        {/* ── Percentage text inside glass ── */}
        {clampedPct > 0 && (
          <text
            x="50"
            y={Math.max(fillY + 18, 140)}
            textAnchor="middle"
            fontSize="11"
            fontFamily="'DM Mono', monospace"
            fontWeight="500"
            fill={clampedPct > 0.15 ? '#fff' : '#5BBCFF'}
            opacity="0.9"
            style={{ transition: 'y 0.9s cubic-bezier(0.34,1.56,0.64,1)' }}
          >
            {Math.round(clampedPct * 100)}%
          </text>
        )}
      </svg>
    </div>
  )
}

/* Repeating animated wave */
function WavePath() {
  return (
    <svg width="200" height="16" viewBox="0 0 200 16" overflow="visible">
      <style>{`
        @keyframes waveMove {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-100px); }
        }
        .wave-anim {
          animation: waveMove 2s linear infinite;
        }
      `}</style>
      <g className="wave-anim">
        {/* Two copies side-by-side so the loop is seamless */}
        <path
          d="M0,8 C12,2 26,14 40,8 C54,2 66,14 80,8 C94,2 106,14 120,8 C134,2 146,14 160,8 C174,2 186,14 200,8 L200,16 L0,16 Z"
          fill="rgba(255,255,255,0.35)"
        />
        <path
          d="M0,10 C12,4 26,16 40,10 C54,4 66,16 80,10 C94,4 106,16 120,10 C134,4 146,16 160,10 C174,4 186,16 200,10 L200,16 L0,16 Z"
          fill="rgba(255,255,255,0.2)"
        />
      </g>
    </svg>
  )
}

/* Floating bubble */
function Bubble({ x, delay, fillY }) {
  const style = {
    '--bx': `${x}px`,
    '--by': `${fillY + 10}px`,
    '--delay': `${delay}s`,
  }
  return (
    <circle
      cx={x}
      cy={fillY + 20}
      r="2.5"
      fill="rgba(255,255,255,0.5)"
      style={{
        ...style,
        animation: `bubbleRise 2.5s ease-in ${delay}s infinite`,
      }}
    >
      <style>{`
        @keyframes bubbleRise {
          0%   { cy: ${fillY + 40}; opacity: 0.7; r: 2.5; }
          80%  { opacity: 0.4; }
          100% { cy: ${fillY + 2};  opacity: 0;   r: 1.5; }
        }
      `}</style>
      <animate
        attributeName="cy"
        from={fillY + 40}
        to={fillY + 2}
        dur="2.5s"
        begin={`${delay}s`}
        repeatCount="indefinite"
        calcMode="ease-in"
      />
      <animate
        attributeName="opacity"
        values="0;0.7;0.4;0"
        dur="2.5s"
        begin={`${delay}s`}
        repeatCount="indefinite"
      />
    </circle>
  )
}
