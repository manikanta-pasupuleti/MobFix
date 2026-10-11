import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './core/api.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private api = inject(ApiService);

  getStats(): Observable<any> {
    return this.http.get(`${this.api.baseUrl}/admin/stats`);
  }

  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api.baseUrl}/admin/customers`);
  }

  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api.baseUrl}/admin/bookings`);
  }

  getTechnicians(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api.baseUrl}/admin/technicians`);
  }

  updateStatus(id: string, status: string, note?: string): Observable<any> {
    return this.http.put(`${this.api.baseUrl}/admin/bookings/${id}/status`, { status, note });
  }

  assignTechnician(id: string, technicianId: string): Observable<any> {
    return this.http.put(`${this.api.baseUrl}/admin/bookings/${id}/assign`, { technicianId });
  }

  sendQuote(id: string, quoteMin: number, quoteMax: number, quoteNotes?: string): Observable<any> {
    return this.http.put(`${this.api.baseUrl}/admin/bookings/${id}/quote`, { quoteMin, quoteMax, quoteNotes });
  }
}
