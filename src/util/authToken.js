/**
 * Token helpers for the custom JWT auth system.
 * `getToken` is provided by AuthContext.useAuth() and returns the stored access token.
 */
export async function getAuthToken(getToken) {
    if (typeof getToken !== "function") {
        throw new Error("getToken is not available. Is the user signed in?");
    }
    const token = await getToken();
    if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
    }
    return token;
}

/** Build standard auth headers for axios. */
export async function getAuthHeaders(getToken) {
    const token = await getAuthToken(getToken);
    return { Authorization: `Bearer ${token}` };
}

// Backwards-compatible alias (previously Clerk-specific).
export const getClerkAuthToken = getAuthToken;
