import { useEffect, useState } from "react";
import { fetchFileBlob, fetchPublicFileBlob, fetchShareBlob } from "./fileApi.js";

/**
 * Loads a file as an object URL for inline preview or thumbnails, and revokes it on cleanup.
 * Authenticated by default; pass isPublic for the legacy public-file endpoint, or shareId to
 * stream via a share link (both unauthenticated).
 *
 * @returns {{ url: string|null, status: "idle"|"loading"|"loaded"|"error" }}
 */
export function useFileObjectUrl({ fileId, shareId, sharePassword, enabled = true, isPublic = false, getToken }) {
    const [url, setUrl] = useState(null);
    const [status, setStatus] = useState("idle");

    useEffect(() => {
        if (!enabled || (!fileId && !shareId)) {
            setStatus("idle");
            setUrl(null);
            return;
        }

        let active = true;
        let objectUrl = null;
        setStatus("loading");

        (async () => {
            try {
                let blob;
                if (shareId) {
                    blob = await fetchShareBlob(shareId, sharePassword);
                } else if (isPublic) {
                    blob = await fetchPublicFileBlob(fileId);
                } else {
                    blob = await fetchFileBlob(fileId, getToken);
                }
                if (!active) return;
                objectUrl = window.URL.createObjectURL(blob);
                setUrl(objectUrl);
                setStatus("loaded");
            } catch {
                if (!active) return;
                setStatus("error");
                setUrl(null);
            }
        })();

        return () => {
            active = false;
            if (objectUrl) window.URL.revokeObjectURL(objectUrl);
        };
    }, [fileId, shareId, sharePassword, enabled, isPublic, getToken]);

    return { url, status };
}
