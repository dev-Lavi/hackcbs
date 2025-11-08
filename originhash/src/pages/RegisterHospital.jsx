import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import HPHeader from "../components/HPHeader";
import HPFooter from "../components/HPFooter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Bed,
  Heart,
  AlertCircle,
  Activity,
  Ambulance,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Indian states
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// Facility options
const FACILITIES = [
  "ICU",
  "Emergency",
  "Ventilator",
  "Ambulance",
  "Blood Bank",
  "CT Scan",
  "MRI",
  "Oxygen",
  "Operation Theater",
];

// Zod validation schema
const hospitalSchema = z.object({
  // Basic Information
  name: z.string().min(3, "Hospital name must be at least 3 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City name is required"),
  state: z.string().min(2, "State is required"),
  pincode: z
    .string()
    .regex(/^[1-9][0-9]{5}$/, "Invalid PIN code format")
    .length(6, "PIN code must be 6 digits"),

  // Location coordinates
  latitude: z
    .number()
    .min(-90, "Invalid latitude")
    .max(90, "Invalid latitude")
    .or(z.string().transform((val) => parseFloat(val))),
  longitude: z
    .number()
    .min(-180, "Invalid longitude")
    .max(180, "Invalid longitude")
    .or(z.string().transform((val) => parseFloat(val))),

  // Contact Information
  contactNumber: z
    .string()
    .regex(/^[0-9]{3}-[0-9]{8}$/, "Format: 080-12345678"),
  emergencyNumber: z
    .string()
    .regex(/^[0-9]{3}-[0-9]{8}$/, "Format: 080-12345678"),
  email: z.string().email("Invalid email address"),

  // Facilities
  facilities: z.array(z.string()).min(1, "Select at least one facility"),

  // Total Beds
  totalBedsGeneral: z.number().min(0, "Must be 0 or more"),
  totalBedsIcu: z.number().min(0, "Must be 0 or more"),
  totalBedsEmergency: z.number().min(0, "Must be 0 or more"),
  totalBedsVentilator: z.number().min(0, "Must be 0 or more"),

  // Available Beds
  availableBedsGeneral: z.number().min(0, "Must be 0 or more"),
  availableBedsIcu: z.number().min(0, "Must be 0 or more"),
  availableBedsEmergency: z.number().min(0, "Must be 0 or more"),
  availableBedsVentilator: z.number().min(0, "Must be 0 or more"),

  // Ambulances
  totalAmbulances: z.number().min(0, "Must be 0 or more"),
  availableAmbulances: z.number().min(0, "Must be 0 or more"),
}).refine(
  (data) => data.availableBedsGeneral <= data.totalBedsGeneral,
  {
    message: "Available beds cannot exceed total beds",
    path: ["availableBedsGeneral"],
  }
).refine(
  (data) => data.availableBedsIcu <= data.totalBedsIcu,
  {
    message: "Available beds cannot exceed total beds",
    path: ["availableBedsIcu"],
  }
).refine(
  (data) => data.availableBedsEmergency <= data.totalBedsEmergency,
  {
    message: "Available beds cannot exceed total beds",
    path: ["availableBedsEmergency"],
  }
).refine(
  (data) => data.availableBedsVentilator <= data.totalBedsVentilator,
  {
    message: "Available beds cannot exceed total beds",
    path: ["availableBedsVentilator"],
  }
).refine(
  (data) => data.availableAmbulances <= data.totalAmbulances,
  {
    message: "Available ambulances cannot exceed total ambulances",
    path: ["availableAmbulances"],
  }
);

export default function HospitalRegistration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      latitude: "",
      longitude: "",
      contactNumber: "",
      emergencyNumber: "",
      email: "",
      facilities: [],
      totalBedsGeneral: 0,
      totalBedsIcu: 0,
      totalBedsEmergency: 0,
      totalBedsVentilator: 0,
      availableBedsGeneral: 0,
      availableBedsIcu: 0,
      availableBedsEmergency: 0,
      availableBedsVentilator: 0,
      totalAmbulances: 0,
      availableAmbulances: 0,
    },
  });

  const steps = [
    {
      id: 0,
      title: "Basic Information",
      description: "Hospital details and address",
      icon: Building2,
    },
    {
      id: 1,
      title: "Contact & Location",
      description: "Contact details and coordinates",
      icon: MapPin,
    },
    {
      id: 2,
      title: "Facilities",
      description: "Available medical facilities",
      icon: Heart,
    },
    {
      id: 3,
      title: "Bed Capacity",
      description: "Total and available beds",
      icon: Bed,
    },
    {
      id: 4,
      title: "Ambulance Fleet",
      description: "Ambulance availability",
      icon: Ambulance,
    },
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        location: {
          type: "Point",
          coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
        },
        contactNumber: data.contactNumber,
        emergencyNumber: data.emergencyNumber,
        email: data.email,
        facilities: data.facilities,
        totalBeds: {
          general: data.totalBedsGeneral,
          icu: data.totalBedsIcu,
          emergency: data.totalBedsEmergency,
          ventilator: data.totalBedsVentilator,
        },
        availableBeds: {
          general: data.availableBedsGeneral,
          icu: data.availableBedsIcu,
          emergency: data.availableBedsEmergency,
          ventilator: data.availableBedsVentilator,
        },
        ambulances: {
          total: data.totalAmbulances,
          available: data.availableAmbulances,
        },
      };

      const response = await fetch(`${BASE_URL}/api/hospitals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitSuccess(true);
        form.reset();
        setCurrentStep(0);
      } else {
        setSubmitError(result.message || "Failed to register hospital");
      }
    } catch (error) {
      setSubmitError("Network error. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    const fields = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fields);

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0:
        return ["name", "address", "city", "state", "pincode"];
      case 1:
        return ["latitude", "longitude", "contactNumber", "emergencyNumber", "email"];
      case 2:
        return ["facilities"];
      case 3:
        return [
          "totalBedsGeneral",
          "totalBedsIcu",
          "totalBedsEmergency",
          "totalBedsVentilator",
          "availableBedsGeneral",
          "availableBedsIcu",
          "availableBedsEmergency",
          "availableBedsVentilator",
        ];
      case 4:
        return ["totalAmbulances", "availableAmbulances"];
      default:
        return [];
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <>
      <HPHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4 mt-16">
        <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Hospital Registration
          </h1>
          <p className="text-gray-600 text-lg">
            Register your hospital to help patients find emergency beds
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
        </motion.div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8 overflow-x-auto pb-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex flex-col items-center min-w-[100px] ${
                  index <= currentStep ? "opacity-100" : "opacity-40"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    index < currentStep
                      ? "bg-green-500 text-white"
                      : index === currentStep
                      ? "bg-blue-600 text-white ring-4 ring-blue-200"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <StepIcon className="w-6 h-6" />
                  )}
                </div>
                <span className="text-xs font-medium text-center hidden sm:block">
                  {step.title}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Success Alert */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Hospital registered successfully! You can now proceed to update bed availability.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(steps[currentStep].icon, {
                  className: "w-6 h-6 text-blue-600",
                })}
                {steps[currentStep].title}
              </CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {/* Step 0: Basic Information */}
                    {currentStep === 0 && (
                      <motion.div
                        key="step0"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hospital Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., Apollo Hospital"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Street address"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City *</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Bangalore" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State *</FormLabel>
                                <FormControl>
                                  <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    {...field}
                                  >
                                    <option value="">Select State</option>
                                    {INDIAN_STATES.map((state) => (
                                      <option key={state} value={state}>
                                        {state}
                                      </option>
                                    ))}
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="pincode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>PIN Code *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="6-digit PIN code"
                                  maxLength={6}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Enter 6-digit PIN code (e.g., 560076)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {/* Step 1: Contact & Location */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="latitude"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Latitude *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="e.g., 12.9716"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value) || "")
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="longitude"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Longitude *</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="any"
                                    placeholder="e.g., 77.5946"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(parseFloat(e.target.value) || "")
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="hospital@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="contactNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Number *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="080-12345678"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Format: 080-12345678
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="emergencyNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Emergency Number *</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="080-12345678"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Format: 080-12345678
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Facilities */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="facilities"
                          render={() => (
                            <FormItem>
                              <FormLabel>Available Facilities *</FormLabel>
                              <FormDescription>
                                Select all facilities available at your hospital
                              </FormDescription>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                                {FACILITIES.map((facility) => (
                                  <FormField
                                    key={facility}
                                    control={form.control}
                                    name="facilities"
                                    render={({ field }) => (
                                      <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(facility)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([
                                                    ...field.value,
                                                    facility,
                                                  ])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== facility
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                          {facility}
                                        </FormLabel>
                                      </FormItem>
                                    )}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {/* Step 3: Bed Capacity */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {[
                          { type: "General", icon: Bed, prefix: "General" },
                          { type: "ICU", icon: Heart, prefix: "Icu" },
                          { type: "Emergency", icon: AlertCircle, prefix: "Emergency" },
                          { type: "Ventilator", icon: Activity, prefix: "Ventilator" },
                        ].map(({ type, icon: Icon, prefix }) => (
                          <Card key={type} className="p-4 bg-gray-50">
                            <div className="flex items-center gap-2 mb-4">
                              <Icon className="w-5 h-5 text-blue-600" />
                              <h3 className="font-semibold text-lg">{type} Beds</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`totalBeds${prefix}`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Total Beds</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="0"
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(parseInt(e.target.value) || 0)
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`availableBeds${prefix}`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Available Beds</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="0"
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(parseInt(e.target.value) || 0)
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </Card>
                        ))}
                      </motion.div>
                    )}

                    {/* Step 4: Ambulance Fleet */}
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Ambulance className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">Ambulance Fleet</h3>
                              <p className="text-sm text-gray-600">
                                Manage your ambulance availability
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="totalAmbulances"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Total Ambulances</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      placeholder="e.g., 6"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(parseInt(e.target.value) || 0)
                                      }
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Total ambulances in your fleet
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="availableAmbulances"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Available Ambulances</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="0"
                                      placeholder="e.g., 4"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(parseInt(e.target.value) || 0)
                                      }
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Currently available ambulances
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0 || isSubmitting}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    {currentStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Register Hospital
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button type="button" onClick={nextStep}>
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    <HPFooter />
    </>
  );
}
