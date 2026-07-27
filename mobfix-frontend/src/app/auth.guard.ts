import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    const token = this.auth.token;
    if (token) return true;
    // not logged in -> redirect to login
    try { this.router.navigate(['/login']); } catch (e) {}
    return false;
  }
}
