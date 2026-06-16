import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext.jsx";

const ThemeToggle = ({ className = "" }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`relative grid place-items-center h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700
            bg-white/70 dark:bg-slate-800/70 backdrop-blur text-slate-600 dark:text-slate-300
            hover:text-brand-500 hover:border-brand-300 transition-colors cursor-pointer ${className}`}
        >
            <motion.span
                key={theme}
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
            >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.span>
        </button>
    );
};

export default ThemeToggle;
