import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import ProgressBar from './ProgressBar'
import { TrendingUp, Calendar } from 'lucide-react'

const CATEGORY_BARS = [
  { id: 'ibadah',   label: 'Ibadah',   colorClass: 'bg-emerald-500', emoji: '🕌' },
  { id: 'health',   label: 'Health',   colorClass: 'bg-sky-400',     emoji: '💧' },
  { id: 'personal', label: 'Personal', colorClass: 'bg-violet-400',  emoji: '✨' },
]

function getDayColor(pct) {
  if (pct === 0)  return 'bg-[#1e293b]/50 border-[#1e293b]/30'
  if (pct < 0.4)  return 'bg-emerald-900/40 border-emerald-800/30'
  if (pct < 0.75) return 'bg-emerald-700/50 border-emerald-600/40'
  return 'bg-emerald-500/70 border-emerald-400/40 glow-emerald-sm'
}

export default function ProgressTracker() {
  const { ramadanProgress, allTasks, todayCompleted, ramadanDay } = useApp()

  const overallDone = todayCompleted.size
  const overallTotal = allTasks.length
  const overallPct = overallTotal > 0 ? overallDone / overallTotal : 0

  const catBars = CATEGORY_BARS.map(cat => {
    const catTasks = allTasks.filter(t => t.category === cat.id)
    const catDone = catTasks.filter(t => todayCompleted.has(t.id)).length
    return { ...cat, done: catDone, total: catTasks.length, pct: catTasks.length ? catDone / catTasks.length : 0 }
  })

  return (
    <div className="space-y-5 md:space-y-6">
      {/* Today's overall */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-2xl p-4 sm:p-5 border border-emerald-500/15"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Today's Progress</h3>
          <span className="ml-auto text-xs text-[#64748b]">Day {ramadanDay}</span>
        </div>

        {/* Circle + bar */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(51,65,85,0.6)" strokeWidth="6" />
              <motion.circle
                cx="32" cy="32" r="26"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 26}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - overallPct) }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs sm:text-sm font-bold text-emerald-400">{Math.round(overallPct * 100)}%</span>
            </div>
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-white font-semibold">{overallDone} / {overallTotal}</p>
            <p className="text-[#64748b] text-xs">tasks completed today</p>
          </div>
        </div>

        <div className="space-y-3">
          {catBars.map(cat => (
            <ProgressBar key={cat.id} value={cat.pct} colorClass={cat.colorClass}
              label={`${cat.emoji} ${cat.label}`} done={cat.done} total={cat.total} />
          ))}
        </div>
      </motion.div>

      {/* 30-day grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="glass rounded-2xl p-4 sm:p-5 border border-[#334155]/30"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-[#64748b]" />
          <h3 className="text-sm font-semibold text-white">30-Day Ramadan Grid</h3>
        </div>

        {/* Responsive grid: 6 cols on xs, 10 cols on sm+ */}
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5">
          {ramadanProgress.map(({ day, pct }) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: day * 0.012, duration: 0.2 }}
              title={`Day ${day} — ${Math.round(pct * 100)}% complete`}
              className={`aspect-square rounded-md border flex items-center justify-center text-[9px] sm:text-[9px] font-semibold transition-all duration-300 ${getDayColor(pct)} ${
                day === ramadanDay ? 'ring-1 ring-emerald-400 ring-offset-1 ring-offset-[#0f172a]' : ''
              } ${day > ramadanDay ? 'opacity-30' : ''}`}
            >
              <span className={pct > 0 ? 'text-white' : 'text-[#334155]'}>{day}</span>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-4 text-[10px] text-[#475569]">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#1e293b]/50 border border-[#1e293b]/30 inline-block" />0%</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-900/40 border border-emerald-800/30 inline-block" />&lt;40%</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-700/50 inline-block" />&lt;75%</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500/70 inline-block" />100%</span>
        </div>
      </motion.div>
    </div>
  )
}
