import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { UserCreditsProvider } from "./context/UserCreditsContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Landing = lazy(() => import("./pages/Landing.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Upload = lazy(() => import("./pages/Upload.jsx"));
const MyFiles = lazy(() => import("./pages/MyFiles.jsx"));
const Favorites = lazy(() => import("./pages/Favorites.jsx"));
const Trash = lazy(() => import("./pages/Trash.jsx"));
const Subscription = lazy(() => import("./pages/Subscription.jsx"));
const Transactions = lazy(() => import("./pages/Transactions.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const PublicFileView = lazy(() => import("./pages/PublicFileView.jsx"));
const ShareView = lazy(() => import("./pages/ShareView.jsx"));

const PageLoader = () => (
    <div className="h-screen w-full grid place-items-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-brand-500" size={36} />
    </div>
);

const App = () => {
    return (
        <UserCreditsProvider>
            <BrowserRouter>
                <Toaster position="top-right" />
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/verify-email" element={<VerifyEmail />} />

                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
                        <Route path="/my-files" element={<ProtectedRoute><MyFiles /></ProtectedRoute>} />
                        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                        <Route path="/trash" element={<ProtectedRoute><Trash /></ProtectedRoute>} />
                        <Route path="/subscriptions" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
                        <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                        <Route path="file/:fileId" element={<PublicFileView />} />
                        <Route path="share/:shareId" element={<ShareView />} />
                        <Route path="/*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </UserCreditsProvider>
    );
};

export default App;
