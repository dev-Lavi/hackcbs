const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');

// Get nearby hospitals
router.get('/nearby', hospitalController.getNearbyHospitals);

// Get single hospital
router.get('/:id', hospitalController.getHospitalById);

// Create hospital (admin only - you can add auth middleware later)
router.post('/', hospitalController.createHospital);

module.exports = router;
