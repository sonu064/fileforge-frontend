import { useAuth } from "../context/AuthContext.jsx";
import { Loader2 } from "lucide-react";
import { useFileObjectUrl } from "../util/useObjectUrl.js";
import { getFileIcon, isImageFile } from "../util/fileHelpers.jsx";

/**
 * Renders an image thumbnail (lazily fetched as an authenticated blob) for image files,
 * and a type icon for everything else.
 */
const FileThumbnail = ({ file, isPublic = false, iconSize = 26, className = "" }) => {
    const { getToken } = useAuth();
    const image = isImageFile(file);
    const { url, status } = useFileObjectUrl({
        fileId: file?.id,
        enabled: image,
        isPublic,
        getToken,
    });

    if (image && status === "loaded" && url) {
        return <img src={url} alt={file.name} className={`h-full w-full object-cover ${className}`} draggable={false} />;
    }

    if (image && status === "loading") {
        return (
            <div className="h-full w-full grid place-items-center">
                <Loader2 size={20} className="animate-spin text-slate-300" />
            </div>
        );
    }

    return (
        <div className="h-full w-full grid place-items-center">
            <div className="h-14 w-14 rounded-2xl bg-white dark:bg-slate-900 shadow-sm grid place-items-center">
                {getFileIcon(file, iconSize)}
            </div>
        </div>
    );
};

export default FileThumbnail;
