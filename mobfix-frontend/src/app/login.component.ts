import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'mf-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to MobFix</p>
        </div>
        
        <form (ngSubmit)="login()" class="auth-form">
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
                [class.error]="error"
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
                placeholder="Enter your password"
                required 
                [class.error]="error"
              />
              <button type="button" class="toggle-password" (click)="showPassword = !showPassword">
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>
          
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="rememberMe" name="remember" />
              <span>Remember me</span>
            </label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>
          
          <button type="submit" class="btn primary full-width" [disabled]="loading">
            <span *ngIf="!loading">Sign In</span>
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
          <p>Don't have an account? <a routerLink="/register">Create one</a></p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;
  rememberMe = false;
  loading = false;
  message = '';
  error = '';
  
  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = '';
    this.message = '';
    this.loading = true;
    
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.message = 'Login successful! Redirecting...';
        setTimeout(() => {
          this.router.navigate(['/services']);
        }, 500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Invalid email or password. Please try again.';
      }
    });
  }
}
