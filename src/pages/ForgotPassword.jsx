import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import AuthLayout, { AuthField } from "../components/auth/AuthLayout.jsx";
import { apiEndpoints } from "../util/apiEndpoints.js";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");
    const [devToken, setDevToken] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const { data } = await axios.post(apiEndpoints.FORGOT_PASSWORD, { email: email.trim() });
            setDone(true);
            if (data?.devToken) setDevToken(data.devToken);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot password"
            subtitle="We'll email you a link to reset it"
            footer={
                <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                    Back to sign in
                </Link>
            }
        >
            {done ? (
                <div className="space-y-4">
                    <div className="p-3 rounded-xl flex items-center gap-2 text-sm bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                        <CheckCircle2 size={18} /> If an account exists for that email, a reset link has been sent.
                    </div>
                    {devToken && (
                        <div className="p-3 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 break-all">
                            <p className="font-semibold mb-1">Dev mode reset link:</p>
                            <Link to={`/reset-password?token=${devToken}`} className="text-brand-600 dark:text-brand-400 hover:underline">
                                /reset-password?token={devToken}
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-xl flex items-center gap-2 text-sm bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}
                    <AuthField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
                    <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                        {submitting ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : "Send reset link"}
                    </button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
