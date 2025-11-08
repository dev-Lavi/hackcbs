const Hospital = require('../models/Hospital');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Hospital Registration Flow
exports.registerHospital = async (req, res) => {
  try {
    const {
      // Hospital Admin Info
      adminName,
      adminEmail,
      adminPhone,
      password,
      
      // Hospital Info
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
      ambulances,
      
      // Verification Documents
      medicalLicense,
      hospitalRegistrationCertificate,
      adminIdProof
    } = req.body;

    // 1. Check if hospital registration number already exists
    const existingHospital = await Hospital.findOne({ registrationNumber });
    if (existingHospital) {
      return res.status(400).json({
        success: false,
        message: 'Hospital with this registration number already exists'
      });
    }

    // 2. Check if admin email already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // 3. Create hospital (with pending status)
    const hospital = await Hospital.create({
      name: hospitalName,
      registrationNumber,
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
      isActive: false // Inactive until verified by system admin
    });

    // 4. Create hospital admin user
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      phone: adminPhone,
      password: hashedPassword,
      role: 'hospital_admin',
      hospitalId: hospital._id,
      registrationStatus: 'pending',
      verificationDocuments: {
        medicalLicense,
        hospitalRegistration: hospitalRegistrationCertificate,
        idProof: adminIdProof
      },
      isVerified: false
    });

    // 5. Send verification email (implement this)
    // await sendVerificationEmail(adminEmail, admin._id);

    // 6. Notify system admins for approval (implement this)
    // await notifySystemAdmins(hospital._id);

    res.status(201).json({
      success: true,
      message: 'Hospital registration submitted successfully. Your application is under review and you will be notified within 2-3 business days.',
      data: {
        hospitalId: hospital._id,
        adminId: admin._id,
        registrationNumber: hospital.registrationNumber,
        status: 'pending_verification'
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
exports.loginHospitalAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is verified
    if (user.registrationStatus === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending verification. Please wait for admin approval.'
      });
    }

    if (user.registrationStatus === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your registration has been rejected. Please contact support.'
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
          isActive: hospital.isActive
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error.message
    });
  }
};

// System Admin: Approve Hospital Registration
exports.approveHospitalRegistration = async (req, res) => {
  try {
    const { hospitalId } = req.params;

    // Update hospital status
    const hospital = await Hospital.findByIdAndUpdate(
      hospitalId,
      { isActive: true },
      { new: true }
    );

    // Update admin user status
    await User.findOneAndUpdate(
      { hospitalId: hospitalId, role: 'hospital_admin' },
      { 
        registrationStatus: 'approved',
        isVerified: true
      }
    );

    // Send approval email (implement this)
    // await sendApprovalEmail(hospital.email);

    res.status(200).json({
      success: true,
      message: 'Hospital registration approved',
      data: hospital
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving registration',
      error: error.message
    });
  }
};

// System Admin: Reject Hospital Registration
exports.rejectHospitalRegistration = async (req, res) => {
  try {
    const { hospitalId } = req.params;
    const { reason } = req.body;

    // Update admin user status
    await User.findOneAndUpdate(
      { hospitalId: hospitalId, role: 'hospital_admin' },
      { 
        registrationStatus: 'rejected'
      }
    );

    // Send rejection email with reason (implement this)
    // await sendRejectionEmail(hospital.email, reason);

    res.status(200).json({
      success: true,
      message: 'Hospital registration rejected'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rejecting registration',
      error: error.message
    });
  }
};

// Get pending registrations (for system admin)
exports.getPendingRegistrations = async (req, res) => {
  try {
    const pendingAdmins = await User.find({
      role: 'hospital_admin',
      registrationStatus: 'pending'
    }).populate('hospitalId');

    res.status(200).json({
      success: true,
      count: pendingAdmins.length,
      data: pendingAdmins
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending registrations',
      error: error.message
    });
  }
};
