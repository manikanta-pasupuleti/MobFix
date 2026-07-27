import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './core/api.service';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http = inject(HttpClient);
  private api = inject(ApiService);

  create(payload: any): Observable<any> {
    return this.http.post(`${this.api.baseUrl}/bookings`, payload);
  }

  myBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api.baseUrl}/bookings/mine`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.api.baseUrl}/bookings/${id}`);
  }

  cancel(id: string, reason?: string): Observable<any> {
    return this.http.put(`${this.api.baseUrl}/bookings/${id}/cancel`, { reason });
  }

  update(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.api.baseUrl}/bookings/${id}`, payload);
  }
}
