const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = {};

auth.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id and role
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

auth.requireRole = (requiredRole) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (req.user.role !== requiredRole) return res.status(403).json({ message: 'Forbidden' });
  next();
};

module.exports = auth;
