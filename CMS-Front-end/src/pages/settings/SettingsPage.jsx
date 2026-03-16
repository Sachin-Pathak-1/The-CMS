import { useEffect, useMemo, useState } from "react";
import { Card } from "../../lib/designSystem";
import { apiRequest } from "../../lib/apiClient";
import {
    Lock,
    Bell,
    Shield,
    Palette,
    CheckCircle,
    AlertCircle,
    Smartphone,
    Globe2,
    Sun,
    Moon,
    Inbox,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const DEFAULT_SETTINGS = {
    notificationsEmail: true,
    notificationsSMS: false,
    gradeNotifications: true,
    assignmentReminders: true,
    weeklyDigest: true,

    profileVisibility: "college",
    showEmail: false,
    showPhone: false,
    allowMessaging: true,

    theme: "light",
    compactMode: false,
    language: "English",
    timezone: "Asia/Kolkata",
};

const settingsKey = (userId) => `cms-settings-${userId || "guest"}`;

function SettingCard({ icon: Icon, title, description, children }) {
    return (
        <Card className="p-6">
            <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-100">
                    <Icon size={20} className="text-blue-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{description}</p>
                    <div className="mt-4 space-y-3">{children}</div>
                </div>
            </div>
        </Card>
    );
}

const ToggleRow = ({ label, hint, checked, onChange }) => (
    <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition border border-slate-200">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 mt-1 rounded text-blue-600"
        />
        <div>
            <p className="font-medium text-slate-800 text-sm">{label}</p>
            {hint && <p className="text-xs text-slate-500">{hint}</p>}
        </div>
    </label>
);

export function SettingsPage() {
    const { user } = useAuth();
    const { isDarkMode, setIsDarkMode } = useTheme();

    const [activeTab, setActiveTab] = useState("notifications");
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [saveMessage, setSaveMessage] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isSendingReset, setIsSendingReset] = useState(false);

    const storageKey = useMemo(() => settingsKey(user?.id), [user]);

    useEffect(() => {
        let active = true;
        const loadSettings = async () => {
            setError("");
            try {
                const response = await apiRequest("/user/me/settings");
                if (!active) return;
                const data = response?.data || response || {};
                setSettings((prev) => ({ ...prev, ...data }));
                setTwoFactorEnabled(!!data.twoFactorEnabled);
                if (data.theme) setIsDarkMode(data.theme === "dark");
                localStorage.setItem(storageKey, JSON.stringify(data));
            } catch (err) {
                const stored = localStorage.getItem(storageKey);
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        setSettings((prev) => ({ ...prev, ...parsed }));
                        setTwoFactorEnabled(!!parsed.twoFactorEnabled);
                        if (parsed.theme) setIsDarkMode(parsed.theme === "dark");
                    } catch {
                        /* ignore */
                    }
                }
                setError(err.message || "Failed to load settings");
            }
        };
        loadSettings();
        return () => {
            active = false;
        };
    }, [storageKey, setIsDarkMode]);

    useEffect(() => {
        setSettings((prev) => ({ ...prev, theme: isDarkMode ? "dark" : "light" }));
    }, [isDarkMode]);

    const handleToggle = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveSettings = async () => {
        setError("");
        setSaveMessage("");
        setIsSaving(true);
        try {
            const payload = { ...settings, twoFactorEnabled };
            const response = await apiRequest("/user/me/settings", {
                method: "PUT",
                body: JSON.stringify(payload),
            });
            const saved = response?.data || payload;
            localStorage.setItem(storageKey, JSON.stringify(saved));
            setSettings((prev) => ({ ...prev, ...saved }));
            setTwoFactorEnabled(!!saved.twoFactorEnabled);
            setIsDarkMode(saved.theme === "dark");
            setSaveMessage("Settings saved successfully.");
            setTimeout(() => setSaveMessage(""), 2000);
        } catch (err) {
            setError(err.message || "Failed to save settings");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSendResetEmail = async () => {
        if (!user?.email) {
            setError("No email found for this account.");
            return;
        }
        setError("");
        setPasswordMessage("");
        setIsSendingReset(true);
        try {
            await apiRequest("/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email: user.email }),
            });
            setPasswordMessage("Reset link sent to your email.");
        } catch (err) {
            setError(err.message || "Failed to send reset email");
        } finally {
            setIsSendingReset(false);
        }
    };

    const tabs = [
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "privacy", label: "Privacy", icon: Shield },
        { id: "security", label: "Security", icon: Lock },
        { id: "appearance", label: "Appearance", icon: Palette },
    ];

    return (
        <div className="space-y-8 px-4 py-8 md:px-8">
            {/* Header */}
            <div className="flex flex-col gap-2 mb-6">
                <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">Preferences</span>
                <h1 className="text-4xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-600">Manage your preferences, privacy, and security settings</p>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <Card className="p-4 border-l-4 border-rose-500 bg-rose-50">
                    <p className="text-sm text-rose-700 flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
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
            {passwordMessage && (
                <Card className="p-4 border-l-4 border-blue-500 bg-blue-50">
                    <p className="text-sm text-blue-700 flex items-center gap-2">
                        <Inbox size={16} /> {passwordMessage}
                    </p>
                </Card>
            )}

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
                                        ? "border-amber-600 text-amber-600 bg-amber-50"
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

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
                <div className="space-y-6">
                    <SettingCard
                        icon={Bell}
                        title="Notification Methods"
                        description="Choose how you want to receive notifications"
                    >
                        <ToggleRow
                            label="Email Notifications"
                            hint="Receive updates via email"
                            checked={settings.notificationsEmail}
                            onChange={() => handleToggle("notificationsEmail")}
                        />
                        <ToggleRow
                            label="SMS Notifications"
                            hint="Get urgent alerts via SMS"
                            checked={settings.notificationsSMS}
                            onChange={() => handleToggle("notificationsSMS")}
                        />
                    </SettingCard>

                    <SettingCard
                        icon={Bell}
                        title="Academic Updates"
                        description="Get notified about important academic events"
                    >
                        <ToggleRow
                            label="Grade Updates"
                            hint="When new grades are published"
                            checked={settings.gradeNotifications}
                            onChange={() => handleToggle("gradeNotifications")}
                        />
                        <ToggleRow
                            label="Assignment Reminders"
                            hint="Upcoming assignments and deadlines"
                            checked={settings.assignmentReminders}
                            onChange={() => handleToggle("assignmentReminders")}
                        />
                        <ToggleRow
                            label="Weekly Digest"
                            hint="Summary of your activity each week"
                            checked={settings.weeklyDigest}
                            onChange={() => handleToggle("weeklyDigest")}
                        />
                    </SettingCard>

                    <SettingCard
                        icon={Globe2}
                        title="Localization"
                        description="Language and timezone preferences"
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700 block mb-2">Language</span>
                                <select
                                    name="language"
                                    value={settings.language}
                                    onChange={handleSelectChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
                                >
                                    <option>English</option>
                                    <option>Hindi</option>
                                    <option>Marathi</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700 block mb-2">Timezone</span>
                                <select
                                    name="timezone"
                                    value={settings.timezone}
                                    onChange={handleSelectChange}
                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
                                >
                                    <option>Asia/Kolkata</option>
                                    <option>UTC</option>
                                    <option>America/New_York</option>
                                </select>
                            </label>
                        </div>
                    </SettingCard>

                    <button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        className={cn(
                            "w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition",
                            isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                        )}
                    >
                        {isSaving ? "Saving..." : "Save Preferences"}
                    </button>
                </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
                <div className="space-y-6">
                    <SettingCard
                        icon={Shield}
                        title="Profile Visibility"
                        description="Control who can see your profile"
                    >
                        {[
                            { value: "public", label: "Public", hint: "Anyone on the platform" },
                            { value: "college", label: "College only", hint: "Only users from your college" },
                            { value: "private", label: "Private", hint: "Only people you approve" },
                        ].map((item) => (
                            <label key={item.value} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition border border-slate-200">
                                <input
                                    type="radio"
                                    name="profileVisibility"
                                    value={item.value}
                                    checked={settings.profileVisibility === item.value}
                                    onChange={handleSelectChange}
                                    className="w-4 h-4 mt-1 text-blue-600"
                                />
                                <div>
                                    <p className="font-medium text-slate-800 text-sm">{item.label}</p>
                                    <p className="text-xs text-slate-500">{item.hint}</p>
                                </div>
                            </label>
                        ))}
                    </SettingCard>

                    <SettingCard
                        icon={Shield}
                        title="Information Visibility"
                        description="Choose what contact information others see"
                    >
                        <ToggleRow
                            label="Show Email"
                            hint="Let others contact you via email"
                            checked={settings.showEmail}
                            onChange={() => handleToggle("showEmail")}
                        />
                        <ToggleRow
                            label="Show Phone"
                            hint="Make your phone number visible"
                            checked={settings.showPhone}
                            onChange={() => handleToggle("showPhone")}
                        />
                        <ToggleRow
                            label="Allow Messages"
                            hint="Accept direct messages"
                            checked={settings.allowMessaging}
                            onChange={() => handleToggle("allowMessaging")}
                        />
                    </SettingCard>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveSettings}
                            disabled={isSaving}
                            className={cn(
                                "flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 font-medium text-white transition",
                                isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                            )}
                        >
                            <CheckCircle size={18} />
                            {isSaving ? "Saving..." : "Save Privacy Settings"}
                        </button>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
                <div className="space-y-6">
                    <SettingCard
                        icon={Lock}
                        title="Password & Access"
                        description="Use the reset flow to change your password"
                    >
                        <p className="text-sm text-slate-600">
                            We send a secure reset link to <span className="font-semibold">{user?.email || "your email"}</span>.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleSendResetEmail}
                                disabled={isSendingReset}
                                className={cn(
                                    "rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition",
                                    isSendingReset ? "opacity-70 cursor-not-allowed" : "hover:bg-red-700"
                                )}
                            >
                                {isSendingReset ? "Sending..." : "Send reset link"}
                            </button>
                            <a
                                href="/forgot-password"
                                className="text-sm text-blue-600 font-semibold hover:underline mt-1"
                            >
                                Open reset page
                            </a>
                        </div>
                    </SettingCard>

                    <SettingCard
                        icon={Smartphone}
                        title="Two-Factor Authentication"
                        description="Add an extra layer of security"
                    >
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p className="font-medium text-slate-800">
                                    Status:{" "}
                                    <span className={twoFactorEnabled ? "text-emerald-600" : "text-slate-600"}>
                                        {twoFactorEnabled ? "Enabled" : "Disabled"}
                                    </span>
                                </p>
                                <p className="text-xs text-slate-500">Stored locally until backend support is available</p>
                            </div>
                            <button
                                onClick={() => setTwoFactorEnabled((prev) => !prev)}
                                className={cn(
                                    "px-4 py-2 rounded-lg font-medium transition",
                                    twoFactorEnabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
                                )}
                            >
                                {twoFactorEnabled ? "Disable" : "Enable"}
                            </button>
                        </div>
                    </SettingCard>
                </div>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
                <div className="space-y-6">
                    <SettingCard
                        icon={Palette}
                        title="Theme & Display"
                        description="Switch between light and dark themes"
                    >
                        <div className="grid gap-4 md:grid-cols-3">
                            {[
                                { value: "light", label: "Light", icon: Sun },
                                { value: "dark", label: "Dark", icon: Moon },
                                { value: "auto", label: "Auto", icon: Palette },
                            ].map((option) => {
                                const Icon = option.icon;
                                const selected = settings.theme === option.value;
                                return (
                                    <label
                                        key={option.value}
                                        className={cn(
                                            "relative rounded-2xl p-6 border-2 cursor-pointer transition",
                                            selected ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name="theme"
                                            value={option.value}
                                            checked={selected}
                                            onChange={handleSelectChange}
                                            className="hidden"
                                        />
                                        <div className="text-center space-y-2">
                                            <Icon size={24} className="mx-auto text-blue-600" />
                                            <p className="font-semibold text-slate-800">{option.label}</p>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                        <ToggleRow
                            label="Compact mode"
                            hint="Reduce spacing and make content denser"
                            checked={settings.compactMode}
                            onChange={() => handleToggle("compactMode")}
                        />
                    </SettingCard>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setSettings(DEFAULT_SETTINGS)}
                            className="rounded-full border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSaveSettings}
                            disabled={isSaving}
                            className={cn(
                                "flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 font-medium text-white transition",
                                isSaving ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                            )}
                        >
                            <CheckCircle size={18} />
                            {isSaving ? "Saving..." : "Save Display Settings"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
