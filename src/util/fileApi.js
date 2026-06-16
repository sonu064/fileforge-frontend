import axios from "axios";
import { apiEndpoints } from "./apiEndpoints.js";

/**
 * File access helpers.
 *
 * Preview endpoints are authenticated, so an <img>/<iframe> cannot load them directly
 * (it can't attach the Bearer token). Instead we fetch the bytes as a Blob and build an
 * object URL that the browser can render inline. Public (share-link) variants skip auth.
 */

async function authHeader(getToken) {
    const token = await getToken();
    return { Authorization: `Bearer ${token}` };
}

/** Fetch an owned file's bytes as a Blob (authenticated). */
export async function fetchFileBlob(fileId, getToken) {
    const res = await axios.get(apiEndpoints.VIEW_FILE(fileId), {
        headers: await authHeader(getToken),
        responseType: "blob",
    });
    return res.data;
}

/** Fetch a public file's bytes as a Blob (no auth). */
export async function fetchPublicFileBlob(fileId) {
    const res = await axios.get(apiEndpoints.PUBLIC_FILE_STREAM(fileId), {
        responseType: "blob",
    });
    return res.data;
}

/** Fetch a shared file's bytes as a Blob via a share link (no auth). Optional password for protected links. */
export async function fetchShareBlob(shareId, password) {
    const res = await axios.get(apiEndpoints.SHARE_STREAM(shareId), {
        responseType: "blob",
        params: password ? { pwd: password } : undefined,
    });
    return res.data;
}

/** Download a shared file via a share link (no auth). Optional password for protected links. */
export async function downloadSharedFile(shareId, name, password) {
    const res = await axios.get(apiEndpoints.SHARE_DOWNLOAD(shareId), {
        responseType: "blob",
        params: password ? { pwd: password } : undefined,
    });
    triggerBlobDownload(res.data, name);
}

/** Verify a share-link password. Returns true when the password unlocks the link. */
export async function verifySharePassword(shareId, password) {
    const res = await axios.post(apiEndpoints.VERIFY_SHARE(shareId), { password });
    return Boolean(res.data?.valid);
}

/** Download several owned files as a single ZIP archive (authenticated). */
export async function bulkDownload(fileIds, getToken, name = "cloudshare.zip") {
    const res = await axios.post(
        apiEndpoints.BULK_DOWNLOAD,
        { fileIds },
        { headers: await authHeader(getToken), responseType: "blob" },
    );
    triggerBlobDownload(res.data, name);
}

function triggerBlobDownload(blob, name) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name || "download");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

/** Download an owned file (authenticated) and trigger the browser save dialog. */
export async function downloadFile(file, getToken) {
    const res = await axios.get(apiEndpoints.DOWNLOAD_FILE(file.id), {
        headers: await authHeader(getToken),
        responseType: "blob",
    });
    triggerBlobDownload(res.data, file.name);
}

/** Download a public file (no auth). */
export async function downloadPublicFile(file) {
    const res = await axios.get(apiEndpoints.PUBLIC_FILE_DOWNLOAD(file.id), {
        responseType: "blob",
    });
    triggerBlobDownload(res.data, file.name);
}

/** Open an owned file in a new browser tab (images, PDFs, text). */
export async function openFileInNewTab(file, getToken) {
    const blob = await fetchFileBlob(file.id, getToken);
    const url = window.URL.createObjectURL(blob);
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
        triggerBlobDownload(blob, file.name);
    }
    setTimeout(() => window.URL.revokeObjectURL(url), 60000);
}

/** Turn an axios error from a file request into a friendly message. */
export function getFileErrorMessage(error) {
    const status = error?.response?.status;
    const serverMsg = error?.response?.data?.message;
    if (status === 401) return "Your session expired. Please sign in again.";
    if (status === 403) return serverMsg || "You don't have permission to access this file.";
    if (status === 404) return serverMsg || "File not found. It may have been deleted.";
    if (status === 410) return serverMsg || "This share link has expired or been revoked.";
    if (error?.code === "ERR_NETWORK") return "Network error — is the backend running?";
    return serverMsg || "Something went wrong while accessing the file.";
}
