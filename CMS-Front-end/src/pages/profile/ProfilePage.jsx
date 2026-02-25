import { useState } from "react";
import { Layout } from "../Layout";

export function ProfilePage() {
    const [profile, setProfile] = useState({
        fullName: "Sachin Pathak",
        email: "sachin.pathak@learnytics.edu",
        phone: "+91 99999 99999",
        role: "Admin",
        department: "Academic Management",
        bio: "Building and managing academic workflows for teachers, students, and parents.",
    });
    const [saveMessage, setSaveMessage] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (event) => {
        event.preventDefault();
        setSaveMessage("Profile updated successfully.");
        setTimeout(() => setSaveMessage(""), 2200);
    };

    return (
        <Layout>
            <div className="p-4">
                <div className="mb-4 rounded-xl bg-white p-5 shadow-sm">
                    <h1 className="text-xl font-semibold">Profile</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your personal details and account identity.</p>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rounded-xl bg-white p-5 shadow-sm lg:col-span-1">
                        <div className="flex flex-col items-center text-center">
                            <img src="/avatar.png" alt="profile" className="h-24 w-24 rounded-full border object-cover" />
                            <h2 className="mt-3 text-lg font-semibold">{profile.fullName}</h2>
                            <p className="text-sm text-gray-500">{profile.role}</p>
                        </div>
                        <div className="mt-5 grid grid-cols-2 gap-2 text-center">
                            <div className="rounded-md bg-blue-50 p-3">
                                <p className="text-xs text-gray-500">Classes</p>
                                <p className="text-lg font-semibold text-blue-700">12</p>
                            </div>
                            <div className="rounded-md bg-green-50 p-3">
                                <p className="text-xs text-gray-500">Students</p>
                                <p className="text-lg font-semibold text-green-700">420</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="rounded-xl bg-white p-5 shadow-sm lg:col-span-2">
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="text-sm">
                                <span className="mb-1 block text-gray-600">Full Name</span>
                                <input
                                    name="fullName"
                                    value={profile.fullName}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                                />
                            </label>
                            <label className="text-sm">
                                <span className="mb-1 block text-gray-600">Email</span>
                                <input
                                    name="email"
                                    type="email"
                                    value={profile.email}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                                />
                            </label>
                            <label className="text-sm">
                                <span className="mb-1 block text-gray-600">Phone</span>
                                <input
                                    name="phone"
                                    value={profile.phone}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                                />
                            </label>
                            <label className="text-sm">
                                <span className="mb-1 block text-gray-600">Department</span>
                                <input
                                    name="department"
                                    value={profile.department}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                                />
                            </label>
                            <label className="text-sm md:col-span-2">
                                <span className="mb-1 block text-gray-600">Bio</span>
                                <textarea
                                    name="bio"
                                    value={profile.bio}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-blue-500"
                                />
                            </label>
                        </div>

                        <div className="mt-5 flex items-center justify-end gap-3">
                            {saveMessage ? <span className="text-sm font-medium text-green-600">{saveMessage}</span> : null}
                            <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                            >
                                Save Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
