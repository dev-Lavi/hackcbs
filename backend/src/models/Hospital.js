const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  contactNumber: {
    type: String,
    required: true
  },
  emergencyNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  facilities: [{
    type: String,
    enum: ['ICU', 'Emergency', 'Ventilator', 'Ambulance', 'Blood Bank', 
           'Oxygen', 'CT Scan', 'MRI', 'Operation Theater']
  }],
  totalBeds: {
    general: { type: Number, default: 0 },
    icu: { type: Number, default: 0 },
    emergency: { type: Number, default: 0 },
    ventilator: { type: Number, default: 0 }
  },
  availableBeds: {
    general: { type: Number, default: 0 },
    icu: { type: Number, default: 0 },
    emergency: { type: Number, default: 0 },
    ventilator: { type: Number, default: 0 }
  },
  ambulances: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
hospitalSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Hospital', hospitalSchema);
