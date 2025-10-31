// Insert demo services into MongoDB for MobFix
// Usage: set MONGO_URI env var and run `node seedServices.js`

const mongoose = require('mongoose');
const Service = require('../models/Service');

const sampleServices = [
  {
    title: 'Screen Replacement',
    description: 'Replace cracked or shattered screens with OEM-quality parts.',
    price: 79,
    currency: 'USD',
    durationMins: 45,
    rating: 4.6,
    tags: ['screen', 'hardware', 'repair'],
    imageUrl: '/assets/images/screen-replacement.svg'
  },
  {
    title: 'Battery Replacement',
    description: 'Replace aged batteries to restore capacity and battery life.',
    price: 49,
    currency: 'USD',
    durationMins: 30,
    rating: 4.5,
    tags: ['battery', 'power'],
    imageUrl: '/assets/images/battery-replacement.svg'
  },
  {
    title: 'Charging Port Repair',
    description: 'Fix loose or damaged charging ports so your device charges reliably.',
    price: 59,
    currency: 'USD',
    durationMins: 40,
    rating: 4.4,
    tags: ['charging', 'port', 'hardware'],
    imageUrl: '/assets/images/charging-port-repair.svg'
  },
  {
    title: 'Water Damage Repair',
    description: 'Diagnostic and repair after liquid exposure (success varies).',
    price: 99,
    currency: 'USD',
    durationMins: 120,
    rating: 4.0,
    tags: ['water', 'diagnostic'],
    imageUrl: '/assets/images/water-damage-repair.svg'
  },
  {
    title: 'Camera Repair',
    description: 'Repair or replace faulty front/rear cameras for clear photos.',
    price: 69,
    currency: 'USD',
    durationMins: 35,
    rating: 4.3,
    tags: ['camera', 'hardware'],
    imageUrl: '/assets/images/camera-repair.svg'
  },
  {
    title: 'Software Issues',
    description: 'OS reinstall, malware removal, and troubleshooting software bugs.',
    price: 39,
    currency: 'USD',
    durationMins: 60,
    rating: 4.2,
    tags: ['software', 'diagnostic'],
    imageUrl: '/assets/images/software-issues.svg'
  }
];

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI must be set as an environment variable.');
    process.exit(1);
  }

  console.log('Connecting to', uri);
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected.');

  try {
    const created = [];
    for (const s of sampleServices) {
      const serviceName = s.title || s.serviceName;
      const exists = await Service.findOne({ serviceName }).exec();
      if (exists) {
        console.log('Already exists:', serviceName);
        continue;
      }
      // Map to backend Service schema
      const payload = {
        serviceName,
        description: s.description || '',
        price: s.price || 0,
      };
      const doc = new Service(payload);
      await doc.save();
      created.push(serviceName);
      console.log('Inserted:', serviceName);
    }
    console.log('Done. Inserted:', created.length);
  } catch (err) {
    console.error('Error seeding services:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
