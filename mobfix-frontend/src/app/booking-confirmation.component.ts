import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookingsService } from './bookings.service';

@Component({
  selector: 'mf-booking-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="confirmation-container">
      <div class="success-icon">✓</div>
      <h1>Booking Confirmed!</h1>
      <p class="confirmation-message">Your service appointment has been successfully scheduled.</p>

      <div *ngIf="booking" class="confirmation-card">
        <div class="booking-number">
          <span class="label">Booking Number</span>
          <span class="number">{{booking.bookingNumber}}</span>
          <small>Please save this for your records</small>
        </div>

        <div class="booking-details">
          <h3>Appointment Details</h3>
          
          <div class="detail-row">
            <span class="icon">🔧</span>
            <div class="detail-content">
              <strong>Service</strong>
              <span>{{booking.serviceId?.serviceName}}</span>
            </div>
          </div>

          <div class="detail-row">
            <span class="icon">📱</span>
            <div class="detail-content">
              <strong>Device</strong>
              <span>{{booking.deviceBrand}} {{booking.deviceModel}}</span>
            </div>
          </div>

          <div class="detail-row">
            <span class="icon">📅</span>
            <div class="detail-content">
              <strong>Date & Time</strong>
              <span>{{formatDate(booking.preferredDate)}}</span>
              <span>{{booking.preferredTimeSlot}}</span>
            </div>
          </div>

          <div class="detail-row">
            <span class="icon">📞</span>
            <div class="detail-content">
              <strong>Contact</strong>
              <span>{{booking.contactPhone}}</span>
            </div>
          </div>

          <div class="detail-row">
            <span class="icon">💰</span>
            <div class="detail-content">
              <strong>Estimated Cost</strong>
              <span class="price">\${{booking.estimatedCost}}</span>
            </div>
          </div>

          <div class="detail-row">
            <span class="icon">⏱️</span>
            <div class="detail-content">
              <strong>Estimated Time</strong>
              <span>{{booking.serviceId?.estimatedTime}}</span>
            </div>
          </div>

          <div class="detail-row status-row">
            <span class="icon">📋</span>
            <div class="detail-content">
              <strong>Status</strong>
              <span class="status-badge status-pending">{{booking.status}}</span>
            </div>
          </div>
        </div>

        <div class="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>✓ We've sent a confirmation to your contact number</li>
            <li>✓ Our team will review and confirm your appointment within 24 hours</li>
            <li>✓ You'll receive a reminder 1 day before your appointment</li>
            <li>✓ Please bring your device and any accessories</li>
          </ul>
        </div>

        <div class="actions">
          <button class="btn secondary" [routerLink]="['/my-bookings']">View My Bookings</button>
          <button class="btn primary" [routerLink]="['/services']">Book Another Service</button>
        </div>
      </div>

      <div *ngIf="!booking && !loading" class="error-state">
        <p>Booking not found or you don't have permission to view it.</p>
        <button class="btn primary" [routerLink]="['/services']">Go to Services</button>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading booking details...</p>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container {
      max-width: 700px;
      margin: 2rem auto;
      padding: 2rem;
      text-align: center;
    }

    .success-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #198754, #20c997);
      color: white;
      font-size: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      animation: successPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    @keyframes successPop {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }

    h1 {
      color: #198754;
      margin-bottom: 0.5rem;
    }

    .confirmation-message {
      color: #6c757d;
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }

    .confirmation-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      padding: 2rem;
      text-align: left;
      animation: slideUp 0.5s ease-out 0.2s both;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .booking-number {
      background: linear-gradient(135deg, #0d6efd, #2b8fff);
      color: white;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 2rem;
    }

    .booking-number .label {
      display: block;
      font-size: 0.9rem;
      opacity: 0.9;
      margin-bottom: 0.5rem;
    }

    .booking-number .number {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: 2px;
      margin-bottom: 0.5rem;
    }

    .booking-number small {
      display: block;
      font-size: 0.85rem;
      opacity: 0.8;
    }

    .booking-details h3,
    .next-steps h3 {
      color: #0d6efd;
      margin-top: 0;
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #e9ecef;
    }

    .detail-row {
      display: flex;
      align-items: start;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #f8f9fa;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row .icon {
      font-size: 1.5rem;
      flex-shrink: 0;
    }

    .detail-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-content strong {
      color: #495057;
      font-size: 0.9rem;
    }

    .detail-content span {
      color: #212529;
    }

    .detail-content .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0d6efd;
    }

    .status-badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .next-steps {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin: 2rem 0;
    }

    .next-steps ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .next-steps li {
      padding: 0.75rem 0;
      color: #495057;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }

    .loading-state {
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

    .error-state {
      padding: 3rem;
    }

    .error-state p {
      color: #842029;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 600px) {
      .confirmation-container {
        padding: 1rem;
      }

      .confirmation-card {
        padding: 1.5rem;
      }

      .booking-number .number {
        font-size: 1.5rem;
      }

      .actions {
        flex-direction: column;
      }

      .actions button {
        width: 100%;
      }
    }
  `]
})
export class BookingConfirmationComponent implements OnInit {
  booking: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingsService: BookingsService
  ) {}

  ngOnInit() {
    const bookingId = this.route.snapshot.paramMap.get('id');
    if (bookingId) {
      this.loadBooking(bookingId);
    } else {
      this.loading = false;
    }
  }

  loadBooking(id: string) {
    this.bookingsService.getById(id).subscribe({
      next: (booking) => {
        this.booking = booking;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading booking:', err);
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
