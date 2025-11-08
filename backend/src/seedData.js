require('dotenv').config();
const mongoose = require('mongoose');
const Hospital = require('./models/Hospital');
const Bed = require('./models/Bed');
const connectDB = require('./config/database');

const sampleHospitals = [
  {
    name: "Apollo Hospital",
    address: "154/11, Bannerghatta Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560076",
    location: {
      type: "Point",
      coordinates: [77.5946, 12.9716] // Exact location from your query
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
      coordinates: [77.6648, 12.9611] // ~7km from first location
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
      coordinates: [77.5937, 12.9897] // ~2km from first location
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
