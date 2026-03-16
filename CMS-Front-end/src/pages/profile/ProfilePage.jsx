import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/apiClient";
import { uploadFileToCloudinary } from "../../lib/uploadClient";
import { Card } from "../../lib/designSystem";
import {
    Upload,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CheckCircle,
    Edit2,
    Save,
    X,
    User,
    Award,
    BookOpen,
    Shield,
    Link2,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const defaultProfile = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    sex: "other",
    dob: "",
    avatar: "",
    role: "",
    department: "",
};

const defaultAddress = {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
};

const defaultExtras = {
    bio: "",
    linkedin: "",
    github: "",
    portfolio: "",
};

const defaultStats = {
    coursesEnrolled: 0,
    completedCourses: 0,
    totalPoints: 0,
    achievements: 0,
};

// Stats Card Component
function StatsCard({ icon, label, value, color = "blue" }) {
    const Icon = icon;
    const colorClasses = {
        blue: { bg: "from-blue-600 to-blue-400", accent: "bg-blue-100 text-blue-600" },
        emerald: { bg: "from-emerald-600 to-emerald-400", accent: "bg-emerald-100 text-emerald-600" },
        amber: { bg: "from-amber-600 to-amber-400", accent: "bg-amber-100 text-amber-600" },
        purple: { bg: "from-purple-600 to-purple-400", accent: "bg-purple-100 text-purple-600" },
    };

    return (
        <Card gradient className="p-6 group relative overflow-hidden">
            <div
                className={cn(
                    "absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity",
                    `bg-gradient-to-br ${colorClasses[color].bg}`
                )}
            />
            <div className="relative z-10">
                <div className={cn("w-12 h-12 p-3 rounded-xl mb-3", colorClasses[color].accent)}>
                    <Icon size={24} />
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
        </Card>
    );
}

export function ProfilePage() {
    const { user, refreshUser } = useAuth();

    const [profile, setProfile] = useState(defaultProfile);
    const [address, setAddress] = useState(defaultAddress);
    const [extras, setExtras] = useState(defaultExtras);
    const [stats, setStats] = useState(defaultStats);

    const [activeTab, setActiveTab] = useState("profile");
    const [saveMessage, setSaveMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [detailsExist, setDetailsExist] = useState(true);
    const [addressId, setAddressId] = useState(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [profileCompletion, setProfileCompletion] = useState(0);

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            setIsLoading(true);
            setError("");
            try {
                const [meResult, detailsResult, addressesResult] = await Promise.allSettled([
                    apiRequest("/user/me"),
                    apiRequest("/user/me/details"),
                    apiRequest("/addresses/me"),
                ]);

                if (!active) return;

                const me = meResult.status === "fulfilled" ? meResult.value?.data : null;
                const details = detailsResult.status === "fulfilled" ? detailsResult.value?.data : null;
                const addresses = addressesResult.status === "fulfilled" ? addressesResult.value?.data || [] : [];

                const addressRecord = details?.address || addresses?.[0] || null;

                setDetailsExist(detailsResult.status === "fulfilled");
                setAddressId(addressRecord?.id || null);

                const normalizedDob = details?.dob
                    ? new Date(details.dob).toISOString().slice(0, 10)
                    : "";

                const newProfile = {
                    firstName: details?.firstName || "",
                    lastName: details?.lastName || "",
                    email: me?.email || "",
                    phone: details?.phone || "",
                    sex: details?.sex || "other",
                    dob: normalizedDob,
                    avatar: details?.avatar || me?.userDetails?.avatar || "",
                    role: me?.type || "",
                    department: me?.college?.name || "",
                };

                setProfile(newProfile);

                setAddress({
                    addressLine1: addressRecord?.addressLine1 || "",
                    addressLine2: addressRecord?.addressLine2 || "",
                    city: addressRecord?.city || "",
                    state: addressRecord?.state || "",
                    postalCode: addressRecord?.postalCode || "",
                    country: addressRecord?.country || "",
                });

                setExtras({
                    bio: details?.bio || "",
                    linkedin: details?.linkedin || "",
                    github: details?.github || "",
                    portfolio: details?.portfolio || "",
                });

                // Example stats until API endpoint exists
                setStats({
                    coursesEnrolled: 8,
                    completedCourses: 3,
                    totalPoints: 2450,
                    achievements: 5,
                });

                setProfileCompletion(calculateCompletion(newProfile, address, extras));
            } catch (err) {
                if (active) setError(err.message || "Failed to load profile");
            } finally {
                if (active) setIsLoading(false);
            }
        };

        loadProfile();
        return () => {
            active = false;
        };
    }, []);

    const calculateCompletion = (baseProfile, baseAddress, baseExtras) => {
        const fields = [
            baseProfile.firstName,
            baseProfile.lastName,
            baseProfile.email,
            baseProfile.phone,
            baseProfile.sex !== "other" ? baseProfile.sex : "",
            baseProfile.dob,
            baseAddress.addressLine1,
            baseAddress.city,
            baseExtras.bio,
        ];
        const filled = fields.filter(Boolean).length;
        return Math.round((filled / fields.length) * 100);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleExtrasChange = (event) => {
        const { name, value } = event.target;
        setExtras((prev) => ({ ...prev, [name]: value }));
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

    const addressFieldsFilled = () =>
        Object.values(address).some((value) => value && value.trim().length > 0);

    const handleSave = async (event) => {
        event.preventDefault();
        setError("");
        setSaveMessage("");
        setIsSaving(true);

        try {
            let newAddressId = addressId;

            if (addressFieldsFilled()) {
                const addressPayload = {
                    addressLine1: address.addressLine1 || "N/A",
                    addressLine2: address.addressLine2 || undefined,
                    city: address.city || "N/A",
                    state: address.state || undefined,
                    postalCode: address.postalCode || undefined,
                    country: address.country || "N/A",
                };

                if (newAddressId) {
                    const updated = await apiRequest(`/addresses/${newAddressId}`, {
                        method: "PUT",
                        body: JSON.stringify(addressPayload),
                    });
                    newAddressId = updated?.data?.id || newAddressId;
                } else {
                    const created = await apiRequest("/addresses", {
                        method: "POST",
                        body: JSON.stringify(addressPayload),
                    });
                    newAddressId = created?.data?.id;
                    setAddressId(newAddressId || null);
                }
            }

            const detailsPayload = {
                firstName: profile.firstName,
                lastName: profile.lastName,
                sex: profile.sex,
                dob: profile.dob,
                phone: profile.phone,
                avatar: profile.avatar || undefined,
                addressId: newAddressId || undefined,
                bio: extras.bio || undefined,
                linkedin: extras.linkedin || undefined,
                github: extras.github || undefined,
                portfolio: extras.portfolio || undefined,
            };

            await apiRequest("/user/me/details", {
                method: detailsExist ? "PUT" : "POST",
                body: JSON.stringify(detailsPayload),
            });

            setDetailsExist(true);
            setSaveMessage("Profile updated successfully.");
            setProfileCompletion(calculateCompletion(profile, address, extras));

            await refreshUser();

            setTimeout(() => setSaveMessage(""), 2400);
            setIsEditing(false);
        } catch (err) {
            setError(err.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() || "Profile User";

    const tabs = [
        { id: "profile", label: "Personal Info", icon: User },
        { id: "address", label: "Address", icon: MapPin },
        { id: "social", label: "Links & Bio", icon: Link2 },
    ];

    return (
        <div className="space-y-8 px-4 py-8 md:px-8">
            {/* Header */}
            <div className="flex flex-col gap-2 mb-6">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Account Management</span>
                <h1 className="text-4xl font-bold text-gray-800">Your Profile</h1>
                <p className="text-gray-600">Manage your personal information and professional details</p>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <Card className="p-4 border-l-4 border-rose-500 bg-rose-50">
                    <p className="text-sm text-rose-700 flex items-center gap-2">
                        <Shield size={16} /> {error}
                    </p>
                </Card>
            )}
            {saveMessage && (
                <Card className="p-4 border-l-4 border-emerald-500 bg-emerald-50">
                    <p className="text-sm text-emerald-700 flex items-center gap-2">
                        <CheckCircle size={16} /> {saveMessage}
                    </p>
                </Card>
            )}

            {isLoading ? (
                <Card className="p-12">
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="text-sm text-slate-500 mt-3">Loading profile...</p>
                        </div>
                    </div>
                </Card>
            ) : (
                <>
                    {/* Profile Header Card */}
                    <Card gradient className="p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative">
                                <img
                                    src={profile.avatar || "/avatar.png"}
                                    alt={fullName}
                                    className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
                                    onError={(e) => (e.target.src = "/avatar.png")}
                                />
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 flex items-center gap-2 rounded-full bg-blue-600 p-2 text-white cursor-pointer hover:bg-blue-700 transition shadow-lg">
                                        <Upload size={14} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                            disabled={isUploadingAvatar}
                                        />
                                    </label>
                                )}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-slate-900">{fullName}</h2>
                                <p className="text-sm text-slate-600 capitalize mt-1">{profile.role || "User"}</p>
                                <p className="text-sm text-slate-500 mt-1">{profile.department || "Academic Management"}</p>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                >
                                    <Edit2 size={16} />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </Card>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StatsCard icon={BookOpen} label="Enrolled" value={stats.coursesEnrolled} color="blue" />
                        <StatsCard icon={CheckCircle} label="Completed" value={stats.completedCourses} color="emerald" />
                        <StatsCard icon={Award} label="Points" value={stats.totalPoints} color="amber" />
                        <StatsCard icon={Award} label="Achievements" value={stats.achievements} color="purple" />
                    </div>

                    {/* Profile Completion */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Profile Completion</h3>
                                <p className="text-sm text-slate-500 mt-1">Complete all sections to get maximum platform access</p>
                            </div>
                            <span className="text-3xl font-bold text-blue-600">{profileCompletion}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                                style={{ width: `${profileCompletion}%` }}
                            ></div>
                        </div>
                    </Card>

                    {/* Edit Form or View Mode */}
                    {isEditing ? (
                        <div className="space-y-6">
                            {/* Tab Navigation */}
                            <Card className="p-0">
                                <div className="flex border-b border-slate-200 overflow-x-auto">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition border-b-2 whitespace-nowrap ${
                                                    activeTab === tab.id
                                                        ? "border-blue-600 text-blue-600 bg-blue-50"
                                                        : "border-transparent text-slate-600 hover:text-slate-800"
                                                }`}
                                            >
                                                <Icon size={16} />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </Card>

                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Personal Info Tab */}
                                {activeTab === "profile" && (
                                    <Card className="p-8 space-y-6">
                                        <h3 className="text-xl font-semibold text-slate-800">Personal Information</h3>
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 block mb-2">First Name</span>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={profile.firstName}
                                                    onChange={handleChange}
                                                    placeholder="John"
                                                    required
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 block mb-2">Last Name</span>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={profile.lastName}
                                                    onChange={handleChange}
                                                    placeholder="Doe"
                                                    required
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                                    <Mail size={16} /> Email
                                                </span>
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    disabled
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-600 outline-none cursor-not-allowed"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                                    <Phone size={16} /> Phone
                                                </span>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={profile.phone}
                                                    onChange={handleChange}
                                                    placeholder="+91 98765 43210"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 block mb-2">Gender</span>
                                                <select
                                                    name="sex"
                                                    value={profile.sex}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
                                                >
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                                </select>
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                                    <Calendar size={16} /> Date of Birth
                                                </span>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    value={profile.dob}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                />
                                            </label>
                                        </div>
                                    </Card>
                                )}

                                {/* Address Tab */}
                                {activeTab === "address" && (
                                    <Card className="p-8 space-y-6">
                                        <h3 className="text-xl font-semibold text-slate-800">Address & Location</h3>
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                                    <MapPin size={16} /> Address Line 1
                                                </span>
                                                <input
                                                    type="text"
                                                    name="addressLine1"
                                                    value={address.addressLine1}
                                                    onChange={handleAddressChange}
                                                    placeholder="Street address"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 block mb-2">Address Line 2</span>
                                                <input
                                                    type="text"
                                                    name="addressLine2"
                                                    value={address.addressLine2}
                                                    onChange={handleAddressChange}
                                                    placeholder="Apartment, suite, etc."
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 block mb-2">City</span>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={address.city}
                                                    onChange={handleAddressChange}
                                                    placeholder="City"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 block mb-2">State / Province</span>
                                                <input
                                                    type="text"
                                                    name="state"
                                                    value={address.state}
                                                    onChange={handleAddressChange}
                                                    placeholder="State"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 block mb-2">Postal Code</span>
                                                <input
                                                    type="text"
                                                    name="postalCode"
                                                    value={address.postalCode}
                                                    onChange={handleAddressChange}
                                                    placeholder="Postal code"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 block mb-2">Country</span>
                                                <input
                                                    type="text"
                                                    name="country"
                                                    value={address.country}
                                                    onChange={handleAddressChange}
                                                    placeholder="Country"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                />
                                            </label>
                                        </div>
                                    </Card>
                                )}

                                {/* Social Links Tab */}
                                {activeTab === "social" && (
                                    <Card className="p-8 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-semibold text-slate-800">Social & Bio</h3>
                                            <p className="text-xs text-slate-500">Stored locally on this device</p>
                                        </div>
                                        <div className="space-y-6">
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                                    <Link2 size={16} /> LinkedIn
                                                </span>
                                                <input
                                                    type="url"
                                                    name="linkedin"
                                                    value={extras.linkedin}
                                                    onChange={handleExtrasChange}
                                                    placeholder="https://linkedin.com/in/yourprofile"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                                    <Link2 size={16} /> GitHub
                                                </span>
                                                <input
                                                    type="url"
                                                    name="github"
                                                    value={extras.github}
                                                    onChange={handleExtrasChange}
                                                    placeholder="https://github.com/yourprofile"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-2">
                                                    <Link2 size={16} /> Portfolio
                                                </span>
                                                <input
                                                    type="url"
                                                    name="portfolio"
                                                    value={extras.portfolio}
                                                    onChange={handleExtrasChange}
                                                    placeholder="https://yourportfolio.com"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-slate-700 block mb-2">Bio / About</span>
                                                <textarea
                                                    name="bio"
                                                    value={extras.bio}
                                                    onChange={handleExtrasChange}
                                                    placeholder="Write something about yourself..."
                                                    rows="4"
                                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none"
                                                />
                                                <p className="text-xs text-slate-500 mt-1">{extras.bio.length}/500 characters</p>
                                            </label>
                                        </div>
                                    </Card>
                                )}

                                {/* Action Buttons */}
                                <Card className="p-6 flex items-center gap-4 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex items-center gap-2 rounded-full border-2 border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                                    >
                                        <X size={16} />
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className={cn(
                                            "flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition",
                                            isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                                        )}
                                    >
                                        <Save size={16} />
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </Card>
                            </form>
                        </div>
                    ) : (
                        <Card className="p-8 space-y-8">
                            {/* View Mode - Personal Info */}
                            <div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-6">Personal Information</h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-600">First Name</p>
                                        <p className="text-lg font-semibold text-slate-800 mt-2">{profile.firstName || "-"}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-600">Last Name</p>
                                        <p className="text-lg font-semibold text-slate-800 mt-2">{profile.lastName || "-"}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-600 flex items-center gap-2">
                                            <Phone size={14} /> Phone
                                        </p>
                                        <p className="text-lg font-semibold text-slate-800 mt-2">{profile.phone || "-"}</p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-600">Gender</p>
                                        <p className="text-lg font-semibold text-slate-800 mt-2 capitalize">{profile.sex || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Location Info */}
                            {addressFieldsFilled() && (
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-6">Location</h3>
                                    <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200">
                                        <p className="text-slate-700 leading-relaxed">
                                            {[address.addressLine1, address.addressLine2, address.city, address.state, address.postalCode, address.country]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Social Links */}
                            {(extras.linkedin || extras.github || extras.portfolio) && (
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-6">Professional Links</h3>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        {extras.linkedin && (
                                            <a
                                                href={extras.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-4 border border-blue-200 hover:shadow-lg transition"
                                            >
                                                <p className="text-sm font-semibold text-blue-700 mb-2">LinkedIn</p>
                                                <p className="text-xs text-blue-600 truncate">{extras.linkedin}</p>
                                            </a>
                                        )}
                                        {extras.github && (
                                            <a
                                                href={extras.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 border border-slate-200 hover:shadow-lg transition"
                                            >
                                                <p className="text-sm font-semibold text-slate-700 mb-2">GitHub</p>
                                                <p className="text-xs text-slate-600 truncate">{extras.github}</p>
                                            </a>
                                        )}
                                        {extras.portfolio && (
                                            <a
                                                href={extras.portfolio}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-4 border border-purple-200 hover:shadow-lg transition"
                                            >
                                                <p className="text-sm font-semibold text-purple-700 mb-2">Portfolio</p>
                                                <p className="text-xs text-purple-600 truncate">{extras.portfolio}</p>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Bio Section */}
                            {extras.bio && (
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-6">About</h3>
                                    <div className="rounded-2xl bg-slate-50 p-6 border border-slate-200">
                                        <p className="text-slate-700 leading-relaxed">{extras.bio}</p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}
