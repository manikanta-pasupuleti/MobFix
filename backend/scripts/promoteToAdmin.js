require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function run() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mobfix';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const email = process.argv[2] || 'test@example.com';
  const user = await User.findOne({ email });
  if (!user) {
    console.error('User not found:', email);
    process.exit(1);
  }
  user.role = 'admin';
  await user.save();
  console.log('Promoted user to admin:', email, 'id=', user._id.toString());
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
