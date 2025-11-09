import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import HPHeader from '@/components/HPHeader';
import HPFooter from '@/components/HPFooter';

const LandingPage = () => {
  const brands = [
  { name: "Hospital",   logo: "/brand/HospitalBuilding.png" },
  { name: "Ventilator", logo: "/brand/Ventilator.png" },
  { name: "Oxygen",     logo: "/brand/O2Can.png" },
  { name: "Blood Bag",  logo: "/brand/BloodBag.png" },
  { name: "Records",    logo: "/brand/ClipBoard.png" },
  { name: "Emergency",  logo: "/brand/Alarm.png" },
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
        <div className="container mx-auto px-4 py-12 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
  <span className="sm:whitespace-nowrap">
    Smart <span className="text-blue-500">Emergency Access</span>,
  </span>
  <br className="hidden sm:block" />
  Simplified.
</h1>



<div className="text-base md:text-lg text-gray-600 max-w-xl leading-relaxed">
  <p className="font-semibold text-blue-600 mb-2">
    Empowering Emergency Response.
  </p>
  <p className="text-gray-600">
    MRGENSEE helps patients and families locate the nearest verified hospitals
    with live updates on ER load, bed availability, and doctor readiness.
  </p>
  <p className="mt-2">
    <span className="text-blue-600 font-medium">Get connected</span> instantly, save time, and reach care when it matters most.
  </p>
</div>

              <a
  href="/services"
  className="
    inline-flex items-center
    rounded-2xl px-7 md:px-10 py-4 md:py-5
    text-white text-xl md:text-2xl font-semibold
    bg-gradient-to-r from-[#FFA1A1] via-[#FF5C4D] to-[#E30613]
    shadow-[0_10px_30px_rgba(227,6,19,0.30)]
    hover:shadow-[0_16px_36px_rgba(227,6,19,0.40)]
    transition-all duration-200
    mb-12 no-underline
  "
>
  <span className="mr-3">Emergency!</span>
  <svg
    className="w-6 h-6 translate-x-0 transition-transform group-hover:translate-x-1"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
</a>



              {/* Trusted By Section */}
              <div>
                <p className="mt-6 text-sm text-gray-500">
  Trusted by hospitals and responders across India.
</p>
<div className="mt-3 flex flex-wrap items-center gap-6 grayscale opacity-80">
  {brands.map((brand) => (
    <motion.img
      key={brand.name}
      src={brand.logo}
      alt={brand.name}
      className="h-10 w-auto"
      loading="lazy"
      whileHover={{ scale: 1.06 }}
      transition={{ duration: 0.15 }}
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
                  <Card className="p-6 rounded-2xl shadow-sm border border-sky-100 text-center">
  <div className="text-4xl font-extrabold text-sky-500">700+</div>
  <div className="text-gray-800 font-medium mt-1">Active Partners</div>
  <div className="text-yellow-400 text-xl mt-2">★★★★☆</div>
  <div className="text-gray-500 text-sm mt-1">(4.7 Stars)</div>
</Card>

                </Card>
              </motion.div>

              {/* Dotted line path (animated, inline SVG) */}
<svg
  className="pointer-events-none select-none absolute left-1/2 -translate-x-1/2 -bottom-10 md:-bottom-14 w-[115%] max-w-none z-0"
  viewBox="-20 0 820 360"
  preserveAspectRatio="none"
  aria-hidden="true"
>
  <defs>
    <linearGradient id="hpGrad" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0%" stopColor="#93C5FD" />   {/* sky-300 */}
      <stop offset="100%" stopColor="#60A5FA" /> {/* sky-400 */}
    </linearGradient>
  </defs>

  <path
    d="M782.25 1.56367C747.888 1.61145 713.459 -3.07487 683.033 15.9383C664.093 27.7736 651.844 46.2021 641.229 65.4059C627.84 89.6298 618.722 117.703 597.696 135.812C576.67 153.921 550.649 164.878 524.887 170.751C493.667 177.869 464.042 157.157 442.936 136.195C416.997 110.432 398.731 75.438 398.248 38.2754C398.087 25.9285 407.486 12.2598 420.653 10.6922C443.4 7.98395 446.814 76.0201 447.393 89.2914C448.154 106.721 449.193 125.531 443.782 142.391C432.507 177.519 378.268 190.18 370.025 192.112C361.782 194.045 305.638 208.513 251.227 217.568C196.815 226.624 133.933 221.525 79.6634 239.246C52.1517 248.229 23.401 264.932 5.61717 288.172C-8.01817 305.99 -7.97868 322.106 -9.79887 343.381"
    fill="none"
    stroke="url(#hpGrad)"
    strokeWidth="3"
    strokeLinecap="round"
    strokeDasharray="10 10"
  >
    <animate
      attributeName="stroke-dashoffset"
      from="0"
      to="-20"
      dur="1.2s"
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
                    <span className="text-sm font-medium">Find Hospitals near me</span>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* Booking Steps */}
          {/* <motion.div
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
          </motion.div> */}

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
              <div className="text-center mb-12">
  <h2 className="text-[38px] sm:text-[42px] font-extrabold tracking-tight text-gray-900">
    Top{" "}
    <span className="bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">
      services
    </span>{" "}
    we offer
  </h2>

  <p className="mt-4 text-base sm:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
    In today’s fast-paced world, your health deserves the utmost attention and convenience.
    That’s why <span className="font-semibold text-gray-700">MRGENSEE</span> offers a suite of
    integrated services designed to cater to your healthcare needs digitally.
  </p>
</div>

            </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl mx-auto">

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
                  <img src="/ClipBoardBlue.png" alt="" className="w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Real-time Hospital Data</h3>
                  <p className="text-gray-600">
MRGENSEE shows live updates on bed availability, ER load, and doctor status — so you’re never guessing.
                  </p>
                </div>
              </Card>

              
            </div>
          </div>

          {/* Get to know us – Hackathon Origin Edition */}
<div className="rounded-3xl bg-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.06)] ring-1 ring-black/5 mb-24">
  <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center p-6 md:p-10">
    {/* Left: Image */}
    <div className="order-2 md:order-1">
      <img
        src="/hospitalrush.png"
        alt="MRGENSEE emergency team"
        className="w-full rounded-2xl object-cover shadow-lg"
      />
    </div>

    {/* Right: Heading + Copy + CTA */}
    <div id="about-us" className="order-1 md:order-2">
      <h2 className="text-3xl md:text-[40px] leading-tight font-extrabold mb-5">
        <span className="text-[#277FFF]">MRGENSEE's </span>
        <span className="text-[#277FFF]">Story:</span>
        <span className="text-gray-900 font-semibold"> Get to know us</span>
      </h2>

      <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-8">
        MRGENSEE was born during a hackathon — an idea fueled by the regular
        shortcomings of India’s emergency response infrastructure. We witnessed
        how fragmented data, delayed routing, and poor hospital coordination
        often cost people precious time in moments of crisis. Determined to
        change that, our team built MRGENSEE as a smarter, faster, and more
        transparent way to connect patients to verified hospitals with live ER
        and bed availability updates. Every second counts, and MRGENSEE ensures
        that every route leads to care — not confusion.
      </p>

      <a
        href="/about"
        className="
          inline-flex items-center justify-center
          h-12 md:h-14 px-6 md:px-8 rounded-2xl
          text-white text-base md:text-lg font-semibold
          bg-gradient-to-r from-[#69B6FF] via-[#3B8DFF] to-[#277FFF]
          shadow-[0_12px_30px_rgba(39,127,255,0.35)]
          hover:shadow-[0_16px_36px_rgba(39,127,255,0.45)]
          transition-all
        "
      >
        Learn more about us
        <svg
          className="ml-3 w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
</div>


          {/* How Our Platform Works Section */}
          <div className="mb-24">
            <div className="text-center mb-10">
  <h2 className="text-[34px] sm:text-[40px] leading-tight font-semibold tracking-tight">
    How{" "}
    <span className="bg-gradient-to-r from-[#8FD4FF] to-[#2491FF] bg-clip-text text-transparent">
      our platform
    </span>{" "}
    <span className="text-gray-900">works</span>
  </h2>

  <p className="mt-4 text-[15px] sm:text-base text-gray-500">
    Navigating your healthcare journey with <span className="font-medium text-gray-700">MRGENSEE</span> is seamless.
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
                    <h3 className="text-xl font-semibold mb-2">Emergency Access Panel</h3>
                    <p className="text-gray-600">
                     MRGENSEE instantly scans nearby hospitals for real-time bed availability, ER load, doctor status, and travel time.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}Z
                  transition={{ delay: 0.2 }}
                  className="flex gap-6"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Scan & Sort</h3>
                    <p className="text-gray-600">
                     It auto-recommends the fastest, verified hospital and provides optimized routing — so help is never out of reach.
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
                    <h3 className="text-xl font-semibold mb-2">Real-time Status</h3>
                    <p className="text-gray-600">
                      Data reliability is ensured by hospitals continuously updating their live status (ER load, bed counts) via a simple dashboard
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

          {/* User Testimonials Section (new) */}
<div id="contact-us" className="mb-24">
  <div className="text-center mb-10">
    <h2 className="text-[34px] sm:text-[40px] leading-tight font-semibold tracking-tight">
      <span className="text-[#2491FF]">User Testimonials:</span>
      <br />
      Hear from Those We’ve Cared For
    </h2>
    <p className="mt-3 text-[15px] sm:text-base text-gray-500">
      Discover the difference we make through the voices of those we’ve served.
    </p>
  </div>

  {/* Top two quotes */}
  <div className="grid md:grid-cols-2 gap-8 mb-12">
    <Card className="p-6 border border-sky-200/70 rounded-2xl shadow-sm">
      <div className="flex gap-4">
        <img src="/reviewer1.svg" alt="Arjun M." className="w-16 h-16 rounded-full object-cover" />
        <div>
          <p className="text-gray-700">
            “During a road accident, finding an open emergency ward felt impossible. MRGENSEE guided us
            straight to a hospital that had space — it honestly saved my father’s life.”
          </p>
          <p className="mt-3 font-semibold text-gray-800">– Arjun M.</p>
        </div>
      </div>
    </Card>

    <Card className="p-6 border border-sky-200/70 rounded-2xl shadow-sm">
      <div className="flex gap-4">
        <img src="/reviewer2.svg" alt="Riya K." className="w-16 h-16 rounded-full object-cover" />
        <div>
          <p className="text-gray-700">
            “Knowing which hospital is ready for me before I even leave home gives peace of mind.
            I wish every city had something like this.”
          </p>
          <p className="mt-3 font-semibold text-gray-800">– Riya K.</p>
        </div>
      </div>
    </Card>
  </div>

  {/* Stats row */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-14 mb-14">
    <div className="text-center">
      <div className="text-4xl font-extrabold text-sky-500">10,000+</div>
      <div className="mt-1 text-gray-600">Emergency routes generated</div>
    </div>
    <div className="text-center">
      <div className="text-4xl font-extrabold text-sky-500">200+</div>
      <div className="mt-1 text-gray-600">Verified Hospitals Onboarded</div>
    </div>
    <div className="text-center">
      <div className="text-4xl font-extrabold text-sky-500">98%</div>
      <div className="mt-1 text-gray-600">Positive feedback</div>
    </div>
    <div className="text-center">
      <div className="text-4xl font-extrabold text-sky-500">2x Faster</div>
      <div className="mt-1 text-gray-600">Emergency Room ETA</div>
    </div>
  </div>

  {/* Bottom two quotes */}
  <div className="grid md:grid-cols-2 gap-8">
    <Card className="p-6 border border-sky-200/70 rounded-2xl shadow-sm">
      <div className="flex gap-4">
        <img src="/reviewer3.svg" alt="Dr. Neha S." className="w-16 h-16 rounded-full object-cover" />
        <div>
          <p className="text-gray-700">
            “Our hospital joined MRGENSEE to update bed and ER availability in real time. It’s reduced
            phone inquiries by half and helped us manage patient flow smoothly.”
          </p>
          <p className="mt-3 font-semibold text-gray-800">
            – Dr. Neha S., Emergency Coordinator
          </p>
        </div>
      </div>
    </Card>

    <Card className="p-6 border border-sky-200/70 rounded-2xl shadow-sm">
      <div className="flex gap-4">
        <img src="/reviewer4.svg" alt="CityCare Hospital Admin" className="w-16 h-16 rounded-full object-cover" />
        <div>
          <p className="text-gray-700">
            “Before MRGENSEE, patients often reached us only to be redirected elsewhere. Now they arrive
            knowing our ER status already — it’s efficient and humane.”
          </p>
          <p className="mt-3 font-semibold text-gray-800">– CityCare Hospital Admin</p>
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