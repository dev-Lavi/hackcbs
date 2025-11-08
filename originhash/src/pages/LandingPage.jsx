import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import HPHeader from '@/components/HPHeader';
import HPFooter from '@/components/HPFooter';

const LandingPage = () => {
  const brands = [
    { name: 'Amazon', logo: '/amazon.svg' },
    { name: 'Apple', logo: '/apple.svg' },
    { name: 'Spotify', logo: '/spotify.svg' },
    { name: 'Microsoft', logo: '/microsoft.svg' },
  ];

  const advantages = [
    { number: '2400+', label: 'Happy Customers' },
    { number: '24/7', label: 'Expert Team' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <HPHeader />
      
      <main className="pt-24">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your <span className="text-blue-600">trusted partner</span>
                <br />in digital healthcare.
              </h1>
              
              <p className="text-gray-600 mb-8 text-lg">
                Experience the best medical care at your fingertips. Connect with certified doctors, 
                manage prescriptions and schedule appointments with ease. Ready to 
                take control of your health?
              </p>

              <Button 
                size="lg" 
                className="bg-blue-500 hover:bg-blue-600 mb-12"
              >
                Book an appointment →
              </Button>

              {/* Trusted By Section */}
              <div>
                <p className="text-sm text-gray-500 mb-4">Trusted by</p>
                <div className="flex space-x-6 items-center">
                  {brands.map((brand) => (
                    <motion.img
                      key={brand.name}
                      src={brand.logo}
                      alt={brand.name}
                      className="h-8 w-auto grayscale hover:grayscale-0 transition-all"
                      whileHover={{ scale: 1.1 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Doctor Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* Blue Background */}
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-10 blur-3xl" />
              
              {/* Rating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute top-4 right-4 z-10"
              >
                <Card className="p-4 shadow-lg">
                  {advantages.map((advantage, index) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <div className="font-bold text-xl text-blue-600">{advantage.number}</div>
                      <div className="text-sm text-gray-600">{advantage.label}</div>
                    </div>
                  ))}
                </Card>
              </motion.div>

              {/* Dotted Line Path */}
              <svg
                className="absolute bottom-20 left-0 w-full h-32 z-0"
                viewBox="0 0 800 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 50 C 200 50, 600 50, 800 50"
                  stroke="#2196F3"
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-16"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>

              {/* Doctor Image */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative z-0 max-w-md mx-auto"
              >
                <img
                  src="/doctor.png"
                  alt="Doctor"
                  className="w-[80%] h-auto rounded-lg shadow-2xl mx-auto"
                />
              </motion.div>

              {/* Easy Appointment Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-4 left-4 z-10"
              >
                <Card className="p-4 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium">Easy Appointment Booking</span>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* Booking Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-16 bg-white rounded-lg p-8 shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-6">
              Easily book an appointment in 3 simple steps.
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <input
                type="email"
                placeholder="Email Address"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="tel"
                placeholder="Contact Number"
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button className="bg-blue-500 hover:bg-blue-600">
                Book Now
              </Button>
            </div>
          </motion.div>

          {/* Services Section */}
          <div className="relative mt-32 mb-24">
            {/* Wave decorations */}
            <img 
              src="/wave-top-left.png" 
              alt="" 
              className="absolute -top-10 left-0 w-32 opacity-50"
            />
            <img 
              src="/wave-bottom-right.png" 
              alt="" 
              className="absolute -bottom-10 right-0 w-32 opacity-50"
            />
            
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Top <span className="text-blue-500">services</span> we offer
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                In today's fast-paced world, your health deserves the utmost attention and convenience. That's why HealthNet offers a suite of integrated services designed to cater to your healthcare needs digitally.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Service Cards */}
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <img src="/AlarmBlue.svg" alt="" className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Emergency Mode</h3>
                  <p className="text-gray-600">
                    When every second counts, MRGENSEE’s Emergency Mode kicks in — instantly recommending the nearest emergency room with real-time availability. It auto-detects hospital capacity, ER load, and ambulance readiness to guide you to the right facility, fast. No guesswork. Just the quickest, smartest route to care.
                  </p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <img src="/route.svg" alt="" className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Route Optimization</h3>
                  <p className="text-gray-600">
MRGENSEE sorts hospitals by real-time travel time, helping users reach the fastest available care instantly.
                  </p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <img src="hospitalicon.svg" alt="" className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Verified Hospital</h3>
                  <p className="text-gray-600">
Only trusted hospitals make it to MRGENSEE. Each one is securely onboarded and verified for authenticity, ensuring accurate, real-time data when it matters most.
                  </p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <img src="/medicine.svg" alt="" className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Real-time Hospital Data</h3>
                  <p className="text-gray-600">
MRGENSEE shows live updates on bed availability, ER load, and doctor status — so you’re never guessing.
                  </p>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <img src="/hospitalicon.svg" alt="" className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Medicine Refills</h3>
                  <p className="text-gray-600">
                    Skip the pharmacy queues and save time - easy-to-ordering medicine refills online.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Get to Know Us Section */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl font-bold mb-4">
                  HealthNet's <span className="text-blue-500">Story:</span> Get to know us
                </h2>
                <p className="text-gray-600 mb-6">
                  HealthNet is more than just an online medical service; it's a movement towards accessible, efficient, and compassionate healthcare for all. Founded by a team of visionary doctors, healthcare professionals, and technology experts, we are driven by the mission to deliver exceptional medical care directly to you, no matter where you are. Our platform is built on the pillars of trust, innovation, and patient centricity, ensuring that every interaction is personalized and every treatment plan is tailored to your unique needs. With a network of expert practitioners and state-of-the-art medical facilities, comprehensive care that's just a click away.
                </p>
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
                  Learn more about us
                </Button>
              </div>
              <div className=" w-[80%] h-auto order-1 md:order-2">
                <img 
                  src="/hospitalrush.png" 
                  alt="Our Medical Team" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>

          {/* How Our Platform Works Section */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                How <span className="text-blue-500">our platform</span> works
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Navigating your healthcare journey with HealthNet is seamless. Just follow these steps mentioned
                below to proceed with your selected services. You can also see our FAQ section for more guidance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Steps */}
              <div className="space-y-12">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  className="flex gap-6"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                    <p className="text-gray-600">
                      Sign up and fill in your medical history securely.
                      Setting up your profile this way would ensure that
                      you stay up-to-date with your medical processes.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-6"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Choose Your Service</h3>
                    <p className="text-gray-600">
                      Select from our range of services and book a
                      consultation. Booking a consultation with
                      HealthNet is fairly simple and straight-forward.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-6"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Meet Your Doctor</h3>
                    <p className="text-gray-600">
                      Have a virtual consultation with one of our certified
                      specialists, or go for a physical visit to the doctor in
                      case you opted for a physical check-up.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Doctor Image with Gradient Background */}
{/* Doctor Image with Logo Overlay */}
<div className="relative">
  {/* Background with subtle gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-blue-200/30 rounded-3xl" />
  
  <div className="relative">
    {/* Main Doctor Image */}
    <img
      src="/doctor-consultation.png"
      alt="Doctor Consultation"
      className="w-[50%] h-[50%] rounded-3xl"
    />
    
    {/* Top Badge */}
    <div className="absolute top-6 right-6 bg-white px-5 py-2.5 rounded-full shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-blue-600 text-lg">★</span>
        <span className="font-semibold text-gray-800 text-sm">Best Certified Team of Specialists</span>
      </div>
    </div>
    
    {/* Bottom Right Logo/Icon Badge */}
    <div className="absolute bottom-8 right-8 bg-white p-4 rounded-2xl shadow-lg">
      <div className="relative">
        {/* Medical Cross/Plus Icon with pulse effect */}
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <svg 
            className="w-10 h-10 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M4.8 12h14.4M12 4.8v14.4" 
            />
          </svg>
        </div>
        
        {/* Heartbeat/Pulse line overlay */}
        <div className="absolute -top-2 -right-2">
          <svg 
            className="w-8 h-8 text-blue-600" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2}
              d="M3 12h3l2-4 4 8 2-4h3"
            />
          </svg>
        </div>
      </div>
      
      {/* Badge Text */}
      <div className="mt-2 text-center">
        <div className="flex items-center gap-1 justify-center">
          <span className="text-blue-600">★</span>
          <span className="font-semibold text-xs text-blue-600">Real-time Emergency Routing</span>
        </div>
      </div>
    </div>
  </div>
</div>

            </div>
          </div>

          {/* Patient Testimonials Section */}
          <div className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-blue-500">Patient Testimonials:</span>
                <br />Hear from Those We've Cared For
              </h2>
              <p className="text-gray-600">
                Discover the difference we make through the voices of those we've served!
              </p>
            </div>

            {/* Reviews Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <Card className="p-6">
                <div className="flex gap-4">
                  <img src="/reviewer1.svg" alt="Linda A." className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <p className="text-gray-600 mb-2">
                      "After my knee surgery, the convenience of online consultations made my recovery smoother than I could have imagined."
                    </p>
                    <p className="font-semibold">- Arjun M.</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex gap-4">
                  <img src="/reviewer2.svg" alt="Henry B." className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <p className="text-gray-600 mb-2">
                      "Managing chronic conditions like diabetes requires a lot of vigilance, but the medicine refill system has simplified my life."
                    </p>
                    <p className="font-semibold">- Riya K.</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">10,000+</div>
                <div className="text-gray-600">Successful Consultations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">2,500+</div>
                <div className="text-gray-600">Healthcare Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">98%</div>
                <div className="text-gray-600">Patient Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">200+</div>
                <div className="text-gray-600">Top Specialists</div>
              </div>
            </div>

            {/* More Reviews */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <div className="flex gap-4">
                  <img src="/reviewer3.svg" alt="Joshua T." className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <p className="text-gray-600 mb-2">
                      "The prescription refill system is a game-changer for managing my diabetes. It's really efficient and completely hassle-free!"
                    </p>
                    <p className="font-semibold">- Dr. Neha S., Emergency Coordinator.</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex gap-4">
                  <img src="/reviewer4.svg" alt="Samantha K." className="w-16 h-16 rounded-full object-cover" />
                  <div>
                    <p className="text-gray-600 mb-2">
                      "Finding a doctor who really understands all of my health needs has never been easier. This platform has changed my life!"
                    </p>
                    <p className="font-semibold">– CityCare Hospital Admin.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

        </div>
      </main>
      <HPFooter />
    </div>
  );
};

export default LandingPage;