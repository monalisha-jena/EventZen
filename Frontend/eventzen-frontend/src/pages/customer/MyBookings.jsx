import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getMyBookings, cancelBooking, getRegistrationsByBookingId } from "../../api/eventApi";

const MyBookings = () => {

    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [attendees, setAttendees] = useState({});
    const [attendeesLoading, setAttendeesLoading] = useState(null);
    const [expandedBooking, setExpandedBooking] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(null);
    const [cancelError, setCancelError] = useState(null);

    // ── Fetch My Bookings ─────────────────────────────
    useEffect(() => {
        fetchMyBookings();
    }, []);

    const fetchMyBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMyBookings(token);
            setBookings(data);
        } catch (err) {
            setError("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    // ── View Attendees ────────────────────────────────
    const handleViewAttendees = async (bookingId) => {
        if (expandedBooking === bookingId) {
            setExpandedBooking(null);
            return;
        }
        setExpandedBooking(bookingId);
        if (attendees[bookingId]) return;

        setAttendeesLoading(bookingId);
        try {
            const data = await getRegistrationsByBookingId(bookingId, token);
            setAttendees(prev => ({ ...prev, [bookingId]: data }));
        } catch (err) {
            setAttendees(prev => ({ ...prev, [bookingId]: [] }));
        } finally {
            setAttendeesLoading(null);
        }
    };

    // ── Cancel Booking ────────────────────────────────
    const handleCancelBooking = async (bookingId) => {
        setCancelLoading(bookingId);
        setCancelError(null);
        try {
            await cancelBooking(bookingId, token);
            fetchMyBookings();
        } catch (err) {
            setCancelError(err.response?.data?.message || "Failed to cancel booking");
        } finally {
            setCancelLoading(null);
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

    // ── Get Booking Status Color ──────────────────────
    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING": return "bg-amber-100 text-amber-700";
            case "APPROVED": return "bg-green-100 text-green-700";
            case "REJECTED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    // ── Get Registration Status Color ─────────────────
    const getRegStatusColor = (status) => {
        switch (status) {
            case "CONFIRMED": return "bg-green-100 text-green-700";
            case "WAITLISTED": return "bg-amber-100 text-amber-700";
            case "CANCELLED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Page Header ──────────────────────── */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Bookings
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Track your event bookings and view registered attendees
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {cancelError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                        {cancelError}
                    </div>
                )}

                {/* ── Bookings List ─────────────────── */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading bookings...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No bookings yet.</p>
                        <a href="/customer"
                            className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                            Browse events →
                        </a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking.id}
                                className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

                                {/* ── Booking Header ──────── */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {booking.eventTitle}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Booked on {formatDate(booking.bookedAt)}
                                            </p>
                                        </div>
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    {/* ── Status message ──────── */}
                                    {booking.status === "PENDING" && (
                                        <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mt-3">
                                            Waiting for admin approval. You'll be notified once approved.
                                        </p>
                                    )}
                                    {booking.status === "APPROVED" && (
                                        <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg mt-3">
                                            Booking approved! Attendees can now register for this booking.
                                        </p>
                                    )}
                                    {booking.status === "REJECTED" && (
                                        <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-3">
                                            Booking was rejected by admin.
                                        </p>
                                    )}

                                    {/* ── Actions ─────────────── */}
                                    <div className="flex gap-3 mt-4">
                                        {booking.status === "APPROVED" && (
                                            <button
                                                onClick={() => handleViewAttendees(booking.id)}
                                                className="text-sm text-indigo-600 border border-indigo-200 bg-indigo-50 px-4 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                                                {expandedBooking === booking.id ? "Hide Attendees" : "View Attendees"}
                                            </button>
                                        )}
                                        {booking.status === "PENDING" && (
                                            <button
                                                onClick={() => handleCancelBooking(booking.id)}
                                                disabled={cancelLoading === booking.id}
                                                className="text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-1.5 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50">
                                                {cancelLoading === booking.id ? "Cancelling..." : "Cancel Booking"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* ── Attendees Section ────── */}
                                {expandedBooking === booking.id && (
                                    <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3">
                                            Registered Attendees
                                        </h4>
                                        {attendeesLoading === booking.id ? (
                                            <div className="text-center py-4">
                                                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                            </div>
                                        ) : !attendees[booking.id] || attendees[booking.id].length === 0 ? (
                                            <p className="text-sm text-gray-500">
                                                No attendees registered yet.
                                            </p>
                                        ) : (
                                            <div className="space-y-2">
                                                {attendees[booking.id].map((reg) => (
                                                    <div key={reg.id}
                                                        className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {reg.attendeeName}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {reg.attendeeEmail}
                                                            </p>
                                                        </div>
                                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRegStatusColor(reg.status)}`}>
                                                            {reg.status}
                                                            {reg.status === "WAITLISTED" && reg.waitlistPosition &&
                                                                ` #${reg.waitlistPosition}`}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;