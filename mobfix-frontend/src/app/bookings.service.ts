import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private http = inject(HttpClient);
  apiUrl = 'http://localhost:5000/api';

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
