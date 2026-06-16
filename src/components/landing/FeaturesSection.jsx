import { motion } from "framer-motion";
import {
    ArrowUpCircle,
    Clock,
    CreditCard,
    FileText,
    Share2,
    Shield,
} from "lucide-react";
import { fadeInUp, staggerContainer, viewportOnce } from "../../util/motion.js";

const ICONS = {
    ArrowUpCircle,
    Shield,
    Share2,
    CreditCard,
    FileText,
    Clock,
};

const FeaturesSection = ({ features }) => {
    return (
        <section id="features" className="relative py-24 scroll-mt-20">
            <div className="section-pad">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="text-center max-w-2xl mx-auto"
                >
                    <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 mb-4">
                        Features
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">
                        Everything you need to <span className="gradient-text">share with confidence</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        FileForge packs powerful tools into a delightfully simple experience.
                    </motion.p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {features.map((feature, index) => {
                        const Icon = ICONS[feature.iconName] || FileText;
                        return (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="group relative card-surface p-7 overflow-hidden hover:shadow-xl hover:shadow-brand-500/10 transition-shadow"
                            >
                                <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${feature.gradient} opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500`} />
                                <div className={`relative h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} grid place-items-center shadow-lg mb-5 group-hover:scale-110 transition-transform`}>
                                    <Icon size={26} className="text-white" />
                                </div>
                                <h3 className="relative font-display text-xl font-bold text-slate-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="relative text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturesSection;
