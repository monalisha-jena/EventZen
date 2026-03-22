import axios from "axios";

const AUTH_BASE_URL = "http://localhost:8081";

// ── Register Attendee ─────────────────────────────
export const registerUser = async (data) => {
    const response = await axios.post(`${AUTH_BASE_URL}/auth/register`, data);
    return response.data;
};

// ── Register Admin ────────────────────────────────
export const registerAdmin = async (data, adminSecret) => {
    const response = await axios.post(`${AUTH_BASE_URL}/auth/register/admin`, data, {
        headers: {
            "Admin-Secret": adminSecret
        }
    });
    return response.data;
};

// ── Login ─────────────────────────────────────────
export const loginUser = async (data) => {
    const response = await axios.post(`${AUTH_BASE_URL}/auth/login`, data);
    return response.data;
};

// ── Logout ────────────────────────────────────────
export const logoutUser = async (token) => {
    const response = await axios.post(`${AUTH_BASE_URL}/auth/logout`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ── Get User By Id ────────────────────────────────
export const getUserById = async (id, token) => {
    const response = await axios.get(`${AUTH_BASE_URL}/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ── Update User ───────────────────────────────────
export const updateUser = async (id, data, token) => {
    const response = await axios.put(`${AUTH_BASE_URL}/users/update/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

// ── Delete User ───────────────────────────────────
export const deleteUser = async (id, token) => {
    const response = await axios.delete(`${AUTH_BASE_URL}/users/delete/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};