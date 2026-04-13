const BENEFITS = [
  {
    text: 'Even mild dehydration can cause fatigue. Staying hydrated keeps your cells energized and your mind sharp.',
  },
  {
    text: 'Water flushes out toxins and keeps skin cells plump — the easiest skincare step you can take.',
  },
  {
    text: 'Your brain is ~75% water. Proper hydration improves concentration, memory, and reaction time.',
  },
  {
    text: 'Water helps break down food and absorb nutrients, keeping your gut happy and moving smoothly.',
  },
  {
    text: 'Drinking water before meals reduces appetite and boosts metabolism by up to 30% for an hour.',
  },
  {
    text: 'Cartilage in joints is ~80% water. Staying hydrated reduces friction and eases stiffness.',
  },
  {
    text: 'Sweat and respiration use water to cool you down. Hydration keeps your thermostat working perfectly.',
  },
  {
    text: 'Many headaches are triggered by dehydration. A glass of water can stop one before it starts.',
  },
  {
    text: 'Your kidneys filter ~200 liters of blood daily — water helps them flush waste efficiently.',
  },
  {
    text: 'Studies show that even slight dehydration worsens mood, increases anxiety, and reduces calm.',
  },
  {
    text: 'Muscles are ~79% water. Hydration prevents cramps, improves endurance, and speeds recovery.',
  },
  {
    text: 'Well-hydrated blood flows more easily, reducing strain on your heart and lowering clot risk.',
  },
]

export default function BenefitCard() {
  // Pick a tip per session (randomized on app load, stable within session)
  const index = getSessionIndex(BENEFITS.length)
  const benefit = BENEFITS[index]

  return (
    <div className="benefit-card">
      <p className="benefit-title">did you know?</p>
      <p className="benefit-text">{benefit.text}</p>
    </div>
  )
}

// Stable random index per page load
let _sessionIndex = null
function getSessionIndex(max) {
  if (_sessionIndex === null) {
    _sessionIndex = Math.floor(Math.random() * max)
  }
  return _sessionIndex
}
