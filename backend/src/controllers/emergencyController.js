const EmergencyRequest = require('../models/EmergencyRequest');
const Hospital = require('../models/Hospital');
const Patient = require('../models/Patient');
const Bed = require('../models/Bed');

// Create emergency request
exports.createEmergencyRequest = async (req, res) => {
  try {
    const emergencyRequest = await EmergencyRequest.create(req.body);

    // Find nearby hospitals with required bed type
    const nearbyHospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: req.body.location.coordinates
          },
          $maxDistance: 15000 // 15km radius
        }
      },
      [`availableBeds.${req.body.requiredBedType}`]: { $gt: 0 },
      isActive: true
    }).limit(10);

    res.status(201).json({
      success: true,
      message: 'Emergency request created successfully',
      data: {
        request: emergencyRequest,
        nearbyHospitals: nearbyHospitals
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating emergency request',
      error: error.message
    });
  }
};

// Assign hospital and bed to emergency request
exports.assignHospital = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { hospitalId, bedType } = req.body;

    // Find available bed in the hospital
    const availableBed = await Bed.findOne({
      hospitalId,
      bedType,
      status: 'available'
    });

    if (!availableBed) {
      return res.status(400).json({
        success: false,
        message: 'No available beds of requested type'
      });
    }

    // Update emergency request
    const emergencyRequest = await EmergencyRequest.findByIdAndUpdate(
      requestId,
      {
        assignedHospital: hospitalId,
        assignedBed: availableBed._id,
        status: 'hospital_assigned'
      },
      { new: true }
    ).populate('assignedHospital assignedBed');

    // Reserve the bed
    availableBed.status = 'reserved';
    await availableBed.save();

    res.status(200).json({
      success: true,
      message: 'Hospital and bed assigned successfully',
      data: emergencyRequest
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning hospital',
      error: error.message
    });
  }
};

// Complete admission (when patient reaches hospital)
exports.completeAdmission = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { patientData } = req.body;

    const emergencyRequest = await EmergencyRequest.findById(requestId);

    if (!emergencyRequest) {
      return res.status(404).json({
        success: false,
        message: 'Emergency request not found'
      });
    }

    // Create patient record
    const patient = await Patient.create({
      ...patientData,
      admittedTo: {
        hospitalId: emergencyRequest.assignedHospital,
        bedId: emergencyRequest.assignedBed,
        admissionDate: new Date()
      }
    });

    // Update bed
    await Bed.findByIdAndUpdate(emergencyRequest.assignedBed, {
      status: 'occupied',
      currentPatientId: patient._id,
      occupiedAt: new Date()
    });

    // Decrease available bed count
    const bed = await Bed.findById(emergencyRequest.assignedBed);
    await Hospital.findByIdAndUpdate(emergencyRequest.assignedHospital, {
      $inc: { [`availableBeds.${bed.bedType}`]: -1 }
    });

    // Update emergency request
    emergencyRequest.status = 'patient_admitted';
    await emergencyRequest.save();

    res.status(200).json({
      success: true,
      message: 'Patient admitted successfully',
      data: {
        patient,
        emergencyRequest
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error completing admission',
      error: error.message
    });
  }
};

// Get emergency request by ID
exports.getEmergencyRequest = async (req, res) => {
  try {
    const emergencyRequest = await EmergencyRequest.findById(req.params.id)
      .populate('assignedHospital')
      .populate('assignedBed');

    if (!emergencyRequest) {
      return res.status(404).json({
        success: false,
        message: 'Emergency request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: emergencyRequest
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching emergency request',
      error: error.message
    });
  }
};
