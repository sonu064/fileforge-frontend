import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus, Sparkles } from "lucide-react";
import { comparisonFeatures } from "../../assets/data.js";
import { fadeInUp, staggerContainer, viewportOnce } from "../../util/motion.js";

const PricingSection = ({ pricingPlans, openSignUp }) => {
    const [yearly, setYearly] = useState(false);

    const renderCell = (value) => {
        if (value === true) return <Check size={18} className="mx-auto text-emerald-500" />;
        if (value === false) return <Minus size={18} className="mx-auto text-slate-300 dark:text-slate-600" />;
        return <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{value}</span>;
    };

    return (
        <section id="pricing" className="relative py-24 scroll-mt-20 bg-slate-50/70 dark:bg-slate-900/40">
            <div className="section-pad">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="text-center max-w-2xl mx-auto"
                >
                    <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 mb-4">
                        Pricing
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">
                        Simple, <span className="gradient-text">transparent</span> pricing
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        Start free, upgrade when you grow. No hidden fees, ever.
                    </motion.p>

                    {/* Billing toggle */}
                    <motion.div variants={fadeInUp} className="mt-8 inline-flex items-center gap-3 glass rounded-full p-1.5">
                        <button
                            onClick={() => setYearly(false)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!yearly ? "bg-gradient-to-r from-brand-500 to-brand2-500 text-white shadow" : "text-slate-600 dark:text-slate-300"}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setYearly(true)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${yearly ? "bg-gradient-to-r from-brand-500 to-brand2-500 text-white shadow" : "text-slate-600 dark:text-slate-300"}`}
                        >
                            Yearly
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Save 20%</span>
                        </button>
                    </motion.div>
                </motion.div>

                {/* Plan cards */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mt-14 grid gap-7 lg:grid-cols-3 items-stretch"
                >
                    {pricingPlans.map((plan, index) => {
                        const price = yearly ? plan.yearly : plan.monthly;
                        return (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -10 }}
                                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                className={`relative flex flex-col rounded-3xl p-8 transition-shadow ${
                                    plan.highlighted
                                        ? "bg-gradient-to-b from-brand-500 to-brand2-600 text-white shadow-2xl shadow-brand-500/40 lg:scale-105"
                                        : "card-surface hover:shadow-xl"
                                }`}
                            >
                                {plan.highlighted && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-4 py-1 rounded-full text-xs font-bold bg-white text-brand-600 shadow">
                                        <Sparkles size={13} /> Most Popular
                                    </span>
                                )}
                                <h3 className={`font-display text-2xl font-bold ${plan.highlighted ? "text-white" : "text-slate-900 dark:text-white"}`}>
                                    {plan.name}
                                </h3>
                                <p className={`mt-1 text-sm ${plan.highlighted ? "text-white/80" : "text-slate-500 dark:text-slate-400"}`}>
                                    {plan.description}
                                </p>
                                <div className="mt-6 flex items-end gap-1">
                                    <span className={`font-display text-5xl font-extrabold ${plan.highlighted ? "text-white" : "text-slate-900 dark:text-white"}`}>
                                        ₹{price.toLocaleString()}
                                    </span>
                                    <span className={`mb-1.5 text-sm ${plan.highlighted ? "text-white/70" : "text-slate-500"}`}>
                                        /{yearly ? "year" : "month"}
                                    </span>
                                </div>

                                <ul className="mt-7 space-y-3 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className={`mt-0.5 grid place-items-center h-5 w-5 rounded-full ${plan.highlighted ? "bg-white/20" : "bg-brand-100 dark:bg-brand-500/15"}`}>
                                                <Check size={13} className={plan.highlighted ? "text-white" : "text-brand-600 dark:text-brand-300"} />
                                            </span>
                                            <span className={`text-sm ${plan.highlighted ? "text-white/90" : "text-slate-600 dark:text-slate-300"}`}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => openSignUp()}
                                    className={`mt-8 w-full font-semibold rounded-xl px-6 py-3 transition-all cursor-pointer ${
                                        plan.highlighted
                                            ? "bg-white text-brand-600 hover:bg-brand-50"
                                            : "btn-primary"
                                    }`}
                                >
                                    {plan.cta}
                                </button>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Comparison table */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.6 }}
                    className="mt-20"
                >
                    <h3 className="text-center font-display text-2xl font-bold text-slate-900 dark:text-white mb-8">
                        Compare all features
                    </h3>
                    <div className="overflow-x-auto card-surface">
                        <table className="min-w-full text-center">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-500 dark:text-slate-400">Feature</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">Free</th>
                                    <th className="px-6 py-4 text-sm font-bold text-brand-600 dark:text-brand-300">Premium</th>
                                    <th className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">Ultimate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFeatures.map((row, i) => (
                                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-4 text-left text-sm font-medium text-slate-700 dark:text-slate-200">{row.label}</td>
                                        <td className="px-6 py-4">{renderCell(row.free)}</td>
                                        <td className="px-6 py-4 bg-brand-50/50 dark:bg-brand-500/5">{renderCell(row.premium)}</td>
                                        <td className="px-6 py-4">{renderCell(row.ultimate)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PricingSection;
