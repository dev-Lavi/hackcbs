const Hospital = require('../models/Hospital');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hospital Registration Controller
const registerHospital = async (req, res) => {
  try {
    const {
      adminName,
      adminEmail,
      adminPhone,
      password,
      hospitalName,
      registrationNumber,
      address,
      city,
      state,
      pincode,
      longitude,
      latitude,
      contactNumber,
      emergencyNumber,
      email,
      facilities,
      totalBeds,
      ambulances
    } = req.body;

    // Validation - UPDATED
    if (!adminName || !adminEmail || !password || !hospitalName || !address || !city || !state || !contactNumber || !emergencyNumber || !email || !longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: adminName, adminEmail, password, hospitalName, address, city, state, contactNumber, emergencyNumber, email, longitude, latitude'
      });
    }

    // Check if hospital already exists
    if (registrationNumber) {
      const existingHospital = await Hospital.findOne({ registrationNumber });
      if (existingHospital) {
        return res.status(400).json({
          success: false,
          message: 'Hospital with this registration number already exists'
        });
      }
    }

    // Check if admin email already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create hospital - UPDATED to use correct field names
    const hospital = await Hospital.create({
      name: hospitalName,  // Changed from 'hospitalName' to match model
      registrationNumber: registrationNumber || `HOSP-${Date.now()}`,
      address,
      city,
      state,
      pincode,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      contactNumber,
      emergencyNumber,
      email,
      facilities: facilities || [],
      totalBeds: totalBeds || {
        general: 0,
        icu: 0,
        emergency: 0,
        ventilator: 0
      },
      availableBeds: totalBeds || {
        general: 0,
        icu: 0,
        emergency: 0,
        ventilator: 0
      },
      ambulances: ambulances || {
        total: 0,
        available: 0
      },
      isActive: true
    });

    // Create hospital admin user
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      password: hashedPassword,
      role: 'hospital_admin',
      hospitalId: hospital._id,
      isVerified: true
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role, hospitalId: hospital._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Hospital registered successfully! You can now start using the system.',
      token,
      data: {
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        },
        hospital: {
          id: hospital._id,
          name: hospital.name,
          registrationNumber: hospital.registrationNumber,
          isActive: hospital.isActive
        }
      }
    });

  } catch (error) {
    console.error('Hospital registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering hospital',
      error: error.message
    });
  }
};


// Hospital Admin Login
const loginHospitalAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, hospitalId: user.hospitalId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Get hospital details
    const hospital = await Hospital.findById(user.hospitalId);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        hospital: {
          id: hospital._id,
          name: hospital.name,
          address: hospital.address,
          city: hospital.city,
          isActive: hospital.isActive
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error.message
    });
  }
};

// Get current logged-in hospital admin profile
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('hospitalId');

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update hospital details
const updateHospitalDetails = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const updates = req.body;

    // Don't allow updating certain fields
    delete updates._id;
    delete updates.registrationNumber;

    const hospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Hospital details updated successfully',
      data: hospital
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating hospital details',
      error: error.message
    });
  }
};

// Export all functions
module.exports = {
  registerHospital,
  loginHospitalAdmin,
  getMyProfile,
  updateHospitalDetails
};
