import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyRegistrations, cancelRegistration } from "../../api/eventApi";

const MyRegistrations = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(null);
    const [cancelSuccess, setCancelSuccess] = useState(null);
    const [upgradeNotif, setUpgradeNotif] = useState(null);

    // ── Fetch Registrations ───────────────────────────
    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const data = await getMyRegistrations(token);
                setRegistrations(data);
            } catch (err) {
                setError("Failed to load registrations");
            } finally {
                setLoading(false);
            }
        };
        fetchRegistrations();
    }, []);

    // ── Check for waitlist upgrades ───────────────────
    useEffect(() => {
        const checkWaitlistUpgrades = (data) => {
            const previousStatuses = JSON.parse(
                localStorage.getItem("registrationStatuses") || "{}"
            );
            const upgrades = data.filter(r =>
                previousStatuses[r.id] === "WAITLISTED" &&
                r.status === "CONFIRMED"
            );
            if (upgrades.length > 0) {
                setUpgradeNotif(
                    `🎉 Good news! You've been confirmed for: ${upgrades.map(u => u.eventTitle).join(", ")}`
                );
            }
            const newStatuses = {};
            data.forEach(r => { newStatuses[r.id] = r.status; });
            localStorage.setItem("registrationStatuses", JSON.stringify(newStatuses));
        };

        if (registrations.length > 0) {
            checkWaitlistUpgrades(registrations);
        }
    }, [registrations]);

    // ── Handle Cancel ─────────────────────────────────
    const handleCancel = async (registrationId) => {
        setCancelLoading(registrationId);
        setCancelSuccess(null);

        try {
            await cancelRegistration(registrationId, token);
            setCancelSuccess("Registration cancelled successfully");

            // refresh registrations
            const data = await getMyRegistrations(token);
            setRegistrations(data);

        } catch (err) {
            setError(err.response?.data?.message || "Cancellation failed");
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

    // ── Get Status Style ──────────────────────────────
    const getStatusStyle = (status) => {
        switch (status) {
            case "CONFIRMED":
                return {
                    badge: "bg-green-100 text-green-700",
                    border: "border-l-green-500",
                    dot: "bg-green-500"
                };
            case "WAITLISTED":
                return {
                    badge: "bg-amber-100 text-amber-700",
                    border: "border-l-amber-500",
                    dot: "bg-amber-500"
                };
            case "CANCELLED":
                return {
                    badge: "bg-red-100 text-red-700",
                    border: "border-l-red-500",
                    dot: "bg-red-500"
                };
            default:
                return {
                    badge: "bg-gray-100 text-gray-700",
                    border: "border-l-gray-500",
                    dot: "bg-gray-500"
                };
        }
    };

    // ── Count by status ───────────────────────────────
    const confirmed = registrations.filter(r => r.status === "CONFIRMED").length;
    const waitlisted = registrations.filter(r => r.status === "WAITLISTED").length;
    const cancelled = registrations.filter(r => r.status === "CANCELLED").length;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Page Header ──────────────────────── */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Registrations
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Track all your event registrations
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {upgradeNotif && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6 flex items-center justify-between">
                        <span>{upgradeNotif}</span>
                        <button
                            onClick={() => setUpgradeNotif(null)}
                            className="text-green-500 hover:text-green-700 ml-4 font-bold">
                            ✕
                        </button>
                    </div>
                )}

                {/* ── Stats Cards ───────────────────── */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                        <p className="text-2xl font-bold text-green-600">{confirmed}</p>
                        <p className="text-sm text-gray-500 mt-1">Confirmed</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                        <p className="text-2xl font-bold text-amber-600">{waitlisted}</p>
                        <p className="text-sm text-gray-500 mt-1">Waitlisted</p>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
                        <p className="text-2xl font-bold text-red-600">{cancelled}</p>
                        <p className="text-sm text-gray-500 mt-1">Cancelled</p>
                    </div>
                </div>

                {/* ── Success Message ───────────────── */}
                {cancelSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
                        {cancelSuccess}
                    </div>
                )}

                {/* ── Error Message ─────────────────── */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                {/* ── Registrations List ────────────── */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading registrations...</p>
                    </div>
                ) : registrations.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <p className="text-gray-500 text-lg">
                            No registrations yet
                        </p>
                        <button
                            onClick={() => navigate("/events")}
                            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                            Browse Events
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {registrations.map((registration) => {
                            const style = getStatusStyle(registration.status);
                            return (
                                <div key={registration.id}
                                    className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${style.border} p-6`}>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                        {/* ── Left Info ──────────── */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-2 h-2 rounded-full ${style.dot}`}></div>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
                                                    {registration.status}
                                                    {registration.status === "WAITLISTED" && (
                                                        <span> #{registration.waitlistPosition}</span>
                                                    )}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {registration.eventTitle}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Registered on {formatDate(registration.registeredAt)}
                                            </p>
                                        </div>

                                        {/* ── Right Actions ──────── */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => navigate(`/events/${registration.eventId}`)}
                                                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                                                View Event
                                            </button>
                                            {registration.status !== "CANCELLED" && (
                                                <button
                                                    onClick={() => handleCancel(registration.id)}
                                                    disabled={cancelLoading === registration.id}
                                                    className="text-sm text-red-600 hover:text-red-700 font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50">
                                                    {cancelLoading === registration.id
                                                        ? "Cancelling..."
                                                        : "Cancel"}
                                                </button>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
};

export default MyRegistrations;