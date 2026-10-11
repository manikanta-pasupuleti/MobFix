import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class TechnicianGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    const role = this.auth.currentUser?.role;
    if (role === 'technician' || role === 'admin') return true;
    this.router.navigate(this.auth.isLoggedIn() ? ['/dashboard'] : ['/login']);
    return false;
  }
}
