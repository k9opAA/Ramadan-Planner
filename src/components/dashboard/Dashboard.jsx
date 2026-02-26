import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import Header from '../layout/Header'
import ChecklistSection from '../checklist/ChecklistSection'
import ProgressTracker from '../progress/ProgressTracker'
import PrayerTimesCard from '../prayer/PrayerTimesCard'
import ReflectionJournal from '../reflection/ReflectionJournal'

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function Section({ children }) {
  return (
    <motion.div variants={PAGE_VARIANTS} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

export default function Dashboard() {
  const { activeSection } = useApp()

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-5 md:py-8 max-w-7xl mx-auto">
      <Header />

      <AnimatePresence mode="wait">
        {activeSection === 'dashboard' && (
          <Section key="dashboard">
            {/* Stack on mobile, 3-col on lg */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
              {/* Left — checklist (takes 2 cols on desktop) */}
              <div className="lg:col-span-2 space-y-5 md:space-y-6">
                <ChecklistSection />
              </div>
              {/* Right — prayer + reflection */}
              <div className="space-y-5 md:space-y-6">
                <PrayerTimesCard />
                <ReflectionJournal />
              </div>
            </div>
          </Section>
        )}

        {activeSection === 'checklist' && (
          <Section key="checklist">
            <h2 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-5">Daily Tasks</h2>
            <div className="max-w-2xl">
              <ChecklistSection />
            </div>
          </Section>
        )}

        {activeSection === 'progress' && (
          <Section key="progress">
            <h2 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-5">Ramadan Progress</h2>
            <div className="max-w-2xl">
              <ProgressTracker />
            </div>
          </Section>
        )}

        {activeSection === 'reflection' && (
          <Section key="reflection">
            <h2 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-5">Daily Reflection</h2>
            <div className="max-w-xl space-y-5">
              <PrayerTimesCard />
              <ReflectionJournal />
            </div>
          </Section>
        )}
      </AnimatePresence>
    </div>
  )
}
