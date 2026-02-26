import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AppProvider } from './context/AppContext'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/dashboard/Dashboard'
import { Menu } from 'lucide-react'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#060d1b] bg-grid text-[#cbd5e1] flex">

        {/* ── Desktop sidebar (fixed, always visible lg+) ── */}
        <div className="hidden lg:block">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* ── Mobile sidebar drawer ── */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />
              {/* Drawer */}
              <motion.div
                key="drawer"
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="fixed top-0 left-0 h-screen z-50 lg:hidden"
              >
                <Sidebar onClose={() => setSidebarOpen(false)} mobile />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Main content ── */}
        <main className="flex-1 lg:ml-64 min-h-screen overflow-y-auto relative">
          {/* Decorative background blobs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-5%] left-[10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-violet-500/4 rounded-full blur-3xl" />
            <div className="absolute top-[50%] left-[40%] w-[300px] h-[300px] bg-sky-500/3 rounded-full blur-3xl" />
          </div>

          {/* Mobile top bar */}
          <div className="lg:hidden flex items-center gap-3 px-4 py-4 border-b border-white/5 bg-[#0f172a]/80 backdrop-blur-sm sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#94a3b8] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Ramadan</span>
              <span className="text-xs text-[#64748b]">Planner 1447</span>
            </div>
          </div>

          {/* Page content */}
          <div className="relative z-10">
            <Dashboard />
          </div>
        </main>
      </div>
    </AppProvider>
  )
}
