import { motion } from "framer-motion";

/**
 * Analytics stat card with gradient icon, value, optional progress bar and trend.
 */
const StatsCard = ({ icon: Icon, label, value, gradient = "from-brand-500 to-brand2-500", progress, hint, index = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            whileHover={{ y: -4 }}
            className="card-surface p-5 hover:shadow-lg hover:shadow-brand-500/10 transition-shadow"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-1 font-display text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
                </div>
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${gradient} grid place-items-center shadow-md`}>
                    <Icon size={20} className="text-white" />
                </div>
            </div>

            {typeof progress === "number" && (
                <div className="mt-4">
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(progress, 100)}%` }}
                            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                            className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                        />
                    </div>
                    {hint && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
                </div>
            )}
            {typeof progress !== "number" && hint && (
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
            )}
        </motion.div>
    );
};

export default StatsCard;
