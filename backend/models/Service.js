const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Screen', 'Battery', 'Camera', 'Charging', 'Audio', 'Software', 'Other'],
    default: 'Other'
  },
  imageUrl: { 
    type: String,
    default: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400'
  },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  estimatedTime: { type: String, default: '1-2 hours' },
  warranty: { type: String, default: '90 days' },
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
