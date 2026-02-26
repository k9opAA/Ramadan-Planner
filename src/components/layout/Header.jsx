import { getGregorianDate, getHijriDate } from '../../utils/hijriDate'
import { useApp } from '../../context/AppContext'
import { motion } from 'framer-motion'
import { Sunrise } from 'lucide-react'

export default function Header() {
  const { ramadanDay } = useApp()
  const today = new Date()
  const gregorian = getGregorianDate(today)
  const hijri = getHijriDate(today)

  const hour = today.getHours()
  const greeting =
    hour < 5  ? 'Assalamu Alaykum 🌙' :
    hour < 12 ? 'Good Morning ☀️' :
    hour < 17 ? 'Good Afternoon 🌤' :
    hour < 20 ? 'Good Evening 🌅' :
                'Good Night ⭐'

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="mb-6 md:mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Greeting + title */}
        <div>
          <p className="text-[#64748b] text-sm font-medium mb-1 flex items-center gap-1.5">
            <Sunrise size={14} className="text-emerald-400" />
            {greeting}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
            Ramadan <span className="gradient-text">Planner</span>
          </h1>
          <p className="text-[#64748b] text-xs md:text-sm mt-1.5">{gregorian}</p>
        </div>

        {/* Date badges */}
        <div className="flex gap-2 sm:gap-3">
          <div className="glass rounded-xl px-3 py-2 sm:px-4 sm:py-3">
            <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-medium">Hijri</p>
            <p className="text-xs sm:text-sm font-semibold text-emerald-400 mt-0.5 whitespace-nowrap">{hijri || '—'}</p>
          </div>
          <div className="glass rounded-xl px-3 py-2 sm:px-4 sm:py-3">
            <p className="text-[10px] uppercase tracking-widest text-[#64748b] font-medium">Day</p>
            <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">
              Day <span className="text-emerald-400">{ramadanDay}</span> / 30
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-5 md:mt-6 h-px bg-gradient-to-r from-emerald-500/20 via-[#273449]/40 to-transparent" />
    </motion.header>
  )
}
