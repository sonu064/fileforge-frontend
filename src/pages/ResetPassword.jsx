import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout, { AuthField } from "../components/auth/AuthLayout.jsx";
import { apiEndpoints } from "../util/apiEndpoints.js";

const ResetPassword = () => {
    const [params] = useSearchParams();
    const token = params.get("token") || "";
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(apiEndpoints.RESET_PASSWORD, { token, newPassword: password });
            toast.success("Password updated! Please sign in.");
            navigate("/login", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "This reset link is invalid or has expired.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Reset password"
            subtitle="Choose a new password for your account"
            footer={
                <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                    Back to sign in
                </Link>
            }
        >
            {!token ? (
                <div className="p-3 rounded-xl flex items-center gap-2 text-sm bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300">
                    <AlertCircle size={18} /> Missing reset token. Please use the link from your email.
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-xl flex items-center gap-2 text-sm bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}
                    <AuthField label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required autoComplete="new-password" />
                    <AuthField label="Confirm password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" required autoComplete="new-password" />
                    <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                        {submitting ? <><Loader2 size={16} className="animate-spin" /> Updating…</> : "Update password"}
                    </button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ResetPassword;
