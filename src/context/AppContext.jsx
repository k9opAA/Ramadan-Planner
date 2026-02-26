import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// ─── Default task templates ─────────────────────────────────────────────────
const DEFAULT_TASKS = [
    // Ibadah
    { id: 'fajr', category: 'ibadah', label: 'Fajr Salah', icon: '🌙' },
    { id: 'dhuhr', category: 'ibadah', label: 'Dhuhr Salah', icon: '☀️' },
    { id: 'asr', category: 'ibadah', label: 'Asr Salah', icon: '🌤' },
    { id: 'maghrib', category: 'ibadah', label: 'Maghrib Salah', icon: '🌅' },
    { id: 'isha', category: 'ibadah', label: 'Isha Salah', icon: '⭐' },
    { id: 'tarawih', category: 'ibadah', label: 'Tarawih Prayer', icon: '🤲' },
    { id: 'quran5', category: 'ibadah', label: 'Quran – 5 pages', icon: '📖' },
    { id: 'dhikr', category: 'ibadah', label: 'Morning Dhikr', icon: '💫' },
    // Health
    { id: 'suhoor', category: 'health', label: 'Eat Suhoor', icon: '🥣' },
    { id: 'iftar', category: 'health', label: 'Break Fast (Iftar)', icon: '🍽' },
    { id: 'water', category: 'health', label: 'Drink 8 glasses', icon: '💧' },
    { id: 'sleep', category: 'health', label: 'Sleep by 11 PM', icon: '😴' },
    // Personal (starter)
    { id: 'gratitude', category: 'personal', label: 'Write gratitude', icon: '✍️' },
    { id: 'charity', category: 'personal', label: 'Give charity', icon: '🤝' },
]

// Ramadan 1447 AH starts 2026-02-28 (first tarawih night 2026-02-27)
const RAMADAN_START = new Date('2026-02-28')

function getTodayKey() {
    return new Date().toISOString().split('T')[0]
}

function getRamadanDay() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(RAMADAN_START)
    start.setHours(0, 0, 0, 0)
    const diff = Math.floor((today - start) / 86400000) + 1
    return Math.max(1, Math.min(30, diff))
}

// ─── Context ────────────────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
    const todayKey = getTodayKey()

    // ── completed tasks per day: { '2026-02-28': Set(['fajr', ...]) }
    const [completedMap, setCompletedMap] = useState(() => {
        try {
            const raw = localStorage.getItem('ramadan_completed')
            if (!raw) return {}
            const parsed = JSON.parse(raw)
            // Re-hydrate arrays → Sets
            return Object.fromEntries(Object.entries(parsed).map(([d, arr]) => [d, new Set(arr)]))
        } catch { return {} }
    })

    // ── custom personal tasks
    const [customTasks, setCustomTasks] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('ramadan_custom_tasks') || '[]')
        } catch { return [] }
    })

    // ── reflections per day: { '2026-02-28': 'text...' }
    const [reflections, setReflections] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('ramadan_reflections') || '{}')
        } catch { return {} }
    })

    // ── active section for sidebar navigation
    const [activeSection, setActiveSection] = useState('dashboard')

    // ── persist
    useEffect(() => {
        const serialisable = Object.fromEntries(
            Object.entries(completedMap).map(([d, s]) => [d, [...s]])
        )
        localStorage.setItem('ramadan_completed', JSON.stringify(serialisable))
    }, [completedMap])

    useEffect(() => {
        localStorage.setItem('ramadan_custom_tasks', JSON.stringify(customTasks))
    }, [customTasks])

    useEffect(() => {
        localStorage.setItem('ramadan_reflections', JSON.stringify(reflections))
    }, [reflections])

    // ── helpers
    const todayCompleted = completedMap[todayKey] || new Set()

    const toggleTask = useCallback((id) => {
        setCompletedMap(prev => {
            const daySet = new Set(prev[todayKey] || [])
            daySet.has(id) ? daySet.delete(id) : daySet.add(id)
            return { ...prev, [todayKey]: daySet }
        })
    }, [todayKey])

    const allTasks = [...DEFAULT_TASKS, ...customTasks]

    const addCustomTask = useCallback((label, icon = '📌') => {
        const newTask = {
            id: `custom_${Date.now()}`,
            category: 'personal',
            label,
            icon,
        }
        setCustomTasks(prev => [...prev, newTask])
    }, [])

    const removeCustomTask = useCallback((id) => {
        setCustomTasks(prev => prev.filter(t => t.id !== id))
    }, [])

    const todayReflection = reflections[todayKey] || ''
    const setTodayReflection = useCallback((text) => {
        setReflections(prev => ({ ...prev, [todayKey]: text }))
    }, [todayKey])

    // ── 30-day progress data
    const ramadanProgress = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(RAMADAN_START)
        date.setDate(date.getDate() + i)
        const key = date.toISOString().split('T')[0]
        const done = (completedMap[key] || new Set()).size
        const total = allTasks.length
        return { day: i + 1, date: key, done, total, pct: total > 0 ? done / total : 0 }
    })

    return (
        <AppContext.Provider value={{
            allTasks,
            todayCompleted,
            toggleTask,
            addCustomTask,
            removeCustomTask,
            todayReflection,
            setTodayReflection,
            ramadanDay: getRamadanDay(),
            ramadanProgress,
            activeSection,
            setActiveSection,
            RAMADAN_START,
        }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const ctx = useContext(AppContext)
    if (!ctx) throw new Error('useApp must be used within AppProvider')
    return ctx
}
