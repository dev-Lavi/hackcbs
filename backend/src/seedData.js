require('dotenv').config();
const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');
const Bed = require('./models/Bed');
const connectDB = require('./config/database');

const sampleHospitals = [
  // Original Bangalore hospitals
  {
    name: "Apollo Hospital",
    address: "154/11, Bannerghatta Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560076",
    location: {
      type: "Point",
      coordinates: [77.5946, 12.9716]
    },
    contactNumber: "080-26304050",
    emergencyNumber: "080-26304051",
    email: "apollo@bangalore.com",
    facilities: ["ICU", "Emergency", "Ventilator", "Ambulance", "Blood Bank", "CT Scan", "MRI"],
    totalBeds: {
      general: 50,
      icu: 20,
      emergency: 15,
      ventilator: 10
    },
    availableBeds: {
      general: 25,
      icu: 8,
      emergency: 7,
      ventilator: 4
    },
    ambulances: {
      total: 5,
      available: 3
    },
    isActive: true
  },
  {
    name: "Manipal Hospital",
    address: "98, HAL Airport Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560017",
    location: {
      type: "Point",
      coordinates: [77.6648, 12.9611]
    },
    contactNumber: "080-25021100",
    emergencyNumber: "080-25021101",
    email: "manipal@bangalore.com",
    facilities: ["ICU", "Emergency", "Ventilator", "Ambulance", "Oxygen"],
    totalBeds: {
      general: 40,
      icu: 15,
      emergency: 12,
      ventilator: 8
    },
    availableBeds: {
      general: 18,
      icu: 5,
      emergency: 6,
      ventilator: 3
    },
    ambulances: {
      total: 4,
      available: 2
    },
    isActive: true
  },
  {
    name: "Fortis Hospital",
    address: "14, Cunningham Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560052",
    location: {
      type: "Point",
      coordinates: [77.5937, 12.9897]
    },
    contactNumber: "080-66214444",
    emergencyNumber: "080-66214445",
    email: "fortis@bangalore.com",
    facilities: ["ICU", "Emergency", "Blood Bank", "CT Scan"],
    totalBeds: {
      general: 35,
      icu: 12,
      emergency: 10,
      ventilator: 6
    },
    availableBeds: {
      general: 12,
      icu: 3,
      emergency: 4,
      ventilator: 2
    },
    ambulances: {
      total: 3,
      available: 1
    },
    isActive: true
  },

  // Delhi NCR / Gurgaon hospitals (near 77.208, 28.5868)
  {
    name: "Medanta The Medicity",
    address: "Sector 38, Mehrauli-Gurgaon Road",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122001",
    location: {
      type: "Point",
      coordinates: [77.0680, 28.4442] // ~15km from your location
    },
    contactNumber: "011-26304050",
    emergencyNumber: "011-26304051",
    email: "medanta@gurgaon.com",
    facilities: ["ICU", "Emergency", "Ventilator", "Ambulance", "Blood Bank", "CT Scan", "MRI", "Oxygen"],
    totalBeds: {
      general: 120,
      icu: 50,
      emergency: 30,
      ventilator: 25
    },
    availableBeds: {
      general: 45,
      icu: 18,
      emergency: 12,
      ventilator: 10
    },
    ambulances: {
      total: 15,
      available: 8
    },
    isActive: true
  },
  {
    name: "Artemis Hospital",
    address: "Sector 51, Gurgaon",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122001",
    location: {
      type: "Point",
      coordinates: [77.0896, 28.4287] // ~14km from your location
    },
    contactNumber: "011-45114444",
    emergencyNumber: "011-45114445",
    email: "artemis@gurgaon.com",
    facilities: ["ICU", "Emergency", "Ventilator", "Ambulance", "Blood Bank", "CT Scan", "MRI"],
    totalBeds: {
      general: 80,
      icu: 35,
      emergency: 25,
      ventilator: 18
    },
    availableBeds: {
      general: 32,
      icu: 12,
      emergency: 10,
      ventilator: 7
    },
    ambulances: {
      total: 10,
      available: 5
    },
    isActive: true
  },
  {
    name: "Max Hospital Gurgaon",
    address: "Block B, Sushant Lok Phase 1",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122002",
    location: {
      type: "Point",
      coordinates: [77.0823, 28.4670] // ~12km from your location
    },
    contactNumber: "011-66514444",
    emergencyNumber: "011-66514445",
    email: "max@gurgaon.com",
    facilities: ["ICU", "Emergency", "Ventilator", "Ambulance", "Blood Bank", "Oxygen"],
    totalBeds: {
      general: 65,
      icu: 28,
      emergency: 20,
      ventilator: 15
    },
    availableBeds: {
      general: 28,
      icu: 10,
      emergency: 8,
      ventilator: 6
    },
    ambulances: {
      total: 8,
      available: 4
    },
    isActive: true
  },
  {
    name: "Sir Ganga Ram Hospital",
    address: "Rajinder Nagar",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110060",
    location: {
      type: "Point",
      coordinates: [77.1800, 28.6300] // ~5km from your location
    },
    contactNumber: "011-25750000",
    emergencyNumber: "011-25750001",
    email: "gangaramhosp@delhi.com",
    facilities: ["ICU", "Emergency", "Ventilator", "Ambulance", "Blood Bank", "CT Scan", "MRI", "Oxygen"],
    totalBeds: {
      general: 100,
      icu: 40,
      emergency: 28,
      ventilator: 20
    },
    availableBeds: {
      general: 42,
      icu: 15,
      emergency: 11,
      ventilator: 8
    },
    ambulances: {
      total: 12,
      available: 6
    },
    isActive: true
  },
  {
    name: "Manipal Hospital Dwarka",
    address: "Sector 6, Dwarka",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110075",
    location: {
      type: "Point",
      coordinates: [77.0382, 28.5921] // ~17km from your location
    },
    contactNumber: "011-49674967",
    emergencyNumber: "011-49674968",
    email: "manipal@dwarka.com",
    facilities: ["ICU", "Emergency", "Ventilator", "Ambulance", "Blood Bank", "Oxygen"],
    totalBeds: {
      general: 70,
      icu: 30,
      emergency: 22,
      ventilator: 16
    },
    availableBeds: {
      general: 30,
      icu: 11,
      emergency: 9,
      ventilator: 6
    },
    ambulances: {
      total: 9,
      available: 5
    },
    isActive: true
  },
  {
    name: "Fortis Memorial Research Institute",
    address: "Sector 44, Gurgaon",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122002",
    location: {
      type: "Point",
      coordinates: [77.0694, 28.4498] // ~14km from your location
    },
    contactNumber: "011-47135000",
    emergencyNumber: "011-47135001",
    email: "fortis@gurgaon.com",
    facilities: ["ICU", "Emergency", "Ventilator", "Ambulance", "Blood Bank", "CT Scan", "MRI"],
    totalBeds: {
      general: 90,
      icu: 38,
      emergency: 26,
      ventilator: 20
    },
    availableBeds: {
      general: 38,
      icu: 14,
      emergency: 10,
      ventilator: 8
    },
    ambulances: {
      total: 11,
      available: 6
    },
    isActive: true
  },
  {
    name: "Paras Hospital Gurgaon",
    address: "C-1, Sushant Lok Phase 1",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122002",
    location: {
      type: "Point",
      coordinates: [77.0842, 28.4701] // ~12km from your location
    },
    contactNumber: "011-46251000",
    emergencyNumber: "011-46251001",
    email: "paras@gurgaon.com",
    facilities: ["ICU", "Emergency", "Ventilator", "Ambulance", "Oxygen"],
    totalBeds: {
      general: 55,
      icu: 24,
      emergency: 18,
      ventilator: 12
    },
    availableBeds: {
      general: 22,
      icu: 9,
      emergency: 7,
      ventilator: 5
    },
    ambulances: {
      total: 7,
      available: 3
    },
    isActive: true
  },
  {
    name: "Columbia Asia Hospital",
    address: "Sector 34, Gurgaon",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122001",
    location: {
      type: "Point",
      coordinates: [77.0621, 28.4531] // ~13km from your location
    },
    contactNumber: "011-46760000",
    emergencyNumber: "011-46760001",
    email: "columbia@gurgaon.com",
    facilities: ["ICU", "Emergency", "Ventilator", "Ambulance", "Blood Bank", "CT Scan"],
    totalBeds: {
      general: 48,
      icu: 20,
      emergency: 16,
      ventilator: 10
    },
    availableBeds: {
      general: 18,
      icu: 7,
      emergency: 6,
      ventilator: 4
    },
    ambulances: {
      total: 6,
      available: 3
    },
    isActive: true
  }
];


const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Hospital.deleteMany({});
    await Bed.deleteMany({});

    console.log('🏥 Seeding hospitals...');
    const hospitals = await Hospital.insertMany(sampleHospitals);
    console.log(`✅ ${hospitals.length} hospitals created`);

    console.log('🛏️  Creating beds...');
    let totalBedsCreated = 0;

    for (const hospital of hospitals) {
      const beds = [];

      // General beds
      for (let i = 1; i <= hospital.totalBeds.general; i++) {
        beds.push({
          hospitalId: hospital._id,
          bedNumber: `G-${i}`,
          bedType: 'general',
          floor: Math.ceil(i / 10).toString(),
          ward: 'General Ward',
          status: i <= hospital.availableBeds.general ? 'available' : 'occupied'
        });
      }

      // ICU beds
      for (let i = 1; i <= hospital.totalBeds.icu; i++) {
        beds.push({
          hospitalId: hospital._id,
          bedNumber: `ICU-${i}`,
          bedType: 'icu',
          floor: '3',
          ward: 'ICU',
          status: i <= hospital.availableBeds.icu ? 'available' : 'occupied',
          equipment: ['Ventilator', 'Monitor', 'Oxygen']
        });
      }

      // Emergency beds
      for (let i = 1; i <= hospital.totalBeds.emergency; i++) {
        beds.push({
          hospitalId: hospital._id,
          bedNumber: `ER-${i}`,
          bedType: 'emergency',
          floor: '1',
          ward: 'Emergency',
          status: i <= hospital.availableBeds.emergency ? 'available' : 'occupied',
          equipment: ['Monitor', 'Oxygen']
        });
      }

      // Ventilator beds
      for (let i = 1; i <= hospital.totalBeds.ventilator; i++) {
        beds.push({
          hospitalId: hospital._id,
          bedNumber: `VENT-${i}`,
          bedType: 'ventilator',
          floor: '3',
          ward: 'ICU',
          status: i <= hospital.availableBeds.ventilator ? 'available' : 'occupied',
          equipment: ['Ventilator', 'Monitor', 'Oxygen', 'Suction']
        });
      }

      await Bed.insertMany(beds);
      totalBedsCreated += beds.length;
      console.log(`  ✅ Created ${beds.length} beds for ${hospital.name}`);
    }

    console.log(`\n✅ Database seeded successfully!`);
    console.log(`📊 Total: ${hospitals.length} hospitals, ${totalBedsCreated} beds`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
