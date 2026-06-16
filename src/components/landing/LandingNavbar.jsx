import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "../common/Logo.jsx";
import ThemeToggle from "../common/ThemeToggle.jsx";

const NAV_LINKS = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Testimonials", href: "#testimonials" },
];

const LandingNavbar = ({ openSignIn, openSignUp }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleNav = (e, href) => {
        e.preventDefault();
        setMobileOpen(false);
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "glass-strong shadow-sm shadow-slate-200/40 dark:shadow-black/30"
                    : "bg-transparent"
            }`}
        >
            <nav className="section-pad flex items-center justify-between h-16 sm:h-18 py-2">
                <a href="#top" onClick={(e) => handleNav(e, "#top")} className="cursor-pointer">
                    <Logo size={34} textClassName="text-lg sm:text-xl text-slate-900 dark:text-white" />
                </a>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={(e) => handleNav(e, link.href)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 rounded-lg transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggle />
                    <button
                        onClick={() => openSignIn()}
                        className="hidden sm:inline-flex text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-500 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        Sign in
                    </button>
                    <button
                        onClick={() => openSignUp()}
                        className="btn-primary !px-4 !py-2 text-sm hidden sm:inline-flex"
                    >
                        Get Started
                    </button>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen((o) => !o)}
                        aria-label="Toggle menu"
                        className="md:hidden grid place-items-center h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden overflow-hidden glass-strong border-t border-white/30 dark:border-white/10"
                    >
                        <div className="px-5 py-4 flex flex-col gap-1">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleNav(e, link.href)}
                                    className="px-3 py-3 rounded-lg text-slate-700 dark:text-slate-200 font-medium hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-slate-200 dark:border-slate-700">
                                <button onClick={() => { setMobileOpen(false); openSignIn(); }} className="btn-secondary w-full">
                                    Sign in
                                </button>
                                <button onClick={() => { setMobileOpen(false); openSignUp(); }} className="btn-primary w-full">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default LandingNavbar;
