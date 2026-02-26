import { useState, useEffect } from 'react'

const CACHE_KEY = 'ramadan_prayer_times'

/**
 * Fetches prayer times from the Aladhan API.
 * Caches the result in localStorage per day.
 */
export function usePrayerTimes(city = 'Dhaka', country = 'BD', method = 2) {
    const [times, setTimes] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]
        const cacheKey = `${CACHE_KEY}_${city}_${today}`

        // Try cache first
        try {
            const cached = localStorage.getItem(cacheKey)
            if (cached) {
                setTimes(JSON.parse(cached))
                setLoading(false)
                return
            }
        } catch { /* ignore */ }

        const dateStr = today.split('-').reverse().join('-') // DD-MM-YYYY

        fetch(
            `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`
        )
            .then(r => {
                if (!r.ok) throw new Error('Network error')
                return r.json()
            })
            .then(data => {
                const t = data.data.timings
                const key5 = {
                    Fajr: t.Fajr,
                    Dhuhr: t.Dhuhr,
                    Asr: t.Asr,
                    Maghrib: t.Maghrib,
                    Isha: t.Isha,
                }
                setTimes(key5)
                localStorage.setItem(cacheKey, JSON.stringify(key5))
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }, [city, country, method])

    return { times, loading, error }
}

/**
 * Given times object, returns the name of the next upcoming prayer.
 */
export function getNextPrayer(times) {
    if (!times) return null
    const now = new Date()
    const nowMinutes = now.getHours() * 60 + now.getMinutes()

    for (const [name, time] of Object.entries(times)) {
        const [h, m] = time.split(':').map(Number)
        const prayerMinutes = h * 60 + m
        if (prayerMinutes > nowMinutes) return name
    }
    return 'Fajr' // next day
}

/**
 * Format "04:30" → "4:30 AM"
 */
export function formatTime(timeStr) {
    if (!timeStr) return ''
    const [h, m] = timeStr.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 || 12
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}
