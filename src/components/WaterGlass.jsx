/**
 * WaterGlass — hand-drawn SVG glass that echoes the Drunk. logo.
 * Line-art only: strokes, no fills on the glass itself.
 * Water fill is a clipped rect that scales from the bottom.
 * Face (eyes + smile) sits in the lower half, always on top.
 */
export default function WaterGlass({ pct }) {
  const clampedPct = Math.min(1, Math.max(0, pct))

  // Fillable area within the glass interior
  const fillableTop = 26
  const fillableHeight = 120

  // Y position of the water surface (for wave placement)
  const fillY = fillableTop + fillableHeight * (1 - clampedPct)

  // Opacity scales from 0.15 (empty) to 0.85 (full)
  const waterOpacity = 0.15 + 0.70 * clampedPct

  return (
    <div className="water-glass-wrapper">
      <svg
        viewBox="0 0 110 160"
        width="110"
        height="160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`Water glass ${Math.round(clampedPct * 100)}% full`}
      >
        <defs>
          {/*
            Clip path matches the glass interior.
            Slightly inset from the outer stroke path.
          */}
          <clipPath id="glass-clip">
            <path d="M 14,26 C 40,24 70,24 96,26 C 95,82 89,122 85,148 C 68,150 42,150 25,148 C 21,122 15,82 14,26 Z" />
          </clipPath>
        </defs>

        {/* ── Water fill group (clipped to glass interior) ── */}
        <g clipPath="url(#glass-clip)">
          {/*
            Full-height rect scaled from the bottom.
            transformBox + transformOrigin make scaleY grow upward.
          */}
          <rect
            x="-5"
            y={fillableTop}
            width="120"
            height={fillableHeight}
            fill="var(--color-blue)"
            opacity={waterOpacity}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'bottom center',
              transform: `scaleY(${clampedPct})`,
              transition:
                'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.6s ease',
            }}
          />

          {/* Water surface wave — only rendered when there's some water */}
          {clampedPct > 0.02 && (
            <g
              style={{
                transform: `translateY(${fillY - 5}px)`,
                transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              {/*
                Wide wave path (160px) so horizontal oscillation
                never reveals a gap at the edges inside the clip.
              */}
              <path
                className="wave-surface"
                d="M -25,0 C -10,-4 8,4 24,0 C 40,-4 56,4 72,0 C 88,-4 104,4 120,0 C 136,-4 152,4 168,0 L 168,10 L -25,10 Z"
                fill="var(--color-blue)"
                opacity="0.45"
              />
            </g>
          )}
        </g>

        {/*
          ── Glass outer outline ──
          Single <path> — slightly trapezoidal with gentle imperfect
          bezier curves for a hand-drawn, sketchy feel.
          Wider at top (~90px), narrower at bottom (~64px).
        */}
        <path
          d="M 10,24
             C 40,22 70,22 100,24
             C 99,82 91,124 87,150
             C 70,153 40,153 23,150
             C 19,124 11,82 10,24
             Z"
          stroke="var(--color-blue)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/*
          ── Face ──
          Always rendered on top of water fill.
          Sits in the lower half of the glass.
          Eyes: two short vertical dashes.
          Smile: a gentle upward curve.
        */}

        {/* Left eye */}
        <line
          x1="40" y1="110"
          x2="40" y2="118"
          stroke="var(--color-blue)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Right eye */}
        <line
          x1="66" y1="110"
          x2="66" y2="118"
          stroke="var(--color-blue)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Smile */}
        <path
          d="M 40,127 Q 53,137 66,127"
          stroke="var(--color-blue)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}
