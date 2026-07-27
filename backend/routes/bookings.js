const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Create booking (auth required)
router.post('/', auth, async (req, res) => {
  try {
    const {
      serviceId,
      deviceBrand,
      deviceModel,
      imeiNumber,
      issueDescription,
      urgency,
      preferredDate,
      preferredTimeSlot,
      contactPhone,
      alternatePhone,
      notes
    } = req.body;

    if (!serviceId || !deviceBrand || !deviceModel || !issueDescription || !preferredDate || !preferredTimeSlot || !contactPhone) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(400).json({ message: 'Service not found' });

    const booking = await Booking.create({
      userId: req.userId,
      serviceId,
      deviceBrand,
      deviceModel,
      imeiNumber,
      issueDescription,
      urgency: urgency || 'Medium',
      preferredDate: new Date(preferredDate),
      preferredTimeSlot,
      contactPhone,
      alternatePhone,
      notes,
      estimatedCost: service.price,
      status: 'Pending'
    });

    await booking.populate('serviceId');
    res.status(201).json(booking);
  } catch (err) {
    console.error('Booking creation error:', err.message);
    res.status(500).json({
      message: 'Server error creating booking',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get current user's bookings
router.get('/mine', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate('serviceId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: view all bookings (admin only)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('serviceId')
      .populate('userId', '-password')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching all bookings:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single booking (ownership enforced)
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('serviceId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(booking);
  } catch (err) {
    console.error('Error fetching booking:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (booking.status === 'Completed' || booking.status === 'Cancelled') {
      return res.status(400).json({ message: `Cannot cancel a ${booking.status.toLowerCase()} booking` });
    }
    booking.status = 'Cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error('Error cancelling booking:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking (pending only, user owns it)
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (booking.status !== 'Pending') {
      return res.status(400).json({ message: 'Can only edit pending bookings' });
    }
    const allowed = ['deviceModel', 'issueDescription', 'preferredDate', 'preferredTimeSlot', 'notes'];
    allowed.forEach(k => { if (req.body[k] !== undefined) booking[k] = req.body[k]; });
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error('Error updating booking:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
