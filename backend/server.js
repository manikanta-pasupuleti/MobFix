require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '100kb' }));
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:4200')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  }
}));
app.use(morgan('dev'));
app.use((req, res, next) => {
  req.requestId = req.get('x-request-id') || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  res.setHeader('x-request-id', req.requestId);
  next();
});

// Rate limit auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mobfix';

connectDB(MONGO_URI);

app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);

app.use('/api/users', require('./routes/users'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/technician', require('./routes/technician'));

app.get('/', (req, res) => res.json({ message: 'MobFix API running' }));
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'mobfix-backend', timestamp: new Date().toISOString() }));
app.get('/ready', (req, res) => {
  const ready = require('mongoose').connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'not_ready', database: ready ? 'connected' : 'disconnected' });
});

app.use((err, req, res, next) => {
  console.error(`[${req.requestId || 'unknown'}]`, err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : 'Internal server error',
    requestId: req.requestId
  });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
