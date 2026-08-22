const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const auth = require('../middleware/auth');

function buildEmailTransporter() {
  const host = process.env.SMTP_HOST || process.env.MAIL_HOST;
  const port = Number(process.env.SMTP_PORT || process.env.MAIL_PORT || 587);
  const user = process.env.SMTP_USER || process.env.MAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.MAIL_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465,
    auth: { user, pass },
  });
}

async function sendWelcomeEmail(user) {
  const transporter = buildEmailTransporter();
  const from = process.env.MAIL_FROM || process.env.SMTP_FROM || 'MobFix <no-reply@mobfix.local>';

  if (!transporter) {
    console.info(`[MobFix] Welcome email skipped for ${user.email} because SMTP settings are missing.`);
    return { sent: false, skipped: true };
  }

  await transporter.sendMail({
    from,
    to: user.email,
    subject: 'Welcome to MobFix',
    html: `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h2 style="margin-bottom: 0.5rem;">Welcome to MobFix, ${user.name}!</h2>
        <p>Your account is ready. You can now browse services, book repairs, and track your orders from one place.</p>
        <p style="margin: 1rem 0;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/services" style="display: inline-block; background: #0d6efd; color: #ffffff; text-decoration: none; padding: 0.75rem 1.1rem; border-radius: 8px; font-weight: 700;">
            Explore Services
          </a>
        </p>
        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  });

  return { sent: true };
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    const welcomeEmail = await sendWelcomeEmail(user);
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      welcomeEmail,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing email or password' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user — fixed: was using req.user.id, now uses req.userId
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
