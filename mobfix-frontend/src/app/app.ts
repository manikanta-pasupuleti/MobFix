import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service';
import { ToastComponent } from './toast.component';
import { ToastService } from './toast.service';
import { ConfirmModalComponent } from './shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent, ConfirmModalComponent],
  template: `
    <header class="mobfix-header">
      <nav>
        <a routerLink="/" class="logo">
          <span class="logo-icon">📱</span>
          <span class="logo-text">MobFix</span>
        </a>
        <ul class="nav">
          <li><a routerLink="/services" routerLinkActive="active">Services</a></li>
          <li *ngIf="isLoggedIn"><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
          <li *ngIf="isLoggedIn"><a routerLink="/my-bookings" routerLinkActive="active">My Bookings</a></li>
          <li *ngIf="!isLoggedIn"><a routerLink="/login" routerLinkActive="active" class="nav-btn">Login</a></li>
          <li *ngIf="!isLoggedIn"><a routerLink="/register" routerLinkActive="active" class="nav-btn primary">Sign Up</a></li>
          <li *ngIf="isLoggedIn" class="user-menu">
            <span class="user-avatar">{{ userInitial }}</span>
            <a href="#" (click)="logout($event)" class="logout-btn">Logout</a>
          </li>
        </ul>
      </nav>
    </header>

    <main class="mobfix-main">
      <router-outlet></router-outlet>
    </main>

    <footer class="mobfix-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="logo-icon">📱</span>
          <span>MobFix</span>
        </div>
        <div class="footer-links">
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
        </div>
        <div class="footer-copy">© 2025 MobFix. All rights reserved.</div>
      </div>
    </footer>

    <mf-toast></mf-toast>
    <mf-confirm-modal></mf-confirm-modal>

    <style>
      :host { display: flex; flex-direction: column; min-height: 100vh; }

      .mobfix-header {
        padding: 0.75rem 1.5rem;
        background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
        color: white;
        display: flex;
        align-items: center;
        box-shadow: 0 2px 12px rgba(13,110,253,0.2);
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .mobfix-header nav {
        display: flex;
        align-items: center;
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
      }

      .mobfix-header .logo {
        font-weight: 800;
        color: white;
        text-decoration: none;
        font-size: 1.4rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .logo-icon { font-size: 1.5rem; }

      .mobfix-header .nav {
        list-style: none;
        display: inline-flex;
        gap: 0.5rem;
        margin: 0 0 0 auto;
        align-items: center;
        padding: 0;
      }

      .mobfix-header a {
        color: rgba(255,255,255,0.9);
        text-decoration: none;
        transition: all 0.2s;
        padding: 0.5rem 0.75rem;
        border-radius: 8px;
        font-weight: 500;
      }

      .mobfix-header a:hover,
      .mobfix-header a.active {
        color: white;
        background: rgba(255,255,255,0.15);
      }

      .nav-btn { border: 1px solid rgba(255,255,255,0.3) !important; }

      .nav-btn.primary {
        background: white !important;
        color: #0d6efd !important;
        font-weight: 600 !important;
      }

      .nav-btn.primary:hover { background: #f8f9fa !important; }

      .user-menu { display: flex; align-items: center; gap: 0.5rem; }

      .user-avatar {
        width: 32px;
        height: 32px;
        background: rgba(255,255,255,0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.9rem;
      }

      .logout-btn { cursor: pointer; font-weight: 500; color: rgba(255,255,255,0.8) !important; }

      .mobfix-main {
        padding: 1.5rem;
        flex: 1;
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
      }

      .mobfix-footer {
        background: #1e293b;
        color: #94a3b8;
        padding: 2rem 1.5rem;
        margin-top: auto;
      }

      .footer-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .footer-brand { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: white; }

      .footer-links { display: flex; gap: 1.5rem; }

      .footer-links a { color: #94a3b8; text-decoration: none; transition: color 0.2s; }
      .footer-links a:hover { color: white; }

      .footer-copy { font-size: 0.875rem; }

      @media (max-width: 768px) {
        .mobfix-header nav { flex-wrap: wrap; }
        .mobfix-header .nav { width: 100%; margin-top: 0.75rem; justify-content: center; }
        .footer-content { flex-direction: column; text-align: center; }
      }
    </style>
  `
})
export class App implements OnInit {
  isLoggedIn = false;
  userInitial = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  constructor() {
    this.authService.loggedIn$
      .pipe(takeUntilDestroyed())
      .subscribe(loggedIn => { this.isLoggedIn = loggedIn; });

    this.authService.user$
      .pipe(takeUntilDestroyed())
      .subscribe(user => {
        this.userInitial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'U');
      });
  }

  ngOnInit() {}

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.toast.success('You have been logged out successfully');
    this.router.navigate(['/']);
  }
}
