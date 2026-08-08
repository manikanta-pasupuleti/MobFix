# 📱 MobFix — Device Repair Booking Platform

A full-stack **device repair booking platform** that allows users to discover, filter, and book repair services for smartphones, tablets, laptops, and web applications.

Built with **Angular, Node.js, Express.js, and MongoDB**, MobFix provides secure authentication, service discovery, booking management, and a responsive user experience.

---

## 🚀 Overview

MobFix simplifies the process of finding and booking device repair services through a centralized platform.

Users can:

- Browse repair services by device platform
- Search and filter services
- View pricing, ratings, warranty, and estimated repair time
- Register and securely log in
- Book repair services
- Track and manage bookings
- Cancel pending bookings
- Receive toast notifications

---

## ✨ Features

### 🔐 Authentication

- JWT-based user authentication
- User registration and login
- Protected API routes
- Authenticated user profile
- Secure password handling
- Welcome email delivery after registration via SMTP

### 🔧 Service Discovery

Services are organized into multiple platforms:

| Platform | Supported Services |
|---|---|
| 🤖 Android | Samsung, Google Pixel, OnePlus, Xiaomi |
| 🍎 iOS | iPhone screen, battery, camera, charging |
| 📲 Tablet | iPad Pro, Air, Mini, Android tablets |
| 💻 Laptop | MacBook, Dell, HP, Lenovo |
| 🌐 Website | Bug fixing, optimization, maintenance |

Users can:

- Search services in real time
- Filter by platform
- Filter by category
- Sort by price
- Sort by rating
- Sort by popularity

### 📅 Booking Management

- Create repair bookings
- View personal bookings
- Track booking status
- Filter bookings by status
- View booking details
- Cancel bookings

### 🎨 User Interface

- Responsive design
- Modern UI/UX
- Toast notifications
- Interactive service cards
- Status indicators
- Booking detail modals
- Mobile-friendly layout

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      Angular 20      │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   Node.js + Express  │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             ┌─────────────┐      ┌─────────────┐
             │   MongoDB   │      │ JWT Auth    │
             │   Database  │      │ Middleware  │
             └─────────────┘      └─────────────┘