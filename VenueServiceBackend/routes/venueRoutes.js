const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// ── Public Routes ─────────────────────────────────
router.get('/', venueController.getAllVenues);
router.get('/status/:status', venueController.getVenuesByStatus);
router.get('/:id', venueController.getVenueById);
router.get('/:id/availability', venueController.checkAvailability);

// ── Internal Service Route (no auth) ─────────────
router.patch('/internal/:id/status', venueController.updateVenueStatus);

// ── Admin Only Routes ─────────────────────────────
router.post('/', verifyAdmin, venueController.createVenue);
router.put('/:id', verifyAdmin, venueController.updateVenue);
router.delete('/:id', verifyAdmin, venueController.deleteVenue);

module.exports = router;