import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'mf-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="home-hero">
      <div class="hero-content">
        <p class="eyebrow"><span class="eyebrow-dot"></span> Device care, made human</p>
        <h1>Bring your broken tech.<br /><em>Leave with peace of mind.</em></h1>
        <p class="hero-copy">From cracked screens to stubborn software, MobFix connects you with a skilled repair specialist and keeps you in the loop from request to ready.</p>
        <div class="hero-actions">
          <a class="btn primary large" routerLink="/services">Find my repair <span class="btn-icon">↗</span></a>
          <a class="text-link" routerLink="/services">Browse all services <span>→</span></a>
        </div>
        <div class="hero-proof">
          <div class="avatar-stack" aria-hidden="true"><span>AM</span><span>JR</span><span>SK</span><span>+</span></div>
          <p><strong>Loved by 10,000+ customers</strong><br /><span>4.9 average rating across every repair</span></p>
        </div>
      </div>
      <div class="hero-art" aria-label="A repaired smartphone ready to be collected">
        <div class="art-sun"></div>
        <div class="art-label label-top"><strong>01</strong><span>Tell us<br />what happened</span></div>
        <div class="phone-card">
          <div class="phone-speaker"></div>
          <div class="phone-screen"><span class="screen-kicker">MOBFIX / 2026</span><strong>Good as<br /><em>new.</em></strong><span class="screen-line"></span></div>
          <div class="phone-home"></div>
        </div>
        <div class="art-label label-bottom"><span class="status-check">✓</span><span>Clear quote<br />before we fix</span></div>
      </div>
    </section>

    <section class="trust-strip" aria-label="MobFix guarantees">
      <div><span class="strip-number">01</span><span><strong>Transparent quotes</strong><small>Know the price first</small></span></div>
      <div><span class="strip-number">02</span><span><strong>Skilled specialists</strong><small>Care for every device</small></span></div>
      <div><span class="strip-number">03</span><span><strong>90-day warranty</strong><small>Confidence after pickup</small></span></div>
      <a routerLink="/services">Why MobFix? <span>↗</span></a>
    </section>

    <section class="home-section service-preview">
      <div class="section-heading"><div><p class="eyebrow">What needs fixing?</p><h2>Start with the problem.</h2></div><a class="text-link" routerLink="/services">See every service <span>→</span></a></div>
      <div class="repair-grid">
        <a class="repair-tile" *ngFor="let service of popularServices" routerLink="/services">
          <span class="repair-index">{{ service.index }}</span><img [src]="service.image" [alt]="service.name" /><span class="repair-copy"><strong>{{ service.name }}</strong><small>{{ service.note }}</small></span><span class="tile-arrow">↗</span>
        </a>
      </div>
    </section>

    <section class="journey-section">
      <div class="journey-intro"><p class="eyebrow">The MobFix way</p><h2>From issue<br /><em>to invoice.</em></h2><p>You should never have to chase a repair update. We make every step visible, understandable, and yours to approve.</p><a class="btn dark" routerLink="/services">Book a repair <span>↗</span></a></div>
      <div class="journey-steps">
        <div class="journey-step" *ngFor="let step of journeySteps"><span>{{ step.number }}</span><div><strong>{{ step.title }}</strong><p>{{ step.copy }}</p></div></div>
      </div>
    </section>

    <section class="closing-cta"><p class="eyebrow">Ready when you are</p><h2>Your device deserves<br /><em>a better fix.</em></h2><a class="btn primary large" routerLink="/services">Start your repair <span>↗</span></a></section>
  `,
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;

  popularServices = [
    { index: '01', name: 'Screen replacement', note: 'Cracked, black or unresponsive display', image: 'assets/images/screen-replacement.svg' },
    { index: '02', name: 'Battery replacement', note: 'Fast drain, swelling or sudden shutdowns', image: 'assets/images/battery-replacement.svg' },
    { index: '03', name: 'Charging problems', note: 'Loose ports, slow charging or no power', image: 'assets/images/charging-port-repair.svg' },
    { index: '04', name: 'Software issues', note: 'Freezing, boot loops and app errors', image: 'assets/images/software-issues.svg' },
  ];

  journeySteps = [
    { number: '01', title: 'Describe the issue', copy: 'Tell us your device and what went wrong. Photos help, but are never required.' },
    { number: '02', title: 'Review your quote', copy: 'A specialist checks the details and you approve the estimate before work begins.' },
    { number: '03', title: 'Track the progress', copy: 'Get clear updates while your repair moves from diagnosis to ready.' },
  ];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.auth.loggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }
}
