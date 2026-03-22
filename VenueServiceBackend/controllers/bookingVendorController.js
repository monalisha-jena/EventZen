const BookingVendor = require('../models/BookingVendor');

// ── Get Vendors For Booking ───────────────────────
const getBookingVendors = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const record = await BookingVendor.findOne({ bookingId: Number(bookingId) });
        if (!record) {
            return res.status(200).json({ bookingId, vendors: [] });
        }
        res.status(200).json(record);
    } catch (err) {
        next(err);
    }
};

// ── Add Vendor To Booking ─────────────────────────
const addVendorToBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const { eventId, vendorId, vendorName, serviceType, price } = req.body;

        let record = await BookingVendor.findOne({ bookingId: Number(bookingId) });

        if (!record) {
            record = new BookingVendor({
                bookingId: Number(bookingId),
                eventId: Number(eventId),
                vendors: []
            });
        }

        // Check if vendor already added
        const alreadyExists = record.vendors.find(v => v.vendorId === vendorId);
        if (alreadyExists) {
            return res.status(400).json({ message: 'Vendor already added to this booking' });
        }

        record.vendors.push({ vendorId, vendorName, serviceType, price });
        await record.save();

        res.status(200).json(record);
    } catch (err) {
        next(err);
    }
};

// ── Remove Vendor From Booking ────────────────────
const removeVendorFromBooking = async (req, res, next) => {
    try {
        const { bookingId, vendorId } = req.params;

        const record = await BookingVendor.findOne({ bookingId: Number(bookingId) });
        if (!record) {
            return res.status(404).json({ message: 'No vendors found for this booking' });
        }

        record.vendors = record.vendors.filter(v => v.vendorId !== vendorId);
        await record.save();

        res.status(200).json(record);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getBookingVendors,
    addVendorToBooking,
    removeVendorFromBooking
};