import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../lib/apiClient";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const response = await apiRequest("/user/me");
            setUser(response?.data || null);
            return response?.data || null;
        } catch {
            setUser(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const logout = async () => {
        try {
            await apiRequest("/logout", { method: "POST" });
        } catch {
            // Ignore logout network errors and still clear local auth state.
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, isLoading, refreshUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
