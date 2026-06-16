import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiEndpoints } from "../util/apiEndpoints.js";
import { downloadPublicFile, getFileErrorMessage } from "../util/fileApi.js";
import { useFileObjectUrl } from "../util/useObjectUrl.js";
import toast from "react-hot-toast";
import { AlertTriangle, Copy, Download, Info, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import LinkShareModal from "../components/LinkShareModal.jsx";
import Logo from "../components/common/Logo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import ImageViewer from "../components/ImageViewer.jsx";
import PdfViewer from "../components/PdfViewer.jsx";
import { formatFileSize, getFileIcon, getFileKind, isPreviewable } from "../util/fileHelpers.jsx";

const PublicFileView = () => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [shareModal, setShareModal] = useState({ isOpen: false, link: "" });
    const { fileId } = useParams();

    const kind = file ? getFileKind(file) : "other";
    const canPreview = file ? isPreviewable(file) : false;
    const { url: previewUrl, status: previewStatus } = useFileObjectUrl({
        fileId,
        enabled: Boolean(file) && canPreview,
        isPublic: true,
    });

    useEffect(() => {
        const getFile = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(apiEndpoints.PUBLIC_FILE_VIEW(fileId));
                setFile(res.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching file:", err);
                setError("Could not retrieve file. The link may be invalid or the file may have been removed.");
            } finally {
                setIsLoading(false);
            }
        };
        getFile();
    }, [fileId]);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await downloadPublicFile(file);
        } catch (err) {
            console.error("Download failed:", err);
            toast.error(getFileErrorMessage(err));
        } finally {
            setDownloading(false);
        }
    };

    const openShareModal = () => setShareModal({ isOpen: true, link: window.location.href });
    const closeShareModal = () => setShareModal({ isOpen: false, link: "" });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950">
                <Loader2 className="animate-spin text-brand-500" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950 px-4">
                <div className="text-center p-8 card-surface max-w-md">
                    <h2 className="font-display text-xl font-bold text-red-600">Something went wrong</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    if (!file) return null;

    const renderPreview = () => {
        if (!canPreview) return null;
        if (previewStatus === "loading" || previewStatus === "idle") {
            return (
                <div className="h-[480px] grid place-items-center bg-slate-100 dark:bg-slate-900 rounded-2xl">
                    <Loader2 className="animate-spin text-brand-500" size={28} />
                </div>
            );
        }
        if (previewStatus === "error" || !previewUrl) {
            return (
                <div className="h-[200px] grid place-items-center bg-slate-100 dark:bg-slate-900 rounded-2xl text-center px-6">
                    <div>
                        <AlertTriangle className="mx-auto text-amber-500 mb-2" size={32} />
                        <p className="text-slate-600 dark:text-slate-300">Preview unavailable. You can still download the file below.</p>
                    </div>
                </div>
            );
        }
        return (
            <div className="h-[480px] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                {kind === "image" && <ImageViewer url={previewUrl} name={file.name} />}
                {kind === "pdf" && <PdfViewer url={previewUrl} name={file.name} />}
                {kind === "text" && <iframe title={file.name} src={previewUrl} className="h-full w-full border-0 bg-white" />}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <header className="glass-strong border-b border-slate-200/60 dark:border-slate-800 sticky top-0 z-30">
                <div className="section-pad flex justify-between items-center h-16">
                    <Logo size={32} textClassName="text-lg text-slate-900 dark:text-white" />
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button onClick={openShareModal} className="btn-secondary !px-4 !py-2 text-sm">
                            <Copy size={16} /> Share Link
                        </button>
                    </div>
                </div>
            </header>

            <main className="section-pad py-10 flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`w-full ${canPreview ? "max-w-4xl" : "max-w-2xl"}`}
                >
                    {canPreview && <div className="mb-6">{renderPreview()}</div>}

                    <div className="card-surface p-8 text-center">
                        {!canPreview && (
                            <div className="flex justify-center mb-5">
                                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-brand-50 to-brand2-50 dark:from-slate-800 dark:to-slate-800/40 grid place-items-center">
                                    {getFileIcon(file, 40)}
                                </div>
                            </div>
                        )}

                        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white break-words">{file.name}</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            {formatFileSize(file.size)}
                            <span className="mx-2">·</span>
                            Shared on {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>

                        <span className="inline-block mt-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium px-3 py-1 rounded-full uppercase">
                            {file.type || "File"}
                        </span>

                        <div className="flex justify-center my-8">
                            <button onClick={handleDownload} disabled={downloading} className="btn-primary text-base">
                                {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                Download File
                            </button>
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 text-left">
                            <h3 className="font-display font-bold text-slate-800 dark:text-white mb-4">File Information</h3>
                            <div className="text-sm space-y-3">
                                {[
                                    ["File Name", file.name],
                                    ["File Type", file.type || "—"],
                                    ["File Size", formatFileSize(file.size)],
                                    ["Shared", new Date(file.uploadedAt).toLocaleDateString()],
                                ].map(([k, v]) => (
                                    <div key={k} className="flex justify-between gap-4">
                                        <span className="text-slate-500 dark:text-slate-400">{k}:</span>
                                        <span className="text-slate-800 dark:text-slate-100 font-medium break-all text-right">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 text-brand-800 dark:text-brand-300 p-4 rounded-xl flex items-center gap-3">
                        <Info size={20} />
                        <p className="text-sm">This file has been shared publicly. Anyone with this link can view and download it.</p>
                    </div>
                </motion.div>
            </main>

            <LinkShareModal isOpen={shareModal.isOpen} onClose={closeShareModal} link={shareModal.link} title="Share File" />
        </div>
    );
};

export default PublicFileView;
