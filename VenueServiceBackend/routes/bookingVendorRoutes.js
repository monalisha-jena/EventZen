const express = require('express');
const router = express.Router();
const bookingVendorController = require('../controllers/bookingVendorController');
const { verifyAdmin } = require('../middleware/authMiddleware');

// ── Admin Only Routes ─────────────────────────────
router.get('/:bookingId', verifyAdmin, bookingVendorController.getBookingVendors);
router.post('/:bookingId', verifyAdmin, bookingVendorController.addVendorToBooking);
router.delete('/:bookingId/:vendorId', verifyAdmin, bookingVendorController.removeVendorFromBooking);

module.exports = router;