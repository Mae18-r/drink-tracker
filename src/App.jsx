import { useState, useEffect } from 'react'
import SetupScreen from './components/SetupScreen.jsx'
import Dashboard from './components/Dashboard.jsx'
import BackgroundSwirls from './components/BackgroundSwirls.jsx'
import { supabase } from './supabase.js'

const STORAGE_KEY = 'drink_tracker_data'

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveToLocalStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

async function saveToSupabase(date, amount, config) {
  try {
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

    if (error) throw error
    console.log('Supabase save success')
  } catch (err) {
    console.warn('Supabase save error:', err)
    console.log('Supabase save error — full object:', JSON.stringify(err, null, 2))
  }
}

async function loadFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('water_logs')
      .select('*')
      .order('date', { ascending: false })
      .limit(30)

    if (error) throw error

    const history = {}
    data.forEach(row => { history[row.date] = row.amount })
    return history
  } catch (err) {
    console.warn('Supabase load error, using localStorage:', err)
    return null
  }
}

export default function App() {
  const [appData, setAppData] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        const stored = loadFromLocalStorage()

        if (stored?.config) {
          const supabaseHistory = await loadFromSupabase()
          if (supabaseHistory) {
            const merged = { ...stored, history: { ...stored.history, ...supabaseHistory } }
            saveToLocalStorage(merged)
            setAppData(merged)
          } else {
            setAppData(stored)
          }
        } else {
          setAppData(stored)
        }
      } catch (err) {
        console.warn('Init error, falling back to localStorage:', err)
        setAppData(loadFromLocalStorage())
      } finally {
        setReady(true)
      }
    }
    init()
  }, [])

  const handleSetupComplete = (config) => {
    const today = getTodayKey()
    const newData = {
      config,
      history: { [today]: 0 },
    }
    saveToLocalStorage(newData)
    setAppData(newData)
  }

  const handleUpdateHistory = (newHistory) => {
    const updated = { ...appData, history: newHistory }
    saveToLocalStorage(updated)
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
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'Fredoka', color: '#6b6b6b' }}>
      loading...
    </div>
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
