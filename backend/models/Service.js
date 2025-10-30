const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  serviceName: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
