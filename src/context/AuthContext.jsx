/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { apiEndpoints } from "../util/apiEndpoints.js";

const ACCESS_KEY = "cs_access_token";
const REFRESH_KEY = "cs_refresh_token";

export const getStoredAccessToken = () => localStorage.getItem(ACCESS_KEY);
const getStoredRefreshToken = () => localStorage.getItem(REFRESH_KEY);
const storeTokens = (access, refresh) => {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};
const clearTokens = () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
};

/** Normalize user payload for UI components (avatar URL, display name, email). */
const decorate = (u) => {
    if (!u) return u;
    const img = u.profileImage || "";
    const imageUrl =
        !img ? "" :
        img.startsWith("http") || img.startsWith("blob:") ? img : img;
    return {
        ...u,
        fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
        imageUrl,
        primaryEmailAddress: { emailAddress: u.email },
    };
};

const AuthContext = createContext(null);

// --- Global axios interceptors: attach the JWT and transparently refresh on 401. ---
let interceptorsReady = false;
let refreshPromise = null;

const setupInterceptors = (onAuthFailure) => {
    if (interceptorsReady) return;
    interceptorsReady = true;

    axios.interceptors.request.use((config) => {
        const token = getStoredAccessToken();
        const url = config.url || "";
        // Don't attach our token to the auth endpoints themselves.
        if (token && !url.includes("/auth/login") && !url.includes("/auth/register") &&
            !url.includes("/auth/refresh") && !url.includes("/auth/forgot-password") &&
            !url.includes("/auth/reset-password")) {
            config.headers = config.headers || {};
            if (!config.headers.Authorization) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    });

    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const original = error.config || {};
            const status = error.response?.status;
            const url = original.url || "";
            const isAuthCall = url.includes("/auth/");

            if (status === 401 && !original._retry && !isAuthCall && getStoredRefreshToken()) {
                original._retry = true;
                try {
                    if (!refreshPromise) {
                        refreshPromise = axios
                            .post(apiEndpoints.REFRESH_TOKEN, { refreshToken: getStoredRefreshToken() })
                            .finally(() => { refreshPromise = null; });
                    }
                    const { data } = await refreshPromise;
                    storeTokens(data.accessToken, data.refreshToken);
                    original.headers = original.headers || {};
                    original.headers.Authorization = `Bearer ${data.accessToken}`;
                    return axios(original);
                } catch (refreshError) {
                    clearTokens();
                    onAuthFailure?.();
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleAuthFailure = useCallback(() => setUser(null), []);

    useEffect(() => {
        setupInterceptors(handleAuthFailure);
    }, [handleAuthFailure]);

    const loadProfile = useCallback(async () => {
        if (!getStoredAccessToken()) {
            setUser(null);
            setLoading(false);
            return;
        }
        try {
            const { data } = await axios.get(apiEndpoints.GET_PROFILE);
            setUser(decorate(data));
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const login = useCallback(async (email, password) => {
        const { data } = await axios.post(apiEndpoints.LOGIN, { email, password });
        storeTokens(data.accessToken, data.refreshToken);
        setUser(decorate(data.user));
        return data.user;
    }, []);

    const register = useCallback(async (payload) => {
        const { data } = await axios.post(apiEndpoints.REGISTER, payload);
        return data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await axios.post(apiEndpoints.LOGOUT, { refreshToken: getStoredRefreshToken() });
        } catch {
            // ignore network/logout errors — clear locally regardless
        }
        clearTokens();
        setUser(null);
    }, []);

    const refreshUser = useCallback(async () => {
        await loadProfile();
    }, [loadProfile]);

    const updateUser = useCallback((partial) => {
        setUser((prev) => (prev ? decorate({ ...prev, ...partial }) : prev));
    }, []);

    const getToken = useCallback(async () => getStoredAccessToken(), []);

    const value = useMemo(
        () => ({
            user,
            isSignedIn: !!user,
            isLoaded: !loading,
            loading,
            getToken,
            login,
            register,
            logout,
            refreshUser,
            updateUser,
        }),
        [user, loading, getToken, login, register, logout, refreshUser, updateUser]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
    return ctx;
};

// Clerk-compatible hooks so existing components only need their import path changed.
export const useAuth = () => useAuthContext();
export const useUser = () => {
    const { user, isSignedIn, isLoaded } = useAuthContext();
    return { user, isSignedIn, isLoaded };
};
