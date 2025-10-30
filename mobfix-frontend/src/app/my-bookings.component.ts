import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingsService } from './bookings.service';

@Component({
  selector: 'mf-my-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header"><h2>My Bookings</h2></div>
    <div *ngIf="!bookings?.length" class="empty">You have no bookings.</div>
    <div class="bookings-list">
      <div class="booking-card" *ngFor="let b of bookings">
        <div style="display:flex; gap:0.75rem; align-items:center">
          <img class="service-img" [src]="imageFor(b.service || b.serviceId || { serviceName: b.serviceName })" [alt]="b.serviceName" style="width:84px; height:64px; object-fit:cover; border-radius:8px" />
          <div class="booking-left">
            <div class="booking-service">{{ b.serviceName ? b.serviceName : (b.service?.serviceName ? b.service.serviceName : (b.serviceId?.serviceName ? b.serviceId.serviceName : 'Service')) }}</div>
            <div class="booking-meta">{{ b.mobileModel }} — {{ b.date }} {{ b.time }}</div>
          </div>
        </div>
        <div class="booking-right">
          <div class="booking-status"><span [ngClass]="['status-pill', (b.status || '').toLowerCase()]">{{ b.status || 'Pending' }}</span></div>
          <div style="margin-top:0.5rem; text-align:right">
            <button class="btn" (click)="cancelBooking(b)">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  private cd = inject(ChangeDetectorRef);
  constructor(private bs: BookingsService) {}

  ngOnInit() {
    // Primary fetch via Angular HttpClient (uses interceptor)
    this.bs.myBookings().subscribe({
      next: (res: any) => {
        this.bookings = res || [];
        // ensure view updates in case of zone/coalescing optimizations
        try { this.cd.detectChanges(); } catch (e) {}
      },
      error: (err) => {
        console.error('MyBookingsComponent: myBookings error', err);
      }
    });
  }

  cancelBooking(b: any) {
    if (!confirm('Cancel this booking?')) return;
    this.bs.cancel(b._id).subscribe({ next: () => {
        this.bookings = this.bookings.filter(x => x._id !== b._id);
        try { this.cd.detectChanges(); } catch (e) {}
      }, error: (err) => {
        console.error('Cancel failed', err);
        alert('Failed to cancel booking');
      }
    });
  }

  // Local image helper (same logic as ServicesComponent.imageFor)
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
