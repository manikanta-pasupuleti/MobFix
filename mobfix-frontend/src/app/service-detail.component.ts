import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService } from './services.service';
import { ReviewsService } from './reviews.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'mf-service-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <button class="btn" (click)="goBack()" style="margin-bottom:1rem">← Back to Services</button>
      <h2>{{service?.serviceName}}</h2>
    </div>

    <div *ngIf="service" class="service-detail">
      <div class="detail-grid">
        <!-- Service Info -->
        <div class="detail-main">
          <img class="detail-img" [src]="service.imageUrl" [alt]="service.serviceName" />
          <div class="category-badge">{{service.category}}</div>
          <p class="detail-desc">{{service.description}}</p>
          
          <div class="detail-meta">
            <div class="meta-item">
              <strong>Price:</strong> ${{service.price}}
            </div>
            <div class="meta-item">
              <strong>Est. Time:</strong> {{service.estimatedTime}}
            </div>
            <div class="meta-item">
              <strong>Warranty:</strong> 🛡️ {{service.warranty}}
            </div>
            <div class="meta-item">
              <strong>Rating:</strong> {{stars(service.rating)}} {{service.rating?.toFixed(1)}} ({{service.reviewCount}} reviews)
            </div>
          </div>

          <button class="btn primary" style="margin-top:1rem; padding:0.75rem 2rem">Book This Service</button>
        </div>

        <!-- Reviews Section -->
        <div class="reviews-section">
          <h3>Customer Reviews</h3>

          <!-- Write Review Form -->
          <div *ngIf="isLoggedIn" class="review-form">
            <h4>Write a Review</h4>
            <div class="star-input">
              <span *ngFor="let star of [1,2,3,4,5]" 
                    (click)="newReview.rating = star"
                    [class.active]="star <= newReview.rating"
                    class="star-btn">★</span>
            </div>
            <textarea [(ngModel)]="newReview.comment" 
                      placeholder="Share your experience with this service..." 
                      rows="4"
                      maxlength="1000"></textarea>
            <div style="text-align:right; margin-top:0.5rem">
              <button class="btn primary" (click)="submitReview()" [disabled]="!newReview.rating || !newReview.comment.trim()">
                Submit Review
              </button>
            </div>
          </div>

          <div *ngIf="!isLoggedIn" class="login-prompt">
            <p>Please <a routerLink="/login">log in</a> to write a review.</p>
          </div>

          <!-- Reviews List -->
          <div class="reviews-list">
            <div *ngIf="!reviews?.length" class="empty-reviews">No reviews yet. Be the first to review!</div>
            <div class="review-card" *ngFor="let review of reviews">
              <div class="review-header">
                <div>
                  <strong>{{review.userName}}</strong>
                  <div class="review-rating">{{stars(review.rating)}}</div>
                </div>
                <span class="review-date">{{formatDate(review.createdAt)}}</span>
              </div>
              <p class="review-comment">{{review.comment}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 1rem;
    }

    @media (max-width: 900px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
    }

    .detail-img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 1rem;
    }

    .detail-desc {
      font-size: 1.1rem;
      line-height: 1.6;
      color: #495057;
      margin: 1rem 0;
    }

    .detail-meta {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }

    .meta-item {
      font-size: 0.95rem;
    }

    .reviews-section {
      background: #fff;
      padding: 1.5rem;
      border-radius: 12px;
      border: 1px solid #e9ecef;
    }

    .reviews-section h3 {
      margin-top: 0;
      color: #0d6efd;
    }

    .review-form {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .review-form h4 {
      margin-top: 0;
      font-size: 1rem;
    }

    .star-input {
      display: flex;
      gap: 0.25rem;
      margin-bottom: 0.75rem;
    }

    .star-btn {
      font-size: 2rem;
      cursor: pointer;
      color: #ddd;
      transition: color 0.2s;
    }

    .star-btn.active {
      color: #ffb84d;
    }

    .star-btn:hover {
      color: #ffb84d;
    }

    .login-prompt {
      background: #e7f5ff;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .login-prompt a {
      color: #0d6efd;
      font-weight: 600;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .empty-reviews {
      text-align: center;
      color: #6c757d;
      padding: 2rem;
      font-style: italic;
    }

    .review-card {
      background: #fff;
      border: 1px solid #e9ecef;
      padding: 1rem;
      border-radius: 8px;
    }

    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 0.5rem;
    }

    .review-rating {
      color: #ffb84d;
      font-size: 0.9rem;
    }

    .review-date {
      font-size: 0.85rem;
      color: #6c757d;
    }

    .review-comment {
      line-height: 1.5;
      color: #495057;
      margin: 0;
    }
  `]
})
export class ServiceDetailComponent implements OnInit {
  service: any = null;
  reviews: any[] = [];
  newReview = { rating: 0, comment: '' };
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicesService: ServicesService,
    private reviewsService: ReviewsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const serviceId = this.route.snapshot.paramMap.get('id');
    if (serviceId) {
      this.loadService(serviceId);
      this.loadReviews(serviceId);
    }
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  loadService(id: string) {
    this.servicesService.list().subscribe({
      next: (services: any[]) => {
        this.service = services.find(s => s._id === id);
      }
    });
  }

  loadReviews(serviceId: string) {
    this.reviewsService.getReviewsByService(serviceId).subscribe({
      next: (reviews: any[]) => {
        this.reviews = reviews;
      },
      error: (err) => console.error('Error loading reviews:', err)
    });
  }

  submitReview() {
    if (!this.newReview.rating || !this.newReview.comment.trim()) {
      return;
    }

    const review = {
      serviceId: this.service._id,
      rating: this.newReview.rating,
      comment: this.newReview.comment.trim()
    };

    this.reviewsService.createReview(review).subscribe({
      next: (createdReview) => {
        this.reviews.unshift(createdReview);
        this.newReview = { rating: 0, comment: '' };
        // Reload service to update rating
        this.loadService(this.service._id);
        alert('Review submitted successfully!');
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        alert(err.error?.message || 'Failed to submit review');
      }
    });
  }

  stars(n: number): string {
    const full = Math.floor(n || 0);
    const half = (n - full) >= 0.5 ? 1 : 0;
    return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(Math.max(0, 5 - full - half));
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }

  goBack() {
    this.router.navigate(['/services']);
  }
}
