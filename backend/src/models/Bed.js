const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  bedNumber: {
    type: String,
    required: true
  },
  bedType: {
    type: String,
    enum: ['general', 'icu', 'emergency', 'ventilator'],
    required: true
  },
  floor: {
    type: String
  },
  ward: {
    type: String
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  },
  currentPatientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    default: null
  },
  occupiedAt: {
    type: Date
  },
  expectedReleaseTime: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
bedSchema.index({ hospitalId: 1, status: 1, bedType: 1 });

module.exports = mongoose.model('Bed', bedSchema);
