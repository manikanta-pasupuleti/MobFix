const express = require('express');
const Booking = require('../models/Booking');
const staffAuth = require('../middleware/staffAuth');

const router = express.Router();
router.use(staffAuth);

router.get('/bookings', async (req, res) => {
  try {
    const filter = req.user.role === 'technician' ? { technicianId: req.userId } : {};
    const bookings = await Booking.find(filter)
      .populate('serviceId')
      .populate('userId', 'name email phone')
      .populate('technicianId', 'name email')
      .sort({ preferredDate: 1, createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching technician bookings:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/bookings/:id/status', async (req, res) => {
  try {
    const allowed = ['Confirmed', 'In Progress', 'Ready for Pickup', 'Completed'];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid technician status' });
    const filter = req.user.role === 'technician'
      ? { _id: req.params.id, technicianId: req.userId }
      : { _id: req.params.id };
    const booking = await Booking.findOne(filter);
    if (!booking) return res.status(404).json({ message: 'Assigned booking not found' });
    booking.status = req.body.status;
    if (booking.status === 'Completed') booking.completedAt = new Date();
    booking.statusHistory.push({ status: booking.status, changedBy: req.userId, note: req.body.note || 'Updated by staff' });
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error('Error updating technician booking:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
