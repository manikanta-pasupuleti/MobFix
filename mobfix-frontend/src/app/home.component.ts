import { Component } from '@angular/core';

@Component({
  selector: 'mf-home',
  standalone: true,
  template: `
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-copy">
          <h1 class="hero-title">Welcome to MobFix</h1>
          <p class="hero-subtitle">Fast, reliable mobile repairs — book a certified technician in minutes. We handle screens, batteries, water damage, and more with same-day options and warranty-backed parts.</p>
          <div class="hero-cta">
            <a class="btn primary" routerLink="/services">Browse Services</a>
            <a class="btn secondary" routerLink="/register" style="margin-left:0.5rem">Create Account</a>
          </div>
        </div>
        <div class="hero-features">
          <div class="feature"><strong>✓</strong> Quick turnaround</div>
          <div class="feature"><strong>✓</strong> Certified technicians</div>
          <div class="feature"><strong>✓</strong> Parts warranty</div>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {}
