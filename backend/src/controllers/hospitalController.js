const Hospital = require('../models/Hospital');

// Get nearby hospitals with available beds
exports.getNearbyHospitals = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000, bedType } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }

    // Build query
    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance) // in meters
        }
      },
      isActive: true
    };

    // Add bed availability filter
const validBedTypes = ['general', 'icu', 'emergency', 'ventilator'];
if (bedType && validBedTypes.includes(bedType)) {
  query[`availableBeds.${bedType}`] = { $gt: 0 };
}

    const hospitals = await Hospital.find(query)
      .select('-__v')
      .limit(20);

    // Calculate distance for each hospital
    const hospitalsWithDistance = hospitals.map(hospital => {
      const hospitalObj = hospital.toObject();
      
      // Calculate distance using Haversine formula
      const distance = calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        hospital.location.coordinates[1],
        hospital.location.coordinates[0]
      );

      return {
        ...hospitalObj,
        distance: parseFloat(distance.toFixed(2))
      };
    });

    res.status(200).json({
      success: true,
      count: hospitalsWithDistance.length,
      data: hospitalsWithDistance
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby hospitals',
      error: error.message
    });
  }
};

// Get single hospital details
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }

    res.status(200).json({
      success: true,
      data: hospital
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hospital details',
      error: error.message
    });
  }
};

// Create new hospital (for admin)
exports.createHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Hospital created successfully',
      data: hospital
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating hospital',
      error: error.message
    });
  }
};

// Helper function to calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
