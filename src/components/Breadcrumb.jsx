import { useDroppable } from "@dnd-kit/core";
import { ChevronRight, Home } from "lucide-react";

const Crumb = ({ id, label, isLast, onNavigate }) => {
    const { setNodeRef, isOver } = useDroppable({ id: `crumb-${id ?? "root"}`, data: { folderId: id } });
    return (
        <button
            ref={setNodeRef}
            onClick={() => onNavigate(id)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm transition-colors cursor-pointer ${
                isLast
                    ? "text-slate-900 dark:text-white font-semibold"
                    : "text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
            } ${isOver ? "bg-brand-100 dark:bg-brand-500/20 ring-2 ring-brand-400" : ""}`}
        >
            {id === null ? <Home size={15} /> : null}
            <span className="truncate max-w-[160px]">{label}</span>
        </button>
    );
};

const Breadcrumb = ({ trail = [], onNavigate }) => {
    return (
        <nav className="flex items-center gap-0.5 flex-wrap">
            <Crumb id={null} label="My Files" isLast={trail.length === 0} onNavigate={onNavigate} />
            {trail.map((folder, idx) => (
                <span key={folder.id} className="flex items-center gap-0.5">
                    <ChevronRight size={15} className="text-slate-300 dark:text-slate-600" />
                    <Crumb
                        id={folder.id}
                        label={folder.folderName}
                        isLast={idx === trail.length - 1}
                        onNavigate={onNavigate}
                    />
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumb;
