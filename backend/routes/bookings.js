const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { verifyToken, requireRole } = require('../middleware/auth');

// Create booking (user)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { serviceId, mobileModel, issueDescription, date, time } = req.body;
    const svc = await Service.findById(serviceId);
    if (!svc) return res.status(400).json({ message: 'Service not found' });
    const booking = await Booking.create({
      userId: req.user.id,
      serviceId,
      mobileModel,
      issueDescription,
      date,
      time,
      status: 'Pending'
    });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bookings for current user
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('serviceId');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single booking (user or admin)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('serviceId');
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking (user can edit before in-progress; admin can update status)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    // Admin can update status freely
    if (req.user.role === 'admin') {
      if (req.body.status) booking.status = req.body.status;
      // allow other admin edits if desired
      await booking.save();
      return res.json(booking);
    }
    // User can modify only if they own the booking and it's still Pending
    if (booking.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    if (booking.status !== 'Pending') return res.status(400).json({ message: 'Cannot edit booking once in progress or completed' });
    const allowed = ['mobileModel', 'issueDescription', 'date', 'time'];
    allowed.forEach(k => { if (req.body[k] !== undefined) booking[k] = req.body[k]; });
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking (user or admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    // soft-cancel or remove
    booking.status = 'Cancelled';
    await booking.save();
    res.json({ message: 'Cancelled', booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: view all bookings
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find().populate('serviceId').populate('userId');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
