import DashboardLayout from "../layout/DashboardLayout.jsx";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CheckSquare, Download, File, FolderPlus, FolderInput, Grid, List, Loader2, Square, Trash2, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { UserCreditsContext } from "../context/UserCreditsContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import FileCard from "../components/FileCard.jsx";
import FolderCard from "../components/FolderCard.jsx";
import Breadcrumb from "../components/Breadcrumb.jsx";
import DraggableFile from "../components/DraggableFile.jsx";
import TypeFilterChips from "../components/TypeFilterChips.jsx";
import CreateFolderModal from "../components/CreateFolderModal.jsx";
import RenameFolderModal from "../components/RenameFolderModal.jsx";
import MoveToFolderModal from "../components/MoveToFolderModal.jsx";
import { apiEndpoints } from "../util/apiEndpoints.js";
import ConfirmationDialog from "../components/ConfirmationDialog.jsx";
import ShareModal from "../components/ShareModal.jsx";
import FileListRow from "../components/FileListRow.jsx";
import FilePreviewModal from "../components/FilePreviewModal.jsx";
import FileDetailsModal from "../components/FileDetailsModal.jsx";
import { getFileCategory, getFileIcon } from "../util/fileHelpers.jsx";
import { bulkDownload } from "../util/fileApi.js";
import * as folderApi from "../util/folderApi.js";

const MyFiles = () => {
    const { getToken } = useAuth();
    const { fetchUserCredits } = useContext(UserCreditsContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [currentFolderId, setCurrentFolderId] = useState(() => searchParams.get("folderId") || null);
    const [contents, setContents] = useState({ currentFolder: null, breadcrumb: [], folders: [], files: [] });
    const [allFolders, setAllFolders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [viewMode, setViewMode] = useState("grid");
    const [typeFilter, setTypeFilter] = useState("all");
    const [selected, setSelected] = useState(new Set());
    const [activeDrag, setActiveDrag] = useState(null);

    // modals
    const [createOpen, setCreateOpen] = useState(false);
    const [renameTarget, setRenameTarget] = useState(null);
    const [moveFolderTarget, setMoveFolderTarget] = useState(null); // folder being moved
    const [moveFileTargets, setMoveFileTargets] = useState(null);    // array of file ids being moved
    const [deleteFile, setDeleteFile] = useState({ isOpen: false, fileId: null });
    const [deleteFolderTarget, setDeleteFolderTarget] = useState(null);
    const [shareTarget, setShareTarget] = useState(null);
    const [previewFile, setPreviewFile] = useState(null);
    const [detailsFile, setDetailsFile] = useState(null);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    const loadContents = useCallback(async (folderId) => {
        setLoading(true);
        try {
            const [data, folders] = await Promise.all([
                folderApi.fetchFolderContents(getToken, folderId),
                folderApi.listFolders(getToken),
            ]);
            setContents(data);
            setAllFolders(folders);
            setSelected(new Set());
        } catch (error) {
            console.error("Error loading folder contents", error);
            toast.error("Could not load this folder");
        } finally {
            setLoading(false);
        }
    }, [getToken]);

    // Sync the folder from the URL (?folderId=...) so global-search results can deep-link into a folder.
    useEffect(() => {
        setCurrentFolderId(searchParams.get("folderId") || null);
    }, [searchParams]);

    useEffect(() => {
        loadContents(currentFolderId);
    }, [currentFolderId, loadContents]);

    const openFolder = (folder) => setCurrentFolderId(folder.id);
    const navigateTo = (id) => setCurrentFolderId(id);

    /* --------------------------------- folders --------------------------------- */

    const handleCreateFolder = async (name) => {
        try {
            await folderApi.createFolder(getToken, name, currentFolderId);
            setCreateOpen(false);
            toast.success("Folder created");
            loadContents(currentFolderId);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Could not create folder");
        }
    };

    const handleRenameFolder = async (name) => {
        try {
            await folderApi.renameFolder(getToken, renameTarget.id, name);
            setRenameTarget(null);
            toast.success("Folder renamed");
            loadContents(currentFolderId);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Could not rename folder");
        }
    };

    const handleDeleteFolder = async () => {
        try {
            await folderApi.deleteFolder(getToken, deleteFolderTarget.id);
            setDeleteFolderTarget(null);
            toast.success("Folder deleted");
            loadContents(currentFolderId);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Could not delete folder");
        }
    };

    const handleMoveFolder = async (parentId) => {
        try {
            await folderApi.moveFolder(getToken, moveFolderTarget.id, parentId);
            setMoveFolderTarget(null);
            toast.success("Folder moved");
            loadContents(currentFolderId);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Could not move folder");
        }
    };

    /* ---------------------------------- files ---------------------------------- */

    const doMoveFiles = async (fileIds, folderId) => {
        try {
            if (fileIds.length === 1) await folderApi.moveFile(getToken, fileIds[0], folderId);
            else await folderApi.moveFiles(getToken, fileIds, folderId);
            toast.success(`Moved ${fileIds.length} item${fileIds.length !== 1 ? "s" : ""}`);
            loadContents(currentFolderId);
        } catch (e) {
            toast.error(e?.response?.data?.message || "Could not move file");
        }
    };

    const handleMoveFilesConfirm = async (folderId) => {
        await doMoveFiles(moveFileTargets, folderId);
        setMoveFileTargets(null);
    };

    const togglePublic = async (file) => {
        try {
            const token = await getToken();
            await axios.patch(apiEndpoints.TOGGLE_FILE(file.id), {}, { headers: { Authorization: `Bearer ${token}` } });
            setContents((c) => ({ ...c, files: c.files.map((f) => (f.id === file.id ? { ...f, isPublic: !f.isPublic } : f)) }));
        } catch (error) {
            console.error("Error toggling file status", error);
            toast.error("Error toggling file status");
        }
    };

    const toggleFavorite = async (file) => {
        try {
            const updated = await folderApi.toggleFavorite(getToken, file.id);
            setContents((c) => ({ ...c, files: c.files.map((f) => (f.id === file.id ? { ...f, favorite: updated.favorite } : f)) }));
        } catch (error) {
            console.error("Error toggling favorite", error);
            toast.error("Could not update favorite");
        }
    };

    const handleDeleteFile = async () => {
        const fileId = deleteFile.fileId;
        if (!fileId) return;
        try {
            const token = await getToken();
            await axios.delete(apiEndpoints.DELETE_FILE(fileId), { headers: { Authorization: `Bearer ${token}` } });
            setContents((c) => ({ ...c, files: c.files.filter((f) => f.id !== fileId) }));
            setDeleteFile({ isOpen: false, fileId: null });
            await fetchUserCredits();
            toast.success("File deleted");
        } catch (error) {
            console.error("Error deleting file", error);
            toast.error("Error deleting file");
        }
    };

    /* -------------------------------- selection -------------------------------- */

    const toggleSelect = (id) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };
    const clearSelection = () => setSelected(new Set());

    const bulkDelete = async () => {
        const ids = [...selected];
        try {
            const token = await getToken();
            await axios.post(apiEndpoints.BULK_DELETE, { fileIds: ids }, { headers: { Authorization: `Bearer ${token}` } });
            setContents((c) => ({ ...c, files: c.files.filter((f) => !selected.has(f.id)) }));
            clearSelection();
            await fetchUserCredits();
            toast.success(`Moved ${ids.length} file${ids.length !== 1 ? "s" : ""} to trash`);
        } catch (e) {
            console.error(e);
            toast.error("Could not delete selected files");
        }
    };

    const bulkDownloadSelected = async () => {
        const ids = [...selected];
        try {
            await bulkDownload(ids, getToken, `cloudshare-${ids.length}-files.zip`);
            toast.success("Preparing your download…");
        } catch (e) {
            console.error(e);
            toast.error("Could not download selected files");
        }
    };

    /* ----------------------------- drag and drop ------------------------------ */

    const onDragStart = (event) => {
        const fileId = event.active.data.current?.fileId;
        const file = contents.files.find((f) => f.id === fileId);
        setActiveDrag(file || null);
    };

    const onDragEnd = (event) => {
        setActiveDrag(null);
        const { active, over } = event;
        if (!over) return;
        const targetFolderId = over.data.current?.folderId ?? null;
        const draggedId = active.data.current?.fileId;
        if (!draggedId) return;
        if (targetFolderId === currentFolderId) return; // already here

        const ids = selected.has(draggedId) && selected.size > 0 ? [...selected] : [draggedId];
        doMoveFiles(ids, targetFolderId);
        clearSelection();
    };

    /* -------------------------------- filtering -------------------------------- */

    const counts = useMemo(() => {
        const c = { all: contents.files.length };
        contents.files.forEach((f) => {
            const cat = getFileCategory(f);
            c[cat] = (c[cat] || 0) + 1;
        });
        return c;
    }, [contents.files]);

    const visibleFiles = useMemo(() => {
        if (typeFilter === "all") return contents.files;
        return contents.files.filter((f) => getFileCategory(f) === typeFilter);
    }, [contents.files, typeFilter]);

    const allVisibleSelected = visibleFiles.length > 0 && visibleFiles.every((f) => selected.has(f.id));
    const toggleSelectAll = () => {
        setSelected((prev) => {
            if (allVisibleSelected) {
                const next = new Set(prev);
                visibleFiles.forEach((f) => next.delete(f.id));
                return next;
            }
            return new Set([...prev, ...visibleFiles.map((f) => f.id)]);
        });
    };

    const isEmpty = contents.folders.length === 0 && contents.files.length === 0;

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
        <DashboardLayout activeMenu="My Files">
            <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className="p-5 sm:p-7">
                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
                        <div>
                            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">My Files</h1>
                            <div className="mt-2"><Breadcrumb trail={contents.breadcrumb} onNavigate={navigateTo} /></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCreateOpen(true)} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                <FolderPlus size={18} /> <span className="hidden sm:inline">New folder</span>
                            </button>
                            <button onClick={() => navigate("/upload")} className="btn-primary inline-flex items-center gap-2">
                                <File size={18} /> <span className="hidden sm:inline">Upload</span>
                            </button>
                            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                                <ViewToggle mode="grid" icon={Grid} />
                                <ViewToggle mode="list" icon={List} />
                            </div>
                        </div>
                    </div>

                    {/* Filter chips */}
                    {contents.files.length > 0 && (
                        <div className="mb-5">
                            <TypeFilterChips counts={counts} active={typeFilter} onChange={setTypeFilter} />
                        </div>
                    )}

                    {/* Bulk action bar */}
                    {selected.size > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30"
                        >
                            <span className="text-sm font-medium text-brand-700 dark:text-brand-300">{selected.size} selected</span>
                            <button onClick={bulkDownloadSelected} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                <Download size={15} /> Download
                            </button>
                            <button onClick={() => setMoveFileTargets([...selected])} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                <FolderInput size={15} /> Move
                            </button>
                            <button onClick={bulkDelete} className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 cursor-pointer">
                                <Trash2 size={15} /> Delete
                            </button>
                            <button onClick={clearSelection} className="ml-auto inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer">
                                <X size={15} /> Clear
                            </button>
                        </motion.div>
                    )}

                    {/* Body */}
                    {loading ? (
                        <div className="py-24 grid place-items-center">
                            <Loader2 className="animate-spin text-brand-500" size={32} />
                        </div>
                    ) : isEmpty ? (
                        <div className="card-surface p-12 flex flex-col items-center justify-center text-center">
                            <div className="h-16 w-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 grid place-items-center mb-4">
                                <File size={32} className="text-brand-400" />
                            </div>
                            <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white mb-2">This folder is empty</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">Create a subfolder or upload files to get started.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setCreateOpen(true)} className="btn-secondary">New folder</button>
                                <button onClick={() => navigate("/upload")} className="btn-primary">Upload files</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Folders */}
                            {contents.folders.length > 0 && (
                                <div className="mb-7">
                                    <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Folders</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {contents.folders.map((folder) => (
                                            <FolderCard
                                                key={folder.id}
                                                folder={folder}
                                                onOpen={openFolder}
                                                onRename={setRenameTarget}
                                                onDelete={setDeleteFolderTarget}
                                                onMove={setMoveFolderTarget}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Files */}
                            {visibleFiles.length > 0 ? (
                                <>
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Files</h2>
                                        <button onClick={toggleSelectAll} className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 cursor-pointer">
                                            {allVisibleSelected ? <CheckSquare size={15} /> : <Square size={15} />}
                                            {allVisibleSelected ? "Deselect all" : "Select all"}
                                        </button>
                                    </div>
                                    {viewMode === "grid" ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                            {visibleFiles.map((file) => (
                                                <DraggableFile key={file.id} id={`file-${file.id}`} fileId={file.id} selected={selected.has(file.id)}>
                                                    <FileCard
                                                        file={file}
                                                        onDelete={(id) => setDeleteFile({ isOpen: true, fileId: id })}
                                                        onTogglePublic={togglePublic}
                                                        onShareLink={setShareTarget}
                                                        onPreview={setPreviewFile}
                                                        onDetails={setDetailsFile}
                                                        onFavorite={toggleFavorite}
                                                        onMove={(f) => setMoveFileTargets([f.id])}
                                                        selectable
                                                        selected={selected.has(file.id)}
                                                        onToggleSelect={toggleSelect}
                                                    />
                                                </DraggableFile>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto card-surface">
                                            <table className="min-w-full">
                                                <thead className="border-b border-slate-200 dark:border-slate-800">
                                                    <tr>
                                                        {["Name", "Size", "Uploaded", "Sharing", "Actions"].map((h) => (
                                                            <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                    {visibleFiles.map((file) => (
                                                        <FileListRow
                                                            key={file.id}
                                                            file={file}
                                                            onDelete={(id) => setDeleteFile({ isOpen: true, fileId: id })}
                                                            onTogglePublic={togglePublic}
                                                            onShareLink={setShareTarget}
                                                            onPreview={setPreviewFile}
                                                            onDetails={setDetailsFile}
                                                            onFavorite={toggleFavorite}
                                                            onMove={(f) => setMoveFileTargets([f.id])}
                                                            getFileIcon={getFileIcon}
                                                        />
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </>
                            ) : contents.files.length > 0 ? (
                                <p className="text-sm text-slate-400 py-6">No files match this filter.</p>
                            ) : null}
                        </>
                    )}
                </div>

                <DragOverlay>
                    {activeDrag ? (
                        <div className="px-3 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium shadow-xl shadow-brand-500/40 flex items-center gap-2">
                            <File size={15} />
                            {selected.size > 1 && selected.has(activeDrag.id) ? `${selected.size} files` : activeDrag.name}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Modals */}
            <CreateFolderModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreateFolder} />
            <RenameFolderModal isOpen={Boolean(renameTarget)} folder={renameTarget} onClose={() => setRenameTarget(null)} onRename={handleRenameFolder} />

            <MoveToFolderModal
                isOpen={Boolean(moveFileTargets)}
                folders={allFolders}
                title={`Move ${moveFileTargets?.length || 0} item${(moveFileTargets?.length || 0) !== 1 ? "s" : ""}`}
                onClose={() => setMoveFileTargets(null)}
                onMove={handleMoveFilesConfirm}
            />
            <MoveToFolderModal
                isOpen={Boolean(moveFolderTarget)}
                folders={allFolders}
                excludeIds={moveFolderTarget ? [moveFolderTarget.id, ...descendantIds(allFolders, moveFolderTarget.id)] : []}
                title="Move folder"
                onClose={() => setMoveFolderTarget(null)}
                onMove={handleMoveFolder}
            />

            <ConfirmationDialog
                isOpen={deleteFile.isOpen}
                onClose={() => setDeleteFile({ isOpen: false, fileId: null })}
                title="Delete File"
                message="Are you sure you want to delete this file? This action cannot be undone."
                confirmText="Delete"
                onConfirm={handleDeleteFile}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
            />
            <ConfirmationDialog
                isOpen={Boolean(deleteFolderTarget)}
                onClose={() => setDeleteFolderTarget(null)}
                title="Delete Folder"
                message="Deleting this folder will permanently remove it and everything inside it, including subfolders and files. This cannot be undone."
                confirmText="Delete"
                onConfirm={handleDeleteFolder}
                confirmButtonClass="bg-red-600 hover:bg-red-700"
            />

            <ShareModal file={shareTarget} isOpen={Boolean(shareTarget)} onClose={() => setShareTarget(null)} />
            <FilePreviewModal file={previewFile} isOpen={Boolean(previewFile)} onClose={() => setPreviewFile(null)} />
            <FileDetailsModal file={detailsFile} isOpen={Boolean(detailsFile)} onClose={() => setDetailsFile(null)} />
        </DashboardLayout>
    );
};

/** Client-side descendant lookup so a folder can't be moved into its own subtree. */
function descendantIds(folders, rootId) {
    const result = [];
    const stack = [rootId];
    while (stack.length) {
        const parent = stack.pop();
        folders.filter((f) => f.parentFolderId === parent).forEach((child) => {
            result.push(child.id);
            stack.push(child.id);
        });
    }
    return result;
}

export default MyFiles;
