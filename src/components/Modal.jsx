import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
};

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    confirmButtonClass = "bg-gradient-to-r from-brand-500 to-brand2-500 hover:shadow-lg hover:shadow-brand-500/30",
    size = "md",
}) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleEscape = (e) => e.key === "Escape" && onClose();
        if (isOpen) document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => { document.body.style.overflow = "auto"; };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className={`${sizeClasses[size]} w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800`}
                    >
                        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
                            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-5">{children}</div>

                        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                {cancelText}
                            </button>
                            <button onClick={onConfirm} className={`px-4 py-2 rounded-xl text-white font-medium transition-all cursor-pointer ${confirmButtonClass}`}>
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
