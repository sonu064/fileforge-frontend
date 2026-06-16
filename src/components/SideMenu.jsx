import { useContext } from "react";
import { useUser } from "../context/AuthContext.jsx";
import { Sparkles, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SIDE_MENU_DATA } from "../assets/data.js";
import { UserCreditsContext } from "../context/UserCreditsContext.jsx";

const SideMenu = ({ activeMenu, onNavigate }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const { credits } = useContext(UserCreditsContext);

    const handleClick = (path) => {
        navigate(path);
        onNavigate?.();
    };

    const avatarSrc = user?.imageUrl || user?.profileImage;

    return (
        <div className="w-64 h-[calc(100vh-64px)] bg-white dark:bg-slate-900 border-r border-slate-200/70 dark:border-slate-800 p-5 sticky top-[64px] z-30 flex flex-col">
            {/* Profile — click to open /profile */}
            <button
                type="button"
                onClick={() => handleClick("/profile")}
                className="flex flex-col items-center text-center gap-3 mt-2 mb-8 w-full rounded-2xl p-2 -mx-2 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                aria-label="Open profile"
            >
                <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-brand-500 to-accent-500 blur-[2px] opacity-70 group-hover:opacity-100 transition-opacity" />
                    {avatarSrc ? (
                        <img src={avatarSrc} alt="Profile" className="relative w-16 h-16 rounded-full object-cover ring-2 ring-white dark:ring-slate-900" />
                    ) : (
                        <div className="relative w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 grid place-items-center">
                            <User className="text-slate-500" />
                        </div>
                    )}
                </div>
                <div>
                    <h5 className="font-semibold text-slate-900 dark:text-white leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {user?.fullName || "Welcome"}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                        {user?.primaryEmailAddress?.emailAddress || user?.email || ""}
                    </p>
                    <p className="text-[10px] text-brand-500 dark:text-brand-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">View profile →</p>
                </div>
            </button>

            {/* Menu */}
            <nav className="flex-1 space-y-1.5">
                {SIDE_MENU_DATA.map((item, index) => {
                    const active = activeMenu === item.label;
                    return (
                        <button
                            key={`menu_${index}`}
                            onClick={() => handleClick(item.path)}
                            className={`relative w-full flex items-center gap-3 text-[15px] py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer ${
                                active
                                    ? "text-white font-semibold"
                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                        >
                            {active && (
                                <motion.span
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-500 to-brand2-500 shadow-lg shadow-brand-500/30"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <item.icon size={19} className="relative z-10" />
                            <span className="relative z-10">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Upgrade card */}
            <div className="mt-4 rounded-2xl p-4 bg-gradient-to-br from-brand-500 to-accent-500 text-white">
                <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={16} />
                    <p className="font-semibold text-sm">{credits ?? "—"} upload{(credits ?? 0) === 1 ? "" : "s"} left</p>
                </div>
                <p className="text-xs text-white/80 mb-3">Upgrade to unlock more uploads and analytics.</p>
                <button
                    onClick={() => handleClick("/subscriptions")}
                    className="w-full bg-white text-brand-600 text-sm font-semibold rounded-lg py-2 hover:bg-brand-50 transition-colors cursor-pointer"
                >
                    Upgrade plan
                </button>
            </div>
        </div>
    );
};

export default SideMenu;
