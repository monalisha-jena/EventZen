import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllEvents, createEvent, updateEvent, deleteEvent } from "../../api/eventApi";
import { getAllVenues, getAllVendors } from "../../api/venueApi";


const ManageEvents = () => {
    const { token } = useAuth();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [venues, setVenues] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [venuesLoading, setVenuesLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        venueId: "",
        vendorId: "",
        eventDate: "",
        maxCapacity: "",
        category: "WORKSHOP"
    });

    // ── Fetch Events + Venues + Vendors ───────────────
    useEffect(() => {
        fetchEvents();
        fetchVenuesAndVendors();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await getAllEvents();
            setEvents(data);
        } catch (err) {
            setError("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    const fetchVenuesAndVendors = async () => {
        setVenuesLoading(true);
        try {
            const [venueData, vendorData] = await Promise.all([
                getAllVenues(),
                getAllVendors()
            ]);
            setVenues(venueData.filter(v => v.status === "AVAILABLE"));
            setVendors(vendorData.filter(v => v.status === "AVAILABLE"));
        } catch (err) {
            setError("Failed to load venues and vendors");
        } finally {
            setVenuesLoading(false);
        }
    };

    // ── Handle Form Change ────────────────────────────
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ── Handle Edit ───────────────────────────────────
    const handleEdit = (event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            venueId: event.venueId,
            vendorId: event.vendorId,
            eventDate: event.eventDate?.slice(0, 16),
            maxCapacity: event.maxCapacity,
            category: event.category
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ── Handle Submit ─────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = {
                ...formData,
                maxCapacity: parseInt(formData.maxCapacity),
                eventDate: new Date(formData.eventDate).toISOString()
            };

            if (editingEvent) {
                await updateEvent(editingEvent.id, payload, token);
                setSuccess("Event updated successfully");
            } else {
                await createEvent(payload, token);
                setSuccess("Event created successfully");
            }

            setShowForm(false);
            setEditingEvent(null);
            setFormData({
                title: "",
                description: "",
                venueId: "",
                vendorId: "",
                eventDate: "",
                maxCapacity: "",
                category: "WORKSHOP"
            });
            fetchEvents();
            fetchVenuesAndVendors(); //added later

        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
        } finally {
            setFormLoading(false);
        }
    };

    // ── Handle Delete ─────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        setDeleteLoading(id);
        try {
            await deleteEvent(id, token);
            setSuccess("Event deleted successfully");
            fetchEvents();
            fetchVenuesAndVendors(); //added later
        } catch (err) {
            setError("Failed to delete event");
        } finally {
            setDeleteLoading(null);
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
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Manage Events
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Create and manage all events
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditingEvent(null);
                            setFormData({
                                title: "",
                                description: "",
                                venueId: "",
                                vendorId: "",
                                eventDate: "",
                                maxCapacity: "",
                                category: "WORKSHOP"
                            });
                        }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {showForm ? "Cancel" : "Create Event"}
                    </button>
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

                {/* ── Create / Edit Form ────────────── */}
                {showForm && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            {editingEvent ? "Edit Event" : "Create New Event"}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* ── Title ─────────────────── */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="ML Workshop"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* ── Venue Dropdown ────────── */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Venue
                                </label>
                                {venuesLoading ? (
                                    <div className="text-sm text-gray-500">Loading venues...</div>
                                ) : (
                                    <select
                                        name="venueId"
                                        value={formData.venueId}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                                        <option value="">-- Select a venue --</option>
                                        {venues.map((venue) => (
                                            <option key={venue._id} value={venue._id}>
                                                {venue.name} — {venue.city} (capacity: {venue.capacity})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* ── Vendor Dropdown ───────── */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Vendor
                                </label>
                                {venuesLoading ? (
                                    <div className="text-sm text-gray-500">Loading vendors...</div>
                                ) : (
                                    <select
                                        name="vendorId"
                                        value={formData.vendorId}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                                        <option value="">-- Select a vendor --</option>
                                        {vendors.map((vendor) => (
                                            <option key={vendor._id} value={vendor._id}>
                                                {vendor.name} — {vendor.serviceType} (₹{vendor.price})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* ── Event Date ────────────── */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Event Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* ── Max Capacity ──────────── */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Capacity
                                </label>
                                <input
                                    type="number"
                                    name="maxCapacity"
                                    value={formData.maxCapacity}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    placeholder="100"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* ── Category ──────────────── */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="WORKSHOP">Workshop</option>
                                    <option value="SEMINAR">Seminar</option>
                                    <option value="CONFERENCE">Conference</option>
                                    <option value="NETWORKING">Networking</option>
                                    <option value="CULTURAL">Cultural</option>
                                    <option value="SPORTS">Sports</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            {/* ── Description ───────────── */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    placeholder="Describe your event..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                />
                            </div>

                            {/* ── Buttons ───────────────── */}
                            <div className="md:col-span-2 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
                                    {formLoading
                                        ? "Saving..."
                                        : editingEvent ? "Update Event" : "Create Event"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingEvent(null);
                                    }}
                                    className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                    Cancel
                                </button>
                            </div>

                        </form>
                    </div>
                )}

                {/* ── Events Table ──────────────────── */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <p className="text-gray-500">No events yet. Create your first event!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{event.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {event.venueName || event.venueId}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{event.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{formatDate(event.eventDate)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">
                                                {event.currentCount}/{event.maxCapacity}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(event)}
                                                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event.id)}
                                                    disabled={deleteLoading === event.id}
                                                    className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50">
                                                    {deleteLoading === event.id ? "..." : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ManageEvents;