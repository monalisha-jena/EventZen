import axios from "axios";

const VENUE_BASE_URL = "http://localhost:3000";

// ── Get All Venues ────────────────────────────────

//for admin pages
export const getAllVenues = async () => {
    const res = await axios.get("http://localhost:3000/venues");
    return res.data;
};

//for dropdown ONLY
export const getAvailableVenues = async () => {
    const res = await axios.get("http://localhost:3000/venues/status/AVAILABLE");
    return res.data;
};

// ── Get Venue By Id ───────────────────────────────
export const getVenueById = async (id) => {
    const response = await axios.get(`${VENUE_BASE_URL}/venues/${id}`);
    return response.data;
};

// ── Get Venues By Status ──────────────────────────
export const getVenuesByStatus = async (status) => {
    const response = await axios.get(`${VENUE_BASE_URL}/venues/status/${status}`);
    return response.data;
};

// ── Check Venue Availability ──────────────────────
export const checkVenueAvailability = async (id) => {
    const response = await axios.get(`${VENUE_BASE_URL}/venues/${id}/availability`);
    return response.data;
};

// ── Create Venue ──────────────────────────────────
export const createVenue = async (data, token) => {
    const response = await axios.post(`${VENUE_BASE_URL}/venues`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ── Update Venue ──────────────────────────────────
export const updateVenue = async (id, data, token) => {
    const response = await axios.put(`${VENUE_BASE_URL}/venues/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ── Delete Venue ──────────────────────────────────
export const deleteVenue = async (id, token) => {
    const response = await axios.delete(`${VENUE_BASE_URL}/venues/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ── Get All Vendors ───────────────────────────────

//for admin pages
export const getAllVendors = async () => {
    const res = await axios.get("http://localhost:3000/vendors");
    return res.data;
};

//for dropdown ONLY
export const getAvailableVendors = async () => {
    const res = await axios.get("http://localhost:3000/vendors/status/AVAILABLE");
    return res.data;
};

// ── Get Vendor By Id ──────────────────────────────
export const getVendorById = async (id) => {
    const response = await axios.get(`${VENUE_BASE_URL}/vendors/${id}`);
    return response.data;
};

// ── Get Vendors By Service Type ───────────────────
export const getVendorsByServiceType = async (serviceType) => {
    const response = await axios.get(`${VENUE_BASE_URL}/vendors/serviceType/${serviceType}`);
    return response.data;
};

// ── Create Vendor ─────────────────────────────────
export const createVendor = async (data, token) => {
    const response = await axios.post(`${VENUE_BASE_URL}/vendors`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ── Update Vendor ─────────────────────────────────
export const updateVendor = async (id, data, token) => {
    const response = await axios.put(`${VENUE_BASE_URL}/vendors/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ── Delete Vendor ─────────────────────────────────
export const deleteVendor = async (id, token) => {
    const response = await axios.delete(`${VENUE_BASE_URL}/vendors/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ── Get Booking Vendors ───────────────────────────
export const getBookingVendors = async (bookingId, token) => {
    const response = await axios.get(`${VENUE_BASE_URL}/booking-vendors/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Add Vendor To Booking ─────────────────────────
export const addVendorToBooking = async (bookingId, data, token) => {
    const response = await axios.post(`${VENUE_BASE_URL}/booking-vendors/${bookingId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ── Remove Vendor From Booking ────────────────────
export const removeVendorFromBooking = async (bookingId, vendorId, token) => {
    const response = await axios.delete(`${VENUE_BASE_URL}/booking-vendors/${bookingId}/${vendorId}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};