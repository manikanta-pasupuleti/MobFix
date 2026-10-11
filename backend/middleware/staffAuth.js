const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function staffAuth(req, res, next) {
  const header = req.headers.authorization || req.headers.Authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !['admin', 'technician'].includes(user.role) || !user.isActive) {
      return res.status(403).json({ message: 'Staff access required' });
    }
    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = staffAuth;
