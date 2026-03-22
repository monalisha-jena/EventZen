import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllVenues, createVenue, updateVenue, deleteVenue } from "../../api/venueApi";

const ManageVenues = () => {
    const { token } = useAuth();

    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingVenue, setEditingVenue] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        capacity: "",
        description: "",
        amenities: "",
        image_url: "",
        status: "AVAILABLE"
    });

    // ── Fetch Venues ──────────────────────────────────
    useEffect(() => {
        fetchVenues();
    }, []);

    const fetchVenues = async () => {
        try {
            const data = await getAllVenues();
            setVenues(data);
        } catch (err) {
            setError("Failed to load venues");
        } finally {
            setLoading(false);
        }
    };

    // ── Handle Form Change ────────────────────────────
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ── Handle Edit ───────────────────────────────────
    const handleEdit = (venue) => {
        setEditingVenue(venue);
        setFormData({
            name: venue.name,
            address: venue.address,
            city: venue.city,
            capacity: venue.capacity,
            description: venue.description,
            amenities: venue.amenities || "",
            image_url: venue.image_url || "",
            status: venue.status
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
                capacity: parseInt(formData.capacity)
            };

            if (editingVenue) {
                await updateVenue(editingVenue._id, payload, token);
                setSuccess("Venue updated successfully");
            } else {
                await createVenue(payload, token);
                setSuccess("Venue created successfully");
            }

            setShowForm(false);
            setEditingVenue(null);
            setFormData({
                name: "",
                address: "",
                city: "",
                capacity: "",
                description: "",
                amenities: "",
                image_url: "",
                status: "AVAILABLE"
            });
            await fetchVenues();

        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
        } finally {
            setFormLoading(false);
        }
    };

    // ── Handle Delete ─────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this venue?")) return;
        setDeleteLoading(id);
        try {
            await deleteVenue(id, token);
            setSuccess("Venue deleted successfully");
            fetchVenues();
        } catch (err) {
            setError("Failed to delete venue");
        } finally {
            setDeleteLoading(null);
        }
    };

    // ── Get Status Color ──────────────────────────────
    const getStatusColor = (status) => {
        switch (status) {
            case "AVAILABLE": return "bg-green-100 text-green-700";
            case "OCCUPIED": return "bg-red-100 text-red-700";
            case "MAINTENANCE": return "bg-amber-100 text-amber-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Header ───────────────────────── */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Venues</h1>
                        <p className="text-gray-500 mt-1">Add and manage event venues</p>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditingVenue(null);
                            setFormData({
                                name: "", address: "", city: "",
                                capacity: "", description: "",
                                amenities: "", image_url: "", status: "AVAILABLE"
                            });
                        }}
                        className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {showForm ? "Cancel" : "Add Venue"}
                    </button>
                </div>

                {/* ── Success / Error ───────────────── */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                {/* ── Form ─────────────────────────── */}
                {showForm && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            {editingVenue ? "Edit Venue" : "Add New Venue"}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" name="name" value={formData.name}
                                    onChange={handleChange} required placeholder="Grand Hall"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input type="text" name="city" value={formData.city}
                                    onChange={handleChange} required placeholder="Bangalore"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input type="text" name="address" value={formData.address}
                                    onChange={handleChange} required placeholder="123 MG Road"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                <input type="number" name="capacity" value={formData.capacity}
                                    onChange={handleChange} required min="1" placeholder="200"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
                                <input type="text" name="amenities" value={formData.amenities}
                                    onChange={handleChange} placeholder="WiFi, Projector, AC"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="AVAILABLE">Available</option>
                                    <option value="OCCUPIED">Occupied</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input type="text" name="image_url" value={formData.image_url}
                                    onChange={handleChange} placeholder="https://..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea name="description" value={formData.description}
                                    onChange={handleChange} required rows={3}
                                    placeholder="Describe the venue..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                            </div>

                            <div className="md:col-span-2 flex gap-3">
                                <button type="submit" disabled={formLoading}
                                    className="bg-amber-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-amber-600 transition-colors disabled:opacity-50">
                                    {formLoading ? "Saving..." : editingVenue ? "Update Venue" : "Add Venue"}
                                </button>
                                <button type="button" onClick={() => { setShowForm(false); setEditingVenue(null); }}
                                    className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                    Cancel
                                </button>
                            </div>

                        </form>
                    </div>
                )}

                {/* ── Venues Grid ───────────────────── */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : venues.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <p className="text-gray-500">No venues yet. Add your first venue!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {venues.map((venue) => (
                            <div key={venue._id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="h-32 overflow-hidden">
                                    {venue.image_url ? (
                                        <img
                                            src={venue.image_url}
                                            alt={venue.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div
                                        className="bg-gradient-to-br from-amber-400 to-orange-500 h-32 items-center justify-center"
                                        style={{ display: venue.image_url ? 'none' : 'flex' }}>
                                        <span className="text-white text-4xl font-bold opacity-20">
                                            {venue.name?.charAt(0)}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(venue.status)}`}>
                                            {venue.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-1">{venue.address}, {venue.city}</p>
                                    <p className="text-sm text-gray-500 mb-3">Capacity: {venue.capacity}</p>
                                    {venue.amenities && (
                                        <p className="text-xs text-gray-400 mb-3">{venue.amenities}</p>
                                    )}
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(venue)}
                                            className="flex-1 text-center text-sm text-indigo-600 border border-indigo-200 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(venue._id)}
                                            disabled={deleteLoading === venue._id}
                                            className="flex-1 text-center text-sm text-red-600 border border-red-200 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50">
                                            {deleteLoading === venue._id ? "..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ManageVenues;