import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'mf-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Create Account</h2>
          <p>Join MobFix and book repairs in minutes</p>
        </div>
        
        <form (ngSubmit)="register()" class="auth-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input 
                id="name"
                type="text" 
                [(ngModel)]="name" 
                name="name"
                placeholder="John Doe"
                required 
                minlength="2"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-wrapper">
              <span class="input-icon">📧</span>
              <input 
                id="email"
                type="email" 
                [(ngModel)]="email" 
                name="email"
                placeholder="you@example.com"
                required 
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="phone">Phone Number (Optional)</label>
            <div class="input-wrapper">
              <span class="input-icon">📱</span>
              <input 
                id="phone"
                type="tel" 
                [(ngModel)]="phone" 
                name="phone"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                id="password"
                [type]="showPassword ? 'text' : 'password'" 
                [(ngModel)]="password" 
                name="password"
                placeholder="Create a strong password"
                required 
                minlength="6"
              />
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <div class="password-strength" *ngIf="password">
              <div class="strength-bar" [class]="passwordStrength"></div>
              <span class="strength-text">{{ passwordStrengthText }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input 
                id="confirmPassword"
                [type]="showPassword ? 'text' : 'password'" 
                [(ngModel)]="confirmPassword" 
                name="confirmPassword"
                placeholder="Confirm your password"
                required 
                [class.error]="confirmPassword && password !== confirmPassword"
              />
            </div>
            <small class="error-text" *ngIf="confirmPassword && password !== confirmPassword">
              Passwords do not match
            </small>
          </div>
          
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="agreeTerms" name="terms" required />
              <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
            </label>
          </div>
          
          <button 
            type="submit" 
            class="btn primary full-width" 
            [disabled]="loading || password !== confirmPassword || !agreeTerms"
          >
            <span *ngIf="!loading">Create Account</span>
            <span *ngIf="loading" class="spinner"></span>
          </button>
          
          <div class="alert success" *ngIf="message">
            <span class="alert-icon">✓</span>
            {{ message }}
          </div>
          
          <div class="alert error" *ngIf="error">
            <span class="alert-icon">⚠️</span>
            {{ error }}
          </div>
        </form>
        
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  showPassword = false;
  agreeTerms = false;
  loading = false;
  message = '';
  error = '';
  
  constructor(private auth: AuthService, private router: Router) {}
  
  get passwordStrength(): string {
    if (this.password.length < 6) return 'weak';
    if (this.password.length < 8) return 'medium';
    if (/[A-Z]/.test(this.password) && /[0-9]/.test(this.password)) return 'strong';
    return 'medium';
  }
  
  get passwordStrengthText(): string {
    const strength = this.passwordStrength;
    if (strength === 'weak') return 'Weak - Add more characters';
    if (strength === 'medium') return 'Medium - Add numbers or uppercase';
    return 'Strong password!';
  }

  register() {
    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    
    this.error = '';
    this.message = '';
    this.loading = true;
    
    this.auth.register({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = 'Account created successfully! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/services']);
        }, 500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
