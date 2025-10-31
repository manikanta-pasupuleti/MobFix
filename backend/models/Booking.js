const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  
  // Device Information
  deviceBrand: { type: String, required: true }, // e.g., Apple, Samsung, Google
  deviceModel: { type: String, required: true }, // e.g., iPhone 14 Pro, Galaxy S23
  imeiNumber: { type: String }, // Optional: IMEI for tracking
  
  // Issue Details
  issueDescription: { type: String, required: true },
  urgency: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  
  // Appointment Details
  preferredDate: { type: Date, required: true },
  preferredTimeSlot: { type: String, required: true }, // e.g., "9:00 AM - 11:00 AM"
  
  // Contact Information
  contactPhone: { type: String, required: true },
  alternatePhone: { type: String },
  
  // Status & Tracking
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  bookingNumber: { type: String, unique: true }, // Auto-generated booking reference
  
  // Additional Info
  notes: { type: String }, // Customer notes
  estimatedCost: { type: Number }, // From service price
  actualCost: { type: Number }, // Final cost (may differ)
  
  // Admin fields
  technicianNotes: { type: String },
  completedAt: { type: Date },
  cancelledAt: { type: Date },
  cancellationReason: { type: String }
}, { timestamps: true });

// Generate unique booking number before saving
BookingSchema.pre('save', async function(next) {
  if (!this.bookingNumber) {
    const prefix = 'MF';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.bookingNumber = `${prefix}${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
