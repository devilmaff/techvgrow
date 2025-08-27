const User = require('../models/User');

// This middleware assumes the `auth` middleware has already run
const adminMiddleware = async (req, res, next) => {
    try {
        // req.user.id is attached by the auth middleware
        const user = await User.findById(req.user.id);

        if (user && user.role === 'admin') {
            next(); // User is an admin, proceed to the route
        } else {
            res.status(403).json({ msg: 'Forbidden: Access is denied.' });
        }
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

module.exports = adminMiddleware;