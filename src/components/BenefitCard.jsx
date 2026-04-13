const BENEFITS = [
  {
    title: 'Boosts energy levels',
    text: 'Even mild dehydration can cause fatigue. Staying hydrated keeps your cells energized and your mind sharp.',
  },
  {
    title: 'Clears your skin',
    text: 'Water flushes out toxins and keeps skin cells plump — the easiest skincare step you can take.',
  },
  {
    title: 'Sharpens focus',
    text: 'Your brain is ~75% water. Proper hydration improves concentration, memory, and reaction time.',
  },
  {
    title: 'Aids digestion',
    text: 'Water helps break down food and absorb nutrients, keeping your gut happy and moving smoothly.',
  },
  {
    title: 'Supports weight goals',
    text: 'Drinking water before meals reduces appetite and boosts metabolism by up to 30% for an hour.',
  },
  {
    title: 'Lubricates joints',
    text: 'Cartilage in joints is ~80% water. Staying hydrated reduces friction and eases stiffness.',
  },
  {
    title: 'Regulates body temperature',
    text: 'Sweat and respiration use water to cool you down. Hydration keeps your thermostat working perfectly.',
  },
  {
    title: 'Prevents headaches',
    text: 'Many headaches are triggered by dehydration. A glass of water can stop a headache before it starts.',
  },
  {
    title: 'Flushes out toxins',
    text: 'Your kidneys filter ~200 liters of blood daily — water helps them flush waste as urine.',
  },
  {
    title: 'Improves mood',
    text: 'Studies show that even slight dehydration worsens mood, increases anxiety, and reduces calm.',
  },
  {
    title: 'Strengthens muscles',
    text: 'Muscles are ~79% water. Hydration prevents cramps, improves endurance, and speeds recovery.',
  },
  {
    title: 'Protects your heart',
    text: 'Well-hydrated blood flows more easily, reducing strain on your heart and lowering clot risk.',
  },
]

export default function BenefitCard() {
  // Pick a tip per session (randomized on app load, stable within session)
  const index = getSessionIndex(BENEFITS.length)
  const benefit = BENEFITS[index]

  return (
    <div className="benefit-card">
      <span className="benefit-icon">💡</span>
      <div className="benefit-content">
        <p className="benefit-title">{benefit.title}</p>
        <p className="benefit-text">{benefit.text}</p>
      </div>
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
