import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private apiBase: string;

  constructor(private http: HttpClient) {
    this.apiBase = ((window as any).__env && (window as any).__env.API_URL)
      ? (window as any).__env.API_URL
      : (/localhost|127\.0\.0\.1|::1/.test(window.location.hostname)
        ? 'http://localhost:5000/api'
        : '/api');
  }

  // Get reviews for a service
  getReviewsByService(serviceId: string): Observable<any> {
    return this.http.get(`${this.apiBase}/reviews/service/${serviceId}`);
  }

  // Create a new review
  createReview(review: { serviceId: string, rating: number, comment: string }): Observable<any> {
    return this.http.post(`${this.apiBase}/reviews`, review);
  }

  // Update a review
  updateReview(reviewId: string, updates: { rating?: number, comment?: string }): Observable<any> {
    return this.http.put(`${this.apiBase}/reviews/${reviewId}`, updates);
  }

  // Delete a review
  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete(`${this.apiBase}/reviews/${reviewId}`);
  }
}
