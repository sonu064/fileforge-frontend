/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import axios from "axios";
import { apiEndpoints } from "../util/apiEndpoints.js";
import { getAuthHeaders } from "../util/authToken.js";

export const UserCreditsContext = createContext(null);

/** Single source of truth for upload credits — always from GET /users/credits. */
export const UserCreditsProvider = ({ children }) => {
    const [credits, setCredits] = useState(null);
    const [loading, setLoading] = useState(false);
    const { getToken, isSignedIn, user, updateUser } = useAuth();

    const fetchUserCredits = useCallback(async () => {
        if (!isSignedIn) {
            setCredits(null);
            return null;
        }

        setLoading(true);
        try {
            const headers = await getAuthHeaders(getToken);
            const { data } = await axios.get(apiEndpoints.GET_CREDITS, { headers });
            const value = data?.credits ?? 0;
            setCredits(value);
            updateUser?.({ credits: value });
            return value;
        } catch (error) {
            console.error("[Credits] fetch failed:", error.response?.data || error.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, [getToken, isSignedIn, updateUser]);

    /** Apply credits returned from upload API (remainingCredits field). */
    const applyRemainingCredits = useCallback(
        (remaining) => {
            if (remaining === undefined || remaining === null) return;
            setCredits(remaining);
            updateUser?.({ credits: remaining });
        },
        [updateUser]
    );

    const updateCredits = useCallback(
        (newCredits) => {
            if (newCredits === undefined || newCredits === null) return;
            setCredits(newCredits);
            updateUser?.({ credits: newCredits });
        },
        [updateUser]
    );

    // Bootstrap from login profile, then refresh from API for authoritative value.
    useEffect(() => {
        if (!isSignedIn) {
            setCredits(null);
            return;
        }
        if (user?.credits != null && credits === null) {
            setCredits(user.credits);
        }
        fetchUserCredits();
    }, [isSignedIn, user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const contextValue = {
        credits,
        setCredits: updateCredits,
        loading,
        fetchUserCredits,
        updateCredits,
        applyRemainingCredits,
    };

    return (
        <UserCreditsContext.Provider value={contextValue}>
            {children}
        </UserCreditsContext.Provider>
    );
};

export const useUserCredits = () => {
    const ctx = useContext(UserCreditsContext);
    if (!ctx) throw new Error("useUserCredits must be used within UserCreditsProvider");
    return ctx;
};
