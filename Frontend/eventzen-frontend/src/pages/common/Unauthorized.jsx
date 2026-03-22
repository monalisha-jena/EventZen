import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Unauthorized = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center">

                {/* ── 403 Number ───────────────────── */}
                <h1 className="text-9xl font-bold text-red-500 opacity-20">
                    403
                </h1>

                {/* ── Message ───────────────────────── */}
                <h2 className="text-3xl font-bold text-gray-900 mt-4">
                    Access Denied
                </h2>
                <p className="text-gray-500 mt-3 max-w-md mx-auto">
                    You do not have permission to access this page.
                    Please contact your administrator if you think
                    this is a mistake.
                </p>

                {/* ── Actions ───────────────────────── */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors">
                        Go Home
                    </button>
                    {!isLoggedIn() && (
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors">
                            Login
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Unauthorized;
