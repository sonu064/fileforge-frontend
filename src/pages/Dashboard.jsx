import DashboardLayout from "../layout/DashboardLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useContext, useEffect, useMemo, useState } from "react";
import { UserCreditsContext } from "../context/UserCreditsContext.jsx";
import axios from "axios";
import { apiEndpoints } from "../util/apiEndpoints.js";
import { getUploadErrorMessage, uploadFilesRequest } from "../util/uploadFiles.js";
import { AlertCircle, CheckCircle2, Coins, Files, HardDrive, Loader2, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import DashboardUpload from "../components/DashboardUpload.jsx";
import RecentFiles from "../components/RecentFiles.jsx";
import StatsCard from "../components/StatsCard.jsx";
import FilePreviewModal from "../components/FilePreviewModal.jsx";
import FileDetailsModal from "../components/FileDetailsModal.jsx";

const MAX_FILES = 5;

const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    return (bytes / 1073741824).toFixed(2) + " GB";
};

const Dashboard = () => {
    const [allFiles, setAllFiles] = useState([]);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [previewFile, setPreviewFile] = useState(null);
    const [detailsFile, setDetailsFile] = useState(null);
    const { getToken } = useAuth();
    const { credits, applyRemainingCredits } = useContext(UserCreditsContext);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const res = await axios.get(apiEndpoints.FETCH_FILES, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllFiles(res.data || []);
        } catch (error) {
            console.error("Error fetching files:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getToken]);

    const recentFiles = useMemo(
        () =>
            [...allFiles]
                .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
                .slice(0, 5),
        [allFiles]
    );

    const stats = useMemo(() => {
        const totalSize = allFiles.reduce((sum, f) => sum + (f.size || 0), 0);
        const shared = allFiles.filter((f) => f.isPublic || f.public).length;
        return { totalFiles: allFiles.length, totalSize, shared };
    }, [allFiles]);

    // 7-day upload activity for the mini bar chart
    const activity = useMemo(() => {
        const days = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setHours(0, 0, 0, 0);
            d.setDate(d.getDate() - (6 - i));
            return { label: d.toLocaleDateString(undefined, { weekday: "short" }), date: d, count: 0 };
        });
        allFiles.forEach((f) => {
            const t = new Date(f.uploadedAt);
            t.setHours(0, 0, 0, 0);
            const slot = days.find((d) => d.date.getTime() === t.getTime());
            if (slot) slot.count += 1;
        });
        const max = Math.max(1, ...days.map((d) => d.count));
        return { days, max };
    }, [allFiles]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (uploadFiles.length + selectedFiles.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once.`);
            setMessageType("error");
            return;
        }
        setUploadFiles((prev) => [...prev, ...selectedFiles]);
        setMessage("");
        setMessageType("");
    };

    const handleRemoveFile = (index) => {
        setUploadFiles((prev) => prev.filter((_, i) => i !== index));
        setMessage("");
        setMessageType("");
    };

    const handleUpload = async () => {
        if (uploadFiles.length === 0) {
            setMessage("Please select at least one file to upload.");
            setMessageType("error");
            return;
        }
        if (uploadFiles.length > MAX_FILES) {
            setMessage(`You can only upload a maximum of ${MAX_FILES} files at once.`);
            setMessageType("error");
            return;
        }
        if (credits != null && uploadFiles.length > credits) {
            setMessage(`Not enough credits. You have ${credits} upload${credits === 1 ? "" : "s"} remaining.`);
            setMessageType("error");
            return;
        }

        setUploading(true);
        setMessage("Uploading files...");
        setMessageType("info");

        try {
            const data = await uploadFilesRequest(uploadFiles, getToken);

            applyRemainingCredits(data?.remainingCredits);

            setMessage("Files uploaded successfully!");
            setMessageType("success");
            setUploadFiles([]);
            await fetchFiles();
        } catch (error) {
            setMessage(getUploadErrorMessage(error));
            setMessageType("error");
        } finally {
            setUploading(false);
        }
    };

    const isUploadDisabled =
        uploadFiles.length === 0 ||
        uploadFiles.length > MAX_FILES ||
        credits == null ||
        credits <= 0 ||
        uploadFiles.length > credits;

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="p-5 sm:p-7">
                <div className="mb-7">
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        Welcome back 👋
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Here&apos;s an overview of your storage and recent activity.
                    </p>
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                            messageType === "error"
                                ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300"
                                : messageType === "success"
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                : "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300"
                        }`}
                    >
                        {messageType === "error" && <AlertCircle size={18} />}
                        {messageType === "success" && <CheckCircle2 size={18} />}
                        {messageType === "info" && <Loader2 size={18} className="animate-spin" />}
                        {message}
                    </motion.div>
                )}

                {/* Analytics cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-7">
                    <StatsCard index={0} icon={Files} label="Total Files" value={stats.totalFiles} gradient="from-brand-500 to-brand2-500" hint="All uploaded files" />
                    <StatsCard index={1} icon={HardDrive} label="Storage Used" value={formatBytes(stats.totalSize)} gradient="from-sky-500 to-indigo-500" hint="Across all files" />
                    <StatsCard index={2} icon={Coins} label="Credits Remaining" value={credits ?? "—"} gradient="from-amber-500 to-orange-500" progress={credits != null ? Math.min(100, (credits / 5000) * 100) : 0} hint={credits != null ? `${credits} upload${credits === 1 ? "" : "s"} available` : "Loading credits…"} />
                    <StatsCard index={3} icon={Share2} label="Shared Files" value={stats.shared} gradient="from-accent-500 to-rose-500" hint="Public links active" />
                </div>

                {/* Activity chart */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="card-surface p-5 sm:p-6 mb-7"
                >
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Upload activity</h2>
                        <span className="text-xs text-slate-500 dark:text-slate-400">Last 7 days</span>
                    </div>
                    <div className="flex items-end justify-between gap-3 h-40">
                        {activity.days.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full flex-1 flex items-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(d.count / activity.max) * 100}%` }}
                                        transition={{ delay: 0.3 + i * 0.06, duration: 0.6, ease: "easeOut" }}
                                        className="w-full rounded-lg bg-gradient-to-t from-brand-500 to-brand2-400 min-h-[6px] relative group"
                                    >
                                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {d.count}
                                        </span>
                                    </motion.div>
                                </div>
                                <span className="text-xs text-slate-400">{d.label}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Upload + recent */}
                <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-6">
                    <DashboardUpload
                        files={uploadFiles}
                        onFileChange={handleFileChange}
                        onUpload={handleUpload}
                        uploading={uploading}
                        onRemoveFile={handleRemoveFile}
                        remainingCredits={credits}
                        maxBatch={MAX_FILES}
                        isUploadDisabled={isUploadDisabled}
                    />

                    {loading ? (
                        <div className="card-surface p-8 flex flex-col items-center justify-center min-h-[300px]">
                            <Loader2 size={36} className="text-brand-500 animate-spin mb-4" />
                            <p className="text-slate-500 dark:text-slate-400">Loading your files...</p>
                        </div>
                    ) : (
                        <RecentFiles
                            files={recentFiles}
                            onPreview={setPreviewFile}
                            onDetails={setDetailsFile}
                        />
                    )}
                </div>
            </div>

            <FilePreviewModal
                file={previewFile}
                isOpen={Boolean(previewFile)}
                onClose={() => setPreviewFile(null)}
            />
            <FileDetailsModal
                file={detailsFile}
                isOpen={Boolean(detailsFile)}
                onClose={() => setDetailsFile(null)}
            />
        </DashboardLayout>
    );
};

export default Dashboard;
