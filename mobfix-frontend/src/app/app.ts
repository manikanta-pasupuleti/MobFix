import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="mobfix-header">
      <nav>
        <a routerLink="/" class="logo">MobFix</a>
        <ul class="nav">
          <li><a routerLink="/services">Services</a></li>
          <li><a routerLink="/login">Login</a></li>
          <li><a routerLink="/register">Register</a></li>
          <li><a routerLink="/my-bookings">My Bookings</a></li>
        </ul>
      </nav>
    </header>

    <main class="mobfix-main">
      <router-outlet></router-outlet>
    </main>

    <style>
      .mobfix-header { padding: 1rem; background:#0d6efd; color:white }
      .mobfix-header .logo{ font-weight:700; color:white; text-decoration:none }
      .mobfix-header .nav{ list-style:none; display:inline-flex; gap:1rem; margin:0 0 0 2rem }
      .mobfix-header a { color: white; text-decoration: none }
      .mobfix-main{ padding:1.25rem }
    </style>
  `
})
export class App {
  protected readonly title = signal('mobfix-frontend');
}
