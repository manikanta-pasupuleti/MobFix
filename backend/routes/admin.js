const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const adminAuth = require('../middleware/adminAuth');
const mongoose = require('mongoose');
const AuditEvent = require('../models/AuditEvent');
const { recordAudit } = require('../services/audit');
const { canTransition } = require('../services/bookingLifecycle');

// All admin routes require admin role
router.use(adminAuth);

// List all customers
router.get('/customers', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// View all bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('serviceId')
      .populate('userId', '-password')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (admin)
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Pending', 'Quoted', 'Confirmed', 'In Progress', 'Ready for Pickup', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== status && !canTransition(booking.status, status)) {
      return res.status(409).json({ message: `Cannot change status from ${booking.status} to ${status}` });
    }
    booking.status = status;
    if (status === 'Completed') booking.completedAt = new Date();
    booking.statusHistory.push({ status, changedBy: req.userId, note: req.body.note || `Status changed to ${status}` });
    await booking.save();
      await recordAudit({
        actorId: req.userId,
        action: 'booking.status_changed',
        resourceType: 'Booking',
        resourceId: booking._id,
        requestId: req.requestId,
        metadata: { status }
      });
    await booking.populate('serviceId').populate('userId', '-password').populate('technicianId', 'name email');
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/technicians', async (req, res) => {
  const technicians = await User.find({ role: 'technician', isActive: true }).select('name email phone');
  res.json(technicians);
});

router.put('/bookings/:id/assign', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id) || !mongoose.isValidObjectId(req.body.technicianId)) {
    return res.status(400).json({ message: 'Valid booking and technician IDs are required' });
  }
  const technician = await User.findOne({ _id: req.body.technicianId, role: 'technician', isActive: true });
  if (!technician) return res.status(400).json({ message: 'Active technician not found' });
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  booking.technicianId = technician._id;
  booking.statusHistory.push({ status: booking.status, changedBy: req.userId, note: `Assigned to ${technician.name}` });
  await booking.save();
  await recordAudit({
    actorId: req.userId,
    action: 'booking.technician_assigned',
    resourceType: 'Booking',
    resourceId: booking._id,
    requestId: req.requestId,
    metadata: { technicianId: technician._id }
  });
  await booking.populate('serviceId').populate('userId', '-password').populate('technicianId', 'name email');
  res.json(booking);
});

router.put('/bookings/:id/quote', async (req, res) => {
  const { quoteMin, quoteMax, quoteNotes } = req.body;
  if (!Number.isFinite(Number(quoteMin)) || !Number.isFinite(Number(quoteMax)) || Number(quoteMin) < 0 || Number(quoteMax) < Number(quoteMin)) {
    return res.status(400).json({ message: 'A valid quote range is required' });
  }
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  booking.quoteMin = Number(quoteMin);
  booking.quoteMax = Number(quoteMax);
  booking.quoteNotes = typeof quoteNotes === 'string' ? quoteNotes.trim().slice(0, 1000) : undefined;
  booking.status = 'Quoted';
  booking.statusHistory.push({ status: 'Quoted', changedBy: req.userId, note: 'Quote sent to customer' });
  await booking.save();
  await recordAudit({
    actorId: req.userId,
    action: 'booking.quote_issued',
    resourceType: 'Booking',
    resourceId: booking._id,
    requestId: req.requestId,
    metadata: { quoteMin: booking.quoteMin, quoteMax: booking.quoteMax }
  });
  await booking.populate('serviceId').populate('userId', '-password').populate('technicianId', 'name email');
  res.json(booking);
});

router.put('/bookings/:id/payment', async (req, res) => {
  const allowed = ['Pending', 'Authorized', 'Paid', 'Failed', 'Refunded'];
  const { paymentStatus, paymentReference } = req.body;
  if (!allowed.includes(paymentStatus)) {
    return res.status(400).json({ message: 'Invalid payment status' });
  }
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  booking.paymentStatus = paymentStatus;
  booking.paymentReference = typeof paymentReference === 'string'
    ? paymentReference.trim().slice(0, 120)
    : undefined;
  booking.paidAt = paymentStatus === 'Paid' ? new Date() : undefined;
  await booking.save();
  await recordAudit({
    actorId: req.userId,
    action: 'booking.payment_changed',
    resourceType: 'Booking',
    resourceId: booking._id,
    requestId: req.requestId,
    metadata: { paymentStatus }
  });
  res.json(booking);
});

router.get('/audit-events', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 50, 1), 200);
    const events = await AuditEvent.find({})
      .populate('actorId', 'name email role')
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(events);
  } catch (err) {
    console.error('Error fetching audit events:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalBookings, totalServices, recentBookings] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments(),
      Service.countDocuments(),
      Booking.find().sort({ createdAt: -1 }).limit(5).populate('serviceId').populate('userId', 'name email')
    ]);
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json({ totalUsers, totalBookings, totalServices, bookingsByStatus, recentBookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
