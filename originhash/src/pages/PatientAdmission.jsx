import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Bed, AlertCircle } from "lucide-react";
import HPHeader from "../components/HPHeader";
import HPFooter from "../components/HPFooter";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export default function PatientAdmission() {
  const [loading, setLoading] = useState(false);
  const [loadingBeds, setLoadingBeds] = useState(false);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contactNumber: "",
    bloodGroup: "",
    address: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    admissionReason: "",
    symptoms: "",
    severity: "moderate",
    allergies: "",
    chronicDiseases: "",
    currentMedications: "",
    previousSurgeries: "",
    bedType: "general",
    expectedStayDuration: "",
  });

  useEffect(() => {
    if (formData.bedType) {
      fetchAvailableBeds(formData.bedType);
    }
  }, [formData.bedType]);

  const fetchAvailableBeds = async (bedType) => {
    try {
      setLoadingBeds(true);
      setError(null);
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${BASE_URL}/api/admission/beds/available?bedType=${bedType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setAvailableBeds(data.data);
        if (data.data.length > 0) {
          setSelectedBed(data.data[0]._id);
        }
      } else {
        setError("Failed to fetch available beds");
      }
    } catch (error) {
      console.error("Error fetching beds:", error);
      setError("Error connecting to server");
    } finally {
      setLoadingBeds(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedBed) {
      setError("Please select a bed");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const payload = {
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        contactNumber: formData.contactNumber,
        bloodGroup: formData.bloodGroup || undefined,
        address: formData.address,
        emergencyContact: {
          name: formData.emergencyContactName,
          relation: formData.emergencyContactRelation,
          phone: formData.emergencyContactPhone,
        },
        medicalHistory: {
          allergies: formData.allergies.split(",").map((s) => s.trim()).filter(Boolean),
          chronicDiseases: formData.chronicDiseases.split(",").map((s) => s.trim()).filter(Boolean),
          currentMedications: formData.currentMedications.split(",").map((s) => s.trim()).filter(Boolean),
          previousSurgeries: formData.previousSurgeries.split(",").map((s) => s.trim()).filter(Boolean),
        },
        admissionReason: formData.admissionReason,
        symptoms: formData.symptoms.split(",").map((s) => s.trim()).filter(Boolean),
        severity: formData.severity,
        bedId: selectedBed,
        bedType: formData.bedType,
        expectedStayDuration: formData.expectedStayDuration ? parseInt(formData.expectedStayDuration) : undefined,
      };

      const response = await fetch(`${BASE_URL}/api/admission/admit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Patient admitted successfully!");
        // Reset form
        setFormData({
          name: "", age: "", gender: "", contactNumber: "", bloodGroup: "",
          address: "", emergencyContactName: "", emergencyContactRelation: "",
          emergencyContactPhone: "", admissionReason: "", symptoms: "",
          severity: "moderate", allergies: "", chronicDiseases: "",
          currentMedications: "", previousSurgeries: "", bedType: "general",
          expectedStayDuration: "",
        });
        setSelectedBed(null);
        setStep(1);
      } else {
        setError(data.message || "Failed to admit patient");
      }
    } catch (error) {
      console.error("Error admitting patient:", error);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <HPHeader />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Admission</h1>
          <p className="text-gray-600">Complete patient details and assign bed</p>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= s ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>{s}</div>
              {s < 4 && <div className={`h-1 w-16 ${step > s ? "bg-blue-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Patient Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                          className="w-full px-3 py-2 border rounded-lg" placeholder="Rajesh Kumar" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Age *</label>
                        <input type="number" name="age" value={formData.age} onChange={handleInputChange} required
                          className="w-full px-3 py-2 border rounded-lg" placeholder="45" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Gender *</label>
                        <select name="gender" value={formData.gender} onChange={handleInputChange} required
                          className="w-full px-3 py-2 border rounded-lg">
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Blood Group</label>
                        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg">
                          <option value="">Select</option>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Number *</label>
                      <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required
                        className="w-full px-3 py-2 border rounded-lg" placeholder="9876543210" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <textarea name="address" value={formData.address} onChange={handleInputChange} rows={3}
                        className="w-full px-3 py-2 border rounded-lg" placeholder="123, MG Road, Bangalore" />
                    </div>
                    <button type="button" onClick={() => setStep(2)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                      disabled={!formData.name || !formData.age || !formData.gender || !formData.contactNumber}>
                      Next: Emergency Contact
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Emergency Contact</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Contact Name</label>
                      <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg" placeholder="Priya Kumar" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Relation</label>
                        <input type="text" name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg" placeholder="Wife" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded-lg" placeholder="9876543211" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setStep(1)}
                        className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Back</button>
                      <button type="button" onClick={() => setStep(3)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Next</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Medical Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Admission Reason *</label>
                      <textarea name="admissionReason" value={formData.admissionReason} onChange={handleInputChange} required rows={2}
                        className="w-full px-3 py-2 border rounded-lg" placeholder="Chest pain and breathing difficulty" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Symptoms (comma-separated)</label>
                      <input type="text" name="symptoms" value={formData.symptoms} onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg" placeholder="chest pain, breathlessness" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Severity *</label>
                      <select name="severity" value={formData.severity} onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg">
                        <option value="mild">Mild</option>
                        <option value="moderate">Moderate</option>
                        <option value="severe">Severe</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Allergies (comma-separated)</label>
                      <input type="text" name="allergies" value={formData.allergies} onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg" placeholder="Penicillin, Peanuts" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Chronic Diseases (comma-separated)</label>
                      <input type="text" name="chronicDiseases" value={formData.chronicDiseases} onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg" placeholder="Hypertension, Diabetes" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Current Medications (comma-separated)</label>
                      <input type="text" name="currentMedications" value={formData.currentMedications} onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg" placeholder="Metformin, Amlodipine" />
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setStep(2)}
                        className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Back</button>
                      <button type="button" onClick={() => setStep(4)} disabled={!formData.admissionReason}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Next</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Bed Assignment</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Bed Type *</label>
                      <select name="bedType" value={formData.bedType} onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg">
                        <option value="general">General</option>
                        <option value="icu">ICU</option>
                        <option value="emergency">Emergency</option>
                        <option value="ventilator">Ventilator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Expected Stay (hours)</label>
                      <input type="number" name="expectedStayDuration" value={formData.expectedStayDuration} onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg" placeholder="48" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Available Beds</label>
                      {loadingBeds ? (
                        <div className="space-y-2">
                          <div className="h-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                      ) : availableBeds.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {availableBeds.map((bed) => (
                            <div key={bed._id} onClick={() => setSelectedBed(bed._id)}
                              className={`p-4 border-2 rounded-lg cursor-pointer ${
                                selectedBed === bed._id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
                              }`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Bed className="w-5 h-5 text-blue-600" />
                                <span className="font-bold">{bed.bedNumber}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                <div>Floor: {bed.floor}</div>
                                <div>Ward: {bed.ward}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                          <span>No available beds of type {formData.bedType}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setStep(3)}
                        className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">Back</button>
                      <button type="submit" disabled={loading || !selectedBed}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50">
                        {loading ? "Admitting..." : "Admit Patient"}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
    <HPFooter />
    </>
  );
}
