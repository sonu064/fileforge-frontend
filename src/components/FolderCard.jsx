import { useState } from "react";
import { motion } from "framer-motion";
import { useDroppable } from "@dnd-kit/core";
import { Folder, FolderInput, MoreVertical, Pencil, Trash2 } from "lucide-react";

/**
 * A folder tile. Acts as a drop target for files (and other folders) via dnd-kit.
 * Double-click / single-click opens the folder; the kebab menu exposes rename/move/delete.
 */
const FolderCard = ({ folder, onOpen, onRename, onDelete, onMove }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { setNodeRef, isOver } = useDroppable({ id: `folder-${folder.id}`, data: { folderId: folder.id } });

    const action = (fn) => (e) => {
        e.stopPropagation();
        setMenuOpen(false);
        fn?.(folder);
    };

    return (
        <motion.div
            ref={setNodeRef}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            onClick={() => onOpen?.(folder)}
            className={`relative card-surface p-4 cursor-pointer transition-shadow group ${
                isOver
                    ? "ring-2 ring-brand-400 shadow-xl shadow-brand-500/20 bg-brand-50/60 dark:bg-brand-500/10"
                    : "hover:shadow-lg hover:shadow-brand-500/10"
            }`}
        >
            <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 grid place-items-center shrink-0 shadow-sm">
                    <Folder size={22} className="text-white" fill="white" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 title={folder.folderName} className="font-medium text-slate-900 dark:text-white truncate">
                        {folder.folderName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {folder.itemCount > 0 ? `${folder.itemCount} folder${folder.itemCount !== 1 ? "s" : ""}` : "Folder"}
                    </p>
                </div>
                <div className="relative">
                    <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                        <MoreVertical size={17} />
                    </button>
                    {menuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
                            <div className="absolute right-0 top-9 z-20 w-40 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5">
                                <button onClick={action(onRename)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                    <Pencil size={15} /> Rename
                                </button>
                                <button onClick={action(onMove)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                                    <FolderInput size={15} /> Move
                                </button>
                                <button onClick={action(onDelete)} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 cursor-pointer">
                                    <Trash2 size={15} /> Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default FolderCard;
