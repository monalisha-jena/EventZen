const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// ── Public Routes ─────────────────────────────────
router.get('/', vendorController.getAllVendors);
router.get('/status/:status', vendorController.getVendorsByStatus);
router.get('/serviceType/:serviceType', vendorController.getVendorsByServiceType);
router.get('/:id', vendorController.getVendorById);

// ── Internal Service Route (no auth) ─────────────
router.patch('/internal/:id/status', vendorController.updateVendorStatus);

// ── Admin Only Routes ─────────────────────────────
router.post('/', verifyAdmin, vendorController.createVendor);
router.put('/:id', verifyAdmin, vendorController.updateVendor);
router.delete('/:id', verifyAdmin, vendorController.deleteVendor);

module.exports = router;