const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');

// Create emergency request
router.post('/', emergencyController.createEmergencyRequest);

// Assign hospital to request
router.patch('/:requestId/assign', emergencyController.assignHospital);

// Complete admission
router.patch('/:requestId/admit', emergencyController.completeAdmission);

// Get emergency request
router.get('/:id', emergencyController.getEmergencyRequest);

module.exports = router;
