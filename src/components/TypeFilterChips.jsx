import { FILE_CATEGORIES } from "../util/fileHelpers.jsx";

/**
 * Horizontal row of category filter chips with per-category counts.
 * @param counts  map of category -> count (and "all" -> total)
 * @param active  currently selected category key
 */
const TypeFilterChips = ({ counts = {}, active = "all", onChange }) => {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {FILE_CATEGORIES.filter((c) => c.key === "all" || (counts[c.key] || 0) > 0).map((cat) => {
                const isActive = active === cat.key;
                const count = cat.key === "all" ? (counts.all || 0) : (counts[cat.key] || 0);
                return (
                    <button
                        key={cat.key}
                        onClick={() => onChange(cat.key)}
                        className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                            isActive
                                ? "bg-brand-500 text-white shadow-sm shadow-brand-500/30"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                    >
                        {cat.label}
                        <span className={`text-xs rounded-full px-1.5 ${isActive ? "bg-white/25" : "bg-slate-200 dark:bg-slate-700"}`}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default TypeFilterChips;
