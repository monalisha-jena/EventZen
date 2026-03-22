import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../api/authApi";

const Register = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // ── Handle Input Change ───────────────────────────
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ── Handle Submit ─────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await registerUser(formData);

            login(
                { name: response.name, email: formData.email, id: response.id },
                response.token,
                response.role
            );

            // ── Redirect based on role ─────────────────
            if (response.role === "CUSTOMER") {
                navigate("/customer");
            } else {
                navigate("/events");
            }

        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4">
            <div className="max-w-md w-full">

                {/* ── Card ─────────────────────────── */}
                <div className="bg-white rounded-2xl shadow-lg p-8">

                    {/* ── Header ───────────────────── */}
                    <div className="text-center mb-8">
                        <div className="bg-indigo-600 text-white px-3 py-1 rounded-lg font-bold text-lg inline-block mb-4">
                            EventZen
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Create Account
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Join EventZen today
                        </p>
                    </div>

                    {/* ── Error Message ─────────────── */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                            {error}
                        </div>
                    )}

                    {/* ── Form ─────────────────────── */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Monalisha Jena"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@gmail.com"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="9876543210"
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                Min 8 characters, one uppercase, one digit, one special character
                            </p>
                        </div>

                        {/* ── Role Dropdown ─────────── */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Register as
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white">
                                <option value="">-- Select your role --</option>
                                <option value="CUSTOMER">Customer</option>
                                <option value="ATTENDEE">Attendee</option>
                            </select>

                            {/* ── Role description ──── */}
                            {formData.role === "CUSTOMER" && (
                                <p className="text-xs text-indigo-600 mt-1 bg-indigo-50 px-3 py-1.5 rounded-lg">
                                    Browse and book events. Track your bookings and manage attendees.
                                </p>
                            )}
                            {formData.role === "ATTENDEE" && (
                                <p className="text-xs text-teal-600 mt-1 bg-teal-50 px-3 py-1.5 rounded-lg">
                                    Register for approved bookings and attend events.
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? "Creating account..." : "Get Started"}
                        </button>

                    </form>

                    {/* ── Footer ───────────────────── */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <Link to="/login"
                            className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Sign in
                        </Link>
                    </p>

                    {/* ── Admin note ────────────────── */}
                    <p className="text-center text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                        Admin accounts are provisioned internally.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Register;