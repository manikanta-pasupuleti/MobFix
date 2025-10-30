import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'mf-register',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Register</h2>
    <form (submit)="register($event, name.value, email.value, password.value)">
      <label>
        Name
        <input #name required />
      </label>
      <label>
        Email
        <input #email type="email" required />
      </label>
      <label>
        Password
        <input #password type="password" required />
      </label>
      <div style="margin-top:.5rem">
        <button type="submit">Register</button>
      </div>
    </form>
    <p style="color:green" *ngIf="message">{{ message }}</p>
    <p style="color:red" *ngIf="error">{{ error }}</p>
  `,
})
export class RegisterComponent {
  message = '';
  error = '';
  constructor(private auth: AuthService, private router: Router) {}

  register(evt: Event, name: string, email: string, password: string) {
    evt.preventDefault();
    this.error = '';
    this.auth.register({ name, email, password }).subscribe({
      next: (res) => {
        this.message = 'Registered and logged in';
        this.router.navigate(['/services']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Registration failed';
      }
    });
  }
}
