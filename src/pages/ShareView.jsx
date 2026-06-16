import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { apiEndpoints } from "../util/apiEndpoints.js";
import { downloadSharedFile, getFileErrorMessage, verifySharePassword } from "../util/fileApi.js";
import { useFileObjectUrl } from "../util/useObjectUrl.js";
import toast from "react-hot-toast";
import { AlertTriangle, Clock, Download, Eye, Loader2, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../components/common/Logo.jsx";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import ImageViewer from "../components/ImageViewer.jsx";
import PdfViewer from "../components/PdfViewer.jsx";
import { formatFileSize, getFileIcon, getFileKind, isPreviewable } from "../util/fileHelpers.jsx";

/** Live "time remaining" countdown for an expiring link. */
const ExpiryCountdown = ({ expiresAt }) => {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);
    const ms = new Date(expiresAt).getTime() - now;
    if (ms <= 0) return <span className="flex items-center gap-1 text-red-500"><Clock size={14} /> Expired</span>;
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const label = d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m ${sec}s` : `${m}m ${sec}s`;
    return <span className="flex items-center gap-1"><Clock size={14} /> Expires in {label}</span>;
};

const ShareView = () => {
    const { shareId } = useParams();
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    // Password gate
    const [password, setPassword] = useState("");
    const [unlocked, setUnlocked] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [pwError, setPwError] = useState("");

    const needsPassword = Boolean(file?.passwordProtected) && !unlocked;
    const kind = file ? getFileKind(file) : "other";
    const canPreview = file ? isPreviewable(file) : false;
    const { url: previewUrl, status: previewStatus } = useFileObjectUrl({
        shareId,
        sharePassword: file?.passwordProtected ? password : undefined,
        enabled: Boolean(file) && canPreview && !needsPassword,
    });

    useEffect(() => {
        const resolve = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(apiEndpoints.RESOLVE_SHARE(shareId));
                setFile(res.data);
                setError(null);
            } catch (err) {
                console.error("Error resolving share link:", err);
                setError(getFileErrorMessage(err));
            } finally {
                setIsLoading(false);
            }
        };
        resolve();
    }, [shareId]);

    const handleUnlock = async (e) => {
        e?.preventDefault();
        if (!password.trim()) return;
        setVerifying(true);
        setPwError("");
        try {
            const valid = await verifySharePassword(shareId, password);
            if (valid) {
                setUnlocked(true);
            } else {
                setPwError("Incorrect password. Please try again.");
            }
        } catch (err) {
            setPwError(getFileErrorMessage(err));
        } finally {
            setVerifying(false);
        }
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await downloadSharedFile(shareId, file.name, file.passwordProtected ? password : undefined);
        } catch (err) {
            toast.error(getFileErrorMessage(err));
        } finally {
            setDownloading(false);
        }
    };

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
                    <AlertTriangle className="mx-auto text-amber-500 mb-3" size={40} />
                    <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">Link unavailable</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    if (!file) return null;

    if (needsPassword) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <header className="glass-strong border-b border-slate-200/60 dark:border-slate-800 sticky top-0 z-30">
                    <div className="section-pad flex justify-between items-center h-16">
                        <Logo size={32} textClassName="text-lg text-slate-900 dark:text-white" />
                        <ThemeToggle />
                    </div>
                </header>
                <main className="section-pad py-16 flex justify-center">
                    <motion.form
                        onSubmit={handleUnlock}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-surface p-8 w-full max-w-md text-center"
                    >
                        <div className="flex justify-center mb-5">
                            <div className="h-16 w-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 grid place-items-center">
                                <Lock size={30} className="text-amber-500" />
                            </div>
                        </div>
                        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Password required</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">This file is protected. Enter the password to continue.</p>
                        <input
                            type="password"
                            autoFocus
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setPwError(""); }}
                            placeholder="Enter password"
                            className="input-box text-center"
                        />
                        {pwError && <p className="text-sm text-red-500 mt-2">{pwError}</p>}
                        <button type="submit" disabled={verifying || !password.trim()} className="btn-primary w-full justify-center mt-5">
                            {verifying ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                            Unlock
                        </button>
                    </motion.form>
                </main>
            </div>
        );
    }

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
                    <p className="text-slate-600 dark:text-slate-300">Preview unavailable. You can still download below.</p>
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
                    <ThemeToggle />
                </div>
            </header>

            <main className="section-pad py-10 flex justify-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`w-full ${canPreview ? "max-w-4xl" : "max-w-2xl"}`}>
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
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-3">
                            <span>{formatFileSize(file.size)}</span>
                            <span className="flex items-center gap-1"><Eye size={14} /> {file.viewCount} views</span>
                            {file.expiresAt && <ExpiryCountdown expiresAt={file.expiresAt} />}
                        </div>

                        <div className="flex justify-center my-8">
                            <button onClick={handleDownload} disabled={downloading} className="btn-primary text-base">
                                {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                                Download File
                            </button>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default ShareView;
