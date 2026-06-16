import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { File, Folder, Loader2, Search, X } from "lucide-react";
import { searchAll } from "../util/folderApi.js";
import { getFileIcon } from "../util/fileHelpers.jsx";

/** Highlights every case-insensitive occurrence of `query` inside `text`. */
const Highlight = ({ text = "", query = "" }) => {
    if (!query) return <>{text}</>;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase()
                    ? <mark key={i} className="bg-brand-200 dark:bg-brand-500/40 text-inherit rounded px-0.5">{part}</mark>
                    : <span key={i}>{part}</span>,
            )}
        </>
    );
};

const SearchBar = () => {
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ files: [], folders: [] });
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    // Debounced search (500ms).
    useEffect(() => {
        const q = query.trim();
        if (!q) {
            setResults({ files: [], folders: [] });
            setLoading(false);
            return;
        }
        setLoading(true);
        const handle = setTimeout(async () => {
            try {
                const data = await searchAll(getToken, q);
                setResults({ files: data.files || [], folders: data.folders || [] });
            } catch (e) {
                console.error("Search failed", e);
                setResults({ files: [], folders: [] });
            } finally {
                setLoading(false);
            }
        }, 500);
        return () => clearTimeout(handle);
    }, [query, getToken]);

    // Close on outside click.
    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const goToFolder = (folderId) => {
        setOpen(false);
        setQuery("");
        navigate(folderId ? `/my-files?folderId=${folderId}` : "/my-files");
    };

    const hasResults = results.files.length > 0 || results.folders.length > 0;

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            <div className="relative">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    placeholder="Search files and folders…"
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
                {query && (
                    <button onClick={() => { setQuery(""); setOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer">
                        <X size={15} />
                    </button>
                )}
            </div>

            {open && query.trim() && (
                <div className="absolute top-12 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-96 overflow-y-auto">
                    {loading ? (
                        <div className="py-8 grid place-items-center"><Loader2 size={20} className="animate-spin text-brand-500" /></div>
                    ) : !hasResults ? (
                        <p className="py-8 text-center text-sm text-slate-400">No matches for “{query}”.</p>
                    ) : (
                        <div className="py-2">
                            {results.folders.length > 0 && (
                                <div>
                                    <p className="px-4 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Folders</p>
                                    {results.folders.map((folder) => (
                                        <button key={folder.id} onClick={() => goToFolder(folder.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                            <Folder size={18} className="text-amber-500 shrink-0" />
                                            <span className="text-sm text-slate-700 dark:text-slate-200 truncate">
                                                <Highlight text={folder.folderName} query={query.trim()} />
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {results.files.length > 0 && (
                                <div>
                                    <p className="px-4 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Files</p>
                                    {results.files.map((file) => (
                                        <button key={file.id} onClick={() => goToFolder(file.folderId)} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                            <span className="shrink-0">{getFileIcon(file, 18)}</span>
                                            <span className="text-sm text-slate-700 dark:text-slate-200 truncate">
                                                <Highlight text={file.name} query={query.trim()} />
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
