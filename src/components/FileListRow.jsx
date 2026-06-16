import { Eye, FolderInput, Globe, Info, Link2, Lock, Star, Trash2 } from "lucide-react";
import { formatDate, formatFileSize, isFilePublic } from "../util/fileHelpers.jsx";
import DownloadButton from "./DownloadButton.jsx";

const FileListRow = ({ file, onDelete, onTogglePublic, onShareLink, onPreview, onDetails, onFavorite, onMove, getFileIcon }) => {
    const pub = isFilePublic(file);
    const fav = Boolean(file?.favorite);

    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => onPreview?.(file)} className="flex items-center gap-3 text-left cursor-pointer group">
                    <div className="h-9 w-9 rounded-lg bg-slate-50 dark:bg-slate-800 grid place-items-center shrink-0">
                        {getFileIcon(file)}
                    </div>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate max-w-[220px] group-hover:text-brand-600 dark:group-hover:text-brand-400" title={file.name}>
                        {file.name}
                    </span>
                    {fav && <Star size={14} className="text-amber-500 fill-amber-500 shrink-0" />}
                </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                {formatFileSize(file.size)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                {formatDate(file.uploadedAt)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => onTogglePublic(file)} className="flex items-center gap-1.5 cursor-pointer group">
                        {pub ? (
                            <>
                                <Globe size={15} className="text-emerald-500" />
                                <span className="text-emerald-600 dark:text-emerald-400 group-hover:underline">Public</span>
                            </>
                        ) : (
                            <>
                                <Lock size={15} className="text-slate-400" />
                                <span className="text-slate-500 group-hover:underline">Private</span>
                            </>
                        )}
                    </button>
                    <button onClick={() => onShareLink?.(file)} className="flex items-center gap-1.5 cursor-pointer group text-brand-600 dark:text-brand-400">
                        <Link2 size={15} />
                        <span className="group-hover:underline">Share</span>
                    </button>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center gap-1">
                    <button onClick={() => onPreview?.(file)} title="Preview" className="p-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <Eye size={17} />
                    </button>
                    <DownloadButton file={file} className="text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800" />
                    {onFavorite && (
                        <button onClick={() => onFavorite(file)} title={fav ? "Remove from favorites" : "Add to favorites"} className="p-2 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <Star size={17} className={fav ? "fill-amber-500 text-amber-500" : ""} />
                        </button>
                    )}
                    {onMove && (
                        <button onClick={() => onMove(file)} title="Move to folder" className="p-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <FolderInput size={17} />
                        </button>
                    )}
                    <button onClick={() => onDetails?.(file)} title="Details" className="p-2 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <Info size={17} />
                    </button>
                    <button onClick={() => onDelete(file.id)} title="Delete" className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <Trash2 size={17} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default FileListRow;
