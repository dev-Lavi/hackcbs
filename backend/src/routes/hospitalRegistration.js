const express = require('express');
const router = express.Router();
const hospitalRegistrationController = require('../controllers/hospitalRegistrationController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', hospitalRegistrationController.registerHospital);
router.post('/login', hospitalRegistrationController.loginHospitalAdmin);

// Protected routes (requires authentication)
router.get('/profile', protect, hospitalRegistrationController.getMyProfile);
router.patch('/update', protect, authorize('hospital_admin'), hospitalRegistrationController.updateHospitalDetails);

module.exports = router;
