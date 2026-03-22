const jwt = require('jsonwebtoken');

// ── Verify Token ──────────────────────────────────
const verifyToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 401,
            error: 'Unauthorized',
            message: 'No token provided'
        });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: 401,
            error: 'Unauthorized',
            message: 'Invalid or expired token'
        });
    }
};

// ── Verify Admin ──────────────────────────────────
const verifyAdmin = (req, res, next) => {

    verifyToken(req, res, () => {
        if (req.user.role === 'ADMIN') {
            next();
        } else {
            return res.status(403).json({
                status: 403,
                error: 'Access Denied',
                message: 'You do not have permission to perform this action'
            });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };
