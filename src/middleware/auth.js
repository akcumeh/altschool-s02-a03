const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    let token = null;
    const authHeader = req.headers.authorization;
    console.log(req.cookie);

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.userId;
        req.username = decoded.username;
        next();
    } catch (error) {
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        res.clearCookie('token');
        return res.redirect('/auth/login');
    }
};

module.exports = auth;
