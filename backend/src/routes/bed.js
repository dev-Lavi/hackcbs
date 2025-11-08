const express = require('express');
const router = express.Router();
const bedController = require('../controllers/bedController');

// Get available beds for a hospital
router.get('/hospital/:hospitalId', bedController.getAvailableBeds);

// Occupy a bed
router.patch('/:bedId/occupy', bedController.occupyBed);

// Release a bed
router.patch('/:bedId/release', bedController.releaseBed);

module.exports = router;
