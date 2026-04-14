import { useState } from 'react'

const OZ_PRESETS = [
  { label: '64 oz', value: 64 },
  { label: '80 oz', value: 80 },
  { label: '100 oz', value: 100 },
]

const ML_PRESETS = [
  { label: '2 L', value: 2000 },
  { label: '2.5 L', value: 2500 },
  { label: '3 L', value: 3000 },
]

const VESSEL_PRESETS = [
  { name: 'Small Glass', sizeOz: 8, sizeMl: 237 },
  { name: 'Regular Glass', sizeOz: 12, sizeMl: 355 },
  { name: 'Stanley 30', sizeOz: 30, sizeMl: 887 },
  { name: 'Stanley 40', sizeOz: 40, sizeMl: 1182 },
  { name: 'Bottle 500ml', sizeOz: 17, sizeMl: 500 },
  { name: 'Large 1L', sizeOz: 34, sizeMl: 1000 },
]

export default function SetupScreen({ onComplete }) {
  const [unit, setUnit] = useState('ml')
  const [goalPreset, setGoalPreset] = useState(null)
  const [customGoal, setCustomGoal] = useState('')

  const [vesselPreset, setVesselPreset] = useState(null)
  const [vesselName, setVesselName] = useState('')
  const [vesselSize, setVesselSize] = useState('')

  const goalPresets = unit === 'oz' ? OZ_PRESETS : ML_PRESETS

  const handleGoalPreset = (preset) => {
    setGoalPreset(preset)
    setCustomGoal(String(preset.value))
  }

  const handleVesselPreset = (v) => {
    setVesselPreset(v)
    setVesselName(v.name)
    setVesselSize(unit === 'oz' ? String(v.sizeOz) : String(v.sizeMl))
  }

  const handleUnitChange = (u) => {
    setUnit(u)
    setGoalPreset(null)
    setCustomGoal('')
    if (vesselPreset) {
      setVesselSize(u === 'oz' ? String(vesselPreset.sizeOz) : String(vesselPreset.sizeMl))
    }
  }

  const goalValue = customGoal ? parseInt(customGoal, 10) : null
  const vesselSizeValue = vesselSize ? parseInt(vesselSize, 10) : null
  const canSubmit =
    goalValue && goalValue > 0 &&
    vesselName.trim().length > 0 &&
    vesselSizeValue && vesselSizeValue > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    onComplete({
      unit,
      goal: goalValue,
      vesselName: vesselName.trim(),
      vesselSize: vesselSizeValue,
    })
  }

  return (
    <div className="setup-screen">
      {/* Hero */}
      <div className="setup-hero">
        <img src="/drunk logo design trans.png" alt="Drunk." className="logo-large" />
        <h1 className="setup-title">let's get you hydrated.</h1>
      </div>

      {/* Goal Card */}
      <div className="setup-card">
        <p className="setup-card-title">how much water are you aiming for today?</p>

        {/* Unit Toggle */}
        <div className="unit-toggle">
          <button
            className={`unit-toggle-btn ${unit === 'ml' ? 'active' : ''}`}
            onClick={() => handleUnitChange('ml')}
          >
            ml / L
          </button>
          <button
            className={`unit-toggle-btn ${unit === 'oz' ? 'active' : ''}`}
            onClick={() => handleUnitChange('oz')}
          >
            fl oz
          </button>
        </div>

        {/* Presets */}
        <div className="preset-pills">
          {goalPresets.map((p) => (
            <button
              key={p.value}
              className={`preset-pill ${goalPreset?.value === p.value ? 'selected' : ''}`}
              onClick={() => handleGoalPreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom */}
        <div className="input-group">
          <label>or enter custom amount</label>
          <input
            className="input-field"
            type="number"
            min="1"
            placeholder={unit === 'oz' ? 'e.g. 90' : 'e.g. 2200'}
            value={customGoal}
            onChange={(e) => {
              setCustomGoal(e.target.value)
              setGoalPreset(null)
            }}
          />
        </div>
      </div>

      {/* Vessel Card */}
      <div className="setup-card">
        <p className="setup-card-title">what are you drinking from?</p>

        {/* Vessel Presets */}
        <div className="vessel-chips">
          {VESSEL_PRESETS.map((v) => (
            <button
              key={v.name}
              className={`vessel-chip ${vesselPreset?.name === v.name ? 'selected' : ''}`}
              onClick={() => handleVesselPreset(v)}
            >
              <span className="vessel-chip-name">{v.name}</span>
              <span className="vessel-chip-size">
                {unit === 'oz' ? `${v.sizeOz} oz` : `${v.sizeMl} ml`}
              </span>
            </button>
          ))}
        </div>

        {/* Custom vessel */}
        <div className="custom-input-row">
          <div className="input-group">
            <label>name it</label>
            <input
              className="input-field"
              type="text"
              placeholder="my beloved Stanley, my sad office mug..."
              value={vesselName}
              onChange={(e) => setVesselName(e.target.value)}
            />
          </div>
          <div className="input-group" style={{ maxWidth: '90px' }}>
            <label>{unit === 'oz' ? 'oz' : 'ml'}</label>
            <input
              className="input-field"
              type="number"
              min="1"
              placeholder={unit === 'oz' ? '12' : '350'}
              value={vesselSize}
              onChange={(e) => {
                setVesselSize(e.target.value)
                setVesselPreset(null)
              }}
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className="cta-btn" onClick={handleSubmit} disabled={!canSubmit}>
        I'm ready, let's go →
      </button>
    </div>
  )
}
