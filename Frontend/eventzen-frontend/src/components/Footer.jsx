import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* ── Brand ──────────────────────── */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-bold text-lg inline-block mb-4">
                            EventZen
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            The all-in-one platform for managing events, tracking
                            attendees, and creating memorable experiences.
                        </p>
                    </div>

                    {/* ── Quick Links ────────────────── */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/"
                                    className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/events"
                                    className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Browse Events
                                </Link>
                            </li>
                            <li>
                                <Link to="/register"
                                    className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link to="/login"
                                    className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Sign In
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* ── Contact ────────────────────── */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                            Contact
                        </h3>
                        <ul className="space-y-2">
                            <li className="text-gray-400 text-sm">
                                support@eventzen.com
                            </li>
                            <li className="text-gray-400 text-sm">
                                +91 90000 00000
                            </li>
                            <li className="text-gray-400 text-sm">
                                Bangalore, India
                            </li>
                        </ul>
                    </div>

                </div>

                {/* ── Bottom Bar ─────────────────────── */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © 2026 EventZen. All rights reserved.
                    </p>
                    <p className="text-gray-400 text-sm">
                        Powered by Deloitte
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
