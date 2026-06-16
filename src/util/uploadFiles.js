import axios from "axios";
import { apiEndpoints } from "./apiEndpoints.js";
import { getAuthHeaders, getClerkAuthToken } from "./authToken.js";

const isDev = import.meta.env.DEV;

/**
 * Upload files to the backend.
 * Do NOT set Content-Type manually — axios must add the multipart boundary.
 */
export async function uploadFilesRequest(files, getToken) {
    const token = await getClerkAuthToken(getToken);
    const authHeaders = { Authorization: `Bearer ${token}` };

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file, file.name));

    const url = apiEndpoints.UPLOAD_FILE;

    if (isDev) {
        console.group("[FileForge Upload]");
        console.info("URL:", url);
        console.info("Method: POST");
        console.info(
            "Files:",
            files.map((f) => ({ name: f.name, size: f.size, type: f.type }))
        );
        console.groupEnd();
    }

    try {
        const response = await axios.post(url, formData, {
            headers: authHeaders,
        });

        if (isDev) {
            console.info("[FileForge Upload] Response:", {
                status: response.status,
                statusText: response.statusText,
            });
        }
        return response.data;
    } catch (error) {
        if (isDev) {
            console.error("[FileForge Upload] Error response:", {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });
        }
        throw error;
    }
}

/** Extract a human-readable message from axios / Spring error payloads. */
export function getUploadErrorMessage(error) {
    const data = error.response?.data;

    if (typeof data === "string" && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    if (error.response?.status === 401 || error.response?.status === 403) {
        return data?.message || "Authentication failed. Please sign in again.";
    }
    if (error.response?.status === 404) {
        return "Upload API not found (404). Check VITE_API_BASE_URL / Vite proxy configuration.";
    }
    if (error.response?.status === 413) {
        return "File too large. Maximum size is 5 MB per file.";
    }
    if (error.code === "ERR_NETWORK") {
        return "Network error — is the backend running and reachable?";
    }
    return error.message || "Error uploading files. Please try again.";
}

export { getAuthHeaders, getClerkAuthToken };
