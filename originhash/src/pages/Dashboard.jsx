import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Ambulance, 
  Heart, 
  Bed, 
  Activity,
  AlertCircle,
  CheckCircle,
  ExternalLink 
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import HPHeader from "../components/HPHeader";
import HPFooter from "../components/HPFooter";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Bed type icons mapping
const bedTypeIcons = {
  general: Bed,
  icu: Heart,
  emergency: AlertCircle,
  ventilator: Activity
};

function HospitalCard({ hospital, index }) {
  const getBedAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "text-green-600 bg-green-50";
    if (percentage > 20) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 widht">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {hospital.name}
              </h3>
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                <span>{hospital.address}, {hospital.city}</span>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline" className="text-blue-600">
                  <Navigation className="w-3 h-3 mr-1" />
                  {hospital.distance.toFixed(2)} km away
                </Badge>
                {hospital.isActive && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Bed Availability Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(hospital.availableBeds).map(([type, available]) => {
              const total = hospital.totalBeds[type];
              const Icon = bedTypeIcons[type];
              return (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.05 }}
                  className={`p-3 rounded-lg ${getBedAvailabilityColor(available, total)} border`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">{type}</span>
                  </div>
                  <div className="text-2xl font-bold">{available}</div>
                  <div className="text-xs opacity-75">of {total} available</div>
                </motion.div>
              );
            })}
          </div>

          {/* Ambulance Availability */}
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Ambulance className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-700">Ambulances</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-blue-600">
                {hospital.ambulances.available}
              </span>
              <span className="text-sm text-gray-600"> / {hospital.ambulances.total}</span>
            </div>
          </div>

          {/* Facilities */}
          <div className="flex flex-wrap gap-2">
            {hospital.facilities.slice(0, 5).map((facility, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {facility}
              </Badge>
            ))}
            {hospital.facilities.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{hospital.facilities.length - 5} more
              </Badge>
            )}
          </div>

          {/* Contact Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={() => window.open(`tel:${hospital.emergencyNumber}`)}
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergency: {hospital.emergencyNumber}
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${hospital.location.coordinates[1]},${hospital.location.coordinates[0]}`)}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function EmergencyBedFinder() {
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [selectedBedType, setSelectedBedType] = useState("icu");
const [maxDistance, setMaxDistance] = useState(50000); // Changed from 10000 to 50000 (50km)


  const bedTypes = [
    { value: "general", label: "General", icon: Bed },
    { value: "icu", label: "ICU", icon: Heart },
    { value: "emergency", label: "Emergency", icon: AlertCircle },
    { value: "ventilator", label: "Ventilator", icon: Activity }
  ];

  const getUserLocation = () => {
    setLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        fetchNearbyHospitals(longitude, latitude, selectedBedType);
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied. Please enable location permissions.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const fetchNearbyHospitals = async (longitude, latitude, bedType) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/hospitals/nearby?longitude=${longitude}&latitude=${latitude}&maxDistance=${maxDistance}&bedType=${bedType}`
      );
      const data = await response.json();
      
      if (data.success) {
        setHospitals(data.data);
      } else {
        setLocationError("Failed to fetch hospitals");
      }
    } catch (error) {
      setLocationError("Error connecting to server");
      console.error("Error fetching hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (userLocation) {
      setLoading(true);
      fetchNearbyHospitals(userLocation.longitude, userLocation.latitude, selectedBedType);
    } else {
      getUserLocation();
    }
  };

  return (
        <>
      <HPHeader />
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 mt-20">
      <main className="p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Heart className="w-8 h-8 text-red-600 animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Emergency Bed Finder
          </h1>
          <p className="text-gray-600 text-lg">
            Find nearby hospitals with available beds in real-time
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-8 shadow-lg border-2">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Location Status */}
                {userLocation && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Location detected: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                    </AlertDescription>
                  </Alert>
                )}

                {locationError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{locationError}</AlertDescription>
                  </Alert>
                )}

                {/* Bed Type Selection */}
                <div>
                  <label className="block font-semibold mb-3 text-gray-700">
                    Select Bed Type Needed
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {bedTypes.map(({ value, label, icon: Icon }) => (
                      <motion.button
                        key={value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedBedType(value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedBedType === value
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                          selectedBedType === value ? "text-blue-600" : "text-gray-500"
                        }`} />
                        <div className={`font-semibold ${
                          selectedBedType === value ? "text-blue-600" : "text-gray-700"
                        }`}>
                          {label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Search Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full h-12 text-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-5 h-5 mr-2" />
                        {userLocation ? "Search Again" : "Find Nearby Hospitals"}
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((j) => (
                        <Skeleton key={j} className="h-20" />
                      ))}
                    </div>
                    <Skeleton className="h-12 w-full" />
                  </div>
                </Card>
              ))}
            </motion.div>
          ) : hospitals.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Found {hospitals.length} Hospital{hospitals.length !== 1 ? "s" : ""}
                </h2>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Activity className="w-4 h-4 mr-2" />
                  {selectedBedType.toUpperCase()} Beds
                </Badge>
              </div>
              {hospitals.map((hospital, index) => (
                <HospitalCard key={hospital._id} hospital={hospital} index={index} />
              ))}
            </motion.div>
          ) : !loading && userLocation && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Hospitals Found
              </h3>
              <p className="text-gray-500 mb-4">
                Try increasing the search distance or selecting a different bed type
              </p>
              <Button onClick={handleSearch} variant="outline">
                Search Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
        <HPFooter />
    </>
  );
}
