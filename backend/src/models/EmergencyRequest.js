const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
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
    },
    address: String
  },
  emergencyType: {
    type: String,
    enum: ['accident', 'heart_attack', 'stroke', 'breathing_problem', 
           'severe_injury', 'burn', 'poisoning', 'other'],
    required: true
  },
  symptoms: [String],
  severity: {
    type: String,
    enum: ['critical', 'severe', 'moderate'],
    default: 'moderate'
  },
  requiredBedType: {
    type: String,
    enum: ['general', 'icu', 'emergency', 'ventilator'],
    default: 'emergency'
  },
  needsAmbulance: {
    type: Boolean,
    default: false
  },
  assignedHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  assignedBed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bed'
  },
  status: {
    type: String,
    enum: ['pending', 'hospital_assigned', 'ambulance_dispatched', 
           'patient_admitted', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Geospatial index for location queries
emergencyRequestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
