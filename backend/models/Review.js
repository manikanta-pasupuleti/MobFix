const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  userName: {
    type: String,
    required: true
  },
  helpful: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
ReviewSchema.index({ serviceId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
