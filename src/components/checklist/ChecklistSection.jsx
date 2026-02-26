import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import TaskItem from './TaskItem'
import { Plus } from 'lucide-react'
import AddTaskModal from './AddTaskModal'

const CATEGORIES = [
  {
    id: 'ibadah',
    label: 'Ibadah',
    subtitle: 'Worship & Spiritual Acts',
    emoji: '🕌',
    accent: 'text-emerald-400',
    border: 'border-emerald-500/15',
    headerBg: 'bg-emerald-500/5',
  },
  {
    id: 'health',
    label: 'Health',
    subtitle: 'Suhoor, Iftar & Hydration',
    emoji: '💧',
    accent: 'text-sky-400',
    border: 'border-sky-500/15',
    headerBg: 'bg-sky-500/5',
  },
  {
    id: 'personal',
    label: 'Personal',
    subtitle: 'Your Custom Daily Goals',
    emoji: '✨',
    accent: 'text-violet-400',
    border: 'border-violet-500/15',
    headerBg: 'bg-violet-500/5',
  },
]

export default function ChecklistSection() {
  const { allTasks, todayCompleted } = useApp()
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="space-y-4 md:space-y-5">
      {CATEGORIES.map((cat, catIdx) => {
        const tasks = allTasks.filter(t => t.category === cat.id)
        const done = tasks.filter(t => todayCompleted.has(t.id)).length

        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.08, duration: 0.4 }}
            className={`glass rounded-2xl overflow-hidden border ${cat.border}`}
          >
            {/* Category header */}
            <div className={`${cat.headerBg} px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between border-b ${cat.border}`}>
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="text-lg sm:text-xl">{cat.emoji}</span>
                <div>
                  <p className={`text-sm font-semibold ${cat.accent}`}>{cat.label}</p>
                  <p className="text-[10px] sm:text-[11px] text-[#475569] hidden sm:block">{cat.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${cat.accent}`}>{done}/{tasks.length}</span>
                {cat.id === 'personal' && (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-6 h-6 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center hover:bg-violet-500/30 transition-colors cursor-pointer"
                    aria-label="Add personal task"
                  >
                    <Plus size={13} className="text-violet-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Tasks */}
            <div className="p-2.5 sm:p-3 space-y-1.5 sm:space-y-2">
              <AnimatePresence>
                {tasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </AnimatePresence>
              {tasks.length === 0 && (
                <p className="text-center text-[#475569] text-xs py-4">
                  No tasks yet. Add one above!
                </p>
              )}
            </div>
          </motion.div>
        )
      })}

      <AddTaskModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
