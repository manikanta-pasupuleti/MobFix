const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/recommendations', async (req, res) => {
  try {
    const symptoms = String(req.query.symptoms || '').trim().slice(0, 500);
    if (symptoms.length < 3) {
      return res.status(400).json({ message: 'symptoms must contain at least 3 characters' });
    }

    const terms = symptoms.toLowerCase().split(/[^a-z0-9]+/).filter(term => term.length >= 3);
    const services = await Service.find({}).limit(100);
    const recommendations = services.map(service => {
      const searchable = `${service.serviceName} ${service.description} ${service.category}`.toLowerCase();
      const matches = terms.filter(term => searchable.includes(term));
      const score = matches.length + (service.isPopular ? 0.25 : 0) + (Number(service.rating) || 0) / 100;
      return {
        service,
        score: Number(score.toFixed(2)),
        matchedTerms: [...new Set(matches)]
      };
    })
      .filter(item => item.matchedTerms.length > 0)
      .sort((left, right) => right.score - left.score)
      .slice(0, 5);

    res.json({
      symptoms,
      explanation: 'Matches are based on symptom terms and service catalog metadata; this is not a diagnosis.',
      data: recommendations
    });
  } catch (err) {
    console.error('Recommendation lookup error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// List all services (public)
router.get('/', async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 20, 1), 100);
    const filter = {};
    if (req.query.platform && req.query.platform !== 'All') filter.platform = req.query.platform;
    if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
    if (req.query.search) filter.$text = { $search: String(req.query.search).slice(0, 100) };
    const sortMap = {
      price: { price: 1 },
      rating: { rating: -1 },
      popular: { isPopular: -1, reviewCount: -1 },
      name: { serviceName: 1 }
    };
    const sort = sortMap[req.query.sort] || sortMap.popular;
    const [services, total] = await Promise.all([
      Service.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
      Service.countDocuments(filter)
    ]);
    res.json({ data: services, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single service by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create service (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const svc = await Service.create(req.body);
    res.json(svc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const svc = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!svc) return res.status(404).json({ message: 'Service not found' });
    res.json(svc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete service (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
