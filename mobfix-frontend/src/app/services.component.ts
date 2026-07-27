import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { ServicesService } from './services.service';
import { BookingsService } from './bookings.service';

@Component({
  selector: 'mf-services',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <!-- Platform Selection Header -->
    <div class="platform-header">
      <h2>Choose Your Platform</h2>
      <p class="subtitle">Select your device type to see available repair services</p>
      
      <div class="platform-tabs">
        <button 
          class="platform-tab" 
          *ngFor="let p of platforms"
          [class.active]="selectedPlatform === p.id"
          (click)="selectPlatform(p.id)"
        >
          <span class="platform-icon">{{ p.icon }}</span>
          <span class="platform-name">{{ p.name }}</span>
          <span class="platform-count">{{ getPlatformCount(p.id) }} services</span>
        </button>
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="filter-bar">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (ngModelChange)="filterServices()"
          placeholder="Search services..."
        />
        <button *ngIf="searchQuery" class="clear-btn" (click)="searchQuery = ''; filterServices()">×</button>
      </div>
      
      <div class="category-chips">
        <button 
          class="chip" 
          [class.active]="selectedCategory === 'All'" 
          (click)="selectCategory('All')"
        >All</button>
        <button 
          class="chip" 
          *ngFor="let cat of getAvailableCategories()"
          [class.active]="selectedCategory === cat"
          (click)="selectCategory(cat)"
        >{{ cat }}</button>
      </div>
      
      <div class="sort-dropdown">
        <select [(ngModel)]="sortBy" (ngModelChange)="filterServices()">
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>
    </div>

    <!-- Results Info -->
    <div class="results-info">
      <span>{{ filteredServices.length }} services found</span>
      <span *ngIf="selectedPlatform !== 'All'" class="active-filter">
        {{ getPlatformName(selectedPlatform) }}
        <button (click)="selectPlatform('All')">×</button>
      </span>
      <span *ngIf="selectedCategory !== 'All'" class="active-filter">
        {{ selectedCategory }}
        <button (click)="selectCategory('All')">×</button>
      </span>
    </div>

    <!-- Loading State -->
    <div class="loading-state" *ngIf="loading">
      <div class="spinner-large"></div>
      <p>Loading services...</p>
    </div>

    <!-- Empty State -->
    <div class="empty-state" *ngIf="!loading && !filteredServices?.length">
      <div class="empty-icon">🔧</div>
      <h3>No Services Found</h3>
      <p>Try adjusting your filters or search query</p>
      <button class="btn secondary" (click)="resetFilters()">Reset Filters</button>
    </div>

    <!-- Services Grid -->
    <div class="services-grid" *ngIf="!loading && filteredServices?.length">
      <div class="service-card" *ngFor="let s of filteredServices" [class.featured]="s.isPopular">
        <div class="card-badges">
          <span *ngIf="s.isPopular" class="badge popular">🔥 Popular</span>
          <span class="badge platform" [class]="(s.platform || 'all').toLowerCase()">
            {{ getPlatformIcon(s.platform) }} {{ s.platform || 'All Devices' }}
          </span>
        </div>
        
        <img class="service-img" [src]="imageFor(s)" [alt]="s.serviceName" loading="lazy" />
        
        <div class="card-body">
          <div class="category-tag">{{ s.category || 'Other' }}</div>
          <h3 class="service-title">{{ s.serviceName }}</h3>
          <p class="service-desc">{{ s.description }}</p>
          
          <div class="service-meta">
            <div class="meta-item">
              <span class="meta-icon">💰</span>
              <span class="price">\${{ s.price }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">⏱️</span>
              <span>{{ s.estimatedTime || '1-2 hrs' }}</span>
            </div>
            <div class="meta-item" *ngIf="s.warranty">
              <span class="meta-icon">🛡️</span>
              <span>{{ s.warranty }}</span>
            </div>
          </div>
          
          <div class="rating-row">
            <span class="stars">{{ stars(s.rating || 0) }}</span>
            <span class="rating-text" *ngIf="s.rating">{{ s.rating.toFixed(1) }}</span>
            <span class="review-count" *ngIf="s.reviewCount">({{ s.reviewCount }})</span>
          </div>
          
          <div class="supported-brands" *ngIf="s.supportedBrands?.length">
            <span class="brand-chip" *ngFor="let brand of s.supportedBrands.slice(0,3)">{{ brand }}</span>
            <span class="brand-more" *ngIf="s.supportedBrands.length > 3">+{{ s.supportedBrands.length - 3 }}</span>
          </div>
        </div>
        
        <div class="card-footer">
          <a [routerLink]="['/services', s._id]" class="btn secondary small">Details</a>
          <button class="btn primary" [routerLink]="['/book', s._id]">Book Now →</button>
        </div>
      </div>
    </div>

    <!-- Quick Help Section -->
    <div class="help-section">
      <h3>Not sure what you need?</h3>
      <p>Our experts can diagnose your device and recommend the best repair service.</p>
      <button class="btn primary" routerLink="/book/diagnostics">Get Free Diagnostics</button>
    </div>
  `,
})
export class ServicesComponent implements OnInit {
  services: any[] = [];
  filteredServices: any[] = [];
  loading = true;
  
  // Filters
  selectedPlatform: string = 'All';
  selectedCategory: string = 'All';
  searchQuery: string = '';
  sortBy: string = 'popular';
  
  // Platform options
  platforms = [
    { id: 'All', name: 'All Devices', icon: '📱' },
    { id: 'Android', name: 'Android', icon: '🤖' },
    { id: 'iOS', name: 'iPhone/iOS', icon: '🍎' },
    { id: 'Tablet', name: 'Tablet/iPad', icon: '📲' },
    { id: 'Laptop', name: 'Laptop', icon: '💻' },
    { id: 'Website', name: 'Web/Software', icon: '🌐' }
  ];
  
  categories: string[] = ['Screen', 'Battery', 'Camera', 'Charging', 'Audio', 'Software', 'Hardware', 'Data', 'Web', 'Other'];
  
  constructor(
    private svc: ServicesService, 
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check for platform in route params
    this.route.queryParams.subscribe(params => {
      if (params['platform']) {
        this.selectedPlatform = params['platform'];
      }
    });
    
    this.loadServices();
  }
  
  loadServices() {
    this.loading = true;
    this.svc.list().subscribe({ 
      next: (res: any) => {
        this.services = (res && res.length) ? res : this.sampleServices();
        this.filterServices();
        this.loading = false;
      },
      error: () => {
        this.services = this.sampleServices();
        this.filterServices();
        this.loading = false;
      }
    });
  }
  
  selectPlatform(platform: string) {
    this.selectedPlatform = platform;
    this.filterServices();
  }
  
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterServices();
  }
  
  filterServices() {
    let result = [...this.services];
    
    // Filter by platform
    if (this.selectedPlatform !== 'All') {
      result = result.filter(s => 
        s.platform === this.selectedPlatform || s.platform === 'All' || !s.platform
      );
    }
    
    // Filter by category
    if (this.selectedCategory !== 'All') {
      result = result.filter(s => s.category === this.selectedCategory);
    }
    
    // Filter by search
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(s => 
        s.serviceName?.toLowerCase().includes(query) ||
        s.description?.toLowerCase().includes(query) ||
        s.category?.toLowerCase().includes(query)
      );
    }
    
    // Sort
    result = this.sortServices(result);
    
    this.filteredServices = result;
  }
  
  sortServices(services: any[]): any[] {
    switch(this.sortBy) {
      case 'price-low':
        return services.sort((a, b) => a.price - b.price);
      case 'price-high':
        return services.sort((a, b) => b.price - a.price);
      case 'rating':
        return services.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'name':
        return services.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
      case 'popular':
      default:
        return services.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }
  }
  
  resetFilters() {
    this.selectedPlatform = 'All';
    this.selectedCategory = 'All';
    this.searchQuery = '';
    this.sortBy = 'popular';
    this.filterServices();
  }
  
  getPlatformCount(platform: string): number {
    if (platform === 'All') return this.services.length;
    return this.services.filter(s => 
      s.platform === platform || s.platform === 'All' || !s.platform
    ).length;
  }
  
  getPlatformName(platform: string): string {
    const p = this.platforms.find(x => x.id === platform);
    return p ? p.name : platform;
  }
  
  getPlatformIcon(platform: string): string {
    const p = this.platforms.find(x => x.id === platform);
    return p ? p.icon : '📱';
  }
  
  getAvailableCategories(): string[] {
    const cats = new Set<string>();
    this.services
      .filter(s => this.selectedPlatform === 'All' || s.platform === this.selectedPlatform || s.platform === 'All')
      .forEach(s => {
        if (s.category) cats.add(s.category);
      });
    return Array.from(cats);
  }

  imageFor(s: any) {
    if (s.imageUrl) return s.imageUrl;
    const name = (s.serviceName || 'placeholder').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    try {
      const baseEl = typeof document !== 'undefined' ? document.querySelector('base') : null;
      const baseHref = baseEl ? (baseEl.getAttribute('href') || '/') : '/';
      if (baseHref === '/') return 'assets/images/' + (name || 'placeholder') + '.svg';
      const normalizedBase = baseHref.replace(/(^\/?|\/$)/g, '');
      return '/' + normalizedBase + '/assets/images/' + (name || 'placeholder') + '.svg';
    } catch (e) {
      return 'assets/images/' + (name || 'placeholder') + '.svg';
    }
  }

  sampleServices() {
    return [
      // Android Services
      { _id: 'a1', serviceName: 'Android Screen Repair', description: 'Fix cracked or damaged screens for Samsung, Google Pixel, OnePlus and more.', price: 79, category: 'Screen', platform: 'Android', estimatedTime: '1-2 hours', warranty: '90 days', rating: 4.8, reviewCount: 234, isPopular: true, supportedBrands: ['Samsung', 'Google', 'OnePlus', 'Xiaomi'] },
      { _id: 'a2', serviceName: 'Android Battery Replacement', description: 'Restore your battery life with genuine replacement batteries.', price: 49, category: 'Battery', platform: 'Android', estimatedTime: '30-45 mins', warranty: '90 days', rating: 4.7, reviewCount: 189, isPopular: true, supportedBrands: ['Samsung', 'Google', 'OnePlus'] },
      { _id: 'a3', serviceName: 'Android Charging Port Fix', description: 'Repair or replace faulty USB-C charging ports.', price: 45, category: 'Charging', platform: 'Android', estimatedTime: '45 mins', warranty: '60 days', rating: 4.5, reviewCount: 156, supportedBrands: ['Samsung', 'Google', 'Motorola'] },
      { _id: 'a4', serviceName: 'Android Camera Repair', description: 'Fix blurry cameras, replace broken lenses and camera modules.', price: 65, category: 'Camera', platform: 'Android', estimatedTime: '1 hour', warranty: '90 days', rating: 4.4, reviewCount: 98, supportedBrands: ['Samsung', 'Google', 'OnePlus'] },
      { _id: 'a5', serviceName: 'Android Data Recovery', description: 'Recover lost photos, contacts, and files from Android devices.', price: 99, category: 'Data', platform: 'Android', estimatedTime: '2-4 hours', warranty: 'N/A', rating: 4.3, reviewCount: 67 },
      
      // iOS Services
      { _id: 'i1', serviceName: 'iPhone Screen Repair', description: 'Premium screen replacement for all iPhone models with True Tone support.', price: 129, category: 'Screen', platform: 'iOS', estimatedTime: '1 hour', warranty: '90 days', rating: 4.9, reviewCount: 456, isPopular: true, supportedBrands: ['iPhone 15', 'iPhone 14', 'iPhone 13', 'iPhone 12'] },
      { _id: 'i2', serviceName: 'iPhone Battery Replacement', description: 'Apple-certified battery replacement for optimal performance.', price: 69, category: 'Battery', platform: 'iOS', estimatedTime: '30 mins', warranty: '90 days', rating: 4.8, reviewCount: 312, isPopular: true, supportedBrands: ['iPhone 15', 'iPhone 14', 'iPhone 13'] },
      { _id: 'i3', serviceName: 'iPhone Charging Port Repair', description: 'Fix Lightning port issues and restore fast charging.', price: 59, category: 'Charging', platform: 'iOS', estimatedTime: '45 mins', warranty: '60 days', rating: 4.6, reviewCount: 178, supportedBrands: ['All iPhones'] },
      { _id: 'i4', serviceName: 'iPhone Camera Repair', description: 'Repair front/back cameras, fix focus issues and replace lenses.', price: 89, category: 'Camera', platform: 'iOS', estimatedTime: '1-2 hours', warranty: '90 days', rating: 4.5, reviewCount: 134, supportedBrands: ['iPhone 15', 'iPhone 14', 'iPhone 13'] },
      { _id: 'i5', serviceName: 'iPhone Water Damage Repair', description: 'Professional water damage assessment and component repair.', price: 149, category: 'Hardware', platform: 'iOS', estimatedTime: '24-48 hours', warranty: '30 days', rating: 4.2, reviewCount: 89 },
      { _id: 'i6', serviceName: 'Face ID Repair', description: 'Fix Face ID not working issues on iPhone X and later.', price: 179, category: 'Hardware', platform: 'iOS', estimatedTime: '2-3 hours', warranty: '90 days', rating: 4.4, reviewCount: 56 },
      
      // Tablet Services
      { _id: 't1', serviceName: 'iPad Screen Repair', description: 'Replace cracked iPad screens with original quality displays.', price: 149, category: 'Screen', platform: 'Tablet', estimatedTime: '2 hours', warranty: '90 days', rating: 4.7, reviewCount: 123, isPopular: true, supportedBrands: ['iPad Pro', 'iPad Air', 'iPad Mini'] },
      { _id: 't2', serviceName: 'iPad Battery Replacement', description: 'Restore your iPad battery capacity and performance.', price: 89, category: 'Battery', platform: 'Tablet', estimatedTime: '1-2 hours', warranty: '90 days', rating: 4.6, reviewCount: 87, supportedBrands: ['iPad Pro', 'iPad Air'] },
      { _id: 't3', serviceName: 'Samsung Tablet Repair', description: 'Screen and battery repairs for Galaxy Tab series.', price: 129, category: 'Screen', platform: 'Tablet', estimatedTime: '2 hours', warranty: '90 days', rating: 4.5, reviewCount: 65, supportedBrands: ['Galaxy Tab S9', 'Galaxy Tab S8', 'Galaxy Tab A'] },
      
      // Laptop Services
      { _id: 'l1', serviceName: 'Laptop Screen Replacement', description: 'Replace broken or cracked laptop displays.', price: 199, category: 'Screen', platform: 'Laptop', estimatedTime: '1-2 hours', warranty: '90 days', rating: 4.6, reviewCount: 145, isPopular: true, supportedBrands: ['MacBook', 'Dell', 'HP', 'Lenovo'] },
      { _id: 'l2', serviceName: 'Laptop Battery Replacement', description: 'Get your laptop running longer with a new battery.', price: 99, category: 'Battery', platform: 'Laptop', estimatedTime: '30-60 mins', warranty: '90 days', rating: 4.5, reviewCount: 112, supportedBrands: ['MacBook', 'Dell', 'HP'] },
      { _id: 'l3', serviceName: 'Laptop Keyboard Repair', description: 'Fix stuck, broken, or unresponsive keyboard keys.', price: 129, category: 'Hardware', platform: 'Laptop', estimatedTime: '1-2 hours', warranty: '60 days', rating: 4.4, reviewCount: 89, supportedBrands: ['MacBook', 'Dell', 'HP', 'Lenovo'] },
      { _id: 'l4', serviceName: 'SSD/RAM Upgrade', description: 'Boost your laptop performance with storage and memory upgrades.', price: 79, category: 'Hardware', platform: 'Laptop', estimatedTime: '30-60 mins', warranty: '90 days', rating: 4.7, reviewCount: 167, supportedBrands: ['Most Laptops'] },
      { _id: 'l5', serviceName: 'Virus Removal & Cleanup', description: 'Remove malware, viruses and optimize system performance.', price: 59, category: 'Software', platform: 'Laptop', estimatedTime: '1-2 hours', warranty: '30 days', rating: 4.3, reviewCount: 234 },
      
      // Web/Software Services
      { _id: 'w1', serviceName: 'Website Bug Fixes', description: 'Fix errors, broken features, and performance issues on your website.', price: 99, category: 'Web', platform: 'Website', estimatedTime: '1-3 hours', warranty: '14 days', rating: 4.6, reviewCount: 78, isPopular: true },
      { _id: 'w2', serviceName: 'Website Speed Optimization', description: 'Make your website load faster with performance tuning.', price: 149, category: 'Web', platform: 'Website', estimatedTime: '2-4 hours', warranty: '30 days', rating: 4.7, reviewCount: 56 },
      { _id: 'w3', serviceName: 'WordPress Maintenance', description: 'Updates, backups, security patches for WordPress sites.', price: 79, category: 'Web', platform: 'Website', estimatedTime: '1-2 hours', warranty: '30 days', rating: 4.5, reviewCount: 89 },
      { _id: 'w4', serviceName: 'E-commerce Store Setup', description: 'Set up or fix your online store on Shopify, WooCommerce, etc.', price: 299, category: 'Web', platform: 'Website', estimatedTime: '4-8 hours', warranty: '30 days', rating: 4.8, reviewCount: 34 },
      { _id: 'w5', serviceName: 'Mobile App Debugging', description: 'Fix crashes, bugs and issues in iOS or Android apps.', price: 149, category: 'Software', platform: 'Website', estimatedTime: '2-6 hours', warranty: '14 days', rating: 4.4, reviewCount: 45 },
      
      // All Devices
      { _id: 'all1', serviceName: 'Free Device Diagnostics', description: 'Comprehensive device health check and repair recommendations.', price: 0, category: 'Other', platform: 'All', estimatedTime: '15-30 mins', warranty: 'N/A', rating: 4.9, reviewCount: 567, isPopular: true },
      { _id: 'all2', serviceName: 'Data Transfer Service', description: 'Transfer data between old and new devices safely.', price: 49, category: 'Data', platform: 'All', estimatedTime: '1-2 hours', warranty: 'N/A', rating: 4.6, reviewCount: 234 },
      { _id: 'all3', serviceName: 'Device Setup & Configuration', description: 'Complete setup of new devices with your accounts and preferences.', price: 39, category: 'Software', platform: 'All', estimatedTime: '30-60 mins', warranty: 'N/A', rating: 4.5, reviewCount: 178 }
    ];
  }

  stars(n: number) {
    const full = Math.floor(n || 0);
    const half = (n - full) >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(Math.max(0, 5 - full - half));
  }
}
