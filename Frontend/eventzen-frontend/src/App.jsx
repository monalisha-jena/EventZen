import { Routes, Route } from "react-router-dom";

// ── Common Components ─────────────────────────────
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ProtectedRoute, AdminRoute, CustomerRoute, AttendeeRoute } from "./components/ProtectedRoute";

// ── Auth Pages ────────────────────────────────────
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ── Attendee Pages ────────────────────────────────
import Home from "./pages/attendee/Home";
import EventList from "./pages/attendee/EventList";
import EventDetail from "./pages/attendee/EventDetail";
import MyRegistrations from "./pages/attendee/MyRegistrations";
import BrowseBookings from "./pages/attendee/BrowseBookings";

// ── Customer Pages ────────────────────────────────
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import MyBookings from "./pages/customer/MyBookings";

// ── Admin Pages ───────────────────────────────────
import AdminBudget from "./pages/admin/AdminBudget";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageVenues from "./pages/admin/ManageVenues";
import ManageVendors from "./pages/admin/ManageVendors";
import ManageBookings from "./pages/admin/ManageBookings";

// ── Common Pages ──────────────────────────────────
import NotFound from "./pages/common/NotFound";
import Unauthorized from "./pages/common/Unauthorized";

const App = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            <Navbar />

            <main className="flex-grow">
                <Routes>

                    {/* ── Public Routes ───────────────── */}
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<EventList />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* ── Attendee Routes ─────────────── */}
                    <Route path="/my-registrations" element={
                        <AttendeeRoute>
                            <MyRegistrations />
                        </AttendeeRoute>
                    } />

                    <Route path="/browse-bookings" element={
                        <AttendeeRoute>
                            <BrowseBookings />
                        </AttendeeRoute>
                    } />

                    {/* ── Customer Routes ─────────────── */}
                    <Route path="/customer" element={
                        <CustomerRoute>
                            <CustomerDashboard />
                        </CustomerRoute>
                    } />
                    <Route path="/my-bookings" element={
                        <CustomerRoute>
                            <MyBookings />
                        </CustomerRoute>
                    } />

                    {/* ── Admin Routes ────────────────── */}
                    <Route path="/admin/budget" element={
                        <AdminRoute>
                            <AdminBudget />
                        </AdminRoute>
                    } />
                    <Route path="/admin" element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    } />
                    <Route path="/admin/events" element={
                        <AdminRoute>
                            <ManageEvents />
                        </AdminRoute>
                    } />
                    <Route path="/admin/venues" element={
                        <AdminRoute>
                            <ManageVenues />
                        </AdminRoute>
                    } />
                    <Route path="/admin/vendors" element={
                        <AdminRoute>
                            <ManageVendors />
                        </AdminRoute>
                    } />
                    <Route path="/admin/bookings" element={
                        <AdminRoute>
                            <ManageBookings />
                        </AdminRoute>
                    } />

                    {/* ── Common Routes ───────────────── */}
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="*" element={<NotFound />} />

                </Routes>
            </main>

            <Footer />

        </div>
    );
};

export default App;