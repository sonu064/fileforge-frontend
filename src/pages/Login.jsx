import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout, { AuthField } from "../components/auth/AuthLayout.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";

const Login = () => {
    const { login, isSignedIn } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isSignedIn) navigate(redirectTo, { replace: true });
    }, [isSignedIn, navigate, redirectTo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await login(email.trim(), password);
            toast.success("Welcome back!");
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Unable to sign in. Check your credentials and try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your CloudShare account"
            footer={
                <>
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                        Create one
                    </Link>
                </>
            }
        >
            {error && (
                <div className="mb-4 p-3 rounded-xl flex items-center gap-2 text-sm bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300">
                    <AlertCircle size={18} /> {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <AuthField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                />
                <div>
                    <AuthField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                    />
                    <div className="text-right mt-1.5">
                        <Link to="/forgot-password" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                    {submitting ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : "Sign in"}
                </button>
            </form>
        </AuthLayout>
    );
};

export default Login;
