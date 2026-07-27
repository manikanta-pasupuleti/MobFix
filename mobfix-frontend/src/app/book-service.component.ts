import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServicesService } from './services.service';
import { BookingsService } from './bookings.service';

@Component({
  selector: 'mf-book-service',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-header">
      <button class="btn" (click)="goBack()" style="margin-bottom:1rem">← Back to Services</button>
      <h2>Book Service</h2>
    </div>

    <div *ngIf="service" class="booking-container">
      <!-- Progress Steps -->
      <div class="steps">
        <div class="step" [class.active]="currentStep === 1" [class.completed]="currentStep > 1">
          <span class="step-num">1</span>
          <span class="step-label">Device Info</span>
        </div>
        <div class="step-divider"></div>
        <div class="step" [class.active]="currentStep === 2" [class.completed]="currentStep > 2">
          <span class="step-num">2</span>
          <span class="step-label">Issue Details</span>
        </div>
        <div class="step-divider"></div>
        <div class="step" [class.active]="currentStep === 3" [class.completed]="currentStep > 3">
          <span class="step-num">3</span>
          <span class="step-label">Schedule</span>
        </div>
        <div class="step-divider"></div>
        <div class="step" [class.active]="currentStep === 4">
          <span class="step-num">4</span>
          <span class="step-label">Contact & Review</span>
        </div>
      </div>

      <!-- Service Summary Card -->
      <div class="service-summary">
        <img [src]="service.imageUrl" [alt]="service.serviceName" class="summary-img" />
        <div class="summary-info">
          <h3>{{service.serviceName}}</h3>
          <p class="summary-price">Estimated Cost: <strong>\${{service.price}}</strong></p>
          <p class="summary-time">⏱️ {{service.estimatedTime}} • 🛡️ {{service.warranty}} warranty</p>
        </div>
      </div>

      <!-- Step 1: Device Information -->
      <div class="step-content" *ngIf="currentStep === 1">
        <h3>Device Information</h3>
        <div class="form-group">
          <label>Device Brand *</label>
          <select [(ngModel)]="booking.deviceBrand" required>
            <option value="">Select brand...</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="Google">Google</option>
            <option value="OnePlus">OnePlus</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Oppo">Oppo</option>
            <option value="Vivo">Vivo</option>
            <option value="Motorola">Motorola</option>
            <option value="Nokia">Nokia</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="form-group">
          <label>Device Model *</label>
          <input type="text" [(ngModel)]="booking.deviceModel" placeholder="e.g., iPhone 14 Pro, Galaxy S23 Ultra" required />
          <small>Enter your exact phone model</small>
        </div>

        <div class="form-group">
          <label>IMEI Number (Optional)</label>
          <input type="text" [(ngModel)]="booking.imeiNumber" placeholder="15-digit IMEI number" maxlength="15" />
          <small>Dial *#06# to find your IMEI</small>
        </div>

        <div class="form-actions">
          <button class="btn secondary" (click)="goBack()">Cancel</button>
          <button class="btn primary" (click)="nextStep()" [disabled]="!booking.deviceBrand || !booking.deviceModel">
            Next: Issue Details →
          </button>
        </div>
      </div>

      <!-- Step 2: Issue Details -->
      <div class="step-content" *ngIf="currentStep === 2">
        <h3>Issue Details</h3>
        <div class="form-group">
          <label>Describe the Issue *</label>
          <textarea [(ngModel)]="booking.issueDescription" 
                    rows="5" 
                    placeholder="Please describe the problem with your device in detail..."
                    required></textarea>
          <small>Be as specific as possible to help us prepare</small>
        </div>

        <div class="form-group">
          <label>Urgency Level</label>
          <div class="urgency-options">
            <label class="urgency-option" [class.selected]="booking.urgency === 'Low'">
              <input type="radio" [(ngModel)]="booking.urgency" value="Low" />
              <div class="urgency-card">
                <span class="urgency-icon">🟢</span>
                <strong>Low</strong>
                <small>Can wait a few days</small>
              </div>
            </label>
            <label class="urgency-option" [class.selected]="booking.urgency === 'Medium'">
              <input type="radio" [(ngModel)]="booking.urgency" value="Medium" />
              <div class="urgency-card">
                <span class="urgency-icon">🟡</span>
                <strong>Medium</strong>
                <small>Needs attention soon</small>
              </div>
            </label>
            <label class="urgency-option" [class.selected]="booking.urgency === 'High'">
              <input type="radio" [(ngModel)]="booking.urgency" value="High" />
              <div class="urgency-card">
                <span class="urgency-icon">🔴</span>
                <strong>High</strong>
                <small>Urgent, need ASAP</small>
              </div>
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn secondary" (click)="prevStep()">← Back</button>
          <button class="btn primary" (click)="nextStep()" [disabled]="!booking.issueDescription">
            Next: Schedule →
          </button>
        </div>
      </div>

      <!-- Step 3: Schedule Appointment -->
      <div class="step-content" *ngIf="currentStep === 3">
        <h3>Schedule Your Appointment</h3>
        <div class="form-group">
          <label>Preferred Date *</label>
          <input type="date" [(ngModel)]="booking.preferredDate" [min]="minDate" required />
        </div>

        <div class="form-group">
          <label>Preferred Time Slot *</label>
          <select [(ngModel)]="booking.preferredTimeSlot" required>
            <option value="">Select time slot...</option>
            <option value="9:00 AM - 11:00 AM">9:00 AM - 11:00 AM</option>
            <option value="11:00 AM - 1:00 PM">11:00 AM - 1:00 PM</option>
            <option value="1:00 PM - 3:00 PM">1:00 PM - 3:00 PM</option>
            <option value="3:00 PM - 5:00 PM">3:00 PM - 5:00 PM</option>
            <option value="5:00 PM - 7:00 PM">5:00 PM - 7:00 PM</option>
          </select>
        </div>

        <div class="form-actions">
          <button class="btn secondary" (click)="prevStep()">← Back</button>
          <button class="btn primary" (click)="nextStep()" [disabled]="!booking.preferredDate || !booking.preferredTimeSlot">
            Next: Contact Info →
          </button>
        </div>
      </div>

      <!-- Step 4: Contact & Review -->
      <div class="step-content" *ngIf="currentStep === 4">
        <h3>Contact Information & Review</h3>
        <div class="form-group">
          <label>Contact Phone *</label>
          <input type="tel" [(ngModel)]="booking.contactPhone" placeholder="(555) 123-4567" required />
        </div>

        <div class="form-group">
          <label>Alternate Phone (Optional)</label>
          <input type="tel" [(ngModel)]="booking.alternatePhone" placeholder="Backup contact number" />
        </div>

        <div class="form-group">
          <label>Additional Notes (Optional)</label>
          <textarea [(ngModel)]="booking.notes" 
                    rows="3" 
                    placeholder="Any special instructions or questions?"></textarea>
        </div>

        <!-- Booking Summary -->
        <div class="booking-summary">
          <h4>Booking Summary</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <strong>Service:</strong>
              <span>{{service.serviceName}}</span>
            </div>
            <div class="summary-item">
              <strong>Device:</strong>
              <span>{{booking.deviceBrand}} {{booking.deviceModel}}</span>
            </div>
            <div class="summary-item">
              <strong>Issue:</strong>
              <span>{{booking.issueDescription | slice:0:100}}{{booking.issueDescription.length > 100 ? '...' : ''}}</span>
            </div>
            <div class="summary-item">
              <strong>Urgency:</strong>
              <span class="urgency-badge" [class]="'urgency-' + booking.urgency.toLowerCase()">{{booking.urgency}}</span>
            </div>
            <div class="summary-item">
              <strong>Date:</strong>
              <span>{{formatDate(booking.preferredDate)}}</span>
            </div>
            <div class="summary-item">
              <strong>Time:</strong>
              <span>{{booking.preferredTimeSlot}}</span>
            </div>
            <div class="summary-item">
              <strong>Contact:</strong>
              <span>{{booking.contactPhone}}</span>
            </div>
            <div class="summary-item">
              <strong>Estimated Cost:</strong>
              <span class="cost">\${{service.price}}</span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn secondary" (click)="prevStep()">← Back</button>
          <button class="btn primary" (click)="submitBooking()" [disabled]="!booking.contactPhone || submitting">
            {{submitting ? 'Confirming...' : 'Confirm Booking'}}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .booking-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .steps {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 2rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      opacity: 0.5;
      transition: all 0.3s;
    }

    .step.active, .step.completed {
      opacity: 1;
    }

    .step-num {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #6c757d;
      transition: all 0.3s;
    }

    .step.active .step-num {
      background: linear-gradient(90deg, #0d6efd, #2b8fff);
      color: white;
      transform: scale(1.1);
    }

    .step.completed .step-num {
      background: #198754;
      color: white;
    }

    .step-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #6c757d;
    }

    .step.active .step-label {
      color: #0d6efd;
    }

    .step-divider {
      width: 60px;
      height: 2px;
      background: #e9ecef;
      margin: 0 0.5rem;
    }

    .service-summary {
      display: flex;
      gap: 1rem;
      background: white;
      padding: 1rem;
      border-radius: 12px;
      border: 1px solid #e9ecef;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .summary-img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
    }

    .summary-info h3 {
      margin: 0 0 0.5rem 0;
      color: #0d6efd;
    }

    .summary-price {
      margin: 0.25rem 0;
      font-size: 1.1rem;
    }

    .summary-time {
      margin: 0;
      color: #6c757d;
      font-size: 0.9rem;
    }

    .step-content {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid #e9ecef;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .step-content h3 {
      margin-top: 0;
      color: #212529;
      border-bottom: 2px solid #0d6efd;
      padding-bottom: 0.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #495057;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #0d6efd;
      box-shadow: 0 0 0 3px rgba(13,110,253,0.1);
    }

    .form-group small {
      display: block;
      margin-top: 0.25rem;
      color: #6c757d;
      font-size: 0.875rem;
    }

    .urgency-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .urgency-option input[type="radio"] {
      display: none;
    }

    .urgency-card {
      padding: 1rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .urgency-option:hover .urgency-card {
      border-color: #0d6efd;
      transform: translateY(-2px);
    }

    .urgency-option.selected .urgency-card {
      border-color: #0d6efd;
      background: #e7f5ff;
    }

    .urgency-icon {
      font-size: 2rem;
      display: block;
      margin-bottom: 0.5rem;
    }

    .urgency-card strong {
      display: block;
      margin-bottom: 0.25rem;
    }

    .urgency-card small {
      color: #6c757d;
    }

    .booking-summary {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 1.5rem;
    }

    .booking-summary h4 {
      margin-top: 0;
      color: #0d6efd;
    }

    .summary-grid {
      display: grid;
      gap: 1rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid #dee2e6;
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    .summary-item strong {
      color: #495057;
    }

    .summary-item .cost {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0d6efd;
    }

    .urgency-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .urgency-badge.urgency-low {
      background: #d1e7dd;
      color: #0f5132;
    }

    .urgency-badge.urgency-medium {
      background: #fff3cd;
      color: #856404;
    }

    .urgency-badge.urgency-high {
      background: #f8d7da;
      color: #842029;
    }

    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e9ecef;
    }

    @media (max-width: 600px) {
      .steps {
        flex-wrap: wrap;
      }

      .step-divider {
        display: none;
      }

      .urgency-options {
        grid-template-columns: 1fr;
      }

      .service-summary {
        flex-direction: column;
      }

      .summary-img {
        width: 100%;
        height: 200px;
      }
    }
  `]
})
export class BookServiceComponent implements OnInit {
  service: any = null;
  currentStep = 1;
  submitting = false;
  minDate = '';

  booking = {
    deviceBrand: '',
    deviceModel: '',
    imeiNumber: '',
    issueDescription: '',
    urgency: 'Medium',
    preferredDate: '',
    preferredTimeSlot: '',
    contactPhone: '',
    alternatePhone: '',
    notes: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicesService: ServicesService,
    private bookingsService: BookingsService
  ) {}

  ngOnInit() {
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.minDate = tomorrow.toISOString().split('T')[0];

    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.loadService(serviceId);
    }
  }

  loadService(id: string) {
    this.servicesService.list().subscribe({
      next: (services: any[]) => {
        this.service = services.find(s => s._id === id);
        if (!this.service) {
          this.router.navigate(['/services']);
        }
      }
    });
  }

  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitBooking() {
    if (!this.service) {
      alert('Service not found. Please try again.');
      return;
    }

    // Validate all required fields
    const requiredFields = {
      'Device Brand': this.booking.deviceBrand,
      'Device Model': this.booking.deviceModel,
      'Issue Description': this.booking.issueDescription,
      'Preferred Date': this.booking.preferredDate,
      'Time Slot': this.booking.preferredTimeSlot,
      'Contact Phone': this.booking.contactPhone
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([field, _]) => field);

    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    this.submitting = true;

    const bookingData = {
      serviceId: this.service._id,
      deviceBrand: this.booking.deviceBrand,
      deviceModel: this.booking.deviceModel,
      imeiNumber: this.booking.imeiNumber || '',
      issueDescription: this.booking.issueDescription,
      urgency: this.booking.urgency,
      preferredDate: this.booking.preferredDate,
      preferredTimeSlot: this.booking.preferredTimeSlot,
      contactPhone: this.booking.contactPhone,
      alternatePhone: this.booking.alternatePhone || '',
      notes: this.booking.notes || ''
    };

    console.log('Submitting booking data:', JSON.stringify(bookingData, null, 2));

    this.bookingsService.create(bookingData).subscribe({
      next: (response: any) => {
        this.submitting = false;
        console.log('Booking created successfully:', response);
        // Navigate to confirmation page with booking number
        this.router.navigate(['/booking-confirmation', response._id]);
      },
      error: (err) => {
        this.submitting = false;
        console.error('Booking error details:', err);
        console.error('Error response:', err.error);
        const errorMessage = err.error?.message || err.message || 'Failed to create booking. Please ensure you are logged in.';
        alert(`Booking failed: ${errorMessage}`);
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  goBack() {
    this.router.navigate(['/services', this.service?._id || '']);
  }
}
