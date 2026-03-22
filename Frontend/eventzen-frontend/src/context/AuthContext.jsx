import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // ── Load from localStorage on app start ───────────
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const storedRole = localStorage.getItem("role");

        if (storedToken && storedUser && storedRole) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setRole(storedRole);
        }

        setLoading(false);
    }, []);

    // ── Login ─────────────────────────────────────────
    const login = (userData, userToken, userRole) => {
        setToken(userToken);
        setUser(userData);
        setRole(userRole);

        localStorage.setItem("token", userToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", userRole);
    };

    // ── Logout ────────────────────────────────────────
    const logout = () => {
        setToken(null);
        setUser(null);
        setRole(null);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
    };

    // ── Role checks ───────────────────────────────────
    const isLoggedIn = () => token !== null;
    const isAdmin = () => role === "ADMIN";
    const isCustomer = () => role === "CUSTOMER";
    const isAttendee = () => role === "ATTENDEE";

    return (
        <AuthContext.Provider value={{
            user,
            token,
            role,
            loading,
            login,
            logout,
            isLoggedIn,
            isAdmin,
            isCustomer,
            isAttendee
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;