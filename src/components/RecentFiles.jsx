import { Eye, FileText, Globe, Info, Lock } from "lucide-react";
import { formatDate, formatFileSize, getFileIcon, isFilePublic } from "../util/fileHelpers.jsx";
import DownloadButton from "./DownloadButton.jsx";

const RecentFiles = ({ files, onPreview, onDetails }) => {
    return (
        <div className="card-surface p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    Recent Files <span className="text-slate-400 font-medium">({files.length})</span>
                </h2>
            </div>

            {files.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-500/10 grid place-items-center mb-3">
                        <FileText size={26} className="text-brand-400" />
                    </div>
                    <p className="font-medium text-slate-700 dark:text-slate-200">No files uploaded yet</p>
                    <p className="text-sm text-slate-400 max-w-xs mt-1">
                        Upload your first file using the panel to get started with FileForge.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {files.map((file) => {
                        const pub = isFilePublic(file);
                        return (
                            <div key={file.id} className="group flex items-center gap-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 -mx-2 px-2 rounded-lg transition-colors">
                                <button
                                    onClick={() => onPreview?.(file)}
                                    title="Preview"
                                    className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 grid place-items-center shrink-0 cursor-pointer"
                                >
                                    {getFileIcon(file, 18)}
                                </button>
                                <button onClick={() => onPreview?.(file)} className="min-w-0 flex-1 text-left cursor-pointer">
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400" title={file.name}>
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {formatFileSize(file.size)} · {formatDate(file.uploadedAt)}
                                    </p>
                                </button>

                                {/* Hover actions */}
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => onPreview?.(file)} title="Preview" className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                        <Eye size={16} />
                                    </button>
                                    <DownloadButton file={file} className="text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800" />
                                    <button onClick={() => onDetails?.(file)} title="Details" className="p-2 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                        <Info size={16} />
                                    </button>
                                </div>

                                {pub ? (
                                    <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full shrink-0">
                                        <Globe size={12} /> Public
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full shrink-0">
                                        <Lock size={12} /> Private
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RecentFiles;
