import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './core/api.service';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private http = inject(HttpClient);
  private api = inject(ApiService);

  list(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api.baseUrl}/services`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.api.baseUrl}/services/${id}`);
  }

  create(payload: any): Observable<any> {
    return this.http.post(`${this.api.baseUrl}/services`, payload);
  }

  update(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.api.baseUrl}/services/${id}`, payload);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.api.baseUrl}/services/${id}`);
  }
}
