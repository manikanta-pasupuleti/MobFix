const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// Create booking (user)
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

    console.log('Booking request received:', {
      userId: req.userId,
      serviceId,
      deviceBrand,
      deviceModel,
      preferredDate,
      preferredTimeSlot,
      contactPhone
    });

    // Validate required fields
    if (!serviceId || !deviceBrand || !deviceModel || !issueDescription || !preferredDate || !preferredTimeSlot || !contactPhone) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if service exists and get price
    const service = await Service.findById(serviceId);
    if (!service) {
      console.log('Service not found:', serviceId);
      return res.status(400).json({ message: 'Service not found' });
    }

    console.log('Service found:', service.serviceName, 'Price:', service.price);

    // Create booking with enhanced fields
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

    console.log('Booking created successfully:', booking.bookingNumber);

    // Populate service details for response
    await booking.populate('serviceId');

    res.status(201).json(booking);
  } catch (err) {
    console.error('Booking creation error:', err);
    console.error('Error details:', err.message);
    console.error('Stack trace:', err.stack);
    res.status(500).json({ 
      message: 'Server error creating booking',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Get bookings for current user
router.get('/mine', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate('serviceId')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single booking (user or admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('serviceId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Check if user owns this booking
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }
    
    res.json(booking);
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking (user can cancel if not completed)
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Check ownership
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if can be cancelled
    if (booking.status === 'Completed' || booking.status === 'Cancelled') {
      return res.status(400).json({ message: `Cannot cancel ${booking.status.toLowerCase()} booking` });
    }

    booking.status = 'Cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking (user can edit before confirmed)
router.put('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    
    // Check ownership
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // User can only update if booking is still pending
    if (booking.status !== 'Pending') {
      return res.status(400).json({ message: 'Can only edit pending bookings' });
    }
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

// Admin: view all bookings
router.get('/admin/all', auth, async (req, res) => {
  try {
    // Note: Add proper admin role check if needed
    const bookings = await Booking.find().populate('serviceId').populate('userId').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching all bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
