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

// map bed types to icons
const bedTypeIcons = {
  general: Bed,
  icu: Heart,
  emergency: AlertCircle,
  ventilator: Activity,
};

// ---------- Card for each hospital ----------
function HospitalCard({ hospital, index }) {
  const getBedAvailabilityColor = (available, total) => {
    const pct = (available / Math.max(total || 1, 1)) * 100;
    if (pct > 50) return "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-100";
    if (pct > 20) return "text-amber-700 bg-amber-50 ring-1 ring-amber-100";
    return "text-rose-700 bg-rose-50 ring-1 ring-rose-100";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      whileHover={{ scale: 1.01 }}
      className="w-full"
    >
      <Card className="rounded-2xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] ring-1 ring-sky-100/70 hover:shadow-[0_14px_36px_rgba(2,6,23,0.10)] transition-all bg-white/90">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {hospital.name}
              </h3>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-2 text-sky-600" />
                <span>{hospital.address}, {hospital.city}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge variant="outline" className="border-sky-200 text-sky-700 bg-sky-50">
                  <Navigation className="w-3.5 h-3.5 mr-1" />
                  {hospital.distance.toFixed(2)} km away
                </Badge>
                {hospital.isActive && (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* bed availability */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(hospital.availableBeds).map(([type, available]) => {
              const total = hospital.totalBeds[type];
              const Icon = bedTypeIcons[type];
              return (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.03 }}
                  className={`p-3 rounded-xl ${getBedAvailabilityColor(available, total)} border border-white`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Icon className="w-4.5 h-4.5" />
                    <span className="text-[11px] font-semibold uppercase tracking-wide">{type}</span>
                  </div>
                  <div className="text-2xl font-extrabold">{available}</div>
                  <div className="text-[11px] opacity-75">of {total} available</div>
                </motion.div>
              );
            })}
          </div>

          {/* ambulances */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50 ring-1 ring-sky-100">
            <div className="flex items-center gap-2">
              <Ambulance className="w-5 h-5 text-sky-600" />
              <span className="font-semibold text-gray-800">Ambulances</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-sky-700">
                {hospital.ambulances.available}
              </span>
              <span className="text-sm text-gray-600"> / {hospital.ambulances.total}</span>
            </div>
          </div>

          {/* facilities */}
          <div className="flex flex-wrap gap-2">
            {hospital.facilities.slice(0, 5).map((f, i) => (
              <Badge key={i} variant="secondary" className="text-xs bg-slate-50 border border-slate-200 text-slate-700">
                {f}
              </Badge>
            ))}
            {hospital.facilities.length > 5 && (
              <Badge variant="secondary" className="text-xs bg-slate-50 border border-slate-200 text-slate-700">
                +{hospital.facilities.length - 5} more
              </Badge>
            )}
          </div>

          {/* actions */}
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[#FFA1A1] via-[#FF5C4D] to-[#E30613] shadow-[0_10px_30px_rgba(227,6,19,0.30)] hover:shadow-[0_16px_36px_rgba(227,6,19,0.40)]"
              onClick={() => window.open(`tel:${hospital.emergencyNumber}`)}
            >
              <Phone className="w-4 h-4 mr-2" />
              Emergency: {hospital.emergencyNumber}
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-xl border-sky-200"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.coordinates[1]},${hospital.location.coordinates[0]}`
                )
              }
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ---------- Page ----------
export default function EmergencyBedFinder() {
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [selectedBedType, setSelectedBedType] = useState("icu");
  const [maxDistance, setMaxDistance] = useState(50000);

  const bedTypes = [
    { value: "general", label: "General", icon: Bed },
    { value: "icu", label: "ICU", icon: Heart },
    { value: "emergency", label: "Emergency", icon: AlertCircle },
    { value: "ventilator", label: "Ventilator", icon: Activity },
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
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const fetchNearbyHospitals = async (longitude, latitude, bedType) => {
    try {
      const res = await fetch(
        `${BASE_URL}/api/hospitals/nearby?longitude=${longitude}&latitude=${latitude}&maxDistance=${maxDistance}&bedType=${bedType}`
      );
      const data = await res.json();
      if (data.success) setHospitals(data.data);
      else setLocationError("Failed to fetch hospitals");
    } catch (e) {
      setLocationError("Error connecting to server");
      console.error(e);
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

  useEffect(() => {
    // Optional: auto-attempt on mount for a smooth flow like landing CTA
    // getUserLocation();
  }, []);

  return (
    <>
      <HPHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 mt-20">
        <main className="p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mb-4 ring-1 ring-sky-200">
  <Heart className="w-8 h-8 text-sky-600 animate-pulse" />
</div>


            <h1 className="text-[38px] sm:text-[44px] font-extrabold tracking-tight text-gray-900">
              Emergency{" "}
              <span className="bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
                Bed Finder
              </span>
            </h1>

            <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
              Find nearby hospitals with available beds in real-time.
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <Card className="mb-8 rounded-2xl ring-1 ring-slate-100 shadow-[0_18px_50px_rgba(2,6,23,0.06)]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {userLocation && (
                    <Alert className="bg-emerald-50 border-emerald-200 rounded-xl">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      <AlertDescription className="text-emerald-800">
                        Location detected: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                      </AlertDescription>
                    </Alert>
                  )}

                  {locationError && (
                    <Alert variant="destructive" className="rounded-xl">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{locationError}</AlertDescription>
                    </Alert>
                  )}

                  {/* bed type tabs */}
                  <div>
                    <label className="block font-semibold mb-3 text-gray-700">
                      Select Bed Type Needed
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {bedTypes.map(({ value, label, icon: Icon }) => {
                        const active = selectedBedType === value;
                        return (
                          <motion.button
                            key={value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedBedType(value)}
                            className={[
                              "p-4 rounded-2xl border-2 transition-all text-center",
                              active
                                ? "border-sky-400 bg-sky-50 ring-1 ring-sky-100 shadow-sm"
                                : "border-slate-200 hover:border-sky-300"
                            ].join(" ")}
                          >
                            <Icon className={`w-6 h-6 mx-auto mb-2 ${active ? "text-sky-600" : "text-slate-500"}`} />
                            <div className={`font-semibold ${active ? "text-sky-700" : "text-slate-700"}`}>{label}</div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* search button */}
                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
  onClick={handleSearch}
  disabled={loading}
  className="w-full h-12 text-lg rounded-xl bg-gradient-to-r from-[#69B6FF] via-[#3B8DFF] to-[#277FFF] shadow-[0_10px_30px_rgba(39,127,255,0.30)] hover:shadow-[0_16px_36px_rgba(39,127,255,0.40)]"
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

          {/* Results */}
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
                  <Card key={i} className="p-6 rounded-2xl ring-1 ring-slate-100">
                    <div className="space-y-4">
                      <Skeleton className="h-7 w-2/3 rounded-lg" />
                      <Skeleton className="h-4 w-1/2 rounded-lg" />
                      <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((j) => (
                          <Skeleton key={j} className="h-20 rounded-xl" />
                        ))}
                      </div>
                      <Skeleton className="h-11 w-full rounded-xl" />
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
                  <Badge variant="outline" className="text-base px-4 py-2 border-sky-200 text-sky-700 bg-sky-50">
                    <Activity className="w-4 h-4 mr-2" />
                    {selectedBedType.toUpperCase()} Beds
                  </Badge>
                </div>

                {hospitals.map((h, i) => (
                  <HospitalCard key={h._id ?? i} hospital={h} index={i} />
                ))}
              </motion.div>
            ) : !loading && userLocation ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                className="text-center py-16"
              >
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Hospitals Found</h3>
                <p className="text-gray-500 mb-4">
                  Try increasing the search distance or selecting a different bed type.
                </p>
                <Button onClick={handleSearch} variant="outline" className="rounded-xl border-sky-300 text-sky-700 hover:bg-sky-50">
  Search Again
</Button>

              </motion.div>
            ) : null}
          </AnimatePresence>
        </main>
      </div>
      <HPFooter />
    </>
  );
}
