import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicesService {
  private http = inject(HttpClient);
  // Resolve API base URL in this order:
  // 1. runtime-injected global `window.__env.API_URL` (set by deploy scripts or index.html)
  // 2. if running on localhost during development, use full http://localhost:5000/api
  // 3. fallback to relative `/api` for production deployments where frontend and backend share origin
  private apiBase = ((window as any).__env && (window as any).__env.API_URL)
    ? (window as any).__env.API_URL
    : (/localhost|127\.0\.0\.1|::1/.test(window.location.hostname) ? 'http://localhost:5000/api' : '/api');

  apiUrl = this.apiBase;

  list(): Observable<any> {
    return this.http.get(`${this.apiUrl}/services`);
  }

  create(payload: any) {
    return this.http.post(`${this.apiUrl}/services`, payload);
  }
}
