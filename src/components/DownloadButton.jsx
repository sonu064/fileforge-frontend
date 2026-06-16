import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";
import { downloadFile, downloadPublicFile, getFileErrorMessage } from "../util/fileApi.js";

/**
 * Reusable download button. Handles the blob fetch, auth, and browser save dialog.
 *
 * @param {object} file        File metadata ({ id, name }).
 * @param {boolean} isPublic   Use the public (no-auth) download endpoint.
 * @param {"button"|"icon"} variant  Visual style.
 */
const DownloadButton = ({ file, isPublic = false, variant = "icon", className = "", label = "Download" }) => {
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (loading) return;
        setLoading(true);
        try {
            if (isPublic) {
                await downloadPublicFile(file);
            } else {
                await downloadFile(file, getToken);
            }
        } catch (error) {
            console.error("Download failed", error);
            toast.error(getFileErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    if (variant === "button") {
        return (
            <button onClick={handleDownload} disabled={loading} className={`btn-primary ${className}`}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                {label}
            </button>
        );
    }

    return (
        <button
            onClick={handleDownload}
            disabled={loading}
            title="Download"
            className={`p-2 rounded-full transition-colors cursor-pointer disabled:opacity-60 ${className}`}
        >
            {loading ? <Loader2 size={17} className="animate-spin" /> : <Download size={17} />}
        </button>
    );
};

export default DownloadButton;
