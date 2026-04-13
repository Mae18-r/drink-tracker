import { useState, useEffect, useRef } from 'react'
import WaterGlass from './WaterGlass.jsx'
import WeekStrip from './WeekStrip.jsx'
import BenefitCard from './BenefitCard.jsx'
import { getTodayKey } from '../App.jsx'

export default function Dashboard({ config, history, onUpdateHistory, onReset }) {
  const todayKey = getTodayKey()
  const todayAmount = history[todayKey] ?? 0
  const pct = config.goal > 0 ? todayAmount / config.goal : 0

  const [showSettings, setShowSettings] = useState(false)
  const [showBurst, setShowBurst] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const prevPct = useRef(pct)

  // Ensure today exists in history
  useEffect(() => {
    if (!(todayKey in history)) {
      onUpdateHistory({ ...history, [todayKey]: 0 })
    }
  }, [todayKey]) // eslint-disable-line

  // Trigger celebration burst when goal first reached
  useEffect(() => {
    if (prevPct.current < 1 && pct >= 1) {
      setJustCompleted(true)
      setShowBurst(true)
      setTimeout(() => setShowBurst(false), 800)
      setTimeout(() => setJustCompleted(false), 4000)
    }
    prevPct.current = pct
  }, [pct])

  const handleDrink = () => {
    const updated = { ...history, [todayKey]: todayAmount + config.vesselSize }
    onUpdateHistory(updated)
  }

  const handleUndo = () => {
    const newAmount = Math.max(0, todayAmount - config.vesselSize)
    onUpdateHistory({ ...history, [todayKey]: newAmount })
  }

  // --- Weekly stats ---
  const weekDays = getWeekDays(todayKey)
  const weekAmounts = weekDays.map(k => history[k] ?? 0)
  const weekTotal = weekAmounts.reduce((s, v) => s + v, 0)
  const goalsHit = weekAmounts.filter(v => v >= config.goal).length
  const weekAvg = Math.round(weekTotal / 7)

  // How many vessels remain
  const remaining = Math.max(0, config.goal - todayAmount)
  const vesselsLeft = remaining > 0 ? Math.ceil(remaining / config.vesselSize) : 0

  // Status message
  const getStatusMessage = () => {
    if (todayAmount === 0) return "nothing yet. your body is waiting."
    if (vesselsLeft <= 2) return "so close. don't give up now."
    return "you've got this. probably."
  }

  // Format amount for display
  const displayAmount = (val) => {
    if (config.unit === 'oz') return `${val} oz`
    if (val >= 1000) return `${(val / 1000).toFixed(1).replace(/\.0$/, '')} L`
    return `${val} ml`
  }

  const dateLabel = formatDate(todayKey)

  return (
    <>
      {/* CSS-only celebration burst */}
      {showBurst && (
        <div className="burst-container" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className={`burst-dot burst-dot-${i}`} />
          ))}
        </div>
      )}

      <div className="dashboard">
        {/* App Bar */}
        <div className="app-bar">
          <img src="/Logo_Drunk_app.png" alt="Drunk." className="logo" />
          <button
            className="settings-btn"
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
          >
            <SettingsIcon />
          </button>
        </div>

        <p className="today-date">{dateLabel}</p>

        {/* Water Glass + Amount */}
        <div className="glass-section">
          <WaterGlass pct={pct} />

          <div className="water-amount">
            {config.unit === 'oz'
              ? <>{todayAmount}<span> oz</span></>
              : todayAmount >= 1000
                ? <>{(todayAmount / 1000).toFixed(1).replace(/\.0$/, '')}<span> L</span></>
                : <>{todayAmount}<span> ml</span></>
            }
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div
              className="progress-bar-wrap"
              style={{ width: 200 }}
              role="progressbar"
              aria-valuenow={Math.round(pct * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(100, Math.round(pct * 100))}%` }}
              />
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', fontWeight: 600 }}>
              of {displayAmount(config.goal)} goal
            </p>
          </div>

          {pct >= 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <p className="celebration-heading">you actually did it.</p>
              <p className="celebration-sub">your kidneys are throwing a little party right now.</p>
            </div>
          ) : (
            <p className="goal-status">{getStatusMessage()}</p>
          )}
        </div>

        {/* Drink CTA */}
        <div className="drink-cta-wrap">
          <button className="drink-btn" onClick={handleDrink}>
            + I drank my {config.vesselName}
          </button>
          <button
            className="undo-btn"
            onClick={handleUndo}
            disabled={todayAmount === 0}
          >
            wait, I lied ↩
          </button>
        </div>

        {/* Week Strip */}
        <WeekStrip history={history} goal={config.goal} todayKey={todayKey} />

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-chip">
            <span className="stat-chip-value">{formatStatAmount(weekTotal, config.unit)}</span>
            <span className="stat-chip-label">This week</span>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-value">{goalsHit}/7</span>
            <span className="stat-chip-label">Goals hit</span>
          </div>
          <div className="stat-chip">
            <span className="stat-chip-value">{formatStatAmount(weekAvg, config.unit)}</span>
            <span className="stat-chip-label">Avg / day</span>
          </div>
        </div>

        {/* Benefit Card */}
        <BenefitCard />
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          config={config}
          onClose={() => setShowSettings(false)}
          onReset={onReset}
        />
      )}
    </>
  )
}

function SettingsModal({ config, onClose, onReset }) {
  const handleReset = () => {
    if (window.confirm('Reset all data and start over?')) {
      onReset()
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet" role="dialog" aria-modal="true" aria-label="Settings">
        <div className="modal-handle" />
        <h2 className="modal-title">Settings</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <InfoRow label="Daily goal" value={config.unit === 'oz' ? `${config.goal} oz` : `${config.goal} ml`} />
          <InfoRow label="Unit" value={config.unit === 'oz' ? 'fl oz' : 'ml / L'} />
          <InfoRow label="Vessel" value={`${config.vesselName} (${config.unit === 'oz' ? config.vesselSize + ' oz' : config.vesselSize + ' ml'})`} />
        </div>

        <button className="modal-reset-btn" onClick={handleReset}>
          Reset & start over
        </button>

        <button className="modal-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '1px solid var(--color-border)',
    }}>
      <span style={{ fontSize: 14, color: 'var(--color-ink-soft)', fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-ink)' }}>{value}</span>
    </div>
  )
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  )
}

function formatDate(dateKey) {
  const d = new Date(dateKey + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function formatStatAmount(val, unit) {
  if (unit === 'oz') return `${val}oz`
  if (val >= 1000) return `${(val / 1000).toFixed(1).replace(/\.0$/, '')}L`
  return `${val}ml`
}

function getWeekDays(todayKey) {
  const today = new Date(todayKey + 'T12:00:00')
  const dayOfWeek = (today.getDay() + 6) % 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  })
}
