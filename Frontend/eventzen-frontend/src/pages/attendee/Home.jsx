import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllEvents } from "../../api/eventApi";

const Home = () => {
    const { isLoggedIn } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getAllEvents();
                setEvents(data.slice(0, 3));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "UPCOMING":  return "bg-green-100 text-green-700";
            case "ONGOING":   return "bg-blue-100 text-blue-700";
            case "COMPLETED": return "bg-gray-100 text-gray-700";
            case "CANCELLED": return "bg-red-100 text-red-700";
            default:          return "bg-gray-100 text-gray-700";
        }
    };

    const getAvailabilityColor = (current, max) => {
        const pct = (current / max) * 100;
        if (pct >= 90) return "bg-red-500";
        if (pct >= 70) return "bg-amber-500";
        return "bg-indigo-500";
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <style>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(36px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                .anim-1 { animation: slide-up 0.7s cubic-bezier(0.16,1,0.3,1) both; }
                .anim-2 { animation: slide-up 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) both; }
                .anim-3 { animation: slide-up 0.7s 0.2s cubic-bezier(0.16,1,0.3,1) both; }
                .anim-4 { animation: slide-up 0.7s 0.3s cubic-bezier(0.16,1,0.3,1) both; }
                .shimmer-text {
                    background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #6366f1);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 3s linear infinite;
                }
                .card-lift {
                    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease;
                }
                .card-lift:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 48px rgba(99,102,241,0.12);
                }
                .btn-glow {
                    transition: all 0.25s ease;
                }
                .btn-glow:hover {
                    box-shadow: 0 8px 24px rgba(99,102,241,0.25);
                    transform: translateY(-1px);
                }
            `}</style>

            {/* ── Hero ─────────────────────────────── */}
            <section className="border-b border-gray-100 py-24 px-4" style={{ background: "linear-gradient(135deg, #dbeafe 0%, #ede9fe 40%, #ffffff 100%)" }}>

                <div className="max-w-4xl mx-auto text-center">

                    {/* Badge */}
                    <div className="anim-1 inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
                        <span className="text-xs text-indigo-600 font-semibold tracking-wide uppercase">
                            Modern Event Management
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="anim-2 text-5xl md:text-7xl font-bold text-gray-900 leading-[1.05] tracking-tight mb-6">
                        Where Events
                        <br />
                        <span className="shimmer-text">Come Alive</span>
                    </h1>

                    {/* Subline */}
                    <p className="anim-3 text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
                        Discover, book, and experience extraordinary events.
                        One platform for organizers, customers, and attendees.
                    </p>

                    {/* CTAs */}
                    <div className="anim-4 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/events"
                            className="btn-glow bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-base hover:bg-indigo-700 inline-block transition-colors">
                            Browse Events
                        </Link>
                        {!isLoggedIn() && (
                            <Link to="/register"
                                className="bg-white text-indigo-600 border-2 border-indigo-200 px-8 py-3 rounded-xl font-semibold text-base hover:border-indigo-400 hover:bg-indigo-50 inline-block transition-all duration-200">
                                Get Started Free →
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* ── Stats ────────────────────────────── */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-indigo-700 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-indigo-400/40">
                        {[
                            { value: "10K+", label: "Events Managed" },
                            { value: "500K+", label: "Happy Attendees" },
                            { value: "20+", label: "Venues Listed" },
                            { value: "99.9%", label: "Platform Uptime" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center px-4 py-2">
                                <p className="text-3xl md:text-4xl font-bold text-white mb-1">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-indigo-200 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works ─────────────────────── */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-semibold text-indigo-500 tracking-widest uppercase mb-3">
                            How It Works
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Three roles.{" "}
                            <span className="text-gray-300">One seamless flow.</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                step: "01",
                                role: "Admin",
                                icon: (
                                    <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                    </svg>
                                ),
                                iconBg: "bg-rose-50",
                                accent: "text-rose-500",
                                title: "Set the Stage",
                                desc: "Create venues, onboard vendors, launch events, and approve bookings with full control.",
                            },
                            {
                                step: "02",
                                role: "Customer",
                                icon: (
                                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                ),
                                iconBg: "bg-indigo-50",
                                accent: "text-indigo-500",
                                title: "Book & Organise",
                                desc: "Browse events, submit booking requests, and track your event portfolio in real time.",
                            },
                            {
                                step: "03",
                                role: "Attendee",
                                icon: (
                                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ),
                                iconBg: "bg-emerald-50",
                                accent: "text-emerald-500",
                                title: "Register & Attend",
                                desc: "Browse approved bookings, secure your spot, and auto-upgrade from the waitlist.",
                            },
                        ].map((item, i) => (
                            <div key={i}
                                className="card-lift bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                                <span className="absolute top-4 right-5 text-5xl font-bold text-gray-100 select-none leading-none">
                                    {item.step}
                                </span>
                                <div className={`w-11 h-11 ${item.iconBg} rounded-xl flex items-center justify-center mb-5`}>
                                    {item.icon}
                                </div>
                                <p className={`text-xs font-bold tracking-widest uppercase ${item.accent} mb-2`}>
                                    {item.role}
                                </p>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Events ───────────────────── */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <p className="text-xs font-semibold text-indigo-500 tracking-widest uppercase mb-2">
                                Live Now
                            </p>
                            <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
                            <p className="text-gray-400 mt-1 text-sm">Discover upcoming events near you</p>
                        </div>
                        <Link to="/events"
                            className="group text-sm text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition-colors">
                            View all
                            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
                            ))}
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">No events yet.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <div key={event.id}
                                    className="card-lift bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

                                    {/* Card header — same as original */}
                                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-32 flex items-center justify-center relative">
                                        <span className="text-white text-5xl font-bold opacity-20 select-none">
                                            {event.title?.charAt(0)}
                                        </span>
                                        <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(event.status)}`}>
                                            {event.status}
                                        </span>
                                        <span className="absolute top-3 left-3 bg-white text-indigo-600 text-xs px-2 py-1 rounded-full font-medium">
                                            {event.category}
                                        </span>
                                    </div>

                                    {/* Card body */}
                                    <div className="p-5">
                                        <h3 className="font-semibold text-gray-900 text-base mb-3 leading-snug">
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
                                                {event.venueName || "Venue TBD"}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {event.currentCount} / {event.maxCapacity} attendees
                                            </p>
                                        </div>

                                        {/* Availability bar */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                <span>Availability</span>
                                                <span>{Math.round((event.currentCount / event.maxCapacity) * 100)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                <div
                                                    className={`h-1.5 rounded-full ${getAvailabilityColor(event.currentCount, event.maxCapacity)}`}
                                                    style={{ width: `${Math.min(100, (event.currentCount / event.maxCapacity) * 100)}%` }} />
                                            </div>
                                        </div>

                                        <Link to={`/events/${event.id}`}
                                            className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ── Features ─────────────────────────── */}
            <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-semibold text-indigo-500 tracking-widest uppercase mb-3">
                            Why EventZen
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Built for every{" "}
                            <span className="text-gray-300">role in the room.</span>
                        </h2>
                        <p className="text-gray-400 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
                            Whether you're managing logistics, organising an experience, or seeking your next event — EventZen covers every role end to end.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { icon: "📋", title: "Smart Booking Flow",     desc: "Customers request, admins approve — clean and controlled.",          bg: "bg-indigo-50",  border: "border-indigo-100" },
                            { icon: "⚡", title: "Auto Waitlist Upgrade",  desc: "Attendees waitlisted automatically and promoted when a spot opens.", bg: "bg-emerald-50", border: "border-emerald-100" },
                            { icon: "🎯", title: "Role-Based Access",      desc: "Each user sees exactly what they need — nothing more.",              bg: "bg-rose-50",    border: "border-rose-100" },
                            { icon: "🏛", title: "Venue & Vendor Hub",     desc: "Manage venues and vendors with real-time availability.",             bg: "bg-amber-50",   border: "border-amber-100" },
                        ].map((f, i) => (
                            <div key={i}
                                className={`card-lift bg-white border ${f.border} rounded-2xl p-5 shadow-sm`}>
                                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center text-xl mb-4`}>
                                    {f.icon}
                                </div>
                                <h4 className="font-semibold text-gray-900 text-sm mb-1.5">{f.title}</h4>
                                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────── */}
            {!isLoggedIn() && (
                <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                            Your next great event starts here.
                        </h2>
                        <p className="text-indigo-100 mb-8 text-sm leading-relaxed max-w-md mx-auto">
                            Join EventZen today and experience a smarter way to manage, book, and attend events.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register"
                                className="btn-glow bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors inline-block">
                                Create Account
                            </Link>
                            <Link to="/events"
                                className="bg-white/10 border border-white/20 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors inline-block">
                                Browse Events
                            </Link>
                        </div>
                    </div>
                </section>
            )}

        </div>
    );
};

export default Home;