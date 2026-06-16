import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { fadeInUp, staggerContainer, viewportOnce } from "../../util/motion.js";

const TestimonialsSection = ({ testimonials }) => {
    const [page, setPage] = useState(0);
    const [perView, setPerView] = useState(3);

    useEffect(() => {
        const update = () => {
            if (window.innerWidth < 640) setPerView(1);
            else if (window.innerWidth < 1024) setPerView(2);
            else setPerView(3);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const totalPages = Math.max(1, Math.ceil(testimonials.length / perView));
    const safePage = page % totalPages;

    const next = useCallback(() => setPage((p) => (p + 1) % totalPages), [totalPages]);
    const prev = () => setPage((p) => (p - 1 + totalPages) % totalPages);

    useEffect(() => {
        const id = setInterval(next, 5000);
        return () => clearInterval(id);
    }, [next]);

    const visible = testimonials.slice(safePage * perView, safePage * perView + perView);

    return (
        <section id="testimonials" className="relative py-24 scroll-mt-20 overflow-hidden">
            <div className="section-pad">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="text-center max-w-2xl mx-auto"
                >
                    <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 mb-4">
                        Testimonials
                    </motion.span>
                    <motion.h2 variants={fadeInUp} className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">
                        Loved by <span className="gradient-text">professionals worldwide</span>
                    </motion.h2>
                    <motion.p variants={fadeInUp} className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        Join thousands of teams who switched to FileForge and never looked back.
                    </motion.p>
                </motion.div>

                <div className="relative mt-14">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={safePage}
                            initial={{ opacity: 0, x: 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -60 }}
                            transition={{ duration: 0.45, ease: "easeOut" }}
                            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {visible.map((t, i) => (
                                <div key={i} className="card-surface p-7 flex flex-col hover:shadow-xl transition-shadow">
                                    <Quote className="text-brand-300 dark:text-brand-500/50 mb-3" size={32} />
                                    <div className="flex gap-1 mb-3">
                                        {[...Array(5)].map((_, s) => (
                                            <Star key={s} size={16} className={s < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-300 dark:text-slate-600"} />
                                        ))}
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                                    <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                                        <img loading="lazy" src={t.image} alt={t.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-100 dark:ring-brand-500/30" />
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}, {t.company}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-4 mt-10">
                        <button onClick={prev} aria-label="Previous" className="grid place-items-center h-11 w-11 rounded-full glass hover:text-brand-500 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer">
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    aria-label={`Go to slide ${i + 1}`}
                                    className={`h-2.5 rounded-full transition-all ${i === safePage ? "w-8 bg-gradient-to-r from-brand-500 to-brand2-500" : "w-2.5 bg-slate-300 dark:bg-slate-700"}`}
                                />
                            ))}
                        </div>
                        <button onClick={next} aria-label="Next" className="grid place-items-center h-11 w-11 rounded-full glass hover:text-brand-500 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
