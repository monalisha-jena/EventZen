const Vendor = require('../models/Vendor');

class VendorController {

    // ── Create Vendor ─────────────────────────────────
    async createVendor(req, res, next) {
        try {
            const vendor = new Vendor(req.body);
            const saved = await vendor.save();
            res.status(201).json(saved);
        } catch (error) {
            next(error);
        }
    }

    // ── Get All Vendors ───────────────────────────────
    async getAllVendors(req, res, next) {
        try {
            const vendors = await Vendor.find();
            res.status(200).json(vendors);
        } catch (error) {
            next(error);
        }
    }

    // ── Get Vendor By Id ──────────────────────────────
    async getVendorById(req, res, next) {
        try {
            const vendor = await Vendor.findById(req.params.id);

            if (!vendor) {
                const error = new Error('Vendor not found with ID ' + req.params.id);
                error.name = 'VendorNotFound';
                return next(error);
            }

            res.status(200).json(vendor);
        } catch (error) {
            next(error);
        }
    }

    // ── Get Vendors By Status ─────────────────────────
    async getVendorsByStatus(req, res, next) {
        try {
            const vendors = await Vendor.find({ status: req.params.status });
            res.status(200).json(vendors);
        } catch (error) {
            next(error);
        }
    }

    // ── Get Vendors By Service Type ───────────────────
    async getVendorsByServiceType(req, res, next) {
        try {
            const vendors = await Vendor.find({ serviceType: req.params.serviceType });
            res.status(200).json(vendors);
        } catch (error) {
            next(error);
        }
    }

    // ── Update Vendor ─────────────────────────────────
    async updateVendor(req, res, next) {
        try {
            const vendor = await Vendor.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!vendor) {
                const error = new Error('Vendor not found with ID ' + req.params.id);
                error.name = 'VendorNotFound';
                return next(error);
            }

            res.status(200).json(vendor);
        } catch (error) {
            next(error);
        }
    }

    // ── Update Vendor Status (Internal) ──────────────
    async updateVendorStatus(req, res, next) {
        try {
            const vendor = await Vendor.findByIdAndUpdate(
                req.params.id,
                { status: req.body.status },
                { new: true, runValidators: true }
            );

            if (!vendor) {
                const error = new Error('Vendor not found with ID ' + req.params.id);
                error.name = 'VendorNotFound';
                return next(error);
            }

            res.status(200).json(vendor);
        } catch (error) {
            next(error);
        }
    }

    // ── Delete Vendor ─────────────────────────────────
    async deleteVendor(req, res, next) {
        try {
            const vendor = await Vendor.findByIdAndDelete(req.params.id);

            if (!vendor) {
                const error = new Error('Vendor not found with ID ' + req.params.id);
                error.name = 'VendorNotFound';
                return next(error);
            }

            res.status(200).json({
                message: 'Vendor deleted successfully',
                deletedVendor: vendor.name
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new VendorController();
