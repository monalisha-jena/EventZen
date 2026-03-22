import axios from "axios";

const EVENT_BASE_URL = "http://localhost:8082";

// ── Get All Events ────────────────────────────────
export const getAllEvents = async () => {
    const response = await axios.get(`${EVENT_BASE_URL}/events`);
    return response.data;
};

// ── Get Event By Id ───────────────────────────────
export const getEventById = async (id) => {
    const response = await axios.get(`${EVENT_BASE_URL}/events/${id}`);
    return response.data;
};

// ── Get Events By Status ──────────────────────────
export const getEventsByStatus = async (status) => {
    const response = await axios.get(`${EVENT_BASE_URL}/events/status/${status}`);
    return response.data;
};

// ── Get Events By Category ────────────────────────
export const getEventsByCategory = async (category) => {
    const response = await axios.get(`${EVENT_BASE_URL}/events/category/${category}`);
    return response.data;
};

// ── Create Event ──────────────────────────────────
export const createEvent = async (data, token) => {
    const response = await axios.post(`${EVENT_BASE_URL}/events`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Update Event ──────────────────────────────────
export const updateEvent = async (id, data, token) => {
    const response = await axios.put(`${EVENT_BASE_URL}/events/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Delete Event ──────────────────────────────────
export const deleteEvent = async (id, token) => {
    const response = await axios.delete(`${EVENT_BASE_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Create Booking (Customer) ─────────────────────
export const createBooking = async (data, token) => {
    const response = await axios.post(`${EVENT_BASE_URL}/bookings`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Get My Bookings (Customer) ────────────────────
export const getMyBookings = async (token) => {
    const response = await axios.get(`${EVENT_BASE_URL}/bookings/my`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Cancel Booking (Customer) ─────────────────────
export const cancelBooking = async (id, token) => {
    const response = await axios.put(`${EVENT_BASE_URL}/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Get Registrations By Booking (Customer + Admin)
export const getRegistrationsByBookingId = async (bookingId, token) => {
    const response = await axios.get(`${EVENT_BASE_URL}/registrations/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Register For Booking (Attendee) ──────────────
export const registerForBooking = async (data, token) => {
    const response = await axios.post(`${EVENT_BASE_URL}/registrations`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Get My Registrations (Attendee) ──────────────
export const getMyRegistrations = async (token) => {
    const response = await axios.get(`${EVENT_BASE_URL}/registrations/my`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Cancel Registration (Attendee) ────────────────
export const cancelRegistration = async (id, token) => {
    const response = await axios.put(`${EVENT_BASE_URL}/registrations/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Get All Bookings (Admin) ──────────────────────
export const getAllBookings = async (token) => {
    const response = await axios.get(`${EVENT_BASE_URL}/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Approve Booking (Admin) ───────────────────────
export const approveBooking = async (id, token) => {
    const response = await axios.put(`${EVENT_BASE_URL}/admin/bookings/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Reject Booking (Admin) ────────────────────────
export const rejectBooking = async (id, token) => {
    const response = await axios.put(`${EVENT_BASE_URL}/admin/bookings/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Get All Registrations For Event (Admin) ───────
export const getRegistrationsByEventId = async (eventId, token) => {
    const response = await axios.get(`${EVENT_BASE_URL}/admin/registrations/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Get Approved Bookings (Attendee) ──────────────
export const getApprovedBookings = async (token) => {
    const response = await axios.get(`${EVENT_BASE_URL}/bookings/approved`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Backward compatibility alias ──────────────────
export const registerForEvent = registerForBooking;