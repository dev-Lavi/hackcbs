const express = require('express');
const router = express.Router();
const hospitalRegistrationController = require('../controllers/hospitalRegistrationController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', hospitalRegistrationController.registerHospital);
router.post('/login', hospitalRegistrationController.loginHospitalAdmin);

// System admin only routes
router.get(
  '/pending', 
  protect, 
  authorize('system_admin'), 
  hospitalRegistrationController.getPendingRegistrations
);

router.patch(
  '/:hospitalId/approve', 
  protect, 
  authorize('system_admin'), 
  hospitalRegistrationController.approveHospitalRegistration
);

router.patch(
  '/:hospitalId/reject', 
  protect, 
  authorize('system_admin'), 
  hospitalRegistrationController.rejectHospitalRegistration
);

module.exports = router;
