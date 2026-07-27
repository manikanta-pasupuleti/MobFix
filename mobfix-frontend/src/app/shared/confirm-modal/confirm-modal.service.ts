import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModalState {
  title: string;
  message: string;
  type: 'danger' | 'info' | 'success';
  confirmLabel?: string;
  cancelLabel?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmModalService {
  private stateSubject = new BehaviorSubject<ModalState | null>(null);
  state$ = this.stateSubject.asObservable();

  private resolveFn: ((value: boolean) => void) | null = null;

  open(options: ModalState): Promise<boolean> {
    this.stateSubject.next(options);
    return new Promise(resolve => { this.resolveFn = resolve; });
  }

  confirm() {
    this.resolveFn?.(true);
    this.stateSubject.next(null);
    this.resolveFn = null;
  }

  dismiss() {
    this.resolveFn?.(false);
    this.stateSubject.next(null);
    this.resolveFn = null;
  }
}
