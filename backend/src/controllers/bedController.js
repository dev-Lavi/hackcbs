const Bed = require('../models/Bed');
const Hospital = require('../models/Hospital');

// Get available beds for a hospital
exports.getAvailableBeds = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { bedType } = req.query;

    const query = {
      hospitalId,
      status: 'available'
    };

    if (bedType) {
      query.bedType = bedType;
    }

    const beds = await Bed.find(query)
      .populate('hospitalId', 'name address')
      .sort({ bedType: 1, bedNumber: 1 });

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

// Occupy a bed (when patient is admitted)
exports.occupyBed = async (req, res) => {
  try {
    const { bedId } = req.params;
    const { patientId } = req.body;

    const bed = await Bed.findById(bedId);

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found'
      });
    }

    if (bed.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Bed is not available'
      });
    }

    // Update bed status
    bed.status = 'occupied';
    bed.currentPatientId = patientId;
    bed.occupiedAt = new Date();
    await bed.save();

    // Update hospital available bed count
    await Hospital.findByIdAndUpdate(bed.hospitalId, {
      $inc: { [`availableBeds.${bed.bedType}`]: -1 }
    });

    // Emit real-time update via Socket.IO (if socket is available)
    if (req.app.get('io')) {
      req.app.get('io').emit('bed:occupied', {
        hospitalId: bed.hospitalId,
        bedId: bed._id,
        bedType: bed.bedType
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bed occupied successfully',
      data: bed
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error occupying bed',
      error: error.message
    });
  }
};

// Release a bed (when patient is discharged)
exports.releaseBed = async (req, res) => {
  try {
    const { bedId } = req.params;

    const bed = await Bed.findById(bedId);

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found'
      });
    }

    // Update bed status
    bed.status = 'available';
    bed.currentPatientId = null;
    bed.occupiedAt = null;
    bed.expectedReleaseTime = null;
    await bed.save();

    // Update hospital available bed count
    await Hospital.findByIdAndUpdate(bed.hospitalId, {
      $inc: { [`availableBeds.${bed.bedType}`]: 1 }
    });

    // Emit real-time update via Socket.IO
    if (req.app.get('io')) {
      req.app.get('io').emit('bed:available', {
        hospitalId: bed.hospitalId,
        bedId: bed._id,
        bedType: bed.bedType
      });
    }

    res.status(200).json({
      success: true,
      message: 'Bed released successfully',
      data: bed
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error releasing bed',
      error: error.message
    });
  }
};
