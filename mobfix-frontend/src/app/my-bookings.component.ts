import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookingsService } from './bookings.service';
import { ToastService } from './toast.service';

@Component({
  selector: 'mf-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-header">
      <h2>My Bookings</h2>
      <p class="page-subtitle">Track and manage your repair appointments</p>
    </div>
    
    <!-- Stats Cards -->
    <div class="stats-row" *ngIf="bookings?.length">
      <div class="stat-card">
        <span class="stat-icon">📋</span>
        <div class="stat-info">
          <span class="stat-value">{{ bookings.length }}</span>
          <span class="stat-label">Total Bookings</span>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-icon pending">⏳</span>
        <div class="stat-info">
          <span class="stat-value">{{ pendingCount }}</span>
          <span class="stat-label">Pending</span>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-icon confirmed">✓</span>
        <div class="stat-info">
          <span class="stat-value">{{ confirmedCount }}</span>
          <span class="stat-label">Confirmed</span>
        </div>
      </div>
      <div class="stat-card">
        <span class="stat-icon completed">🎉</span>
        <div class="stat-info">
          <span class="stat-value">{{ completedCount }}</span>
          <span class="stat-label">Completed</span>
        </div>
      </div>
    </div>
    
    <!-- Filter Tabs -->
    <div class="filter-tabs" *ngIf="bookings?.length">
      <button 
        class="filter-tab" 
        [class.active]="filter === 'all'" 
        (click)="filterBookings('all')"
      >All</button>
      <button 
        class="filter-tab" 
        [class.active]="filter === 'pending'" 
        (click)="filterBookings('pending')"
      >Pending</button>
      <button 
        class="filter-tab" 
        [class.active]="filter === 'confirmed'" 
        (click)="filterBookings('confirmed')"
      >Confirmed</button>
      <button 
        class="filter-tab" 
        [class.active]="filter === 'completed'" 
        (click)="filterBookings('completed')"
      >Completed</button>
    </div>
    
    <!-- Loading State -->
    <div class="loading-state" *ngIf="loading">
      <div class="spinner-large"></div>
      <p>Loading your bookings...</p>
    </div>
    
    <!-- Empty State -->
    <div class="empty-state" *ngIf="!loading && !bookings?.length">
      <div class="empty-icon">📱</div>
      <h3>No Bookings Yet</h3>
      <p>You haven't made any repair bookings yet. Browse our services to get started!</p>
      <a routerLink="/services" class="btn primary">Browse Services</a>
    </div>
    
    <!-- Bookings List -->
    <div class="bookings-grid" *ngIf="!loading && filteredBookings?.length">
      <div class="booking-card" *ngFor="let b of filteredBookings" [class]="getStatusClass(b.status)">
        <div class="booking-header">
          <span class="booking-number">#{{ b.bookingNumber || 'N/A' }}</span>
          <span class="status-badge" [class]="(b.status || 'pending').toLowerCase()">
            {{ b.status || 'Pending' }}
          </span>
        </div>
        
        <div class="booking-body">
          <div class="booking-service-info">
            <img 
              class="service-thumb" 
              [src]="imageFor(b.service || b.serviceId || { serviceName: b.serviceName })" 
              [alt]="getServiceName(b)" 
            />
            <div>
              <h4 class="service-name">{{ getServiceName(b) }}</h4>
              <p class="device-info">{{ b.deviceBrand }} {{ b.deviceModel }}</p>
            </div>
          </div>
          
          <div class="booking-details">
            <div class="detail-row">
              <span class="detail-icon">📅</span>
              <span>{{ formatDate(b.preferredDate) }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-icon">⏰</span>
              <span>{{ b.preferredTimeSlot }}</span>
            </div>
            <div class="detail-row" *ngIf="b.estimatedCost">
              <span class="detail-icon">💰</span>
              <span>\${{ b.estimatedCost }}</span>
            </div>
            <div class="detail-row" *ngIf="b.urgency">
              <span class="detail-icon">🔔</span>
              <span class="urgency-badge" [class]="b.urgency.toLowerCase()">{{ b.urgency }} Priority</span>
            </div>
          </div>
        </div>
        
        <div class="booking-footer">
          <button 
            class="btn secondary small" 
            (click)="viewDetails(b)"
          >View Details</button>
          <button 
            class="btn danger small" 
            (click)="cancelBooking(b)"
            *ngIf="canCancel(b.status)"
            [disabled]="cancelling === b._id"
          >
            <span *ngIf="cancelling !== b._id">Cancel</span>
            <span *ngIf="cancelling === b._id" class="spinner"></span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- No Results After Filter -->
    <div class="no-results" *ngIf="!loading && bookings?.length && !filteredBookings?.length">
      <p>No bookings match the selected filter.</p>
      <button class="btn secondary" (click)="filterBookings('all')">Show All</button>
    </div>
    
    <!-- Booking Details Modal -->
    <div class="modal-overlay" *ngIf="selectedBooking" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="modal-close" (click)="closeModal()">×</button>
        <h3>Booking Details</h3>
        
        <div class="modal-section">
          <h4>Service Information</h4>
          <p><strong>Service:</strong> {{ getServiceName(selectedBooking) }}</p>
          <p><strong>Booking #:</strong> {{ selectedBooking.bookingNumber }}</p>
          <p><strong>Status:</strong> 
            <span class="status-badge inline" [class]="(selectedBooking.status || 'pending').toLowerCase()">
              {{ selectedBooking.status || 'Pending' }}
            </span>
          </p>
        </div>
        
        <div class="modal-section">
          <h4>Device Information</h4>
          <p><strong>Brand:</strong> {{ selectedBooking.deviceBrand }}</p>
          <p><strong>Model:</strong> {{ selectedBooking.deviceModel }}</p>
          <p *ngIf="selectedBooking.imeiNumber"><strong>IMEI:</strong> {{ selectedBooking.imeiNumber }}</p>
        </div>
        
        <div class="modal-section">
          <h4>Issue Description</h4>
          <p>{{ selectedBooking.issueDescription }}</p>
        </div>
        
        <div class="modal-section">
          <h4>Appointment</h4>
          <p><strong>Date:</strong> {{ formatDate(selectedBooking.preferredDate) }}</p>
          <p><strong>Time:</strong> {{ selectedBooking.preferredTimeSlot }}</p>
          <p><strong>Urgency:</strong> {{ selectedBooking.urgency }}</p>
        </div>
        
        <div class="modal-section">
          <h4>Contact</h4>
          <p><strong>Phone:</strong> {{ selectedBooking.contactPhone }}</p>
          <p *ngIf="selectedBooking.alternatePhone"><strong>Alternate:</strong> {{ selectedBooking.alternatePhone }}</p>
        </div>
        
        <div class="modal-section" *ngIf="selectedBooking.notes">
          <h4>Notes</h4>
          <p>{{ selectedBooking.notes }}</p>
        </div>
        
        <div class="modal-section pricing">
          <h4>Pricing</h4>
          <p><strong>Estimated Cost:</strong> \${{ selectedBooking.estimatedCost }}</p>
        </div>
        
        <div class="modal-actions">
          <button class="btn secondary" (click)="closeModal()">Close</button>
          <button 
            class="btn danger" 
            *ngIf="canCancel(selectedBooking.status)"
            (click)="cancelBooking(selectedBooking); closeModal()"
          >Cancel Booking</button>
        </div>
      </div>
    </div>
  `,
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  filteredBookings: any[] = [];
  filter: string = 'all';
  loading = true;
  cancelling: string | null = null;
  selectedBooking: any = null;
  
  private cd = inject(ChangeDetectorRef);
  
  constructor(
    private bs: BookingsService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadBookings();
  }
  
  loadBookings() {
    this.loading = true;
    this.bs.myBookings().subscribe({
      next: (res: any) => {
        this.bookings = res || [];
        this.filteredBookings = this.bookings;
        this.loading = false;
        try { this.cd.detectChanges(); } catch (e) {}
      },
      error: (err) => {
        console.error('MyBookingsComponent: myBookings error', err);
        this.loading = false;
        this.toast.error('Failed to load bookings. Please try again.');
      }
    });
  }
  
  filterBookings(filter: string) {
    this.filter = filter;
    if (filter === 'all') {
      this.filteredBookings = this.bookings;
    } else {
      this.filteredBookings = this.bookings.filter(
        b => (b.status || 'pending').toLowerCase() === filter.toLowerCase()
      );
    }
  }
  
  get pendingCount(): number {
    return this.bookings.filter(b => (b.status || 'Pending').toLowerCase() === 'pending').length;
  }
  
  get confirmedCount(): number {
    return this.bookings.filter(b => (b.status || '').toLowerCase() === 'confirmed').length;
  }
  
  get completedCount(): number {
    return this.bookings.filter(b => (b.status || '').toLowerCase() === 'completed').length;
  }
  
  getServiceName(b: any): string {
    return b.serviceName || b.service?.serviceName || b.serviceId?.serviceName || 'Service';
  }
  
  getStatusClass(status: string): string {
    return 'status-' + (status || 'pending').toLowerCase().replace(' ', '-');
  }
  
  formatDate(date: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  canCancel(status: string): boolean {
    const s = (status || 'pending').toLowerCase();
    return s === 'pending' || s === 'confirmed';
  }
  
  viewDetails(booking: any) {
    this.selectedBooking = booking;
  }
  
  closeModal() {
    this.selectedBooking = null;
  }

  cancelBooking(b: any) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    this.cancelling = b._id;
    this.bs.cancel(b._id).subscribe({ 
      next: () => {
        this.bookings = this.bookings.filter(x => x._id !== b._id);
        this.filterBookings(this.filter);
        this.cancelling = null;
        this.toast.success('Booking cancelled successfully');
        try { this.cd.detectChanges(); } catch (e) {}
      }, 
      error: (err) => {
        console.error('Cancel failed', err);
        this.cancelling = null;
        this.toast.error('Failed to cancel booking. Please try again.');
      }
    });
  }

  imageFor(s: any) {
    if (!s) return 'assets/images/placeholder.svg';
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
}
