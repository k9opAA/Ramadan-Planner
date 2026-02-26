import { motion } from 'framer-motion'

/**
 * Animated progress bar.
 * @param {number} value  – 0..1
 * @param {string} color  – Tailwind width-compatible color class for the fill
 * @param {string} label
 * @param {number} done
 * @param {number} total
 */
export default function ProgressBar({ value = 0, colorClass = 'bg-emerald-500', label, done, total }) {
    const pct = Math.round(value * 100)

    return (
        <div className="space-y-1.5">
            {label && (
                <div className="flex items-center justify-between text-xs">
                    <span className="text-charcoal-300 font-medium">{label}</span>
                    <span className="text-charcoal-400">
                        {done !== undefined ? `${done}/${total}` : `${pct}%`}
                    </span>
                </div>
            )}
            <div className="progress-track h-2 rounded-full w-full">
                <motion.div
                    className={`h-full rounded-full ${colorClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>
        </div>
    )
}
