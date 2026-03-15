import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { apiRequest } from "../../lib/apiClient";
import { useAuth } from "../../contexts/AuthContext";
import { getHomeRoute } from "../../lib/homeRoute";

export function LoginPage() {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await apiRequest("/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            await refreshUser();

            const redirectTo = response?.data?.redirectTo;

            if (redirectTo) {
                navigate(redirectTo);
                return;
            }

            navigate(getHomeRoute(response?.data?.user?.type));
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff7de] via-white to-[#e3f4ff] p-4">
            <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl items-center justify-center">
                <div className="grid w-full overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl lg:grid-cols-[1fr_0.9fr]">
                    <section className="relative hidden overflow-hidden bg-slate-900 p-10 text-white lg:block">
                        <div className="absolute -right-10 top-8 opacity-10">
                            <img src="/logo.png" alt="" width={160} height={160} />
                        </div>
                        <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                            Learnytics Access
                        </span>
                        <h1 className="mt-6 text-5xl font-semibold leading-tight">
                            Sign in and go straight to the right dashboard
                        </h1>
                        <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
                            Students land in the student dashboard, teachers go to the teaching workspace, and admins go directly to the admin control panel.
                        </p>
                        <div className="mt-10 grid gap-4">
                            <div className="rounded-2xl bg-white/10 p-4">
                                <p className="text-sm font-semibold">Student</p>
                                <p className="mt-1 text-sm text-slate-300">Assignments, announcements, wallet, rewards, and class activity.</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-4">
                                <p className="text-sm font-semibold">Teacher</p>
                                <p className="mt-1 text-sm text-slate-300">Calendar, grading flow, submissions, and teaching operations.</p>
                            </div>
                            <div className="rounded-2xl bg-white/10 p-4">
                                <p className="text-sm font-semibold">Admin</p>
                                <p className="mt-1 text-sm text-slate-300">System-level control, management pages, and institution operations.</p>
                            </div>
                        </div>
                    </section>

                    <section className="p-6 sm:p-10">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <img src="/logo.png" alt="Learnytics" width={36} height={36} />
                            <span className="text-xl font-semibold text-slate-800">Learnytics</span>
                        </Link>

                        <div className="mt-10">
                            <h2 className="text-3xl font-semibold text-slate-800">Login</h2>
                            <p className="mt-2 text-sm text-slate-500">Use your account credentials to continue.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label className="text-sm font-medium text-slate-700">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="mt-2 w-full rounded-2xl border border-slate-200 p-3 outline-none transition focus:border-blue-500"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Password</label>
                                <div className="relative mt-2">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        className="w-full rounded-2xl border border-slate-200 p-3 pr-12 outline-none transition focus:border-blue-500"
                                        placeholder="Enter your password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((current) => !current)}
                                        className="absolute inset-y-0 right-3 inline-flex items-center text-slate-500 transition hover:text-slate-800"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {error ? (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    {error}
                                </div>
                            ) : null}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isLoading ? "Signing in..." : "Login"}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}
