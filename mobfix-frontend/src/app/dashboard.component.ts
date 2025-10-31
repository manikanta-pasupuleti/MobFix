import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingsService } from './bookings.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'mf-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>My Dashboard</h1>
        <p class="welcome">Welcome back! Here's an overview of your service bookings.</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card stat-primary">
          <div class="stat-icon">📅</div>
          <div class="stat-content">
            <div class="stat-value">{{upcomingBookings.length}}</div>
            <div class="stat-label">Upcoming</div>
          </div>
        </div>
        <div class="stat-card stat-success">
          <div class="stat-icon">✓</div>
          <div class="stat-content">
            <div class="stat-value">{{completedBookings.length}}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>
        <div class="stat-card stat-warning">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <div class="stat-value">{{pendingBookings.length}}</div>
            <div class="stat-label">Pending</div>
          </div>
        </div>
        <div class="stat-card stat-danger">
          <div class="stat-icon">✕</div>
          <div class="stat-content">
            <div class="stat-value">{{cancelledBookings.length}}</div>
            <div class="stat-label">Cancelled</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <button class="action-btn" [routerLink]="['/services']">
            <span class="action-icon">🔧</span>
            <span class="action-label">Book New Service</span>
          </button>
          <button class="action-btn" (click)="scrollToSection('upcoming')">
            <span class="action-icon">📋</span>
            <span class="action-label">View Upcoming</span>
          </button>
          <button class="action-btn" (click)="scrollToSection('history')">
            <span class="action-icon">📜</span>
            <span class="action-label">View History</span>
          </button>
          <button class="action-btn" (click)="refreshBookings()">
            <span class="action-icon">🔄</span>
            <span class="action-label">Refresh</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading your bookings...</p>
      </div>

      <!-- Upcoming Bookings -->
      <div *ngIf="!loading && upcomingBookings.length > 0" id="upcoming" class="bookings-section">
        <h3>Upcoming Appointments</h3>
        <div class="bookings-grid">
          <div class="booking-card" *ngFor="let booking of upcomingBookings">
            <div class="booking-header">
              <span class="booking-number">{{booking.bookingNumber}}</span>
              <span class="status-badge" [class]="'status-' + booking.status.toLowerCase()">{{booking.status}}</span>
            </div>
            
            <div class="booking-body">
              <div class="booking-service">
                <img [src]="booking.serviceId?.imageUrl || 'assets/placeholder.png'" 
                     [alt]="booking.serviceId?.serviceName" 
                     class="service-thumb" />
                <div>
                  <h4>{{booking.serviceId?.serviceName}}</h4>
                  <p class="device-info">{{booking.deviceBrand}} {{booking.deviceModel}}</p>
                </div>
              </div>

              <div class="booking-details">
                <div class="detail-item">
                  <span class="detail-icon">📅</span>
                  <span>{{formatDate(booking.preferredDate)}}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">⏰</span>
                  <span>{{booking.preferredTimeSlot}}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">💰</span>
                  <span>\${{booking.estimatedCost}}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📞</span>
                  <span>{{booking.contactPhone}}</span>
                </div>
              </div>

              <div *ngIf="booking.issueDescription" class="booking-issue">
                <strong>Issue:</strong> {{booking.issueDescription | slice:0:100}}{{booking.issueDescription.length > 100 ? '...' : ''}}
              </div>
            </div>

            <div class="booking-actions">
              <button class="btn-link" [routerLink]="['/booking-confirmation', booking._id]">View Details</button>
              <button class="btn-outline-danger btn-sm" (click)="cancelBooking(booking)" 
                      *ngIf="booking.status === 'Pending' || booking.status === 'Confirmed'">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State for Upcoming -->
      <div *ngIf="!loading && upcomingBookings.length === 0" class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>No Upcoming Appointments</h3>
        <p>You don't have any scheduled services at the moment.</p>
        <button class="btn primary" [routerLink]="['/services']">Browse Services</button>
      </div>

      <!-- Booking History -->
      <div *ngIf="!loading && historyBookings.length > 0" id="history" class="bookings-section">
        <h3>Booking History</h3>
        <div class="history-list">
          <div class="history-item" *ngFor="let booking of historyBookings">
            <div class="history-left">
              <div class="history-status" [class]="booking.status.toLowerCase()">
                <span *ngIf="booking.status === 'Completed'">✓</span>
                <span *ngIf="booking.status === 'Cancelled'">✕</span>
              </div>
              <div class="history-info">
                <h4>{{booking.serviceId?.serviceName}}</h4>
                <p>{{booking.deviceBrand}} {{booking.deviceModel}}</p>
                <p class="history-date">{{formatDate(booking.preferredDate)}} • {{booking.preferredTimeSlot}}</p>
              </div>
            </div>
            <div class="history-right">
              <div class="history-cost">\${{booking.estimatedCost}}</div>
              <span class="status-badge" [class]="'status-' + booking.status.toLowerCase()">{{booking.status}}</span>
              <button class="btn-link btn-sm" [routerLink]="['/booking-confirmation', booking._id]">Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      margin: 0 0 0.5rem 0;
      color: #0d6efd;
    }

    .welcome {
      color: #6c757d;
      font-size: 1.1rem;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: #f8f9fa;
    }

    .stat-primary .stat-icon {
      background: #e7f5ff;
    }

    .stat-success .stat-icon {
      background: #d1e7dd;
    }

    .stat-warning .stat-icon {
      background: #fff3cd;
    }

    .stat-danger .stat-icon {
      background: #f8d7da;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1;
      margin-bottom: 0.25rem;
      color: #212529;
    }

    .stat-label {
      color: #6c757d;
      font-size: 0.9rem;
    }

    .quick-actions {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .quick-actions h3 {
      margin-top: 0;
      color: #0d6efd;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn:hover {
      background: #e7f5ff;
      border-color: #0d6efd;
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 2rem;
    }

    .action-label {
      font-weight: 600;
      color: #495057;
      font-size: 0.9rem;
    }

    .loading-state {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #0d6efd;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .bookings-section {
      margin-bottom: 3rem;
    }

    .bookings-section h3 {
      color: #0d6efd;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e9ecef;
    }

    .bookings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }

    .booking-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: all 0.2s;
    }

    .booking-card:hover {
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      transform: translateY(-2px);
    }

    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e9ecef;
    }

    .booking-number {
      font-family: monospace;
      font-weight: 700;
      color: #0d6efd;
      font-size: 0.9rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-confirmed {
      background: #cfe2ff;
      color: #084298;
    }

    .status-in-progress, .status-in.progress {
      background: #d1e7dd;
      color: #0f5132;
    }

    .status-completed {
      background: #d1e7dd;
      color: #0f5132;
    }

    .status-cancelled {
      background: #f8d7da;
      color: #842029;
    }

    .booking-body {
      margin-bottom: 1rem;
    }

    .booking-service {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
    }

    .service-thumb {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 8px;
    }

    .booking-service h4 {
      margin: 0 0 0.25rem 0;
      color: #212529;
      font-size: 1.1rem;
    }

    .device-info {
      margin: 0;
      color: #6c757d;
      font-size: 0.9rem;
    }

    .booking-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #495057;
    }

    .detail-icon {
      font-size: 1.1rem;
    }

    .booking-issue {
      background: #f8f9fa;
      padding: 0.75rem;
      border-radius: 6px;
      font-size: 0.9rem;
      color: #495057;
      margin-bottom: 1rem;
    }

    .booking-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }

    .btn-link {
      background: none;
      border: none;
      color: #0d6efd;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      padding: 0.5rem;
    }

    .btn-link:hover {
      text-decoration: underline;
    }

    .btn-outline-danger {
      background: white;
      border: 1px solid #dc3545;
      color: #dc3545;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-outline-danger:hover {
      background: #dc3545;
      color: white;
    }

    .btn-sm {
      font-size: 0.875rem;
      padding: 0.375rem 0.75rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #495057;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #6c757d;
      margin-bottom: 1.5rem;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .history-item {
      background: white;
      padding: 1.25rem;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: all 0.2s;
    }

    .history-item:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }

    .history-left {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex: 1;
    }

    .history-status {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .history-status.completed {
      background: #d1e7dd;
      color: #0f5132;
    }

    .history-status.cancelled {
      background: #f8d7da;
      color: #842029;
    }

    .history-info h4 {
      margin: 0 0 0.25rem 0;
      color: #212529;
    }

    .history-info p {
      margin: 0;
      color: #6c757d;
      font-size: 0.9rem;
    }

    .history-date {
      font-size: 0.85rem !important;
      color: #adb5bd !important;
    }

    .history-right {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .history-cost {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0d6efd;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }

      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr 1fr;
      }

      .bookings-grid {
        grid-template-columns: 1fr;
      }

      .history-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .history-right {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  bookings: any[] = [];
  loading = true;

  constructor(
    private bookingsService: BookingsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingsService.myBookings().subscribe({
      next: (bookings: any[]) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.loading = false;
      }
    });
  }

  get upcomingBookings() {
    const now = new Date();
    return this.bookings.filter(b => {
      const bookingDate = new Date(b.preferredDate);
      return (b.status === 'Pending' || b.status === 'Confirmed' || b.status === 'In Progress') 
             && bookingDate >= now;
    });
  }

  get historyBookings() {
    const now = new Date();
    return this.bookings.filter(b => {
      const bookingDate = new Date(b.preferredDate);
      return b.status === 'Completed' || b.status === 'Cancelled' || bookingDate < now;
    });
  }

  get pendingBookings() {
    return this.bookings.filter(b => b.status === 'Pending');
  }

  get completedBookings() {
    return this.bookings.filter(b => b.status === 'Completed');
  }

  get cancelledBookings() {
    return this.bookings.filter(b => b.status === 'Cancelled');
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  cancelBooking(booking: any) {
    if (!confirm(`Cancel booking for ${booking.serviceId?.serviceName}?`)) {
      return;
    }

    this.bookingsService.cancel(booking._id).subscribe({
      next: () => {
        // Reload bookings to reflect the change
        this.loadBookings();
        alert('Booking cancelled successfully');
      },
      error: (err) => {
        console.error('Error cancelling booking:', err);
        alert(err.error?.message || 'Failed to cancel booking');
      }
    });
  }

  refreshBookings() {
    this.loadBookings();
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
