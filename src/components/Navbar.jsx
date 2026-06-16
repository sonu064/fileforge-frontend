import { useContext, useEffect, useRef, useState } from "react";
import { LogOut, Menu, Settings, User, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import SideMenu from "./SideMenu.jsx";
import CreditsDisplay from "./CreditsDisplay.jsx";
import SearchBar from "./SearchBar.jsx";
import Logo from "./common/Logo.jsx";
import ThemeToggle from "./common/ThemeToggle.jsx";
import { UserCreditsContext } from "../context/UserCreditsContext.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";

const UserMenu = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const onClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-brand-500/40 transition cursor-pointer"
                aria-label="Account menu"
            >
                {user?.imageUrl ? (
                    <img src={user.imageUrl} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-accent-500 grid place-items-center text-white text-sm font-bold">
                        {(user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase()}
                    </div>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50"
                    >
                        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.fullName || "Account"}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                        </div>
                        <button
                            onClick={() => { setOpen(false); navigate("/profile"); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                            <User size={16} /> Profile
                        </button>
                        <button
                            onClick={() => { setOpen(false); navigate("/profile?section=settings"); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                            <Settings size={16} /> Settings
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false);
    const { credits, fetchUserCredits } = useContext(UserCreditsContext);
    const { isSignedIn } = useAuthContext();

    useEffect(() => {
        fetchUserCredits();
    }, [fetchUserCredits]);

    return (
        <div className="flex items-center justify-between gap-5 glass-strong border-b border-slate-200/60 dark:border-slate-800 py-3 px-4 sm:px-7 sticky top-0 z-40">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setOpenSideMenu(!openSideMenu)}
                    className="block lg:hidden text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg transition-colors cursor-pointer"
                    aria-label="Toggle menu"
                >
                    {openSideMenu ? <X size={22} /> : <Menu size={22} />}
                </button>

                <Link to="/dashboard">
                    <Logo size={32} textClassName="text-lg text-slate-900 dark:text-white" />
                </Link>
            </div>

            {isSignedIn && (
                <div className="hidden md:block flex-1 max-w-md mx-4">
                    <SearchBar />
                </div>
            )}

            {isSignedIn && (
                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />
                    <Link to="/subscriptions">
                        <CreditsDisplay credits={credits} />
                    </Link>
                    <UserMenu />
                </div>
            )}

            <AnimatePresence>
                {openSideMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed top-[64px] left-0 right-0 lg:hidden z-30"
                    >
                        <SideMenu activeMenu={activeMenu} onNavigate={() => setOpenSideMenu(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Navbar;
