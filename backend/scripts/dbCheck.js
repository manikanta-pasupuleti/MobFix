// Try to load .env if dotenv is available; continue if not.
try { require('dotenv').config(); } catch (e) { /* dotenv not installed, continue */ }
const mongoose = require('mongoose');

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mobfix';
  console.log('Using MONGO_URI:', uri.startsWith('mongodb') ? uri.replace(/(mongodb.*:\/\/)(.*@)/, '$1***@') : uri);
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    const db = mongoose.connection.db;
    const cols = await db.listCollections().toArray();
    if (!cols.length) {
      console.log('No collections found in database. Database appears empty.');
    } else {
      console.log('Collections and document counts:');
      for (const c of cols) {
        try {
          const count = await db.collection(c.name).countDocuments();
          console.log(` - ${c.name}: ${count}`);
        } catch (e) {
          console.log(` - ${c.name}: (error counting)`, e.message);
        }
      }
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message || err);
    process.exit(2);
  }
}

run();
