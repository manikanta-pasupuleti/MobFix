const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const bcrypt = require('bcrypt');

// Simple admin management endpoints. Admin auth is via User role 'admin' or separate Admin model.
// For simplicity, we'll allow listing admins (no public access). In production, lock these down.

// List customers
router.get('/customers', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// View all bookings
router.get('/bookings', async (req, res) => {
  const bookings = await Booking.find().populate('serviceId').populate('userId');
  res.json(bookings);
});

module.exports = router;
