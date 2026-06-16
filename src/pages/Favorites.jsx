import DashboardLayout from "../layout/DashboardLayout.jsx";
import { useCallback, useEffect, useState } from "react";
import { Grid, List, Loader2, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FileCard from "../components/FileCard.jsx";
import FileListRow from "../components/FileListRow.jsx";
import ConfirmationDialog from "../components/ConfirmationDialog.jsx";
import ShareModal from "../components/ShareModal.jsx";
import FilePreviewModal from "../components/FilePreviewModal.jsx";
import FileDetailsModal from "../components/FileDetailsModal.jsx";
import { apiEndpoints } from "../util/apiEndpoints.js";
import { getFileIcon } from "../util/fileHelpers.jsx";
import * as folderApi from "../util/folderApi.js";

const Favorites = () => {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, fileId: null });
    const [shareTarget, setShareTarget] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [detailsFile, setDetailsFile] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await folderApi.fetchFavorites(getToken);
            setFiles(data);
        } catch (e) {
            console.error("Error loading favorites", e);
            toast.error("Could not load favorites");
        } finally {
            setLoading(false);
        }
    }, [getToken]);

    useEffect(() => { load(); }, [load]);

    const togglePublic = async (file) => {
        try {
            const token = await getToken();
            await axios.patch(apiEndpoints.TOGGLE_FILE(file.id), {}, { headers: { Authorization: `Bearer ${token}` } });
            setFiles((fs) => fs.map((f) => (f.id === file.id ? { ...f, isPublic: !f.isPublic } : f)));
        } catch {
            toast.error("Error toggling file status");
        }
    };

    const unfavorite = async (file) => {
        try {
            await folderApi.toggleFavorite(getToken, file.id);
            setFiles((fs) => fs.filter((f) => f.id !== file.id));
            toast.success("Removed from favorites");
        } catch {
            toast.error("Could not update favorite");
        }
    };

    const handleDelete = async () => {
        const fileId = deleteConfirmation.fileId;
        if (!fileId) return;
        try {
            const token = await getToken();
            await axios.delete(apiEndpoints.DELETE_FILE(fileId), { headers: { Authorization: `Bearer ${token}` } });
            setFiles((fs) => fs.filter((f) => f.id !== fileId));
            setDeleteConfirmation({ isOpen: false, fileId: null });
            toast.success("File deleted");
        } catch {
            toast.error("Error deleting file");
        }
    };

    const ViewToggle = ({ mode, icon: Icon }) => (
        <button
            onClick={() => setViewMode(mode)}
            className={`grid place-items-center h-9 w-9 rounded-lg transition-colors cursor-pointer ${
                viewMode === mode ? "bg-brand-500 text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
        >
            <Icon size={18} />
        </button>
    );

    return (
        <DashboardLayout activeMenu="Favorites">
            <div className="p-5 sm:p-7">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                            <Star className="text-amber-500 fill-amber-500" size={26} /> Favorites
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">{files.length} starred file{files.length !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                        <ViewToggle mode="grid" icon={Grid} />
                        <ViewToggle mode="list" icon={List} />
                    </div>
                </div>

                {loading ? (
                    <div className="py-24 grid place-items-center"><Loader2 className="animate-spin text-brand-500" size={32} /></div>
                ) : files.length === 0 ? (
                    <div className="card-surface p-12 flex flex-col items-center justify-center text-center">
                        <div className="h-16 w-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 grid place-items-center mb-4">
                            <Star size={32} className="text-amber-400" />
                        </div>
                        <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white mb-2">No favorites yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">Star files from My Files to find them quickly here.</p>
                        <button onClick={() => navigate("/my-files")} className="btn-primary">Go to My Files</button>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {files.map((file) => (
                            <FileCard
                                key={file.id}
                                file={file}
                                onDelete={(id) => setDeleteConfirmation({ isOpen: true, fileId: id })}
                                onTogglePublic={togglePublic}
                                onShareLink={setShareTarget}
                                onPreview={setPreviewFile}
                                onDetails={setDetailsFile}
                                onFavorite={unfavorite}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto card-surface">
                        <table className="min-w-full">
                            <thead className="border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    {["Name", "Size", "Uploaded", "Sharing", "Actions"].map((h) => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {files.map((file) => (
                                    <FileListRow
                                        key={file.id}
                                        file={file}
                                        onDelete={(id) => setDeleteConfirmation({ isOpen: true, fileId: id })}
                                        onTogglePublic={togglePublic}
                                        onShareLink={setShareTarget}
                                        onPreview={setPreviewFile}
                                        onDetails={setDetailsFile}
                                        onFavorite={unfavorite}
                                        getFileIcon={getFileIcon}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}

                <ConfirmationDialog
                    isOpen={deleteConfirmation.isOpen}
                    onClose={() => setDeleteConfirmation({ isOpen: false, fileId: null })}
                    title="Delete File"
                    message="Are you sure you want to delete this file? This action cannot be undone."
                    confirmText="Delete"
                    onConfirm={handleDelete}
                    confirmButtonClass="bg-red-600 hover:bg-red-700"
                />
                <ShareModal file={shareTarget} isOpen={Boolean(shareTarget)} onClose={() => setShareTarget(null)} />
                <FilePreviewModal file={previewFile} isOpen={Boolean(previewFile)} onClose={() => setPreviewFile(null)} />
                <FileDetailsModal file={detailsFile} isOpen={Boolean(detailsFile)} onClose={() => setDetailsFile(null)} />
            </div>
        </DashboardLayout>
    );
};

export default Favorites;
