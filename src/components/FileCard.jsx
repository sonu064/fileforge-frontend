import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, FolderInput, Globe, Info, Link2, Lock, Star, Trash2 } from "lucide-react";
import { formatDate, formatFileSize, isFilePublic } from "../util/fileHelpers.jsx";
import FileThumbnail from "./FileThumbnail.jsx";
import DownloadButton from "./DownloadButton.jsx";

const FileCard = ({
    file,
    onDelete,
    onTogglePublic,
    onShareLink,
    onPreview,
    onDetails,
    onFavorite,
    onMove,
    selectable = false,
    selected = false,
    onToggleSelect,
}) => {
    const [showActions, setShowActions] = useState(false);
    const pub = isFilePublic(file);
    const fav = Boolean(file?.favorite);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            className={`relative group overflow-hidden card-surface hover:shadow-xl hover:shadow-brand-500/10 transition-shadow ${
                selected ? "ring-2 ring-brand-500" : ""
            }`}
        >
            {/* Preview / thumbnail area */}
            <button
                onClick={() => onPreview?.(file)}
                title="Preview"
                className="block w-full h-32 bg-gradient-to-br from-brand-50 to-brand2-50 dark:from-slate-800 dark:to-slate-800/40 cursor-pointer"
            >
                <FileThumbnail file={file} />
            </button>

            {/* Selection checkbox — z-30 keeps it above the hover overlay; stopping pointer/mouse
                down prevents the dnd-kit drag sensor on the wrapper from swallowing the click. */}
            {selectable && (
                <button
                    type="button"
                    aria-label={selected ? "Deselect file" : "Select file"}
                    aria-pressed={selected}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); onToggleSelect?.(file.id); }}
                    className={`absolute top-2.5 left-2.5 z-30 h-6 w-6 rounded-md border grid place-items-center transition-all cursor-pointer ${
                        selected
                            ? "bg-brand-500 border-brand-500 text-white opacity-100"
                            : "bg-white/95 border-slate-300 dark:border-slate-600 opacity-0 group-hover:opacity-100 hover:border-brand-400"
                    }`}
                    title={selected ? "Deselect" : "Select"}
                >
                    {selected && <span className="text-xs leading-none">✓</span>}
                </button>
            )}

            {/* Badges (favorite + privacy) */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                {fav && (
                    <div className="rounded-full p-1.5 bg-amber-100 dark:bg-amber-500/20" title="Favorite">
                        <Star size={13} className="text-amber-500 fill-amber-500" />
                    </div>
                )}
                <div className={`rounded-full p-1.5 ${pub ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-slate-100 dark:bg-slate-700"}`} title={pub ? "Public" : "Private"}>
                    {pub ? <Globe size={13} className="text-emerald-600 dark:text-emerald-400" /> : <Lock size={13} className="text-slate-500" />}
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <h3 title={file.name} className="font-medium text-slate-900 dark:text-white truncate">{file.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {formatFileSize(file.size)} · {formatDate(file.uploadedAt)}
                </p>
            </div>

            {/* Hover actions */}
            <motion.div
                animate={{ opacity: showActions ? 1 : 0 }}
                style={{ pointerEvents: showActions ? "auto" : "none" }}
                className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-transparent flex items-end justify-center p-4"
            >
                <div className="flex flex-wrap gap-2 justify-center">
                    <button onClick={() => onPreview?.(file)} title="Preview" className="p-2 bg-white/95 rounded-full hover:bg-white text-brand-600 transition-colors cursor-pointer">
                        <Eye size={17} />
                    </button>
                    <DownloadButton file={file} className="bg-white/95 hover:bg-white text-emerald-600" />
                    {onFavorite && (
                        <button onClick={() => onFavorite(file)} title={fav ? "Remove from favorites" : "Add to favorites"} className="p-2 bg-white/95 rounded-full hover:bg-white text-amber-500 transition-colors cursor-pointer">
                            <Star size={17} className={fav ? "fill-amber-500" : ""} />
                        </button>
                    )}
                    {onMove && (
                        <button onClick={() => onMove(file)} title="Move to folder" className="p-2 bg-white/95 rounded-full hover:bg-white text-slate-700 transition-colors cursor-pointer">
                            <FolderInput size={17} />
                        </button>
                    )}
                    <button onClick={() => onDetails?.(file)} title="Details" className="p-2 bg-white/95 rounded-full hover:bg-white text-slate-700 transition-colors cursor-pointer">
                        <Info size={17} />
                    </button>
                    <button onClick={() => onShareLink?.(file)} title="Share link" className="p-2 bg-white/95 rounded-full hover:bg-white text-brand-600 transition-colors cursor-pointer">
                        <Link2 size={17} />
                    </button>
                    <button onClick={() => onTogglePublic(file)} title={pub ? "Make private" : "Make public"} className="p-2 bg-white/95 rounded-full hover:bg-white text-amber-600 transition-colors cursor-pointer">
                        {pub ? <Lock size={17} /> : <Globe size={17} />}
                    </button>
                    <button onClick={() => onDelete(file.id)} title="Delete" className="p-2 bg-white/95 rounded-full hover:bg-white text-red-600 transition-colors cursor-pointer">
                        <Trash2 size={17} />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default FileCard;
