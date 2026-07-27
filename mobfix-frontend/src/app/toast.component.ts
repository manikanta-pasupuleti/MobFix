import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'mf-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of toasts$ | async" 
        class="toast" 
        [class]="toast.type"
        (click)="dismiss(toast.id)"
      >
        <div class="toast-icon">
          <span *ngIf="toast.type === 'success'">✓</span>
          <span *ngIf="toast.type === 'error'">✕</span>
          <span *ngIf="toast.type === 'warning'">⚠</span>
          <span *ngIf="toast.type === 'info'">ℹ</span>
        </div>
        <div class="toast-content">
          <div class="toast-title" *ngIf="toast.title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" (click)="dismiss(toast.id); $event.stopPropagation()">×</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 400px;
    }
    
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 12px;
      background: white;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
      border-left: 4px solid;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .toast.success {
      border-color: #22c55e;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    }
    .toast.success .toast-icon { color: #22c55e; }
    
    .toast.error {
      border-color: #ef4444;
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
    }
    .toast.error .toast-icon { color: #ef4444; }
    
    .toast.warning {
      border-color: #f59e0b;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    }
    .toast.warning .toast-icon { color: #f59e0b; }
    
    .toast.info {
      border-color: #3b82f6;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    }
    .toast.info .toast-icon { color: #3b82f6; }
    
    .toast-icon {
      font-size: 1.25rem;
      font-weight: bold;
      flex-shrink: 0;
    }
    
    .toast-content {
      flex: 1;
    }
    
    .toast-title {
      font-weight: 700;
      margin-bottom: 0.25rem;
      color: #1e293b;
    }
    
    .toast-message {
      color: #475569;
      font-size: 0.9rem;
    }
    
    .toast-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      color: #94a3b8;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
    
    .toast-close:hover {
      color: #64748b;
    }
  `]
})
export class ToastComponent {
  toasts$;
  
  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }
  
  dismiss(id: number) {
    this.toastService.remove(id);
  }
}
