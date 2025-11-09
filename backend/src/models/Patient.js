const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required']
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
  contactNumber: {
    type: String,
    required: true
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },
  address: {
    type: String
  },
  admittedTo: {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital'
    },
    bedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bed'
    },
    admissionDate: Date,
    dischargeDate: Date,
    // NEW FIELDS ADDED
    admissionReason: String,
    symptoms: [String],
    severity: {
      type: String,
      enum: ['critical', 'severe', 'moderate', 'mild']
    },
    expectedStayDuration: Number, // in hours
    dischargeNotes: String
  },
  medicalHistory: {
    allergies: [String],
    chronicDiseases: [String],
    currentMedications: [String],
    // NEW FIELD ADDED
    previousSurgeries: [String]
  },
  status: {
    type: String,
    enum: ['admitted', 'discharged', 'transferred'],
    default: 'admitted'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Patient', patientSchema);
