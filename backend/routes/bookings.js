const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { stringField } = require('../middleware/validate');
const { TIME_SLOTS, dayBounds, getAvailability, getSlotCapacity } = require('../services/availability');
const { recordAudit } = require('../services/audit');

router.get('/availability', async (req, res) => {
  try {
    const { date } = req.query;
    const bounds = dayBounds(date);
    if (!bounds) return res.status(400).json({ message: 'A valid date is required in YYYY-MM-DD format' });
    const availability = await getAvailability(date);
    res.json({ date, capacity: getSlotCapacity(), slots: availability });
  } catch (err) {
    console.error('Availability lookup error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

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

    const errors = [
      stringField(deviceBrand, 'Device brand', { max: 60 }),
      stringField(deviceModel, 'Device model', { max: 120 }),
      stringField(issueDescription, 'Issue description', { min: 10, max: 2000 }),
      stringField(contactPhone, 'Contact phone', { min: 7, max: 30 }),
      preferredTimeSlot && !TIME_SLOTS.includes(preferredTimeSlot) ? 'Invalid time slot' : null,
      preferredDate && new Date(preferredDate) <= new Date() ? 'Preferred date must be in the future' : null
    ].filter(Boolean);
    if (!serviceId || errors.length) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.length ? errors : ['Service is required'] });
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(400).json({ message: 'Service not found' });

    const bounds = dayBounds(preferredDate);
    const bookedCount = await Booking.countDocuments({
      preferredDate: { $gte: bounds.start, $lt: bounds.end },
      preferredTimeSlot,
      status: { $ne: 'Cancelled' }
    });
    if (bookedCount >= getSlotCapacity()) {
      return res.status(409).json({ message: 'That appointment slot is full. Please choose another time.' });
    }

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
      status: 'Pending',
      statusHistory: [{ status: 'Pending', changedBy: req.userId, note: 'Booking created' }]
    });

    await booking.populate('serviceId');
    await recordAudit({
      actorId: req.userId,
      action: 'booking.created',
      resourceType: 'Booking',
      resourceId: booking._id,
      requestId: req.requestId,
      metadata: { status: booking.status, serviceId }
    });
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
    if (['Completed', 'Cancelled'].includes(booking.status)) {
      return res.status(400).json({ message: `Cannot cancel a ${booking.status.toLowerCase()} booking` });
    }
    booking.status = 'Cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    booking.statusHistory.push({ status: 'Cancelled', changedBy: req.userId, note: booking.cancellationReason });
    await booking.save();
    await recordAudit({
      actorId: req.userId,
      action: 'booking.cancelled',
      resourceType: 'Booking',
      resourceId: booking._id,
      requestId: req.requestId,
      metadata: { reason: booking.cancellationReason }
    });
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
    await recordAudit({
      actorId: req.userId,
      action: 'quote.approved',
      resourceType: 'Booking',
      resourceId: booking._id,
      requestId: req.requestId
    });
    res.json(booking);
  } catch (err) {
    console.error('Error updating booking:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id/quote/approve', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.userId });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'Quoted' || booking.quoteMin == null) return res.status(400).json({ message: 'No quote is awaiting approval' });
    booking.status = 'Confirmed';
    booking.quoteApprovedAt = new Date();
    booking.statusHistory.push({ status: 'Confirmed', changedBy: req.userId, note: 'Quote approved by customer' });
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error('Error approving quote:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
