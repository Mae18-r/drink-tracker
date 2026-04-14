import { useState, useEffect } from 'react'
import SetupScreen from './components/SetupScreen.jsx'
import Dashboard from './components/Dashboard.jsx'
import BackgroundSwirls from './components/BackgroundSwirls.jsx'

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

export default function App() {
  const [appData, setAppData] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = loadData()
    setAppData(stored)
    setReady(true)
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
  }

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setAppData(null)
  }

  if (!ready) return null

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
