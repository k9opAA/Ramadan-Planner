import { useState } from 'react'
import { motion } from 'framer-motion'
import { usePrayerTimes, getNextPrayer, formatTime } from '../../hooks/usePrayerTimes'
import { MapPin, Clock, Loader2, AlertCircle, ChevronDown } from 'lucide-react'

const PRAYER_ICONS = {
  Fajr:    { emoji: '🌙', label: 'Fajr',    color: 'text-violet-400', bg: 'bg-violet-500/10',  border: 'border-violet-500/20'  },
  Dhuhr:   { emoji: '☀️', label: 'Dhuhr',   color: 'text-yellow-400', bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20'  },
  Asr:     { emoji: '🌤', label: 'Asr',     color: 'text-sky-400',    bg: 'bg-sky-500/10',     border: 'border-sky-500/20'     },
  Maghrib: { emoji: '🌅', label: 'Maghrib', color: 'text-rose-400',   bg: 'bg-rose-500/10',    border: 'border-rose-500/20'    },
  Isha:    { emoji: '⭐', label: 'Isha',    color: 'text-emerald-400',bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
}

const CITIES = [
  { city: 'Dhaka',    country: 'BD', method: 1 },
  { city: 'Mecca',    country: 'SA', method: 4 },
  { city: 'London',   country: 'GB', method: 2 },
  { city: 'Istanbul', country: 'TR', method: 13 },
  { city: 'Cairo',    country: 'EG', method: 5 },
  { city: 'Dubai',    country: 'AE', method: 8 },
]

export default function PrayerTimesCard() {
  const [cityIdx, setCityIdx] = useState(0)
  const [showCityMenu, setShowCityMenu] = useState(false)
  const selected = CITIES[cityIdx]

  const { times, loading, error } = usePrayerTimes(selected.city, selected.country, selected.method)
  const nextPrayer = getNextPrayer(times)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl overflow-hidden border border-[#334155]/30"
    >
      {/* Header */}
      <div className="px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between border-b border-[#334155]/20 bg-[#1e293b]/20">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Prayer Times</h3>
        </div>

        {/* City selector */}
        <div className="relative">
          <button
            onClick={() => setShowCityMenu(v => !v)}
            className="flex items-center gap-1 text-xs text-[#64748b] hover:text-[#cbd5e1] transition-colors cursor-pointer"
          >
            <MapPin size={11} className="text-emerald-400" />
            {selected.city}
            <ChevronDown size={11} className={`transition-transform ${showCityMenu ? 'rotate-180' : ''}`} />
          </button>

          {showCityMenu && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-full mt-2 w-32 glass-dark border border-[#475569]/30 rounded-xl overflow-hidden z-10 shadow-xl"
            >
              {CITIES.map((c, i) => (
                <button
                  key={i}
                  onClick={() => { setCityIdx(i); setShowCityMenu(false) }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                    i === cityIdx
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'text-[#64748b] hover:bg-[#334155]/50 hover:text-[#cbd5e1]'
                  }`}
                >
                  {c.city}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-3 sm:p-4">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-7 text-[#64748b]">
            <Loader2 size={15} className="animate-spin text-emerald-400" />
            <span className="text-sm">Fetching prayer times…</span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 py-5 px-2 text-rose-400 text-xs sm:text-sm">
            <AlertCircle size={14} />
            <span>Could not load times. Check your connection.</span>
          </div>
        )}

        {times && !loading && (
          <div className="space-y-1.5 sm:space-y-2">
            {Object.entries(times).map(([name, time]) => {
              const info = PRAYER_ICONS[name]
              const isNext = name === nextPrayer
              return (
                <motion.div
                  key={name}
                  layout
                  className={`flex items-center gap-2.5 sm:gap-3 px-3 py-2 sm:py-2.5 rounded-xl border transition-all duration-200 ${
                    isNext
                      ? `${info.bg} ${info.border} prayer-next`
                      : 'bg-[#1e293b]/20 border-[#334155]/20'
                  }`}
                >
                  <span className="text-base leading-none">{info.emoji}</span>
                  <p className={`flex-1 text-xs font-semibold ${isNext ? info.color : 'text-[#94a3b8]'}`}>
                    {info.label}
                    {isNext && <span className="ml-2 text-[9px] uppercase tracking-wider opacity-70">Next</span>}
                  </p>
                  <p className={`text-xs sm:text-sm font-mono font-medium tabular-nums ${isNext ? info.color : 'text-[#64748b]'}`}>
                    {formatTime(time)}
                  </p>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}
