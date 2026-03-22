import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getEventById, registerForBooking, createBooking } from "../../api/eventApi";

const EventDetail = () => {
    const { id } = useParams();
    const { user, token, isLoggedIn, isCustomer, isAttendee, isAdmin } = useAuth();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);
    const [actionSuccess, setActionSuccess] = useState(null);

    // ── Fetch Event ───────────────────────────────────
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await getEventById(id);
                setEvent(data);
            } catch (err) {
                setError("Event not found");
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    // ── Handle Customer Booking ───────────────────────
    const handleBooking = async () => {
        if (!isLoggedIn()) {
            navigate("/login");
            return;
        }
        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);
        try {
            await createBooking({ eventId: event.id }, token);
            setActionSuccess("Booking request sent! Waiting for admin approval.");
        } catch (err) {
            setActionError(err.response?.data?.message || "Booking failed. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    // ── Handle Attendee Registration ──────────────────
    const handleRegister = async () => {
        if (!isLoggedIn()) {
            navigate("/login");
            return;
        }
        setActionLoading(true);
        setActionError(null);
        setActionSuccess(null);
        try {
            const response = await registerForBooking(
                { bookingId: event.id },
                token
            );
            if (response.status === "CONFIRMED") {
                setActionSuccess("You are registered! Check your registrations.");
            } else {
                setActionSuccess(`You are on the waitlist at position ${response.waitlistPosition}`);
            }
            const updated = await getEventById(id);
            setEvent(updated);
        } catch (err) {
            setActionError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    // ── Format Date ───────────────────────────────────
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    // ── Format Time ───────────────────────────────────
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
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

    // ── Get Availability Color ────────────────────────
    const getAvailabilityColor = (current, max) => {
        const percentage = (current / max) * 100;
        if (percentage >= 90) return "bg-red-500";
        if (percentage >= 70) return "bg-amber-500";
        return "bg-indigo-500";
    };

    // ── Is Event Active ───────────────────────────────
    const isActive = () => {
        return event?.status === "UPCOMING" || event?.status === "ONGOING";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg">{error || "Event not found"}</p>
                    <button
                        onClick={() => navigate("/events")}
                        className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium">
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Hero Banner ───────────────────────── */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => navigate("/events")}
                        className="text-indigo-200 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Events
                    </button>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(event.status)}`}>
                            {event.status}
                        </span>
                        <span className="bg-white text-indigo-600 text-xs px-3 py-1 rounded-full font-medium">
                            {event.category}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {event.title}
                    </h1>
                    <p className="text-indigo-100 text-lg">
                        Organized by {event.organizerName}
                    </p>
                </div>
            </div>

            {/* ── Content ───────────────────────────── */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* ── Left Column ───────────────── */}
                    <div className="md:col-span-2 space-y-6">

                        {/* ── About ─────────────────── */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">
                                About this event
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                {event.description}
                            </p>
                        </div>

                        {/* ── Event Details ─────────── */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Event Details
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Date & Time</p>
                                        <p className="text-sm text-gray-500">{formatDate(event.eventDate)}</p>
                                        <p className="text-sm text-gray-500">{formatTime(event.eventDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Venue</p>
                                        <p className="text-sm text-gray-500">
                                            {event.venueName || event.venueId}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-indigo-100 p-2 rounded-lg">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Capacity</p>
                                        <p className="text-sm text-gray-500">
                                            {event.maxCapacity} people
                                        </p>
                                        {isAttendee() && (
                                            <p className="text-sm text-gray-500">
                                                {event.availableSlots} slots available
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column ──────────────── */}
                    <div className="space-y-6">

                        {/* ── Availability Card ─────── */}
                        {isAttendee() && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Availability
                                </h2>
                                <div className="mb-3">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Filled</span>
                                        <span className="font-medium text-gray-900">
                                            {Math.round((event.currentCount / event.maxCapacity) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${getAvailabilityColor(event.currentCount, event.maxCapacity)}`}
                                            style={{ width: `${(event.currentCount / event.maxCapacity) * 100}%` }}>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {event.availableSlots > 0
                                        ? `${event.availableSlots} slots remaining`
                                        : "Event is full — you can join the waitlist"}
                                </p>
                            </div>
                        )}

                        {/* ── Action Card ───────────── */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

                            {/* ── Success Message ───────── */}
                            {actionSuccess && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">
                                    {actionSuccess}
                                </div>
                            )}

                            {/* ── Error Message ─────────── */}
                            {actionError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                                    {actionError}
                                </div>
                            )}

                            {/* ── Not logged in ─────────── */}
                            {!isLoggedIn() && (
                                <>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        Interested?
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-3">
                                        Please login to book or register for this event.
                                    </p>
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                        Login to Continue
                                    </button>
                                </>
                            )}

                            {/* ── Customer — Book Event ──── */}
                            {isLoggedIn() && isCustomer() && isActive() && (
                                <>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        Book This Event
                                    </h2>
                                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                        <p className="text-xs text-gray-500">Booking as</p>
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <p className="text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg mb-3">
                                        Your booking request will be sent to admin for approval.
                                    </p>
                                    <button
                                        onClick={handleBooking}
                                        disabled={actionLoading}
                                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                        {actionLoading ? "Sending request..." : "Book This Event"}
                                    </button>
                                </>
                            )}

                            {/* ── Attendee — Go to Browse Bookings ── */}
                            {isLoggedIn() && isAttendee() && isActive() && (
                                <>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        Want to attend?
                                    </h2>
                                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                        <p className="text-xs text-gray-500">Attending as</p>
                                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <p className="text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg mb-3">
                                        Browse approved bookings for this event and register under one.
                                    </p>
                                    <button
                                        onClick={() => navigate("/browse-bookings")}
                                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                        Browse Bookings
                                    </button>
                                </>
                            )}

                            {/* ── Admin — View only ─────── */}
                            {isLoggedIn() && isAdmin() && (
                                <>
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        Admin View
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-3">
                                        Manage this event from the admin dashboard.
                                    </p>
                                    <button
                                        onClick={() => navigate("/admin/events")}
                                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                        Go to Dashboard
                                    </button>
                                </>
                            )}

                            {/* ── Event not active ──────── */}
                            {isLoggedIn() && !isAdmin() && !isActive() && (
                                <p className="text-sm text-gray-500">
                                    This event is no longer accepting bookings or registrations.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;