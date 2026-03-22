import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getApprovedBookings, registerForBooking } from "../../api/eventApi";

const BrowseBookings = () => {
    const { token } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [registerLoading, setRegisterLoading] = useState(null);
    const [registerSuccess, setRegisterSuccess] = useState(null);
    const [registerError, setRegisterError] = useState(null);

    // ── Fetch Approved Bookings ───────────────────────
    useEffect(() => {
        fetchApprovedBookings();
    }, []);

    const fetchApprovedBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getApprovedBookings(token);
            setBookings(data);
        } catch (err) {
            setError("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    // ── Handle Register ───────────────────────────────
    const handleRegister = async (bookingId) => {
        setRegisterLoading(bookingId);
        setRegisterSuccess(null);
        setRegisterError(null);
        try {
            const response = await registerForBooking({ bookingId }, token);
            if (response.status === "WAITLISTED") {
                setRegisterSuccess(bookingId + "_waitlisted");
            } else {
                setRegisterSuccess(bookingId + "_confirmed");
            }
            fetchApprovedBookings();
        } catch (err) {
            setRegisterError(err.response?.data?.message || "Registration failed");
        } finally {
            setRegisterLoading(null);
        }
    };

    // ── Format Date ───────────────────────────────────
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Page Header ──────────────────────── */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Available Bookings
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Register for approved event bookings
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Feedback messages ─────────────── */}
                {registerError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                        {registerError}
                    </div>
                )}

                {/* ── Bookings Grid ─────────────────── */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading bookings...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <p className="text-gray-500 text-lg">
                            No approved bookings available yet.
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                            Check back later when customers book events.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings.map((booking) => (
                            <div key={booking.id}
                                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">

                                {/* ── Card Header ────────── */}
                                <div className="bg-gradient-to-br from-teal-500 to-indigo-600 h-32 flex items-center justify-center relative">
                                    <span className="text-white text-5xl font-bold opacity-20">
                                        {booking.eventTitle?.charAt(0)}
                                    </span>
                                    <span className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                        APPROVED
                                    </span>
                                </div>

                                {/* ── Card Body ──────────── */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                                        {booking.eventTitle}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-3">
                                        Booked by {booking.customerName}
                                    </p>

                                    <div className="space-y-1.5 mb-4">
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            Booked on {formatDate(booking.bookedAt)}
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {booking.customerEmail}
                                        </p>
                                    </div>

                                    {/* ── Register Button ─────── */}
                                    {registerSuccess === booking.id + "_confirmed" ? (
                                        <div className="w-full text-center bg-green-50 text-green-700 py-2 rounded-lg text-sm font-medium border border-green-200">
                                            Registered successfully! ✓
                                        </div>
                                    ) : registerSuccess === booking.id + "_waitlisted" ? (
                                        <div className="w-full text-center bg-amber-50 text-amber-700 py-2 rounded-lg text-sm font-medium border border-amber-200">
                                            Waitlisted ⏳
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleRegister(booking.id)}
                                            disabled={registerLoading === booking.id}
                                            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            {registerLoading === booking.id
                                                ? "Processing..."
                                                : "Register for this Booking"}
                                        </button>
)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowseBookings;