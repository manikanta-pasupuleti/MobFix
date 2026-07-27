import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalService } from './confirm-modal.service';

@Component({
  selector: 'mf-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="modal.state$ | async as state" (click)="modal.dismiss()">
      <div class="modal-box" (click)="$event.stopPropagation()">
        <div class="modal-icon" [class]="state.type">
          <span *ngIf="state.type === 'danger'">⚠️</span>
          <span *ngIf="state.type === 'info'">ℹ️</span>
          <span *ngIf="state.type === 'success'">✓</span>
        </div>
        <h3>{{ state.title }}</h3>
        <p>{{ state.message }}</p>
        <div class="modal-actions">
          <button class="btn secondary" (click)="modal.dismiss()">{{ state.cancelLabel || 'Cancel' }}</button>
          <button class="btn" [class]="state.type === 'danger' ? 'danger' : 'primary'" (click)="modal.confirm()">
            {{ state.confirmLabel || 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      z-index: 2000; padding: 1rem;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal-box {
      background: white; border-radius: 16px;
      padding: 2rem; max-width: 420px; width: 100%;
      text-align: center;
      animation: popIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
    }
    @keyframes popIn {
      from { opacity: 0; transform: scale(0.85); }
      to   { opacity: 1; transform: scale(1); }
    }

    .modal-icon { font-size: 2.5rem; margin-bottom: 1rem; }

    h3 { margin: 0 0 0.5rem; font-size: 1.25rem; color: #0f172a; }
    p  { color: #64748b; margin: 0 0 1.5rem; line-height: 1.5; }

    .modal-actions { display: flex; gap: 0.75rem; justify-content: center; }
    .modal-actions .btn { min-width: 100px; }
  `]
})
export class ConfirmModalComponent {
  modal = inject(ConfirmModalService);
}
