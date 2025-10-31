require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mobfix';

const enhancedServices = [
  {
    serviceName: 'Screen Replacement',
    description: 'Replace cracked or shattered screens with OEM-quality parts. Includes installation and testing.',
    price: 79,
    category: 'Screen',
    imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&auto=format',
    rating: 4.8,
    reviewCount: 127,
    estimatedTime: '30-45 minutes',
    warranty: '90 days',
    isPopular: true
  },
  {
    serviceName: 'Battery Replacement',
    description: 'Replace aged batteries to restore capacity and battery life. Genuine replacement parts.',
    price: 49,
    category: 'Battery',
    imageUrl: 'https://images.unsplash.com/photo-1609592806955-d0c9e2c22b5e?w=400&auto=format',
    rating: 4.9,
    reviewCount: 203,
    estimatedTime: '20-30 minutes',
    warranty: '180 days',
    isPopular: true
  },
  {
    serviceName: 'Water Damage Repair',
    description: 'Diagnostic and repair after liquid exposure (success varies). Includes cleaning and component replacement.',
    price: 99,
    category: 'Other',
    imageUrl: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=400&auto=format',
    rating: 4.3,
    reviewCount: 89,
    estimatedTime: '2-4 hours',
    warranty: '30 days',
    isPopular: false
  },
  {
    serviceName: 'Charging Port Repair',
    description: 'Fix loose or damaged charging ports. Restore reliable charging functionality.',
    price: 59,
    category: 'Charging',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&auto=format',
    rating: 4.7,
    reviewCount: 156,
    estimatedTime: '1-2 hours',
    warranty: '90 days',
    isPopular: true
  },
  {
    serviceName: 'Camera Replacement',
    description: 'Repair or replace faulty front/rear cameras for clear photos and videos.',
    price: 69,
    category: 'Camera',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&auto=format',
    rating: 4.6,
    reviewCount: 94,
    estimatedTime: '45-60 minutes',
    warranty: '90 days',
    isPopular: false
  },
  {
    serviceName: 'Speaker Repair',
    description: 'Fix distorted or non-working speakers. Restore clear audio quality.',
    price: 45,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1545319261-63a88948e2c3?w=400&auto=format',
    rating: 4.5,
    reviewCount: 67,
    estimatedTime: '1 hour',
    warranty: '60 days',
    isPopular: false
  },
  {
    serviceName: 'Microphone Repair',
    description: 'Repair microphone issues affecting calls and voice recording.',
    price: 39,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&auto=format',
    rating: 4.4,
    reviewCount: 52,
    estimatedTime: '45 minutes',
    warranty: '60 days',
    isPopular: false
  },
  {
    serviceName: 'Software Issues',
    description: 'OS reinstall, malware removal, and troubleshooting software bugs.',
    price: 39,
    category: 'Software',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format',
    rating: 4.7,
    reviewCount: 141,
    estimatedTime: '1-3 hours',
    warranty: '30 days',
    isPopular: true
  },
  {
    serviceName: 'Back Glass Replacement',
    description: 'Replace cracked back glass panel. Restore the premium look of your device.',
    price: 89,
    category: 'Screen',
    imageUrl: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&auto=format',
    rating: 4.6,
    reviewCount: 78,
    estimatedTime: '1-2 hours',
    warranty: '90 days',
    isPopular: false
  },
  {
    serviceName: 'Button Repair',
    description: 'Fix or replace power, volume, and home buttons.',
    price: 35,
    category: 'Other',
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&auto=format',
    rating: 4.5,
    reviewCount: 63,
    estimatedTime: '30-45 minutes',
    warranty: '60 days',
    isPopular: false
  }
];

async function seedEnhancedServices() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding enhanced services...');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert enhanced services
    const inserted = await Service.insertMany(enhancedServices);
    console.log(`✓ Successfully seeded ${inserted.length} enhanced services with categories and images!`);
    
    // Show summary
    console.log('\nServices by category:');
    const categories = [...new Set(enhancedServices.map(s => s.category))];
    for (const cat of categories) {
      const count = enhancedServices.filter(s => s.category === cat).length;
      console.log(`  ${cat}: ${count} services`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding services:', err);
    process.exit(1);
  }
}

seedEnhancedServices();
