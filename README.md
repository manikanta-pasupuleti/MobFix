# 📱 MobFix - Multi-Platform Device Repair Booking System

<div align="center">

![MobFix Logo](https://img.shields.io/badge/MobFix-Device%20Repair-0d6efd?style=for-the-badge&logo=smartphone&logoColor=white)

**A modern, full-stack device repair booking platform supporting Android, iOS, Tablets, Laptops, and Web services.**

[![Angular](https://img.shields.io/badge/Angular-20-dd0031?style=flat-square&logo=angular)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## ✨ Features

### 🎯 Platform-Based Service Organization
- **🤖 Android** - Samsung, Google Pixel, OnePlus, Xiaomi repairs
- **🍎 iOS/iPhone** - All iPhone models with True Tone support
- **📲 Tablet/iPad** - iPad Pro, Air, Mini & Android tablets
- **💻 Laptop** - MacBook, Dell, HP, Lenovo repairs
- **🌐 Website/App** - Bug fixes, optimization & maintenance

### 🛠️ Key Features
- **Smart Filtering** - Filter services by platform, category, price, rating
- **Real-time Search** - Instant search across all services
- **User Authentication** - JWT-based secure login/registration
- **Booking Management** - Track, filter, and manage repair appointments
- **Toast Notifications** - Beautiful success/error/warning alerts
- **Responsive Design** - Works perfectly on all devices
- **Modern UI/UX** - Clean, professional interface with animations

### 📊 User Dashboard
- View all bookings with status tracking
- Filter by Pending, Confirmed, Completed
- Detailed booking information modals
- Cancel bookings when needed

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (recommended)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/mobfix.git
cd mobfix

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../mobfix-frontend
npm install
```

### 2. Configure Environment

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mobfix
JWT_SECRET=your-super-secret-jwt-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd mobfix-frontend
npm start
# App running on http://localhost:4200
```

Visit **http://localhost:4200** to see the app! 🎉

---

## 📁 Project Structure

```
mobfix/
├── backend/                 # Express.js API
│   ├── config/             # Database configuration
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose schemas
│   │   ├── User.js
│   │   ├── Service.js      # Platform-based services
│   │   ├── Booking.js
│   │   └── Review.js
│   ├── routes/             # API endpoints
│   └── scripts/            # Seed scripts
│
├── mobfix-frontend/         # Angular 20 App
│   └── src/app/
│       ├── app.ts          # Root component with header/footer
│       ├── home.component.ts       # Landing page with platform cards
│       ├── services.component.ts   # Platform-filtered service listing
│       ├── my-bookings.component.ts # Booking management
│       ├── login.component.ts      # Modern login form
│       ├── register.component.ts   # Registration with validation
│       ├── toast.service.ts        # Notification system
│       └── toast.component.ts      # Toast UI
│
└── README.md
```

---

## 🎨 Screenshots

### Home Page - Platform Selection
Users can quickly select their device type to find relevant repair services.

### Services Page - Smart Filtering
- Platform tabs (All, Android, iOS, Tablet, Laptop, Website)
- Category chips for quick filtering
- Search box with instant results
- Sort by popularity, price, rating

### My Bookings - Dashboard
- Stats cards showing booking counts
- Filter tabs by status
- Booking cards with status indicators
- Detail modal with full information

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login user |
| GET | `/api/users/me` | Get current user |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/services` | List all services |
| GET | `/api/services/:id` | Get service by ID |
| POST | `/api/services` | Create service (admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings/my` | Get user's bookings |
| POST | `/api/bookings` | Create booking |
| DELETE | `/api/bookings/:id` | Cancel booking |

---

## 🛡️ Service Model

Services are organized by platform with rich metadata:

```javascript
{
  serviceName: "iPhone Screen Repair",
  description: "Premium screen replacement...",
  price: 129,
  platform: "iOS",           // Android | iOS | Tablet | Laptop | Website | All
  category: "Screen",        // Screen | Battery | Camera | Charging | Software | Web
  estimatedTime: "1 hour",
  warranty: "90 days",
  rating: 4.9,
  reviewCount: 456,
  isPopular: true,
  supportedBrands: ["iPhone 15", "iPhone 14", "iPhone 13"]
}
```

---

## 🌐 Deployment

### Deploy to Render

📘 See **[RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)** for detailed instructions.

**Quick Steps:**
1. Set up MongoDB Atlas (free tier)
2. Connect GitHub to Render
3. Deploy via Blueprint (`render.yaml`)
4. Set environment variables
5. Seed the database

### Environment Variables

**Backend:**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `ADMIN_USERNAME` / `ADMIN_PASSWORD`

**Frontend:**
- `API_URL` - Backend API URL

---

## 🧪 Development

### Run Tests
```bash
# Frontend tests
cd mobfix-frontend
npm test

# E2E screenshots
node e2e/screenshot.js
```

### Build for Production
```bash
cd mobfix-frontend
npm run build
```

---

## 📝 Recent Updates

### v2.0 - Platform-Based Services (Dec 2025)
- ✅ Added platform selection (Android, iOS, Tablet, Laptop, Website)
- ✅ Enhanced home page with platform quick-select cards
- ✅ Services page with platform tabs and smart filtering
- ✅ Modern login/register forms with validation
- ✅ Toast notification system
- ✅ My Bookings dashboard with stats and filters
- ✅ Responsive design improvements
- ✅ 25+ sample services across all platforms

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ using Angular, Express, and MongoDB**

[Report Bug](https://github.com/YOUR_USERNAME/mobfix/issues) · [Request Feature](https://github.com/YOUR_USERNAME/mobfix/issues)

</div>
- `FRONTEND_URL` - Your frontend URL (set after frontend deploys)

**Frontend (`mobfix-frontend`):**
- `API_URL` - Your backend URL + `/api` (e.g., https://mobfix-backend.onrender.com/api)

### Security Notes

⚠️ Never commit secrets to git (`.env` is in `.gitignore`)  
⚠️ Rotate any credentials shared in logs/chat  
⚠️ Change default admin password before production use

## Contributing
- Open issues and PRs are welcome. Small enhancements to the README or adding seed data to the backend are good next steps.

## Helpful scripts (summary)
- Backend: `npm start` (from `backend/`)
- Frontend dev: `npx ng serve` (from `mobfix-frontend/`)
- Frontend build: `npx ng build --configuration development` (from `mobfix-frontend/`)
- Serve static build: `npx http-server ./dist/mobfix-frontend/browser -p 4200 -a 127.0.0.1 -s`
- E2E screenshot: `node .\e2e\screenshot.js` (from `mobfix-frontend/`)

---

If you'd like, I can now:
- add a minimal GitHub Actions workflow that builds frontend + runs a smoke check,
- seed the backend with the sample services used in the frontend fallback, or
- add a `CONTRIBUTING.md` and more detailed run instructions.

Tell me which of those you'd like next.

---
© MobFix demo
