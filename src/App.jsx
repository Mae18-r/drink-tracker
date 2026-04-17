import { useState, useEffect } from 'react'
import SetupScreen from './components/SetupScreen.jsx'
import Dashboard from './components/Dashboard.jsx'
import BackgroundSwirls from './components/BackgroundSwirls.jsx'
import { supabase } from './supabase.js'

const STORAGE_KEY = 'drink_tracker_data'

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

async function saveToSupabase(date, amount, config) {
  const { error } = await supabase
    .from('water_logs')
    .upsert({
      date,
      amount,
      goal: config.goal,
      container_size: config.vesselSize,
      container_name: config.vesselName,
      goal_unit: config.unit,
    }, { onConflict: 'date' })

  if (error) console.error('Supabase save error:', error)
}

async function loadFromSupabase() {
  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .order('date', { ascending: false })
    .limit(30)

  if (error) {
    console.error('Supabase load error:', error)
    return null
  }

  const history = {}
  data.forEach(row => { history[row.date] = row.amount })
  return history
}

export default function App() {
  const [appData, setAppData] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = loadData()

    if (stored?.config) {
      loadFromSupabase().then(supabaseHistory => {
        if (supabaseHistory) {
          const merged = { ...stored, history: { ...stored.history, ...supabaseHistory } }
          saveData(merged)
          setAppData(merged)
        } else {
          setAppData(stored)
        }
        setReady(true)
      })
    } else {
      setAppData(stored)
      setReady(true)
    }
  }, [])

  const handleSetupComplete = (config) => {
    const today = getTodayKey()
    const newData = {
      config,
      history: { [today]: 0 },
    }
    saveData(newData)
    setAppData(newData)
  }

  const handleUpdateHistory = (newHistory) => {
    const updated = { ...appData, history: newHistory }
    saveData(updated)
    setAppData(updated)
    const todayKey = getTodayKey()
    if (todayKey in newHistory) {
      saveToSupabase(todayKey, newHistory[todayKey], appData.config)
    }
  }

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAppData(null)
  }

  if (!ready) return (
    <>
      <BackgroundSwirls />
      <div className="app-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh' }}>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-soft)', fontSize: '16px' }}>loading...</p>
      </div>
    </>
  )

  return (
    <>
      <BackgroundSwirls />
      <div className="app-wrapper">
        {!appData?.config
          ? <SetupScreen onComplete={handleSetupComplete} />
          : <Dashboard
              config={appData.config}
              history={appData.history}
              onUpdateHistory={handleUpdateHistory}
              onReset={handleReset}
            />
        }
      </div>
    </>
  )
}

export function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
