import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext'
import { Check, Trash2 } from 'lucide-react'

const CATEGORY_COLORS = {
    ibadah: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    health: { bg: 'bg-sky-500/10', border: 'border-sky-500/20', text: 'text-sky-400', dot: 'bg-sky-400' },
    personal: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', dot: 'bg-violet-400' },
}

export default function TaskItem({ task }) {
    const { todayCompleted, toggleTask, removeCustomTask } = useApp()
    const isCustom = task.id.startsWith('custom_')
    const done = todayCompleted.has(task.id)
    const colors = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.personal

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all duration-200 group ${done
                    ? 'bg-charcoal-800/30 border-charcoal-700/20 opacity-60'
                    : `${colors.bg} ${colors.border}`
                }`}
        >
            {/* Checkbox */}
            <button
                onClick={() => toggleTask(task.id)}
                className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 cursor-pointer ${done
                        ? 'bg-emerald-500 border-emerald-500'
                        : `border-charcoal-500 hover:border-${task.category === 'ibadah' ? 'emerald' : task.category === 'health' ? 'sky' : 'violet'}-400`
                    }`}
                aria-label={done ? 'Mark incomplete' : 'Mark complete'}
            >
                <AnimatePresence>
                    {done && (
                        <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="check-pop"
                        >
                            <Check size={11} className="text-white stroke-[3]" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>

            {/* Icon */}
            <span className="text-base leading-none select-none">{task.icon}</span>

            {/* Label */}
            <span className={`flex-1 text-sm font-medium transition-all duration-200 ${done ? 'line-through text-charcoal-500' : 'text-charcoal-200'
                }`}>
                {task.label}
            </span>

            {/* Delete button (custom tasks only) */}
            {isCustom && (
                <motion.button
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="opacity-0 group-hover:opacity-100 text-charcoal-500 hover:text-rose-400 transition-colors cursor-pointer"
                    onClick={() => removeCustomTask(task.id)}
                    aria-label="Remove task"
                >
                    <Trash2 size={14} />
                </motion.button>
            )}
        </motion.div>
    )
}
