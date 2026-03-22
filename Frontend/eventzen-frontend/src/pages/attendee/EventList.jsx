import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllEvents, getEventsByCategory, getEventsByStatus } from "../../api/eventApi";
import { useAuth } from "../../context/AuthContext"; 

const EventList = () => {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const { isCustomer, isLoggedIn } = useAuth();

    // ── Fetch Events ──────────────────────────────────
    useEffect(() => {
        fetchEvents();
    }, [selectedCategory, selectedStatus]);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            let data;
            if (selectedCategory !== "ALL") {
                data = await getEventsByCategory(selectedCategory);
            } else if (selectedStatus !== "ALL") {
                data = await getEventsByStatus(selectedStatus);
            } else {
                data = await getAllEvents();
            }
            setEvents(data);
        } catch (err) {
            setError("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    // ── Filter by search ──────────────────────────────
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        (event.venueName && event.venueName.toLowerCase().includes(search.toLowerCase()))
    );

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

    // ── Get Availability Color ────────────────────────
    const getAvailabilityColor = (current, max) => {
        const percentage = (current / max) * 100;
        if (percentage >= 90) return "bg-red-500";
        if (percentage >= 70) return "bg-amber-500";
        return "bg-indigo-500";
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ── Page Header ──────────────────────── */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Browse Events
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Discover and register for amazing events
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Search & Filter ───────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">

                    {/* ── Search Bar ────────────────── */}
                    <div className="relative mb-4">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search events by title or venue..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>

                    {/* ── Filters ───────────────────── */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    setSelectedStatus("ALL");
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="ALL">All Categories</option>
                                <option value="WORKSHOP">Workshop</option>
                                <option value="SEMINAR">Seminar</option>
                                <option value="CONFERENCE">Conference</option>
                                <option value="NETWORKING">Networking</option>
                                <option value="CULTURAL">Cultural</option>
                                <option value="SPORTS">Sports</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Status
                            </label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    setSelectedCategory("ALL");
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="ALL">All Status</option>
                                <option value="UPCOMING">Upcoming</option>
                                <option value="ONGOING">Ongoing</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setSelectedCategory("ALL");
                                    setSelectedStatus("ALL");
                                    setSearch("");
                                }}
                                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Results Count ─────────────────── */}
                <p className="text-sm text-gray-500 mb-4">
                    Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
                </p>

                {/* ── Events Grid ───────────────────── */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading events...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-500">{error}</div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No events found.</p>
                        <button
                            onClick={() => {
                                setSelectedCategory("ALL");
                                setSelectedStatus("ALL");
                                setSearch("");
                            }}
                            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <div key={event.id}
                                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">

                                {/* ── Card Header ────────── */}
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-36 flex items-center justify-center relative">
                                    <span className="text-white text-5xl font-bold opacity-20">
                                        {event.title?.charAt(0)}
                                    </span>
                                    <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(event.status)}`}>
                                        {event.status}
                                    </span>
                                    <span className="absolute top-3 left-3 bg-white text-indigo-600 text-xs px-2 py-1 rounded-full font-medium">
                                        {event.category}
                                    </span>
                                </div>

                                {/* ── Card Body ──────────── */}
                                <div className="p-5">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-3">
                                        {event.title}
                                    </h3>
                                    <div className="space-y-1.5 mb-4">
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            {formatDate(event.eventDate)}
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {event.venueName || event.venueId}
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {event.maxCapacity} attendees
                                        </p>
                                    </div>

                                    {/* ── Availability Bar ─── */}
                                    {isLoggedIn() && !isCustomer() && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Availability</span>
                                                <span>{Math.round((event.currentCount / event.maxCapacity) * 100)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full ${getAvailabilityColor(event.currentCount, event.maxCapacity)}`}
                                                    style={{ width: `${(event.currentCount / event.maxCapacity) * 100}%` }}>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <Link
                                        to={`/events/${event.id}`}
                                        className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                        View Details
                                    </Link>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventList;