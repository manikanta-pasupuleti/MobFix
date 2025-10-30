import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'mf-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Login</h2>
    <form (submit)="login($event, email.value, password.value)">
      <label>
        Email
        <input #email type="email" required />
      </label>
      <label>
        Password
        <input #password type="password" required />
      </label>
      <div style="margin-top:.5rem">
        <button type="submit">Login</button>
      </div>
    </form>
    <p style="color:green" *ngIf="message">{{ message }}</p>
    <p style="color:red" *ngIf="error">{{ error }}</p>
  `,
})
export class LoginComponent {
  message = '';
  error = '';
  constructor(private auth: AuthService, private router: Router) {}

  login(evt: Event, email: string, password: string) {
    evt.preventDefault();
    this.error = '';
    this.auth.login({ email, password }).subscribe({
      next: (res) => {
        this.message = 'Logged in';
        // navigate to services
        this.router.navigate(['/services']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Login failed';
      }
    });
  }
}
