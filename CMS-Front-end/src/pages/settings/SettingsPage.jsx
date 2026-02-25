import { useState } from "react";
import { Layout } from "../Layout";

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
        <Layout>
            <div className="p-4">
                <div className="mb-4 rounded-xl bg-white p-5 shadow-sm">
                    <h1 className="text-xl font-semibold">Settings</h1>
                    <p className="mt-1 text-sm text-gray-500">Control notifications, preferences, and account security.</p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <form onSubmit={handleSaveSettings} className="rounded-xl bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-semibold">Preferences</h2>
                        <div className="mt-4 space-y-3">
                            <label className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                                <span className="text-sm">Email Notifications</span>
                                <input type="checkbox" checked={settings.notificationsEmail} onChange={() => toggleSetting("notificationsEmail")} />
                            </label>
                            <label className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                                <span className="text-sm">SMS Notifications</span>
                                <input type="checkbox" checked={settings.notificationsSMS} onChange={() => toggleSetting("notificationsSMS")} />
                            </label>
                            <label className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                                <span className="text-sm">Attendance Reminders</span>
                                <input type="checkbox" checked={settings.attendanceReminder} onChange={() => toggleSetting("attendanceReminder")} />
                            </label>
                            <label className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                                <span className="text-sm">Weekly Digest</span>
                                <input type="checkbox" checked={settings.weeklyDigest} onChange={() => toggleSetting("weeklyDigest")} />
                            </label>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <label className="text-sm">
                                <span className="mb-1 block text-gray-600">Language</span>
                                <select
                                    name="language"
                                    value={settings.language}
                                    onChange={handleSelectChange}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                                >
                                    <option>English</option>
                                    <option>Hindi</option>
                                    <option>Marathi</option>
                                </select>
                            </label>
                            <label className="text-sm">
                                <span className="mb-1 block text-gray-600">Timezone</span>
                                <select
                                    name="timezone"
                                    value={settings.timezone}
                                    onChange={handleSelectChange}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                                >
                                    <option>Asia/Kolkata</option>
                                    <option>UTC</option>
                                    <option>America/New_York</option>
                                </select>
                            </label>
                        </div>

                        <div className="mt-5 flex items-center justify-end gap-3">
                            {saveMessage ? <span className="text-sm font-medium text-blue-600">{saveMessage}</span> : null}
                            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                                Save Settings
                            </button>
                        </div>
                    </form>

                    <form onSubmit={handlePasswordSubmit} className="rounded-xl bg-white p-5 shadow-sm">
                        <h2 className="text-lg font-semibold">Security</h2>
                        <p className="mt-1 text-sm text-gray-500">Update your password regularly to keep your account secure.</p>
                        <div className="mt-4 space-y-3">
                            <label className="block text-sm">
                                <span className="mb-1 block text-gray-600">Current Password</span>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwords.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                                />
                            </label>
                            <label className="block text-sm">
                                <span className="mb-1 block text-gray-600">New Password</span>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                                />
                            </label>
                            <label className="block text-sm">
                                <span className="mb-1 block text-gray-600">Confirm New Password</span>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                                />
                            </label>
                        </div>

                        <div className="mt-5 flex justify-end">
                            <button type="submit" className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-black">
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
