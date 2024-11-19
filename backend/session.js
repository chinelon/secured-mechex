// used to verify session tokens

const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifySession = (req, res, next) => {
    // Get the session token from the request headers or query parameters
    const sessionToken = req.headers.authorization || req.query.token;

    // Check if the session token exists
    if (sessionToken) {
        try {
            // Verify the session token and extract the payload
            const secretKey = process.env.JWT_SECRET_KEY; // Access the secret key from environment variables
            const payload = jwt.verify(sessionToken, secretKey);
            req.session = payload; // Attach the session data to the request object
            next();
        } catch (error) {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = verifySession;
