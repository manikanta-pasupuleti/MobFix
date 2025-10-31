const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Simple auth middleware that extracts userId from JWT token
async function auth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    
    // Fetch user name for reviews
    const user = await User.findById(decoded.id);
    if (user) {
      req.userName = user.name || user.email || 'Anonymous User';
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Legacy auth object for backward compatibility
auth.verifyToken = auth;

auth.requireRole = (requiredRole) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== requiredRole) return res.status(403).json({ message: 'Forbidden' });
  next();
};

module.exports = auth;
