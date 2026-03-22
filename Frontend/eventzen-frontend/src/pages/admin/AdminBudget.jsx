import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllBookings, getAllEvents } from "../../api/eventApi";
import { getAllVendors, getVendorById, getBookingVendors, addVendorToBooking, removeVendorFromBooking } from "../../api/venueApi";

const AdminBudget = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [events, setEvents] = useState({});
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [allVendors, setAllVendors] = useState([]);
    const [extraVendors, setExtraVendors] = useState({});
    const [showVendorDropdown, setShowVendorDropdown] = useState(null);
    const [vendorActionLoading, setVendorActionLoading] = useState(false);

    // ── Fetch extra vendors for all bookings ──────────
    const fetchExtraVendors = async (bookingList) => {
        const map = {};
        await Promise.all(
            bookingList.map(async (b) => {
                try {
                    const data = await getBookingVendors(b.id, token);
                    map[b.id] = data.vendors || [];
                } catch (err) {
                    map[b.id] = [];
                }
            })
        );
        setExtraVendors(map);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingData, eventData, vendorData] = await Promise.all([
                    getAllBookings(token),
                    getAllEvents(),
                    getAllVendors()
                ]);

                // ── Build event map ───────────────────
                const eventMap = {};
                eventData.forEach(e => { eventMap[e.id] = e; });

                // ── Fetch vendor price per event ──────
                const uniqueVendorIds = [...new Set(
                    eventData.map(e => e.vendorId).filter(Boolean)
                )];

                const vendorMap = {};
                await Promise.all(
                    uniqueVendorIds.map(async (vendorId) => {
                        try {
                            const vendor = await getVendorById(vendorId);
                            vendorMap[vendorId] = vendor;
                        } catch (err) {
                            vendorMap[vendorId] = null;
                        }
                    })
                );

                // ── Attach vendorPrice to each event ──
                Object.values(eventMap).forEach(e => {
                    const vendor = vendorMap[e.vendorId];
                    e.vendorPrice = vendor?.price || null;
                    e.vendorName = vendor?.name || e.vendorName || null;
                });

                setBookings(bookingData);
                setEvents(eventMap);
                setAllVendors(vendorData);

                // ── Fetch persisted extra vendors ─────
                await fetchExtraVendors(bookingData);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ── Add vendor to booking ─────────────────────────
    const handleAddVendor = async (bookingId, vendor, eventId) => {
        setVendorActionLoading(true);
        try {
            await addVendorToBooking(bookingId, {
                eventId,
                vendorId: vendor._id,
                vendorName: vendor.name,
                serviceType: vendor.serviceType,
                price: vendor.price
            }, token);
            setExtraVendors(prev => ({
                ...prev,
                [bookingId]: [...(prev[bookingId] || []), {
                    vendorId: vendor._id,
                    vendorName: vendor.name,
                    serviceType: vendor.serviceType,
                    price: vendor.price
                }]
            }));
            setShowVendorDropdown(null);
        } catch (err) {
            console.error(err);
        } finally {
            setVendorActionLoading(false);
        }
    };

    // ── Remove vendor from booking ────────────────────
    const handleRemoveVendor = async (bookingId, vendorId) => {
        setVendorActionLoading(true);
        try {
            await removeVendorFromBooking(bookingId, vendorId, token);
            setExtraVendors(prev => ({
                ...prev,
                [bookingId]: prev[bookingId].filter(v => v.vendorId !== vendorId)
            }));
        } catch (err) {
            console.error(err);
        } finally {
            setVendorActionLoading(false);
        }
    };

    const formatCurrency = (amount) =>
        amount ? `₹${Number(amount).toLocaleString("en-IN")}` : "—";

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":  return "bg-amber-100 text-amber-700";
            case "APPROVED": return "bg-green-100 text-green-700";
            case "REJECTED": return "bg-red-100 text-red-700";
            default:         return "bg-gray-100 text-gray-700";
        }
    };

    const filteredBookings = filterStatus === "ALL"
        ? bookings.filter(b => b.budget)
        : bookings.filter(b => b.budget && b.status === filterStatus);

    // ── Summary stats ─────────────────────────────────
    const allWithBudget = bookings.filter(b => b.budget);
    const totalBudget = allWithBudget.reduce((sum, b) => sum + (b.budget || 0), 0);
    const totalVendorCostAll = allWithBudget.reduce((sum, b) => {
        const event = events[b.eventId];
        const extras = extraVendors[b.id] || [];
        const extraCost = extras.reduce((s, v) => s + v.price, 0);
        return sum + (event?.vendorPrice || 0) + extraCost;
    }, 0);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Header ───────────────────────────── */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900">Budget Overview</h1>
                    <p className="text-gray-500 mt-1">
                        Track customer budgets against vendor costs per booking
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Summary Cards ─────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Total Customer Budget</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {formatCurrency(totalBudget)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Across all bookings</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Total Vendor Cost</p>
                        <p className="text-3xl font-bold text-indigo-600">
                            {formatCurrency(totalVendorCostAll)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Sum of all vendor costs</p>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <p className="text-sm text-gray-500 mb-1">Total Remaining</p>
                        <p className={`text-3xl font-bold ${totalBudget - totalVendorCostAll >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(totalBudget - totalVendorCostAll)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Budget minus vendor cost</p>
                    </div>
                </div>

                {/* ── Filter ────────────────────────── */}
                <div className="flex gap-2 mb-6">
                    {["ALL", "PENDING", "APPROVED", "REJECTED"].map(s => (
                        <button key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                filterStatus === s
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                            }`}>
                            {s}
                        </button>
                    ))}
                </div>

                {/* ── Bookings ──────────────────────── */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-gray-500 mt-4">Loading budget data...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <p className="text-gray-400">No bookings with budget information found.</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Customers need to enter a budget when booking.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking) => {
                            const event = events[booking.eventId];
                            const vendorPrice = event?.vendorPrice || null;
                            const extras = extraVendors[booking.id] || [];
                            const extraCost = extras.reduce((sum, v) => sum + v.price, 0);
                            const totalVendorCost = (vendorPrice || 0) + extraCost;
                            const remaining = booking.budget - totalVendorCost;
                            const isOverBudget = remaining < 0;

                            return (
                                <div key={booking.id}
                                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

                                    {/* ── Top row ─────────────── */}
                                    <div className="flex items-start justify-between mb-5">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    {booking.eventTitle}
                                                </h3>
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                                {totalVendorCost > 0 && (
                                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                        isOverBudget
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-green-100 text-green-700"
                                                    }`}>
                                                        {isOverBudget ? "Over Budget" : "Within Budget"}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {booking.customerName} · {booking.customerEmail} · Booking #{booking.id}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ── Budget breakdown ─────── */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-xs text-gray-500 mb-1">Customer Budget</p>
                                            <p className="text-xl font-bold text-gray-900">
                                                {formatCurrency(booking.budget)}
                                            </p>
                                        </div>
                                        <div className="bg-indigo-50 rounded-xl p-4">
                                            <p className="text-xs text-gray-500 mb-1">Total Vendor Cost</p>
                                            <p className="text-xl font-bold text-indigo-600">
                                                {formatCurrency(totalVendorCost)}
                                            </p>
                                        </div>
                                        <div className={`rounded-xl p-4 ${isOverBudget ? "bg-red-50" : "bg-green-50"}`}>
                                            <p className="text-xs text-gray-500 mb-1">Remaining</p>
                                            <p className={`text-xl font-bold ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                                                {formatCurrency(remaining)}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-xl p-4">
                                            <p className="text-xs text-gray-500 mb-1">Budget Used</p>
                                            <p className="text-xl font-bold text-gray-900">
                                                {booking.budget
                                                    ? `${Math.min(100, Math.round((totalVendorCost / booking.budget) * 100))}%`
                                                    : "—"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* ── Vendors section ──────── */}
                                    <div className="border-t border-gray-100 pt-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-medium text-gray-700">
                                                Vendors ({(vendorPrice ? 1 : 0) + extras.length})
                                            </p>
                                            <button
                                                onClick={() => setShowVendorDropdown(
                                                    showVendorDropdown === booking.id ? null : booking.id
                                                )}
                                                className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors font-medium">
                                                + Add Vendor
                                            </button>
                                        </div>

                                        {/* ── Vendor dropdown ──────── */}
                                        {showVendorDropdown === booking.id && (
                                            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3 mb-3">
                                                <p className="text-xs text-gray-500 mb-2 font-medium">
                                                    Select a vendor to add:
                                                </p>
                                                <div className="space-y-1 max-h-48 overflow-y-auto">
                                                    {allVendors
                                                        .filter(v =>
                                                            v._id !== event?.vendorId &&
                                                            !extras.find(e => e.vendorId === v._id)
                                                        )
                                                        .map(vendor => (
                                                            <button
                                                                key={vendor._id}
                                                                onClick={() => handleAddVendor(booking.id, vendor, booking.eventId)}
                                                                disabled={vendorActionLoading}
                                                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-between disabled:opacity-50">
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {vendor.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400">
                                                                        {vendor.serviceType}
                                                                    </p>
                                                                </div>
                                                                <p className="text-sm font-semibold text-indigo-600">
                                                                    {formatCurrency(vendor.price)}
                                                                </p>
                                                            </button>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )}

                                        {/* ── Primary vendor ───────── */}
                                        {event?.vendorName && (
                                            <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-xl mb-2">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {event.vendorName}
                                                    </p>
                                                    <p className="text-xs text-indigo-500 font-medium">
                                                        Primary · from event
                                                    </p>
                                                </div>
                                                <p className="text-sm font-bold text-indigo-600">
                                                    {formatCurrency(vendorPrice)}
                                                </p>
                                            </div>
                                        )}

                                        {/* ── Extra vendors ────────── */}
                                        {extras.map(vendor => (
                                            <div key={vendor.vendorId}
                                                className="flex items-center justify-between bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl mb-2">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {vendor.vendorName}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {vendor.serviceType}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-sm font-bold text-gray-700">
                                                        {formatCurrency(vendor.price)}
                                                    </p>
                                                    <button
                                                        onClick={() => handleRemoveVendor(booking.id, vendor.vendorId)}
                                                        disabled={vendorActionLoading}
                                                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-50">
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
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

export default AdminBudget;