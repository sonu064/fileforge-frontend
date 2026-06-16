import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { Check, Clock, Copy, Eye, Link2, Loader2, Lock, Trash2, X } from "lucide-react";
import { apiEndpoints } from "../util/apiEndpoints.js";
import { getFileErrorMessage } from "../util/fileApi.js";

const EXPIRY_OPTIONS = [
    { value: "never", label: "Never" },
    { value: "1h", label: "1 hour" },
    { value: "24h", label: "24 hours" },
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
    { value: "custom", label: "Custom date" },
];

const shareUrl = (shareId) => `${window.location.origin}/share/${shareId}`;

const ShareModal = ({ file, isOpen, onClose }) => {
    const { getToken } = useAuth();
    const [expiration, setExpiration] = useState("never");
    const [customDate, setCustomDate] = useState("");
    const [password, setPassword] = useState("");
    const [creating, setCreating] = useState(false);
    const [links, setLinks] = useState([]);
    const [loadingLinks, setLoadingLinks] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        if (isOpen && file) {
            setExpiration("never");
            setCustomDate("");
            setPassword("");
            loadLinks();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, file]);

    const loadLinks = async () => {
        setLoadingLinks(true);
        try {
            const token = await getToken();
            const res = await axios.get(apiEndpoints.LIST_FILE_SHARES(file.id), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLinks(res.data || []);
        } catch (error) {
            console.error("Failed to load share links", error);
        } finally {
            setLoadingLinks(false);
        }
    };

    const handleCreate = async () => {
        if (expiration === "custom" && !customDate) {
            toast.error("Pick a custom expiry date");
            return;
        }
        setCreating(true);
        try {
            const token = await getToken();
            const body = { expiry: expiration };
            if (expiration === "custom") body.customExpiresAt = new Date(customDate).toISOString();
            if (password.trim()) body.password = password.trim();
            const res = await axios.post(apiEndpoints.CREATE_SHARE(file.id), body, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await navigator.clipboard.writeText(shareUrl(res.data.shareId)).catch(() => {});
            toast.success(password.trim() ? "Protected link created & copied" : "Share link created & copied");
            setLinks((prev) => [res.data, ...prev]);
            setPassword("");
        } catch (error) {
            toast.error(getFileErrorMessage(error));
        } finally {
            setCreating(false);
        }
    };

    const handleCopy = (shareId) => {
        navigator.clipboard.writeText(shareUrl(shareId)).then(() => {
            setCopiedId(shareId);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const handleRevoke = async (shareId) => {
        try {
            const token = await getToken();
            await axios.delete(apiEndpoints.REVOKE_SHARE(shareId), {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLinks((prev) => prev.filter((l) => l.shareId !== shareId));
            toast.success("Link revoked");
        } catch (error) {
            toast.error(getFileErrorMessage(error));
        }
    };

    const formatExpiry = (link) => {
        if (link.expired) return "Expired";
        if (!link.expiresAt) return "Never expires";
        return `Expires ${new Date(link.expiresAt).toLocaleString()}`;
    };

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
                        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
                            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Link2 size={18} className="text-brand-500" /> Share &quot;{file.name}&quot;
                            </h3>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-5">
                            {/* Create new link */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                                    Link expiration
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {EXPIRY_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setExpiration(opt.value)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                                expiration === opt.value
                                                    ? "bg-brand-500 text-white"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                                {expiration === "custom" && (
                                    <input
                                        type="datetime-local"
                                        value={customDate}
                                        onChange={(e) => setCustomDate(e.target.value)}
                                        className="input-box mt-3"
                                    />
                                )}

                                <label className="mt-4 block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                                    Password protection <span className="text-slate-400 font-normal">(optional)</span>
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Set a password to protect this link"
                                        className="input-box !pl-9"
                                        autoComplete="new-password"
                                    />
                                </div>

                                <button onClick={handleCreate} disabled={creating} className="btn-primary mt-4 w-full justify-center">
                                    {creating ? <Loader2 size={18} className="animate-spin" /> : <Link2 size={18} />}
                                    Generate share link
                                </button>
                            </div>

                            {/* Existing links */}
                            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Active links</h4>
                                {loadingLinks ? (
                                    <div className="flex justify-center py-4"><Loader2 size={20} className="animate-spin text-brand-500" /></div>
                                ) : links.length === 0 ? (
                                    <p className="text-sm text-slate-400">No share links yet.</p>
                                ) : (
                                    <div className="space-y-2 max-h-56 overflow-y-auto">
                                        {links.map((link) => (
                                            <div key={link.shareId} className={`p-3 rounded-xl border ${link.expired ? "border-red-200 dark:border-red-500/30 bg-red-50/50 dark:bg-red-500/5" : "border-slate-200 dark:border-slate-800"}`}>
                                                <div className="flex items-center gap-2">
                                                    <input readOnly value={shareUrl(link.shareId)} className="input-box flex-1 !py-2 text-xs" />
                                                    <button onClick={() => handleCopy(link.shareId)} title="Copy" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                                        {copiedId === link.shareId ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                                                    </button>
                                                    <button onClick={() => handleRevoke(link.shareId)} title="Revoke" className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="flex items-center gap-1"><Eye size={12} /> {link.viewCount} views</span>
                                                    <span className={`flex items-center gap-1 ${link.expired ? "text-red-500" : ""}`}><Clock size={12} /> {formatExpiry(link)}</span>
                                                    {link.passwordProtected && <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400"><Lock size={12} /> Protected</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;
