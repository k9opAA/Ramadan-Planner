import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { BookOpen, Sparkles } from 'lucide-react'

const DUAS = [
  'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
  'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ',
  'اللَّهُمَّ إِنَّكَ عَفُوٌّ كَرِيمٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
  'رَبِّ زِدْنِي عِلْمًا',
  'اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي',
  'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ',
]

const DUA_TRANSLATIONS = [
  'Our Lord, give us good in this world and in the Hereafter, and protect us from the torment of the Fire.',
  'My Lord, forgive me and accept my repentance. You are the Ever-Relenting, the Most Merciful.',
  'O Allah, You are the Pardoner, Generous, You love to pardon, so pardon me.',
  'My Lord, increase me in knowledge.',
  'O Allah, guide me and keep me steadfast.',
  'My Lord, inspire me to be grateful for Your blessings You have bestowed upon me.',
]

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}

export default function ReflectionJournal() {
  const { todayReflection, setTodayReflection } = useApp()
  const [localText, setLocalText] = useState(todayReflection)
  const debounced = useDebounce(localText, 500)

  useEffect(() => {
    setTodayReflection(debounced)
  }, [debounced, setTodayReflection])

  const duaIdx = new Date().getDate() % DUAS.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.4 }}
      className="glass rounded-2xl overflow-hidden border border-[#334155]/30"
    >
      {/* Header */}
      <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-[#334155]/20 bg-[#1e293b]/20">
        <div className="flex items-center gap-2">
          <BookOpen size={15} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Daily Reflection</h3>
        </div>
      </div>

      {/* Dua */}
      <div className="px-4 sm:px-5 pt-4 pb-3">
        <div className="glass-emerald rounded-xl p-3 sm:p-3.5">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={11} className="text-emerald-400" />
            <p className="text-[10px] uppercase tracking-widest text-emerald-400/70 font-semibold">Dua of the Day</p>
          </div>
          <p className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed text-right font-medium" dir="rtl">
            {DUAS[duaIdx]}
          </p>
          <p className="text-[11px] text-[#64748b] italic mt-2 leading-relaxed">
            {DUA_TRANSLATIONS[duaIdx]}
          </p>
        </div>
      </div>

      {/* Journal */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        <label className="block text-[10px] uppercase tracking-widest text-[#475569] font-medium mb-2">
          My Reflection Today
        </label>
        <textarea
          value={localText}
          onChange={e => setLocalText(e.target.value)}
          placeholder="What are you grateful for today? Any thoughts on your ibadah…"
          rows={4}
          className="w-full bg-[#1e293b]/40 border border-[#475569]/30 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-[#cbd5e1] placeholder-[#334155] focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/10 transition-all resize-none leading-relaxed"
        />
        <p className="text-[10px] text-[#334155] mt-1.5 text-right">
          {localText.length > 0 ? 'Saved automatically ✓' : 'Start writing…'}
        </p>
      </div>
    </motion.div>
  )
}
