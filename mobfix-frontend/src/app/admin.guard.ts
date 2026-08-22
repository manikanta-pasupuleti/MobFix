import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.auth.isAdmin()) return true;

    try {
      this.router.navigate(this.auth.isLoggedIn() ? ['/dashboard'] : ['/login']);
    } catch (e) {}

    return false;
  }
}
