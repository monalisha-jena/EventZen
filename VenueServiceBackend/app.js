const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const venueRoutes = require('./routes/venueRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const bookingVendorRoutes = require('./routes/bookingVendorRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// ── Connect to MongoDB ────────────────────────────
connectDB();

// ── Middleware ────────────────────────────────────
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Admin-Secret']
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────
app.use('/venues', venueRoutes);
app.use('/vendors', vendorRoutes);
app.use('/booking-vendors', bookingVendorRoutes);

// ── Error Handler ─────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Venue Service running on port ${PORT}`);
});

module.exports = app;