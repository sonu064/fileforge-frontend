import { ArrowUpFromLine, FileIcon, Loader2, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
};

const UploadBox = ({ files, onFileChange, onUpload, uploading, onRemoveFile, remainingCredits, isUploadDisabled }) => {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e, active) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(active);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) onFileChange({ target: { files: droppedFiles } });
    };

    return (
        <div className="w-full max-w-3xl mx-auto card-surface p-6 sm:p-8">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand2-500 grid place-items-center">
                        <ArrowUpFromLine className="text-white" size={18} />
                    </div>
                    <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Upload Files</h2>
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    {remainingCredits ?? "—"} upload{remainingCredits === 1 ? "" : "s"} remaining
                </span>
            </div>

            <motion.div
                animate={{ scale: dragActive ? 1.02 : 1 }}
                onDragOver={(e) => handleDrag(e, true)}
                onDragEnter={(e) => handleDrag(e, true)}
                onDragLeave={(e) => handleDrag(e, false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
                    dragActive
                        ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
                        : "border-slate-300 dark:border-slate-700 hover:border-brand-400 bg-slate-50/50 dark:bg-slate-800/30"
                }`}
            >
                <motion.div
                    animate={dragActive ? { y: [-2, -8, -2] } : { y: 0 }}
                    transition={{ repeat: dragActive ? Infinity : 0, duration: 0.9 }}
                    className="inline-grid place-items-center h-16 w-16 rounded-2xl bg-brand-100 dark:bg-brand-500/15 mb-4"
                >
                    <UploadCloud size={28} className="text-brand-600 dark:text-brand-300" />
                </motion.div>
                <p className="font-medium text-slate-700 dark:text-slate-200">
                    {dragActive ? "Drop your files here" : "Drag & drop files here"}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    or click to browse · {remainingCredits ?? "—"} upload{remainingCredits === 1 ? "" : "s"} remaining
                </p>
                <input ref={fileInputRef} type="file" multiple onChange={onFileChange} className="hidden" accept="*/*" />
            </motion.div>

            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-6 overflow-hidden">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">Selected files ({files.length})</h3>
                        <div className="space-y-2">
                            {files.map((file, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <FileIcon size={18} className="text-brand-500 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{file.name}</p>
                                            <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onRemoveFile(index); }}
                                        disabled={uploading}
                                        className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                        <X size={18} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        <button onClick={onUpload} disabled={uploading || isUploadDisabled} className="btn-primary w-full mt-5">
                            {uploading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Uploading...
                                </>
                            ) : (
                                <>Upload {files.length} file(s)</>
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UploadBox;
