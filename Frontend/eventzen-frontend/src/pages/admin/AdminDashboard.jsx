import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllEvents } from "../../api/eventApi";
import { getAllVenues, getAllVendors } from "../../api/venueApi";

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalEvents: 0,
        totalVenues: 0,
        totalVendors: 0,
        totalRegistrations: 0
    });
    const [recentEvents, setRecentEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // ── Fetch Stats ───────────────────────────────────
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [events, venues, vendors] = await Promise.all([
                    getAllEvents(),
                    getAllVenues(),
                    getAllVendors()
                ]);

                const totalRegistrations = events.reduce(
                    (sum, event) => sum + event.currentCount, 0
                );

                setStats({
                    totalEvents: events.length,
                    totalVenues: venues.length,
                    totalVendors: vendors.length,
                    totalRegistrations
                });

                setRecentEvents(events.slice(0, 5));

            } catch (err) {
                console.error("Failed to load stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // ── Format Date ───────────────────────────────────
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    // ── Get Status Color ──────────────────────────────
    const getStatusColor = (status) => {
        switch (status) {
            case "UPCOMING": return "bg-green-100 text-green-700";
            case "ONGOING": return "bg-blue-100 text-blue-700";
            case "COMPLETED": return "bg-gray-100 text-gray-700";
            case "CANCELLED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Header ───────────────────────── */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Dashboard Overview
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Welcome back, {user?.name}! Here is your summary.
                    </p>
                </div>

                {/* ── Stats Cards ───────────────────── */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="bg-indigo-100 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
                                <p className="text-sm text-gray-500 mt-1">Total Events</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="bg-green-100 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalRegistrations}</p>
                                <p className="text-sm text-gray-500 mt-1">Total Registrations</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="bg-amber-100 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalVenues}</p>
                                <p className="text-sm text-gray-500 mt-1">Total Venues</p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="bg-purple-100 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalVendors}</p>
                                <p className="text-sm text-gray-500 mt-1">Total Vendors</p>
                            </div>

                        </div>

                        {/* ── Quick Actions ─────────────── */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <button
                                onClick={() => navigate("/admin/events")}
                                className="bg-indigo-600 text-white p-6 rounded-2xl hover:bg-indigo-700 transition-colors text-left">
                                <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="font-semibold text-lg">Manage Events</p>
                                <p className="text-indigo-200 text-sm mt-1">Create and manage events</p>
                            </button>
                            <button
                                onClick={() => navigate("/admin/venues")}
                                className="bg-amber-500 text-white p-6 rounded-2xl hover:bg-amber-600 transition-colors text-left">
                                <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <p className="font-semibold text-lg">Manage Venues</p>
                                <p className="text-amber-100 text-sm mt-1">Add and manage venues</p>
                            </button>
                            <button
                                onClick={() => navigate("/admin/vendors")}
                                className="bg-purple-600 text-white p-6 rounded-2xl hover:bg-purple-700 transition-colors text-left">
                                <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <p className="font-semibold text-lg">Manage Vendors</p>
                                <p className="text-purple-200 text-sm mt-1">Add and manage vendors</p>
                            </button>
                        </div>

                        {/* ── Recent Events ─────────────── */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Recent Events
                                </h2>
                                <button
                                    onClick={() => navigate("/admin/events")}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                                    View all →
                                </button>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {recentEvents.map((event) => (
                                    <div key={event.id} className="flex items-center justify-between p-6">
                                        <div>
                                            <p className="font-medium text-gray-900">{event.title}</p>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {formatDate(event.eventDate)} • {event.venue}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-sm text-gray-500">
                                                {event.currentCount}/{event.maxCapacity}
                                            </p>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;