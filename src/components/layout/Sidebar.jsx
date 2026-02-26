import { useApp } from '../../context/AppContext'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, CheckSquare, BarChart2, BookOpen,
  Moon, Star, X
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
  { id: 'checklist',  label: 'Daily Tasks',  icon: CheckSquare },
  { id: 'progress',   label: 'Progress',     icon: BarChart2 },
  { id: 'reflection', label: 'Reflection',   icon: BookOpen },
]

export default function Sidebar({ onClose, mobile }) {
  const { activeSection, setActiveSection, ramadanDay } = useApp()

  function handleNav(id) {
    setActiveSection(id)
    if (mobile) onClose?.()
  }

  return (
    <aside className="w-64 h-screen glass-dark flex flex-col border-r border-white/5">
      {/* Logo */}
      <div className="px-6 py-7 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center glow-emerald-sm flex-shrink-0">
            <Moon size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white tracking-wide">Ramadan</p>
            <p className="text-xs text-[#64748b] -mt-0.5">Planner 1447</p>
          </div>
        </div>
        {/* Close button — mobile only */}
        {mobile && (
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-[#64748b] hover:text-white transition-all cursor-pointer"
            aria-label="Close menu"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Ramadan Day Badge */}
      <div className="px-5 py-4">
        <div className="glass-emerald rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-emerald-400/70 font-medium">Ramadan Day</p>
            <p className="text-2xl font-bold gradient-text leading-tight">{ramadanDay}</p>
          </div>
          <Star size={20} className="text-emerald-400/40" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id
          return (
            <motion.button
              key={id}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer text-left ${
                isActive
                  ? 'nav-active text-emerald-400'
                  : 'text-[#64748b] hover:text-[#cbd5e1] hover:bg-white/5'
              }`}
            >
              <Icon size={17} className={isActive ? 'text-emerald-400' : 'text-[#475569]'} />
              {label}
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-5 border-t border-white/5">
        <p className="text-[13px] text-[#475569] text-center">رَمَضَان كَرِيم</p>
        <p className="text-[10px] text-[#334155] text-center mt-0.5">Ramadan Kareem</p>
      </div>
    </aside>
  )
}
