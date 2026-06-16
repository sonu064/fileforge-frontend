import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthContext } from "../context/AuthContext.jsx";

/** Gates a route behind authentication; redirects to /login when not signed in. */
const ProtectedRoute = ({ children }) => {
    const { isSignedIn, loading } = useAuthContext();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-full grid place-items-center bg-white dark:bg-slate-950">
                <Loader2 className="animate-spin text-brand-500" size={36} />
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children;
};

export default ProtectedRoute;
