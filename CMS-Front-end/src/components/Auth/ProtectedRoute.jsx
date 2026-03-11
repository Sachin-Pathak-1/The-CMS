import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="p-6 text-sm text-slate-500">Loading session...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.type)) {
        const redirectTo = user.type === "admin" ? "/admin" : user.type === "teacher" ? "/teacher" : "/student";
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}
