import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <header class="mobfix-header">
      <nav>
        <a routerLink="/" class="logo">MobFix</a>
        <ul class="nav">
          <li><a routerLink="/services">Services</a></li>
          <li *ngIf="authService.isLoggedIn()"><a routerLink="/dashboard">Dashboard</a></li>
          <li *ngIf="authService.isLoggedIn()"><a routerLink="/my-bookings">My Bookings</a></li>
          <li *ngIf="!authService.isLoggedIn()"><a routerLink="/login">Login</a></li>
          <li *ngIf="!authService.isLoggedIn()"><a routerLink="/register">Register</a></li>
          <li *ngIf="authService.isLoggedIn()">
            <a href="#" (click)="logout($event)" class="logout-btn">Logout</a>
          </li>
        </ul>
      </nav>
    </header>

    <main class="mobfix-main">
      <router-outlet></router-outlet>
    </main>

    <style>
      .mobfix-header { padding: 1rem; background:#0d6efd; color:white; display: flex; align-items: center }
      .mobfix-header nav { display: flex; align-items: center; width: 100% }
      .mobfix-header .logo{ font-weight:700; color:white; text-decoration:none; font-size: 1.5rem }
      .mobfix-header .nav{ list-style:none; display:inline-flex; gap:1rem; margin:0 0 0 2rem; align-items: center }
      .mobfix-header a { color: white; text-decoration: none; transition: opacity 0.2s }
      .mobfix-header a:hover { opacity: 0.8 }
      .logout-btn { cursor: pointer; font-weight: 600 }
      .mobfix-main{ padding:1.25rem }
    </style>
  `
})
export class App {
  protected readonly title = signal('mobfix-frontend');

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(event: Event) {
    event.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
      this.router.navigate(['/']);
    }
  }
}
