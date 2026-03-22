import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, role, isLoggedIn, isAdmin, isCustomer, isAttendee, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // ── Close dropdown on route change ───────────────
    useEffect(() => {
        setDropdownOpen(false);
    }, [location]);

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
        navigate("/", { replace: true });
    };

    // ── Active link check ────────────────────────────
    const isActive = (path) => location.pathname === path;

    // ── Nav link classes ─────────────────────────────
    const navLinkClass = (path) =>
        `text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 
        ${isActive(path)
            ? "bg-indigo-100 text-indigo-700"
            : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
        }`;

    // ── Role badge color ─────────────────────────────
    const getRoleBadgeClass = () => {
        if (isAdmin()) return "bg-red-100 text-red-700";
        if (isCustomer()) return "bg-indigo-100 text-indigo-700";
        if (isAttendee()) return "bg-emerald-100 text-emerald-700";
        return "bg-gray-100 text-gray-700";
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* ── Logo ───────────────────────── */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-bold text-lg tracking-tight">
                            EventZen
                        </div>
                    </Link>

                    {/* ── Nav Links ──────────────────── */}
                    <div className="hidden md:flex items-center gap-1">

                        {/* ── Guest + Customer + Attendee ── */}
                        {!isAdmin() && (
                            <>
                                <Link to="/" className={navLinkClass("/")}>
                                    Home
                                </Link>
                                <Link to="/events" className={navLinkClass("/events")}>
                                    Events
                                </Link>
                                {isCustomer() && (
                                    <Link to="/my-bookings" className={navLinkClass("/my-bookings")}>
                                        My Bookings
                                    </Link>
                                )}
                                {isAttendee() && (
                                    <>
                                        <Link to="/browse-bookings" className={navLinkClass("/browse-bookings")}>
                                            Browse Bookings
                                        </Link>
                                        <Link to="/my-registrations" className={navLinkClass("/my-registrations")}>
                                            My Registrations
                                        </Link>
                                    </>
                                )}
                            </>
                        )}

                        {/* ── Admin ────────────────────── */}
                        {isAdmin() && (
                            <>
                                <Link to="/admin" className={navLinkClass("/admin")}>
                                    Dashboard
                                </Link>
                                <Link to="/admin/events" className={navLinkClass("/admin/events")}>
                                    Events
                                </Link>
                                <Link to="/admin/venues" className={navLinkClass("/admin/venues")}>
                                    Venues
                                </Link>
                                <Link to="/admin/vendors" className={navLinkClass("/admin/vendors")}>
                                    Vendors
                                </Link>
                                <Link to="/admin/bookings" className={navLinkClass("/admin/bookings")}>
                                    Bookings
                                </Link>
                                <Link to="/admin/budget" className={navLinkClass("/admin/budget")}>
                                    Budget Overview
                                </Link>
                            </>
                        )}
                    </div>

                    {/* ── Auth ───────────────────────── */}
                    <div className="flex items-center gap-3">
                        {!isLoggedIn() ? (
                            <div className="flex items-center gap-2">
                                <Link to="/login"
                                    className="text-sm text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200">
                                    Sign In
                                </Link>
                                <Link to="/register"
                                    className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-all duration-200 hover:shadow-md">
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200">

                                    {/* Avatar */}
                                    <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name */}
                                    <span className="text-sm font-medium text-gray-700">
                                        Hi, {user?.name?.split(" ")[0]}
                                    </span>

                                    {/* Role Badge */}
                                    {role && (
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getRoleBadgeClass()}`}>
                                            {role}
                                        </span>
                                    )}

                                    {/* Chevron */}
                                    <svg
                                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* ── Dropdown ───────────── */}
                                {dropdownOpen && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setDropdownOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">

                                            {/* User info */}
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {user?.email}
                                                </p>
                                                {role && (
                                                    <span className={`inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full font-semibold ${getRoleBadgeClass()}`}>
                                                        {role}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Admin links */}
                                            {isAdmin() && (
                                                <>
                                                    <Link to="/admin"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                                        Dashboard
                                                    </Link>
                                                    <Link to="/admin/bookings"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                                        Manage Bookings
                                                    </Link>
                                                </>
                                            )}

                                            {/* Customer links */}
                                            {isCustomer() && (
                                                <>
                                                    <Link to="/customer"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                                        Browse Events
                                                    </Link>
                                                    <Link to="/my-bookings"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                                        My Bookings
                                                    </Link>
                                                </>
                                            )}

                                            {/* Attendee links */}
                                            {isAttendee() && (
                                                <>
                                                    <Link to="/browse-bookings"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                                        Browse Bookings
                                                    </Link>
                                                    <Link to="/my-registrations"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                                        My Registrations
                                                    </Link>
                                                </>
                                            )}

                                            <div className="border-t border-gray-100 mt-1 pt-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;