require('dotenv').config();
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const run = async () => {
  await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/mobfix');
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ username, password: hashed });
  console.log('Admin created:', username);
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
