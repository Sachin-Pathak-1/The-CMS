// Prefer explicit env; otherwise guess local backend (3000) before falling back to /api proxy.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" ? `${window.location.protocol}//${window.location.hostname}:3000` : "") ||
  "/api";

export async function apiRequest(path, options = {}, retry = true) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401 && retry && path !== "/user/me") {
      try {
        await fetch(`${API_BASE_URL}/refresh`, { method: "POST", credentials: "include" });
        return apiRequest(path, options, false);
      } catch {
        /* ignore and fall through */
      }
    }
    const message = payload?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}
