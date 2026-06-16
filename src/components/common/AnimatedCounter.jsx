import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Counts up to `value` once the element scrolls into view.
 * Supports decimals (e.g. 99.9) and large numbers (e.g. 50000 -> 50,000).
 */
const AnimatedCounter = ({ value, suffix = "", duration = 1800, className = "" }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.5 });
    const [display, setDisplay] = useState(0);

    const isDecimal = !Number.isInteger(value);

    useEffect(() => {
        if (!inView) return;
        let frame;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(value * eased);
            if (progress < 1) frame = requestAnimationFrame(tick);
            else setDisplay(value);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [inView, value, duration]);

    const formatted = isDecimal
        ? display.toFixed(1)
        : Math.round(display).toLocaleString();

    return (
        <span ref={ref} className={className}>
            {formatted}
            {suffix}
        </span>
    );
};

export default AnimatedCounter;
