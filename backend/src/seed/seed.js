import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Request from '../models/Request.js';
import Volunteer from '../models/Volunteer.js';
import Donation from '../models/Donation.js';
import logger from '../utils/logger.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/siren_db';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    logger.info('Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Request.deleteMany({});
    await Volunteer.deleteMany({});
    await Donation.deleteMany({});

    logger.info('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        email: 'victim1@example.com',
        password: 'Password123',
        name: 'Karim Ahmed',
        phone: '+8801712345678',
        role: 'victim'
      },
      {
        email: 'victim2@example.com',
        password: 'Password123',
        name: 'Fatima Begum',
        phone: '+8801823456789',
        role: 'victim'
      },
      {
        email: 'volunteer1@example.com',
        password: 'Password123',
        name: 'Rahman Volunteer',
        phone: '+8801811111111',
        role: 'volunteer'
      },
      {
        email: 'volunteer2@example.com',
        password: 'Password123',
        name: 'Sakib Volunteer',
        phone: '+8801822222222',
        role: 'volunteer'
      },
      {
        email: 'official@example.com',
        password: 'Password123',
        name: 'Admin Official',
        phone: '+8801933333333',
        role: 'official'
      },
      {
        email: 'donor@example.com',
        password: 'Password123',
        name: 'generous Donor',
        phone: '+8801944444444',
        role: 'donor'
      }
    ]);

    logger.info(`Created ${users.length} users`);

    // Create emergency requests
    const requests = await Request.create([
      {
        victimName: 'Karim Ahmed',
        phone: '+8801712345678',
        email: 'karim@example.com',
        address: 'Sylhet Sadar, Sylhet',
        coordinates: { lat: 24.8949, lng: 91.8687 },
        emergencyType: 'Flood',
        description: 'House flooded due to heavy rainfall. Need immediate rescue and shelter.',
        severity: 'critical',
        status: 'pending',
        victimId: users[0]._id
      },
      {
        victimName: 'Fatima Begum',
        phone: '+8801823456789',
        email: 'fatima@example.com',
        address: 'Sunamganj Sadar, Sunamganj',
        coordinates: { lat: 25.0658, lng: 91.3950 },
        emergencyType: 'Medical Emergency',
        description: 'Elderly person suffering from fever and severe cough. Need urgent medical assistance.',
        severity: 'high',
        status: 'assigned',
        victimId: users[1]._id,
        assignedVolunteer: {
          volunteerId: users[2]._id,
          name: 'Rahman Volunteer',
          phone: '+8801811111111',
          assignedAt: new Date()
        }
      },
      {
        victimName: 'Rahim Mia',
        phone: '+8801934567890',
        email: 'rahim@example.com',
        address: 'Parshuram, Feni',
        coordinates: { lat: 23.0065, lng: 91.4205 },
        emergencyType: 'Food/Water Shortage',
        description: 'Entire family in dire need of food and clean water. Supplies are critical.',
        severity: 'high',
        status: 'in_progress',
        assignedVolunteer: {
          volunteerId: users[3]._id,
          name: 'Sakib Volunteer',
          phone: '+8801822222222',
          assignedAt: new Date()
        }
      },
      {
        victimName: 'Shahin Rahman',
        phone: '+8801945678901',
        email: 'shahin@example.com',
        address: 'Habiganj, Sylhet',
        coordinates: { lat: 24.4367, lng: 91.5468 },
        emergencyType: 'Shelter',
        description: 'Family homeless after their house collapsed. Need temporary shelter urgently.',
        severity: 'critical',
        status: 'pending'
      },
      {
        victimName: 'Nadia Akter',
        phone: '+8801956789012',
        email: 'nadia@example.com',
        address: 'Moulvibazar, Sylhet',
        coordinates: { lat: 24.4851, lng: 91.7788 },
        emergencyType: 'Rescue',
        description: 'Person stuck in flooded area. Immediate rescue operation needed.',
        severity: 'critical',
        status: 'pending'
      }
    ]);

    logger.info(`Created ${requests.length} emergency requests`);

    // Create volunteers
    const volunteers = await Volunteer.create([
      {
        userId: users[2]._id,
        name: 'Rahman Volunteer',
        email: 'rahman@example.com',
        phone: '+8801811111111',
        skills: ['First Aid', 'Emergency Response', 'CPR'],
        availability: true,
        location: { lat: 24.8949, lng: 91.8687 },
        tasksCompleted: 15,
        rating: 4.8,
        bio: 'Experienced emergency responder with 5 years of experience'
      },
      {
        userId: users[3]._id,
        name: 'Sakib Volunteer',
        email: 'sakib@example.com',
        phone: '+8801822222222',
        skills: ['Logistics', 'Distribution', 'Planning'],
        availability: true,
        location: { lat: 25.0658, lng: 91.3950 },
        tasksCompleted: 23,
        rating: 4.9,
        bio: 'Expert in supply chain and resource distribution'
      },
      {
        userId: users[4]._id,
        name: 'Nadia Helper',
        email: 'nadiah@example.com',
        phone: '+8801833333333',
        skills: ['Medical', 'Counseling', 'Community Support'],
        availability: false,
        location: { lat: 23.8759, lng: 90.3795 },
        tasksCompleted: 31,
        rating: 5.0,
        bio: 'Medical professional and community counselor'
      }
    ]);

    logger.info(`Created ${volunteers.length} volunteers`);

    // Create donations
    const donations = await Donation.create([
      {
        donorId: users[5]._id,
        donorName: 'Generous Donor',
        email: 'donor@example.com',
        phone: '+8801944444444',
        type: 'money',
        category: 'General Relief Fund',
        amount: 50000,
        currency: 'BDT',
        description: 'Donation for flood relief efforts',
        anonymous: false,
        status: 'completed',
        paymentMethod: 'bKash'
      },
      {
        donorName: 'Anonymous Contributor',
        email: 'anon@example.com',
        type: 'supply',
        category: 'Food & Water Supplies',
        items: ['Rice', 'Bottled Water', 'Dry Food'],
        quantity: 100,
        description: 'Food and water supplies for disaster victims',
        anonymous: true,
        status: 'completed',
        paymentMethod: 'Direct'
      },
      {
        donorId: users[5]._id,
        donorName: 'Generous Donor',
        email: 'donor@example.com',
        phone: '+8801944444444',
        type: 'money',
        category: 'Medical Supplies & Treatment',
        amount: 75000,
        currency: 'BDT',
        description: 'Medical emergency fund',
        anonymous: false,
        status: 'completed',
        paymentMethod: 'Card'
      },
      {
        donorName: 'Willing Helper',
        email: 'helper@example.com',
        phone: '+8801955555555',
        type: 'supply',
        category: 'Shelter & Rehabilitation',
        items: ['Blankets', 'Tents', 'Mats'],
        quantity: 50,
        description: 'Shelter materials for homeless families',
        anonymous: false,
        status: 'verified'
      },
      {
        donorName: 'Corporate Sponsor',
        email: 'corporate@company.com',
        phone: '+8801966666666',
        type: 'money',
        category: 'Rescue Operations',
        amount: 200000,
        currency: 'BDT',
        description: 'Corporate donation for rescue operations',
        anonymous: false,
        status: 'completed',
        paymentMethod: 'Bank Transfer'
      }
    ]);

    logger.info(`Created ${donations.length} donations`);

    logger.info('✓ Database seeded successfully');

    // Display summary
    console.log('\n════════════════════════════════════════');
    console.log('  SIREN DATABASE SEED SUMMARY');
    console.log('════════════════════════════════════════');
    console.log(`✓ Users Created: ${users.length}`);
    console.log(`✓ Emergency Requests: ${requests.length}`);
    console.log(`✓ Volunteers: ${volunteers.length}`);
    console.log(`✓ Donations: ${donations.length}`);
    console.log('════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed', { message: error.message, stack: error.stack });
    process.exit(1);
  }
};

seedDatabase();
