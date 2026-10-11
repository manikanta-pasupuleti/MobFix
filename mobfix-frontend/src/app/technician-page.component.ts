import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TechnicianService } from './technician.service';

@Component({
  selector: 'mf-technician-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="technician-page">
      <header class="page-header">
        <div>
          <p class="eyebrow">Staff workspace</p>
          <h1>Technician dashboard</h1>
          <p>Manage your assigned repairs and keep customers informed.</p>
        </div>
        <button class="refresh-btn" (click)="loadBookings()" [disabled]="loading">Refresh</button>
      </header>

      <div *ngIf="loading" class="state loading">Loading assigned repairs...</div>
      <div *ngIf="error && !loading" class="state error">{{ error }}</div>

      <ng-container *ngIf="!loading && !error">
        <section class="summary-grid">
          <article><strong>{{ activeCount }}</strong><span>Active repairs</span></article>
          <article><strong>{{ todayCount }}</strong><span>Today's appointments</span></article>
          <article><strong>{{ completedCount }}</strong><span>Completed</span></article>
        </section>

        <section class="booking-list" *ngIf="bookings.length; else empty">
          <article class="booking-card" *ngFor="let booking of bookings">
            <div class="card-top">
              <div>
                <span class="booking-number">{{ booking.bookingNumber || booking._id }}</span>
                <h2>{{ booking.serviceId?.serviceName || 'Repair service' }}</h2>
                <p>{{ booking.deviceBrand }} {{ booking.deviceModel }}</p>
              </div>
              <span class="status" [class]="statusClass(booking.status)">{{ booking.status }}</span>
            </div>

            <div class="details">
              <div><small>Appointment</small><strong>{{ formatDate(booking.preferredDate) }}</strong></div>
              <div><small>Time slot</small><strong>{{ booking.preferredTimeSlot }}</strong></div>
              <div><small>Customer</small><strong>{{ booking.userId?.name || booking.userId?.email }}</strong></div>
              <div><small>Contact</small><strong>{{ booking.userId?.phone || booking.contactPhone }}</strong></div>
            </div>

            <p class="issue"><strong>Issue:</strong> {{ booking.issueDescription }}</p>
            <div class="actions">
              <select [(ngModel)]="draftStatus[booking._id]" [disabled]="savingId === booking._id" aria-label="Repair status">
                <option *ngFor="let status of statuses" [value]="status">{{ status }}</option>
              </select>
              <input [(ngModel)]="draftNote[booking._id]" placeholder="Optional customer-facing note" />
              <button (click)="saveStatus(booking)" [disabled]="savingId === booking._id || !draftStatus[booking._id]">
                {{ savingId === booking._id ? 'Saving...' : 'Update status' }}
              </button>
            </div>
          </article>
        </section>
      </ng-container>

      <ng-template #empty>
        <div class="empty state">No repairs are assigned to you yet.</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .technician-page { max-width: 1180px; margin: 0 auto; padding: 2rem 1rem 4rem; color: #17201e; }
    .page-header, .card-top, .actions { display: flex; justify-content: space-between; gap: 1rem; align-items: center; }
    .page-header { margin-bottom: 1.5rem; flex-wrap: wrap; }
    .page-header h1 { margin: .2rem 0; color: #0f4c81; }
    .page-header p { margin: .25rem 0; color: #5b6770; }
    .eyebrow { text-transform: uppercase; letter-spacing: .08em; font-size: .75rem; font-weight: 700; color: #e07a5f !important; }
    .refresh-btn, .actions button { border: 0; border-radius: 8px; padding: .65rem 1rem; background: #0f4c81; color: white; font-weight: 700; cursor: pointer; }
    button:disabled { opacity: .6; cursor: not-allowed; }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .summary-grid article { background: #f4f7f8; border-radius: 12px; padding: 1rem 1.25rem; display: grid; gap: .25rem; }
    .summary-grid strong { font-size: 1.8rem; color: #0f4c81; }
    .summary-grid span, small { color: #65736f; }
    .booking-list { display: grid; gap: 1rem; }
    .booking-card { background: white; border: 1px solid #e2e8e6; border-radius: 14px; padding: 1.25rem; box-shadow: 0 3px 12px rgba(15, 76, 129, .07); }
    .booking-number { font-size: .75rem; color: #65736f; }
    .booking-card h2 { margin: .25rem 0; font-size: 1.2rem; }
    .booking-card p { margin: .25rem 0; color: #65736f; }
    .status { border-radius: 999px; padding: .35rem .7rem; font-size: .8rem; font-weight: 700; white-space: nowrap; }
    .status-pending, .status-quoted { background: #fff3cd; color: #765b00; }
    .status-confirmed, .status-in-progress { background: #dcecff; color: #14508c; }
    .status-ready-for-pickup, .status-completed { background: #dff5e8; color: #17633b; }
    .details { display: grid; grid-template-columns: repeat(4, 1fr); gap: .75rem; margin: 1rem 0; }
    .details div { display: grid; gap: .2rem; }
    .details strong { font-size: .9rem; }
    .issue { border-left: 3px solid #e07a5f; padding-left: .75rem; }
    .actions { margin-top: 1rem; align-items: stretch; }
    .actions select, .actions input { border: 1px solid #cbd5d1; border-radius: 7px; padding: .65rem; min-width: 160px; }
    .actions input { flex: 1; }
    .state { padding: 1rem; border-radius: 10px; background: #f4f7f8; }
    .error { color: #a4262c; background: #fdecec; } .empty { text-align: center; }
    @media (max-width: 720px) { .summary-grid, .details { grid-template-columns: 1fr 1fr; } .actions { flex-direction: column; } .actions select, .actions input { width: 100%; } }
  `]
})
export class TechnicianPageComponent implements OnInit {
  private technicianService = inject(TechnicianService);
  bookings: any[] = [];
  statuses = ['Confirmed', 'In Progress', 'Ready for Pickup', 'Completed'];
  draftStatus: Record<string, string> = {};
  draftNote: Record<string, string> = {};
  loading = false;
  savingId = '';
  error = '';

  ngOnInit() { this.loadBookings(); }

  loadBookings() {
    this.loading = true;
    this.error = '';
    this.technicianService.getBookings().subscribe({
      next: bookings => {
        this.bookings = bookings;
        bookings.forEach(booking => {
          this.draftStatus[booking._id] = booking.status;
          this.draftNote[booking._id] = '';
        });
        this.loading = false;
      },
      error: err => {
        this.error = err.error?.message || 'Unable to load assigned repairs.';
        this.loading = false;
      }
    });
  }

  saveStatus(booking: any) {
    const status = this.draftStatus[booking._id];
    this.savingId = booking._id;
    this.technicianService.updateStatus(booking._id, status, this.draftNote[booking._id]).subscribe({
      next: updated => {
        const index = this.bookings.findIndex(item => item._id === updated._id);
        if (index >= 0) this.bookings[index] = { ...this.bookings[index], ...updated };
        this.draftNote[booking._id] = '';
        this.savingId = '';
      },
      error: err => {
        this.error = err.error?.message || 'Unable to update repair status.';
        this.savingId = '';
      }
    });
  }

  get activeCount() { return this.bookings.filter(b => !['Completed', 'Cancelled'].includes(b.status)).length; }
  get completedCount() { return this.bookings.filter(b => b.status === 'Completed').length; }
  get todayCount() {
    const today = new Date().toDateString();
    return this.bookings.filter(b => new Date(b.preferredDate).toDateString() === today).length;
  }
  formatDate(value: string) { return value ? new Date(value).toLocaleDateString() : '-'; }
  statusClass(status: string) { return `status-${(status || '').toLowerCase().replace(/ /g, '-')}`; }
}
