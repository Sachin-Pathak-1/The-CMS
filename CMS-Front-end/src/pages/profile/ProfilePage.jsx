import { useEffect, useState } from "react";
import { Layout } from "../Layout";
import { apiRequest } from "../../lib/apiClient";
import { uploadFileToCloudinary } from "../../lib/uploadClient";

const defaultProfile = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    sex: "other",
    dob: "2005-07-08",
    avatar: "",
    role: "",
    department: "",
    bio: "",
};

export function ProfilePage() {
    const [profile, setProfile] = useState(defaultProfile);
    const [saveMessage, setSaveMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [detailsExist, setDetailsExist] = useState(true);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            try {
                const [meResult, detailsResult] = await Promise.allSettled([
                    apiRequest("/user/me"),
                    apiRequest("/user/me/details"),
                ]);

                if (!active) return;

                const me = meResult.status === "fulfilled" ? meResult.value?.data : null;
                const details = detailsResult.status === "fulfilled" ? detailsResult.value?.data : null;

                setDetailsExist(detailsResult.status === "fulfilled");
                setProfile({
                    firstName: details?.firstName || "",
                    lastName: details?.lastName || "",
                    email: me?.email || "",
                    phone: details?.phone || "",
                    sex: details?.sex || "other",
                    dob: details?.dob ? new Date(details.dob).toISOString().slice(0, 10) : "2005-07-08",
                    avatar: details?.avatar || me?.userDetails?.avatar || "",
                    role: me?.type || "",
                    department: me?.college?.name || "Academic Management",
                    bio: "",
                });
            } catch (err) {
                if (active) {
                    setError(err.message || "Failed to load profile");
                }
            } finally {
                if (active) setIsLoading(false);
            }
        };

        loadProfile();
        return () => {
            active = false;
        };
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploadingAvatar(true);
            setError("");
            const upload = await uploadFileToCloudinary(file, "learnytics/profile-images");
            setProfile((prev) => ({ ...prev, avatar: upload?.url || prev.avatar }));
        } catch (err) {
            setError(err.message || "Failed to upload profile image");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setError("");
        setSaveMessage("");

        try {
            const payload = {
                firstName: profile.firstName,
                lastName: profile.lastName,
                sex: profile.sex,
                dob: profile.dob,
                phone: profile.phone,
                avatar: profile.avatar || undefined,
            };

            await apiRequest(detailsExist ? "/user/me/details" : "/user/me/details", {
                method: detailsExist ? "PUT" : "POST",
                body: JSON.stringify(payload),
            });

            setDetailsExist(true);
            setSaveMessage("Profile updated successfully.");
            setTimeout(() => setSaveMessage(""), 2200);
        } catch (err) {
            setError(err.message || "Failed to update profile");
        }
    };

    const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() || "Profile User";

    return (
        <Layout>
            <div className="p-4">
                <section className="hero-panel mb-4">
                    <span className="page-tag">Profile</span>
                    <h1 className="mt-4 text-3xl font-semibold text-slate-800">Manage your identity and account details</h1>
                    <p className="section-copy max-w-2xl">Update the visible profile, verify personal information, and keep your account data current across the platform.</p>
                </section>

                {error ? (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {error}
                    </div>
                ) : null}

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="glass-panel lg:col-span-1 p-6">
                        <div className="flex flex-col items-center text-center">
                            <img src={profile.avatar || "/avatar.png"} alt="profile" className="h-28 w-28 rounded-[28px] border border-slate-200 object-cover shadow-sm" />
                            <h2 className="mt-4 text-xl font-semibold text-slate-800">{fullName}</h2>
                            <p className="text-sm capitalize text-slate-500">{profile.role || "User"}</p>
                            <label className="btn-primary mt-5 cursor-pointer">
                                {isUploadingAvatar ? "Uploading..." : "Upload Avatar"}
                                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                            </label>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-2 text-center">
                            <div className="rounded-2xl bg-sky-50 p-4">
                                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Role</p>
                                <p className="text-lg font-semibold capitalize text-sky-700">{profile.role || "User"}</p>
                            </div>
                            <div className="rounded-2xl bg-emerald-50 p-4">
                                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Department</p>
                                <p className="text-sm font-semibold text-emerald-700">{profile.department}</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="glass-panel lg:col-span-2 p-6">
                        {isLoading ? (
                            <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-500">Loading profile...</div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="text-sm">
                                    <span className="mb-2 block text-slate-600">First Name</span>
                                    <input name="firstName" value={profile.firstName} onChange={handleChange} className="field-input" />
                                </label>
                                <label className="text-sm">
                                    <span className="mb-2 block text-slate-600">Last Name</span>
                                    <input name="lastName" value={profile.lastName} onChange={handleChange} className="field-input" />
                                </label>
                                <label className="text-sm">
                                    <span className="mb-2 block text-slate-600">Email</span>
                                    <input name="email" type="email" value={profile.email} readOnly className="field-input bg-slate-50" />
                                </label>
                                <label className="text-sm">
                                    <span className="mb-2 block text-slate-600">Phone</span>
                                    <input name="phone" value={profile.phone} onChange={handleChange} className="field-input" />
                                </label>
                                <label className="text-sm">
                                    <span className="mb-2 block text-slate-600">Sex</span>
                                    <select name="sex" value={profile.sex} onChange={handleChange} className="field-select">
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </label>
                                <label className="text-sm">
                                    <span className="mb-2 block text-slate-600">Date of Birth</span>
                                    <input name="dob" type="date" value={profile.dob} onChange={handleChange} className="field-input" />
                                </label>
                            </div>
                        )}

                        <div className="mt-5 flex items-center justify-end gap-3">
                            {saveMessage ? <span className="text-sm font-medium text-green-600">{saveMessage}</span> : null}
                            <button type="submit" className="btn-primary">
                                Save Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
