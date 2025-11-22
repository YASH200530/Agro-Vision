const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Access token from cookies
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user payload (id) to the request object
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;