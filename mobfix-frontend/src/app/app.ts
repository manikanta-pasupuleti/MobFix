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
          <span class="logo-mark" aria-hidden="true">+</span>
          <span class="logo-text">mob<span>fix</span></span>
        </a>
        <span class="header-note">Repairs, without the runaround.</span>
        <ul class="nav">
          <li><a routerLink="/services" routerLinkActive="active">Find a repair</a></li>
          <li *ngIf="isLoggedIn"><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
          <li *ngIf="isLoggedIn"><a routerLink="/my-bookings" routerLinkActive="active">My Bookings</a></li>
          <li *ngIf="isAdmin"><a routerLink="/admin" routerLinkActive="active">Admin</a></li>
          <li *ngIf="!isLoggedIn"><a routerLink="/login" routerLinkActive="active" class="nav-btn">Log in</a></li>
          <li *ngIf="!isLoggedIn"><a routerLink="/register" routerLinkActive="active" class="nav-btn primary">Start a repair</a></li>
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
          <span class="logo-mark" aria-hidden="true">+</span>
          <span>mob<span>fix</span></span>
        </div>
        <div class="footer-links">
          <a routerLink="/services">Services</a>
          <a routerLink="/register">Create account</a>
          <a routerLink="/login">Log in</a>
        </div>
        <div class="footer-copy">© 2026 MobFix. Clear repairs, better care.</div>
      </div>
    </footer>

    <mf-toast></mf-toast>
    <mf-confirm-modal></mf-confirm-modal>

    <style>
      :host { display: flex; flex-direction: column; min-height: 100vh; }

      .mobfix-header {
        padding: 1rem 1.5rem;
        background: #111b19;
        color: #f7f6f0;
        display: flex;
        align-items: center;
        box-shadow: 0 1px 0 rgba(255,255,255,0.08);
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
        color: #f7f6f0;
        text-decoration: none;
        font-size: 1.55rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .logo-mark {
        width: 30px;
        height: 30px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #c7f36b;
        color: #111b19;
        font-size: 1.45rem;
        font-weight: 800;
        line-height: 1;
      }

      .logo-text span, .footer-brand span span { color: #c7f36b; }

      .header-note {
        margin-left: 2rem;
        color: rgba(247,246,240,0.58);
        font-size: 0.82rem;
        letter-spacing: 0.02em;
      }

      .mobfix-header .nav {
        list-style: none;
        display: inline-flex;
        gap: 0.5rem;
        margin: 0 0 0 auto;
        align-items: center;
        padding: 0;
      }

      .mobfix-header a {
        color: rgba(247,246,240,0.72);
        text-decoration: none;
        transition: all 0.2s;
        padding: 0.5rem 0.75rem;
        border-radius: 999px;
        font-weight: 500;
      }

      .mobfix-header a:hover,
      .mobfix-header a.active {
        color: #f7f6f0;
        background: rgba(255,255,255,0.09);
      }

      .nav-btn { border: 1px solid rgba(247,246,240,0.22) !important; }

      .nav-btn.primary {
        background: #c7f36b !important;
        color: #111b19 !important;
        font-weight: 600 !important;
      }

      .nav-btn.primary:hover { background: #dcff91 !important; }

      .user-menu { display: flex; align-items: center; gap: 0.5rem; }

      .user-avatar {
        width: 32px;
        height: 32px;
        background: rgba(199,243,107,0.2);
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
        background: #111b19;
        color: rgba(247,246,240,0.6);
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

      .footer-brand { display: flex; align-items: center; gap: 0.5rem; font-weight: 700; color: #f7f6f0; }

      .footer-links { display: flex; gap: 1.5rem; }

      .footer-links a { color: rgba(247,246,240,0.6); text-decoration: none; transition: color 0.2s; }
      .footer-links a:hover { color: #c7f36b; }

      .footer-copy { font-size: 0.875rem; }

      @media (max-width: 768px) {
        .mobfix-header nav { flex-wrap: wrap; }
        .header-note { display: none; }
        .mobfix-header .nav { width: 100%; margin-top: 0.75rem; justify-content: center; }
        .footer-content { flex-direction: column; text-align: center; }
      }
    </style>
  `
})
export class App implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  userInitial = '';

  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  constructor() {
    this.authService.loggedIn$
      .pipe(takeUntilDestroyed())
      .subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
        this.isAdmin = loggedIn && this.authService.isAdmin();
      });

    this.authService.user$
      .pipe(takeUntilDestroyed())
      .subscribe(user => {
        this.isAdmin = !!user && this.authService.isAdmin();
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
