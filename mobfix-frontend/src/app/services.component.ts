import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from './services.service';
import { BookingsService } from './bookings.service';

@Component({
  selector: 'mf-services',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <h2>Our Services</h2>
      <div class="category-filter">
        <button class="filter-btn" [class.active]="selectedCategory === 'All'" (click)="filterByCategory('All')">All</button>
        <button class="filter-btn" [class.active]="selectedCategory === cat" *ngFor="let cat of categories" (click)="filterByCategory(cat)">{{cat}}</button>
      </div>
    </div>
    <div *ngIf="!filteredServices?.length" class="empty">No services found.</div>
    <div class="services-grid">
      <div class="service-card" *ngFor="let s of filteredServices">
        <div *ngIf="isPopular(s)" class="ribbon">Popular</div>
        <img class="service-img" [src]="imageFor(s)" [alt]="s.serviceName" />
        <div class="category-badge">{{s.category || 'Other'}}</div>
        <div class="service-title">{{ s.serviceName }}</div>
        <div class="service-desc">{{ s.description }}</div>
        <div class="service-meta">
          <span class="price-badge">&#36;{{ s.price }}</span>
          <span class="muted"> • {{ s.estimatedTime || s.durationMins + ' mins' || '—' }}</span>
        </div>
        <div class="rating-row">
          <span class="rating">{{ stars(s.rating || 0) }}</span>
          <span class="muted" *ngIf="s.rating"> {{ s.rating.toFixed(1) }}</span>
          <span class="muted" *ngIf="s.reviewCount"> ({{ s.reviewCount }} reviews)</span>
        </div>
        <div class="service-tags" *ngIf="s.warranty">
          <span class="tag">🛡️ {{ s.warranty }} warranty</span>
        </div>
        <div class="service-actions">
          <button class="btn primary" (click)="openForm(s)">Book Now</button>
        </div>
        <div *ngIf="openFor === s._id" style="margin-top:0.75rem">
          <div>
            <label>Mobile model<br /><input [(ngModel)]="form.mobileModel" placeholder="e.g. iPhone 12" /></label>
          </div>
          <div>
            <label>Issue<br /><input [(ngModel)]="form.issueDescription" placeholder="Short description" /></label>
          </div>
          <div style="display:flex; gap:0.5rem; margin-top:0.5rem">
            <input type="date" [(ngModel)]="form.date" />
            <input type="time" [(ngModel)]="form.time" />
          </div>
          <div style="margin-top:0.5rem; text-align:right">
            <button class="btn" (click)="cancelForm()">Cancel</button>
            <button class="btn primary" (click)="submitBooking(s)">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ServicesComponent implements OnInit {
  services: any[] = [];
  filteredServices: any[] = [];
  categories: string[] = ['Screen', 'Battery', 'Camera', 'Charging', 'Audio', 'Software', 'Other'];
  selectedCategory: string = 'All';
  openFor: string | null = null;
  form: any = { mobileModel: '', issueDescription: '', date: '', time: '' };
  constructor(private svc: ServicesService, private bs: BookingsService, private router: Router) {}

  ngOnInit() {
    this.svc.list().subscribe({ next: (res: any) => {
        this.services = (res && res.length) ? res : this.sampleServices();
        this.filteredServices = this.services;
      }
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory = category;
    if (category === 'All') {
      this.filteredServices = this.services;
    } else {
      this.filteredServices = this.services.filter(s => s.category === category);
    }
  }

  openForm(s: any) {
    this.openFor = s._id;
    // reset form
    this.form = { mobileModel: '', issueDescription: '', date: '', time: '' };
  }

  cancelForm() {
    this.openFor = null;
  }

  submitBooking(s: any) {
    const payload = {
      serviceId: s._id,
      mobileModel: this.form.mobileModel || 'Unknown',
      issueDescription: this.form.issueDescription || 'No description',
      date: this.form.date || new Date().toISOString().slice(0,10),
      time: this.form.time || '09:00'
    };
    this.bs.create(payload).subscribe({
      next: (res: any) => {
        // success -> navigate to my bookings
        this.openFor = null;
        this.router.navigate(['/my-bookings']);
      },
      error: (err) => {
        console.error('Booking create failed', err);
        alert('Failed to create booking. Please ensure you are logged in.');
      }
    });
  }

  imageFor(s: any) {
    // Prefer explicit imageUrl from API; otherwise try a named asset by serviceName
    if (s.imageUrl) return s.imageUrl;
    const name = (s.serviceName || 'placeholder').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    // Build the URL using the document <base href> so images resolve correctly when the
    // app is served from a subpath (for example '/mobfix-frontend/') or from root.
    try {
      const baseEl = typeof document !== 'undefined' ? document.querySelector('base') : null;
      const baseHref = baseEl ? (baseEl.getAttribute('href') || '/') : '/';
      // If baseHref is root '/', return a relative path to assets (works in dev serve)
      if (baseHref === '/') return 'assets/images/' + (name || 'placeholder') + '.svg';
      // Otherwise, ensure no duplicate slashes and prefix the base
      const normalizedBase = baseHref.replace(/(^\/?|\/$)/g, '');
      return '/' + normalizedBase + '/assets/images/' + (name || 'placeholder') + '.svg';
    } catch (e) {
      // Fallback to relative path if anything unexpected happens
      return 'assets/images/' + (name || 'placeholder') + '.svg';
    }
  }

  // Provide a small set of attractive sample services to show richer data when API
  // has none (useful during dev/demo). Keep fields that the UI expects.
  sampleServices() {
    return [
      { _id: 'svc1', serviceName: 'Screen Replacement', description: 'Replace cracked or shattered screen with OEM-grade parts.', price: 50, durationMins: 45, rating: 4.7, tags: ['Fast', 'Warranty'], popular: true },
      { _id: 'svc2', serviceName: 'Battery Replacement', description: 'Replace worn battery to restore full capacity.', price: 60, durationMins: 30, rating: 4.5, tags: ['Same-day'], popular: true },
      { _id: 'svc3', serviceName: 'Water Damage Repair', description: 'Full diagnostic and corrosion treatment.', price: 75, durationMins: 120, rating: 4.2, tags: ['Diagnostic','Parts may vary'] },
      { _id: 'svc4', serviceName: 'Charging Port Repair', description: 'Fix loose or damaged charging port.', price: 40, durationMins: 35, rating: 4.3, tags: ['Essential'] },
      { _id: 'svc5', serviceName: 'Software Tune-up', description: 'OS update, malware clean, performance tune.', price: 30, durationMins: 25, rating: 4.0, tags: ['Software'] },
      { _id: 'svc6', serviceName: 'Camera Repair', description: 'Fix blurry or malfunctioning rear/front cameras and replace lenses.', price: 55, durationMins: 50, rating: 4.4, tags: ['Camera','Lens'], popular: false },
      { _id: 'svc7', serviceName: 'Speaker Repair', description: 'Repair or replace damaged speakers for clear audio.', price: 45, durationMins: 40, rating: 4.3, tags: ['Audio'] },
      { _id: 'svc8', serviceName: 'Microphone Repair', description: 'Fix microphone issues causing low or no input sound.', price: 40, durationMins: 35, rating: 4.1, tags: ['Audio'] },
      { _id: 'svc9', serviceName: 'Button Replacement', description: 'Replace non-responsive physical buttons (home, power, volume).', price: 35, durationMins: 25, rating: 4.0, tags: ['Hardware'] },
      { _id: 'svc10', serviceName: 'Back Glass Replacement', description: 'Replace cracked back glass panels with color-matched parts.', price: 70, durationMins: 60, rating: 4.2, tags: ['Cosmetic'] },
      { _id: 'svc11', serviceName: 'Data Recovery', description: 'Attempt to recover lost photos, messages, and files from damaged devices.', price: 120, durationMins: 180, rating: 4.0, tags: ['Critical','Diagnostic'] },
      { _id: 'svc12', serviceName: 'Diagnostics & Tune-up', description: 'Comprehensive device diagnostic and health check with recommended fixes.', price: 25, durationMins: 20, rating: 4.1, tags: ['Diagnostic'] }
    ];
  }

  stars(n: number) {
    const full = Math.floor(n || 0);
    const half = (n - full) >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(Math.max(0, 5 - full - half));
  }

  isPopular(s: any) {
    return s.isPopular || s.popular || (s.rating && s.rating >= 4.7);
  }
}
