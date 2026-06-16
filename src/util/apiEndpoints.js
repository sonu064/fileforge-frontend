// Dev: use Vite proxy (/api/v1.0 → localhost:8080) to avoid cross-origin auth issues.
// Prod: set VITE_API_BASE_URL to your deployed API, e.g. https://your-api.onrender.com/api/v1.0
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1.0";

export const apiEndpoints = {
    // Auth
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    VERIFY_EMAIL: (token) => `${BASE_URL}/auth/verify?token=${encodeURIComponent(token)}`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
    REFRESH_TOKEN: `${BASE_URL}/auth/refresh`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    LOGOUT_ALL: `${BASE_URL}/auth/logout-all`,
    AUTH_ME: `${BASE_URL}/auth/me`,
    // Profile
    GET_PROFILE: `${BASE_URL}/profile`,
    UPDATE_PROFILE: `${BASE_URL}/profile`,
    UPLOAD_AVATAR: `${BASE_URL}/profile/avatar`,
    CHANGE_PASSWORD: `${BASE_URL}/profile/password`,

    FETCH_FILES: `${BASE_URL}/files/my`,
    GET_CREDITS: `${BASE_URL}/users/credits`,
    TOGGLE_FILE: (id) => `${BASE_URL}/files/${id}/toggle-public`,
    GET_FILE: (id) => `${BASE_URL}/files/${id}`,
    VIEW_FILE: (id) => `${BASE_URL}/files/view/${id}`,
    DOWNLOAD_FILE: (id) => `${BASE_URL}/files/download/${id}`,
    DELETE_FILE: (id) => `${BASE_URL}/files/${id}`,
    UPLOAD_FILE: `${BASE_URL}/files/upload`,
    CREATE_ORDER: `${BASE_URL}/payments/create-order`,
    VERIFY_PAYMENT: `${BASE_URL}/payments/verify-payment`,
    TRANSACTIONS: `${BASE_URL}/transactions`,
    PUBLIC_FILE_VIEW: (fileId) => `${BASE_URL}/files/public/${fileId}`,
    PUBLIC_FILE_STREAM: (fileId) => `${BASE_URL}/files/public/${fileId}/view`,
    PUBLIC_FILE_DOWNLOAD: (fileId) => `${BASE_URL}/files/public/${fileId}/download`,
    // Share links
    CREATE_SHARE: (fileId) => `${BASE_URL}/share/${fileId}`,
    RESOLVE_SHARE: (shareId) => `${BASE_URL}/share/${shareId}`,
    VERIFY_SHARE: (shareId) => `${BASE_URL}/share/${shareId}/verify`,
    SHARE_STREAM: (shareId) => `${BASE_URL}/share/${shareId}/view`,
    SHARE_DOWNLOAD: (shareId) => `${BASE_URL}/share/${shareId}/download`,
    LIST_FILE_SHARES: (fileId) => `${BASE_URL}/files/${fileId}/shares`,
    REVOKE_SHARE: (shareId) => `${BASE_URL}/share/${shareId}`,
    // Recycle bin + bulk
    TRASH: `${BASE_URL}/files/trash`,
    RESTORE_FILE: (id) => `${BASE_URL}/files/${id}/restore`,
    PERMANENT_DELETE: (id) => `${BASE_URL}/files/${id}/permanent`,
    EMPTY_TRASH: `${BASE_URL}/files/trash/empty`,
    BULK_DELETE: `${BASE_URL}/files/bulk-delete`,
    BULK_DOWNLOAD: `${BASE_URL}/files/bulk-download`,
    // Folders
    LIST_FOLDERS: `${BASE_URL}/folders`,
    CREATE_FOLDER: `${BASE_URL}/folders/create`,
    FOLDER_CONTENTS: (id) => `${BASE_URL}/folders/${id}/contents`,
    ROOT_CONTENTS: `${BASE_URL}/folders/root/contents`,
    RENAME_FOLDER: (id) => `${BASE_URL}/folders/${id}/rename`,
    MOVE_FOLDER: (id) => `${BASE_URL}/folders/${id}/move`,
    DELETE_FOLDER: (id) => `${BASE_URL}/folders/${id}`,
    // Files: filters, move, favorite, search
    LIST_FILES: `${BASE_URL}/files`,
    FAVORITE_FILES: `${BASE_URL}/files/favorites`,
    MOVE_FILE: (id) => `${BASE_URL}/files/${id}/move`,
    MOVE_FILES: `${BASE_URL}/files/move`,
    TOGGLE_FAVORITE: (id) => `${BASE_URL}/files/${id}/favorite`,
    SEARCH: (q) => `${BASE_URL}/search?q=${encodeURIComponent(q)}`,
};

export { BASE_URL };
