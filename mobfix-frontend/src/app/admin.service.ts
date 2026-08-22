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
}
