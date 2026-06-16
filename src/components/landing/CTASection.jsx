import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { viewportOnce } from "../../util/motion.js";

const CTASection = ({ openSignUp }) => {
    return (
        <section className="py-24">
            <div className="section-pad">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={viewportOnce}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl gradient-bg px-8 py-16 sm:px-16 sm:py-20 text-center shadow-2xl shadow-brand-500/30"
                >
                    <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/10 blur-3xl" />

                    <div className="relative">
                        <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white max-w-3xl mx-auto leading-tight">
                            Ready to forge a better way to share files?
                        </h2>
                        <p className="mt-5 text-lg text-white/90 max-w-xl mx-auto">
                            Create your free FileForge account today — no credit card required.
                        </p>
                        <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => openSignUp()}
                                className="group inline-flex items-center justify-center gap-2 bg-white text-brand-600 font-bold rounded-xl px-8 py-4 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
                            >
                                Get started for free
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
