import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import {
    AlertTriangle,
    ExternalLink,
    FileQuestion,
    Info,
    Loader2,
    X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useFileObjectUrl } from "../util/useObjectUrl.js";
import { getFileErrorMessage, openFileInNewTab } from "../util/fileApi.js";
import {
    formatDate,
    formatFileSize,
    getFileIcon,
    getFileKind,
    isFilePublic,
    isPreviewable,
} from "../util/fileHelpers.jsx";
import ImageViewer from "./ImageViewer.jsx";
import PdfViewer from "./PdfViewer.jsx";
import DownloadButton from "./DownloadButton.jsx";

/**
 * Google-Drive-style full-screen file preview with an inline viewer + details panel.
 *
 * @param {object}  file      File metadata.
 * @param {boolean} isOpen
 * @param {Function} onClose
 * @param {boolean} isPublic  Use public (no-auth) streaming endpoints.
 */
const FilePreviewModal = ({ file, isOpen, onClose, isPublic = false }) => {
    const { getToken } = useAuth();
    const kind = file ? getFileKind(file) : "other";
    const previewable = file ? isPreviewable(file) || ["video", "audio"].includes(kind) : false;

    const { url, status } = useFileObjectUrl({
        fileId: file?.id,
        enabled: isOpen && Boolean(file) && previewable,
        isPublic,
        getToken,
    });

    useEffect(() => {
        const onEsc = (e) => e.key === "Escape" && onClose();
        if (isOpen) document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [isOpen, onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => { document.body.style.overflow = "auto"; };
    }, [isOpen]);

    const handleOpenNewTab = async () => {
        try {
            if (isPublic) {
                window.open(url, "_blank", "noopener,noreferrer");
            } else {
                await openFileInNewTab(file, getToken);
            }
        } catch (error) {
            toast.error(getFileErrorMessage(error));
        }
    };

    const renderViewer = () => {
        if (!previewable) {
            return (
                <PreviewMessage
                    icon={<FileQuestion size={48} className="text-slate-400" />}
                    title="Preview not available"
                    subtitle="This file type can't be previewed. Download it to view the contents."
                />
            );
        }
        if (status === "loading" || status === "idle") {
            return <PreviewMessage icon={<Loader2 size={40} className="animate-spin text-brand-500" />} title="Loading preview…" />;
        }
        if (status === "error" || !url) {
            return (
                <PreviewMessage
                    icon={<AlertTriangle size={44} className="text-amber-500" />}
                    title="Couldn't load this file"
                    subtitle="The file may be missing or corrupted. Try downloading it instead."
                />
            );
        }
        if (kind === "image") return <ImageViewer url={url} name={file.name} />;
        if (kind === "pdf") return <PdfViewer url={url} name={file.name} />;
        if (kind === "video") {
            return (
                <div className="h-full w-full flex items-center justify-center bg-slate-950">
                    <video src={url} controls className="max-h-full max-w-full" />
                </div>
            );
        }
        if (kind === "audio") {
            return (
                <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-8">
                    <audio src={url} controls className="w-full max-w-lg" />
                </div>
            );
        }
        // text
        return (
            <iframe
                title={file.name}
                src={url}
                className="h-full w-full border-0 bg-white"
            />
        );
    };

    return (
        <AnimatePresence>
            {isOpen && file && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex flex-col"
                >
                    {/* Top bar */}
                    <div className="flex items-center justify-between gap-4 px-4 sm:px-6 h-16 border-b border-white/10 shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="h-9 w-9 rounded-lg bg-white/10 grid place-items-center shrink-0">
                                {getFileIcon(file, 18)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-white font-medium truncate" title={file.name}>{file.name}</p>
                                <p className="text-xs text-slate-400">
                                    {formatFileSize(file.size)} · {file.type || "Unknown type"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            {previewable && status === "loaded" && (
                                <button onClick={handleOpenNewTab} title="Open in new tab" className="p-2 rounded-full text-white hover:bg-white/15 transition-colors cursor-pointer">
                                    <ExternalLink size={18} />
                                </button>
                            )}
                            <DownloadButton file={file} isPublic={isPublic} className="text-white hover:bg-white/15" />
                            <button onClick={onClose} title="Close" className="p-2 rounded-full text-white hover:bg-white/15 transition-colors cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Body: viewer + details */}
                    <div className="flex-1 flex min-h-0">
                        <div className="flex-1 min-w-0">{renderViewer()}</div>

                        <aside className="hidden lg:flex w-80 shrink-0 flex-col border-l border-white/10 bg-slate-900/60 p-6 overflow-y-auto">
                            <div className="flex items-center gap-2 text-slate-300 mb-4">
                                <Info size={16} />
                                <h3 className="font-display font-semibold text-white">File details</h3>
                            </div>
                            <DetailRow label="Name" value={file.name} />
                            <DetailRow label="Type" value={file.type || "—"} />
                            <DetailRow label="Size" value={formatFileSize(file.size)} />
                            <DetailRow label="Uploaded" value={formatDate(file.uploadedAt)} />
                            <DetailRow label="Owner" value={isPublic ? "Shared with you" : "You"} />
                            <DetailRow
                                label="Privacy"
                                value={isFilePublic(file) ? "Public" : "Private"}
                                valueClass={isFilePublic(file) ? "text-emerald-400" : "text-slate-300"}
                            />
                        </aside>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const PreviewMessage = ({ icon, title, subtitle }) => (
    <div className="h-full w-full flex flex-col items-center justify-center text-center px-6 bg-slate-100 dark:bg-slate-950">
        <div className="mb-4">{icon}</div>
        <p className="text-lg font-medium text-slate-700 dark:text-slate-200">{title}</p>
        {subtitle && <p className="text-sm text-slate-500 max-w-sm mt-1">{subtitle}</p>}
    </div>
);

const DetailRow = ({ label, value, valueClass = "text-white" }) => (
    <div className="py-2.5 border-b border-white/5">
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className={`text-sm break-words mt-0.5 ${valueClass}`} title={value}>{value}</p>
    </div>
);

export default FilePreviewModal;
