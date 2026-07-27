const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

// GET reviews for a specific service
router.get('/service/:serviceId', async (req, res) => {
  try {
    const reviews = await Review.find({ serviceId: req.params.serviceId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// POST create a new review (requires authentication)
router.post('/', auth, async (req, res) => {
  try {
    const { serviceId, rating, comment } = req.body;

    // Validate required fields
    if (!serviceId || !rating || !comment) {
      return res.status(400).json({ message: 'Service, rating, and comment are required' });
    }

    // Check if service exists
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if user already reviewed this service
    const existingReview = await Review.findOne({
      serviceId,
      userId: req.userId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this service' });
    }

    // Create review
    const review = new Review({
      serviceId,
      userId: req.userId,
      rating: Number(rating),
      comment: comment.trim(),
      userName: req.userName || 'Anonymous User'
    });

    await review.save();

    // Update service rating and review count
    await updateServiceRating(serviceId);

    res.status(201).json(review);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ message: 'Server error creating review' });
  }
});

// PUT update a review (requires authentication and ownership)
router.put('/:id', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    if (rating) review.rating = Number(rating);
    if (comment) review.comment = comment.trim();

    await review.save();

    // Update service rating
    await updateServiceRating(review.serviceId);

    res.json(review);
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ message: 'Server error updating review' });
  }
});

// DELETE a review (requires authentication and ownership)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const serviceId = review.serviceId;
    await Review.findByIdAndDelete(req.params.id);

    // Update service rating
    await updateServiceRating(serviceId);

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Server error deleting review' });
  }
});

// Helper function to update service rating and review count
async function updateServiceRating(serviceId) {
  try {
    const reviews = await Review.find({ serviceId });
    const reviewCount = reviews.length;
    
    if (reviewCount === 0) {
      await Service.findByIdAndUpdate(serviceId, {
        rating: 0,
        reviewCount: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviewCount;

    await Service.findByIdAndUpdate(serviceId, {
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviewCount
    });
  } catch (err) {
    console.error('Error updating service rating:', err);
  }
}

module.exports = router;
