import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './core/api.service';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private http = inject(HttpClient);
  private api = inject(ApiService);

  getByService(serviceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api.baseUrl}/reviews/service/${serviceId}`);
  }

  create(review: { serviceId: string; rating: number; comment: string }): Observable<any> {
    return this.http.post(`${this.api.baseUrl}/reviews`, review);
  }

  update(reviewId: string, updates: { rating?: number; comment?: string }): Observable<any> {
    return this.http.put(`${this.api.baseUrl}/reviews/${reviewId}`, updates);
  }

  delete(reviewId: string): Observable<any> {
    return this.http.delete(`${this.api.baseUrl}/reviews/${reviewId}`);
  }
}
