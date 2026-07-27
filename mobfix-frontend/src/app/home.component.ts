import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'mf-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <span class="hero-badge">🔧 #1 Device Repair Service</span>
          <h1 class="hero-title">Fix Any Device, Any Platform</h1>
          <p class="hero-subtitle">From smartphones to laptops, websites to apps — we repair it all. Book a certified technician in minutes with same-day options and warranty-backed service.</p>
          <div class="hero-cta">
            <a class="btn primary large" routerLink="/services">
              <span>Browse All Services</span>
              <span class="btn-icon">→</span>
            </a>
            <a class="btn secondary large" routerLink="/register" *ngIf="!isLoggedIn">Get Started Free</a>
            <a class="btn secondary large" routerLink="/my-bookings" *ngIf="isLoggedIn">My Bookings</a>
          </div>
          <div class="trust-badges">
            <span class="trust-badge">⭐ 4.9/5 Rating</span>
            <span class="trust-badge">🛡️ 90-Day Warranty</span>
            <span class="trust-badge">⚡ Same-Day Service</span>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-stats">
            <div class="stat-card">
              <span class="stat-number">10K+</span>
              <span class="stat-label">Repairs Done</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">98%</span>
              <span class="stat-label">Satisfaction</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">24hr</span>
              <span class="stat-label">Avg Turnaround</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Platform Selection Section -->
    <section class="platform-section">
      <h2 class="section-title">What Do You Need Help With?</h2>
      <p class="section-subtitle">Select your device type to find the right repair service</p>
      
      <div class="platform-grid">
        <a class="platform-card" [routerLink]="['/services']" [queryParams]="{platform: 'Android'}">
          <div class="platform-icon android">🤖</div>
          <h3>Android</h3>
          <p>Samsung, Google Pixel, OnePlus, Xiaomi & more</p>
          <span class="platform-link">View Services →</span>
        </a>
        
        <a class="platform-card" [routerLink]="['/services']" [queryParams]="{platform: 'iOS'}">
          <div class="platform-icon ios">🍎</div>
          <h3>iPhone / iOS</h3>
          <p>iPhone 15, 14, 13, 12 & all models</p>
          <span class="platform-link">View Services →</span>
        </a>
        
        <a class="platform-card" [routerLink]="['/services']" [queryParams]="{platform: 'Tablet'}">
          <div class="platform-icon tablet">📲</div>
          <h3>Tablet / iPad</h3>
          <p>iPad Pro, Air, Mini & Android tablets</p>
          <span class="platform-link">View Services →</span>
        </a>
        
        <a class="platform-card" [routerLink]="['/services']" [queryParams]="{platform: 'Laptop'}">
          <div class="platform-icon laptop">💻</div>
          <h3>Laptop</h3>
          <p>MacBook, Dell, HP, Lenovo & more</p>
          <span class="platform-link">View Services →</span>
        </a>
        
        <a class="platform-card" [routerLink]="['/services']" [queryParams]="{platform: 'Website'}">
          <div class="platform-icon website">🌐</div>
          <h3>Website / App</h3>
          <p>Bug fixes, optimization & maintenance</p>
          <span class="platform-link">View Services →</span>
        </a>
        
        <a class="platform-card highlight" routerLink="/services">
          <div class="platform-icon all">🔧</div>
          <h3>All Services</h3>
          <p>Browse our complete service catalog</p>
          <span class="platform-link">View All →</span>
        </a>
      </div>
    </section>

    <!-- Popular Services Section -->
    <section class="popular-section">
      <h2 class="section-title">Most Popular Services</h2>
      <div class="popular-grid">
        <div class="popular-card" *ngFor="let service of popularServices">
          <span class="popular-badge">🔥 Popular</span>
          <div class="popular-icon">{{ service.icon }}</div>
          <h4>{{ service.name }}</h4>
          <p>{{ service.desc }}</p>
          <div class="popular-meta">
            <span class="popular-price">From \${{ service.price }}</span>
            <span class="popular-platform">{{ service.platform }}</span>
          </div>
          <a class="btn primary small" routerLink="/services">Book Now</a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title">Why Choose MobFix?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🔧</div>
          <h3>Expert Technicians</h3>
          <p>Our certified technicians have years of experience with all devices and platforms.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Fast Turnaround</h3>
          <p>Most repairs completed within 24 hours. Same-day service available for urgent needs.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🛡️</div>
          <h3>Quality Guarantee</h3>
          <p>All repairs backed by our 90-day warranty. We use OEM-grade replacement parts.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💰</div>
          <h3>Transparent Pricing</h3>
          <p>No hidden fees. Get upfront quotes before any work begins.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>All Platforms</h3>
          <p>Android, iOS, tablets, laptops, websites — we handle everything.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📍</div>
          <h3>Easy Booking</h3>
          <p>Book online in minutes. Choose your preferred date and time slot.</p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <h2 class="section-title">How It Works</h2>
      <div class="steps-container">
        <div class="step-item">
          <div class="step-number">1</div>
          <h3>Select Platform</h3>
          <p>Choose your device type (Android, iOS, Laptop, etc.)</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step-item">
          <div class="step-number">2</div>
          <h3>Pick Service</h3>
          <p>Browse and select the repair you need</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step-item">
          <div class="step-number">3</div>
          <h3>Book & Pay</h3>
          <p>Choose your time slot and confirm</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step-item">
          <div class="step-number">4</div>
          <h3>Get Fixed!</h3>
          <p>We repair and you're done!</p>
        </div>
      </div>
    </section>

    <!-- Brands Section -->
    <section class="brands-section">
      <h2 class="section-title">Brands We Service</h2>
      <div class="brands-grid">
        <div class="brand-item">🍎 Apple</div>
        <div class="brand-item">📱 Samsung</div>
        <div class="brand-item">🔵 Google</div>
        <div class="brand-item">🔴 OnePlus</div>
        <div class="brand-item">🟠 Xiaomi</div>
        <div class="brand-item">💻 Dell</div>
        <div class="brand-item">🖥️ HP</div>
        <div class="brand-item">⬛ Lenovo</div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-content">
        <h2>Ready to Fix Your Device?</h2>
        <p>Join thousands of satisfied customers. Book your repair today!</p>
        <div class="cta-buttons">
          <a class="btn primary large" routerLink="/services">Browse Services</a>
          <a class="btn secondary large inverted" href="tel:+1234567890">📞 Call Us</a>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  
  popularServices = [
    { name: 'iPhone Screen Repair', desc: 'Fix cracked screens for all iPhone models', price: 129, icon: '📱', platform: 'iOS' },
    { name: 'Android Battery Swap', desc: 'Restore battery life on any Android', price: 49, icon: '🔋', platform: 'Android' },
    { name: 'Laptop Screen Fix', desc: 'Replace broken laptop displays', price: 199, icon: '💻', platform: 'Laptop' },
    { name: 'Website Bug Fixes', desc: 'Fix errors and broken features', price: 99, icon: '🌐', platform: 'Website' }
  ];
  
  constructor(private auth: AuthService) {}
  
  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.auth.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }
}
