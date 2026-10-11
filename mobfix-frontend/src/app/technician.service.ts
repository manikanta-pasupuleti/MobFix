import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './core/api.service';

@Injectable({ providedIn: 'root' })
export class TechnicianService {
  private http = inject(HttpClient);
  private api = inject(ApiService);

  getBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api.baseUrl}/technician/bookings`);
  }

  updateStatus(id: string, status: string, note?: string): Observable<any> {
    return this.http.put(`${this.api.baseUrl}/technician/bookings/${id}/status`, { status, note });
  }
}
