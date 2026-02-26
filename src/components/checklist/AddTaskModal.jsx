import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { X, Plus } from 'lucide-react'

const EMOJI_OPTIONS = ['📌','🎯','📚','💪','🧠','🌟','🤲','🙏','💡','🎁']

export default function AddTaskModal({ open, onClose }) {
  const { addCustomTask } = useApp()
  const [label, setLabel] = useState('')
  const [icon, setIcon] = useState('📌')

  function handleSubmit(e) {
    e.preventDefault()
    if (!label.trim()) return
    addCustomTask(label.trim(), icon)
    setLabel('')
    setIcon('📌')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#060d1b]/70 backdrop-blur-sm z-40"
          />

          {/* Modal — slides up from bottom on mobile, centered on sm+ */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:w-full z-50"
          >
            <div className="glass-dark border border-violet-500/20 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 mx-0 sm:mx-4">
              {/* Drag handle (mobile only) */}
              <div className="w-10 h-1 bg-[#334155] rounded-full mx-auto mb-4 sm:hidden" />

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-white">Add Personal Task</h2>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg bg-[#334155]/50 flex items-center justify-center hover:bg-[#334155] transition-colors cursor-pointer"
                >
                  <X size={14} className="text-[#64748b]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Emoji picker */}
                <div>
                  <label className="block text-xs text-[#64748b] mb-2 uppercase tracking-wider">Icon</label>
                  <div className="flex gap-2 flex-wrap">
                    {EMOJI_OPTIONS.map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setIcon(em)}
                        className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all cursor-pointer ${
                          icon === em
                            ? 'bg-violet-500/30 border border-violet-500/50 scale-110'
                            : 'bg-[#334155]/50 border border-[#475569]/30 hover:bg-[#334155]'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Task label */}
                <div>
                  <label className="block text-xs text-[#64748b] mb-2 uppercase tracking-wider">Task Name</label>
                  <input
                    type="text"
                    value={label}
                    onChange={e => setLabel(e.target.value)}
                    placeholder="e.g. Call parents, Read a book…"
                    className="w-full bg-[#1e293b]/60 border border-[#475569]/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#334155] focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                    autoFocus
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!label.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-500/20 border border-violet-500/30 text-violet-400 text-sm font-medium hover:bg-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <Plus size={15} />
                  Add Task
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
