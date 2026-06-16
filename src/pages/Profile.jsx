import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
    Calendar,
    Camera,
    Coins,
    Crown,
    KeyRound,
    Loader2,
    Mail,
    Save,
    Settings,
    User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout.jsx";
import { useAuthContext } from "../context/AuthContext.jsx";
import { useUserCredits } from "../context/UserCreditsContext.jsx";
import { apiEndpoints } from "../util/apiEndpoints.js";

const resolveImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) return url;
    if (url.startsWith("/")) return url;
    return `/${url}`;
};

const formatDate = (iso) => {
    if (!iso) return "—";
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return "—";
    }
};

const Profile = () => {
    const { user, updateUser } = useAuthContext();
    const { credits } = useUserCredits();
    const [searchParams] = useSearchParams();
    const settingsRef = useRef(null);

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        profileImage: "",
    });
    const [savingProfile, setSavingProfile] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirm: "" });
    const [savingPwd, setSavingPwd] = useState(false);

    useEffect(() => {
        if (!user) return;
        setProfile({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            profileImage: user.profileImage || "",
        });
    }, [user]);

    useEffect(() => {
        if (searchParams.get("section") === "settings" && settingsRef.current) {
            settingsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [searchParams]);

    const avatarSrc = resolveImageUrl(profile.profileImage || user?.profileImage || user?.imageUrl);

    const saveProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const { data } = await axios.put(apiEndpoints.UPDATE_PROFILE, profile);
            updateUser(data);
            toast.success("Profile updated");
        } catch (err) {
            toast.error(err.response?.data?.message || "Could not update profile");
        } finally {
            setSavingProfile(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be 2 MB or smaller");
            return;
        }

        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const { data } = await axios.post(apiEndpoints.UPLOAD_AVATAR, formData);
            updateUser(data);
            setProfile((p) => ({ ...p, profileImage: data.profileImage || "" }));
            toast.success("Profile photo updated");
        } catch (err) {
            toast.error(err.response?.data?.message || "Could not upload photo");
        } finally {
            setUploadingAvatar(false);
            e.target.value = "";
        }
    };

    const savePassword = async (e) => {
        e.preventDefault();
        if (pwd.newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return;
        }
        if (pwd.newPassword !== pwd.confirm) {
            toast.error("New passwords do not match");
            return;
        }
        setSavingPwd(true);
        try {
            await axios.put(apiEndpoints.CHANGE_PASSWORD, {
                currentPassword: pwd.currentPassword,
                newPassword: pwd.newPassword,
            });
            toast.success("Password changed");
            setPwd({ currentPassword: "", newPassword: "", confirm: "" });
        } catch (err) {
            toast.error(err.response?.data?.message || "Could not change password");
        } finally {
            setSavingPwd(false);
        }
    };

    const field =
        "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition";
    const labelCls = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

    const displayCredits = credits ?? user?.credits ?? 0;

    return (
        <DashboardLayout activeMenu="Profile">
            <div className="p-5 sm:p-7 max-w-4xl">
                <div className="mb-6">
                    <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Profile & Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage your FileForge account.</p>
                </div>

                {/* Account overview */}
                <div className="card-surface p-6 rounded-2xl mb-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative shrink-0 self-start">
                            {avatarSrc ? (
                                <img src={avatarSrc} alt="Profile" className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-500/20" />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 grid place-items-center">
                                    <User className="text-slate-500" size={36} />
                                </div>
                            )}
                            <label className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-brand-500 text-white grid place-items-center cursor-pointer hover:bg-brand-600 transition shadow-lg">
                                {uploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={uploadingAvatar} />
                            </label>
                        </div>

                        <div className="flex-1 grid sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Name</p>
                                <p className="font-semibold text-slate-900 dark:text-white">{user?.fullName || "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1 flex items-center gap-1"><Mail size={12} /> Email</p>
                                <p className="font-medium text-slate-800 dark:text-slate-200">{user?.email || "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1 flex items-center gap-1"><Crown size={12} /> Plan</p>
                                <p className="font-medium text-slate-800 dark:text-slate-200">{user?.plan || "BASIC"}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1 flex items-center gap-1"><Coins size={12} /> Credits</p>
                                <p className="font-medium text-slate-800 dark:text-slate-200">{displayCredits} upload{displayCredits === 1 ? "" : "s"} remaining</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1 flex items-center gap-1"><Calendar size={12} /> Member since</p>
                                <p className="font-medium text-slate-800 dark:text-slate-200">{formatDate(user?.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Role</p>
                                <span className="inline-block text-xs px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 font-semibold">
                                    {user?.role || "USER"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit profile */}
                <div className="card-surface p-6 rounded-2xl mb-6">
                    <h2 className="font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <User size={18} /> Edit profile
                    </h2>
                    <form onSubmit={saveProfile} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>First name</label>
                                <input className={field} value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} required />
                            </div>
                            <div>
                                <label className={labelCls}>Last name</label>
                                <input className={field} value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} />
                            </div>
                        </div>
                        <div>
                            <label className={labelCls}>Profile image URL (optional)</label>
                            <input className={field} value={profile.profileImage} onChange={(e) => setProfile((p) => ({ ...p, profileImage: e.target.value }))} placeholder="https://… or upload using the camera button above" />
                        </div>
                        <button type="submit" disabled={savingProfile} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                            {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save changes
                        </button>
                    </form>
                </div>

                {/* Security / settings */}
                <div ref={settingsRef} className="card-surface p-6 rounded-2xl">
                    <h2 className="font-display font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Settings size={18} /> Security settings
                    </h2>
                    <form onSubmit={savePassword} className="space-y-4">
                        <div>
                            <label className={labelCls}>Current password</label>
                            <input type="password" className={field} value={pwd.currentPassword} onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))} required autoComplete="current-password" />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>New password</label>
                                <input type="password" className={field} value={pwd.newPassword} onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))} required minLength={8} autoComplete="new-password" />
                                <p className="text-xs text-slate-400 mt-1">Minimum 8 characters</p>
                            </div>
                            <div>
                                <label className={labelCls}>Confirm new password</label>
                                <input type="password" className={field} value={pwd.confirm} onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))} required minLength={8} autoComplete="new-password" />
                            </div>
                        </div>
                        <button type="submit" disabled={savingPwd} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                            {savingPwd ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />} Update password
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
