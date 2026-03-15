import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getHomeRoute } from "../../lib/homeRoute";

export function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="p-6 text-sm text-slate-500">Loading session...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.type)) {
        return <Navigate to={getHomeRoute(user.type)} replace />;
    }

    return children;
}
