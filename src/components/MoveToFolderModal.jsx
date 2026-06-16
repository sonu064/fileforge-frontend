import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Folder, Home, X } from "lucide-react";

/**
 * Folder picker for moving files or folders. Renders the folder hierarchy as a tree.
 *
 * @param folders    flat list of all folders ({ id, folderName, parentFolderId })
 * @param excludeIds ids that cannot be a destination (e.g. a folder + its descendants)
 * @param onMove     called with the target folder id (null = root)
 */
const MoveToFolderModal = ({ isOpen, onClose, folders = [], excludeIds = [], title = "Move to", onMove }) => {
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (isOpen) setSelected(null);
    }, [isOpen]);

    const childrenByParent = useMemo(() => {
        const map = new Map();
        folders.forEach((f) => {
            const key = f.parentFolderId || "root";
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(f);
        });
        return map;
    }, [folders]);

    const exclude = useMemo(() => new Set(excludeIds), [excludeIds]);

    const renderNodes = (parentKey, depth) => {
        const nodes = childrenByParent.get(parentKey) || [];
        return nodes
            .filter((f) => !exclude.has(f.id))
            .map((f) => (
                <div key={f.id}>
                    <button
                        onClick={() => setSelected(f.id)}
                        style={{ paddingLeft: `${depth * 18 + 12}px` }}
                        className={`w-full flex items-center gap-2 py-2 pr-3 rounded-lg text-sm transition-colors cursor-pointer ${
                            selected === f.id
                                ? "bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 font-medium"
                                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                        <ChevronRight size={13} className="text-slate-300 dark:text-slate-600" />
                        <Folder size={16} className="text-amber-500" />
                        <span className="truncate">{f.folderName}</span>
                    </button>
                    {renderNodes(f.id, depth + 1)}
                </div>
            ));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    onClick={(e) => e.stopPropagation()}
                    className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
                >
                    <div className="px-6 py-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
                        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="px-4 py-4 max-h-72 overflow-y-auto">
                        <button
                            onClick={() => setSelected("root")}
                            className={`w-full flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition-colors cursor-pointer ${
                                selected === "root"
                                    ? "bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 font-medium"
                                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                        >
                            <Home size={16} className="text-slate-500" />
                            <span>My Files (root)</span>
                        </button>
                        {renderNodes("root", 0)}
                        {folders.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-6">No folders yet — create one first.</p>
                        )}
                    </div>

                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer">
                            Cancel
                        </button>
                        <button
                            disabled={selected === null}
                            onClick={() => onMove(selected === "root" ? null : selected)}
                            className="px-4 py-2 rounded-xl text-white font-medium bg-gradient-to-r from-brand-500 to-brand2-500 hover:shadow-lg hover:shadow-brand-500/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                        >
                            Move here
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MoveToFolderModal;
