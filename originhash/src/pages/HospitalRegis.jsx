import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, User, Mail, Phone, Lock, AlertCircle } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export default function HospitalRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const facilityOptions = [
    "ICU", "Emergency", "Ventilator", "Ambulance", "Blood Bank",
    "CT Scan", "MRI", "X-Ray", "Pharmacy", "Laboratory"
  ];

  const [formData, setFormData] = useState({
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    password: "",
    confirmPassword: "",
    hospitalName: "",
    registrationNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    longitude: "",
    latitude: "",
    contactNumber: "",
    emergencyNumber: "",
    email: "",
    facilities: [],
    generalBeds: "",
    icuBeds: "",
    emergencyBeds: "",
    ventilatorBeds: "",
    totalAmbulances: "",
    availableAmbulances: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFacilityToggle = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const lng = parseFloat(formData.longitude);
    const lat = parseFloat(formData.latitude);

    if (lng < -180 || lng > 180) {
      setError("Longitude must be between -180 and 180");
      return;
    }

    if (lat < -90 || lat > 90) {
      setError("Latitude must be between -90 and 90");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPhone: formData.adminPhone,
        password: formData.password,
        hospitalName: formData.hospitalName,
        registrationNumber: formData.registrationNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        longitude: lng,
        latitude: lat,
        contactNumber: formData.contactNumber,
        emergencyNumber: formData.emergencyNumber,
        email: formData.email,
        facilities: formData.facilities,
        totalBeds: {
          general: parseInt(formData.generalBeds) || 0,
          icu: parseInt(formData.icuBeds) || 0,
          emergency: parseInt(formData.emergencyBeds) || 0,
          ventilator: parseInt(formData.ventilatorBeds) || 0
        },
        ambulances: {
          total: parseInt(formData.totalAmbulances) || 0,
          available: parseInt(formData.availableAmbulances) || 0
        }
      };

      const response = await fetch(`${BASE_URL}/api/hospital-registration/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        alert("✅ Hospital registered successfully!");
        navigate("/admin/loginhp");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hospital Registration</h1>
          <p className="text-gray-600">Join our network and start managing bed availability</p>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        <div className="flex items-center justify-center mb-8 space-x-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>{s}</div>
              {s < 3 && <div className={`h-1 w-20 ${step > s ? "bg-blue-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Admin Details */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Administrator Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="adminName"
                      value={formData.adminName}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border rounded-lg"
                      placeholder="Dr. Rajesh Kumar"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3 py-2 border rounded-lg"
                        placeholder="admin@hospital.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="adminPhone"
                        value={formData.adminPhone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-3 py-2 border rounded-lg"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3 py-2 border rounded-lg"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-3 py-2 border rounded-lg"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                  disabled={!formData.adminName || !formData.adminEmail || !formData.password}
                >
                  Next: Hospital Details
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Hospital Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Hospital Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Hospital Name *</label>
                    <input
                      type="text"
                      name="hospitalName"
                      value={formData.hospitalName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Apollo Hospital"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Registration Number</label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="HOSP-2024-001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="154/11, Bannerghatta Road"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Bangalore"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Karnataka"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="560076"
                    />
                  </div>
                </div>

                {/* Coordinates Section - UPDATED */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Hospital Location Coordinates</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Longitude * <span className="text-xs text-gray-500">(-180 to 180)</span>
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleInputChange}
                        required
                        min="-180"
                        max="180"
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="77.4538"
                      />
                      <p className="text-xs text-gray-600 mt-1">Example: Ghaziabad = 77.4538</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Latitude * <span className="text-xs text-gray-500">(-90 to 90)</span>
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleInputChange}
                        required
                        min="-90"
                        max="90"
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="28.6692"
                      />
                      <p className="text-xs text-gray-600 mt-1">Example: Ghaziabad = 28.6692</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            setFormData(prev => ({
                              ...prev,
                              longitude: position.coords.longitude.toString(),
                              latitude: position.coords.latitude.toString()
                            }));
                            alert("✅ Location detected!");
                          },
                          (error) => {
                            alert("❌ Could not get location. Please enter manually.");
                          }
                        );
                      } else {
                        alert("❌ Geolocation not supported by your browser.");
                      }
                    }}
                    className="w-full py-2 border-2 border-blue-300 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition"
                  >
                    📍 Use My Current Location
                  </button>

                  <div className="mt-3 p-2 bg-white rounded border border-blue-200">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Common Coordinates:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>Delhi: 77.2090, 28.6139</div>
                      <div>Mumbai: 72.8777, 19.0760</div>
                      <div>Bangalore: 77.5946, 12.9716</div>
                      <div>Ghaziabad: 77.4538, 28.6692</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contact Number *</label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="080-26304050"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Emergency Number *</label>
                    <input
                      type="tel"
                      name="emergencyNumber"
                      value={formData.emergencyNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="080-26304051"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hospital Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="info@hospital.com"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                  >
                    Next: Facilities & Beds
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Facilities & Resources */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Facilities & Resources</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Available Facilities</label>
                  <div className="grid grid-cols-3 gap-3">
                    {facilityOptions.map((facility) => (
                      <label
                        key={facility}
                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                          formData.facilities.includes(facility)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(facility)}
                          onChange={() => handleFacilityToggle(facility)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium">{facility}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Total Beds Available</label>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">General</label>
                      <input
                        type="number"
                        name="generalBeds"
                        value={formData.generalBeds}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">ICU</label>
                      <input
                        type="number"
                        name="icuBeds"
                        value={formData.icuBeds}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Emergency</label>
                      <input
                        type="number"
                        name="emergencyBeds"
                        value={formData.emergencyBeds}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Ventilator</label>
                      <input
                        type="number"
                        name="ventilatorBeds"
                        value={formData.ventilatorBeds}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Ambulances</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Total Ambulances</label>
                      <input
                        type="number"
                        name="totalAmbulances"
                        value={formData.totalAmbulances}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Available Now</label>
                      <input
                        type="number"
                        name="availableAmbulances"
                        value={formData.availableAmbulances}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? "Registering..." : "Complete Registration"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/loginhp")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
