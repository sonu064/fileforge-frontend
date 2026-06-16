import { motion } from "framer-motion";
import {
    ArrowRight,
    FileText,
    Image as ImageIcon,
    Music,
    PlayCircle,
    ShieldCheck,
    Sparkles,
    Video,
} from "lucide-react";
import AnimatedCounter from "../common/AnimatedCounter.jsx";
import { fadeInUp, staggerContainer } from "../../util/motion.js";
import { heroStats } from "../../assets/data.js";

const floatingCards = [
    { icon: ImageIcon, label: "design.png", size: "2.4 MB", color: "from-brand-500 to-brand2-500", pos: "top-4 -left-6 sm:left-0", delay: 0 },
    { icon: Video, label: "promo.mp4", size: "18.2 MB", color: "from-accent-500 to-rose-500", pos: "top-24 -right-4 sm:right-2", delay: 1.2 },
    { icon: FileText, label: "report.pdf", size: "820 KB", color: "from-amber-500 to-orange-500", pos: "bottom-6 left-2 sm:left-10", delay: 0.6 },
    { icon: Music, label: "podcast.mp3", size: "9.1 MB", color: "from-emerald-500 to-teal-500", pos: "bottom-20 right-0 sm:-right-6", delay: 1.8 },
];

const HeroSection = ({ openSignUp, openSignIn }) => {
    return (
        <section id="top" className="relative overflow-hidden pt-28 sm:pt-36 pb-20">
            {/* Animated gradient blobs */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-400/30 blur-3xl animate-blob" />
                <div className="absolute top-10 right-0 h-96 w-96 rounded-full bg-accent-400/25 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
                <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-brand2-400/25 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0)_0%,_rgba(255,255,255,0.6)_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(2,6,23,0)_0%,_rgba(2,6,23,0.85)_100%)]" />
            </div>

            <div className="section-pad grid lg:grid-cols-2 gap-12 items-center">
                {/* Copy */}
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="text-center lg:text-left">
                    <motion.span
                        variants={fadeInUp}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium glass text-brand-600 dark:text-brand-300 mb-6"
                    >
                        <Sparkles size={15} /> The modern way to share files
                    </motion.span>

                    <motion.h1
                        variants={fadeInUp}
                        className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
                    >
                        Store, Share and Secure{" "}
                        <span className="gradient-text">Your Files</span> in the Cloud
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0"
                    >
                        FileForge gives you lightning-fast uploads, bank-grade encryption and
                        effortless sharing — all wrapped in a beautiful, modern experience.
                    </motion.p>

                    <motion.div variants={fadeInUp} className="mt-9 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button onClick={() => openSignUp()} className="btn-primary text-base group">
                            Start for free
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => openSignIn()} className="btn-secondary text-base group">
                            <PlayCircle size={18} className="text-brand-500" />
                            See how it works
                        </button>
                    </motion.div>

                    {/* Trusted users */}
                    <motion.div variants={fadeInUp} className="mt-8 flex items-center gap-3 justify-center lg:justify-start">
                        <div className="flex -space-x-3">
                            {[11, 32, 45, 65, 22].map((n, i) => (
                                <img
                                    key={i}
                                    loading="lazy"
                                    src={`https://randomuser.me/api/portraits/${i % 2 ? "men" : "women"}/${n}.jpg`}
                                    alt="User"
                                    className="h-9 w-9 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                                />
                            ))}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-bold text-slate-900 dark:text-white">50,000+</span> teams trust FileForge
                        </p>
                    </motion.div>
                </motion.div>

                {/* Visual: floating cards over a glass panel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative h-[420px] sm:h-[460px] hidden sm:block"
                >
                    <div className="absolute inset-6 rounded-3xl gradient-bg opacity-90 shadow-2xl shadow-brand-500/30" />
                    <div className="absolute inset-6 rounded-3xl glass-strong flex flex-col items-center justify-center text-center p-8">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 grid place-items-center shadow-glow mb-4">
                            <ShieldCheck className="text-white" size={30} />
                        </div>
                        <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">Encrypted & Ready</p>
                        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">All your files, safe and synced.</p>
                    </div>

                    {floatingCards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={i}
                                className={`absolute ${card.pos} animate-float`}
                                style={{ animationDelay: `${card.delay}s` }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                            >
                                <div className="glass-strong rounded-2xl p-3 pr-5 flex items-center gap-3 shadow-xl min-w-[150px]">
                                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${card.color} grid place-items-center`}>
                                        <Icon size={18} className="text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">{card.label}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{card.size}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Animated statistics */}
            <div className="section-pad mt-16 sm:mt-24">
                <div className="glass rounded-3xl grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 sm:p-10">
                    {heroStats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center"
                        >
                            <div className="font-display text-3xl sm:text-4xl font-extrabold gradient-text">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
