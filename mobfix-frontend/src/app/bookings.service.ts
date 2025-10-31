import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http = inject(HttpClient);
  // See ServicesService for explanation of runtime-configurable API base
  private apiBase = ((window as any).__env && (window as any).__env.API_URL)
    ? (window as any).__env.API_URL
    : (/localhost|127\.0\.0\.1|::1/.test(window.location.hostname) ? 'http://localhost:5000/api' : '/api');

  apiUrl = this.apiBase;

  create(payload: any) {
    return this.http.post(`${this.apiUrl}/bookings`, payload);
  }

  myBookings(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bookings/mine`);
  }

  cancel(id: string) {
    return this.http.delete(`${this.apiUrl}/bookings/${id}`);
  }
}
