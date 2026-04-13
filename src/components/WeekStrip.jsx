/**
 * Weekly strip — 7 day pills, Mon→Sun.
 * Today has a ring highlight. Goal-met days fill with sky blue + checkmark.
 */
export default function WeekStrip({ history, goal, todayKey }) {
  const days = getWeekDays(todayKey)

  return (
    <div className="week-strip-section">
      <span className="week-strip-label">This week</span>
      <div className="week-strip">
        {days.map(({ key, label, isToday }) => {
          const amount = history[key] ?? 0
          const goalMet = amount >= goal

          return (
            <div
              key={key}
              className={[
                'day-pill',
                isToday ? 'today' : '',
                goalMet ? 'goal-met' : '',
              ].filter(Boolean).join(' ')}
              title={`${label}: ${amount} — ${goalMet ? 'Goal met!' : `${goal - amount} to go`}`}
            >
              <span className="day-pill-name">{label}</span>
              {goalMet ? (
                <span className="day-pill-icon">✓</span>
              ) : (
                <div className="day-pill-dot" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function getWeekDays(todayKey) {
  const today = new Date(todayKey + 'T12:00:00')
  // Monday = 0, Sunday = 6
  const dayOfWeek = (today.getDay() + 6) % 7  // convert Sun=0 to Mon=0
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek)

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return labels.map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return { key, label, isToday: key === todayKey }
  })
}
