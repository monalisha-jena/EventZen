import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ── Protect any route that needs login ────────────
export const ProtectedRoute = ({ children }) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// ── Protect routes that need ADMIN role ───────────
export const AdminRoute = ({ children }) => {
    const { isLoggedIn, isAdmin } = useAuth();

    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin()) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

// ── Protect routes that need CUSTOMER role ────────
export const CustomerRoute = ({ children }) => {
    const { isLoggedIn, isCustomer } = useAuth();

    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    if (!isCustomer()) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

// ── Protect routes that need ATTENDEE role ────────
export const AttendeeRoute = ({ children }) => {
    const { isLoggedIn, isAttendee } = useAuth();

    if (!isLoggedIn()) {
        return <Navigate to="/login" replace />;
    }

    if (!isAttendee()) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;