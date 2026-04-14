/**
 * BackgroundSwirls — decorative fluid blob shapes behind all content.
 * position: fixed, z-index: -1, pointer-events: none, static (no animation).
 */
export default function BackgroundSwirls() {
  return (
    <div className="bg-swirls-container" aria-hidden="true">

      {/* ── Shape 1: top-right fluid blob ── */}
      {/* Soft radial gradient from #5170ff → #A7B3E8, opacity 0.18 */}
      <svg
        viewBox="0 0 320 320"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: '-80px', right: '-80px', width: '340px' }}
      >
        <defs>
          <radialGradient id="blobGrad1" cx="50%" cy="45%" r="55%">
            <stop offset="0%"   stopColor="#5170ff" />
            <stop offset="100%" stopColor="#A7B3E8" />
          </radialGradient>
        </defs>
        <path
          d="M 168,18
             C 238,4 316,58 302,142
             C 288,226 218,298 142,284
             C 66,270 4,206 14,130
             C 24,54 82,28 168,18 Z"
          fill="url(#blobGrad1)"
          opacity="0.18"
        />
      </svg>

      {/* ── Shape 2: bottom-left flowing swirl ── */}
      {/* Fill #3148e9, opacity 0.10 */}
      <svg
        viewBox="0 0 290 290"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '290px' }}
      >
        <path
          d="M 96,18
             C 174,2 278,52 272,136
             C 266,220 194,282 116,272
             C 38,262 -16,190 8,116
             C 28,50 40,30 96,18 Z"
          fill="#3148e9"
          opacity="0.10"
        />
      </svg>

      {/* ── Shape 3: middle-right elongated ribbon ── */}
      {/* Fill #A7B3E8, opacity 0.12 */}
      <svg
        viewBox="0 0 90 380"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', top: '22%', right: '-28px', width: '88px' }}
      >
        <path
          d="M 58,8
             C 88,16 92,58 78,104
             C 64,150 28,168 26,218
             C 24,268 62,292 58,338
             C 54,366 18,378 10,342
             C 2,306 34,276 36,226
             C 38,176 6,152 8,104
             C 10,56 22,0 58,8 Z"
          fill="#A7B3E8"
          opacity="0.12"
        />
      </svg>

    </div>
  )
}
