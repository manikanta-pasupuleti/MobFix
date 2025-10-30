const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { verifyToken, requireRole } = require('../middleware/auth');

// Create service (admin only)
router.post('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { serviceName, description, price } = req.body;
    const svc = await Service.create({ serviceName, description, price });
    res.json(svc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// List services (public)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service (admin)
router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const svc = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(svc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete service (admin)
router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
