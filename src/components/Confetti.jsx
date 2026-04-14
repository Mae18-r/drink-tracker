/**
 * Confetti — 40 CSS-animated pieces that burst outward from center.
 * Triggered on goal reached. No external libraries.
 */

const colors = ['#3148e9', '#5170ff', '#A7B3E8', '#FFD93D', '#FF6B6B', '#FF9F43']

const pieces = Array.from({ length: 40 }, (_, i) => {
  const angle = (360 / 40) * i + Math.random() * 20 - 10
  const distance = 80 + Math.random() * 120
  const tx = Math.cos((angle * Math.PI) / 180) * distance
  const ty = Math.sin((angle * Math.PI) / 180) * distance
  return {
    id: i,
    color: colors[i % colors.length],
    shape: i % 3 === 0 ? 'circle' : i % 3 === 1 ? 'rect' : 'thin',
    tx,
    ty,
    delay: Math.random() * 300,
    rotation: Math.random() * 720 - 360,
    size: 6 + Math.random() * 6,
  }
})

export default function Confetti() {
  return (
    <div className="confetti-wrapper" aria-hidden="true">
      {pieces.map((p) => {
        const isCircle = p.shape === 'circle'
        const isThin   = p.shape === 'thin'
        const w = isCircle ? p.size : isThin ? p.size * 0.3 : p.size
        const h = isCircle ? p.size : isThin ? p.size * 1.8 : p.size * 0.6
        return (
          <div
            key={p.id}
            className="confetti-piece"
            style={{
              width: w,
              height: h,
              background: p.color,
              borderRadius: isCircle ? '50%' : '2px',
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
              '--rot': `${p.rotation}deg`,
              animation: `confettiFly ${800 + p.delay}ms ease-out ${p.delay}ms forwards`,
            }}
          />
        )
      })}
    </div>
  )
}
