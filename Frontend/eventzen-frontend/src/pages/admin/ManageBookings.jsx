import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
    getAllBookings,
    approveBooking,
    rejectBooking,
    getRegistrationsByBookingId
} from "../../api/eventApi";

const ManageBookings = () => {
    const { token } = useAuth();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [expandedBooking, setExpandedBooking] = useState(null);
    const [attendees, setAttendees] = useState({});
    const [attendeesLoading, setAttendeesLoading] = useState(null);
    const [filterStatus, setFilterStatus] = useState("ALL");

    // ── Fetch All Bookings ────────────────────────────
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllBookings(token);
            setBookings(data);
        } catch (err) {
            setError("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    // ── Approve Booking ───────────────────────────────
    const handleApprove = async (id) => {
        setActionLoading(id + "_approve");
        setError(null);
        setSuccess(null);
        try {
            await approveBooking(id, token);
            setSuccess("Booking approved successfully");
            fetchBookings();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to approve booking");
        } finally {
            setActionLoading(null);
        }
    };

    // ── Reject Booking ────────────────────────────────
    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to reject this booking?")) return;
        setActionLoading(id + "_reject");
        setError(null);
        setSuccess(null);
        try {
            await rejectBooking(id, token);
            setSuccess("Booking rejected");
            fetchBookings();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reject booking");
        } finally {
            setActionLoading(null);
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

    // ── Filter bookings ───────────────────────────────
    const filteredBookings = filterStatus === "ALL"
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Header ───────────────────────── */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Manage Bookings
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Approve or reject customer booking requests
                        </p>
                    </div>

                    {/* ── Filter tabs ───────────────── */}
                    <div className="flex gap-2">
                        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    filterStatus === status
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                                }`}>
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Success Message ───────────────── */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
                        {success}
                    </div>
                )}

                {/* ── Error Message ─────────────────── */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                {/* ── Bookings List ─────────────────── */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading bookings...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <p className="text-gray-500 text-lg">
                            No {filterStatus !== "ALL" ? filterStatus.toLowerCase() : ""} bookings found.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => (
                            <div key={booking.id}
                                className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

                                {/* ── Booking Row ─────────── */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between">

                                        {/* ── Booking Info ────────── */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    {booking.eventTitle}
                                                </h3>
                                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
                                                <div>
                                                    <p className="text-xs text-gray-500">Customer</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {booking.customerName}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Email</p>
                                                    <p className="text-sm text-gray-600">
                                                        {booking.customerEmail}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Booked on</p>
                                                    <p className="text-sm text-gray-600">
                                                        {formatDate(booking.bookedAt)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Booking ID</p>
                                                    <p className="text-sm text-gray-600">
                                                        #{booking.id}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">Customer Budget</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {booking.budget ? `₹${booking.budget.toLocaleString("en-IN")}` : "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Action Buttons ──────── */}
                                        <div className="flex flex-col gap-2 ml-6">
                                            {booking.status === "PENDING" && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(booking.id)}
                                                        disabled={actionLoading === booking.id + "_approve"}
                                                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50">
                                                        {actionLoading === booking.id + "_approve"
                                                            ? "Approving..."
                                                            : "Approve"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(booking.id)}
                                                        disabled={actionLoading === booking.id + "_reject"}
                                                        className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50">
                                                        {actionLoading === booking.id + "_reject"
                                                            ? "Rejecting..."
                                                            : "Reject"}
                                                    </button>
                                                </>
                                            )}
                                            {booking.status === "APPROVED" && (
                                                <button
                                                    onClick={() => handleViewAttendees(booking.id)}
                                                    className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                                                    {expandedBooking === booking.id
                                                        ? "Hide Attendees"
                                                        : "View Attendees"}
                                                </button>
                                            )}
                                        </div>
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
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="text-left">
                                                            <th className="text-xs font-medium text-gray-500 pb-2">Name</th>
                                                            <th className="text-xs font-medium text-gray-500 pb-2">Email</th>
                                                            <th className="text-xs font-medium text-gray-500 pb-2">Status</th>
                                                            <th className="text-xs font-medium text-gray-500 pb-2">Registered</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        {attendees[booking.id].map((reg) => (
                                                            <tr key={reg.id}>
                                                                <td className="py-2 text-sm font-medium text-gray-900">
                                                                    {reg.attendeeName}
                                                                </td>
                                                                <td className="py-2 text-sm text-gray-500">
                                                                    {reg.attendeeEmail}
                                                                </td>
                                                                <td className="py-2">
                                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRegStatusColor(reg.status)}`}>
                                                                        {reg.status}
                                                                        {reg.status === "WAITLISTED" && reg.waitlistPosition &&
                                                                            ` #${reg.waitlistPosition}`}
                                                                    </span>
                                                                </td>
                                                                <td className="py-2 text-sm text-gray-500">
                                                                    {formatDate(reg.registeredAt)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
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

export default ManageBookings;