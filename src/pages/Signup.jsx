import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import AuthLayout, { AuthField } from "../components/auth/AuthLayout.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";

const Signup = () => {
    const { register, isSignedIn } = useAuthContext();
    const navigate = useNavigate();

    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isSignedIn) navigate("/dashboard", { replace: true });
    }, [isSignedIn, navigate]);

    const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await register({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                password: form.password,
            });
            toast.success(res?.message || "Account created! Please sign in.");
            navigate("/login", { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || "Unable to create your account. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start sharing files in seconds"
            footer={
                <>
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                        Sign in
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
                <div className="grid grid-cols-2 gap-3">
                    <AuthField label="First name" value={form.firstName} onChange={update("firstName")} placeholder="Jane" required autoComplete="given-name" />
                    <AuthField label="Last name" value={form.lastName} onChange={update("lastName")} placeholder="Doe" autoComplete="family-name" />
                </div>
                <AuthField label="Email" type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" required autoComplete="email" />
                <AuthField label="Password" type="password" value={form.password} onChange={update("password")} placeholder="At least 8 characters" required autoComplete="new-password" />
                <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                    {submitting ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : "Create account"}
                </button>
            </form>
        </AuthLayout>
    );
};

export default Signup;
