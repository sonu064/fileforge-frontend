import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Lock, X } from "lucide-react";
import {
    formatDate,
    formatFileSize,
    getFileIcon,
    isFilePublic,
} from "../util/fileHelpers.jsx";
import DownloadButton from "./DownloadButton.jsx";

/** Shows full metadata for a file: name, size, date, type, owner, privacy. */
const FileDetailsModal = ({ file, isOpen, onClose, isPublic = false }) => {
    useEffect(() => {
        const onEsc = (e) => e.key === "Escape" && onClose();
        if (isOpen) document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [isOpen, onClose]);

    const pub = file ? isFilePublic(file) : false;

    return (
        <AnimatePresence>
            {isOpen && file && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                >
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
                            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">File Details</h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-5">
                            <div className="flex items-center gap-4 mb-5">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-50 to-brand2-50 dark:from-slate-800 dark:to-slate-800/40 grid place-items-center shrink-0">
                                    {getFileIcon(file, 26)}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-slate-900 dark:text-white break-words" title={file.name}>{file.name}</p>
                                    <span className={`inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full ${pub ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}>
                                        {pub ? <Globe size={11} /> : <Lock size={11} />}
                                        {pub ? "Public" : "Private"}
                                    </span>
                                </div>
                            </div>

                            <dl className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                                <Row label="File Name" value={file.name} />
                                <Row label="File Type" value={file.type || "—"} />
                                <Row label="Size" value={formatFileSize(file.size)} />
                                <Row label="Upload Date" value={formatDate(file.uploadedAt)} />
                                <Row label="Owner" value={isPublic ? "Shared with you" : "You"} />
                                <Row label="Privacy" value={pub ? "Public" : "Private"} />
                            </dl>
                        </div>

                        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                            <DownloadButton file={file} isPublic={isPublic} variant="button" />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Row = ({ label, value }) => (
    <div className="flex justify-between gap-4 py-2.5">
        <dt className="text-slate-500 dark:text-slate-400 shrink-0">{label}</dt>
        <dd className="text-slate-800 dark:text-slate-100 font-medium text-right break-all">{value}</dd>
    </div>
);

export default FileDetailsModal;
