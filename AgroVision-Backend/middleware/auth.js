// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  try {
    // token can come from Authorization header "Bearer <token>" or cookie
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'];
    }

    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('auth middleware error', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
