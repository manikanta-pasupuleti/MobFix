import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts: Toast[] = [];
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();
  private idCounter = 0;

  show(message: string, type: Toast['type'] = 'info', title?: string, duration = 4000) {
    const toast: Toast = {
      id: ++this.idCounter,
      type,
      message,
      title,
      duration
    };
    
    this.toasts.push(toast);
    this.toastsSubject.next([...this.toasts]);
    
    if (duration > 0) {
      setTimeout(() => this.remove(toast.id), duration);
    }
    
    return toast.id;
  }

  success(message: string, title = 'Success') {
    return this.show(message, 'success', title);
  }

  error(message: string, title = 'Error') {
    return this.show(message, 'error', title, 6000);
  }

  warning(message: string, title = 'Warning') {
    return this.show(message, 'warning', title);
  }

  info(message: string, title = 'Info') {
    return this.show(message, 'info', title);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastsSubject.next([...this.toasts]);
  }

  clear() {
    this.toasts = [];
    this.toastsSubject.next([]);
  }
}
