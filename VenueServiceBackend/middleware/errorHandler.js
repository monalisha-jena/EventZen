const errorHandler = (err, req, res, next) => {

    console.error(`[ERROR] ${err.message}`);

    // ── Mongoose Validation Error ─────────────────────
    if (err.name === 'ValidationError') {
        const messages = {};
        Object.keys(err.errors).forEach(key => {
            messages[key] = err.errors[key].message;
        });
        return res.status(400).json({
            timestamp: new Date(),
            status: 400,
            error: 'Validation Failed',
            messages: messages
        });
    }

    // ── Mongoose Duplicate Key Error ──────────────────
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(409).json({
            timestamp: new Date(),
            status: 409,
            error: 'Duplicate Entry',
            message: `${field} already exists`
        });
    }

    // ── Mongoose Cast Error (invalid id) ──────────────
    if (err.name === 'CastError') {
        return res.status(400).json({
            timestamp: new Date(),
            status: 400,
            error: 'Invalid ID',
            message: `Invalid value for ${err.path}`
        });
    }

    // ── Venue Not Found ───────────────────────────────
    if (err.name === 'VenueNotFound') {
        return res.status(404).json({
            timestamp: new Date(),
            status: 404,
            error: 'Venue Not Found',
            message: err.message
        });
    }

    // ── Vendor Not Found ──────────────────────────────
    if (err.name === 'VendorNotFound') {
        return res.status(404).json({
            timestamp: new Date(),
            status: 404,
            error: 'Vendor Not Found',
            message: err.message
        });
    }

    // ── Generic Fallback ──────────────────────────────
    return res.status(500).json({
        timestamp: new Date(),
        status: 500,
        error: 'Internal Server Error',
        message: err.message
    });
};

module.exports = errorHandler;