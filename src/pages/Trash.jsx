import DashboardLayout from "../layout/DashboardLayout.jsx";
import { useContext, useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { UserCreditsContext } from "../context/UserCreditsContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, RotateCcw, Trash as TrashIcon, Trash2 } from "lucide-react";
import { apiEndpoints } from "../util/apiEndpoints.js";
import { formatDate, formatFileSize, getFileIcon } from "../util/fileHelpers.jsx";
import ConfirmationDialog from "../components/ConfirmationDialog.jsx";

const Trash = () => {
    const { getToken } = useAuth();
    const { fetchUserCredits } = useContext(UserCreditsContext);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [purgeTarget, setPurgeTarget] = useState(null); // file id pending permanent delete
    const [emptyOpen, setEmptyOpen] = useState(false);

    const auth = useCallback(async () => ({ headers: { Authorization: `Bearer ${await getToken()}` } }), [getToken]);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get(apiEndpoints.TRASH, await auth());
            setFiles(res.data || []);
        } catch (e) {
            console.error("Error loading trash", e);
            toast.error("Could not load trash");
        } finally {
            setLoading(false);
        }
    }, [auth]);

    useEffect(() => { load(); }, [load]);

    const handleRestore = async (file) => {
        try {
            await axios.put(apiEndpoints.RESTORE_FILE(file.id), {}, await auth());
            setFiles((fs) => fs.filter((f) => f.id !== file.id));
            await fetchUserCredits();
            toast.success(`Restored “${file.name}”`);
        } catch {
            toast.error("Could not restore file");
        }
    };

    const handlePurge = async () => {
        if (!purgeTarget) return;
        try {
            await axios.delete(apiEndpoints.PERMANENT_DELETE(purgeTarget), await auth());
            setFiles((fs) => fs.filter((f) => f.id !== purgeTarget));
            setPurgeTarget(null);
            toast.success("File permanently deleted");
        } catch {
            toast.error("Could not delete file");
        }
    };

    const handleEmpty = async () => {
        try {
            await axios.delete(apiEndpoints.EMPTY_TRASH, await auth());
            setFiles([]);
            setEmptyOpen(false);
            toast.success("Trash emptied");
        } catch {
            toast.error("Could not empty trash");
        }
    };

    return (
        <DashboardLayout activeMenu="Trash">
            <div className="p-5 sm:p-7">
                <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                    <div>
                        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <TrashIcon className="text-slate-500" size={26} /> Trash
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">{files.length} item{files.length !== 1 ? "s" : ""} in the recycle bin</p>
                    </div>
                    {files.length > 0 && (
                        <button onClick={() => setEmptyOpen(true)} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 font-medium hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors cursor-pointer">
                            <Trash2 size={18} /> Empty trash
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="py-24 grid place-items-center"><Loader2 className="animate-spin text-brand-500" size={32} /></div>
                ) : files.length === 0 ? (
                    <div className="card-surface p-12 flex flex-col items-center justify-center text-center">
                        <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 grid place-items-center mb-4">
                            <TrashIcon size={32} className="text-slate-400" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white mb-2">Trash is empty</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">Deleted files appear here and can be restored anytime.</p>
                        <button onClick={() => navigate("/my-files")} className="btn-primary">Back to My Files</button>
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-surface divide-y divide-slate-100 dark:divide-slate-800">
                        {files.map((file) => (
                            <div key={file.id} className="flex items-center gap-4 px-5 py-4">
                                <div className="h-10 w-10 rounded-lg bg-slate-50 dark:bg-slate-800 grid place-items-center shrink-0">
                                    {getFileIcon(file)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium text-slate-800 dark:text-slate-100 truncate" title={file.name}>{file.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {formatFileSize(file.size)} · Deleted {formatDate(file.deletedAt)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button onClick={() => handleRestore(file)} title="Restore" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                        <RotateCcw size={16} /> Restore
                                    </button>
                                    <button onClick={() => setPurgeTarget(file.id)} title="Delete forever" className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}

                <ConfirmationDialog
                    isOpen={Boolean(purgeTarget)}
                    onClose={() => setPurgeTarget(null)}
                    title="Delete forever"
                    message="This file will be permanently deleted and cannot be recovered. Continue?"
                    confirmText="Delete forever"
                    onConfirm={handlePurge}
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                />
                <ConfirmationDialog
                    isOpen={emptyOpen}
                    onClose={() => setEmptyOpen(false)}
                    title="Empty trash"
                    message="All files in the recycle bin will be permanently deleted. This cannot be undone."
                    confirmText="Empty trash"
                    onConfirm={handleEmpty}
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                />
            </div>
        </DashboardLayout>
    );
};

export default Trash;
