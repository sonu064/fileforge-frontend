import { FileIcon, FileText, Image as ImageIcon, Music, Video } from "lucide-react";

const getExtension = (name = "") => name.split(".").pop().toLowerCase();

/** Returns a coloured lucide icon based on a file's extension. */
export const getFileIcon = (file, size = 22) => {
    const ext = getExtension(file?.name);

    if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext))
        return <ImageIcon size={size} className="text-brand-500" />;
    if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext))
        return <Video size={size} className="text-sky-500" />;
    if (["mp3", "wav", "ogg", "flac", "m4a"].includes(ext))
        return <Music size={size} className="text-emerald-500" />;
    if (["pdf", "doc", "docx", "txt", "rtf", "md"].includes(ext))
        return <FileText size={size} className="text-amber-500" />;

    return <FileIcon size={size} className="text-brand2-500" />;
};

export const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return "—";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB";
    return (bytes / 1073741824).toFixed(2) + " GB";
};

export const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

/** Files use both `isPublic` and `public` depending on endpoint; normalise it. */
export const isFilePublic = (file) => Boolean(file?.isPublic ?? file?.public);

const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
const TEXT_EXT = ["txt", "md", "csv", "json", "log", "xml", "yml", "yaml"];

/**
 * Classify a file for preview purposes using both its MIME type and extension.
 * @returns {"image"|"pdf"|"text"|"video"|"audio"|"other"}
 */
export const getFileKind = (file) => {
    const type = (file?.type || "").toLowerCase();
    const ext = getExtension(file?.name);

    if (type.startsWith("image/") || IMAGE_EXT.includes(ext)) return "image";
    if (type === "application/pdf" || ext === "pdf") return "pdf";
    if (type.startsWith("text/") || TEXT_EXT.includes(ext)) return "text";
    if (type.startsWith("video/")) return "video";
    if (type.startsWith("audio/")) return "audio";
    return "other";
};

export const isImageFile = (file) => getFileKind(file) === "image";
export const isPdfFile = (file) => getFileKind(file) === "pdf";
export const isTextFile = (file) => getFileKind(file) === "text";

const DOC_EXT = ["doc", "docx", "txt", "md", "csv", "rtf", "odt", "ppt", "pptx", "xls", "xlsx"];
const ARCHIVE_EXT = ["zip", "rar", "7z", "tar", "gz", "bz2", "xz"];
const EXE_EXT = ["exe", "msi", "dmg", "deb", "rpm", "apk", "bat", "sh", "bin"];

/**
 * High-level category used by the type filter. Mirrors the backend FileCategory util.
 * @returns {"image"|"pdf"|"document"|"video"|"audio"|"archive"|"executable"|"other"}
 */
export const getFileCategory = (file) => {
    if (file?.category) return file.category;
    const type = (file?.type || "").toLowerCase();
    const ext = getExtension(file?.name);

    if (type.startsWith("image/") || IMAGE_EXT.includes(ext)) return "image";
    if (type === "application/pdf" || ext === "pdf") return "pdf";
    if (type.startsWith("video/")) return "video";
    if (type.startsWith("audio/")) return "audio";
    if (ARCHIVE_EXT.includes(ext) || type.includes("zip") || type.includes("compressed")) return "archive";
    if (EXE_EXT.includes(ext)) return "executable";
    if (type.startsWith("text/") || type.includes("word") || type.includes("officedocument")
        || type.includes("spreadsheet") || type.includes("presentation") || DOC_EXT.includes(ext)) return "document";
    return "other";
};

/** Ordered list of filter chips shown above the file grid. */
export const FILE_CATEGORIES = [
    { key: "all", label: "All" },
    { key: "image", label: "Images" },
    { key: "pdf", label: "PDFs" },
    { key: "document", label: "Documents" },
    { key: "video", label: "Videos" },
    { key: "audio", label: "Audio" },
    { key: "archive", label: "Archives" },
    { key: "executable", label: "Executables" },
    { key: "other", label: "Others" },
];

/** Whether the file can be previewed inside the app. */
export const isPreviewable = (file) => ["image", "pdf", "text"].includes(getFileKind(file));
