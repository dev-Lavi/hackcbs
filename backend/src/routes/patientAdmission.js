const express = require('express');
const router = express.Router();
const patientAdmissionController = require('../controllers/patientAdmissionController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication and hospital_admin role
router.use(protect);
router.use(authorize('hospital_admin'));

// Admit new patient
router.post('/admit', patientAdmissionController.admitPatient);

// Get available beds in hospital
router.get('/beds/available', patientAdmissionController.getAvailableBeds);

// Get all admitted patients
router.get('/patients', patientAdmissionController.getAdmittedPatients);

// Get single patient
router.get('/patients/:patientId', patientAdmissionController.getPatientById);

// Update patient details
router.patch('/patients/:patientId', patientAdmissionController.updatePatient);

// Discharge patient
router.post('/patients/:patientId/discharge', patientAdmissionController.dischargePatient);

module.exports = router;
