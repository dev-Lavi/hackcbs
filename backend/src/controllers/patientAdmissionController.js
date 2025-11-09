const Patient = require('../models/Patient');
const Hospital = require('../models/Hospital');

// Admin admits a patient without bed assignment
const admitPatient = async (req, res) => {
  try {
    const {
      // Patient Details
      name,
      age,
      gender,
      contactNumber,
      bloodGroup,
      address,
      
      // Emergency Contact
      emergencyContact,
      
      // Medical Information
      medicalHistory,
      admissionReason,
      symptoms,
      severity,
      
      // Expected Stay Duration (optional)
      expectedStayDuration
    } = req.body;

    // Get hospital ID from authenticated admin user
    const hospitalId = req.user.hospitalId;

    if (!hospitalId) {
      return res.status(403).json({
        success: false,
        message: 'Only hospital admins can admit patients'
      });
    }

    // Create patient record without bed assignment
    const patient = await Patient.create({
      name,
      age,
      gender,
      contactNumber,
      bloodGroup,
      address,
      emergencyContact,
      medicalHistory,
      admittedTo: {
        hospitalId,
        admissionDate: new Date(),
        admissionReason,
        symptoms,
        severity,
        expectedStayDuration
      },
      status: 'admitted'
    });

    // Emit real-time update via Socket.IO if applicable
    if (req.app.get('io')) {
      req.app.get('io').emit('patient:admitted', {
        hospitalId,
        patientId: patient._id
      });
    }

    res.status(201).json({
      success: true,
      message: 'Patient admitted successfully without bed assignment',
      data: patient
    });

  } catch (error) {
    console.error('Error admitting patient:', error);
    res.status(500).json({
      success: false,
      message: 'Error admitting patient',
      error: error.message
    });
  }
};

// Get available beds for hospital admin
const getAvailableBeds = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const { bedType } = req.query;

    const query = {
      hospitalId,
      status: 'available'
    };

    if (bedType) {
      query.bedType = bedType;
    }

    const beds = await Bed.find(query)
      .sort({ bedType: 1, bedNumber: 1 })
      .select('bedNumber bedType floor ward status equipment');

    res.status(200).json({
      success: true,
      count: beds.length,
      data: beds
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available beds',
      error: error.message
    });
  }
};

// Get all admitted patients in hospital
const getAdmittedPatients = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const { status = 'admitted' } = req.query;

    const patients = await Patient.find({
      'admittedTo.hospitalId': hospitalId,
      status
    })
      .populate('admittedTo.bedId', 'bedNumber bedType floor ward')
      .sort({ 'admittedTo.admissionDate': -1 });

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
};

// Get single patient details
const getPatientById = async (req, res) => {
  try {
    const { patientId } = req.params;
    const hospitalId = req.user.hospitalId;

    const patient = await Patient.findOne({
      _id: patientId,
      'admittedTo.hospitalId': hospitalId
    }).populate('admittedTo.bedId');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching patient',
      error: error.message
    });
  }
};

// Discharge patient
const dischargePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const hospitalId = req.user.hospitalId;
    const { dischargeNotes, dischargeDate } = req.body;

    const patient = await Patient.findOne({
      _id: patientId,
      'admittedTo.hospitalId': hospitalId,
      status: 'admitted'
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found or already discharged'
      });
    }

    // Update patient status
    patient.status = 'discharged';
    patient.admittedTo.dischargeDate = dischargeDate || new Date();
    patient.admittedTo.dischargeNotes = dischargeNotes;
    await patient.save();

    // Release bed
    const bed = await Bed.findById(patient.admittedTo.bedId);
    if (bed) {
      bed.status = 'available';
      bed.currentPatientId = null;
      bed.occupiedAt = null;
      bed.expectedReleaseTime = null;
      await bed.save();

      // Increase available bed count
      await Hospital.findByIdAndUpdate(hospitalId, {
        $inc: { [`availableBeds.${bed.bedType}`]: 1 }
      });

      // Emit real-time update
      if (req.app.get('io')) {
        req.app.get('io').emit('bed:available', {
          hospitalId,
          bedId: bed._id,
          bedType: bed.bedType
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Patient discharged successfully',
      data: patient
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error discharging patient',
      error: error.message
    });
  }
};

// Update patient details
const updatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const hospitalId = req.user.hospitalId;
    const updates = req.body;

    const patient = await Patient.findOneAndUpdate(
      {
        _id: patientId,
        'admittedTo.hospitalId': hospitalId
      },
      updates,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating patient',
      error: error.message
    });
  }
};

// Export all functions
module.exports = {
  admitPatient,
  getAvailableBeds,
  getAdmittedPatients,
  getPatientById,
  dischargePatient,
  updatePatient
};
