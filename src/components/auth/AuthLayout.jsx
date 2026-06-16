import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../common/Logo.jsx";
import ThemeToggle from "../common/ThemeToggle.jsx";

/** Centered card shell shared by all auth screens. */
const AuthLayout = ({ title, subtitle, children, footer }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
            <header className="flex items-center justify-between px-5 sm:px-8 py-4">
                <Link to="/">
                    <Logo size={32} textClassName="text-lg text-slate-900 dark:text-white" />
                </Link>
                <ThemeToggle />
            </header>

            <main className="flex-1 grid place-items-center px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    <div className="card-surface p-7 sm:p-8 rounded-3xl shadow-xl">
                        <div className="mb-6">
                            <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
                            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
                        </div>
                        {children}
                    </div>
                    {footer && <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">{footer}</div>}
                </motion.div>
            </main>
        </div>
    );
};

/** Shared text input with label. */
export const AuthField = ({ label, ...props }) => (
    <label className="block">
        <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{label}</span>
        <input
            {...props}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
        />
    </label>
);

export default AuthLayout;
