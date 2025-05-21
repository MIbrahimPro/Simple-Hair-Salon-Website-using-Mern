// scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');
const GeneralInfo = require('../models/GeneralInfo');

async function seed() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hairsalon';

  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('🔌 Connected to MongoDB');

    const generalInfoCount = await GeneralInfo.countDocuments({});
    
    if (generalInfoCount > 0) {
      console.log('✅ General info data already present. Skipping full database re-initialization.');
      mongoose.connection.close();
      return;
    }

    console.log('⚠️ General info not found or not sufficient. Proceeding to clear and re-initialize database.');

    console.log('🗑️ Clearing existing data from collections...');
    await Service.deleteMany({});
    await Appointment.deleteMany({});
    await GeneralInfo.deleteMany({});
    console.log('🗑️ All data cleared.');

    const services = await Service.insertMany([
      {
        name: 'Classic Cut',
        description: 'A timeless haircut tailored to your style.',
        price: 25,
        durationInMinutes: 30,
        beforeImage: 'uploads/service1_before.jpg',
        afterImage: 'uploads/service1_after.jpg'
      },
      {
        name: 'Color & Highlights',
        description: 'Custom color and highlights for a fresh look.',
        price: 75,
        durationInMinutes: 90,
        beforeImage: 'uploads/service2_before.jpg',
        afterImage: 'uploads/service2_after.jpg'
      }
    ]);
    console.log('🌟 Inserted services:', services.map(s => s.name));

    const now = new Date();
    const appointments = [
      {
        service: services[0]._id,
        name: 'Alice Example',
        email: 'alice@example.com',
        phoneNumber: '03001234567',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
        time: '10:00',
        status: 'pending'
      },
      {
        service: services[1]._id,
        name: 'Bob Sample',
        email: '',
        phoneNumber: '03007654321',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
        time: '14:30',
        status: 'confirmed'
      }
    ];

    const bookings = await Appointment.insertMany(appointments);
    console.log('📅 Inserted appointments for:', bookings.map(b => b.name));

    const general = new GeneralInfo({
      username: 'admin',
      password: 'admin123',
      email: 'info@hairsalon.com',
      phoneNumber: '03009876543',
      address: '123 Salon St., Your City'
    });
    await general.save();
    console.log('🔑 Inserted general info for admin user');

    console.log('✅ Seeding complete!');

  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
      console.log('🔌 MongoDB connection closed.');
    }
  }
}

seed(); 