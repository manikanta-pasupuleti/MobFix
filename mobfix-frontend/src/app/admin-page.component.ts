import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AdminService } from './admin.service';

@Component({
  selector: 'mf-admin-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <div class="header-row">
        <div>
          <h1>Admin Panel</h1>
          <p>Customer details and booking activity overview.</p>
        </div>
        <button class="refresh-btn" (click)="loadAdminData()" [disabled]="loading">Refresh</button>
      </div>

      <div *ngIf="loading" class="state state-loading">Loading admin data...</div>
      <div *ngIf="error && !loading" class="state state-error">{{ error }}</div>

      <ng-container *ngIf="!loading && !error">
        <section class="stats-grid">
          <article class="stat-card">
            <h3>{{ stats.totalUsers || 0 }}</h3>
            <p>Total Users</p>
          </article>
          <article class="stat-card">
            <h3>{{ stats.totalBookings || 0 }}</h3>
            <p>Total Bookings</p>
          </article>
          <article class="stat-card">
            <h3>{{ stats.totalServices || 0 }}</h3>
            <p>Total Services</p>
          </article>
          <article class="stat-card">
            <h3>{{ bookings.length || 0 }}</h3>
            <p>Booking Records</p>
          </article>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Users</h2>
            <span>{{ customers.length }} users</span>
          </div>

          <div class="table-wrap" *ngIf="customers.length; else noUsersTpl">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let customer of customers">
                  <td>{{ customer.name || '-' }}</td>
                  <td>{{ customer.email || '-' }}</td>
                  <td>{{ customer.phone || '-' }}</td>
                  <td>{{ customer.role || 'user' }}</td>
                  <td>{{ formatDate(customer.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <h2>Recent Bookings</h2>
            <span>{{ bookings.length }} bookings</span>
          </div>

          <div class="table-wrap" *ngIf="bookings.length; else noBookingsTpl">
            <table>
              <thead>
                <tr>
                  <th>Booking #</th>
                  <th>User</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let booking of bookings.slice(0, 20)">
                  <td>{{ booking.bookingNumber || booking._id }}</td>
                  <td>{{ booking.userId?.name || booking.userId?.email || '-' }}</td>
                  <td>{{ booking.serviceId?.serviceName || '-' }}</td>
                  <td>
                    <span class="status" [class]="statusClass(booking.status)">{{ booking.status || '-' }}</span>
                  </td>
                  <td>{{ formatDate(booking.createdAt) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </ng-container>

      <ng-template #noUsersTpl>
        <p class="empty-msg">No users found.</p>
      </ng-template>

      <ng-template #noBookingsTpl>
        <p class="empty-msg">No bookings found.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .admin-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1rem;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .header-row h1 {
      margin: 0;
      color: #0f4c81;
    }

    .header-row p {
      margin: 0.4rem 0 0;
      color: #5b6770;
    }

    .refresh-btn {
      border: 1px solid #0f4c81;
      color: #0f4c81;
      background: #fff;
      border-radius: 8px;
      padding: 0.55rem 1rem;
      cursor: pointer;
      font-weight: 600;
    }

    .refresh-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .state {
      border-radius: 8px;
      padding: 0.9rem 1rem;
    }

    .state-loading {
      background: #e7f1ff;
      color: #0f4c81;
    }

    .state-error {
      background: #fdecea;
      color: #b42318;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .stat-card {
      background: linear-gradient(160deg, #ffffff 0%, #f5f8fc 100%);
      border: 1px solid #d8e2ee;
      border-radius: 12px;
      padding: 1rem;
    }

    .stat-card h3 {
      margin: 0;
      font-size: 1.8rem;
      color: #0f4c81;
    }

    .stat-card p {
      margin: 0.35rem 0 0;
      color: #5b6770;
      font-size: 0.9rem;
    }

    .panel {
      background: #fff;
      border: 1px solid #e6edf5;
      border-radius: 12px;
      overflow: hidden;
    }

    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.9rem 1rem;
      border-bottom: 1px solid #eef2f7;
      background: #f8fafc;
    }

    .panel-head h2 {
      margin: 0;
      font-size: 1.05rem;
      color: #18324a;
    }

    .panel-head span {
      color: #5b6770;
      font-size: 0.9rem;
    }

    .table-wrap {
      overflow: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 760px;
    }

    th, td {
      text-align: left;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f1f4f8;
      font-size: 0.92rem;
    }

    th {
      color: #3a4f64;
      background: #fbfdff;
      font-weight: 700;
    }

    td {
      color: #22313f;
    }

    .status {
      display: inline-block;
      border-radius: 999px;
      padding: 0.2rem 0.6rem;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: capitalize;
      background: #eef2f7;
      color: #425466;
    }

    .status-pending {
      background: #fff3cd;
      color: #8a6d1f;
    }

    .status-confirmed,
    .status-in-progress {
      background: #dbeafe;
      color: #1e3a8a;
    }

    .status-completed {
      background: #dcfce7;
      color: #166534;
    }

    .status-cancelled {
      background: #fee2e2;
      color: #991b1b;
    }

    .empty-msg {
      margin: 0;
      padding: 1rem;
      color: #5b6770;
    }

    @media (max-width: 768px) {
      .admin-page {
        padding: 0.5rem;
      }

      .header-row {
        align-items: flex-start;
      }

      .refresh-btn {
        width: 100%;
      }
    }
  `]
})
export class AdminPageComponent implements OnInit {
  private adminService = inject(AdminService);

  loading = true;
  error = '';
  stats: any = {};
  customers: any[] = [];
  bookings: any[] = [];

  ngOnInit(): void {
    this.loadAdminData();
  }

  loadAdminData(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      stats: this.adminService.getStats(),
      customers: this.adminService.getCustomers(),
      bookings: this.adminService.getBookings()
    }).subscribe({
      next: ({ stats, customers, bookings }) => {
        this.stats = stats || {};
        this.customers = Array.isArray(customers) ? customers : [];
        this.bookings = Array.isArray(bookings) ? bookings : [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to load admin information.';
      }
    });
  }

  formatDate(value: string): string {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString();
  }

  statusClass(status: string): string {
    if (!status) return '';
    return `status-${status.toLowerCase().replace(/\s+/g, '-')}`;
  }
}
