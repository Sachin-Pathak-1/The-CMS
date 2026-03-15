import { useState } from "react";

export function SettingsPage() {
    const [settings, setSettings] = useState({
        notificationsEmail: true,
        notificationsSMS: false,
        attendanceReminder: true,
        weeklyDigest: true,
        language: "English",
        timezone: "Asia/Kolkata",
    });
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [saveMessage, setSaveMessage] = useState("");

    const toggleSetting = (key) => {
        setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSelectChange = (event) => {
        const { name, value } = event.target;
        setSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (event) => {
        const { name, value } = event.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveSettings = (event) => {
        event.preventDefault();
        setSaveMessage("Settings saved.");
        setTimeout(() => setSaveMessage(""), 2200);
    };

    const handlePasswordSubmit = (event) => {
        event.preventDefault();
        if (!passwords.newPassword || passwords.newPassword !== passwords.confirmPassword) {
            setSaveMessage("Password confirmation does not match.");
            setTimeout(() => setSaveMessage(""), 2200);
            return;
        }

        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setSaveMessage("Password updated.");
        setTimeout(() => setSaveMessage(""), 2200);
    };

    return (
        <>
            <div className="p-4">
                <section className="hero-panel mb-4">
                    <span className="page-tag">Settings</span>
                    <h1 className="mt-4 text-3xl font-semibold text-slate-800">Control preferences, alerts, and account security</h1>
                    <p className="section-copy max-w-2xl">Fine-tune how the platform communicates with you and keep account access aligned with your daily workflow.</p>
                </section>

                <div className="grid gap-4 lg:grid-cols-2">
                    <form onSubmit={handleSaveSettings} className="glass-panel p-6">
                        <h2 className="text-lg font-semibold text-slate-800">Preferences</h2>
                        <div className="mt-4 space-y-3">
                            <label className="soft-panel flex items-center justify-between px-4 py-4">
                                <span className="text-sm">Email Notifications</span>
                                <input type="checkbox" checked={settings.notificationsEmail} onChange={() => toggleSetting("notificationsEmail")} />
                            </label>
                            <label className="soft-panel flex items-center justify-between px-4 py-4">
                                <span className="text-sm">SMS Notifications</span>
                                <input type="checkbox" checked={settings.notificationsSMS} onChange={() => toggleSetting("notificationsSMS")} />
                            </label>
                            <label className="soft-panel flex items-center justify-between px-4 py-4">
                                <span className="text-sm">Attendance Reminders</span>
                                <input type="checkbox" checked={settings.attendanceReminder} onChange={() => toggleSetting("attendanceReminder")} />
                            </label>
                            <label className="soft-panel flex items-center justify-between px-4 py-4">
                                <span className="text-sm">Weekly Digest</span>
                                <input type="checkbox" checked={settings.weeklyDigest} onChange={() => toggleSetting("weeklyDigest")} />
                            </label>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <label className="text-sm">
                                <span className="mb-2 block text-slate-600">Language</span>
                                <select
                                    name="language"
                                    value={settings.language}
                                    onChange={handleSelectChange}
                                    className="field-select"
                                >
                                    <option>English</option>
                                    <option>Hindi</option>
                                    <option>Marathi</option>
                                </select>
                            </label>
                            <label className="text-sm">
                                <span className="mb-2 block text-slate-600">Timezone</span>
                                <select
                                    name="timezone"
                                    value={settings.timezone}
                                    onChange={handleSelectChange}
                                    className="field-select"
                                >
                                    <option>Asia/Kolkata</option>
                                    <option>UTC</option>
                                    <option>America/New_York</option>
                                </select>
                            </label>
                        </div>

                        <div className="mt-5 flex items-center justify-end gap-3">
                            {saveMessage ? <span className="text-sm font-medium text-sky-700">{saveMessage}</span> : null}
                            <button type="submit" className="btn-primary">
                                Save Settings
                            </button>
                        </div>
                    </form>

                    <form onSubmit={handlePasswordSubmit} className="glass-panel p-6">
                        <h2 className="text-lg font-semibold text-slate-800">Security</h2>
                        <p className="mt-1 text-sm text-slate-500">Update your password regularly to keep your account secure.</p>
                        <div className="mt-4 space-y-3">
                            <label className="block text-sm">
                                <span className="mb-2 block text-slate-600">Current Password</span>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwords.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="field-input"
                                />
                            </label>
                            <label className="block text-sm">
                                <span className="mb-2 block text-slate-600">New Password</span>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handlePasswordChange}
                                    className="field-input"
                                />
                            </label>
                            <label className="block text-sm">
                                <span className="mb-2 block text-slate-600">Confirm New Password</span>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="field-input"
                                />
                            </label>
                        </div>

                        <div className="mt-5 flex justify-end">
                            <button type="submit" className="btn-primary">
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
