const Venue = require('../models/Venue');

class VenueController {

    // ── Create Venue ──────────────────────────────────
    async createVenue(req, res, next) {
        try {
            const venue = new Venue(req.body);
            const saved = await venue.save();
            res.status(201).json(saved);
        } catch (error) {
            next(error);
        }
    }

    // ── Get All Venues ────────────────────────────────
    async getAllVenues(req, res, next) {
        try {
            const venues = await Venue.find();
            res.status(200).json(venues);
        } catch (error) {
            next(error);
        }
    }

    // ── Get Venue By Id ───────────────────────────────
    async getVenueById(req, res, next) {
        try {
            const venue = await Venue.findById(req.params.id);

            if (!venue) {
                const error = new Error('Venue not found with ID ' + req.params.id);
                error.name = 'VenueNotFound';
                return next(error);
            }

            res.status(200).json(venue);
        } catch (error) {
            next(error);
        }
    }

    // ── Get Venues By Status ──────────────────────────
    async getVenuesByStatus(req, res, next) {
        try {
            const venues = await Venue.find({ status: req.params.status });
            res.status(200).json(venues);
        } catch (error) {
            next(error);
        }
    }

    // ── Check Availability ────────────────────────────
    async checkAvailability(req, res, next) {
        try {
            const venue = await Venue.findById(req.params.id);

            if (!venue) {
                const error = new Error('Venue not found with ID ' + req.params.id);
                error.name = 'VenueNotFound';
                return next(error);
            }

            res.status(200).json({
                venueId: venue._id,
                venueName: venue.name,
                status: venue.status,
                isAvailable: venue.status === 'AVAILABLE'
            });
        } catch (error) {
            next(error);
        }
    }

    // ── Update Venue ──────────────────────────────────
    async updateVenue(req, res, next) {
        try {
            const venue = await Venue.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!venue) {
                const error = new Error('Venue not found with ID ' + req.params.id);
                error.name = 'VenueNotFound';
                return next(error);
            }

            res.status(200).json(venue);
        } catch (error) {
            next(error);
        }
    }

    // ── Update Venue Status (Internal) ───────────────
    async updateVenueStatus(req, res, next) {
        try {
            const venue = await Venue.findByIdAndUpdate(
                req.params.id,
                { status: req.body.status },
                { new: true, runValidators: true }
            );

            if (!venue) {
                const error = new Error('Venue not found with ID ' + req.params.id);
                error.name = 'VenueNotFound';
                return next(error);
            }

            res.status(200).json(venue);
        } catch (error) {
            next(error);
        }
    }

    // ── Delete Venue ──────────────────────────────────
    async deleteVenue(req, res, next) {
        try {
            const venue = await Venue.findByIdAndDelete(req.params.id);

            if (!venue) {
                const error = new Error('Venue not found with ID ' + req.params.id);
                error.name = 'VenueNotFound';
                return next(error);
            }

            res.status(200).json({
                message: 'Venue deleted successfully',
                deletedVenue: venue.name
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new VenueController();