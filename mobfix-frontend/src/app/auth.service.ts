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

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.api.baseUrl}/users/login`, credentials).pipe(
      tap((res: any) => {
        if (res?.token) {
          this.token = res.token;
          localStorage.setItem('mf_user', JSON.stringify(res.user));
          this.userSubject.next(res.user);
        }
      })
    );
  }

  register(payload: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.api.baseUrl}/users/register`, payload).pipe(
      tap((res: any) => {
        if (res?.token) {
          this.token = res.token;
          localStorage.setItem('mf_user', JSON.stringify(res.user));
          this.userSubject.next(res.user);
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
}
