import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './core/api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private api = inject(ApiService);

  private loggedInSubject = new BehaviorSubject<boolean>(!!this.getToken());
  public loggedIn$ = this.loggedInSubject.asObservable();

  private userSubject = new BehaviorSubject<any>(this.getStoredUser());
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.syncUserRoleFromToken();
  }

  private getToken(): string | null {
    return localStorage.getItem('mf_token');
  }

  private getStoredUser(): any {
    try {
      const u = localStorage.getItem('mf_user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  }

  get token(): string | null {
    return this.getToken();
  }

  set token(value: string | null) {
    if (value) {
      localStorage.setItem('mf_token', value);
    } else {
      localStorage.removeItem('mf_token');
    }
    this.loggedInSubject.next(!!value);
  }

  get currentUser(): any {
    return this.userSubject.value;
  }

  private decodeTokenPayload(token: string): any | null {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  }

  private syncUserRoleFromToken() {
    const token = this.getToken();
    const user = this.getStoredUser();
    if (!token || !user || user.role) return;

    const payload = this.decodeTokenPayload(token);
    const role = payload?.role;
    if (!role) return;

    const enrichedUser = { ...user, role };
    localStorage.setItem('mf_user', JSON.stringify(enrichedUser));
    this.userSubject.next(enrichedUser);
  }

  private normalizeUserWithRole(user: any, token: string): any {
    const payload = this.decodeTokenPayload(token);
    return { ...user, role: user?.role || payload?.role || 'user' };
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.api.baseUrl}/users/login`, credentials).pipe(
      tap((res: any) => {
        if (res?.token) {
          this.token = res.token;
          const normalizedUser = this.normalizeUserWithRole(res.user || {}, res.token);
          localStorage.setItem('mf_user', JSON.stringify(normalizedUser));
          this.userSubject.next(normalizedUser);
        }
      })
    );
  }

  register(payload: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.api.baseUrl}/users/register`, payload).pipe(
      tap((res: any) => {
        if (res?.token) {
          this.token = res.token;
          const normalizedUser = this.normalizeUserWithRole(res.user || {}, res.token);
          localStorage.setItem('mf_user', JSON.stringify(normalizedUser));
          this.userSubject.next(normalizedUser);
        }
      })
    );
  }

  logout() {
    this.token = null;
    localStorage.removeItem('mf_user');
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUser;
    if (user?.role) return user.role === 'admin';

    const token = this.getToken();
    if (!token) return false;

    const payload = this.decodeTokenPayload(token);
    return payload?.role === 'admin';
  }
}
