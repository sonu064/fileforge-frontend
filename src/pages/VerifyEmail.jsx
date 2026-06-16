import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import { apiEndpoints } from "../util/apiEndpoints.js";

const VerifyEmail = () => {
    const [params] = useSearchParams();
    const token = params.get("token") || "";
    const [status, setStatus] = useState("loading"); // loading | success | error
    const [message, setMessage] = useState("");
    const ran = useRef(false);

    useEffect(() => {
        if (ran.current) return;
        ran.current = true;

        if (!token) {
            setStatus("error");
            setMessage("Missing verification token.");
            return;
        }
        axios
            .get(apiEndpoints.VERIFY_EMAIL(token))
            .then(({ data }) => {
                setStatus("success");
                setMessage(data?.message || "Email verified successfully.");
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err.response?.data?.message || "This verification link is invalid or has expired.");
            });
    }, [token]);

    return (
        <AuthLayout
            title="Email verification"
            footer={
                <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                    Go to sign in
                </Link>
            }
        >
            <div className="flex flex-col items-center text-center gap-3 py-4">
                {status === "loading" && <Loader2 size={40} className="animate-spin text-brand-500" />}
                {status === "success" && <CheckCircle2 size={40} className="text-emerald-500" />}
                {status === "error" && <XCircle size={40} className="text-red-500" />}
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    {status === "loading" ? "Verifying your email…" : message}
                </p>
            </div>
        </AuthLayout>
    );
};

export default VerifyEmail;
