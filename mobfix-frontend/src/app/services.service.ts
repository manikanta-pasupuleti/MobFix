import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private http = inject(HttpClient);
  apiUrl = 'http://localhost:5000/api';

  list(): Observable<any> {
    return this.http.get(`${this.apiUrl}/services`);
  }

  create(payload: any) {
    return this.http.post(`${this.apiUrl}/services`, payload);
  }
}
