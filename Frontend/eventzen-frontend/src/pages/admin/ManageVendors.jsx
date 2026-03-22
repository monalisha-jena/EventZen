import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllVendors, createVendor, updateVendor, deleteVendor } from "../../api/venueApi";

const ManageVendors = () => {
    const { token } = useAuth();

    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        serviceType: "CATERING",
        price: "",
        description: "",
        status: "AVAILABLE"
    });

    // ── Fetch Vendors ─────────────────────────────────
    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchVendors = async () => {
        try {
            const data = await getAllVendors();
            setVendors(data);
        } catch (err) {
            setError("Failed to load vendors");
        } finally {
            setLoading(false);
        }
    };

    // ── Handle Form Change ────────────────────────────
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ── Handle Edit ───────────────────────────────────
    const handleEdit = (vendor) => {
        setEditingVendor(vendor);
        setFormData({
            name: vendor.name,
            email: vendor.email,
            phone: vendor.phone,
            serviceType: vendor.serviceType,
            price: vendor.price,
            description: vendor.description,
            status: vendor.status
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
                price: parseFloat(formData.price)
            };

            if (editingVendor) {
                await updateVendor(editingVendor._id, payload, token);
                setSuccess("Vendor updated successfully");
            } else {
                await createVendor(payload, token);
                setSuccess("Vendor created successfully");
            }

            setShowForm(false);
            setEditingVendor(null);
            setFormData({
                name: "", email: "", phone: "",
                serviceType: "CATERING", price: "",
                description: "", status: "AVAILABLE"
            });
            fetchVendors();

        } catch (err) {
            setError(err.response?.data?.message || "Operation failed");
        } finally {
            setFormLoading(false);
        }
    };

    // ── Handle Delete ─────────────────────────────────
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this vendor?")) return;
        setDeleteLoading(id);
        try {
            await deleteVendor(id, token);
            setSuccess("Vendor deleted successfully");
            fetchVendors();
        } catch (err) {
            setError("Failed to delete vendor");
        } finally {
            setDeleteLoading(null);
        }
    };

    // ── Get Status Color ──────────────────────────────
    const getStatusColor = (status) => {
        switch (status) {
            case "AVAILABLE": return "bg-green-100 text-green-700";
            case "OCCUPIED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    // ── Get Service Color ─────────────────────────────
    const getServiceColor = (service) => {
        switch (service) {
            case "CATERING": return "bg-orange-100 text-orange-700";
            case "AV": return "bg-blue-100 text-blue-700";
            case "PHOTOGRAPHY": return "bg-pink-100 text-pink-700";
            case "DECORATION": return "bg-purple-100 text-purple-700";
            case "SECURITY": return "bg-gray-100 text-gray-700";
            case "TRANSPORT": return "bg-teal-100 text-teal-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Header ───────────────────────── */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Vendors</h1>
                        <p className="text-gray-500 mt-1">Add and manage event vendors</p>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(!showForm);
                            setEditingVendor(null);
                            setFormData({
                                name: "", email: "", phone: "",
                                serviceType: "CATERING", price: "",
                                description: "", status: "AVAILABLE"
                            });
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {showForm ? "Cancel" : "Add Vendor"}
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
                            {editingVendor ? "Edit Vendor" : "Add New Vendor"}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" name="name" value={formData.name}
                                    onChange={handleChange} required placeholder="SpiceBox Catering"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" name="email" value={formData.email}
                                    onChange={handleChange} required placeholder="vendor@gmail.com"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="text" name="phone" value={formData.phone}
                                    onChange={handleChange} required placeholder="9876543210"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                                <select name="serviceType" value={formData.serviceType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="CATERING">Catering</option>
                                    <option value="AV">AV Equipment</option>
                                    <option value="PHOTOGRAPHY">Photography</option>
                                    <option value="DECORATION">Decoration</option>
                                    <option value="SECURITY">Security</option>
                                    <option value="TRANSPORT">Transport</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input type="number" name="price" value={formData.price}
                                    onChange={handleChange} required min="0" placeholder="50000"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="AVAILABLE">Available</option>
                                    <option value="OCCUPIED">Occupied</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea name="description" value={formData.description}
                                    onChange={handleChange} required rows={3}
                                    placeholder="Describe the vendor services..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                            </div>

                            <div className="md:col-span-2 flex gap-3">
                                <button type="submit" disabled={formLoading}
                                    className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50">
                                    {formLoading ? "Saving..." : editingVendor ? "Update Vendor" : "Add Vendor"}
                                </button>
                                <button type="button"
                                    onClick={() => { setShowForm(false); setEditingVendor(null); }}
                                    className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                    Cancel
                                </button>
                            </div>

                        </form>
                    </div>
                )}

                {/* ── Vendors Grid ──────────────────── */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : vendors.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                        <p className="text-gray-500">No vendors yet. Add your first vendor!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vendors.map((vendor) => (
                            <div key={vendor._id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{vendor.name}</h3>
                                        <p className="text-sm text-gray-500">{vendor.email}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(vendor.status)}`}>
                                        {vendor.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getServiceColor(vendor.serviceType)}`}>
                                        {vendor.serviceType}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">
                                        ₹{vendor.price?.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{vendor.description}</p>
                                <p className="text-sm text-gray-500 mb-4">{vendor.phone}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(vendor)}
                                        className="flex-1 text-center text-sm text-indigo-600 border border-indigo-200 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors font-medium">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(vendor._id)}
                                        disabled={deleteLoading === vendor._id}
                                        className="flex-1 text-center text-sm text-red-600 border border-red-200 py-1.5 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50">
                                        {deleteLoading === vendor._id ? "..." : "Delete"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default ManageVendors;